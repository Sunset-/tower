const $http = $import("dag/common/http");
const URLS = {
	SUMMARY: "/api/m/device/info/getDeviceStatistical",
	STATISTICS: "/api/m/device/statistic/list",
	LIST: "/api/m/data/real/queryIndexByCond",
	ALARM: "/api/m/data/real/queryAlarmIndexByCond",
};

export default {
	list(params) {
		return $http({
			url: URLS.LIST,
			type: "POST",
			data: params,
		}).then(res=>{
            res.list&&res.list.forEach(item=>{
                if(item.showData){
                    item.$showData = item.showData.split(",").reduce((res,kv)=>{
                        var kvs = kv.split(":");
                        if(kvs.length==2){
                            res[kvs[0]] = kvs[1];
                        }
                        return res;
                    },{})
                }else{
                    item.$showData = {};
                }
            });
            return res;
        });
	},
	alarm(params){
		return $http({
			url: URLS.ALARM,
			type: "POST",
			data: params,
		}).then(res=>{
            res.list&&res.list.forEach(item=>{
                if(item.showData){
                    item.$showData = item.showData.split(",").reduce((res,kv)=>{
                        var kvs = kv.split(":");
                        if(kvs.length==2){
                            res[kvs[0]] = kvs[1];
                        }
                        return res;
                    },{})
                }else{
                    item.$showData = {};
                }
            });
            return res;
        });
	},
	summary() {
		return $http({
			url: URLS.SUMMARY,
			type: "POST",
		});
	},
	statistics(params) {
		return $http({
			url: URLS.STATISTICS,
			type: "POST",
			data: params,
		});
	},
	device(deviceSN){
		return $http({
			url: "/api/m/data/real/query",
			type: "POST",
			data: {
				deviceSN
			},
		});
	}
};
