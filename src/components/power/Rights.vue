<template>
  <div>
<!--    面包屑导航区区域-->
    <breadcrumb>
      <span slot="b-1">权限管理</span>
      <span slot="b-2">权限列表</span>
    </breadcrumb>
<!--    卡片视图-->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级"prop="level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else-if="scope.row.level === '2'" type="warning">三级</el-tag>
            <el-tag v-else-if="scope.row.level === '2'" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import Breadcrumb from "../common/Breadcrumb";

  export default {
    name: "Rights",
    components: {
      Breadcrumb
    },
    data() {
      return {
        // 权限列表
        rightsList: []
      }
    },
    created() {
      this.getRightsList()
    },
    methods: {
      // 获取权限列表
      async getRightsList() {
        const {data: res} = await this.$http.get('rights/list', this.rightsList)
        if (res.meta.status !== 200) {
          return this.$message.error('获取权限列表失败！')
        }
        this.rightsList = res.data
      }
    }
  }
</script>

<style scoped>

</style>