const $http = $import("dag/common/http");
const $tools = $import("dag/common/tools");

const URLS = {
  LIST: "/api/m/device/info/query",
  SAVE: "/api/m/device/info/save",
  BATCH_SAVE: "/api/m/device/info/saveBatch",
  REMOVE: "/api/m/device/info/deleteById",
  HISTORY: "/api/m/sys/edit/query",
  SAVE_PARAMS: "/api/m/device/params_commit/save",
  GET_PARAMS: "/api/m/device/params_commit/list",
  GET_WORKING_PARAMS: "/api/m/device/params_current/list",
  HISTORY_EXPORT: "/api/m/sys/edit/listExport",
  LOAD_SYNC_STATUS: "/api/m/device/params_commit/listParamsStatus",
};

export default {
  list(query, groupName) {
    return $http({
      url: URLS.LIST,
      type: "POST",
      data: query,
    }).then((res) => {
      res &&
        res.list &&
        res.list.forEach((item) => {
          item.groupName = item.groupName || groupName;
        });
      return res;
    });
  },
  save(batch) {
    return $http({
      url: URLS.SAVE,
      type: "POST",
      data: batch,
    });
  },
  saveBatch(batch) {
    return $http({
      url: URLS.BATCH_SAVE,
      type: "POST",
      data: batch,
    });
  },
  remove(recordId) {
    return $http({
      url: URLS.REMOVE,
      type: "POST",
      data: {
        recordId,
      },
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
  saveParams(model) {
    return $http({
      url: URLS.SAVE_PARAMS,
      type: "POST",
      data: model,
    });
  },
  getParams(deviceId) {
    return Promise.all([
      $http({
        url: URLS.GET_PARAMS,
        type: "POST",
        data: {
          deviceId,
        },
      }),
      $http({
        url: URLS.GET_WORKING_PARAMS,
        type: "POST",
        data: {
          deviceId,
        },
      }),
    ]).then((res) => {
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
  loadSyncStatus(query){
    return $http({
      url: URLS.LOAD_SYNC_STATUS,
      type: "POST",
      data: query,
    })
  }
};
