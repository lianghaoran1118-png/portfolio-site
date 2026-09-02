import { ref, computed } from 'vue'
import * as zh from './data/content.js'
import * as en from './data/en.js'

// ============================================================
// 轻量中英文切换（无第三方依赖）
// - lang: 当前语言 'zh' | 'en'（持久化到 localStorage）
// - useContent(): 返回响应式内容对象（中文=content.js，英文=en.js）
// - ui: 组件静态文案（按钮、提示等）
// ============================================================

const STORAGE_KEY = 'site-lang'
const lang = ref(localStorage.getItem(STORAGE_KEY) || 'zh')

function setLang(l) {
  lang.value = l
  localStorage.setItem(STORAGE_KEY, l)
  document.documentElement.lang = l
  document.dispatchEvent(new Event('langchange'))
}

// 初始化 html lang
document.documentElement.lang = lang.value

const t = computed(() => (lang.value === 'en' ? en : zh))

function useContent() {
  return t
}

// 组件静态文案
const ui = computed(() =>
  lang.value === 'en'
    ? {
        navHome: 'Home',
        navProjects: 'Projects',
        navSkills: 'Skills',
        navAbout: 'About',
        downloadResume: 'Download Resume',
        quickNav: 'Quick Links',
        contact: 'Contact',
        projectPortfolio: 'Project Portfolio',
        home: 'Home',
        projectsPage: 'Projects',
        skillsPage: 'Skills',
        aboutPage: 'About',
        viewAllProjects: 'View all projects',
        viewFullSkills: 'View full skills',
        emailMe: 'Email me',
        download: 'Download',
        keyResults: 'Key Results',
        copy: 'Copy',
        copied: 'Copied',
        clickToZoom: 'Click to zoom',
        prevImage: 'Previous',
        nextImage: 'Next',
        viewImage: 'View image',
        close: 'Close',
        imagePlaceholder: 'Screenshot placeholder',
        placeholderHint: 'Place screenshots in public/images/ and set imageSrc in content.js',
        homeTitle: 'Home',
        projectsTitle: 'Project Portfolio',
        skillsTitle: 'Skills',
        aboutTitle: 'About Me',
        footerTag: 'Pure static site · Vite + Vue 3 + TailwindCSS · No backend',
        allRights: 'Personal portfolio',
        locationTarget: 'Target locations',
        jobIntent: 'Job Intent',
        resumeHint: 'Resume file: public/resume/resume.pdf (replace with yours)',
        noImage: 'No screenshot configured',
        viewProjects: 'View Projects',
        featuredProjects: 'Featured Projects',
        viewDetails: 'View Details',
        skillsOverview: 'Skills Overview',
        contactCta: 'Looking forward to connecting with you',
        contactCtaDesc: 'Feel free to reach out via email.',
        featuredSubtitle: 'From building the AR dashboard end-to-end to a RAG resume Agent, these projects showcase data development and AI application practice.',
        skillsSubtitle: 'A three-dimensional capability structure of languages, tools and business skills.',
        projectsDesc: 'From building the ARDashboard AR management dashboard end-to-end (requirement alignment, data modeling, API development to visualization delivery), to ERP data integration & ETL modeling, to a RAG resume Agent - showcasing complete practice in data analysis, ERP integration and AI applications.',
        skillsDesc: 'A combination of programming languages, tools and business capabilities focused on data development and AI applications. Proficiency levels reference project practice and can be updated over time.',
        programmingLanguages: 'Programming Languages',
        toolsFrameworks: 'Tools & Frameworks',
        businessCapabilities: 'Business Capabilities',
        educationTitle: 'Education',
        internshipsTitle: 'Internships',
        awardsTitle: 'Awards',
        jobIntentTitle: 'Job Intent',
        targetPositions: 'Target positions',
        targetLocation: 'Target locations',
        targetIndustry: 'Target industries',
        contactInfo: 'Contact',
      }
    : {
        navHome: '首页',
        navProjects: '项目作品集',
        navSkills: '技能栈',
        navAbout: '关于我',
        downloadResume: '下载简历',
        quickNav: '快速导航',
        contact: '联系方式',
        projectPortfolio: '项目作品集',
        home: '首页',
        projectsPage: '项目作品集',
        skillsPage: '技能栈',
        aboutPage: '关于我',
        viewAllProjects: '查看全部项目',
        viewFullSkills: '查看完整技能栈',
        emailMe: '邮件联系',
        download: '下载简历',
        keyResults: '关键成果',
        copy: '复制',
        copied: '已复制',
        clickToZoom: '点击放大',
        prevImage: '上一张',
        nextImage: '下一张',
        viewImage: '查看图片',
        close: '关闭',
        imagePlaceholder: '截图占位',
        placeholderHint: '请将截图放入 public/images/ 并修改 content.js 中的 imageSrc',
        homeTitle: '首页',
        projectsTitle: '项目作品集',
        skillsTitle: '技能栈',
        aboutTitle: '关于我',
        footerTag: '纯静态站点 · Vite + Vue 3 + TailwindCSS · 无需后端',
        allRights: '个人作品集',
        locationTarget: '求职地区',
        jobIntent: '求职意向',
        resumeHint: '简历文件：public/resume/resume.pdf（替换为你的简历即可）',
        noImage: '未配置截图',
        viewProjects: '查看项目',
        featuredProjects: '项目精选',
        viewDetails: '查看详情',
        skillsOverview: '技能速览',
        contactCta: '期待与您进一步沟通',
        contactCtaDesc: '欢迎通过邮箱联系我。',
        featuredSubtitle: '从应收管理看板的完整搭建到 RAG 简历 Agent，多个代表性项目，展示数据开发与 AI 应用实践。',
        skillsSubtitle: '编程语言、工具框架与业务能力的三维能力结构。',
        projectsDesc: '从 ARDashboard 应收管理看板的完整搭建（需求口径梳理、数据建模、接口开发到可视化交付），到 ERP 数据接入与 ETL 建模，再到 RAG 简历问答 Agent，展示我在数据分析、ERP 对接与 AI 应用上的完整实践。',
        skillsDesc: '编程语言、工具框架与业务能力的组合，聚焦数据开发与 AI 应用方向。熟练度以项目实践为参考，可随经历更新。',
        programmingLanguages: '编程语言',
        toolsFrameworks: '工具与框架',
        businessCapabilities: '业务能力',
        educationTitle: '教育背景',
        internshipsTitle: '实习经历',
        awardsTitle: '荣誉奖项',
        jobIntentTitle: '求职意向',
        targetPositions: '目标岗位',
        targetLocation: '意向地区',
        targetIndustry: '意向行业',
        contactInfo: '联系方式',
      }
)

export { lang, setLang, useContent, ui }
