// 声明全局的$tip $confirm

import "./index.less";


//confirm
export default  (function() {
  var $el, $content, $ensure, $cancel, promise;
  function show(flag) {
    $el[flag ? "show" : "hide"]();
    setTimeout(() => {
      if (flag) {
        $el.addClass("visible");
      } else {
        $el.removeClass("visible");
      }
    }, 0);
  }
  function generateConfirmEl() {
    var wrap = document.createElement("div");
    wrap.className = "dag-global-confirm";
    wrap.innerHTML = `
		<div class="global-confirm-box">
			<header>
				<span class="global-confirm-title">提示</span>
				<i class="xui-icon xui-icon-close"></i>
			</header>
			<div>
				<p class="global-confirm-content">确定要删除这些条目吗？</p>
			</div>
			<footer>
			<button class="xui-btn xui-btn-style xui-btn-normal xui-btn-default global-confirm-cancel">取消</button>
				<button class="xui-btn xui-btn-style xui-btn-normal xui-btn-primary global-confirm-ensure">确定</button>

			</footer>
		</div>
		<div class="global-confirm-mask"></div>
		`;
    document.body.appendChild(wrap);
    $el = $(wrap);
    $content = $(".global-confirm-content", wrap);
    $ensure = $(".global-confirm-ensure", wrap);
    $cancel = $(".global-confirm-cancel", wrap);
    $el.on("click", (ev) => {
      var $target = $(ev.target);
      if (
        $target.hasClass("xui-icon-close") ||
        $target.hasClass("global-confirm-cancel")
      ) {
        show(false);
        promise && promise.reject();
      } else if ($target.hasClass("global-confirm-ensure")) {
        show(false);
        promise && promise.resolve();
      }
    });
  }
  return function(msg) {
    if (!document.getElementsByClassName(".global-confirm")[0]) {
      generateConfirmEl();
    }
    $content.html(msg);
    show(true);
    return new Promise((resolve, reject) => {
      promise = {
        resolve,
        reject,
      };
    });
  };
})();
