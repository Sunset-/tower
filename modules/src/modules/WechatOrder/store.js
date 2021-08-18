const URLS = {
	LIST: "/cloud-api/wechat_order/query",
	SAVE: "/api/product/save",
	REMOVE: "/api/product/remove",
	UPDATE_STATUS : "/cloud-api/wechat_order/updateStatus",
	UPDATE_CLAIM : "/cloud-api/wechat_order/updateClaim",
	MESSAGE: "/cloud-api/wechat_order/message",
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
		})
		.then((res) => {
			res.$flow = res.flows.reduce((res, item) => {
				res[item.status] = item.operateTime;
				return res;
			}, {});
			res.$message = res.messages.reduce(
				(res, item) => {
					res[item.category] = res[item.category] || [];
					res[item.category].push(item);
					return res;
				},
				{}
			);
			return res;
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
	updateStatus(model){
		return $http({
			url: URLS.UPDATE_STATUS,
			type: "post",
			data: model,
		});
	},
	updateClaim(model){
		return $http({
			url: URLS.UPDATE_CLAIM,
			type: "post",
			data: model,
		});
	},
	submitMessage(model){
		return $http({
			url: URLS.MESSAGE,
			type: "post",
			data: model,
		});
	}
};
