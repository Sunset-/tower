const $http = $import("dag/common/http");

const URLS = {
	LIST: "/api/m/data/real/query",
	EQ_LIST : "/api/m/device/params/list",
};

export default {
	list(filter) {
		return $http({
			url: URLS.LIST,
			type: "POST",
			data: filter,
		});
	},
	eqList(query){
		return $http({
			url: URLS.EQ_LIST,
			type: "POST",
			data: query,
		});
	},
	update() {},
	remove() {},
};
