<template>
  <el-container>
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div class="vueProject">人脸识别测温后台</div>
      <el-menu
        background-color="rgb(58, 63, 81)"
        active-text-color="rgb(79, 137, 174)"
        router
        :default-active="showDefaultMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <fragment v-for="items in menu" :key="items.id">
          <el-submenu v-if="items.children" :index="items.id">
            <template slot="title">
              <i :class="items.icon"></i>
              <span>{{ items.name }}</span>
            </template>
            <el-menu-item
              :index="subItems.id"
              v-for="subItems in items.children"
              :key="subItems.id"
            >{{ subItems.name }}</el-menu-item>
          </el-submenu>

          <el-menu-item v-else :index="items.id" :key="items.id">
            <i :class="items.icon"></i>
            <span slot="title">{{ items.name }}</span>
          </el-menu-item>
        </fragment>
      </el-menu>
    </el-aside>
    <el-container>
      <elHead
        :routePath="showDefaultMenu"
        :collapseIcon="iconName"
        @listenCollapse="updateCollapse"
      ></elHead>
      <el-main style="padding-top:75px;background-color:#f0f3f4">
        <transition name="component-fade" mode="out-in">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenu, GetMenu } from '../api/api'
import { L1Router, L23Router } from '../router/router.js'
import { addRouter } from '../router/index.js'
import elHead from './head/head.vue'
import Axios from 'axios'
export default {
  data() {
    return {
      menu: [], //存储左侧菜单
      showDefaultMenu: '1',
      isCollapse: false
    }
  },
  computed: {
    iconName() {
      return this.isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'
    }
  },
  created() {
    this.initMenu()
  },
  mounted() {
    let demu = []
    demu = window.location.href.split('/')
    this.showDefaultMenu = demu[demu.length - 1]
  },
  watch: {
    $route(to, from) {
      //监听路由跳转，更改左侧菜单高亮
      this.showDefaultMenu = to.path.replace('/', '')
    }
  },
  methods: {
    initMenu() {
      let Level = this.$store.state.Level
      GetMenu({ Level }).then(res => {
        this.menu = res.Data
      })

      this.$store.dispatch('setEq')
    },
    showItem(item) {
      //用于判断是否有子菜单
      if (!item.children) {
        return 'el-menu-item'
      } else {
        return 'el-submenu'
      }
    },
    updateCollapse() {
      this.isCollapse = !this.isCollapse
    }
  },
  components: {
    elHead
  }
}
</script>
<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-container {
  height: 100%;
  .el-header {
    line-height: 45px;
    background-color: rgb(253, 253, 253);
  }
  .el-aside {
    background-color: rgb(58, 63, 81);
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: rgb(226, 225, 225);
  }
}
.el-submenu /deep/ .el-submenu__title {
  color: rgb(181, 182, 189);
  display: flex;
  justify-content: left;
  align-items: center;
}
.el-submenu /deep/ .el-submenu__title:hover {
  background-color: rgb(47, 51, 66) !important;
}
.el-menu-item {
  color: rgb(181, 182, 189);
  display: flex;
  justify-content: left;
  align-items: center;
}
.el-menu-item:hover {
  // outline: 0 !important;
  background-color: rgb(47, 51, 66) !important;
}
.vueProject {
  width: 100%;
  height: 45px;
  color: #fff;
  line-height: 45px;
  font-weight: bolder;
  border-bottom: rgb(92, 86, 86) 1px solid;
  box-sizing: border-box;
  user-select: none;
}

.component-fade-enter-active,
.component-fade-leave-active {
  transition: all 0.5s;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
