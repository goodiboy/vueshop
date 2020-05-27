<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 添加按钮 -->
      <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>

      <!-- 表格 -->
      <zk-table
        border
        show-index
        class="tree-table"
        index-text="#"
        :data="cardList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false">
        <!-- 是否有效 -->
        <template v-slot:isOk="scope">
          <i class="el-icon-success" style="color: lightgreen" v-if="!scope.row.cat_deleted"></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template v-slot:opt>
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </zk-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类弹窗 -->
    <el-dialog title="添加分类" :visible.sync="addCateFormVisible" :close-on-click-modal="false"
               @close="addCateFormVisible = false">
      <el-form :model="addCateForm" ref="addCateForm" label-width="80px" :rules="addCateRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model.trim="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <div class="block">
            <el-cascader
              clearable
              ref="parentCate"
              v-model="selectedCate"
              :options="parentCateList"
              :props="cateProps"></el-cascader>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCateFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddCateForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data () {
    return {
      // 查询条件
      queryParams: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类数据列表
      cardList: [],
      // 总共有多少条数据
      total: 0,
      // 表格配置
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 控制添加分类弹窗显示隐藏
      addCateFormVisible: false,
      // 添加分类表单信息
      addCateForm: {
        // 分类的名称
        cat_name: '',
        // 添加分类的等级
        cat_level: 0,
        // 父级分类的Id
        cat_pid: 0
      },
      // 添加分类的表单验证规则
      addCateRules: {
        cat_name: [
          {
            required: true,
            message: '分类名称不能为空',
            triangle: 'blur'
          }
        ]
      },
      // 父级分类列表
      parentCateList: [],
      // 列表配置
      cateProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 已选择的父级列表
      selectedCate: []
    }
  },
  created () {
    this.getCardList()
  },
  methods: {
    /**
     * 获取商品分类数据列表
     * @param type 获取数据的类型，不传默认使用this.queryParams
     */
    async getCardList (type) {
      let params
      if (type) {
        params = type
      } else {
        params = this.queryParams
      }
      const { data: res } = await this.$axios.get('categories', { params })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      if (!type) {
        this.cardList = res.data.result
        this.total = res.data.total
      } else {
        this.parentCateList = res.data
      }
    },
    // 修改每页显示多少
    handleSizeChange (newSize) {
      this.queryParams.pagesize = newSize
      this.getCardList()
    },
    // 修改页码
    handleCurrentChange (newNum) {
      this.queryParams.pagenum = newNum
      this.getCardList()
    },
    // 提交添加分类事件
    submitAddCateForm () {
      if (this.selectedCate.length > 0) {
        this.addCateForm.cat_pid = this.selectedCate[this.selectedCate.length - 1]
        this.addCateForm.cat_level = this.selectedCate.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
      this.addCate()
    },
    // 显示添加分类的弹窗事件
    showAddCateDialog () {
      if (this.$refs.addCateForm) {
        this.$refs.addCateForm.resetFields()
      }
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.selectedCate = []
      this.getCardList(2)
      this.addCateFormVisible = true
    },
    // 添加分类请求
    async addCate () {
      this.$refs.addCateForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$axios.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        await this.getCardList()
        this.addCateFormVisible = false
      })
    }
  }
}
</script>

<style scoped>
  .tree-table {
    margin-top: 15px;
  }
</style>
