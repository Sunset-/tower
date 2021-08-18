const $http = $import("dag/common/http");

const URLS = {
    UNBIND_EQ : "/api/m/device/enregister/query"
};

export default{
    list(query){
		return $http({
			url: URLS.UNBIND_EQ,
			type: "POST",
			data: query,
		});
    },
    update(){

    },
    remove(){

    }
}