<template>
  <div>
<!--    面包屑导航区域-->
    <breadcrumb>
      <span slot="b-1">商品管理</span>
      <span slot="b-2">商品列表</span>
    </breadcrumb>
<!--    卡片视图区域-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <div>
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
              <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
<!--      table表格区域-->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="103px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="78px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160px">
          <template v-slot="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[3, 5, 8, 10]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import Breadcrumb from "../common/Breadcrumb";
  export default {
    name: "List",
    components: {
      Breadcrumb
    },
    data() {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 5
        },
        // 商品列表
        goodsList: [],
        // 总数据条数
        total: 0
      }
    },
    created() {
      this.getGoodsList()
    },
    methods: {
      // 根据分页获取对应的商品列表
      async getGoodsList() {
        const {data: res} = await this.$http.get('goods', {params: this.queryInfo})
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品列表失败！')
        }
        this.goodsList = res.data.goods
        this.total = res.data.total
      },
      // 分页
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getGoodsList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getGoodsList()
      },
      async removeById(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除！')
        }
        const {data: res} = await this.$http.delete(`goods/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败！')
        }
        this.$message.success('删除成功！')
        this.getGoodsList()
      },
      goAddpage() {
        this.$router.push('/goods/add')
      }
    }
  }
</script>

<style scoped>

</style>