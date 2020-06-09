<template>
  <div id="myChart" :style="{width: '100%', height: '300px'}"></div>
</template>

<script>
import westeros from '../../assets/js/them.json'
import { GetNotifyByEcharts } from '../../api/api.js'
export default {
  methods: {
    myEcharts() {
      this.$echarts.registerTheme('westeros', westeros)

      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(
        document.getElementById('myChart'),
        'westeros'
      )
      myChart.showLoading()
      GetNotifyByEcharts({
        organizationID: this.$store.state.organizationID
      }).then(res => {
        console.log(res)
        res.Data.DateArr.forEach((element, index, arr) => {
          arr[index] = element + '日'
        })
        // 指定图表的配置项和数据
        var option = {
          title: {
            text: '进出记录'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                background: '#6a7985'
              }
            }
          },
          color: ['#f4516c', '#55a8fd'],
          legend: {
            data: ['进', '出']
          },
          grid: {
            left: '20',
            right: '20',
            bottom: '3',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            // data: ['1日', '2日', '3日', '4日', '5日', '6日'],
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
            }
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
              name: '进',
              type: 'line',
              data: [25, 35, 45, 40, 35, 20, 10, 8],

              lineStyle: {
                color: '#f4516c'
              },
              smooth: true,
              animationDuration: 2800,
              animationEasing: 'quadraticOut'
            },
            {
              name: '出',
              type: 'line',
              data: [25, 10, 8, 10, 20, 20, 35, 45],
              lineStyle: {
                color: '#55a8fd'
              },
              smooth: true,
              animationDuration: 2800,
              animationEasing: 'quadraticOut'
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
  }
}
</script>

<style>
</style>