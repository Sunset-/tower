export default function(ctx) {
  return {
    style: "width:100%",
    setOption: {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "30px",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.01],
        show: false,
        textStyle: {
          color: "#FFF",
        },
      },
      yAxis: {
        type: "category",
        data: ["巴西", "印尼", "美国", "印度", "中国", "世界人口(万)"],
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: "#FFF",
        },
      },
      series: [
        {
          name: "2011年",
          type: "bar",
          color: "#0A73FF",
          barMaxWidth : 35,
          data: [18203, 23489, 29034, 104970, 131744, 630230],
        },
      ],
    },
  };
}
