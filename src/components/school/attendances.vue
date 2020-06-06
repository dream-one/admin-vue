<template>
  <div>
    <div>考勤设置：</div>
    <el-form size="mini" :model="form">
      <el-form-item label-width="80px" label="进入时间：">
        <el-input v-model="form.in"></el-input>
      </el-form-item>
      <el-form-item label="外出时间：">
        <el-input v-model="form.out"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        in: '',
        out: ''
      }
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
</style>