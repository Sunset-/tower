/**
 * 全局业务工具类
 */

var currentUser = null;
var waitUser = [];

var cacheuser = localStorage.getItem("userInfo");
if (cacheuser) {
	try {
		currentUser = JSON.parse(cacheuser);
	} catch (e) {}
}

export default {
	/**
	 * 获取当前登录用户
	 */
	getCurrentUser() {
		if (!currentUser) {
			var cacheuser = localStorage.getItem("userInfo");
			if (cacheuser) {
				try {
					currentUser = JSON.parse(cacheuser);
				} catch (e) {}
			}
		}
		return currentUser || {};
	},
	getCurrentUserPromise() {
		return new Promise((resolve) => {
			var user = this.getCurrentUser();
			if (user) {
				resolve(user);
			} else {
				waitUser.push(resolve);
			}
		});
	},
	setCurrentUser(user) {
		currentUser = user;
		localStorage.setItem("userInfo", JSON.stringify(user));
		while (waitUser.length) {
			waitUser.shift()(user);
		}
	},
	checkPermission(p) {
		var user = this.getCurrentUser();
		if (!user) {
			return false;
		}
		if (user.admin) {
			return true;
		}
		if (user.userId == 1) {
			return true;
		}
		if (!user.permissionMap) {
			user.permissionMap = (user.permissionCode ? user.permissionCode.split(",") : []).reduce((res, id) => {
				res[id] = true;
				return res;
			}, {});
		}
		return !!user.permissionMap[p];
	},
};
