const $http = $import("dag/common/http");

const URLS = {
    ANALYSIS: "/api/m/data/record/queryDataAnalysis",
    ANALYSIS_CGQ: "/api/m/data/record_ct/list",
};

export default {
    list(filter) {
        return $http({
            url: URLS.ANALYSIS,
            type: "POST",
            data: filter,
        }).then((res) => {
            if (filter.compareType == 1) {
                res = [res];
            }
            return res;
        });
    },
    listCgq(filter) {
        return $http({
            url: URLS.ANALYSIS_CGQ,
            type: "POST",
            data: filter,
        }).then((res) => {
            if (filter.compareType == 1) {
                res = [res];
            }
            return res;
        });
    },
};
