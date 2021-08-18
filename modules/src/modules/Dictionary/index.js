const URLS = {
  LIST: "/api/dictionary/query",
  SAVE: "/api/dictionary/save",
  REMOVE: "/api/dictionary/remove",
};
const $http = $import("dag/common/http");

export function Query(filter) {
  return $http({
    url: URLS.LIST,
    type: "get",
    data: filter,
  });
}

export function Save(model) {
  return $http({
    url: URLS.SAVE,
    type: "post",
    data: [model],
  });
}

export function Remove(id) {
  return $http({
    url: URLS.REMOVE,
    type: "post",
    data: {
      ids: [id],
    },
  });
}
