import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import ProjectsView from './views/ProjectsView.vue'
import SkillsView from './views/SkillsView.vue'
import AboutView from './views/AboutView.vue'
import { lang, ui } from './i18n'

// 使用 Hash 模式：纯静态部署（Vercel / GitHub Pages）无需任何服务端重写配置
const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { titleKey: 'homeTitle' } },
  { path: '/projects', name: 'projects', component: ProjectsView, meta: { titleKey: 'projectsTitle' } },
  { path: '/skills', name: 'skills', component: SkillsView, meta: { titleKey: 'skillsTitle' } },
  { path: '/about', name: 'about', component: AboutView, meta: { titleKey: 'aboutTitle' } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

function applyTitle() {
  const to = router.currentRoute.value
  const titleKey = to.meta.titleKey || 'homeTitle'
  const suffix = lang.value === 'zh' ? '梁浩然 | 秋招个人作品集' : 'Liang Haoran | Portfolio'
  document.title = `${ui.value[titleKey]} · ${suffix}`
}

router.afterEach(applyTitle)
// 语言切换时同步更新浏览器标题
window.addEventListener('langchange', applyTitle)

export default router
