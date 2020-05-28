<template>
  <div>
    <el-table
      :data="tabData"
      stripe
      border>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="attr_name" label="参数名称"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'TabTable',
  props: ['tabData']
}
</script>

<style scoped>

</style>
