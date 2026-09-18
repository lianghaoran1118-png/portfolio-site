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
    id: 'maven-fuzzy',
    tag: 'ISOM7022 Course Project · SQL Business Analysis',
    status: 'Course sample DB · 473K sessions',
    title: 'MavenFuzzyFactory E-commerce Behavior & Conversion Analysis',
    desc: 'SQL business analysis on the Maven Fuzzy Factory e-commerce dataset (the Maven Analytics course sample database, a simulated startup scenario - the data is teaching-generated, not real company data), loaded into local MySQL 8.4: website_sessions 472,871 rows / website_pageviews 1,188,124 rows / orders 32,313 rows, 2012-03 to 2015-03, across four modules: (1) traffic-channel breakdown and paid-media quality (UTM combinations, session-to-order CVR, bid-change impact, device differences); (2) website content and landing-page analysis (top pages, entry-page distribution, bounce rate, /home vs /lander-1 A/B test, full conversion funnel); (3) growth attribution (monthly sessions/orders/CVR, brand vs nonbrand, multi-channel mix); (4) channel portfolio optimisation and business rhythm (gsearch/bsearch portfolio, free-traffic spillover, seasonality, hour-of-day heatmap).',
    tech: ['MySQL 8.4', 'SQL', 'CTE / Temp tables', 'Multi-table JOIN', 'CASE WHEN pivoting', 'YEARWEEK / WEEKDAY', 'A/B testing', 'Funnel analysis', 'Python + Matplotlib'],
    images: [
      { label: 'gsearch growth & CVR trend', src: 'images/mff-01-growth.png' },
      { label: 'Multi-channel traffic mix', src: 'images/mff-02-channel-mix.png' },
      { label: 'Bid cut impact on weekly traffic', src: 'images/mff-03-bid-trend.png' },
      { label: 'Device-level CVR gap', src: 'images/mff-04-device-cvr.png' },
      { label: '/home vs /lander-1 A/B test', src: 'images/mff-05-ab-test.png' },
      { label: 'Full conversion funnel', src: 'images/mff-06-funnel.png' },
      { label: '2012 seasonality', src: 'images/mff-07-seasonality.png' },
      { label: 'Product revenue & refunds', src: 'images/mff-08-products.png' },
      { label: 'Hour-of-day heatmap', src: 'images/mff-09-daypart.png' },
    ],
    imageLabel: 'gsearch growth & CVR trend',
    imageSrc: 'images/mff-01-growth.png',
    results: [
      '**Paid-media quality verdict**: gsearch nonbrand ran at only 2.96% session-to-order CVR (below the 4% threshold) -> recommendation "reduce bids"; after the 2012-04-15 cut, weekly sessions fell from 983 to 621 (-36.8%) and to 399 by early May, confirming the volume elasticity of bids and the channel\'s weak quality at the time',
      '**Inverted device structure**: over 9 months desktop drove 28,067 sessions / 1,280 orders (CVR 4.56%) while mobile drove 10,291 sessions / 128 orders (CVR 1.24%) - mobile converts at only 1/3.67 of desktop, so bids must be split by device rather than raised across the board',
      '**Landing-page A/B test**: /home CVR 3.18% (2,261 sessions / 72 orders) vs /lander-1 CVR 4.06% (2,316 sessions / 94 orders), a 0.87pp lift; revenue per session rose from $1.59 to $2.03. Scaled to lander-1 traffic, the test earned an estimated +20 incremental orders and +$1,012 in revenue',
      '**Funnel leak localisation**: /lander-1 -> order confirmation ran 4,493 -> 158 sessions (3.52%). The three weakest step conversions are landing->products 47.07%, product detail->cart 43.59% and billing->order 43.77%, matching the course conclusion that lander-1 / mrfuzzy / billing have the lowest click-through',
      '**Growth attribution**: gsearch monthly sessions grew 1,860 -> 8,889 (4.78x) with CVR improving from 3.23% to 4.20%; over the same period bsearch went 2 -> 2,840, organic search 8 -> 536 and direct type-in 9 -> 485, showing clear free-traffic spillover from paid nonbrand, with bsearch holding steady at 30.6%-35.2% of gsearch',
      '**Seasonality & day-parting**: sessions peaked at 14,011 in Nov 2012 (Black Friday / Cyber Monday) and Dec posted the year\'s highest CVR at 5.02%. Traffic follows a very strong weekly rhythm - weekdays average 309 sessions/day (n=43, sd 39) vs 143/day at weekends (n=18, sd 20), only 46%, and across 9 weeks the **lowest weekday (238) still beats the highest weekend day (168), so the two ranges never overlap**. Splitting by channel shows every channel halves in step (gsearch nonbrand 198->91, bsearch nonbrand 64->30, organic 16->7, direct 16->8), so this is not caused by pausing ad spend at weekends but is an overall visitation rhythm. Hourly, weekdays concentrate in 09:00-17:00 while weekends are flatter with a higher share of night and evening traffic',
      '**Product mix & quality**: Mr. Fuzzy contributed $738,893 of gross margin (60.8%), but Birthday Sugar Panda had the highest refund rate at 6.04% (Mr. Fuzzy 5.11%, Hudson River Mini Bear only 1.28%); the full database totals 472,871 sessions / 32,313 orders / $1,938,510 revenue / $1,216,140 gross margin / $85,339 refunds',
    ],
    codeTitle: 'Paid-media quality & bid recommendation (SQL)',
    codeLang: 'sql',
    code: `-- Question: is gsearch nonbrand session-to-order CVR below 4%? Below -> cut bids, above -> scale
SELECT
  COUNT(DISTINCT w.website_session_id) AS sessions,
  COUNT(DISTINCT o.order_id)           AS orders,
  ROUND(100 * COUNT(DISTINCT o.order_id)
        / COUNT(DISTINCT w.website_session_id), 2) AS session_to_order_cvr_pct,
  CASE WHEN COUNT(DISTINCT o.order_id) / COUNT(DISTINCT w.website_session_id) < 0.04
       THEN 'reduce bids' ELSE 'increase bids / scale volume' END AS recommendation
FROM website_sessions w
LEFT JOIN orders o
  ON o.website_session_id = w.website_session_id
WHERE w.created_at < '2012-04-12'
  AND w.utm_source = 'gsearch'
  AND w.utm_campaign = 'nonbrand';

-- Actual result: sessions 3,613 | orders 107 | CVR 2.96% | reduce bids`,
    codes: [
      {
        label: 'Paid-media CVR',
        title: 'sql/02_channel_cvr.sql · session-to-order CVR and bid recommendation',
        lang: 'sql',
        code: `-- Question: is gsearch nonbrand session-to-order CVR below 4%? Below -> cut bids, above -> scale
SELECT
  COUNT(DISTINCT w.website_session_id) AS sessions,
  COUNT(DISTINCT o.order_id)           AS orders,
  ROUND(100 * COUNT(DISTINCT o.order_id)
        / COUNT(DISTINCT w.website_session_id), 2) AS session_to_order_cvr_pct,
  CASE WHEN COUNT(DISTINCT o.order_id) / COUNT(DISTINCT w.website_session_id) < 0.04
       THEN 'reduce bids' ELSE 'increase bids / scale volume' END AS recommendation
FROM website_sessions w
LEFT JOIN orders o
  ON o.website_session_id = w.website_session_id
WHERE w.created_at < '2012-04-12'
  AND w.utm_source = 'gsearch'
  AND w.utm_campaign = 'nonbrand';

-- Actual result: sessions 3,613 | orders 107 | CVR 2.96% | reduce bids`,
      },
      {
        label: 'Landing-page A/B test',
        title: 'sql/13_landing_page_test.sql · /home vs /lander-1 and incremental revenue',
        lang: 'sql',
        code: `-- First landing page each session saw during the test window (only /home and /lander-1)
CREATE TEMPORARY TABLE landing_page_test AS
SELECT p.website_session_id,
       MIN(p.website_pageview_id) AS min_pageview_id,
       p.pageview_url            AS landing_page
FROM website_pageviews p
JOIN website_sessions s
  ON s.website_session_id = p.website_session_id
WHERE s.created_at < '2012-07-28'
  AND s.utm_source = 'gsearch'
  AND s.utm_campaign = 'nonbrand'
  AND p.website_pageview_id >= 23504     -- first pageview after /lander-1 went live
  AND p.pageview_url IN ('/home', '/lander-1')
GROUP BY p.website_session_id, p.pageview_url;

-- Join orders and compare sessions / orders / CVR / revenue per session
SELECT t.landing_page,
       COUNT(DISTINCT t.website_session_id) AS sessions,
       COUNT(DISTINCT o.order_id)           AS orders,
       ROUND(100 * COUNT(DISTINCT o.order_id)
             / COUNT(DISTINCT t.website_session_id), 2)               AS cvr_pct,
       ROUND(SUM(o.price_usd)
             / COUNT(DISTINCT t.website_session_id), 2)               AS revenue_per_session
FROM landing_page_test t
LEFT JOIN orders o
  ON t.website_session_id = o.website_session_id
GROUP BY t.landing_page
ORDER BY cvr_pct DESC;

-- Actual result: /lander-1  2,316 sessions | 94 orders | 4.06% | $2.03
--                /home      2,261 sessions | 72 orders | 3.18% | $1.59
-- Incremental:   2,316 x 0.87pp ~ +20 orders ~ +$1,012`,
      },
      {
        label: 'Full funnel',
        title: 'sql/15_conversion_funnel.sql · /lander-1 to order confirmation',
        lang: 'sql',
        code: `-- Step 1: flatten session x page into a 0/1 flag per funnel stage
CREATE TEMPORARY TABLE funnel_pageview_flags AS
SELECT s.website_session_id,
       MAX(CASE WHEN p.pageview_url = '/lander-1'                 THEN 1 ELSE 0 END) AS lander1_p,
       MAX(CASE WHEN p.pageview_url = '/products'                 THEN 1 ELSE 0 END) AS products_p,
       MAX(CASE WHEN p.pageview_url = '/the-original-mr-fuzzy'    THEN 1 ELSE 0 END) AS mrfuzzy_p,
       MAX(CASE WHEN p.pageview_url = '/cart'                     THEN 1 ELSE 0 END) AS cart_p,
       MAX(CASE WHEN p.pageview_url = '/shipping'                 THEN 1 ELSE 0 END) AS shipping_p,
       MAX(CASE WHEN p.pageview_url = '/billing'                  THEN 1 ELSE 0 END) AS billing_p,
       MAX(CASE WHEN p.pageview_url = '/thank-you-for-your-order' THEN 1 ELSE 0 END) AS thankyou_p
FROM website_sessions s
LEFT JOIN website_pageviews p
  ON s.website_session_id = p.website_session_id
WHERE p.created_at BETWEEN '2012-08-05' AND '2012-09-05'
  AND s.utm_source = 'gsearch'
  AND s.utm_campaign = 'nonbrand'
GROUP BY s.website_session_id;

-- Step 2: count sessions reaching each stage and compute step-to-step conversion
SELECT COUNT(DISTINCT website_session_id) AS sessions,
       COUNT(DISTINCT CASE WHEN products_p = 1 THEN website_session_id END) AS to_products,
       COUNT(DISTINCT CASE WHEN mrfuzzy_p  = 1 THEN website_session_id END) AS to_mrfuzzy,
       COUNT(DISTINCT CASE WHEN cart_p     = 1 THEN website_session_id END) AS to_cart,
       COUNT(DISTINCT CASE WHEN shipping_p = 1 THEN website_session_id END) AS to_shipping,
       COUNT(DISTINCT CASE WHEN billing_p  = 1 THEN website_session_id END) AS to_billing,
       COUNT(DISTINCT CASE WHEN thankyou_p = 1 THEN website_session_id END) AS to_thankyou
FROM funnel_pageview_flags;

-- Actual result: 4,493 -> 2,115 -> 1,567 -> 683 -> 455 -> 361 -> 158 (3.52% overall)
-- Step rates:   47.07% / 74.09% / 43.59% / 66.62% / 79.34% / 43.77%`,
      },
      {
        label: 'Device CVR pivot',
        title: 'sql/19_device_monthly_cvr.sql · CASE WHEN pivot for monthly device comparison',
        lang: 'sql',
        code: `-- Pivot devices into two columns with CASE WHEN to see growth and conversion side by side
SELECT YEAR(w.created_at)  AS year,
       MONTH(w.created_at) AS month,
       COUNT(DISTINCT CASE WHEN w.device_type = 'desktop'
                           THEN w.website_session_id END) AS desktop_sessions,
       COUNT(DISTINCT CASE WHEN w.device_type = 'desktop'
                           THEN o.order_id END)           AS desktop_orders,
       ROUND(100 * COUNT(DISTINCT CASE WHEN w.device_type = 'desktop'
                                       THEN o.order_id END)
             / NULLIF(COUNT(DISTINCT CASE WHEN w.device_type = 'desktop'
                                          THEN w.website_session_id END), 0), 2)
                                                          AS desktop_cvr_pct,
       COUNT(DISTINCT CASE WHEN w.device_type = 'mobile'
                           THEN w.website_session_id END) AS mobile_sessions,
       COUNT(DISTINCT CASE WHEN w.device_type = 'mobile'
                           THEN o.order_id END)           AS mobile_orders,
       ROUND(100 * COUNT(DISTINCT CASE WHEN w.device_type = 'mobile'
                                       THEN o.order_id END)
             / NULLIF(COUNT(DISTINCT CASE WHEN w.device_type = 'mobile'
                                          THEN w.website_session_id END), 0), 2)
                                                          AS mobile_cvr_pct
FROM website_sessions w
LEFT JOIN orders o
  ON w.website_session_id = o.website_session_id
WHERE w.created_at < '2012-11-27'
  AND w.utm_source = 'gsearch'
  AND w.utm_campaign = 'nonbrand'
GROUP BY YEAR(w.created_at), MONTH(w.created_at)
ORDER BY year, month;

-- Actual result (2012-03 to 11 totals):
--   desktop 28,067 sessions / 1,280 orders / CVR 4.56%
--   mobile  10,291 sessions /   128 orders / CVR 1.24%`,
      },
    ],
  },
  {
    id: 'search-click',
    tag: 'Baidu Internship · Analytics Practice',
    status: 'Demo data · not production',
    title: 'Search Click Behaviour Analysis',
    desc: "Straight up first: these 100,000 rows are not real production data. Real data can't leave the company, so this is a demo dataset built to match the structure and scale of a real search log — real methods, not real data. With that stated, I ran the whole pipeline end to end: cleaning → funnel → factor analysis. Everything below applies to this dataset only, not to the real business.",
    tech: ['Python', 'Pandas', 'SQL', 'CTE / Window functions', 'Logistic Regression', 'statsmodels', 'Wilson confidence interval', 'Multiple-comparison correction', 'Matplotlib'],
    images: [
      { label: 'Funnel: search → click → browse', src: 'images/sba-01-funnel.png' },
      { label: 'Rank distribution: CTR does not change with rank', src: 'images/sba-02-rank.png' },
      { label: 'CTR by traffic source with 95% CIs', src: 'images/sba-03-channel.png' },
      { label: 'CTR by device × traffic source', src: 'images/sba-04-device-channel.png' },
      { label: 'CTR by city tier with 95% CIs', src: 'images/sba-05-city.png' },
      { label: 'CTR by keyword type × query length', src: 'images/sba-06-keyword.png' },
      { label: 'Search volume and CTR by hour of day', src: 'images/sba-07-hour.png' },
    ],
    imageLabel: 'Funnel: search → click → browse',
    imageSrc: 'images/sba-01-funnel.png',
    results: [
      '**Cleaning**: split missingness into two kinds. click_time is 31% missing and browse_time 37%, which looks alarming but is simply "the event never happened" — no click means no click duration, so filling it would be fabricating data. Only result_rank and keyword_length (2.4% each) actually needed handling: median imputation plus a missing flag',
      '**Funnel**: 100,000 searches → 69,982 clicks (69.98%) → 63,129 effective browses (63.13%). The 30.02% search-to-click drop-off is 3.1x the 9.79% click-to-browse drop-off — the problem sits in the first stage, where results fail to earn a click',
      '**Factor analysis**: broke down 10 dimensions — device, traffic source, city tier, keyword type, query length, search frequency, hour of day, result rank and more. CTR sits around 70% across the board and the widest gap is just 1.09 percentage points, so no dimension separates clickers from non-clickers',
      '**A problem I ran into**: CTR across the 19 rank positions is essentially flat (a 2.77pp spread) — there is none of the rank decay a real search log must show — and 97.6% of non-click rows still carry a rank value. The field definition does not hold up, and the report says so',
      '**Model**: logistic regression AUC 0.5018, basically the same as random (0.5). Accuracy of 69.63% looks fine until you notice "always predict click" also scores 69.63% — the click rate in this dataset is 70%, so accuracy is a useless metric here',
      '**Bottom line**: the funnel structure is clear, but the available fields cannot tell clickers from non-clickers. All 18 fields record who / where / when — none records how relevant a result is to the query, and a click is essentially a relevance judgement',
    ],
    codeTitle: 'Full funnel (SQL)',
    codeLang: 'sql',
    codes: [
      {
        label: 'Full funnel (SQL)',
        title: 'sql/01_funnel.sql · search → click → browse',
        lang: 'sql',
        code: `-- Gotcha: in SQLite SUM(is_click) / COUNT(*) is integer division and returns 0,
--         so multiply by 1.0 first. Written explicitly as 1.0 * k / n below.
SELECT
    COUNT(*)                                                    AS searches,
    SUM(is_click)                                               AS clicks,
    SUM(is_browse)                                              AS browses,
    ROUND(100.0 * SUM(is_click) / COUNT(*), 2)                  AS ctr_pct,
    ROUND(100.0 * (COUNT(*) - SUM(is_click)) / COUNT(*), 2)     AS search_to_click_loss_pct,
    ROUND(100.0 * SUM(is_browse) / NULLIF(SUM(is_click), 0), 2) AS click_to_browse_pct,
    ROUND(100.0 * (SUM(is_click) - SUM(is_browse))
          / NULLIF(SUM(is_click), 0), 2)                        AS click_to_browse_loss_pct,
    -- Ratio of the two drop-offs: reads straight as the optimization priority
    ROUND((1.0 * (COUNT(*) - SUM(is_click)) / COUNT(*))
          / NULLIF(1.0 * (SUM(is_click) - SUM(is_browse)) / SUM(is_click), 0), 2)
                                                                AS loss_ratio
FROM search_log;

-- Result: 100,000 -> 69,982 (69.98%) -> 63,129 (63.13%)
--         search-to-click 30.02% is 3.1x the click-to-browse 9.79%`,
      },
      {
        label: 'Rank distribution (SQL)',
        title: 'sql/02_rank_curve.sql · rank distribution and click share',
        lang: 'sql',
        code: `-- Check whether CTR decays with rank (the shape a real search log shows)
WITH base AS (
    SELECT COUNT(*) AS total_clicks FROM search_log WHERE is_click = 1
)
SELECT
    result_rank                                             AS rank,
    COUNT(*)                                                AS impressions,
    SUM(is_click)                                           AS clicks,
    ROUND(1.0 * SUM(is_click) / COUNT(*), 4)                AS ctr,
    ROUND(1.0 * SUM(is_click) / COUNT(*) / (
              SELECT 1.0 * SUM(is_click) / COUNT(*)
              FROM search_log WHERE result_rank = 1), 4)    AS ctr_vs_rank1,
    ROUND(100.0 * SUM(is_click) / (SELECT total_clicks FROM base), 2)
                                                            AS click_share_pct,
    -- Cumulative click share: how much of all clicks the top N ranks absorb
    ROUND(100.0 * SUM(SUM(is_click)) OVER (ORDER BY result_rank)
          / (SELECT total_clicks FROM base), 2)             AS cum_click_share_pct
FROM search_log
WHERE result_rank IS NOT NULL
GROUP BY result_rank
ORDER BY result_rank;

-- Result: CTR spans only 2.77pp across the 19 ranks (max 71.43%, min 68.66%)
--         and exposure is near-uniform (~5,137 rows per rank).
--         * Real logs must show rank decay; it is entirely absent here
--           -> the result_rank field definition does not hold up`,
      },
      {
        label: 'Modelling (Python)',
        title: 'src/step4_modeling.py · logistic regression and baseline comparison',
        lang: 'python',
        code: `# 23 features (including missing flags), 70K train / 30K test
fit = sm.Logit(ytr, sm.add_constant(Xtr)).fit(disp=0)
prob = fit.predict(sm.add_constant(Xte))
pred = (prob >= 0.5).astype(int)

auc = roc_auc_score(yte, prob)              # 0.5018 (random = 0.5000)
acc = accuracy_score(yte, pred)             # 0.6963
rec = recall_score(yte, pred)               # 1.0000

# * The key step: compare against the zero-cost baseline
#   Because the base click rate is 69.98%,
#   "always predict click" scores 0.6963 accuracy -- exactly the same
base_all_click = (yte == 1).mean()          # 0.6963
cm = confusion_matrix(yte, pred)            # true negatives TN = 0
#   -> at a 0.5 threshold the model degenerates into always-predict-click
#   -> at this base rate accuracy / precision / recall / F1 are all useless;
#      only AUC and lift over the baseline tell you anything

# Overall diagnostics
lr_stat = 2 * (fit.llf - fit.llnull)
print(chi2.sf(lr_stat, df=k))               # p = 0.5863 -> cannot reject all-zero coefficients
print(1 - fit.llf / fit.llnull)             # McFadden pseudo-R2 = 0.000245`,
      },
    ],
    code: `-- Full funnel (complete source in sql/01_funnel.sql)
SELECT COUNT(*) AS searches,
       SUM(is_click)  AS clicks,
       SUM(is_browse) AS browses,
       ROUND(100.0 * SUM(is_click) / COUNT(*), 2)              AS ctr_pct,
       ROUND(100.0 * (COUNT(*) - SUM(is_click)) / COUNT(*), 2) AS search_to_click_loss_pct,
       ROUND(100.0 * (SUM(is_click) - SUM(is_browse))
             / NULLIF(SUM(is_click), 0), 2)                    AS click_to_browse_loss_pct
FROM search_log;
-- 100,000 -> 69,982 (69.98%) -> 63,129 (63.13%); drop-off 30.02% vs 9.79%`,
  },
]

// ---------------- Skills ----------------
export const skills = {
  groups: [
    {
      title: 'Programming Languages',
      summary: 'Python / SQL first, R for statistics, AI full-stack development experience',
      icon: 'code',
    },
    {
      title: 'Tools & Frameworks',
      summary: 'FastAPI · MySQL · ERP System · Pandas · Tableau',
      icon: 'database',
    },
    {
      title: 'Business Capabilities',
      summary: 'Finance digitalization · User behavior analysis · ML modeling · BI dashboard development',
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
      'Analyzed the search-click-browse funnel, quantifying 30.02% search-to-click and 9.79% click-to-browse drop-off and locating the optimization priority in the first stage',
      'Cleaned 100K search-behavior log rows (18 fields): ran an MCAR test on missingness and audited field-definition consistency, uncovering a contradictory result_rank definition',
      'Validated via univariate AUC, mutual information, logistic regression and gradient-boosted trees that the available fields carry no click signal; added a label-permutation control to rule out pipeline leakage, delivering 12 charts and an instrumentation roadmap',
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
