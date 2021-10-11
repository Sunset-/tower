const $http = $import("dag/common/http");
const $tools = $import("dag/common/tools");
const $tip = $import("dag/common/tip");

const URLS = {
    LIST: "/api/m/data/work_record/query",
    LIST_CGQ: "/api/m/data/record_ct/query",
    HISTORY_EXPORT: "/api/m/data/record/listExport",
    HISTORY_EXPORT_CGQ: "/api/m/data/record_ct/listExport",
    GET_WORKING_PARAMS: "/api/m/device/params_current/list",
};

export default {
    list(filter) {
        return $http({
            url: URLS.LIST,
            type: "POST",
            data: filter,
        }).then((res) => {
            res.list &&
                res.list.forEach((item) => {
                    if (item.showData) {
                        item.$showData = item.showData
                            .split(",")
                            .reduce((res, kv) => {
                                var kvs = kv.split(":");
                                if (kvs.length == 2) {
                                    res[kvs[0]] = kvs[1];
                                }
                                return res;
                            }, {});
                    } else {
                        item.$showData = {};
                    }
                });
            return res;
        });
    },
    listCgq(filter) {
        return $http({
            url: URLS.LIST_CGQ,
            type: "POST",
            data: filter,
        }).then((res) => {
            res.list &&
                res.list.forEach((item) => {
                    if (item.showData) {
                        item.$showData = item.showData
                            .split(",")
                            .reduce((res, kv) => {
                                var kvs = kv.split(":");
                                if (kvs.length == 2) {
                                    res[kvs[0]] = kvs[1];
                                }
                                return res;
                            }, {});
                    } else {
                        item.$showData = {};
                    }
                });
            return res;
        });
    },
    exportHistory(query, deviceName) {
        return $http({
            url: URLS.HISTORY_EXPORT,
            type: "POST",
            data: query,
            responseType: "blob",
        }).then((res) => {
            if (res.type == "text/plain") {
                $tip("没有符合条件的数据", "warning");
                return;
            }
            $tools.downloadFile(`${deviceName}_历史记录.xlsx`, res);
        });
    },
    exportHistoryCgq(query, deviceName) {
        return $http({
            url: URLS.HISTORY_EXPORT_CGQ,
            type: "POST",
            data: query,
            responseType: "blob",
        }).then((res) => {
            if (res.type == "text/plain") {
                $tip("没有符合条件的数据", "warning");
                return;
            }
            $tools.downloadFile(`${deviceName}_历史记录.xlsx`, res);
        });
    },
    getEquipmentParams(deviceId) {
        return $http({
            url: URLS.GET_WORKING_PARAMS,
            type: "POST",
            data: {
                deviceId,
            },
        });
    },
};
