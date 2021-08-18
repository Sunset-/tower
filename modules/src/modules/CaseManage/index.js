export { default as Component } from "./index.vue";

import store from './store.js';
import Detail from './detail.vue';

export function allAsMap(filter) {
    return store.allAsMap(filter);
}
export function remove(id) {
    return store.remove(id);
}
export function changeStatus(id, bool) {
    return store.changeStatus(id, bool);
} 
export function getById(id) {
    return store.getById(id);
} 

export function getDetailComponent() {
    return Detail;
} 
