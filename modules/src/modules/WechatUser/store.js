const URLS = {
	LIST: "/cloud-api/wechat_user/query",
	SAVE: "/api/product/save",
	REMOVE: "/api/product/remove",
};
const $http = $import("dag/common/http");

export default {
	get(id){
		return $http({
			url: URLS.LIST,
			type: "get",
			data: {
				id
			},
		});
	},
	list(filter) {
		return $http({
			url: URLS.LIST,
			type: "get",
			data: filter,
		});
	},
	save(model) {
		model.isSync = 0;
		return $http({
			url: URLS.SAVE,
			type: "post",
			data: [model],
		});
	},
	remove(id) {
		return $http({
			url: URLS.REMOVE,
			type: "post",
			data: {
				ids: [id],
			},
		});
	},
};
