import Store from "./store.js";

var Login = require("./index.vue");

export let Component = Login;

export function GetUserInfo(){
    return Store.getUserInfo();
}