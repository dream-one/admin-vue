<template>
  <el-card>
    <el-row>
      <el-col :span="10">
        <label>设置考勤时间段：</label>
        <el-time-picker
          id="timepick"
          is-range
          v-model="value1"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        ></el-time-picker>
        <el-button style="margin-left:15px" type="primary" @click="sumbit">添加</el-button>
      </el-col>
    </el-row>
    <el-table style="margin-top:30px;" :data="timeList">
      <el-table-column prop="InTime" align="center" label="起始时间" width="180"></el-table-column>
      <el-table-column prop="OutTime" align="center" label="结束时间" width="180"></el-table-column>
      <el-table-column align="center" width="80" prop="operation" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="delTime(scope.$index, scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <el-dialog title="设置考勤范围" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form size="mini" :model="form">
        <el-row>
          <el-col :span="4">
            <el-form-item label-width="120px" label="起始时间：">
              <el-time-picker
                size="medium"
                popper-class="prop"
                v-model="form.in"
                placeholder="晚于此时间进入将会视为迟到"
              ></el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">
            <el-form-item label="结束时间：" label-width="120px">
              <el-time-picker
                v-model="form.out"
                size="medium "
                popper-class="prop2"
                placeholder="早于此时间外出将会视为早退"
              ></el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">
            <el-button @click="sumbit" type="primary">确定</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>-->
  </el-card>
</template>

<script>
import { SetTime, GetTime, DeleteTime } from '../../api/api'
export default {
  data() {
    return {
      timeList: [],
      value1: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      dialogVisible: false,
      form: {
        in: '',
        out: ''
      }
    }
  },
  mounted() {
    this.gettime()
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
    },
    delTime(index, row) {
      DeleteTime({ Id: row.Id }).then(res => {
        if (res.Code == 200) {
          this.gettime()
          return this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
        } else {
          return this.$message({
            showClose: true,
            message: res.ErrMessage,
            type: 'error'
          })
        }
      })
    },
    gettime() {
      GetTime({ SchoolID: this.$store.state.organizationID }).then(res => {
        res.Data.forEach((element, index, arr) => {
          arr[index].InTime = element.InTime.split('T')[1]
          arr[index].OutTime = element.OutTime.split('T')[1]
        })
        this.timeList = res.Data
      })
    },
    sumbit() {
      console.log(this.value1)
      if (this.value1.length == 0) {
        return this.$message({
          showClose: true,
          message: '请选择时间',
          type: 'error'
        })
      }

      let inTime = this.value1[0]
      let outTime = this.value1[1]
      let SchoolID = this.$store.state.organizationID
      SetTime({ inTime, outTime, SchoolID })
        .then(res => {
          if (res.Code == 200) {
            this.gettime()
            this.$message({
              showClose: true,
              message: '设置成功',
              type: 'success'
            })
          } else if (res.Code == 500) {
            this.$message({
              showClose: true,
              message: res.ErrMessage,
              type: 'error'
            })
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err,
            type: 'error'
          })
        })
    }
  }
}
</script>

<style scopen>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.container {
  display: flex;
}
.prop {
  top: 182px !important;
}
.prop2 {
  top: 240px !important;
}
</style>