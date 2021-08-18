const $http = $import("dag/common/http");

const URLS = {
	LIST: "/api/m/data/real/query",
	LIST_CGQ: "/api/m/data/real_ct/query",
};

export default {
	list(filter) {
		return $http({
			url: URLS.LIST,
			type: "POST",
			data: filter,
		}).then((res) => {
			res.list &&
				res.list.forEach((item) => {
					if (item.showData) {
						var otherSwitch = false;
						item.$showData = item.showData.split(";").reduce((res, kvc) => {
							kvc.split(",").forEach((kv) => {
								var kvs = kv.split(":");
								if (kvs.length == 2) {
									res[kvs[0]] = kvs[1];
									if (kvs[0].indexOf("switch") == 0 && kvs[1] == "1") {
										otherSwitch = true;
									}
								}
							});
							return res;
						}, {});
						item.$showData.$otherSwitch = otherSwitch;
					} else {
						item.$showData = {};
					}
				});
			return res;
		});
	},
	listCgq(filter) {
		var channels = ["T", "A1", "A2"];
		return $http({
			url: URLS.LIST_CGQ,
			type: "POST",
			data: filter,
		}).then((res) => {
			res.list &&
				res.list.forEach((item) => {
					if (item.showData) {
						var otherSwitch = false;
						item.$showData = item.showData.split(";").reduce((res, kvc) => {
							kvc.split(",").forEach((kv) => {
								var kvs = kv.split(":");
								if (kvs.length == 2) {
									res[kvs[0]] = kvs[1];
									if (kvs[0].indexOf("switch") == 0 && kvs[1] == "1") {
										otherSwitch = true;
									}
								}
							});
							return res;
						}, {});
						channels.forEach((c) => {
							item.$showData[`value${c}`] = item.$showData[c];
							item.$showData[`valuePre${c}`] = item.$showData[`${c}-previous`];
							item.$showData[`change${c}`] = item.$showData[`${c}-change`];
							item.$showData[`measureT`] = "℃";
							item.$showData[`measureA1`] = "mA";
							item.$showData[`measureA2`] = "mA";
						});
						item.$showData.$otherSwitch = otherSwitch;
					} else {
						item.$showData = {};
					}
				});
			return res;
		});
	},
	update() {},
	remove() {},
};
