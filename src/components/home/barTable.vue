<template>
  <div id="barChart" :style="{width: '100%', height: '300px'}"></div>
</template>

<script>
import westeros from '../../assets/js/them.json'
import { GetAttendanceByEcharts } from '../../api/api'
export default {
  methods: {
    myEcharts() {
      this.$echarts.registerTheme('westeros', westeros)
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(
        document.getElementById('barChart'),
        'westeros'
      )
      myChart.showLoading()
      GetAttendanceByEcharts({
        organizationID: this.$store.state.organizationID,
          Level:this.$store.state.Level
      }).then(res => {
        res.Data.DateArr.forEach((element,index,Arr) => {
          Arr[index] = element + '月'
        })

        // 指定图表的配置项和数据
        var option = {
          title: {
            text: '考勤统计'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              label: {
                background: '#6a7985'
              }
            }
          },
          color: ['#2ec7c9', '#b6a2de', '#5ab1ef'],
          legend: {
            data: ['迟到', '早退', '正常']
          },
          grid: {
            left: '20',
            right: '20',
            bottom: '3',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: true,
            data: res.Data.DateArr,
            axisLine: {
              lineStyle: {
                color: '#55a8fd'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#55a8fd'
              }
            },
            axisTick: {}
          },
          yAxis: [
            {
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#3ba5d9'
                }
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#55a8fd'
                }
              }
            }
          ],
          series: [
            {
              name: '迟到',
              type: 'bar',
              // data: [38, 48, 37, 34, 53, 42, 21, 58, 53, 42, 21, 58]
              data: res.Data.Late
            },
            {
              name: '早退',
              type: 'bar',
              // data: [45, 51, 68, 21, 52, 82, 13, 35, 53, 42, 21, 58]
              data: res.Data.LeaveEarly
            },
            {
              name: '正常',
              type: 'bar',
              // data: [125, 140, 138, 130, 125, 125, 135, 145, 138, 130, 125, 125]
              data: res.Data.Normal
            }
          ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
        myChart.hideLoading()
      })
    }
  },
  mounted() {
    this.myEcharts()
    // let organizationID = this.$store.state.organizationID
  }
}
</script>

<style>
</style>