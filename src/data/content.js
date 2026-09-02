// ============================================================
// ★★★ 站点内容配置文件（全站文字 / 图片 / 简历的集中修改入口）★★★
//
// 1) 个人信息 → 修改下方 profile 对象（姓名、邮箱、电话、GitHub 等）
// 2) 项目内容 → 修改 projects 数组
// 3) 技能 / 博客 / 教育 / 实习 / 荣誉 → 对应数组
// 4) 项目截图 → 把截图放入 public/images/，并把对应 imageSrc 改为 "images/xxx.png"
// 5) 简历 PDF → 将简历重命名为 resume.pdf 放到 public/resume/（已预置）
// ============================================================

export const profile = {
  name: '梁浩然', // 姓名（导航 / 首页 / 页脚 / 标题自动生效）
  role: '商业分析硕士 · IT 数据开发实习生',
  tagline: '用数据与 AI 解决真实业务问题',
  intro:
    '澳门大学商业分析硕士在读，兼具经济学、统计学与数据分析复合背景。曾于美赛斯 Maxcess（外企）参与应收账款管理看板（ARDashboard）全栈开发，具备 ERP 取数、MySQL 数据建模与 FastAPI/Vue 看板交付经验；曾在百度、兴业银行任数据分析实习生。熟练使用 SQL 与 Python/Pandas，掌握回归、分类等机器学习建模流程；以 AI 产品思维运用 CodeBuddy、Codex 等工具，驱动需求拆解、Agent 协作工作流与提示词工程，用 AI 重构 SQL、ETL 与全栈开发交付链路，实现数倍提效。',
  location: '江浙沪 · 成都', // 意向地区
  industries: ['银行', '外企'], // 意向行业
  email: 'Lianghaoran1118@163.com', // 邮箱（来自简历）
  phone: '15168693637', // 电话（来自简历）
  github: '', // TODO: 填你的 GitHub 主页，如 https://github.com/xxx
  linkedin: '', // TODO: 填你的 LinkedIn 主页
  resumeUrl: 'resume/resume.pdf', // 简历PDF路径（放在 public/resume/resume.pdf）
}

export const jobIntent = ['数据分析', '数据开发', '商业分析', 'AI 业务分析师', 'AI 产品经理']

