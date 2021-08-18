const URLS = {
  LIST: "/api/company/query",
  SAVE: "/api/company/save",
  REMOVE: "/api/company/remove",
  OFFICE: "/api/company/queryOffice",
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
  queryOffice(filter) {
    return $http({
      url: URLS.OFFICE,
      type: "get",
      data: filter,
    });
  },
  save(model) {
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
