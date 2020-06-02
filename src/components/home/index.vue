<template>
  <div>
    <el-card>
      <line-table></line-table>
    </el-card>

    <el-card style="margin-top:20px;">
      <bar-table></bar-table>
    </el-card>
  </div>
</template>

<script>
import lineTable from './lineTable.vue'
import barTable from './barTable'
export default {
  data() {
    return {}
  },
  methods: {},
  mounted() {},
  components: {
    lineTable,
    barTable
  }
}
</script>

<style>
</style>