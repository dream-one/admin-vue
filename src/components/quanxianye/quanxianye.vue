<template>
  <div>
    <el-card>
      <el-form :inline="true" v-model="formSearch" class="demo-form-inline">
        <el-form-item label="学校">
          <el-select
            clearable
            filterable
            v-if="isCity"
            style="width:300px"
            v-model="value"
            placeholder="请选择要查询的学校"
          >
            <el-option-group v-for="group in duoOptions" :key="group.label" :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-option-group>
          </el-select>
          <el-select
            clearable
            filterable
            style="width:300px"
            v-else
            v-model="value"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="formSearch.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="设备序列号">
          <el-input
            clearable
            placeholder="请输入设备序列号"
            v-model="formSearch.eqNum"
            class="input-with-select"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formSearch.State" placeholder="状态">
            <el-option label="迟到" value="迟到"></el-option>
            <el-option label="早退" value="早退"></el-option>
            <el-option label="正常" value="正常"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table
        class="table"
        max-height="700px"
        stripe
        hide-on-single-page
        border
        :data="getList"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column align="center" prop="Id" label="id"></el-table-column>
        <el-table-column align="center" prop="FaceName" label="人员姓名"></el-table-column>
        <el-table-column align="center" prop="Time" label="进出时间"></el-table-column>
        <el-table-column align="center" prop="AuthType" label="验证类型"></el-table-column>
        <el-table-column align="center" prop="InOutType" label="进出类型"></el-table-column>
        <el-table-column align="center" prop="DeviceSerial" label="设备系列号"></el-table-column>
        <el-table-column align="center" prop="State" label="状态"></el-table-column>
        <el-table-column align="center" prop="Temperature" label="温度"></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          layout="prev, pager, next, sizes, total, jumper"
          :page-sizes="[12]"
          :page-size="pagesize"
          :total="listLength"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { GetSchoolSelect, GetNotify } from '../../api/api'
export default {
  data() {
    return {
      jinchuList: [], //进出记录列表
      currentPage: 1, //当前页
      pagesize: 12, //页码数量
      listLength: 0,
      options: [],
      formSearch: {
        eqNum: '', //设备序列号
        time: [],
        State: '',
        InOutType: ''
      },
      value: '',
      duoOptions: [],
      loading: false
    }
  },
  computed: {
    isCity() {
      return this.$store.state.Level == 3 ? true : false
    },
    getList() {
      return this.jinchuList
    }
  },
  methods: {
    query() {
      let { time, eqNum, State } = this.formSearch
      if (
        this.value == '' &&
        (time == null || time.length == 0) &&
        eqNum == '' &&
        State == ''
      )
        return
      this.loading = true
      let PageIndex = this.currentPage - 1
      let PageSize = this.pagesize
      let SchoolID = this.value
      let StartTime
      let EndTime
      if (time == null) {
        StartTime = null
        EndTime = null
      } else {
        StartTime = time[0]
        EndTime = time[1]
      }
      GetNotify({
        PageIndex,
        PageSize,
        SchoolID,
        StartTime,
        EndTime,
        EqNum: eqNum,
        State
      }).then(res => {
        this.loading = false
        if (res.Code == 200) {
          this.listLength = res.Data.count
          this.jinchuList = res.Data.result
        }
      })
    },
    handleCurrentChange(cpage) {
      //更改当前页码
      this.currentPage = cpage
      this.setData(this.pagesize, this.currentPage)
    },
    handleSizeChange(psize) {
      //更改显示行数
      this.pagesize = psize
    }
  },
  mounted() {
    let Level = sessionStorage.getItem('Level')
    let organizationID = sessionStorage.getItem('organizationID')
    if (Level == null || organizationID == null) {
      Level = this.$store.state.Level
      organizationID = this.$store.state.organizationID
    }
    GetSchoolSelect({ Level, organizationID }).then(res => {
      console.log(res)
      if (res.Code == 200 && Level == 2) {
        let arr = []
        res.Data.forEach(element => {
          let obj = {}
          obj.label = element.Name
          obj.value = element.Id
          arr.push(obj)
        })
        this.options = arr
      } else {
        let arr = []
        //看着很复杂，说到底还是为了能够匹配上elementui选择器的对象数据结构
        res.Data.forEach(element => {
          let obj = {}
          let optionsArr = []
          obj.label = element.label
          element.options.forEach(option => {
            let op = {}
            op.label = option.Name
            op.value = option.Id
            optionsArr.push(op)
          })
          obj.options = optionsArr
          arr.push(obj)
        })
        this.duoOptions = arr
      }
    })
  }
}
</script>

<style>
</style>