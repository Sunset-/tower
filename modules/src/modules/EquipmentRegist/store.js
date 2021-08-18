const $http = $import("dag/common/http");

const URLS = {
	CHECK_SN: "/api/m/device/enregister/getBatchEnregisterStatus",
	SAVE: "/api/m/device/enregister/save",
};

export default {
	checkDeviceSN(sns) {
		return $http({
			url: URLS.CHECK_SN,
			type: "POST",
			data: {
				list: sns.map((item) => ({
					deviceSN: item,
				})),
			},
		}).then((res) => {
			return res.reduce((res, item) => {
				res[item.deviceSN] = item.enregisterStatus;
				return res;
			}, {});
		});
	},
	save(model) {
		return $http({
			url: URLS.SAVE,
			type: "POST",
			data: {
				deviceType: model.deviceType,
				list: JSON.parse(model.equipments),
			},
		});
	},
};
