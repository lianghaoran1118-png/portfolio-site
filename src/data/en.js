// ============================================================
// 英文内容配置文件（与 content.js 导出结构完全一致）
// 语言切换由 src/i18n.js 管理，无需修改本文件结构
// ============================================================

export const profile = {
  name: 'Liang Haoran',
  role: "Master's in Business Analytics · IT Data Development Intern",
  tagline: 'Using data and AI to solve real business problems',
  intro:
    "Master's student in Business Analytics at the University of Macau, with a combined background in economics, statistics and data analysis. Built the ARDashboard accounts-receivable management dashboard end-to-end at Maxcess (a foreign company), gaining hands-on experience in ERP data extraction, MySQL data modeling and FastAPI/Vue dashboard delivery; also worked as a data analyst intern at Baidu and Industrial Bank. Proficient in SQL and Python/Pandas, familiar with regression and classification modeling. Applying an AI product mindset with tools like CodeBuddy and Codex to drive requirement decomposition, Agent collaboration workflows and prompt engineering, re-engineering the SQL, ETL and full-stack delivery pipeline with AI for multi-fold efficiency gains.",
  location: 'Yangtze River Delta · Chengdu',
  industries: ['Banking', 'Foreign Companies'],
  email: 'Lianghaoran1118@163.com',
  phone: '15168693637',
  github: '',
  linkedin: '',
  resumeUrl: 'resume/resume_en.pdf', // 英文模式下载英文简历
}

export const jobIntent = [
  'Data Analyst',
  'Data Development',
  'Business Analyst',
  'AI Business Analyst',
  'AI Product Manager',
]

