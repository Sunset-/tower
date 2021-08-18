import "./index.less";
export default (function (options) {
    var $el;

    function getEl() {
        var wrap = document.createElement("div");
        wrap.className = 'dag-body-load';
        wrap.innerHTML = `
            <div  class="dag-load-loading ">
                <div class='dag-load-ring'></div>
            </div>
            `;
        document.body.appendChild(wrap);
        $el = $(wrap)
    };
    return function (option) {
        if ($('.dag-body-load').length == 0) {
            getEl();
        }
        return option ? $el.show() : $el.hide()
    };
})();