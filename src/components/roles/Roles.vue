<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-button type="primary" @click="showRolesDialog('添加角色')">添加角色</el-button>
      <el-table
        :data="rolesList"
        stripe
        border>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row class="border1 center" v-for="(item1,n1) of scope.row.children" :key="n1">
              <el-col :span="5">
                <el-tag closable @close="removeRightDialog(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class=" el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row class="border2 center" v-for="(item2,n2) of item1.children" :key="n2">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightDialog(scope.row,item2.id)">{{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="(item3,n3) of item2.children" :key="n3"
                            closable
                            type="warning"
                            @close="removeRightDialog(scope.row,item3.id)">{{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="权限等级" width="300px">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showRolesDialog('编辑角色',scope.row.id)">编辑
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRolesDialog(scope.row.id)">删除
            </el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showRightsDialog(scope.row)">权限分配
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加/编辑角色弹窗 -->
    <el-dialog :title="rolesFormTitle" :visible.sync="rolesFormVisible" :close-on-click-modal="false"
               @close="rolesFormVisible = false">
      <el-form :model="rolesForm" ref="rolesForm" label-width="80px" :rules="rolesRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model.trim="rolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model.trim="rolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rolesFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRolesForm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色分配 -->
    <el-dialog title="权限分配" width="50%" :visible.sync="setRightsVisible" :close-on-click-modal="false">
      <el-tree
        node-key="id"
        ref="rightsTree"
        :data="rightsTree"
        :props="treeProps"
        :default-checked-keys="defaultKeys"
        show-checkbox
        default-expand-all>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRightsVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitChangeRight">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      // 角色列表
      rolesList: [],
      // 添加角色表单
      rolesForm: {
        roleName: '',
        roleDesc: ''
      },
      rolesFormVisible: false,
      // 角色规则
      rolesRules: {
        roleName: [
          {
            required: true,
            message: '角色明不能为空',
            triangle: 'blur'
          }
        ]
      },
      // 表单的标题
      rolesFormTitle: '',
      // 权限分配
      setRightsVisible: false,
      // 树型结构的字段
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 树节点的结构
      rightsTree: [],
      // 默认选中的节点
      defaultKeys: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
    },
    // 提交表单
    submitRolesForm () {
      if (this.rolesFormTitle === '添加角色') {
        this.addRolesHandle()
      } else {
        this.editRoles()
      }
    },
    // 添加角色
    addRolesHandle () {
      this.$refs.rolesForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.post('roles', {
          roleName: this.rolesForm.roleName,
          roleDesc: this.rolesForm.roleDesc
        })
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$refs.rolesForm.resetFields()
        this.$message.success(res.meta.msg)
        this.rolesFormVisible = false
        await this.getRolesList()
      })
    },
    // 删除用户信息弹窗提示
    deleteRolesDialog (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRoles(id)
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
    // 根据id删除单个角色
    async deleteRoles (id) {
      const { data: res } = await this.$axios.delete(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      await this.getRolesList()
      this.rolesFormVisible = false
    },
    // 编辑角色
    async editRoles () {
      const { data: res } = await this.$axios.put(`roles/${this.rolesForm.roleId}`, {
        roleName: this.rolesForm.roleName,
        roleDesc: this.rolesForm.roleDesc
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      await this.getRolesList()
      this.rolesFormVisible = false
    },
    // 根据id获取角色信息
    async getRoles (id) {
      const { data: res } = await this.$axios.get(`roles/${id}`)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesForm = res.data
    },
    /**
     * 显示添加编辑表单弹窗
     * @param title 弹窗的标题
     * @param id 角色的id，带有这个参数代表编辑
     */
    showRolesDialog (title, id) {
      this.rolesFormTitle = title
      if (id) {
        this.getRoles(id)
      } else {
        if (this.$refs.rolesForm) {
          this.$refs.rolesForm.resetFields()
        }
      }
      this.rolesFormVisible = true
    },
    // 删除用户权限弹窗
    removeRightDialog (rowData, rightId) {
      this.$confirm('此操作将永久删除该角色权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeRight(rowData, rightId)
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
    // 删除用户权限
    async removeRight (rowData, rightId) {
      const { data: res } = await this.$axios.delete(`roles/${rowData.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      rowData.children = res.data
    },
    // 显示添加权限的弹窗
    async showRightsDialog (rowData) {
      // 存储角色的id
      this.rowId = rowData.id
      this.defaultKeys = []
      const { data: res } = await this.$axios('rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightsTree = res.data
      this.getDefaultKeys(rowData)
      this.setRightsVisible = true
    },
    /**
     * 递归获取全部的三级菜单的id
     * @param rowData 源数据
     * @returns number
     */
    getDefaultKeys (rowData) {
      if (!rowData.children) {
        return this.defaultKeys.push(rowData.id)
      }
      rowData.children.forEach(item => this.getDefaultKeys(item))
    },
    // 提交分配权限事件
    submitChangeRight () {
      const arrId = [
        ...this.$refs.rightsTree.getCheckedKeys(),
        ...this.$refs.rightsTree.getHalfCheckedKeys()
      ]
      const rids = arrId.join(',')
      this.roleAuthorize(rids)
    },
    // 角色授权
    async roleAuthorize (rids) {
      const { data: res } = await this.$axios.post(`roles/${this.rowId}/rights`, {
        roleId: this.rowId,
        rids
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      await this.getRolesList()
      this.setRightsVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }

  .border1 {
    border-top: 1px solid #eee;

    &:last-child {
      border-bottom: 1px solid #eee;
    }
  }

  .border2 {
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }
  }

  .center {
    display: flex;
    align-items: center;
  }
</style>
