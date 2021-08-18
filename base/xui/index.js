
import SukiiXUI from "./xui.js";
import "./xui.css";
import "./style/index.less";
import Validator from "./validator";
// import ext from "./ext.js";

import Fasttree from "./fasttree/index.vue";

window.SukiiXUI = SukiiXUI;
window.Sunset = SukiiXUI.Sunset;

module.exports = function (Vue) {
	Vue.use(SukiiXUI, {
		prefix: "xui"
	});
	Validator(SukiiXUI);
	// ext(SukiiXUI);

	Vue.component("xui-fasttree",Fasttree)
};
