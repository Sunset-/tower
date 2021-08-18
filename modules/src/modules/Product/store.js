const URLS = {
  LIST: "/api/product/query",
  SAVE: "/api/product/save",
  REMOVE: "/api/product/remove",
  SYNC: "/api/product/sync",
  FILES: "/api/file/files",
  LIST_DEFENDANT: "/api/defendant/query",
  SAVE_DEFENDANT: "/api/defendant/save",
  REMOVE_DEFENDANT: "/api/defendant/remove",
};
const $http = $import("dag/common/http");

export default {
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
  syncAll() {
    return $http({
      url: URLS.SYNC,
      type: "post",
    });
  },
  files(filter) {
    return $http({
      url: URLS.FILES,
      type: "get",
      data: filter,
    });
  },
  listDefendant(filter) {
    return $http({
      url: URLS.LIST_DEFENDANT,
      type: "get",
      data: filter,
    });
  },
  saveDefendant(model) {
    return $http({
      url: URLS.SAVE_DEFENDANT,
      type: "post",
      data: [model],
    });
  },
  removeDefendant(id) {
    return $http({
      url: URLS.REMOVE_DEFENDANT,
      type: "post",
      data: {
        ids: [id],
      },
    });
  },
};
