// 设备管理
<template>
  <div>
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="8">
          <div>
            <el-input
              clearable
              placeholder="请输入学生姓名"
              v-model="searchInput"
              class="input-with-select"
            >
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="form={},editFlag=false,dialogFormVisible = true">添加学生</el-button>
        </el-col>
        <el-col :span="8">
          <el-button type="success" @click="editStudent">
            编辑
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button type="danger" @click="deleteStudent">
            删除
            <i class="el-icon-delete-solid"></i>
          </el-button>
          <el-button type="warning" @click="$router.go(0)">
            刷新
            <i class="el-icon-refresh"></i>
          </el-button>
        </el-col>
        <el-col :span="3"></el-col>
        <el-col :span="3"></el-col>
      </el-row>

      <!-- 表格 -->
      <el-table
        class="table"
        max-height="700px"
        stripe
        border
        :data="studentList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column type="selection" :selectable="checkboxT" width="55"></el-table-column>
        <el-table-column align="center" prop="Name" label="姓名"></el-table-column>
        <el-table-column align="center" prop="ClassName" label="所在班级"></el-table-column>
        <el-table-column align="center" prop="GradeName" label="所在年级"></el-table-column>
        <el-table-column align="center" prop="StudentID" label="学号"></el-table-column>
        <el-table-column align="center" prop="caller" label="联系人"></el-table-column>
        <el-table-column align="center" prop="PhoneNum" label="联系电话"></el-table-column>
        <el-table-column align="center" prop="Image" label="抓图">
          <template slot-scope="scope">
            <el-tooltip
              :disabled="!scope.row.Image ? true : false"
              popper-class="pop"
              effect="light"
              :open-delay="500"
              placement="top"
            >
              <img :src="scope.row.Image" width="50" height="50" class="head_pic" />
              <img :src="scope.row.Image" slot="content" width="150" height="150" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          layout="prev, pager, next, sizes, total, jumper"
          :page-sizes="[12]"
          :page-size="pagesize"
          :total="studentListLength"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 弹出层  添加学生 -->
    <el-dialog
      width="40%"
      center
      :title="editFlag==false ? '填写学生信息':'编辑学生信息'"
      :visible.sync="dialogFormVisible"
      destroy-on-close
    >
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
              size="medium"
              style="display:block"
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

        <el-form-item label="班级" prop="classValue">
          <el-col :span="24">
            <el-select
              style="display:block"
              v-model="form.classValue"
              :disabled="isDisabled"
              placeholder="选择班级"
              no-data-text="请先创建班级"
            >
              <el-option
                v-for="item in classList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="设备" prop="EquipmentNum">
          <el-col :span="24">
            <el-select
              style="display:block"
              no-data-text="没有找到设备信息，请先添加设备"
              v-model="form.EquipmentNum"
              placeholder="选择设备序列号"
            >
              <el-option
                v-for="item in eqList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="姓名" prop="Name">
          <el-col :span="24">
            <el-input v-model="form.Name" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="学号" prop="StudentID">
          <el-col :span="24">
            <el-input v-model="form.StudentID" autocomplete="off"></el-input>
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
        <div>
          <!--开启摄像头-->
          <el-button size="mini" type="primary" @click="callCamera">开启摄像头</el-button>
          <el-button size="mini" type="primary" @click="closeCamera">关闭摄像头</el-button>
          <div class="tuxiang">
            <!--canvas截取流-->
            <canvas ref="canvas" width="370" height="480"></canvas>
            <!--图片展示-->
            <video ref="video" width="140" height="160" autoplay></video>
          </div>
          <!--确认-->
          <el-button size="mini" type="primary" @click="photograph">拍照</el-button>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetClassName,
  AddStudent,
  GetStudent,
  DelStudentBatch,
  EditStudent
} from '../../api/api'
export default {
  data() {
    return {
      editFlag: false,
      searchInput: '', //搜索框
      studentList: [], //学生列表
      studentListLength: 0,
      currentPage: 1, //当前页
      pagesize: 12, //页码数量
      dialogFormVisible: false, //是否显示弹出层
      form: {
        Name: '', //学生姓名
        StudentID: '', //学号
        contact: '', //联系人
        gradeValue: '', //年级选择的值
        classValue: '', //班级选择的值
        contactCall: '', //联系电话
        imageContent: '',
        EquipmentNum: ''
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
      searchList: [],
      classList: [], //班级选择列表,从后台获取
      multipleSelection: [], //表格多选
      rules: {
        gradeValue: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        classValue: [
          { required: true, message: '请选择班级', trigger: 'change' }
        ],
        EquipmentNum: [
          {
            required: true,
            message: '请选择要填加的设备序列号',
            trigger: 'change'
          }
        ],
        Name: [{ required: true, message: '请输入学生姓名', trigger: 'blur' }],
        studentID: [{ required: true, message: '请输入学号', trigger: 'blur' }]
      },
      loading: false
    }
  },
  computed: {
    isDisabled: function() {
      //如果没有选择年级，就不能选择班级
      return this.form.gradeValue == '' ? true : false
    },
    eqList: function() {
      return this.$store.getters.geteqOptions
    }
  },
  watch: {
    'form.gradeValue': function(val, oldval) {
      //监听年级选择的变化，从后台获取属于该年级的班级列表
      if (val == '' || val == null) {
        return
      }
      let GradeName = val
      GetClassName({ GradeName })
        .then(res => {
          if (res.Data == null) {
            this.classList = []
            return
          }
          let arr = []
          res.Data.forEach(element => {
            let obj = {}
            obj.label = element.Name
            obj.value = element.Name
            arr.push(obj)
          })
          this.classList = arr
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: '错误' + err,
            type: 'warn'
          })
        })
    }
  },
  methods: {
    editStudent() {
      //点击编辑学生按钮
      if (this.multipleSelection.length !== 1) {
        return this.$message({
          showClose: true,
          message: '选择且只能选择一项进行编辑',
          type: 'waring'
        })
      }

      this.editFlag = true
      this.dialogFormVisible = true

      //处理canvas图形
      setTimeout(() => {
        var image = new Image(150, 150)
        image.src = this.multipleSelection[0].Image
        let ctx = this.$refs['canvas'].getContext('2d')
        ctx.drawImage(image, 0, 0, 370, 480)
      }, 100)

      // ctx.drawImage(image, 0, 0)
      this.form = Object.assign({}, this.multipleSelection[0], {
        EquipmentNum: this.multipleSelection[0].DeviceSerial,
        classValue: this.multipleSelection[0].ClassName,
        gradeValue: this.multipleSelection[0].GradeName,
        imageContent: this.multipleSelection[0].Image.split(',')[1]
      })
    },
    // 调用摄像头
    callCamera() {
      // H5调用电脑摄像头API
      navigator.mediaDevices
        .getUserMedia({
          video: true
        })
        .then(success => {
          // 摄像头开启成功
          this.$refs['video'].srcObject = success
          // 实时拍照效果
          this.$refs['video'].play()
        })
        .catch(error => {
          console.error('摄像头开启失败，请检查摄像头是否可用！')
        })
    },
    // 拍照
    photograph() {
      let ctx = this.$refs['canvas'].getContext('2d')
      this.clearCanvas()
      // 把当前视频帧内容渲染到canvas上

      ctx.drawImage(this.$refs['video'], 0, 0, 440, 300)
      // 转base64格式、图片格式转换、图片质量压缩
      let imageContent = this.$refs['canvas'].toDataURL('image/jpeg', 0.7) // 由字节转换为KB 判断大小

      let str = imageContent.replace('data:image/jpeg;base64,', '')
      console.log(str)
      this.form.imageContent = str
      let strLength = str.length
      let fileLength = parseInt(strLength - (strLength / 8) * 2) // 图片尺寸  用于判断
      let size = (fileLength / 1024).toFixed(2)
      console.log(size) // 上传拍照信息  调用接口上传图片 .........
    },
    clearCanvas() {
      // let ctx = this.$refs['canvas'].getContext('2d')
      var c = this.$refs['canvas']
      var cxt = c.getContext('2d')
      cxt.clearRect(0, 0, c.width, c.height)
    },
    // 关闭摄像头
    closeCamera() {
      if (!this.$refs['video'].srcObject) return
      let stream = this.$refs['video'].srcObject
      let tracks = stream.getTracks()
      tracks.forEach(track => {
        track.stop()
      })
      this.$refs['video'].srcObject = null
    },
    //设置表格复选框禁用
    checkboxT(row, index) {
      if (!row.Id) {
        return false
      } else {
        return true
      }
    },
    deleteStudent() {
      //删除
      if (this.multipleSelection.length == 0) {
        return this.$message({
          showClose: true,
          message: '请选择要删除的学生',
          type: 'error'
        })
      }
      let that = this
      this.$confirm(
        '确定删除这 ' + this.multipleSelection.length + ' 项吗?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      )
        .then(() => {
          DelStudentBatch(that.multipleSelection).then(res => {
            //多次循环，在显示界面的列表中删除
            console.log(res)
            if (res.data.Data == true) {
              that.multipleSelection.forEach((element, index, array) => {
                for (let i = 0; i < that.studentList.length; i++) {
                  if (element.Id == that.studentList[i].Id) {
                    this.studentList.splice(i, 1)
                    break
                  }
                }
              })
              return that.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              })
            } else {
              return that.$message({
                showClose: true,
                message: res.data.ErrMessage,
                type: 'error'
              })
            }
          })
        })
        .catch(() => {})
    },
    handleSelectionChange(val) {
      //选择行
      this.multipleSelection = val
    },
    initStudentData(PageSize, PageIndex) {
      if (this.searchList.length != 0) {
        //如果搜索数组里有值，就直接显示搜索数组里的值
        return (this.studentList = this.searchList.slice(
          PageIndex * PageSize,
          (PageIndex + 1) * PageSize
        ))
      }
      this.searchList = []
      this.loading = true
      GetStudent({ PageSize, PageIndex }).then(res => {
        this.loading = false
        this.studentListLength = res.Data.count
        this.studentList = res.Data.arr
      })
    },
    handleCurrentChange(cpage) {
      this.currentPage = cpage
      this.initStudentData(this.pagesize, this.currentPage - 1)
    },
    handleSizeChange(psize) {
      this.pagesize = psize
    },
    add() {
      //点击确定
      this.$refs['rulesForm'].validate(ValidityState => {
        if (ValidityState) {
          if (this.editFlag == false) {
            if (!this.form.imageContent) {
              return this.$message({
                showClose: true,
                message: '请拍照',
                type: 'waring'
              })
            }
            const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            AddStudent(this.form)
              .then(res => {
                if (res.data.Code == 200) {
                  let obj = {
                    Name: this.form.Name,
                    ClassName: this.form.classValue,
                    GradeName: this.form.gradeValue,
                    StudentID: this.form.StudentID,
                    Image: this.form.imageContent
                  }
                  this.studentList.unshift(obj)

                  this.$message({
                    showClose: true,
                    message: '添加成功',
                    type: 'success'
                  })
                  this.dialogFormVisible = false
                  Object.keys(this.form).forEach(key => (this.form[key] = '')) //清空表单
                } else {
                  this.$message({
                    showClose: true,
                    message: '错误' + res.data.ErrMessage,
                    type: 'warn'
                  })
                }
                loading.close()
              })
              .catch(err => {
                this.$message({
                  showClose: true,
                  message: '错误' + err,
                  type: 'warn'
                })
                loading.close()
              })
          } else {
            const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            EditStudent(this.form)
              .then(res => {
                if (res.data.Code == 200) {
                  this.$message.success('修改成功')
                  //修改成功
                  this.searchList = []
                  this.initStudentData(this.pagesize, this.currentPage - 1)
                  this.editFlag = false
                  this.dialogFormVisible = false
                }
                loading.close()
              })
              .catch(err => {
                loading.close()
              })
          }
        } else {
          return false
        }
      })
    },
    search() {
      //搜索
      this.searchList = []
      this.loading = true
      let searchInput = this.searchInput
      let PageIndex = 0
      let PageSize = this.pagesize
      if (this.searchInput == '') {
        return GetStudent({ PageSize, PageIndex }).then(res => {
          this.loading = false
          this.studentListLength = res.Data.count
          this.studentList = res.Data.arr
        })
      }

      GetStudent({ Name: searchInput, PageIndex, PageSize })
        .then(res => {
          console.log(res)
          if (res.Code == 200) {
            this.searchList = res.Data.arr
            this.studentListLength = this.searchList.length
            this.studentList = this.searchList.slice(0, this.pagesize)
            this.listLength = res.Data.count
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
    this.initStudentData(this.pagesize, this.currentPage - 1)
  }
}
</script>

<style lang="less" scoped>
.table {
  margin-top: 30px;
  margin-bottom: 30px;
}
.tuxiang {
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
</style>