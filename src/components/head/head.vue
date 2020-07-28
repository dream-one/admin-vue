<template>
  <el-header class="container">
    <div class="left">
      <i @click="isCollapse" :class="collapseIcon"></i>
    </div>

    <div class="right">
      <el-dropdown @command="handleCommand" placement="bottom" style="float:right" class="right">
        <span class="el-dropdown-link">
          {{userName}}
          <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <img
          src="https://ss1.bdstatiFc.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1323333605,4050265276&fm=26&gp=0.jpg"
          alt
        />
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item icon="el-icon-s-home" @command="this.$route.replace('/1')">首页</el-dropdown-item> -->
          <el-dropdown-item icon="el-icon-edit" command="index">修改信息</el-dropdown-item>
          <el-dropdown-item icon="el-icon-switch-button" command="Exit">登出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 欢迎：{{userName}} 所属单位：{{organizationName}} -->
    </div>
    <el-dialog title="账号信息" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form label-position="right" label-width="100px" :model="formLabelAlign">
        <el-form-item label="用户名">
          <el-input :disabled="true" v-model="formLabelAlign.name"></el-input>
        </el-form-item>
        <el-form-item label="旧密码">
          <el-input type="password" v-model="formLabelAlign.oldPwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input type="password" v-model="formLabelAlign.newPwd"></el-input>
        </el-form-item>
        <el-form-item label="重复新密码">
          <el-input type="password" v-model="formLabelAlign.newPwdRepeat"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </el-header>
</template>

<script>
import { mapState } from 'vuex'
import { EditUser } from '../../api/api'
export default {
  data() {
    return {
      dialogVisible: false,
      formLabelAlign: {
        name: '',
        oldPwd: '',
        newPwd: '',
        newPwdRepeat: ''
      }
    }
  },
  // props: ['collapseIcon', 'routePath'],
  props: {
    collapseIcon: String,
    routePath: String
  },
  methods: {
    isCollapse() {
      this.$emit('listenCollapse')
    },
    submit() {
      if (this.formLabelAlign.newPwd !== this.formLabelAlign.newPwdRepeat) {
        return this.$message.error('两次密码输入不一致!')
      }
      let { name, oldPwd, newPwd, newPwdRepeat } = this.formLabelAlign
      if (oldPwd == '' || newPwd == '' || newPwdRepeat == '') {
        return this.$message.error('输入框不能为空')
      }
      if(oldPwd==newPwd){
        return this.$message.error('旧密码与新密码不能相同！')
      }
      EditUser({ userName: name, oldPwd, newPwd }).then(res => {
        if (res.Data == '修改成功') {
          this.$message.success('修改成功')
        } else {
          return this.$message.error(res.Data)
        }
      })
      this.handleClose()
    },
    handleClose(done) {
      this.dialogVisible = false
      this.formLabelAlign.name = ''
      this.formLabelAlign.oldPwd = ''
      this.formLabelAlign.newPwd = ''
      this.formLabelAlign.newPwdRepeat = ''
    },
    handleCommand(command) {
      if (command == 'index') {
        this.dialogVisible = true
        this.formLabelAlign.name = this.$store.state.userName
      }
      if (command == 'Exit') {
        sessionStorage.clear()
        localStorage.clear()
        location.reload()
        // this.$router.replace('/Login')
      }
    }
  },
  computed: mapState({
    // 箭头函数可使代码更简练
    userName: state => state.userName,
    organizationName: state => state.organizationName
  }),
  watch: {}
}
</script>

<style lang="less" scoped>
.container {
  height: 45px !important;
  width: 100%;
  position: absolute;
  background-color: rgb(255, 255, 255) !important;
  border-bottom: #e8e8e8 1px solid;
  .left {
    float: left;
    display: flex;
    align-items: center;
    height: 45px;
    i {
      margin-right: 25px;
      cursor: pointer;
    }
  }
  .right {
    line-height: 45px;
    float: right;
    margin-right: 80px;
    padding: 0 10px 0 10px;
    position: fixed;
    right: -50px;
    height: 45px;
    display: flex;
    align-items: center;
    font-size: 15px;
    user-select: none;
    cursor: pointer;
    i {
      margin: 5px;
    }
    img {
      height: 35px;
      width: 35px;
      border-radius: 50%;
    }
  }
  .right:hover {
    background-color: rgba(236, 236, 236, 0.5);
  }
}
</style>
