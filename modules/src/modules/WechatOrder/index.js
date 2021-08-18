import Store from "./store.js";

export { default as Component } from "./index.vue";

export function Query(filter) {
  return Store.list(filter);
}
