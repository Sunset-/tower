const $http = $import("dag/common/http");
const $tools = $import("dag/common/tools");

const URLS = {
	LIST: "/api/m/project/info/query",
	SAVE: "/api/m/project/info/save",
	REMOVE: "/api/m/project/info/deleteById",
	HISTORY: "/api/m/sys/edit/query",
	HISTORY_EXPORT: "/api/m/sys/edit/listExport",
	EQ_LIST : "/api/m/device/params/list"
};

export default {
	list(query) {
		return $http({
			url: URLS.LIST,
			type: "POST",
			data: query,
		});
	},
	save(model) {
		return $http({
			url: URLS.SAVE,
			type: "POST",
			data: model,
		});
	},
	remove(model) {
		return $http({
			url: URLS.REMOVE,
			type: "POST",
			data: model,
		});
	},
	history(query) {
		return $http({
			url: URLS.HISTORY,
			type: "POST",
			data: query,
		}).then((res) => {
			res &&
				res.list &&
				res.list.forEach((item) => {
					try {
						item.contentRecord = JSON.parse(item.content);
					} catch (e) {
						console.error(e);
						item.contentRecord = {};
					}
				});
			return res;
		});
	},
	exportHistory(query) {
		return $http({
			url: URLS.HISTORY_EXPORT,
			type: "POST",
			data: query,
			responseType: "blob",
		}).then((res) => {
			$tools.downloadFile("编辑记录.xlsx", res);
		});
	},
	eqList(query){
		return $http({
			url: URLS.EQ_LIST,
			type: "POST",
			data: query,
		});
	}
};
