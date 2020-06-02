import Vue from 'vue'
import Vuex from 'vuex'
import { GetUserInfo, GetEq, DelEq } from '../api/api'
import { Form, Message } from 'element-ui'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    eqList: [], //设备列表
    userName: '', //账号用户名
    organizationID: 0, //单位ID
    organizationName: '', //单位名称 比如：实验中学 | 天合区 | 广州市
    Level: 0 //等级 校、区、市
  },
  mutations: {
    //设置用户信息
    setUserData(state, res) {
      let { Level, Name, organizationID } = res.Data.user
      let organizationName = res.Data.organizationName
      state.userName = Name
      state.organizationID = organizationID
      state.Level = Level
      state.organizationName = organizationName
      sessionStorage.setItem('Level', Level)
      sessionStorage.setItem('organizationID', organizationID)
    },
    //设置设备列表
    setEq(state, res) {
      state.eqList = res.Data
    },
    delEq(state, index) {
      state.eqList.splice(index, 1)
    }
  },
  actions: {
    getUserInfo({ commit, state }) {
      return new Promise((resolve, rej) => {
        GetUserInfo()
          .then(res => {
            if (res.Code == 200) {
              commit('setUserData', res)
              resolve(res.Data.user.Level)
            }
          })
          .catch()
      })
    },
    setEq({ commit }) {
      //设置设备列表异步
      GetEq().then(res => {
        commit('setEq', res)
      })
    },
    //删除设备
    delEq({ commit }, obj) {
      let { Id, SchoolId } = obj.row
      DelEq({ Id, SchoolId })
        .then(res => {
          if (res.Data == true) {
            Message({
              message: '删除成功',
              type: 'success'
            })
            commit('delEq', obj.index)
          }
        })
        .catch(err => {
          Message({
            message: '删除失败' + err,
            type: 'warning'
          })
        })
    }
  },
  getters: {
    geteqOptions(state) {
      let arr = []

      state.eqList.forEach(element => {
        let obj = {}
        obj.label = element.EquipmentNum
        obj.value = element.EquipmentNum
        arr.push(obj)
      })
      return arr
    }
  },
  modules: {}
})
