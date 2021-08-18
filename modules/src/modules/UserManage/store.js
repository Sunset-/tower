const $http = $import("dag/common/http");
const $tools = $import("dag/common/tools");

const URLS = {
	LIST: "/api/m/sys/user/query",
	USER: "/api/m/sys/user/save",
	HISTORY: "/api/m/sys/session/query",
	EXPORTS: "/api/m/sys/session/listExport",
	resetPassword: "/api/m/sys/user/resetPassword",
	SAVE_USER_PERMISSION : "/api/m/device/group/saveBatchGroupUser",
	GET_USER_PERMISSION : "/api/m/device/group/list",
	BATCH_UPDATE_LOGO : "/api/m/sys/user/updateBatchLogoTitles",
	editorPassword: "/api/urm-resource/api/user/modifyPassword",
	checkUserExist: "/api/urm-resource/api/user/checkUserExist",
	RESOURCE_PERMISSION: "/api/dag/v2/resource/user/config/save",
	GET_RESOURCE_PERMISSION: "/api/dag/v2/resource/user/config/get/{id}",
};

export default {
	list(filter) {
		return $http({
			url: URLS.LIST,
			type: "post",
			data: filter,
		});
	},
	save(model) {
		delete model.isActiveText;
		delete model.isActive_Value;
		return $http({
			url: URLS["USER"],
			type: model.id ? "put" : "post",
			data: model,
		});
	},
	history(filter) {
		return $http({
			url: URLS.HISTORY,
			type: "post",
			data: filter,
		});
	},
	exportHistory(filter) {
		return $http({
			url: URLS.EXPORTS,
			type: "POST",
			data: filter,
			responseType: "blob",
			timeout: 60000,
		}).then((res) => {
			$tools.downloadFile("登录记录.xlsx", res);
			$loading(false);
		});
	},
	editorPassSave(model) {
		return $http({
			url: URLS.editorPassword,
			type: "put",
			formdata: true,
			data: model,
		});
	},
	remove(id) {
		return $http({
			url: `${URLS.USER}/${id}`,
			type: "delete",
		});
	},
	resetPassword(userId) {
		return $http({
			url: `${URLS.resetPassword}`,
			type: "post",
			data: {
				userId: userId,
			},
		});
	},
	saveUserPermission(model){
		return $http({
			url: `${URLS.SAVE_USER_PERMISSION}`,
			type: "post",
			data: model,
		});
	},
	getUserPermission(userId){
		return $http({
			url: `${URLS.GET_USER_PERMISSION}`,
			type: "post",
			data: {
				userId
			},
		});
	},
	batchUpdateUserLogo(model){
		return $http({
			url: `${URLS.BATCH_UPDATE_LOGO}`,
			type: "post",
			data: model
		});
	},
	checkUserExist(model) {
		return $http({
			url: `${URLS.checkUserExist}`,
			type: "post",
			data: model,
		});
	},
	saveResourcePermission(model) {
		return $http({
			url: URLS.RESOURCE_PERMISSION,
			type: "post",
			data: model,
		});
	},
	getResourcePermission(id) {
		return $http({
			url: URLS.GET_RESOURCE_PERMISSION,
			data: {
				id,
			},
		}).then((res) => {
			if (res && res.config) {
				return JSON.parse(res.config);
			} else {
				return null;
			}
		});
	},
};
