<template>
  <div class="container">
    <div class="center">
      <div class="title">系统登录</div>
      <form>
        <input
          class="input"
          type="text"
          placeholder="用户名"
          @blur="userOnEmpty()"
          v-model="LoginName"
        />
        <span class="user" v-if="userToast">*请输入用户名</span>
        <input
          class="input"
          type="password"
          placeholder="密码"
          @blur="passwordOnEmpty()"
          v-model="LoginPwd"
        />
        <span class="password" v-if="passwordToast">*请输入密码</span>
        <transition name="loginam">
          <div
            class="login"
            :class="onclick"
            type="button"
            @mouseenter="enter"
            @mouseleave="leave"
            @click="submitForm"
          >登录</div>
        </transition>
      </form>
    </div>
  </div>
</template>

<script>
import { loginT } from '../api/api'
import { Loading } from 'element-ui'
import Axios from 'axios'
export default {
  data() {
    return {
      flage: false,
      userToast: false,
      passwordToast: false,
      LoginName: 'admin',
      LoginPwd: '123456'
    }
  },
  mounted() {
    this.$notify.info({
      title: '提示',
      message: '用户名:admin   密码:123456',
      duration: 8000,
      showClose: true
    })
  },
  computed: {
    onclick() {
      return {
        loginonclick: this.flage === true ? 'loginonclick' : ''
      }
    }
  },
  methods: {
    enter() {
      //鼠标放上按钮
      this.flage = true
    },
    leave() {
      //鼠标离开按钮
      this.flage = false
    },
    userOnEmpty() {
      //用户名是否为空
      if (this.LoginName.length == 0) {
        this.userToast = true
      } else {
        this.userToast = false
      }
    },
    passwordOnEmpty() {
      //密码框是否为空
      if (this.LoginPwd.length == 0) {
        this.passwordToast = true
      } else {
        this.passwordToast = false
      }
    },
    submitForm() {
      //登录
      let { LoginName, LoginPwd } = this
      if (!LoginName) return (this.userToast = true)
      if (!LoginPwd) return (this.passwordToast = true)
      let loadingInstance = Loading.service({
        text: '加载中',
        background: 'rgba(70, 65, 65, 0.6)'
      })
      loginT({ LoginName, LoginPwd })
        .then(res => {
          if (res.data.Code !== 200) {
            loadingInstance.close()
            this.$message({
              showClose: true,
              message: res.data.ErrMessage,
              type: 'error'
            })
            return
          }
          this.$message.success('登录成功!')
          loadingInstance.close()
          window.sessionStorage.setItem('token', res.data.Data)
          this.$router.push('/home')
        })
        .catch(err => {
          loadingInstance.close()
          console.log('err', err)
          this.$message({
            showClose: true,
            message: '网络不给力，再试试吧',
            type: 'error'
          })
        })
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  @media screen and (max-width: 600px) {
    .center {
      width: 300px !important;
      height: 450px !important;
    }
    .input {
      width: 250px !important;
    }
    .user {
      position: absolute;
      top: 175px;
      left: 30px !important;
      font-size: 12px;
      color: #ab3838;
    }
    .password {
      position: absolute;
      top: 283px !important;
      left: 30px !important;
      font-size: 12px;
      color: #ab3838;
    }
  }
  width: 100%;
  height: 100%;
  background: url('../assets/bg.jpg') no-repeat center;
  background-size: auto;
  user-select: none;
  .center {
    width: 400px;
    height: 500px;
    background-color: rgba(5, 5, 5, 0.65);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    border-radius: 20px;
    .title {
      font-size: 30px;
      font-weight: bold;
      color: #c7a3c7;
      margin-top: 20px;
    }
    .input {
      display: block;
      border: none;
      background-color: rgba(5, 5, 5, 0);
      border-bottom: 1px solid #c7a3c7;
      margin: 69px auto;
      width: 260px;
      padding: 10px;
      color: #d8b3d8;
    }
    .user {
      position: absolute;
      top: 175px;
      left: 57px;
      font-size: 12px;
      color: #ab3838;
    }
    .password {
      position: absolute;
      top: 283px;
      left: 57px;
      font-size: 12px;
      color: #ab3838;
    }
    input::-webkit-input-placeholder {
      color: #e091e7;
    }
    input:focus {
      border-bottom: #e683e6;
      outline-color: #f7d5f7;
    }
    .login {
      width: 70px;
      transition: width 0.5s;
      height: 70px;
      font-size: 15px;
      border-radius: 35px;
      border: 0;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      line-height: 70px;
      background: -webkit-gradient(
        linear,
        0 0,
        0 100%,
        from(#c7a3c7),
        to(#e683e6)
      ); //
      outline: none;
    }
    .loginonclick {
      background-color: #fff;
      width: 300px;
      cursor: pointer;
      border-radius: 35px;
    }
  }
}
.el-loading-spinner /deep/ .circular .path {
  stroke: #01ffff !important;
}
</style>
