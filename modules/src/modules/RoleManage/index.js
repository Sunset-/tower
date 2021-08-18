import Store from "./store.js";

export { default as Component } from "./index.vue";

export function GetRoles(filter){
    return Store.list(filter)
}