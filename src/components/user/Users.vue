<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索 -->
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="userList"
        stripe
        border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态" width="100px">
          <!-- 作用域插槽 -->
          <template v-slot="scope">
            <el-switch @change="changeStatus(scope.row)" v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-tooltip content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="deleteUserDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户弹窗 -->
    <el-dialog title="添加用户" :visible.sync="addUserFormVisible" :close-on-click-modal="false"
               @close="addUserClose">
      <el-form :model="addUserForm" ref="addUserForm" label-width="80px" :rules="addUserRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model.trim="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户弹窗 -->
    <el-dialog title="修改用户信息" :visible.sync="editUserFormVisible" :close-on-click-modal="false"
               @close="editUserFormVisible = false">
      <el-form :model="editUserForm" ref="editUserForm" label-width="80px" :rules="addUserRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model.trim="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeUserInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import commonRules from './commonRules'

export default {
  name: 'Users',
  data () {
    return {
      // 请求用户列表参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 用户列表总数
      total: 0,
      // 用户列表数据
      userList: [],
      // 表单参数
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''

      },
      // 显示隐藏弹窗
      addUserFormVisible: false,
      // 表单验证
      addUserRules: {
        username: commonRules.username,
        password: commonRules.password,
        email: commonRules.email,
        mobile: commonRules.mobile
      },
      // 编辑的用户信息
      editUserForm: {},
      editUserFormVisible: false
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户数据
    async getUserList () {
      const { data: res } = await this.$axios.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 修改每页显示多少
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 修改页码
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getUserList()
    },
    // 修改状态
    async changeStatus (userInfo) {
      const { data: res } = await this.$axios.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        // 如果请求失败，则把不更新switch的状态
        this.$nextTick(() => {
          userInfo.mg_state = !userInfo.mg_state
        })
        return this.$message.error('更新用户状态失败')
      }
    },
    // 关闭添加用户弹窗
    addUserClose () {
      this.$refs.addUserForm.resetFields()
    },
    // 添加用户
    addUser () {
      console.log(this.$refs)
      this.$refs.addUserForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$axios.post('users', this.addUserForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$refs.addUserForm.resetFields()
        this.addUserFormVisible = false
      })
    },
    // 编辑用户信息
    async editUser (id) {
      const { data: res } = await this.$axios.get(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editUserFormVisible = true
      this.editUserForm = res.data
    },
    async changeUserInfo () {
      const { data: res } = await this.$axios.put(`users/${this.editUserForm.id}`, {
        id: this.editUserForm.id,
        email: this.editUserForm.email,
        mobile: this.editUserForm.mobile
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('用户信息修改成功')
      this.$refs.editUserForm.resetFields()
      await this.getUserList()
      this.editUserFormVisible = false
    },
    // 删除用户信息弹窗提示
    deleteUserDialog (id) {
      console.log(id)
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteUser(id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除单个用户
    async deleteUser (id) {
      const { data: res } = await this.$axios.delete(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      await this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
  .el-table {
    margin-top: 20px;
  }

  .el-pagination {
    margin-top: 15px;
  }
</style>
