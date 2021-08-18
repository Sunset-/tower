// 声明全局的$tip $confirm

import "./index.less";

//tip
export default (function() {
    var $el = $(
      '<div class="dag-global-tip"><i class="xui_message-img iconfont"></i><span></span></div>'
    );
    $el.appendTo("body");
    var $span = $("span", $el);
    var $icon = $("i", $el);
    var queue = [];
    var showing = null;
    var iconType = {
      warning: "iconjinggaotishi",
      warn: "iconjinggaotishi",
      info: "iconputongtishi",
      success: "iconchenggongtishi",
      error: "iconjinggaotishi",
      danger: "iconjinggaotishi",
    };
    var Message = function(...options) {
      var msgObj = {};
      if (options.length === 2) {
        msgObj.message = options[0];
        msgObj.type = options[1] || "info";
      } else if (options.length === 1 && Sunset.isObject(options[0])) {
        msgObj = options[0];
      } else if (Sunset.isString(options[0])) {
        msgObj = {
          type: "info",
          message: options[0],
        };
      }
      return showMessage(msgObj);
    };
    function show(obj) {
      $icon.attr(
        "class",
        `xui_message-img iconfont ${iconType[obj.type]} ${obj.type}`
      );
      $el.attr("class", `dag-global-tip tip-${obj.type || "info"}`);
      $span.html(obj.msg);
      showing = obj;
      setTimeout(() => {
        $el.addClass("tip-show");
        setTimeout(() => {
          $el.removeClass("tip-show");
          showing = null;
          setTimeout(() => {
            if (queue.length) {
              show(queue.shift());
            }
          }, 300);
        }, 3000);
      }, 0);
    }
    function showMessage(options) {
      var msg = options.message,
        type = options.type;
      if (showing) {
        if (showing.type != type || showing.msg != msg) {
          queue.push({
            msg,
            type,
          });
        }
      } else {
        show({
          msg,
          type,
        });
      }
    }
    ["success", "warning", "info", "error", "warn"].forEach((type) => {
      Message[type] = (options) => {
        if (typeof options === "string") {
          options = {
            message: options,
          };
        }
        options = options || {};
        options.type = type;
        return showMessage(options);
      };
    });
    return Message;
  })();