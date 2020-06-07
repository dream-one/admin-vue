<template>
  <el-card>
    <el-row slot="header">
      <el-col :span="2">
        <div>考勤设置</div>
      </el-col>
    </el-row>

    <el-form size="mini" :model="form">
      <el-row>
        <el-col :span="4">
          <el-form-item label-width="120px" label="进入时间：">
            <el-time-picker
              size="medium"
              popper-class="prop"
              v-model="form.in"
              placeholder="晚于此时间将会视为迟到"
            ></el-time-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">
          <el-form-item label="外出时间：" label-width="120px">
            <el-time-picker
              v-model="form.out"
              size="medium "
              popper-class="prop2"
              placeholder="早于此时间将会视为早退"
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
  </el-card>
</template>

<script>
import { SetTime } from '../../api/api'
export default {
  data() {
    return {
      form: {
        in: '',
        out: ''
      }
    }
  },
  methods: {
    sumbit() {
      if (
        this.form.in == '' ||
        this.form.out == '' ||
        this.form.in == null ||
        this.form.out == null
      ) {
        return this.$message({
          showClose: true,
          message: '请选择时间',
          type: 'error'
        })
      }

      let inTime = this.form.in
      let outTime = this.form.out
      let SchoolID = this.$store.state.organizationID
      SetTime({ inTime, outTime, SchoolID })
        .then(res => {
          console.log(res)
          if (res.Code == 200) {
            this.$message({
              showClose: true,
              message: '设置成功',
              type: 'success'
            })
          } else if (res.Code == 500) {
            this.$message({
              showClose: true,
              message: '设置失败',
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