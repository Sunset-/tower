
import $http from "../http/index.js";
import $tools from "../tools/index.js";
var config = {};

var cache = null,
	cachePromise = null;

export default {
	init() {
		return cachePromise = Promise.resolve(
			cache ||
				cachePromise ||
				$http({
					url: "/config/config.json"
				})
					.then(res => {
						return (config = res || {});
					})
					.then(res => {
						console.log("-------------------true");
						cachePromise = null;
						cache = true;
					})
		);
	},
	get(attr, defaultValue) {
		return $tools.getAttribute(config, attr, defaultValue);
	}
};