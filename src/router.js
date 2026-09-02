import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import ProjectsView from './views/ProjectsView.vue'
import SkillsView from './views/SkillsView.vue'
import AboutView from './views/AboutView.vue'

// 使用 Hash 模式：纯静态部署（Vercel / GitHub Pages）无需任何服务端重写配置
const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: '首页' } },
  { path: '/projects', name: 'projects', component: ProjectsView, meta: { title: '项目作品集' } },
  { path: '/skills', name: 'skills', component: SkillsView, meta: { title: '技能栈' } },
  { path: '/about', name: 'about', component: AboutView, meta: { title: '关于我' } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = `${to.meta.title} · 梁浩然 | 秋招个人作品集`
})

export default router