// ---------------- 项目作品集 ----------------
export const projects = [
  {
    id: 'ar-dashboard',
    tag: '企业实习 · 全栈 BI',
    status: '已上线内网',
    title: 'ARDashboard（AR Collection）应收账款管理看板',
    desc: '前后端分离的应收管理看板（V2.0 后端 / V3 前端 POC）：数据经独立 ETL 项目从 ERP 同步至 MySQL prod 库，FastAPI + SQLAlchemy 提供 JSON API，Vue3 单页应用通过 Nginx 统一对外。实现客户聚合、账龄 7 桶、逾期判定、DSO、催收行动、币种分组汇总表、客户明细下钻、报表图表与设置管理四大页面。',
    tech: ['Python', 'FastAPI', 'SQLAlchemy 2.0', 'MySQL', 'Vue3', 'TypeScript', 'Element Plus', 'ECharts', 'Pinia', 'Nginx'],
    // 多张截图轮播（演示版 4 个页面，虚构数据无需打码）
    images: [
      { label: 'Collection', src: 'images/demo-arboard-collection.png' },
      { label: 'Receipts（含 Net/Refund 列）', src: 'images/demo-arboard-receipts.png' },
      { label: 'Reports（DSO + Aging）', src: 'images/demo-arboard-reports.png' },
      { label: 'Settings（期间开关）', src: 'images/demo-arboard-settings.png' },
    ],
    imageLabel: 'ARDashboard 演示版 Collection 页',
    imageSrc: 'images/demo-arboard-collection.png',
    codeTitle: 'main.py 后端入口（演示版）',
    codeLang: 'python',
    // 多段核心功能代码，标签切换查看（均取自真实代码）
    codes: [
      {
        label: '后端入口',
        title: 'main.py · 后端入口',
        lang: 'python',
        code: `# main.py — AR Collection V2.0 后端入口（演示模式）
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware

app = FastAPI(title="AR Collection V2.0", version="2.0.0")

# 1. No-cache 中间件
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

# 3. 注册 9 个 API 路由模块（含退款单 refunds）
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

# 4. 演示模式开关：AR_DEMO=1 时连 SQLite 演示库
import os
if os.getenv("AR_DEMO") == "1":
    from database import init_demo_db
    init_demo_db()

# 5. 健康检查
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
        label: 'DSO 计算',
        title: 'services/dso.py · DSO 纯函数',
        lang: 'python',
        code: `# DSO (Days Sales Outstanding) 计算纯函数
# 公式: DSO = AR × 三期天数 ÷ 三期收入
from decimal import Decimal


def compute_dso(ar_total: Decimal,
                revenue_3m: Decimal,
                days_3m: int) -> float:
    """
    ar_total:   应收余额 (AR balance)
    revenue_3m: 三期收入合计 (credit - debit, 4 开头科目)
    days_3m:    三期的会计天数总和
    """
    if revenue_3m > 0 and days_3m > 0:
        return round(float(ar_total / revenue_3m * days_3m), 1)
    return 0.0`,
      },
      {
        label: '账龄结构',
        title: 'routers/dashboard.py · 账龄结构聚合',
        lang: 'python',
        code: `# 账龄结构：按 sales_rep 分组 + 客户明细
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
    # 构建 rep → {totals, customers:[]} 结构
    rep_data = {}
    for r in rows:
        rep = r[0] or "Unknown"
        # ... 累加各桶金额
    return {"data": rep_data}`,
      },
      {
        label: '退款单',
        title: 'routers/refunds.py · 退款单关联',
        lang: 'python',
        code: `# Refunds API — /api/refunds（独立库 ar_refund）
# 与主看板 prod 库完全隔离，不影响现有收款/应收逻辑
@router.get("", response_model=RefundOut)
def list_refunds(period_from: str | None = Query(None),
                 period_to: str | None = Query(None),
                 customer: str | None = Query(None),
                 db: Session = Depends(get_refund_db)):
    """退款单列表（按退款单号聚合，一单一行）"""
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
      'FastAPI + SQLAlchemy 交付 8 个路由模块、约 30 个 API：客户聚合、账龄结构、DSO/账龄趋势、收款、催收行动、设置等（演示版另含退款单）',
      'Vue3 + TypeScript + Element Plus + ECharts 实现 4 个页面：Collection / Receipts / Reports / Settings',
      '核心表格采用“单表多分组 + 小计/总计行注入”模式，按币种分组并自动注入原币小计、USD 折算与 Grand Total 行',
      '实现 7 档账龄分桶、多币种 USD 折算、DSO（AR 余额 × 三期天数 ÷ 三期收入）、客户详情抽屉（开票/未开票/预收款/贷记 + Net Exposure）与催收行动跟踪',
      'Nginx 部署内网投产，供财务、销售日常使用；附离线演示版（SQLite + 虚构数据）便于面试展示',
    ],
  },
  {
    id: 'erp-etl',
    tag: 'ERP · ETL 取数',
    status: '独立工具包',
    title: '金蝶云 API 取数与 MySQL 数据建模（ETL）',
    desc: '构建金蝶云星空 → MySQL 的通用取数工具包：通过金蝶 OpenAPI 鉴权与 ExecuteBillQuery 单据查询，实现字段映射、自动分页、去重与增量入库（upsert）。沉淀为可配置模板，仅改 FORM_CONFIG 即可适配任意单据（应收、收款、发货、收料、订单等）。',
    tech: ['Python', '金蝶云 OpenAPI', 'MySQL', 'ETL', '数据建模', 'upsert 去重', 'requests'],
    imageLabel: 'MySQL Workbench · prod.ar_receip 应收收款单表',
    imageSrc: 'images/demo-etl-mysql-ar_receip.png',
    // MySQL Workbench 真实取数界面（演示数据）
    images: [
      { label: 'prod.ar_receip 应收收款单', src: 'images/demo-etl-mysql-ar_receip.png' },
      { label: 'ar_refund.ar_refund_bill 退款单', src: 'images/demo-etl-mysql-ar_refund.png' },
    ],
    // 多段核心代码，标签切换（均取自真实工具包）
    codes: [
      {
        label: 'API 客户端',
        title: 'api_client.py · 金蝶 API 客户端',
        lang: 'python',
        code: `# 金蝶云星空 OpenAPI 客户端（登录 + 单据查询）
class K3ApiClient:
    def login(self) -> bool:
        # 登录鉴权，获取会话 Cookie，含自动重试
        url = f"{self.base_url}/Kingdee.BOS.WebApi."
              "ServicesStub.AuthService.ValidateUser.common.kdsvc"
        payload = {"acctid": self.acct_id, "username": self.username,
                   "password": self.password, "lcid": self.lcid}
        resp = self.session.post(url, data=json.dumps(payload),
                                 headers={"Content-Type": "application/json"})
        if resp.status_code == 200:
            self._cookies = resp.cookies
            return True
        raise Exception("金蝶 API 登录失败")

    def execute_bill_query(self, form_id, field_keys,
                           filter_string="", limit=None):
        # ExecuteBillQuery 分页拉取：先 count(1) 总行数，再按 StartRow 翻页
        total = self.execute_bill_query_count(form_id, filter_string)
        all_rows, start_row = [], 0
        while start_row < total:
            rows = self._post_query(form_id, field_keys,
                                    filter_string, start_row, self.page_size)
            # 展平 dict 值 + 页首去重
            all_rows += [self._flatten_row(r) for r in rows]
            start_row += self.page_size
        return all_rows`,
      },
      {
        label: '取数模板',
        title: 'sync_template.py · 通用取数配置',
        lang: 'python',
        code: `# 通用取数模板：改 FORM_CONFIG 即可适配任意单据
FORM_CONFIG = {
    "form_id": "PUR_ReceiveBill",     # 金蝶单据 FormId
    # 字段映射：金蝶 FieldKey → MySQL 列名
    "field_mapping": {
        "FBillNo": "FBillNo",                          # 单据编号
        "FDate": "FDate",                              # 单据日期
        "FSupplierId.FNumber": "FSupplierId_FNumber",  # 供应商编码
        "FSupplierId.FName": "FSupplierId_FName",      # 供应商名称
        "FStockOrgId.FNumber": "FStockOrgId_FNumber",  # 库存组织
        "FDetailEntity_FEntryID": "FEntryID",          # 分录行号
        "FMaterialId.FNumber": "FMaterialId_FNumber",  # 物料编码
        "FActReceiveQty": "FActReceiveQty",            # 实收数量
        "FAmount_LC": "FAmount_LC",                    # 金额本位币
        "FApproveDate": "FApproveDate",                # 审核日期
    },
    "table_name": "pur_receive_bill",   # MySQL 表名
    "unique_keys": ["FBillNo", "FEntryID"],  # upsert 去重键
    "bill_no_prefix": "IN",             # 单号前缀过滤
    "extra_filter": ["FDocumentStatus = 'C'", "FCancelStatus = 'A'"],
}`,
      },
      {
        label: '增量入库',
        title: 'sync_template.py · upsert 去重入库',
        lang: 'python',
        code: `# 增量入库：INSERT ... ON DUPLICATE KEY UPDATE
insert_sql = f"""
    INSERT INTO {table_name} ({", ".join(mysql_columns)}, sync_time)
    VALUES ({", ".join(["%s"] * (len(mysql_columns) + 1))})
    ON DUPLICATE KEY UPDATE
      {", ".join(f"{c}=VALUES({c})" for c in mysql_columns)},
      sync_time = VALUES(sync_time)
"""
# 批量写入（每批 500 行）
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
        label: '建表 SQL',
        title: 'init_tables.sql · MySQL 表设计',
        lang: 'sql',
        code: `-- 应收取数目标表（MySQL）设计示例
CREATE TABLE IF NOT EXISTS ar_receivable (
    FBillNo          VARCHAR(80)  NOT NULL,   -- 应收单号
    FEntryID         INT          NOT NULL,   -- 分录行号
    FDate            DATE,                    -- 单据日期
    FCustomerId_FNumber VARCHAR(60),          -- 客户编码
    FCustomerId_FName  VARCHAR(255),          -- 客户名称
    FCurrencyId_FName  VARCHAR(40),           -- 币种
    FAmount_LC       DECIMAL(18,6),           -- 金额（本位币）
    FExchangeRate    DECIMAL(18,6),           -- 汇率
    sync_time        DATETIME,                -- 同步时间
    PRIMARY KEY (FBillNo, FEntryID)           -- 对应 unique_keys
) COMMENT '应收单取数表';`,
      },
    ],
    results: [
      '封装金蝶云星空 OpenAPI 客户端：登录鉴权、ExecuteBillQuery 单据查询、count 分页、会话丢失自动重登、自动重试',
      '通用取数模板：仅改 FORM_CONFIG（表单 ID / 字段映射 / 表名 / 唯一键）即可适配任意单据，沉淀为可复用工具包',
      'MySQL 数据建模：设计应收、收款、发货、总账等表，采用“单据号 + 分录行”唯一键 upsert 去重与增量入库',
      '针对单据体明细行易被截断，采用按单据号分批 IN 查询 + 回退逐单查询，保证百万级明细行不丢失',
      '优化 API 限流（金蝶每分钟 500 次）：批量 IN 查询 + 自动重试，支撑大表稳定同步',
    ],
  },
  {
    id: 'rag-agent',
    tag: 'AI · RAG Demo',
    status: '可运行 Demo',
    title: '秋招简历 RAG-Agent（AI Demo 项目）',
    desc: '基于 FastAPI + Chroma 搭建简历问答 RAG Agent，实现简历问答与模拟面试。系统提示词 + 向量检索 + 大模型生成三阶段设计，完整展示 RAG 流程。（本网站为静态站，不提供实时对话，下方为核心系统提示词与演示录屏占位）',
    tech: ['Python', 'FastAPI', 'Chroma', 'RAG', 'Prompt 工程'],
    imageLabel: 'Demo 演示录屏截图', // TODO: 替换为你的 Demo 录屏截图
    imageSrc: '', // TODO: 如 'images/project-rag-agent.png'
    results: [
      '完成简历知识库构建与 Chroma 向量检索',
      '设计并迭代核心系统提示词，控制回答质量',
      '可运行的简历问答 / 模拟面试 Demo',
    ],
    codeTitle: '核心系统提示词',
    codeLang: 'text',
    code: `你是资深 HR 面试官助手，负责基于候选人简历知识库回答问题。

【工作规则】
1. 严格依据检索到的简历片段回答，不得编造经历；
2. 先给出结论，再补充关键细节，尽量分点呈现；
3. 知识库中找不到依据时，明确说明"简历中未找到相关信息"；
4. 使用中文回答，语气专业、简洁。

【示例】
Q：你的数据分析经历有哪些？
A：根据简历，主要有：
   1）ARDashboard 应收管理看板全栈开发；
   2）百度搜索行为数据分析实习；
   3）金蝶 K3 ERP 数据对接与取数实践。`,
  },
  {
    id: 'maven-fuzzy',
    tag: '课程项目 · SQL 分析',
    status: '数据分析',
    title: 'MavenFuzzyFactory 电商用户行为与转化分析',
    desc: '基于 Maven Fuzzy Factory 电商业务库，围绕网站流量、用户行为路径、页面转化效率与营销渠道表现开展 SQL 数据分析：渠道质量评估、落地页 A/B 测试与全链路转化漏斗构建。',
    tech: ['SQL', 'CTE', '窗口函数', 'A/B 测试', '漏斗分析'],
    imageLabel: '渠道转化分析图表截图', // TODO: 替换为你自己的分析图表截图
    imageSrc: '', // TODO: 如 'images/project-maven-fuzzy.png'
    results: [
      '拆解 gsearch / bsearch 等渠道的 session、order 与 CVR 表现，支撑预算分配决策',
      'A/B 测试 /home 与 /lander-1 落地页，量化新版页面跳出率改善',
      '构建 首页 → 商品 → 购物车 → 支付 全链路转化漏斗，定位关键流失节点',
    ],
    codeTitle: '落地页 A/B 测试 SQL 示例',
    codeLang: 'sql',
    code: `-- 构建 landing page 会话集并统计跳出率（示意）
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
    tag: '百度实习 · 机器学习',
    status: '分析报告',
    title: '用户搜索点击行为影响因素分析',
    desc: '基于百度搜索行为日志构建点击行为分析框架：用 Python/Pandas 清洗 10 万条日志、构造特征，采用逻辑回归模型分析 CTR 影响因素，输出阶段性分析材料支撑搜索链路优化。',
    tech: ['Python', 'Pandas', '逻辑回归', '特征工程', '模型评估'],
    imageLabel: '模型分析图表截图', // TODO: 替换为你自己的模型/图表截图
    imageSrc: '', // TODO: 如 'images/project-search-click.png'
    results: [
      '清洗 10 万条搜索行为日志、覆盖 18 个字段，构造排名 / 设备 / 流量来源等特征',
      '逻辑回归建模，结合准确率 / 召回率 / AUC 评估，定位影响 CTR 的核心因素',
      '输出 10 张可视化图表与 1 份阶段性分析材料',
    ],
    codeTitle: '逻辑回归建模示例',
    codeLang: 'python',
    code: `# 点击行为二分类建模（示意代码）
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, classification_report

model = LogisticRegression(max_iter=500)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))
print("AUC:", roc_auc_score(y_test, model.predict_proba(X_test)[:, 1]))`,
  },
]

// ---------------- 技能栈 ----------------
export const skills = {
  // 首页"技能速览"卡片
  groups: [
    {
      title: '编程语言',
      summary: 'Python / SQL 为主，掌握 R，具备 Vue3 前端开发经验',
      icon: 'code',
    },
    {
      title: '工具与框架',
      summary: 'FastAPI · MySQL · ERP 系统 · Pandas · Tableau',
      icon: 'database',
    },
    {
      title: '业务能力',
      summary: '财务数字化 · 用户行为分析 · 机器学习建模 · Prompt / RAG',
      icon: 'sparkles',
    },
  ],
  // 技能栈页：编程语言（带熟练度）
  languages: [
    { name: 'Python', level: '熟练', pct: 90 },
    { name: 'SQL', level: '熟练', pct: 88 },
    { name: 'Vue3 / JavaScript', level: '掌握', pct: 65 },
    { name: 'R', level: '掌握', pct: 55 },
  ],
  // 技能栈页：工具与框架
  tools: [
    'FastAPI + SQLAlchemy',
    'MySQL',
    'Vue3 + ECharts',
    '金蝶 K3 / 云 API',
    'Pandas / NumPy',
    'Matplotlib / Seaborn',
    'Tableau',
    'Git',
    'AI 编程工具（CodeBuddy / Codex）',
  ],
  // 技能栈页：业务能力
  business: [
    {
      title: '财务数字化',
      desc: '应收管理看板：账龄分桶、逾期判定、预收款核销与 DSO 指标落地',
    },
    {
      title: 'BI 看板开发',
      desc: '需求梳理、数据建模、接口开发、QA 验证与缺陷闭环修复',
    },
    {
      title: '用户行为分析',
      desc: '搜索 / 电商场景的转化漏斗、渠道分析与用户分层',
    },
    {
      title: '机器学习建模',
      desc: '回归 / 分类、特征工程与模型评估（XGBoost、逻辑回归）',
    },
    {
      title: 'Prompt 工程 & 基础 RAG',
      desc: '简历问答 Agent 的系统提示词设计与 Chroma 向量检索实践',
    },
  ],
}

// ---------------- 关于我：教育背景 ----------------
export const education = [
  {
    school: '澳门大学',
    degree: '商业分析 硕士',
    period: '2025.08 - 2027.07',
    detail:
      '工商管理学院 · GPA 3.7/4.0（专业前 5%）· 核心课程：数据可视化、数据科学、机器学习、数据库与大数据管理（SQL）、统计学习与数据挖掘、Python',
  },
  {
    school: '云南财经大学',
    degree: '贸易经济 本科',
    period: '2021.09 - 2025.06',
    detail:
      '经济学院 · GPA 3.48/4.0（专业前 10%）· 连续多年获校级一等奖学金 · 主修经济学、统计学、高等数学、计量经济学等',
  },
]

// ---------------- 关于我：实习经历 ----------------
export const experiences = [
  {
    title: 'IT 数据开发实习生',
    org: '美赛斯 Maxcess（外企）',
    period: '2026.05 - 2026.09',
    items: [
      '需求梳理与口径对齐：对接财务 / 供应链 / IT 三方，梳理账龄分桶、逾期判定、预收款核销与 DSO 指标口径',
      '数据建模与 ETL：设计 18 张表 + 3 个视图，Python 脚本同步金蝶 K3 数据至 MySQL，接入应收 2.3 万行、发货 109 万行、收款核销 1.8 万行',
      'AI 辅助全栈开发：FastAPI + SQLAlchemy 交付 27 个接口，Vue3 + ECharts 开发 4 个页面，逐条复核 AI 生成 SQL 的口径与边界',
      '可视化交付：Nginx 部署内网投产，出表耗时由约 4 小时缩短至 10 分钟内',
    ],
  },
  {
    title: '数据分析实习生',
    org: '百度',
    period: '2026.03 - 2026.04',
    items: [
      '围绕搜索-点击-浏览链路开展专项分析，量化搜索到点击约 30%、点击到浏览约 9.8% 的流失率',
      '清洗 10 万条用户搜索行为日志（18 个字段），用 Pandas 完成缺失值、异常值处理与特征衍生',
      '用户分层分析：拆解 4 类流量渠道、2 类设备端、5 类城市层级表现，输出 10 张可视化图表',
    ],
  },
  {
    title: '数据分析实习生',
    org: '兴业银行台州分行',
    period: '2025.06 - 2025.09',
    items: [
      '参与对公客户信贷风险数据分析，理解盈利能力、偿债能力等风控指标构建逻辑',
      '用 SQL / Excel 核查客户数据完整性与一致性，整理数据质量问题清单',
      '维护月度报表与标准化填报模板，跟进客户经理贷后管理数据需求',
    ],
  },
]

// ---------------- 关于我：荣誉奖项 ----------------
export const awards = [
  {
    title: '全国大学生统计建模大赛 省级三等奖',
    time: '2024',
    desc: '应用 XGBoost 等机器学习算法处理黄金数据，完成数据预处理、特征构建、模型训练与结果分析',
  },
  {
    title: 'MCM 美国大学生数学建模竞赛 S 奖',
    time: '2023',
    desc: '使用 R 语言完成因子提取、回归分析与建模求解',
  },
]
