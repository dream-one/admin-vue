// 设备管理
<template>
  <div>
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="3">
          <el-button type="primary" @click="dialogFormVisible = true">添加设备</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table class="table" max-height="700px" stripe border :data="eqList" style="width: 100%">
        <el-table-column align="center" prop="EquipmentNum" label="设备系列号"></el-table-column>
        <el-table-column align="center" prop="Local" label="布设地点"></el-table-column>
        <el-table-column align="center" prop="operation" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delEq(scope.$index, scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          layout="prev, pager, next, sizes, total, jumper"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pagesize"
          :total="eqList.length"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          hide-on-single-page
        ></el-pagination>
      </div>
    </el-card>

    <!-- 弹出层  添加设备 -->
    <el-dialog width="30%" center title="填写设备信息" :visible.sync="dialogFormVisible">
      <el-form
        ref="rulesForm"
        :rules="rules"
        :model="form"
        label-position="left"
        :label-width="formLabelWidth"
      >
        <el-form-item label="设备系列号" prop="EquipmentNum">
          <el-col :span="20">
            <el-input v-model="form.EquipmentNum" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="布设地点">
          <el-col :span="20">
            <el-input v-model="form.Local" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { AddEq, GetEq, DelEq } from '../../api/api'
export default {
  data() {
    return {
      searchInput: '', //搜索框
      //eqList: [], //设备列表
      currentPage: 1, //当前页
      pagesize: 10, //页码数量
      dialogFormVisible: false, //是否显示弹出层
      form: {
        EquipmentNum: '', //系列号
        Local: '' //布设地点
      },
      formLabelWidth: '110px',
      rules: {
        EquipmentNum: [
          { required: true, message: '请输入设备系列号', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    eqList() {
      return this.$store.state.eqList
    }
  },
  methods: {
    delEq(index, row) {
      console.log(index, row)
      this.$confirm('确定要删除这个设备吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$store.dispatch('delEq', { index, row })
      })
    },
    handleCurrentChange(cpage) {
      this.currentPage = cpage
    },
    handleSizeChange(psize) {
      this.pagesize = psize
    },
    submitForm() {
      this.$refs['rulesForm'].validate(ValidityState => {
        if (ValidityState) {
          var { EquipmentIP, EquipmentNum, Local } = this.form
          AddEq({ EquipmentIP, EquipmentNum, Local })
            .then(res => {
              console.log(res)
              if (res.data.Code == 500) {
                return this.$message({
                  message: '添加失败，' + res.data.ErrMessage,
                  type: 'warning'
                })
              } else {
                this.form.EquipmentIP = ''
                this.form.EquipmentNum = ''
                this.form.Local = ''
                this.dialogFormVisible = false
                   this.$router.go(0)
                return this.$message({
                  message: '添加成功',
                  type: 'success'
                })
              }
            })
            .catch(err => {
              return this.$message({
                message: '发生错误' + err,
                type: 'warning'
              })
            })
        }
      })
    }
  },
  mounted() {
    // this.initData()
  }
}
</script>

<style lang="less" scoped>
.table {
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>