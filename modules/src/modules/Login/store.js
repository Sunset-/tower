const $tools = $import("dag/common/tools");
const $http = $import("dag/common/http");
const $business = $import("dag/common/business");
const $config = $import("dag/common/config");

const URLS = {
    GET_USER_INFO: "/api/m/sys/user/getUserInfo",
    REGIST: "/api/m/sys/user/regist",
    REGIST: "/api/m/sys/user/regist",
    LOGIN_BY_SCAN: "/api/m/sys/user/login",
};

export default {
    getUserInfo() {
        return $http({
            url: URLS.GET_USER_INFO,
            type: "post",
            data: {},
            silent: true,
        }).then((res) => {
            $business.setCurrentUser(res);
            return res;
        });
    },
    getUserPermission(id) {
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
    regist(model) {
        return $http({
            url: URLS.REGIST,
            type: "POST",
            data: model,
        });
    },
    loginByScan(model) {
        return $http({
            url: URLS.LOGIN_BY_SCAN,
            type: "POST",
            data: model,
        });
    },
};
