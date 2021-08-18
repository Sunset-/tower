const $http = $import("dag/common/http");

const URLS = {
  GET: "/api/file/get",
  QUERY: "/api/file/query",
  REMOVE_FILE: "/api/file/remove",
  REMOVE_CLOUD_FILE: "/cloud-api/file/remove",
  ASSIGN_COMPANY: "/api/file/assignCompany",
  GENERATE_PDF: "/api/file/generatePDF",
  GENERATE_DOC: "/api/file/generateDoc",
};

export default {
  get(filter) {
    return $http({
      url: URLS.GET,
      type: "get",
      data: filter,
    });
  },
  query(filter) {
    return $http({
      url: URLS.QUERY,
      type: "get",
      data: filter,
    });
  },
  removeFile(ids) {
    return $http({
      url: URLS.REMOVE_FILE,
      type: "post",
      data: {
        ids: ids,
      },
    });
  },
  removeCloudFile(ids) {
    return $http({
      url: URLS.REMOVE_CLOUD_FILE,
      type: "post",
      data: {
        ids: ids,
      },
    });
  },
  assignCompany(params) {
    return $http({
      url: URLS.ASSIGN_COMPANY,
      type: "post",
      data: params,
    });
  },
  generatePDF(params) {
    return $http({
      url: URLS.GENERATE_PDF,
      type: "post",
      data: params,
    });
  },
  generateDoc(params) {
    return $http({
      url: URLS.GENERATE_DOC,
      type: "post",
      data: params,
    });
  },
};
