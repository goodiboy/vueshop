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
    name: 'login',
    component: () => import('../components/Login')
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/welcome',
    component: () => import('../components/Home'),
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: () => import('../components/Welcome')
      },
      {
        path: '/users',
        name: 'users',
        component: () => import('../components/user/Users')
      },
      {
        path: '/roles',
        name: 'roles',
        component: () => import('../components/roles/Roles')
      }
    ]
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