// ---------------- Projects ----------------
export const projects = [
  {
    id: 'ar-dashboard',
    tag: 'Corporate Internship · Full-stack BI',
    status: 'Deployed on intranet',
    title: 'ARDashboard (AR Collection) Accounts-Receivable Dashboard',
    desc: 'A full-stack accounts-receivable dashboard (V2.0 backend / V3 frontend POC): data is synced from ERP to a MySQL prod database by a separate ETL project; FastAPI + SQLAlchemy provides JSON APIs; the Vue3 SPA is served via Nginx. Features include customer aggregation, 7 aging buckets, overdue determination, DSO, collection actions, currency-grouped summary tables, customer drill-down, report charts and settings management across four pages.',
    tech: ['Python', 'FastAPI', 'SQLAlchemy 2.0', 'MySQL', 'Vue3', 'TypeScript', 'Element Plus', 'ECharts', 'Pinia', 'Nginx'],
    images: [
      { label: 'Collection', src: 'images/demo-arboard-collection.png' },
      { label: 'Receipts (Net/Refund col)', src: 'images/demo-arboard-receipts.png' },
      { label: 'Reports (DSO + Aging)', src: 'images/demo-arboard-reports.png' },
      { label: 'Settings (period switch)', src: 'images/demo-arboard-settings.png' },
    ],
    imageLabel: 'ARDashboard demo · Collection page',
    imageSrc: 'images/demo-arboard-collection.png',
    codeTitle: 'main.py · backend entry (demo)',
    codeLang: 'python',
    codes: [
      {
        label: 'Backend entry',
        title: 'main.py · backend entry',
        lang: 'python',
        code: `# main.py — AR Collection V2.0 backend entry (demo mode)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware

app = FastAPI(title="AR Collection V2.0", version="2.0.0")

# 1. No-cache middleware
class NoCacheMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        path = request.url.path
        if path.endswith(".html") or path == "/" or \\
           "." not in path.rsplit("/", 1)[-1]:
            response.headers["Cache-Control"] = \\
                "no-store, no-cache, must-revalidate, max-age=0"
        return response

app.add_middleware(NoCacheMiddleware)

# 2. CORS
app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_credentials=True, allow_methods=["*"],
                   allow_headers=["*"])

# 3. Register 9 API routers (incl. refunds)
from routers.actions import router as actions_router
from routers.ardet import router as ardet_router
from routers.refunds import router as refunds_router
app.include_router(actions_router)
app.include_router(ardet_router)
app.include_router(dashboard_router)
app.include_router(customers_router)
app.include_router(settings_router)
app.include_router(receipts_router)
app.include_router(refunds_router)
app.include_router(collection_router)
app.include_router(trend_router)

# 4. Demo mode: AR_DEMO=1 switches to the SQLite demo DB
import os
if os.getenv("AR_DEMO") == "1":
    from database import init_demo_db
    init_demo_db()

# 5. Health check
@app.get("/api/health")
def health():
    from database import engine
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"status": "ok", "db": "connected", "demo": True}

# 6. SPA fallback
@app.get("/{path:path}")
def spa_fallback(path: str):
    return FileResponse("static/index.html")`,
      },
      {
        label: 'DSO calculation',
        title: 'services/dso.py · DSO pure function',
        lang: 'python',
        code: `# DSO (Days Sales Outstanding) calculation
# Formula: DSO = AR x 3-month days / 3-month revenue
from decimal import Decimal


def compute_dso(ar_total: Decimal,
                revenue_3m: Decimal,
                days_3m: int) -> float:
    """
    ar_total:   AR balance
    revenue_3m: 3-month revenue (credit - debit, accounts starting with 4)
    days_3m:    total accounting days of the three periods
    """
    if revenue_3m > 0 and days_3m > 0:
        return round(float(ar_total / revenue_3m * days_3m), 1)
    return 0.0`,
      },
      {
        label: 'Aging structure',
        title: 'routers/dashboard.py · aging aggregation',
        lang: 'python',
        code: `# Aging structure: group by sales_rep + customer detail
BUCKETS = ["uninvoiced", "not_due", "due",
           "od_30", "od_60", "od_90", "od_91"]

@router.get("/aging-structure", response_model=AgingStructureOut)
def aging_structure(org: str | None = Query(None), db=Depends(get_db)):
    snap = db.query(ReceivableSnapshot).order_by(
        ReceivableSnapshot.year.desc(),
        ReceivableSnapshot.period.desc()).first()
    if not snap:
        return {"data": {}, "snapshot_year": 0, "snapshot_period": 0}

    rows = db.query(
        ReceivableSnapshot.sales_rep,
        ReceivableSnapshot.customer_name,
        *[func.sum(getattr(ReceivableSnapshot, b)).label(b)
          for b in BUCKETS],
        func.sum(ReceivableSnapshot.total).label("total"),
    ).filter(
        ReceivableSnapshot.year == snap.year,
        ReceivableSnapshot.period == snap.period,
    ).group_by(
        ReceivableSnapshot.sales_rep,
        ReceivableSnapshot.customer_name,
    ).all()
    # Build rep -> {totals, customers:[]} structure
    rep_data = {}
    for r in rows:
        rep = r[0] or "Unknown"
        # ... accumulate bucket amounts
    return {"data": rep_data}`,
      },
      {
        label: 'Refunds',
        title: 'routers/refunds.py · refund link',
        lang: 'python',
        code: `# Refunds API — /api/refunds (separate ar_refund DB)
# Fully isolated from the main prod DB; does not affect existing logic
@router.get("", response_model=RefundOut)
def list_refunds(period_from: str | None = Query(None),
                 period_to: str | None = Query(None),
                 customer: str | None = Query(None),
                 db: Session = Depends(get_refund_db)):
    """Refund list (aggregated by refund bill no., one row per bill)"""
    conditions = ["1=1"]
    params: dict = {}
    if period_to:
        conditions.append("b.FDate <= :period_to")
        params["period_to"] = period_to
    if customer:
        conditions.append("b.FCONTACTUNIT_FName LIKE :customer")
        params["customer"] = f"%{customer}%"

    where = " AND ".join(conditions)
    sql = f"""
        SELECT b.FBillNo AS refund_no,
               b.FDate AS refund_date,
               b.FCONTACTUNIT_FName AS cust_name,
               b.FREFUNDTOTALAMOUNTFOR AS refund_amt,
               b.FSRCBILLNO AS source_receipt_no,
               SUM(b.FREFUNDAMOUNTFOR_E) AS entry_refund_amt
        FROM ar_refund_bill b
        WHERE {where}
        GROUP BY b.FBillNo, b.FDate, b.FCONTACTUNIT_FName,
                 b.FREFUNDTOTALAMOUNTFOR, b.FSRCBILLNO
        ORDER BY b.FDate DESC LIMIT 500
    """
    rows = db.execute(text(sql), params).mappings().all()
    return {"data": [dict(r) for r in rows],
            "count": len(rows)}`,
      },
    ],
    results: [
      'FastAPI + SQLAlchemy delivered 8 router modules with ~30 APIs: customer aggregation, aging structure, DSO/aging trends, receipts, collection actions, settings, etc. (demo also includes refunds)',
      'Vue3 + TypeScript + Element Plus + ECharts implemented 4 pages: Collection / Receipts / Reports / Settings',
      'Core tables use a "single-table multi-group + subtotal/total row injection" pattern: grouped by currency with original-currency subtotals, USD conversion and a Grand Total row auto-injected',
      'Implemented 7 aging buckets, multi-currency USD conversion, DSO (AR balance x 3-period days / 3-period revenue), customer detail drawer (Invoiced/Unbilled/Prepayment/Credit + Net Exposure) and collection action tracking',
      'Deployed on the intranet via Nginx for finance & sales; ships with an offline demo (SQLite + mock data) for interviews',
    ],
  },
  {
    id: 'erp-etl',
    tag: 'ERP · ETL extraction',
    status: 'Standalone toolkit',
    title: 'Kingdee Cloud API Extraction & MySQL Data Modeling (ETL)',
    desc: 'Built a reusable Kingdee Cloud -> MySQL extraction toolkit: uses Kingdee OpenAPI auth and ExecuteBillQuery for document queries, with field mapping, auto-pagination, de-duplication and incremental upsert loading. Configured via a template so any document type (AR, receipts, shipments, material receipts, orders) can be adapted by editing only FORM_CONFIG.',
    tech: ['Python', 'Kingdee OpenAPI', 'MySQL', 'ETL', 'Data modeling', 'upsert dedup', 'requests'],
    imageLabel: 'MySQL Workbench · prod.ar_receip AR receipt table',
    imageSrc: 'images/demo-etl-mysql-ar_receip.png',
    images: [
      { label: 'prod.ar_receip AR receipt', src: 'images/demo-etl-mysql-ar_receip.png' },
      { label: 'ar_refund.ar_refund_bill refund', src: 'images/demo-etl-mysql-ar_refund.png' },
    ],
    codes: [
      {
        label: 'API client',
        title: 'api_client.py · Kingdee API client',
        lang: 'python',
        code: `# Kingdee Cloud OpenAPI client (login + bill query)
class K3ApiClient:
    def login(self) -> bool:
        # Login auth, get session cookie, with auto-retry
        url = f"{self.base_url}/Kingdee.BOS.WebApi."
              "ServicesStub.AuthService.ValidateUser.common.kdsvc"
        payload = {"acctid": self.acct_id, "username": self.username,
                   "password": self.password, "lcid": self.lcid}
        resp = self.session.post(url, data=json.dumps(payload),
                                 headers={"Content-Type": "application/json"})
        if resp.status_code == 200:
            self._cookies = resp.cookies
            return True
        raise Exception("Kingdee API login failed")

    def execute_bill_query(self, form_id, field_keys,
                           filter_string="", limit=None):
        # Paginate via ExecuteBillQuery: count(1) rows first, then page by StartRow
        total = self.execute_bill_query_count(form_id, filter_string)
        all_rows, start_row = [], 0
        while start_row < total:
            rows = self._post_query(form_id, field_keys,
                                    filter_string, start_row, self.page_size)
            # Flatten dict values + de-dup on page head
            all_rows += [self._flatten_row(r) for r in rows]
            start_row += self.page_size
        return all_rows`,
      },
      {
        label: 'Extraction template',
        title: 'sync_template.py · generic extraction config',
        lang: 'python',
        code: `# Generic extraction template: adapt any bill by editing FORM_CONFIG
FORM_CONFIG = {
    "form_id": "PUR_ReceiveBill",     # Kingdee FormId
    # Field mapping: Kingdee FieldKey -> MySQL column
    "field_mapping": {
        "FBillNo": "FBillNo",                          # Bill number
        "FDate": "FDate",                              # Bill date
        "FSupplierId.FNumber": "FSupplierId_FNumber",  # Supplier code
        "FSupplierId.FName": "FSupplierId_FName",      # Supplier name
        "FStockOrgId.FNumber": "FStockOrgId_FNumber",  # Stock org
        "FDetailEntity_FEntryID": "FEntryID",          # Entry line no.
        "FMaterialId.FNumber": "FMaterialId_FNumber",  # Material code
        "FActReceiveQty": "FActReceiveQty",            # Received qty
        "FAmount_LC": "FAmount_LC",                    # Amount (LC)
        "FApproveDate": "FApproveDate",                # Approval date
    },
    "table_name": "pur_receive_bill",   # MySQL table
    "unique_keys": ["FBillNo", "FEntryID"],  # upsert dedup keys
    "bill_no_prefix": "IN",             # Bill number prefix filter
    "extra_filter": ["FDocumentStatus = 'C'", "FCancelStatus = 'A'"],
}`,
      },
      {
        label: 'Incremental upsert',
        title: 'sync_template.py · upsert into MySQL',
        lang: 'python',
        code: `# Incremental load: INSERT ... ON DUPLICATE KEY UPDATE
insert_sql = f"""
    INSERT INTO {table_name} ({", ".join(mysql_columns)}, sync_time)
    VALUES ({", ".join(["%s"] * (len(mysql_columns) + 1))})
    ON DUPLICATE KEY UPDATE
      {", ".join(f"{c}=VALUES({c})" for c in mysql_columns)},
      sync_time = VALUES(sync_time)
"""
# Batch write (500 rows per batch)
batch = []
for row in raw_rows:
    if bill_prefix and not str(row[billno_idx]).startswith(bill_prefix):
        continue
    batch.append(clean(row))
    if len(batch) >= 500:
        cursor.executemany(insert_sql, batch)
        conn.commit()
        batch = []`,
      },
      {
        label: 'DDL',
        title: 'init_tables.sql · MySQL table design',
        lang: 'sql',
        code: `-- AR receivable target table design (MySQL) example
CREATE TABLE IF NOT EXISTS ar_receivable (
    FBillNo          VARCHAR(80)  NOT NULL,   -- AR bill no.
    FEntryID         INT          NOT NULL,   -- Entry line no.
    FDate            DATE,                    -- Bill date
    FCustomerId_FNumber VARCHAR(60),          -- Customer code
    FCustomerId_FName  VARCHAR(255),          -- Customer name
    FCurrencyId_FName  VARCHAR(40),           -- Currency
    FAmount_LC       DECIMAL(18,6),           -- Amount (LC)
    FExchangeRate    DECIMAL(18,6),           -- Exchange rate
    sync_time        DATETIME,                -- Sync time
    PRIMARY KEY (FBillNo, FEntryID)           -- matches unique_keys
) COMMENT 'AR receivable extraction table';`,
      },
    ],
    results: [
      'Wrapped the Kingdee Cloud OpenAPI client: login auth, ExecuteBillQuery, count pagination, auto re-login on session loss, and auto-retry',
      'Generic extraction template: adapt any bill by editing only FORM_CONFIG (form ID / field mapping / table name / unique keys) - reused as a toolkit',
      'MySQL data modeling: designed AR, receipts, shipments, GL tables with "bill no. + entry line" unique keys, upsert de-dup and incremental loading',
      'For truncation-prone bill detail lines, used batch IN queries by bill number with per-bill fallback, ensuring millions of detail rows are not lost',
      'Optimized for API rate limits (500 req/min): batch IN queries + auto-retry keep large tables syncing stably',
    ],
  },
  {
    id: 'rag-agent',
    tag: 'AI · RAG Demo',
    status: 'Runnable demo',
    title: 'Resume RAG-Agent (AI Demo Project)',
    desc: 'Built a resume Q&A RAG Agent with FastAPI + Chroma for resume Q&A and mock interviews. Three-stage design of system prompt + vector retrieval + LLM generation demonstrates the complete RAG flow. (This site is static and does not provide live chat; the core system prompt and demo recording placeholders are shown below.)',
    tech: ['Python', 'FastAPI', 'Chroma', 'RAG', 'Prompt Engineering'],
    imageLabel: 'Demo recording screenshot',
    imageSrc: '',
    results: [
      'Built the resume knowledge base and Chroma vector retrieval',
      'Designed and iterated the core system prompt to control answer quality',
      'Runnable resume Q&A / mock interview demo',
    ],
    codeTitle: 'Core system prompt',
    codeLang: 'text',
    code: `You are a senior HR interview assistant answering questions based
on the candidate's resume knowledge base.

[WORKING RULES]
1. Answer strictly from the retrieved resume fragments; do not fabricate;
2. Give the conclusion first, then key details, in bullet points;
3. If the knowledge base has no basis, clearly state
   "No relevant information found in the resume";
4. Answer in English, professional and concise.

[EXAMPLE]
Q: What is your data analysis experience?
A: Based on the resume:
   1) Full-stack development of ARDashboard (AR Collection dashboard);
   2) Data analysis internship at Baidu;
   3) Kingdee ERP data integration and extraction practice.`,
  },
  {
    id: 'maven-fuzzy',
    tag: 'Course Project · SQL Analysis',
    status: 'Data analysis',
    title: 'MavenFuzzyFactory E-commerce Behavior & Conversion Analysis',
    desc: 'SQL data analysis on the Maven Fuzzy Factory e-commerce database covering website traffic, user behavior paths, page conversion efficiency and marketing channels: channel quality assessment, landing-page A/B testing and full-funnel conversion analysis.',
    tech: ['SQL', 'CTE', 'Window functions', 'A/B testing', 'Funnel analysis'],
    imageLabel: 'Channel conversion chart screenshot',
    imageSrc: '',
    results: [
      'Broke down session, order and CVR performance across gsearch / bsearch channels to support budget allocation decisions',
      'A/B tested /home vs /lander-1 landing pages, quantifying bounce-rate improvement of the new page',
      'Built a Home -> Product -> Cart -> Payment funnel to identify key drop-off points',
    ],
    codeTitle: 'Landing page A/B test SQL example',
    codeLang: 'sql',
    code: `-- Build landing-page session set and compute bounce rate
WITH sessions AS (
    SELECT website_session_id,
           MIN(website_pageview_id) AS first_pageview_id,
           COUNT(*) AS pageviews
    FROM website_pageviews
    WHERE created_at < '2012-07-28'
    GROUP BY website_session_id
)
SELECT COUNT(*) AS total_sessions,
       SUM(CASE WHEN pageviews = 1 THEN 1 ELSE 0 END) AS bounced_sessions,
       SUM(CASE WHEN pageviews = 1 THEN 1 ELSE 0 END) / COUNT(*) AS bounce_rate
FROM sessions;`,
  },
  {
    id: 'search-click',
    tag: 'Baidu Internship · Machine Learning',
    status: 'Analysis report',
    title: 'Analysis of Factors Influencing Search Click Behavior',
    desc: 'Built a click-behavior analysis framework on Baidu search logs: cleaned 100K log rows and engineered features with Python/Pandas, then used logistic regression to analyze CTR drivers and produced a phased analysis report to support search-funnel optimization.',
    tech: ['Python', 'Pandas', 'Logistic Regression', 'Feature engineering', 'Model evaluation'],
    imageLabel: 'Model analysis chart screenshot',
    imageSrc: '',
    results: [
      'Cleaned 100K search-behavior log rows covering 18 fields and engineered ranking / device / traffic-source features',
      'Built a logistic regression model and evaluated it with accuracy / recall / AUC to identify the key CTR drivers',
      'Delivered 10 visualization charts and one phased analysis report',
    ],
    codeTitle: 'Logistic regression example',
    codeLang: 'python',
    code: `# Binary classification modeling of click behavior
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, classification_report

model = LogisticRegression(max_iter=500)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))
print("AUC:", roc_auc_score(y_test, model.predict_proba(X_test)[:, 1]))`,
  },
]

