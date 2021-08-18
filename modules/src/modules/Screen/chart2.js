export default function(ctx) {
  return {
    style: "width:100%",
    setOption: {
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: ctx.title,
          type: "pie",
          radius: ["60%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "20",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 1048, name: "离线", color: "#dedede" },
            { value: 735, name: "在线", color: "#0A73FF" },
          ],
        },
      ],
    },
  };
}
