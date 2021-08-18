import Store from "./store";

export { default as Component } from "./index.vue";

export function GetProducts(filter){
    return Store.list(filter);
}
