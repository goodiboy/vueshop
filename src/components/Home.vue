<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header class="header">
      <!-- 左侧logo -->
      <div>
        <img src="../assets/images/logo.png" class="logo" alt="">
        <span>电商后台管理系统</span>
      </div>
      <!-- 右侧按钮 -->
      <el-button type="danger" @click="exitLogin">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="menuCollapse ? '' :'200px'" class="aside">
        <div class="toggle-button" @click="toggleMenu">|||</div>
        <!-- 菜单 -->
        <el-menu
          :default-active="'/' + $route.name"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="menuCollapse"
          :collapse-transition="false"
          router
          unique-opened>
          <el-submenu :index="item.id + ''" v-for="item of menuList" :key="item.id">
            <template slot="title">
              <i :class="menuIcons[item.id]" class="menuIcon"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/' + subItem.path" @click="currentPath = '/' + subItem.path"
                          v-for="subItem of item.children" :key="subItem.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      menuList: [],
      menuIcons: {
        125: 'iconfont icon-user',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        103: 'iconfont icon-tijikongjian',
        145: 'iconfont icon-baobiao'
      },
      menuCollapse: false,
      currentPath: '/users'
    }
  },
  created () {
    this.getMenuList()
  },
  computed: {
    count () {
      return this.$store.state.count
    }
  },
  methods: {
    // 退出登陆
    exitLogin () {
      this.$store.commit('clearToken')
      localStorage.setItem('token', '')
      this.$router.push('/login')
    },
    // 获取左侧菜单列表
    async getMenuList () {
      const { data: res } = await this.$axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 展开隐藏菜单
    toggleMenu () {
      this.menuCollapse = !this.menuCollapse
    }
  }
}
</script>

<style lang="less" scoped>

  .home-container {
    height: 100%;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #373d41;
    color: #fff;

    > div {
      display: flex;
      align-items: center;
      height: 100%;

      > span {
        margin-left: 15px;
      }
    }
  }

  .logo {
    height: 100%;
  }

  .aside {
    background: #333744;

    .toggle-button {
      background: #4a5064;
      letter-spacing: 5px;
      font-size: 12px;
      text-align: center;
      line-height: 26px;
      color: #fff;
      cursor: pointer;
      user-select: none;
    }

    .el-menu {
      border: none
    }
  }

  .main {
    background: #eaedf1;
  }

  .menuIcon {
    margin-right: 6px;
  }
</style>
