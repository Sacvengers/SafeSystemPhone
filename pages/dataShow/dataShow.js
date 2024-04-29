// index.js
// 开始引入Echarts文件
import * as echarts from '../../ec-canvas/echarts';

Page({
    data: {
        // 饼图
        ecPie: {
            onInit: initPieChart,
        },
    },
})

function initPieChart(canvas, width, height, dpr) {
    const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
    });
    canvas.setChart(chart);
    wx.request({
        url: 'http://47.120.32.75:8080/record/kind_levels_count',
        method: 'GET',
        success: (res) => {
            let obj = {};
            let list = [];
            for (let i = 0; i < res.data.levels.length; i++) {
                obj = {};
                obj.name = res.data.levels[i].level + "型攻击";
                obj.value = res.data.levels[i].count;
                list.push(obj)
            }
            let option = {
                title: {
                    text: '攻击类型统计',
                    subtext: 'Fake Data',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: list
                    }
                ]
            };
            chart.setOption(option);
        },
        fail: (res) => {
            console.error('请求失败', res);
        }
    });

    return chart;
}

