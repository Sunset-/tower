import axios from "axios";
import $tip from "../tip/index.js";
import $tools from "../tools/index.js";
import $loading from "../loading/index.js";

function AXIOS(config, options) {
config.url+='?noSign'

  var silent = options && options.silent;
  return new Promise((resolve, reject) => {
    axios(config)
      .then((res) => {
        var result = res.data;
        if (result.code!==void 0) {
          if (result.code == 200 || result.code == "0"|| result.code == 0) {
            resolve(
              options.allRes
                ? result
                : result.data === void 0
                ? result
                : result.data
            );
          } else if (result.code===-4) {
						silent || $tip(result.msg);
						$router.push("/Login");
						$tools.delCookie("JSSID");
						$tools.removeLocalValue("menus");
					}  else {
            var err = {};
            err.code = result.code;
            err.msg =
              result.msg && result.msg.detail
                ? JSON.parse(result.msg.detail).msg.detail
                : (result.data && result.data.msg) ||
                  result.msg ||
                  result.msg ||
                  "服务异常";
            reject(err);
            if (err.msg) {
              silent || $tip(err.msg, "error");
            }
          }
        } else {
          resolve(result);
        }
      })
      .catch((err) => {
        if (!silent) {
          if (err.code == "ECONNABORTED") {
            $tip("请求超时", "error");
          } else if (result.code===-4) {
						silent || $tip(result.message);
						$router.push("/Login");
						$tools.delCookie("JSSID");
						$tools.removeLocalValue("menus");
					} else {
            var response = err.response || {};
            var msg =
              (response && response.data && response.data.message) ||
              "服务异常";
            $tip(msg, "error");
          }
        }
        $loading(false);
        reject(err);
      });
  });
}

export default (function(options) {
  var method = (options.type || options.method || "get").toLowerCase();
  var data = options.data;
  // if (data && (method == 'post' || method == 'put' || method == 'patch')) {
  //     data = JSON.stringify(data);
  // }
  var config = {
    url: options.url,
    method: method,
    data: data,
    timeout: options.timeout ? options.timeout : 30000,
  };
  // config.url = config.url.replace('vehicle_service','pvd_vehicle_service'); //换车辆服务名
  //替换路径参数
  if (data) {
    config.url = config.url.replace(/{\w+}/g, function(v) {
      var key = v.substring(1, v.length - 1);
      var value = data[key];
      delete data[key];
      return value;
    });
  }
  var headers = {};
  if (options.headers) {
    Object.assign(headers, options.headers);
  }
  if (method == "get") {
    config.params = data;
  }
  if (options.formdata) {
    config.transformRequest = [
      function(data) {
        let ret = "";
        for (let it in data) {
          if (data[it] !== undefined && data[it] !== null) {
            ret +=
              encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
          }
        }
        return ret;
      },
    ];
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  } else if (options.multipart) {
    let fromData = new FormData();
    for (let i in data) {
      fromData.append(i, data[i]);
    }
    config.data = fromData;
    headers["Content-Type"] = "multipart/form-data";
  } else {
    headers["Content-Type"] = "application/json;charset=UTF-8";
  }
  if (options.responseType) {
    config.responseType = options.responseType;
  }
  config.headers = headers;
  return AXIOS(config, options);
});
