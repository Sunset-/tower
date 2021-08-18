import StaticDict from "./static";
import $http from "../http/index.js";
try {
    var XuiDictionary = SukiiXUI.Dictionary;
    var inited = false;
    var initPromise = null;
    XuiDictionary.install(StaticDict);
    XuiDictionary.init = function () {

    };
} catch (e) { }
export default XuiDictionary;