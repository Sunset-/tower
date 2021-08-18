import $dictionary from "../dictionary"
Vue.filter("dict", (v, enumType, unmatch) => {
	return $dictionary.transcode(enumType, v, unmatch);
});

Vue.filter("time", (v, fmt) => {
	return Sunset.Dates.format(v, fmt);
});

// 数字三位分割
Vue.filter("number", function (v) {
	if (!v) {
		return "0";
	} else {
		return `${v}`.replace(/\B(?=(?:\d{3})+\b)/g, ",");
	}
});