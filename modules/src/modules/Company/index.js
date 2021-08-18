import Store from "./store";

export { default as Component } from "./index.vue";

export function AllCompanies() {
  return Store.list();
}

export function QueryOffice(filter) {
  return Store.queryOffice(filter);
}
