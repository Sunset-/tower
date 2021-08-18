import chinaJson from "./china";
import echarts from "echarts";
echarts.registerMap("china", chinaJson);

export default function(ctx) {
    return {
        style: "width:100%",
        setOption: {
            tooltip: {
                trigger: "item",
                formatter(a, b, c) {
                    return `${a.name}<br/>${isNaN(a.value) ? 0 : a.value}`;
                },
            },
            visualMap: {
                min: 800,
                max: 50000,
                text: ["High", "Low"],
                realtime: false,
                calculable: true,
                inRange: {
                    color: ["#177EDB", "#0A5775"],
                },
            },
            series: [
                {
                    type: "map",
                    map: "china",
                    zoom: "1.2",
                    itemStyle: {
                        areaColor: "#34373C",
                        color: "red",
                    },
                    label: {
                        show: true,
                    },
                    data: [],
                },
            ],
        },
    };
}
