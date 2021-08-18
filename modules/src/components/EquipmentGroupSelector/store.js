const $http = $import("dag/common/http");

const URLS = {
	LIST: "/api/m/device/group/query",
};

export default{
	list(query) {
		return $http({
			url: URLS.LIST,
			type: "POST",
			data: query,
		});
	},
    update(){

    },
    remove(){

    }
}