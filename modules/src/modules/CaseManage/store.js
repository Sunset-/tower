const URLS = {
  LIST: "/api/customer/query",
  SAVE: "/api/customer/save",
  GET_BY_ID: "/api/customer/get",
  FILES: "/api/customer/files",
  REMOVE: "/api/customer/remove",
  LIST_TRANSACTION: "/api/transaction/query",
  LIST_ORDER: "/api/order/query",
  SAVE_ORDER: "/api/order/save",
  REMOVE_ORDER: "/api/order/remove",
  GENERATE_PLAINT: "/api/order/generatePlaint",
  CALCULATE_TRANSACTION: "/api/order/calculateTransaction",
  EXPORT_CALCULATE: "/api/order/exportCalculate",
  CORRECT: "/api/transaction/correct",
  RE_CALCULATE: "/api/order/reCalculate",
  REMOVE_TRANSACTION: "/api/transaction/remove",
  OCR_IDCARD: "/api/customer/ocrIdCard",
  LINK_WECHAT: "/api/order/linkWechatOrder",
  GET_GROUPS: "/api/transaction/getTransactionGroup",
  SAVE_GROUPS: "/api/transaction/saveTransactionGroup",
};
const $http = $import("dag/common/http");

export default {
  get(id) {
    return $http({
      url: URLS.GET_BY_ID,
      type: "get",
      data: { id },
    });
  },
  list(filter) {
    return $http({
      url: URLS.LIST,
      type: "post",
      data: filter,
    });
  },
  files(filter) {
    return $http({
      url: URLS.FILES,
      type: "get",
      data: filter,
    });
  },
  save(model) {
    model.updateTime = Date.now();
    return $http({
      url: URLS.SAVE,
      type: "post",
      data: model,
    });
  },
  remove(ids) {
    return $http({
      url: URLS.REMOVE,
      type: "post",
      data: {
        ids: ids,
      },
    });
  },
  export(template, model) {
    return $http({
      url: URLS.EXPORT + `?template=${template}`,
      type: "post",
      data: model,
      responseType: "blob",
    });
  },
  listTransaction(filter) {
    return $http({
      url: URLS.LIST_TRANSACTION,
      type: "post",
      data: filter,
    }).then((res) => {
      res.list &&
        res.list.forEach((item) => {
          var $errors = {};
          if (item.errors) {
            try {
              $errors = JSON.parse(item.errors);
            } catch (e) {
              console.log("errros解析异常", item.errors, e);
            }
          }
          item.$errors = $errors;
        });
      return res;
    });
  },
  listOrder(filter) {
    return $http({
      url: URLS.LIST_ORDER,
      type: "get",
      data: filter,
    });
  },
  saveOrder(model) {
    return $http({
      url: URLS.SAVE_ORDER,
      type: "post",
      data: [model],
    });
  },
  removeOrder(id) {
    return $http({
      url: URLS.REMOVE_ORDER,
      type: "post",
      data: {
        ids: [id],
      },
    });
  },
  generatePlaint(record) {
    return $http({
      url: URLS.GENERATE_PLAINT,
      type: "post",
      data: record,
    });
  },
  CalculateTransaction(id) {
    return $http({
      url: URLS.CALCULATE_TRANSACTION,
      type: "get",
      data: {
        id,
      },
    });
  },
  exportCalculate(id, capitalAccountGroup) {
    return $http({
      url: `${URLS.EXPORT_CALCULATE}?id=${id}&capitalAccountGroup=${capitalAccountGroup}`,
      type: "get",
      responseType: "blob",
    });
  },
  correct(model) {
    return $http({
      url: `${URLS.CORRECT}`,
      type: "post",
      data: model,
    });
  },
  reCalculate(ids) {
    return $http({
      url: `${URLS.RE_CALCULATE}`,
      type: "post",
      data: {
        ids,
      },
    });
  },
  removeTransactions(ids) {
    return $http({
      url: URLS.REMOVE_TRANSACTION,
      type: "post",
      data: {
        ids: ids,
      },
    });
  },
  ocrIdCard(model) {
    return $http({
      url: URLS.OCR_IDCARD,
      type: "post",
      data: model,
    });
  },
  linkWechatOrder(model) {
    return $http({
      url: URLS.LINK_WECHAT,
      type: "post",
      data: model,
    });
  },
  getGroups(id) {
    return $http({
      url: URLS.GET_GROUPS,
      data: {
        customerId: id,
      },
    });
  },
  saveGroups(acs, id) {
    return $http({
      url: URLS.SAVE_GROUPS + "/" + id,
      type: "POST",
      data: acs,
    });
  },
};