// ---------------- Skills ----------------
export const skills = {
  groups: [
    {
      title: 'Programming Languages',
      summary: 'Python / SQL first, R for statistics, Vue3 front-end experience',
      icon: 'code',
    },
    {
      title: 'Tools & Frameworks',
      summary: 'FastAPI · MySQL · ERP System · Pandas · Tableau',
      icon: 'database',
    },
    {
      title: 'Business Capabilities',
      summary: 'Finance digitalization · User behavior analysis · ML modeling · Prompt / RAG',
      icon: 'sparkles',
    },
  ],
  languages: [
    { name: 'Python', level: 'Proficient', pct: 90 },
    { name: 'SQL', level: 'Proficient', pct: 88 },
    { name: 'Vue3 / JavaScript', level: 'Working', pct: 65 },
    { name: 'R', level: 'Working', pct: 55 },
  ],
  tools: [
    'FastAPI + SQLAlchemy',
    'MySQL',
    'Vue3 + ECharts',
    'Kingdee K3 / Cloud API',
    'Pandas / NumPy',
    'Matplotlib / Seaborn',
    'Tableau',
    'Git',
    'AI coding tools (CodeBuddy / Codex)',
  ],
  business: [
    {
      title: 'Finance Digitalization',
      desc: 'AR dashboard: aging buckets, overdue rules, prepayment write-off and DSO metrics',
    },
    {
      title: 'BI Dashboard Development',
      desc: 'Requirement analysis, data modeling, API development, QA verification and bug closure',
    },
    {
      title: 'User Behavior Analysis',
      desc: 'Conversion funnels, channel analysis and user segmentation in search / e-commerce',
    },
    {
      title: 'Machine Learning Modeling',
      desc: 'Regression / classification, feature engineering and model evaluation (XGBoost, logistic regression)',
    },
    {
      title: 'Prompt Engineering & Basic RAG',
      desc: 'System prompt design for the resume Q&A Agent and Chroma vector-retrieval practice',
    },
  ],
}

