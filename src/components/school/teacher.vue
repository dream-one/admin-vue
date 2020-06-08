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
              placeholder="请输入人员姓名"
              v-model="searchInput"
              class="input-with-select"
            >
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addTeacher">添加人员</el-button>
        </el-col>
        <el-col :span="8">
          <el-button type="success" @click="editTeacher">
            编辑
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button type="danger" @click="deleteTeacher">
            删除
            <i class="el-icon-delete-solid"></i>
          </el-button>
          <el-button type="warning" @click="$router.go(0)">
            刷新
            <i class="el-icon-refresh"></i>
          </el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table
        class="table"
        max-height="700px"
        stripe
        border
        @selection-change="handleSelectionChange"
        :data="teacherList"
        style="width: 100%"
      >
        <el-table-column :selectable="checkboxT" type="selection" width="55"></el-table-column>
        <el-table-column align="center" prop="Name" label="姓名"></el-table-column>
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
          :total="teacherListLength"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 弹出层  添加 -->
    <el-dialog
      width="30%"
      center
      :title="editFlag==false ? '填写人员信息':'编辑人员信息'"
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
        <el-form-item label="姓名" prop="Name">
          <el-col :span="24">
            <el-input v-model="form.Name" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="设备" prop="EquipmentNum">
          <el-col :span="24">
            <el-select
              style="display:block"
              no-data-text="没有找到设备信息，请先添加设备"
              v-model="form.EquipmentNum"
              placeholder="选择设备序列号"
              :disabled="editFlag==true?true:false"
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
        <el-form-item label="联系电话" prop="PhoneNum">
          <el-col :span="24">
            <el-input v-model="form.PhoneNum" autocomplete="off"></el-input>
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
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  AddTeacher,
  DeletTeacher,
  GetTeacher,
  EditTeacher
} from '../../api/api.js'
import { diff } from '../../../public/util'
export default {
  data() {
    return {
      searchInput: '', //搜索框
      teacherList: [], //人员列表
      currentPage: 1, //当前页
      pagesize: 12, //页码数量
      editFlag: false, //是否打开编辑面板
      dialogFormVisible: false, //是否显示弹出层
      form: {
        Name: '',
        PhoneNum: '',
        imageContent: '',
        EquipmentNum: ''
      },
      rules: {
        Name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        PhoneNum: [{ required: true, message: '请输入电话', trigger: 'blur' }],
        EquipmentNum: [
          {
            required: true,
            message: '请选择要填加的设备序列号',
            trigger: 'change'
          }
        ]
      },
      formLabelWidth: '110px',
      searchList: [],
      multipleSelection: [], //表格多选
      loading: false,
      teacherListLength: 0
    }
  },
  computed: {
    eqList: function() {
      return this.$store.getters.geteqOptions
    }
  },
  watch: {
    // form: {
    //   handler(val, oldVal) {
    //     console.log(this.editFlag, this.dialogFormVisible)
    //     if (this.editFlag == true && this.dialogFormVisible == true) {
    //       console.log(val, oldVal)
    //     }
    //   },
    //   deep: true
    // }
  },
  methods: {
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
      this.form.imageContent = str
      // let strLength = str.length
      // let fileLength = parseInt(strLength - (strLength / 8) * 2) // 图片尺寸  用于判断
      // let size = (fileLength / 1024).toFixed(2)
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
    handleSelectionChange(val) {
      //选择行
      this.multipleSelection = val
    },
    handleCurrentChange(cpage) {
      this.currentPage = cpage
      this.initTeacherData(this.pagesize, this.currentPage - 1)
    },
    handleSizeChange(psize) {
      this.pagesize = psize
    },
    initTeacherData(PageSize, PageIndex) {
      if (this.searchList.length != 0) {
        //如果搜索数组里有值，就直接显示搜索数组里的值
        return (this.teacherList = this.searchList.slice(
          PageIndex * PageSize,
          (PageIndex + 1) * PageSize
        ))
      }
      this.searchList = []
      this.loading = true
      GetTeacher({ PageSize, PageIndex }).then(res => {
        this.loading = false
        this.teacherListLength = res.Data.count
        this.teacherList = res.Data.result
      })
    },
    clearCanvas() {
      // let ctx = this.$refs['canvas'].getContext('2d')
      var c = this.$refs['canvas']
      var cxt = c.getContext('2d')
      cxt.clearRect(0, 0, c.width, c.height)
    },
    addTeacher() {
      this.form = {
        Name: '',
        PhoneNum: '',
        imageContent: '',
        EquipmentNum: ''
      }
      this.editFlag = false
      this.dialogFormVisible = true
      //  this.clearCanvas()
    },
    editTeacher() {
      if (this.multipleSelection.length !== 1) {
        return this.$message({
          showClose: true,
          message: '选择且只能选择一项进行编辑',
          type: 'waring'
        })
      }
      // ctx.drawImage(image, 0, 0)
      this.form = Object.assign({}, this.multipleSelection[0], {
        EquipmentNum: this.multipleSelection[0].DeviceSerial,
        imageContent:
          this.multipleSelection[0].Image == null
            ? ''
            : this.multipleSelection[0].Image.split(',')[1]
      })

      setTimeout(() => {
        var image = new Image(150, 150)
        image.src = this.multipleSelection[0].Image
        let ctx = this.$refs['canvas'].getContext('2d')
        ctx.drawImage(image, 0, 0, 370, 480)
      }, 100)
      // setTimeout(() => {
      //   this.editFlag = true
      //   this.dialogFormVisible = true
      // },100)
      this.editFlag = true
      this.dialogFormVisible = true
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
            this.form.SchoolID = this.$store.state.organizationID

            AddTeacher(this.form)
              .then(res => {
                if (res.data.Code == 200) {
                  let obj = {
                    Name: this.form.Name,
                    PhoneNum: this.form.PhoneNum,
                    Image: 'data:image/jpeg;base64,' + this.form.imageContent
                  }
                  this.teacherList.unshift(obj)
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
            var result = diff(this.form, this.multipleSelection[0])

            if (result) {
              this.$message({
                showClose: true,
                message: '未修改任何值',
                type: 'info'
              })
              this.dialogFormVisible = false
              this.editFlag = false
              return
            }
            EditTeacher(this.form).then(res => {
              if (res.data.Code == 200) {
                this.$message.success('修改成功')
                //修改成功
                this.searchList = []
                this.initTeacherData(this.pagesize, this.currentPage - 1)
                this.editFlag = false
                this.dialogFormVisible = false
              }else {
                  this.$message.error('修改失败，' + res.data.ErrMessage)
                }
            })
          }
        } else {
          return false
        }
      })
    },
    deleteTeacher() {
      //删除
      if (this.multipleSelection.length == 0) {
        return this.$message({
          showClose: true,
          message: '请选择要删除的人员',
          type: 'error'
        })
      }

      let that = this
      this.$confirm(
        '确定要删除这 ' + this.multipleSelection.length + ' 项吗?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      )
        .then(() => {
          let arr = []
          that.multipleSelection.forEach(element => {
            arr.push(element.Id)
          })
          DeletTeacher(that.multipleSelection).then(res => {
            //多次循环，在显示界面的列表中删除
            if (res.data.Data == true) {
              that.multipleSelection.forEach((element, index, array) => {
                for (let i = 0; i < that.teacherList.length; i++) {
                  if (element.Id == that.teacherList[i].Id) {
                    this.teacherList.splice(i, 1)
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
                message: res.ErrMessage,
                type: 'error'
              })
            }
          })
        })
        .catch(() => {})
    },
    search() {
      //搜索
      this.searchList = []
      this.loading = true
      let searchInput = this.searchInput
      let PageIndex = 0
      let PageSize = this.pagesize
      if (this.searchInput == '') {
        return GetTeacher({ PageSize, PageIndex }).then(res => {
          this.loading = false
          this.teacherListLength = res.Data.count
          this.teacherList = res.Data.result
        })
      }

      GetTeacher({ Name: searchInput, PageIndex, PageSize })
        .then(res => {
          console.log(res)
          if (res.Code == 200) {
            this.searchList = res.Data.result
            this.teacherListLength = this.searchList.length
            this.teacherList = this.searchList.slice(0, this.pagesize)
            this.listLength = res.count
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
    this.initTeacherData(12, 0)
  }
}
</script>

<style lang="less" scoped>
.table {
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>