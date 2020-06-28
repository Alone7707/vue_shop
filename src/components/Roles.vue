<template>
  <div>
<!--    面包屑导航区区域-->
    <breadcrumb>
      <span slot="b-1">权限列表</span>
      <span slot="b-2">权限管理</span>
    </breadcrumb>
<!--    卡片-->
    <el-card>
<!--      添加角色按钮区域-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
<!--      角色列表区域-->
      <el-table :data="rolesList" border stripe>
<!--        展开列-->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row :class="['vcenter', 'bdbottom', i1 ===0 ? 'bdtop' : '']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
<!--              渲染一级权限-->
              <el-col :span="5">
                <el-tag  closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
<!--              渲染二级和三级权限-->
              <el-col :span="19">
<!--                通过for循环嵌套渲染二级权限-->
                <el-row v-for="(item2, i2) in item1.children" :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"  :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}  </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
<!--        索引列-->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRolesById(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
<!--    修改用户对话框-->
    <el-dialog
            title="提示"
            :visible.sync="editDialogVisible"
            width="40%"
            @close="editDialogClosed"
            >
      <el-form ref="editRolesForm" :model="editRolesForm" :rules="editFormRules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
       <el-button @click="editDialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="editRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
<!--    添加角色对话框-->
    <el-dialog
            title="添加角色"
            :visible.sync="addRolesDialogVisible"
            width="50%">
      <el-form :model="addRolesFrom" :rules="editFormRules" ref="addRolesFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesFrom.roleName"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="addRolesFrom" :rules="editFormRules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoles">确 定</el-button>
  </span>
    </el-dialog>
<!--    分配权限的对话框-->
    <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="50%" @close="setRightDialogClosed">
<!--      树形控件-->
      <el-tree :data="rightsList" :props="rightTreeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Breadcrumb from "./common/Breadcrumb";
  export default {
    name: "Roles",
    components: {
      Breadcrumb
    },
    data() {
      return {
        rolesList: [],
        editRolesForm: {},
        editDialogVisible: false,
        editFormRules: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'}
          ],
          roleDesc: [
            { required: true, message: '请输入角色描述', trigger: 'blur' }
          ]
        },
        addRolesDialogVisible: false,
        addRolesFrom: {
          roleName: '',
          roleDesc: ''
        },
        // 控制分配权限对话框的显示与隐藏
        setRightDialogVisible: false,
        // 所有权限的数据
        rightsList: [],
        // 树形控件的属性绑定对象
        rightTreeProps: {
          label: 'authName',
          children: 'children'
        },
        defKeys: [],
        // 当前即将分配权限的角色id
        roleId: ''
      }
    },
    created() {
      this.getRolesList()
    },
    methods: {
      // 获取角色列表
      async getRolesList() {
        const {data: res} = await this.$http.get('roles', this.rolesList)
        if (res.meta.status !== 200) {
          return this.$message.error('获取角色列表失败！')
        }
        this.rolesList = res.data
      },
      // 展示编辑角色的对话框
      async showEditDialog(id) {
        const {data: res} = await this.$http.get('roles/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error('请求数据失败')
        }
        this.editRolesForm = res.data
        this.editDialogVisible = true
      },
      // 重置修改对话框关闭前修改的内容
      editDialogClosed() {
        this.$refs.editRolesForm.resetFields()
      },
      // 修改角色信息并提交
      editRolesInfo() {
        this.$refs.editRolesForm.validate(async vaild => {
          if (!vaild) return
          // 发出修改角色信息的数据请求
          const {data: res} = await this.$http.put('roles/' + this.editRolesForm.roleId, this.editRolesForm)
          if (res.meta.status !== 200) {
            this.$message.error('修改角色信息失败！')
          }
          this.$message.success('修改成功！')
          this.editDialogVisible = false
          this.getRolesList()
        })
      },
      async removeRolesById(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
        ).catch(err => err)
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除！')
        }
        const {data: res} = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) {
          this.$message.error('删除角色失败！')
        } else if (res.meta.status == 200) {
          this.$message.success('删除角色成功')
        }
        this.getRolesList()
      },
      // 添加角色信息提交
      addRoles() {
        this.$refs.addRolesFormRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.post('roles/', this.addRolesFrom)
          if (res.meta.status !== 201) {
             this.$message.error('添加角色失败！')
          }
          this.$message.success('添加角色成功！')
          this.addRolesDialogVisible = false
          this.getRolesList()
        })
      },
      // 根据id删除对应的的权限
      async removeRightById(role, rightId) {
        // 弹框提示用户是否删除
        const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        // 判定是否删除该权限
        if (confirmResult !== 'confirm') {
          return this.$message.info('取消了删除！')
        }
        const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !==200) {
          return this.$message.error('删除权限失败！')
        }
        role.children = res.data
      },
      // 展示分配权限的对话框
      async showSetRightDialog(role) {
        this.roleId = role.id
        // 获取所有权限数据
        const {data: res} = await this.$http.get('rights/tree');
        if (res.meta.status !== 200) {
          return this.$message.error('获取权限数据失败!')
        }
        // 获取到的权限数据保存到data中
        this.rightsList = res.data

        //递归获取三级节点的id
        this.getLeafKey(role, this.defKeys)

        this.setRightDialogVisible = true
      },
      // 通过递归的方式，获取角色下所有三级权限的id，并保存到defKeys数组中
      getLeafKey(node, arr) {
         // 如果当前node节点不包含children属性则式三级节点
        if (!node.children){
          return arr.push(node.id)
        }
        node.children.forEach(item => this.getLeafKey(item, arr))
      },
      // 监听分配权限对话框的关闭事件
      setRightDialogClosed() {
        this.defKeys = []
      },
      // 点击为角色分配权限
      async allotRights() {
        const keys = [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idStr = keys.join(',')

        const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
        if (res.meta.status !== 200) {
          return this.$message.error('分配权限失败！')
        }
        this.$message.success('分配权限成功！')
        this.getRolesList()
        this.setRightDialogVisible = false
      }
    }
  }
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>