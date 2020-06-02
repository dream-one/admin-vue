// 设备管理
<template>
  <div>
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="3">
          <el-button type="primary" @click="dialogFormVisible = true">创建班级</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table
        class="table"
        max-height="700px"
        stripe
        border
        :data="classList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column align="center" prop="Name" label="班级名称"></el-table-column>
        <el-table-column align="center" prop="GradeName" label="所在年级"></el-table-column>
        <el-table-column align="center" prop="phone" label="联系人"></el-table-column>
        <el-table-column align="center" prop="phone" label="联系电话"></el-table-column>
        <el-table-column align="center" prop="StudentCount" label="班级人数"></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          layout="prev, pager, next, sizes, total, jumper"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pagesize"
          :total="classList.length"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          hide-on-single-page
        ></el-pagination>
      </div>
    </el-card>

    <!-- 弹出层  添加设备 -->
    <el-dialog width="30%" center title="填写班级信息" :visible.sync="dialogFormVisible">
      <el-form
        ref="rulesForm"
        :rules="rules"
        :model="form"
        label-position="left"
        :label-width="formLabelWidth"
      >
        <el-form-item label="年级" prop="gradeValue">
          <el-col :span="24">
            <el-select
              style="display:block"
              size="medium"
              v-model="form.gradeValue"
              placeholder="选择年级"
            >
              <el-option-group v-for="group  in grade" :key="group.label" :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.gradeValue"
                  :label="item.label"
                  :value="item.gradeValue"
                ></el-option>
              </el-option-group>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item prop="name" label="班级名称">
          <el-col :span="24">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="联系人">
          <el-col :span="24">
            <el-input v-model="form.contact" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-col :span="24">
            <el-input v-model="form.contactCall" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { CreatClass, QueryClass } from '../../api/api'
export default {
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入班级名称', trigger: 'blur' },
          { min: 2, message: '至少输入两个字符', trigger: 'blur' }
        ],
        gradeValue: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ]
      },
      classList: [], //学生列表
      currentPage: 1, //当前页
      pagesize: 10, //页码数量
      dialogFormVisible: false, //是否显示弹出层
      form: {
        name: '', //班级姓名
        contact: '', //联系人
        contactCall: '', //联系电话
        gradeValue: '' //年级选择的值
      },
      formLabelWidth: '110px',
      grade: [
        //年级选择列表，从后台获取
        {
          label: '高中',
          options: [
            {
              gradeValue: '高三',
              label: '高三'
            },
            {
              gradeValue: '高二',
              label: '高二'
            },
            {
              gradeValue: '高一',
              label: '高一'
            }
          ]
        },
        {
          label: '初中',
          options: [
            {
              gradeValue: '初三',
              label: '初三'
            },
            {
              gradeValue: '初二',
              label: '初二'
            },
            {
              gradeValue: '初一',
              label: '初一'
            }
          ]
        },
        {
          label: '小学',
          options: [
            {
              gradeValue: '六年级',
              label: '六年级'
            },
            {
              gradeValue: '五年级',
              label: '五年级'
            },
            {
              gradeValue: '四年级',
              label: '四年级'
            },
            {
              gradeValue: '三年级',
              label: '三年级'
            },
            {
              gradeValue: '二年级',
              label: '二年级'
            },
            {
              gradeValue: '一年级',
              label: '一年级'
            }
          ]
        }
      ],
      class: [] //班级选择列表,从后台获取
    }
  },
  methods: {
    handleCurrentChange(cpage) {
      this.currentPage = cpage
    },
    handleSizeChange(psize) {
      this.pagesize = psize
    },
    add() {
      //点击确定,校验规则
      this.$refs['rulesForm'].validate(valid => {
        if (valid) {
          var { name, contact, contactCall, gradeValue } = this.form
          let ClassName = name
          let GradeName = gradeValue
          CreatClass({ ClassName, GradeName })
            .then(res => {
              console.log(res)
              if (res.Data == true) {
                this.$message({
                  showClose: true,
                  message: '创建成功',
                  type: 'success'
                })
                this.$router.go(0)
              } else {
                this.$message({
                  showClose: true,
                  message: '创建失败，检查班级名称是否重名',
                  type: 'error'
                })
              }
            })
            .catch(err => {
              this.$message({
                showClose: true,
                message: '错误' + err,
                type: 'error'
              })
            })
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    initData() {
      QueryClass()
        .then(res => {
          if (res.Code == 200) {
            this.classList = res.Data
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err,
            type: 'warn'
          })
        })
    }
  },
  mounted() {
    this.initData()
  }
}
</script>

<style lang="less" scoped>
.table {
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>