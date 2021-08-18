const $http = $import("dag/common/http");

const URLS = {
	LIST: "/api/m/sys/role/query",
	SAVE: "/api/m/sys/role/save",
	GET_BY_ID: "/api/urm-resource/api/role/{id}",
	REMOVE: "/api/urm-resource/api/role/{id}",
};

const DAG_APPID = "002";

export default {
	permissionsCache: null,
	permissionsMapCache: null,
	list(filter) {
		return Promise.all([
			$http({
				url: URLS.LIST,
				type: "post",
				data: filter,
			}),
			this.getAllPermissionMap(),
		]).then((allRes) => {
			var res = allRes[0],
				pMap = allRes[1];
			res.list.forEach((item) => {
				if (!item.permissionCode) {
					return item;
				}
				if (item.permissionCode) {
					var permissionIds = [];
					item.permissionNames = item.permissionCode.split(",").map((k) => {
						permissionIds.push(k);
						return pMap[k] && pMap[k].name;
					})
						.filter((v) => !!v)
						.join(",");
					item.permissionIds = permissionIds;
				}
			});
			return res;
		});
	},
	save(model) {
		return $http({
			url: URLS.SAVE,
			type: model.id ? "put" : "post",
			data: model,
		});
	},
	getById(id) {
		return $http({
			url: URLS.GET_BY_ID,
			data: {
				id,
			},
		});
	},
	remove(id) {
		return $http({
			url: URLS.GET_BY_ID.replace(/{id}/, id),
			type: "DELETE",
		});
	},
	getAllPermissions() {
		return this.permissionsCache
			? Promise.resolve(this.permissionsCache)
			: $http({
					url: "/config/menu.json",
			  }).then((res) => {
					var nodes = [];
					if (res.menu) {
						function getMenus(list, parentId, isFunc) {
							list.forEach((item) => {
								var isParent = !item.module;
								if (isFunc) {
									isParent = false;
								}
								if (item.menu || item.children|| item.funcs) {
									isParent = true;
								}
								nodes.push({
									id: item.name,
									parentId: parentId,
									name: item.title,
									isParent: isParent,
								});
								if (item.menu || item.children) {
									getMenus(item.menu || item.children, item.name);
								}
								if (item.funcs) {
									getMenus(item.funcs, item.name, true);
								}
							});
						}
						getMenus(res.menu, "0");
          }
					return (this.permissionsCache = nodes);
			  });
	},
	getAllPermissionMap() {
		return this.permissionsMapCache
			? Promise.resolve(this.permissionsMapCache)
			: this.getAllPermissions().then((res) => {
					return (this.permissionsMapCache = res.reduce((res, item) => {
						res[item.id] = item;
						return res;
					}, {}));
			  });
	},
};
