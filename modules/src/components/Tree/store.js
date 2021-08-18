const $http = $import("dag/common/http");
const $dictionary = $import("dag/common/dictionary");

const URLS = {
	GROUP_LIST: "/api/m/device/group/query", // 卡口列表
	EQLIST: "/api/m/device/info/query", // 设备列表
};

export default {
	groupList(query) {
		return $http({
			url: URLS.GROUP_LIST,
			type: "POST",
			data: query,
		}).then((res) => {
			var channelData = res.extData||{};
			var nodes = [];
			res &&
				res.list &&
				res.list.forEach((item) => {
					item.id = item.groupId;
					item.parentId = "0";
					item.name = item.groupName;
					item.type = "group";
					nodes.push(item);
					if (item.list) {
						item.list.forEach((device) => {
							device.id = device.deviceId;
							device.parentId = item.id;
							device.name = device.deviceName;
							device.groupName = item.groupName;
							device.groupId = item.groupId;
							device.type = "device";
							//channel
							device.channels = [];
							channelData[device.deviceSN]&&Object.keys(channelData[device.deviceSN]).forEach(c=>{
								device.channels.push({
									channelNum : c,
									measure : channelData[device.deviceSN][c],
									text : `通道${c}(${$dictionary.transcode('CHANNEL_DATA_TYPE',channelData[device.deviceSN][c])})`
								});
							});
							nodes.push(device);
						});
					}
				});
			return nodes;
		});
	},
	eqList(group) {
		return $http({
			url: URLS.EQLIST,
			type: "POST",
			data: {
				pageIndex: 1,
				pageSize: 99999,
				groupId: group.id,
				isActive: 1,
			},
		}).then((res) => {
			return (
				(res &&
					res.list &&
					res.list.map((item) => {
						item.id = item.deviceId;
						item.parentId = group.id;
						item.name = item.deviceName;
						item.type = "device";
						return item;
					})) ||
				[]
			);
		});
	},
};
