const URLS = {
	LIST: "/api/config/query",
	SAVE: "/api/config/save",
};
const $http = $import("dag/common/http");

var allConfigKeys = [
	{
		id: "CONFIG_TRANSACTION_KEYS",
		name: "交易记录excel识别映射表",
	},
	{
		id: "CONFIG_TRANSACTION_CATEGORY",
		name: "交易记录交易类别识别配置",
	},
];

export default {
	list(filter) {
		return $http({
			url: URLS.LIST,
			type: "get",
			data: filter,
		}).then((res) => {
			res = res || [];
			var configed = {};
			res.forEach((item) => {
				configed[item.id] = true;
			});
			allConfigKeys.forEach((k) => {
				if (!configed[k.id]) {
					res.push({
						id: k.id,
						name: k.name,
					});
				}
			});
			return res;
		});
	},
	save(model) {
		return $http({
			url: URLS.SAVE,
			type: "post",
			data: [model],
		});
	},
	saveUser(model) {
		return $http({
			url: "/api/m/sys/user/save",
			type: "put",
			data: model,
		});
	},
};
