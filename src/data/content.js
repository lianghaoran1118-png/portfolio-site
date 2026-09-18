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
    id: 'maven-fuzzy',
    tag: 'ISOM7022 课程项目 · SQL 商业分析',
    status: '课程样本库 · 47.3 万会话',
    title: 'MavenFuzzyFactory 电商用户行为与转化分析',
    desc: '以 Maven Fuzzy Factory 电商数据集为数据源（Maven Analytics 课程样本库，模拟创业公司场景，数据为教学构造、非真实企业数据），导入本机 MySQL 8.4：website_sessions 472,871 行 / website_pageviews 1,188,124 行 / orders 32,313 行，2012-03 ~ 2015-03。用 SQL 完成四个模块的商业分析：① 流量渠道拆解与投放质量评估（UTM 组合、session→order CVR、出价调整效果验证、设备端差异）；② 网站内容与落地页分析（Top Pages、入口页分布、跳出率、/home vs /lander-1 A/B 测试、全链路转化漏斗）；③ 业务增长归因（月度 sessions/orders/CVR、brand vs nonbrand、多渠道结构）；④ 渠道组合优化与经营节律（gsearch/bsearch 组合、免费流量外溢、季节性、访问时段热力图）。',
    tech: ['MySQL 8.4', 'SQL', 'CTE / 临时表', '多表 JOIN', 'CASE WHEN 透视', 'YEARWEEK / WEEKDAY', 'A/B 测试', '漏斗分析', 'Python + Matplotlib'],
    images: [
      { label: 'gsearch 增长与 CVR 趋势', src: 'images/mff-01-growth.png' },
      { label: '全渠道流量结构', src: 'images/mff-02-channel-mix.png' },
      { label: '降价对周流量的影响', src: 'images/mff-03-bid-trend.png' },
      { label: '设备端 CVR 差异', src: 'images/mff-04-device-cvr.png' },
      { label: '/home vs /lander-1 A/B 测试', src: 'images/mff-05-ab-test.png' },
      { label: '全链路转化漏斗', src: 'images/mff-06-funnel.png' },
      { label: '2012 季节性', src: 'images/mff-07-seasonality.png' },
      { label: '产品销售与退款', src: 'images/mff-08-products.png' },
      { label: '访问时段热力图', src: 'images/mff-09-daypart.png' },
    ],
    imageLabel: 'gsearch 增长与 CVR 趋势',
    imageSrc: 'images/mff-01-growth.png',
    results: [
      '**投放质量判定**：gsearch nonbrand 早期 session→order CVR 仅 2.96%（低于 4% 阈值）→ 结论「应下调出价」；2012-04-15 降价后周会话由 983 降至 621（-36.8%），5 月初进一步跌到 399，验证了出价对流量规模的弹性，也确认该渠道当时质量不足',
      '**设备端结构倒挂**：9 个月里 desktop 28,067 会话 / 1,280 单（CVR 4.56%），mobile 10,291 会话 / 128 单（CVR 1.24%）——移动端转化能力只有桌面端的 1/3.67，出价必须按设备端拆分，不能统一加价',
      '**落地页 A/B 测试**：/home CVR 3.18%（2,261 会话 / 72 单）vs /lander-1 CVR 4.06%（2,316 会话 / 94 单），提升 0.87pp；每会话收入由 $1.59 升至 $2.03。按 lander-1 的流量估算，测试期增量订单 +20 单、增量收入 $1,012',
      '**漏斗漏点定位**：/lander-1 → 下单成功 4,493 → 158 会话（3.52%）。相邻环节转化最弱的三段是 落地→商品 47.07%、商品详情→购物车 43.59%、结算→下单 43.77%，与课件「lander-1 / mrfuzzy / billing 三页点击率最低」的判断一致',
      '**增长归因**：gsearch 月会话 1,860 → 8,889（4.78 倍），CVR 3.23% → 4.20%；同期 bsearch 2 → 2,840、自然搜索 8 → 536、直接访问 9 → 485，付费 nonbrand 带来的免费流量外溢效应明显，bsearch 稳定在 gsearch 的 30.6% ~ 35.2%',
      '**季节性与时段**：2012-11 会话冲顶 14,011（黑五 / 网一），12 月 CVR 全年最高 5.02%；访问存在极强的周节律——工作日 309 会话/天（n=43，sd 39）vs 周末 143 会话/天（n=18，sd 20），仅 46%，且 9 周内**工作日最低值 238 仍高于周末最高值 168，两个区间完全不重叠**。拆到渠道后各渠道同步腰斩（gsearch nonbrand 198→91、bsearch nonbrand 64→30、自然搜索 16→7、直接访问 16→8），说明这不是「周末暂停投放」造成的，而是整体访问节律；时段上工作日集中在 9-17 点，周末更扁平、夜间与晚间占比更高',
      '**产品结构与质量**：Mr. Fuzzy 贡献毛利 $738,893（占 60.8%），但 Birthday Sugar Panda 退款率最高 6.04%（Mr. Fuzzy 5.11%，Hudson River Mini Bear 仅 1.28%）；全库汇总 472,871 会话 / 32,313 订单 / 收入 $1,938,510 / 毛利 $1,216,140 / 退款 $85,339',
    ],
    codeTitle: '投放质量与出价建议（SQL）',
    codeLang: 'sql',
    code: `-- 业务问题：gsearch nonbrand 的 session→order CVR 是否低于 4%？低于则降价，高于则放量
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

-- 实测结果：sessions 3,613 | orders 107 | CVR 2.96% | reduce bids`,
    codes: [
      {
        label: '投放质量 CVR',
        title: 'sql/02_channel_cvr.sql · session→order 转化率与出价建议',
        lang: 'sql',
        code: `-- 业务问题：gsearch nonbrand 的 session→order CVR 是否低于 4%？低于则降价，高于则放量
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

-- 实测结果：sessions 3,613 | orders 107 | CVR 2.96% | reduce bids`,
      },
      {
        label: '落地页 A/B 测试',
        title: 'sql/13_landing_page_test.sql · /home vs /lander-1 与增量收入估算',
        lang: 'sql',
        code: `-- 每个 session 在测试期内看到的第一个落地页（网站改造后只看 /home 与 /lander-1）
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
  AND p.website_pageview_id >= 23504     -- /lander-1 上线后的首个 pageview
  AND p.pageview_url IN ('/home', '/lander-1')
GROUP BY p.website_session_id, p.pageview_url;

-- 关联订单，对比会话数 / 订单数 / CVR / 每会话收入
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

-- 实测结果：/lander-1  2,316 会话 | 94 单 | 4.06% | $2.03
--           /home      2,261 会话 | 72 单 | 3.18% | $1.59
-- 增量估算：2,316 × 0.87pp ≈ +20 单 ≈ +$1,012`,
      },
      {
        label: '全链路漏斗',
        title: 'sql/15_conversion_funnel.sql · /lander-1 → 下单成功',
        lang: 'sql',
        code: `-- 第一步：把「会话 × 页面」打平成每个环节的 0/1 标记
CREATE TEMPORARY TABLE funnel_pageview_flags AS
SELECT s.website_session_id,
       MAX(CASE WHEN p.pageview_url = '/lander-1'                THEN 1 ELSE 0 END) AS lander1_p,
       MAX(CASE WHEN p.pageview_url = '/products'                THEN 1 ELSE 0 END) AS products_p,
       MAX(CASE WHEN p.pageview_url = '/the-original-mr-fuzzy'   THEN 1 ELSE 0 END) AS mrfuzzy_p,
       MAX(CASE WHEN p.pageview_url = '/cart'                    THEN 1 ELSE 0 END) AS cart_p,
       MAX(CASE WHEN p.pageview_url = '/shipping'                THEN 1 ELSE 0 END) AS shipping_p,
       MAX(CASE WHEN p.pageview_url = '/billing'                 THEN 1 ELSE 0 END) AS billing_p,
       MAX(CASE WHEN p.pageview_url = '/thank-you-for-your-order' THEN 1 ELSE 0 END) AS thankyou_p
FROM website_sessions s
LEFT JOIN website_pageviews p
  ON s.website_session_id = p.website_session_id
WHERE p.created_at BETWEEN '2012-08-05' AND '2012-09-05'
  AND s.utm_source = 'gsearch'
  AND s.utm_campaign = 'nonbrand'
GROUP BY s.website_session_id;

-- 第二步：汇总各环节到达会话数，并计算相邻环节转化率
SELECT COUNT(DISTINCT website_session_id) AS sessions,
       COUNT(DISTINCT CASE WHEN products_p = 1 THEN website_session_id END) AS to_products,
       COUNT(DISTINCT CASE WHEN mrfuzzy_p  = 1 THEN website_session_id END) AS to_mrfuzzy,
       COUNT(DISTINCT CASE WHEN cart_p     = 1 THEN website_session_id END) AS to_cart,
       COUNT(DISTINCT CASE WHEN shipping_p = 1 THEN website_session_id END) AS to_shipping,
       COUNT(DISTINCT CASE WHEN billing_p  = 1 THEN website_session_id END) AS to_billing,
       COUNT(DISTINCT CASE WHEN thankyou_p = 1 THEN website_session_id END) AS to_thankyou
FROM funnel_pageview_flags;

-- 实测结果：4,493 → 2,115 → 1,567 → 683 → 455 → 361 → 158（整体 3.52%）
-- 环节转化：47.07% / 74.09% / 43.59% / 66.62% / 79.34% / 43.77%`,
      },
      {
        label: '设备端 CVR 透视',
        title: 'sql/19_device_monthly_cvr.sql · CASE WHEN 透视做月度设备对比',
        lang: 'sql',
        code: `-- 用 CASE WHEN 把设备端透视成两列，一次性看增长与转化差异
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

-- 实测结果（2012-03 ~ 11 合计）：
--   desktop 28,067 会话 / 1,280 单 / CVR 4.56%
--   mobile  10,291 会话 /   128 单 / CVR 1.24%`,
      },
    ],
  },
  {
    id: 'search-click',
    tag: '百度实习 · 分析实践',
    status: '演示数据 · 非真实业务',
    title: '用户搜索点击行为分析',
    desc: '先把话说在前面：这 10 万条日志不是真实业务数据。真实数据带不出来，所以这份是按真实搜索日志的结构和量级构造的演示数据——方法是真方法，数据不是真数据。在这个前提下，我把「清洗 → 漏斗 → 找影响因素」完整走了一遍，结论本身只针对这份数据，不代表真实业务。',
    tech: ['Python', 'Pandas', 'SQL', 'CTE / 窗口函数', '逻辑回归', 'statsmodels', 'Wilson 置信区间', '多重比较校正', 'Matplotlib'],
    images: [
      { label: '搜索 → 点击 → 浏览 漏斗', src: 'images/sba-01-funnel.png' },
      { label: '结果位排名分布：点击率完全不随排名变化', src: 'images/sba-02-rank.png' },
      { label: '4 类流量渠道点击率 + 95% 置信区间', src: 'images/sba-03-channel.png' },
      { label: '设备端 × 流量渠道 交叉点击率', src: 'images/sba-04-device-channel.png' },
      { label: '5 类城市层级点击率 + 95% 置信区间', src: 'images/sba-05-city.png' },
      { label: '词型 × 关键词长度 点击率矩阵', src: 'images/sba-06-keyword.png' },
      { label: '24 小时搜索量与点击率', src: 'images/sba-07-hour.png' },
    ],
    imageLabel: '搜索 → 点击 → 浏览 漏斗',
    imageSrc: 'images/sba-01-funnel.png',
    results: [
      '**清洗**：把缺失分成两类。click_time 缺 31%、browse_time 缺 37%，看着吓人，其实是「事件没发生」——没点击哪来的点击时长，填了就是凭空造数据，所以留着空。真正要处理的只有 result_rank 和 keyword_length，各缺 2.4%，用中位数填充并加了缺失标记',
      '**漏斗**：10 万次搜索 → 69,982 次点击（69.98%）→ 63,129 次有效浏览（63.13%）。搜索到点击流失 30.02%，是点击到浏览流失（9.79%）的 3.1 倍——问题出在第一段，结果没能让人点',
      '**找影响因素**：拆了设备端、流量渠道、城市层级、词型、关键词长度、搜索频次、时段、结果位排名等 10 个维度。点击率全在 70% 上下，最大只差 1.09 个百分点，没有哪个维度能明显区分用户会不会点',
      '**顺手发现的坑**：结果位排名 19 个档位的点击率几乎一模一样（极差只有 2.77 个百分点），完全没有真实搜索日志该有的「排名衰减」；而且未点击的记录里 97.6% 也带着排名值——这个字段的口径有问题，报告里写清楚了',
      '**模型**：逻辑回归 AUC 0.5018，跟随机（0.5）差不多。准确率 69.63% 看着还行，但「全猜点击」也是 69.63%——这份数据的点击率本身就是 70%，所以准确率在这儿是失效指标',
      '**一句话总结**：漏斗结构是清楚的，但现有字段区分不出用户会不会点。原因是这 18 个字段记的都是「谁、在哪、什么时候搜」，缺了「这条结果和查询有多相关」——而点击本质上就是在判断相不相关',
    ],
    codeTitle: '全链路漏斗（SQL）',
    codeLang: 'sql',
    codes: [
      {
        label: '全链路漏斗（SQL）',
        title: 'sql/01_funnel.sql · 搜索 → 点击 → 浏览',
        lang: 'sql',
        code: `-- 坑：SQLite 里 SUM(is_click) / COUNT(*) 是整数除法，结果是 0，
--     必须先乘 1.0。所以下面都显式写成 1.0 * k / n。
SELECT
    COUNT(*)                                                    AS searches,
    SUM(is_click)                                               AS clicks,
    SUM(is_browse)                                              AS browses,
    ROUND(100.0 * SUM(is_click) / COUNT(*), 2)                  AS ctr_pct,
    ROUND(100.0 * (COUNT(*) - SUM(is_click)) / COUNT(*), 2)     AS search_to_click_loss_pct,
    ROUND(100.0 * SUM(is_browse) / NULLIF(SUM(is_click), 0), 2) AS click_to_browse_pct,
    ROUND(100.0 * (SUM(is_click) - SUM(is_browse))
          / NULLIF(SUM(is_click), 0), 2)                        AS click_to_browse_loss_pct,
    -- 两段流失的倍数：直接读出优化优先级
    ROUND((1.0 * (COUNT(*) - SUM(is_click)) / COUNT(*))
          / NULLIF(1.0 * (SUM(is_click) - SUM(is_browse)) / SUM(is_click), 0), 2)
                                                                AS loss_ratio
FROM search_log;

-- 结果：100,000 → 69,982（69.98%）→ 63,129（63.13%）
--       搜索→点击流失 30.02%，是点击→浏览（9.79%）的 3.1 倍`,
      },
      {
        label: '排名分布（SQL）',
        title: 'sql/02_rank_curve.sql · 结果位排名分布与点击份额',
        lang: 'sql',
        code: `-- 看看点击率会不会随排名衰减（真实搜索日志的典型形态）
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
    -- 累计点击份额：前 N 位吃掉了多少点击
    ROUND(100.0 * SUM(SUM(is_click)) OVER (ORDER BY result_rank)
          / (SELECT total_clicks FROM base), 2)             AS cum_click_share_pct
FROM search_log
WHERE result_rank IS NOT NULL
GROUP BY result_rank
ORDER BY result_rank;

-- 结果：19 个档位的点击率极差只有 2.77 个百分点（最高 71.43%、最低 68.66%），
--       曝光量也基本平均（每档约 5,137 条）。
--       ★ 真实日志一定有「排名衰减」，这里完全没有
--         → result_rank 这个字段的口径有问题`,
      },
      {
        label: '建模评估（Python）',
        title: 'src/step4_modeling.py · 逻辑回归与基准对比',
        lang: 'python',
        code: `# 23 个特征（含缺失标记），训练 7 万 / 测试 3 万
fit = sm.Logit(ytr, sm.add_constant(Xtr)).fit(disp=0)
prob = fit.predict(sm.add_constant(Xte))
pred = (prob >= 0.5).astype(int)

auc = roc_auc_score(yte, prob)              # 0.5018（随机是 0.5000）
acc = accuracy_score(yte, pred)             # 0.6963
rec = recall_score(yte, pred)               # 1.0000

# ★ 关键一步：跟「零成本基准」比
#   因为基准点击率就是 69.98%，
#   「全猜点击」的准确率 = 0.6963 —— 跟模型一模一样
base_all_click = (yte == 1).mean()          # 0.6963
cm = confusion_matrix(yte, pred)            # 真阴 TN = 0
#   -> 0.5 阈值下模型退化成「全部预测点击」
#   -> 这个正例率下准确率 / 精确率 / 召回率 / F1 全都失效，
#      只能看 AUC 和相对基准的提升

# 整体诊断
lr_stat = 2 * (fit.llf - fit.llnull)
print(chi2.sf(lr_stat, df=k))               # p = 0.5863 → 无法拒绝「系数全为 0」
print(1 - fit.llf / fit.llnull)             # McFadden 伪 R² = 0.000245`,
      },
    ],
    code: `-- 全链路漏斗（完整代码见 sql/01_funnel.sql）
SELECT COUNT(*) AS searches,
       SUM(is_click)  AS clicks,
       SUM(is_browse) AS browses,
       ROUND(100.0 * SUM(is_click) / COUNT(*), 2)                  AS ctr_pct,
       ROUND(100.0 * (COUNT(*) - SUM(is_click)) / COUNT(*), 2)     AS search_to_click_loss_pct,
       ROUND(100.0 * (SUM(is_click) - SUM(is_browse))
             / NULLIF(SUM(is_click), 0), 2)                        AS click_to_browse_loss_pct
FROM search_log;
-- 100,000 → 69,982（69.98%）→ 63,129（63.13%）；流失 30.02% vs 9.79%`,
  },

]

// ---------------- 技能栈 ----------------
export const skills = {
  // 首页"技能速览"卡片
  groups: [
    {
      title: '编程语言',
      summary: 'Python / SQL 为主，掌握 R，具备 AI 全栈开发经验',
      icon: 'code',
    },
    {
      title: '工具与框架',
      summary: 'FastAPI · MySQL · ERP 系统 · Pandas · Tableau',
      icon: 'database',
    },
    {
      title: '业务能力',
      summary: '财务数字化 · 用户行为分析 · 机器学习建模 · BI 看板开发',
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
      '围绕搜索-点击-浏览链路开展专项分析，量化搜索到点击流失 30.02%、点击到浏览流失 9.79%，定位优化优先级在第一段',
      '清洗 10 万条用户搜索行为日志（18 个字段）：完成缺失值 MCAR 检验与字段口径一致性核查，定位 result_rank 字段口径矛盾',
      '用单变量 AUC、互信息、逻辑回归与梯度提升树交叉验证，验证现有字段不携带点击信号；加打乱标签对照组排除流程泄漏，输出 12 张图表与埋点改造建议',
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
