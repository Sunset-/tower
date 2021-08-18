const URLS = {
  LIST: "/api/config/query",
  SAVE: "/api/config/save",
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
    return $http({
      url: URLS.SAVE,
      type: "post",
      data: [model],
    });
  },
};
