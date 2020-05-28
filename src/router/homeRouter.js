export default [
  {
    path: '/home',
    name: 'home',
    redirect: '/welcome',
    component: () => import('../components/Home'),
    children: [
      // 欢迎页
      {
        path: '/welcome',
        name: 'welcome',
        component: () => import('../components/Welcome')
      },
      // 用户信息页
      {
        path: '/users',
        name: 'users',
        component: () => import('../components/user/Users')
      },
      // 角色页
      {
        path: '/roles',
        name: 'roles',
        component: () => import('../components/roles/Roles')
      },
      // 权限页
      {
        path: '/rights',
        name: 'rights',
        component: () => import('../components/power/Rights')
      },
      // 商品管理
      {
        path: '/categories',
        name: 'categories',
        component: () => import('../components/goods/Cate')
      },
      {
        path: '/params',
        name: 'params',
        component: () => import('../components/goods/Params')
      }
    ]
  }
]
