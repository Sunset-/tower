(function (window) {
  var loadedModules = {}; //已加载的异步模块
  var loadedSyncModules = {}; //已加载的同步模块

  //加载模块
  function loadModule(moduleName, version) {
    return Promise.resolve().then(() => {
      if (loadedModules[moduleName]) {
        return loadedModules[moduleName];
      }
      console.log("远程加载：", moduleName);
      return (loadedModules[moduleName] = fetch(
        `/modules/${moduleName}/${version || "latest"}/index.js`,
        {}
      )
        .then((res) => {
          return res.text();
        })  
        .then((sourceCode) => {
          var m = {
            exports: {},
          };
          try {
            Function(`
			return function(module, exports, require) {
			  ${sourceCode}
			}
		  `)()(m, m.exports);
          } catch (e) {
            console.error(`【${moduleName}】模块加载解析异常：${e.message}`);
          }
          return m.exports;
        }));
    });
  }

  //同步模块
  function getSyncModule(moduleName) {
    var ns = moduleName.split("/");
    var sm = null;
    var m = null;
    var index = 0;
    for (i = 0; i < ns.length; i++) {
      index = i + 1;
      if ((sm = loadedSyncModules[ns.slice(0, index).join("/")])) {
        break;
      }
    }
    if (sm==null) {
      return null;
    }
    if(sm){
        var p = sm;
        for (i = index; i < ns.length; i++) {
          try {
            p = p[ns[i]];
          } catch (e) {
            p = {};
          }
        }
        return p;
    }
  }

  //引入模块
  var $import = function(moduleName) {
      console.log("加载:",moduleName)
    if (!moduleName) {
      throw new Error("加载模块路径不合法");
    }
    let syncModule = getSyncModule(moduleName);
    if (syncModule) {
      return syncModule;
    }
    var loadedM = loadModule(moduleName);
    var m = new Proxy(
      {},
      {
        get: function (target, subkey, receiver) {
          if (subkey == "then") {
            return function (cb) {
              return loadedM.then((m) => {
                return cb(m);
              });
            };
          } else if (subkey == "Component") {
            return function () {
              return loadedM.then((res) => {
                return res[subkey];
              });
            };
          } else {
            return function (...args) {
              return loadedM.then((res) => {
                try {
                  return res[subkey].apply(res, args);
                } catch (e) {
                  console.error(`【${moduleName}】模块：【${subkey}】方法异常:${e}`);
                  console.log(res,args)
                }
              });
            };
          }
        },
        set: function (target, key, value, receiver) {
          console.log(`setting ${key}!`);
          return Reflect.set(target, key, value, receiver);
        },
      }
    );
    return m;
  };

  //模块注册
  $import.regist = function (moduleName, m) {
    loadedModules[moduleName] = Promise.resolve(m);
    console.log("本地注册：", moduleName);
  };
  //模块注册
  $import.registSync = function (moduleName, m) {
    // debugger
    loadedModules[moduleName] = Promise.resolve(m);
    loadedSyncModules[moduleName] = m;
    console.log("本地同步注册：", moduleName);
  };

  //同步加载
  $import.sync = function (moduleName) {
    if (loadedSyncModules[moduleName]) {
      return Promise.resolve(loadedSyncModules[moduleName]);
    }
    return $import(moduleName).then((res) => {
      return (loadedSyncModules[moduleName] = res);
    });
  };

  window.$import = $import;
})(window);
