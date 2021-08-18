export default function(ctx,options) {
  return {
    style: "width:100%",
    setOption: {
      color: ["#03A0EE", "#FF8528"],
      legend: {
        data: ["数据"],
        right: "5%",
        top: 10,
        textStyle: {
          color: "#000",
          fontSize: 14,
        },
      },
      grid: {
        left: "5%",
        right: "10%",
        bottom: "5%",
        top: "20%",
        containLabel: true,
      },
      // dataZoom: [
      //   {
      //     type: "inside",
      //     throttle: 50
      //   }
      // ],
      tooltip: {
        trigger: "item",
        backgroundColor: "#fff",
        borderWidth: 3,
        padding: 10,
        borderColor: "rgba(227,234,236,0.3)",
        textStyle: {
          color: "#333",
        },
        axisPointer: {
          type: "line",
          lineStyle: {
            color: "#DEDEDE",
          },
        },
      },
      xAxis: {
        type: "category",
        data: [],
        boundaryGap: false,
        axisTick: {
          //y轴刻度线
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: "##999999",
            fontSize: "12",
          },
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#DEDEDE",
          },
        },
      },
      yAxis: [
        {
          type: "value",
          // name: "近期转出数据",
          min: 0,
          axisLabel: {
            textStyle: {
              color: "#999999",
              fontSize: "12",
            },
          },
          // nameTextStyle: {
          //   color: "#fff",
          //   fontSize: "16"
          // },
          axisTick: {
            //y轴刻度线
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#DEDEDE",
              type: "dashed",
            },
          },
        },
      ],
      series: [
        {
          name: options.title,
          data: [50, 10, 20, 30, 80, 20, 40],
          type: "line",
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#0A73FF", // 0% 处的颜色
                },
                {
                  offset: 0.4,
                  color: "#0A73FF", // 100% 处的颜色
                },
                {
                  offset: 1,
                  color: "#0f1418", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          symbolSize: 5,
          itemStyle: {
            color: "#0A73FF",
          },
        },
      ],
    },
  };
}