// ---------------- About: Education ----------------
export const education = [
  {
    school: 'University of Macau',
    degree: 'MSc in Business Analytics',
    period: '2025.08 - 2027.07',
    detail:
      'Faculty of Business Administration · GPA 3.7/4.0 (top 5%) · Core courses: Data Visualization, Data Science, Machine Learning, Database & Big Data Management (SQL), Statistical Learning & Data Mining, Python',
  },
  {
    school: 'Yunnan University of Finance and Economics',
    degree: 'BSc in Trade Economics',
    period: '2021.09 - 2025.06',
    detail:
      'School of Economics · GPA 3.48/4.0 (top 10%) · First-class scholarship for consecutive years · Majors: Economics, Statistics, Calculus, Econometrics',
  },
]

// ---------------- About: Internships ----------------
export const experiences = [
  {
    title: 'IT Data Development Intern',
    org: 'Maxcess (foreign company)',
    period: '2026.05 - 2026.09',
    items: [
      'Requirement analysis and metric alignment: aligned aging-bucket, overdue, prepayment write-off and DSO metric definitions across Finance / Supply Chain / IT',
      'Data modeling & ETL: designed 18 tables + 3 views; Python scripts synced Kingdee K3 data to MySQL covering 23K AR rows, 1.09M shipment rows and 18K receipt-write-off rows',
      'AI-assisted full-stack development: delivered 27 APIs with FastAPI + SQLAlchemy and 4 pages with Vue3 + ECharts, reviewing AI-generated SQL metrics and boundaries line by line',
      'Visualization delivery: deployed on the intranet via Nginx, cutting report generation from ~4 hours to under 10 minutes',
    ],
  },
  {
    title: 'Data Analyst Intern',
    org: 'Baidu',
    period: '2026.03 - 2026.04',
    items: [
      'Analyzed the search-click-browse funnel, quantifying ~30% search-to-click and ~9.8% click-to-browse drop-off',
      'Cleaned 100K user search-behavior log rows (18 fields) with Pandas, handling missing/outlier values and feature derivation',
      'User segmentation: analyzed 4 traffic channels, 2 device types and 5 city tiers, producing 10 visualization charts',
    ],
  },
  {
    title: 'Data Analyst Intern',
    org: 'Industrial Bank, Taizhou Branch',
    period: '2025.06 - 2025.09',
    items: [
      'Supported corporate credit-risk data analysis, understanding the logic behind profitability and solvency risk indicators',
      'Verified customer data completeness and consistency with SQL / Excel and maintained a data-quality issue list',
      'Maintained monthly reports and standardized filing templates, following up on post-loan management data needs',
    ],
  },
]

// ---------------- About: Awards ----------------
export const awards = [
  {
    title: 'National College Students Statistical Modeling Competition - Provincial Third Prize',
    time: '2024',
    desc: 'Applied XGBoost to gold data: data preprocessing, feature engineering, model training and result analysis',
  },
  {
    title: 'MCM (Mathematical Contest in Modeling) - Honorable Mention',
    time: '2023',
    desc: 'Used R for factor extraction, regression analysis and modeling',
  },
]
