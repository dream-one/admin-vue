<template>
  <el-header class="container">
    <div class="left">
      <i @click="isCollapse" :class="collapseIcon"></i>

    </div>

    <div class="right">
      <!-- <el-dropdown placement="bottom" style="float:right" class="right">
        <span class="el-dropdown-link">
       {{userName}}
          <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <img
          src="https://ss1.bdstatiFc.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1323333605,4050265276&fm=26&gp=0.jpg"
          alt
        />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-s-home" @command="this.$route.replace('/1')">首页</el-dropdown-item>
          <el-dropdown-item icon="el-icon-user-solid">个人中心</el-dropdown-item>
          <el-dropdown-item icon="el-icon-switch-button">登出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>-->
      欢迎：{{userName}} 所属单位：{{organizationName}}
    </div>
  </el-header>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {

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
    }
  },
  computed: mapState({
    // 箭头函数可使代码更简练
    userName: state => state.userName,
    organizationName: state => state.organizationName
  }),
  watch: {

  }
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
