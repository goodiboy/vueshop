import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../components/Login')
  },
  {
    path: '/home',
    component: () => import('../components/Home')
  },
  {
    path: '*',
    component: () => import('../components/404')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  if (!localStorage.getItem('token')) return next('/login')
  next()
})

export default router
