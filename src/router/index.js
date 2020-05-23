import Vue from 'vue'
import VueRouter from 'vue-router'
import loginRouter from './loginRouter'
import homeRouter from './homeRouter'

Vue.use(VueRouter)

const routes = [
  ...loginRouter,
  ...homeRouter
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
