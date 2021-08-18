
import store from './store.js';
export let Component = require("./index.vue");

export function getResourceData(filter) {
    return store.getResourceData(filter);
}

export function loadAncestors(filter, orgType) {
    return store.loadAncestors(filter, orgType);
}
export function orgTree(filter, orgType) {
    return store.orgTree(filter, orgType);
}
export function tree(filter) {
    return store.tree(filter);
}
export function asyncTree(filter) {
    return store.asyncTree(filter);
}

export function allEquipmentOrg(filter) {
    return store.allEquipmentOrg(filter);
}
export function RESOURCE_TYPE_ORG(filter) {
    return store.RESOURCE_TYPE_ORG;
}
export function getResourceMapByIds(filter) {
    return store.getResourceMapByIds(filter);
}



