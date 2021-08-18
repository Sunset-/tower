const $http = $import("dag/common/http");
const $tools = $import("dag/common/tools");

const URLS = {
	LIST: "/api/m/device/group/query",
	SAVE: "/api/m/device/group/save",
	HISTORY: "/api/m/sys/edit/query",
	HISTORY_EXPORT: "/api/m/sys/edit/listExport",
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
};
