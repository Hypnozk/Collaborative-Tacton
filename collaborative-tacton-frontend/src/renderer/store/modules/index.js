import camelCase from "lodash/camelCase";
const requireModule = require.context(".", false, /\.js|\.ts$/);
const modules = {};

requireModule.keys().forEach((fileName) => {
  // Don't register this file as a Vuex module
  if (fileName === "./modules.js") return;

  const moduleName = camelCase(fileName.replace(/(\.\/|\.js|\.ts$)/g, ""));
  modules[moduleName] = {
    namespaced: true,
    ...requireModule(fileName).default,
  };
});

export default modules;