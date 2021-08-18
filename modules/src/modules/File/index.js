import Store from "./store";

export function Get(filter) {
  return Store.get(filter);
}

export function Query(filter) {
  return Store.query(filter);
}

export function Remove(ids) {
  return Store.removeFile(ids);
}

export function RemoveCloudFile(ids) {
  return Store.removeCloudFile(ids);
}


export function AssignCompany(params) {
  return Store.assignCompany(params);
}

export function GeneratePDF(params) {
  return Store.generatePDF(params);
}

export function GenerateDoc(params) {
  return Store.generateDoc(params);
}