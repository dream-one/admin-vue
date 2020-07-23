// 设备管理
<template>
  <div>
    <el-card>
      <!-- 搜索框 -->
      <el-row type="flex" align="middle" :gutter="2">
        <el-col :xs="5" :sm="4" :md="4" :lg="2" :xl="2" :span="3">
          <span>姓名：</span>
        </el-col>
        <el-col :xs="5" :sm="4" :md="4" :lg="3" :xl="4" :span="4">
          <el-input clearable placeholder="请输入人员姓名" v-model="searchInput" class="input-with-select"></el-input>
        </el-col>
        <el-col style="padding-left: 20px;" :xs="5" :sm="4" :md="4" :lg="3" :xl="3" :span="2">
          <span>时间范围：</span>
        </el-col>
        <el-col :xs="5" :sm="4" :md="4" :lg="3" :xl="4" :span="4">
          <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-col>
        <el-col :offset="2" :span="3">
          <div>设备序列号：</div>
        </el-col>
        <el-col :span="4">
          <el-input clearable placeholder="请输入设备序列号" v-model="eqNum" class="input-with-select"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-col>

        <el-col :offset="2" :xs="8" :sm="10" :md="7" :lg="7" :xl="6" :span="4">
          <el-button @click="shuaXin" type="primary">刷新</el-button>

          <el-button @click="exportExcel" type="primary">导出数据</el-button>
        </el-col>
      </el-row>

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
        <el-table-column
          align="center"
          prop="InOutType"
          :filters="[{text:'进',value:'进'},{text:'出',value:'出'}]"
          :filter-method="filterHandler"
          label="进出类型"
        ></el-table-column>
        <el-table-column align="center" prop="DeviceSerial" label="设备系列号"></el-table-column>
        <el-table-column
          align="center"
          prop="State"
          label="状态"
          :filters="[{text:'迟到',value:'迟到'},{text:'早退',value:'早退'},{text:'正常',value:'正常'}]"
          :filter-method="filterState"
        ></el-table-column>
        <el-table-column align="center" prop="Temperature" label="温度"></el-table-column>
        <el-table-column align="center" prop="Image" label="抓图">
          <template slot-scope="scope">
            <el-tooltip
              :disabled="!scope.row.SnapshotContent ? true : false"
              popper-class="pop"
              effect="light"
              :open-delay="500"
              placement="top"
            >
              <img :src="scope.row.SnapshotContent" width="50" height="50" class="head_pic" />
              <img :src="scope.row.SnapshotContent" slot="content" width="150" height="150" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          layout="prev, pager, next, sizes, total, jumper"
          :page-sizes="[5,10,20]"
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
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { GetNotify, GetNotifyByName } from '../../api/api.js'
export default {
  data() {
    return {
      time: [],
      searchList: [], //搜索出来的数据暂时先放在这,初始化的时候将其情况
      searchInput: '', //搜索框
      jinchuList: [], //设备列表
      eqNum: '', //设备序列号
      dialogFormVisible: false, //是否显示弹出层
      currentPage: 1, //当前页
      pagesize: 12, //页码数量
      listLength: 0,
      form: {
        eqID: '', //设备ID
        eqName: '', //系列号
        eqIP: '', //IP
        eqLocal: '' //布设地点
      },
      formLabelWidth: '110px',
      loading: false
    }
  },
  computed: {
    getList() {
      return this.jinchuList
    }
  },
  methods: {
    handleCurrentChange(cpage) {
      //更改当前页码
      this.currentPage = cpage
      this.setData(this.pagesize, this.currentPage)
    },
    handleSizeChange(psize) {
      //更改显示行数
      this.pagesize = psize
      this.initData()
    },
    filterHandler(value, row, column) {
      return row.InOutType == value
    },
    filterState(value, row, column) {
      return row.State == value
    },
    setData(pageSize, pageIndex) {
      pageIndex = pageIndex - 1
      if (this.searchList.length != 0) {
        //如果搜索数组里有值，就直接显示搜索数组里的值
        return (this.jinchuList = this.searchList.slice(
          pageIndex * pageSize,
          (pageIndex + 1) * pageSize
        ))
      }
      GetNotify({
        pageSize,
        pageIndex,
        SchoolID: this.$store.state.organizationID
      }).then(res => {
        if (res.Code == 200) {
          // this.$set(this.jinchuList, this.jinchuList, res.Data.result)
          this.jinchuList = res.Data.result
        }
      })
    },
    // 导出表格所用
    exportExcel() {
      // 设置当前日期
      let time = new Date()
      let year = time.getFullYear()
      let month = time.getMonth() + 1
      let day = time.getDate()
      let name = year + '' + month + '' + day
      // console.log(name)
      /* generate workbook object from table */
      //  .table要导出的是哪一个表格

      var wb = XLSX.utils.json_to_sheetJSON(this.searchList)

      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        //  name+'.xlsx'表示导出的excel表格名字
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          name + '.xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    },
    initData() {
      //初始化表格
      this.searchList = []
      let PageIndex = this.currentPage - 1
      let PageSize = this.pagesize
      GetNotify({
        PageIndex,
        PageSize,
        SchoolID: this.$store.state.organizationID
      }).then(res => {
        if (res.Code == 200) {
          this.jinchuList = res.Data.result
          this.listLength = res.Data.count
        }
        this.loading = false
      })
    },
    shuaXin() {
      //刷新数据
      this.loading = true
      this.initData()
    },
    search() {
      //搜索
      if (
        this.searchInput == '' &&
        (this.time == null || this.time.length == 0) &&
        this.eqNum == ''
      ) {
        return this.shuaXin()
      }
      this.loading = true
      let searchInput = this.searchInput
      let PageIndex = this.currentPage - 1
      let PageSize = this.pagesize
      let StartTime
      let EndTime
      if (this.time == null) {
        StartTime = null
        EndTime = null
      } else {
        StartTime = this.time[0]
        EndTime = this.time[1]
      }
      console.log('ss')
      GetNotifyByName({
        Name: searchInput,
        StartTime,
        EndTime,
        EqNum: this.eqNum
      })
        .then(res => {
          console.log(res)
          if (res.Code == 200) {
            this.searchList = res.Data
            this.jinchuList = this.searchList.slice(0, 12)
            this.listLength = res.Data.length
          } else {
            this.$message({
              showClose: true,
              message: res.ErrMessage,
              type: 'error'
            })
          }
          this.loading = false
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: '错误' + err,
            type: 'error'
          })
          this.loading = false
        })
    }
  },

  mounted() {
    this.initData()
  }
}
</script>

<style lang="less" >
.table {
  margin-top: 30px;
  margin-bottom: 30px;
}
.pop {
  border: none !important;
}
.el-tooltip__popper.is-light {
  border: none !important;
}
</style>