$import.regist("SukiiXUI", require("./xui/index"));
// $import.regist("dag/Service", require("./services/index.js"));
// $import.regist("dag/Common", require("./common/index.js"));
$import.regist("dag/Style", require("./style/index.js"));

//test
$import.registSync("dag/common", require("../modules/src/common/index.js"));

$import.regist("dag/modules/Frameset", require("../modules/src/modules/Frameset/index.js"));

$import.regist("dag/modules/Login", require("../modules/src/modules/Login/index.js"));
$import.regist("dag/modules/Home", require("../modules/src/modules/Home/index.js"));
$import.regist("dag/modules/Project", require("../modules/src/modules/Project/index.js"));
$import.regist("dag/modules/Equipment", require("../modules/src/modules/Equipment/index.js"));
$import.regist("dag/modules/EquipmentRegist", require("../modules/src/modules/EquipmentRegist/index.js"));
$import.regist("dag/modules/UserManage", require("../modules/src/modules/UserManage/index.js"));
$import.regist("dag/modules/RoleManage", require("../modules/src/modules/RoleManage/index.js"));
$import.regist("dag/modules/RealtimeDataView", require("../modules/src/modules/RealtimeDataView/index.js"));
$import.regist("dag/modules/HistoryDataView", require("../modules/src/modules/HistoryDataView/index.js"));
$import.regist("dag/modules/WorkDataView", require("../modules/src/modules/WorkDataView/index.js"));
$import.regist("dag/modules/HistoryDataAnalysis", require("../modules/src/modules/HistoryDataAnalysis/index.js"));
$import.regist("dag/modules/AlarmDataAnalysis", require("../modules/src/modules/AlarmDataAnalysis/index.js"));
$import.regist("dag/modules/SystemConfig", require("../modules/src/modules/SystemConfig/index.js"));
$import.regist("dag/modules/Screen", require("../modules/src/modules/Screen/index.js"));

$import.regist("dag/components/Logo", require("../modules/src/components/Logo/index.js"));
$import.regist("dag/components/Charts", require("../modules/src/components/Charts/index.js"));
$import.regist("dag/components/Breadcrumb", require("../modules/src/components/Breadcrumb/index.js"));
$import.regist("dag/components/Date", require("../modules/src/components/Date/index.js"));
$import.regist("dag/components/Edittable", require("../modules/src/components/Edittable/index.js"));
$import.regist("dag/components/ImageViewer", require("../modules/src/components/ImageViewer/index.js"));
$import.regist("dag/components/Tree", require("../modules/src/components/Tree/index.js"));
$import.regist("dag/components/ProjectSelector", require("../modules/src/components/ProjectSelector/index.js"));
$import.regist("dag/components/EquipmentSelector", require("../modules/src/components/EquipmentSelector/index.js"));
$import.regist("dag/components/Triple", require("../modules/src/components/Triple/index.js"));
$import.regist("dag/components/Map", require("../modules/src/components/Map/index.js"));
$import.regist("dag/components/MapMarker", require("../modules/src/components/MapMarker/index.js"));
$import.regist("dag/components/Base64image", require("../modules/src/components/Base64image/index.js"));
