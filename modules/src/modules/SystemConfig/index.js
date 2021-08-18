import Store from "./store";

export { default as Component } from "./index.vue";

export function Query(filter) {
  return Store.list(filter);
}
