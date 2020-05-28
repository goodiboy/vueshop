<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 警告 -->
      <el-alert
        show-icon
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false">
      </el-alert>
      <!-- 选择商品分类 -->
      <el-row class="cat-opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            clearable
            ref="parentCate"
            v-model="selectedCate"
            :options="cateList"
            :props="cateProps"
            @change="changeHandle"></el-cascader>
        </el-col>
        <el-col></el-col>
      </el-row>
      <!-- Tabs 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isDisabled">静态属性</el-button>
          <tab-table :tabData="onlyTabData"></tab-table>
        </el-tab-pane>
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isDisabled">动态参数</el-button>
          <tab-table :tabData="manyTabData"></tab-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import TabTable from './TabTable'

export default {
  name: 'Params',
  data () {
    return {
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 已选择的分类
      selectedCate: [],
      // 当前的tag标签
      activeName: 'only',
      // 静态属性列表
      onlyTabData: [],
      // 动态参数列表
      manyTabData: []
    }
  },
  components: {
    TabTable
  },
  created () {
    this.getCateList()
  },
  computed: {
    // 按钮是否可以点击
    isDisabled () {
      return !this.selectedCate.length > 0
    },
    cateId () {
      return this.selectedCate.length ? this.selectedCate[2] : null
    }
  },
  methods: {
    // 获取页面列表数据
    async getCateList () {
      const { data: res } = await this.$axios.get('categories')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
    },
    // 选择分类改变触发的事件
    changeHandle () {
      console.log(this.selectedCate)
      this.getParamsList()
    },
    // tabs切换触发事件
    handleClick () {
      if (!this.isDisabled) {
        this.getParamsList()
      }
    },
    // 获取参数列表
    async getParamsList () {
      if (this.isDisabled) return
      const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      if (this.activeName === 'only') {
        this.onlyTabData = res.data
      } else {
        this.manyTabData = res.data
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .cat-opt {
    margin-top: 20px;
  }

  .el-tabs {
    margin-top: 20px;
  }
</style>
