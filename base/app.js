// 本地注册
import "./regist.js";
//启动
Promise.all([
  $import("SukiiXUI"),
  $import("dag/Style"),
  $import.sync("dag/common"), //同步加载
  $import("dag/components/Date"),
  $import("dag/components/Edittable"),
  $import("dag/components/EquipmentGroupSelector"),
  $import("dag/components/EquipmentSelector"),
  $import("dag/components/Triple"),
  $import("dag/components/MapMarker"),
  $import("dag/components/Base64image"),
]).then(
  ([
    xui,
    style,
    ,
    dateWidget,
    editTable,
    equipmentGroupSelector,
    equipmentSelector,
    triple,
    MapMarker,
    Base64image,
  ]) => {
    const $config = $import("dag/common/config");
    //引入组件库
    Vue.use(xui);
    SukiiXUI.Component.registFormField("date", dateWidget.Component.default);
    Vue.component("xui-date", dateWidget.Component.default);
    SukiiXUI.Component.registFormField(
      "edittable",
      editTable.Component.default
    );
    SukiiXUI.Component.registFormField(
      "equipmentgroupselector",
      equipmentGroupSelector.Field.default
    );
    SukiiXUI.Component.registFormField(
      "equipmentselector",
      equipmentSelector.Field.default
    );
    SukiiXUI.Component.registFormField("triple", triple.Component.default);
    SukiiXUI.Component.registFormField(
      "mapmarker",
      MapMarker.Component.default
    );
    SukiiXUI.Component.registFormField("base64image", Base64image.Component);

    Promise.all([
      $config.init().then(() => {
        return fetch(
          `./config/${
            $config.get("singleNode") ? "singleNodeMenu" : "menu"
          }.json`
        ).then((res) => {
          return res.json();
        });
      }),
    ]).then(([menus]) => {
      document.title = $config.get("application.title");
      const app = new Vue({
        router: initRouter(menus),
      }).$mount("#app");
    });
  }
);

function initRouter(menus) {
  const $business = $import("dag/common/business");
  const Login = $import("dag/modules/Login");
  //路由可来自接口或配置文件
  var routes = [];
  if (menus) {
    if (menus.login) {
      routes.push(generateRoute(menus.login, [])[0]);
    }
    if (menus.frame) {
      var rFrame = generateRoute(menus.frame, [])[0];
      if (menus.menu) {
        var menuRoutes = [];
        menus.menu.forEach((item) => generateRoute(item, menuRoutes, routes));
        rFrame.children = menuRoutes;
      }
      routes = routes.concat(rFrame);
    }
  }
  console.log("routes", routes);
  const router = new VueRouter();
  router.addRoutes(routes);
  window.$router = router;

  router.beforeEach((to, from, next) => {
    if (to.name == "Login") {
      next();
      return;
    }
    Promise.resolve()
      .then(() => {
        var user = $business.getCurrentUser();
        return user && user.userId ? user : Login.GetUserInfo();
      })
      .then((user) => {
        if (!user || !user.userId) {
          next(false);
          return;
        }
        //单页
        if (to.meta._isPage) {
          window.open(
            `${location.protocol}//${location.host}${location.pathname}#${to.fullPath}/page`,
            "_blank"
          );
          next(false);
          return;
        }
        //外链
        if (to.meta._link) {
          window.open(to.meta._link, "_blank");
          next(false);
          return;
        }
        if (user && user.userId) {
          next();
        } else {
          next(false);
        }
      });
  });

  	//权限指令
	Vue.directive("permission", {
		// 当被绑定的元素插入到 DOM 中时……
		inserted: function(el, binding, vnode) {
			let btnPermissions = ""; // 获取指令按钮权限
			let p = binding.value;
			if (!p) {
				return;
			}
			if (!$business.checkPermission(p)) {
				el.parentNode.removeChild(el);
			}
		},
	});

  return router;
}
// 路由生成
function generateRoute(item, routes, baseRoutes) {
  var r = {
    path: item.path ? item.path : "/" + item.name,
    name: item.name,
  };
  if (item.module) {
    r.component = $import(item.module).Component;
  }
  if (item.redirect) {
    r.redirect = item.redirect;
  }
  if (item.children) {
    r.children = item.children;
  }
  r.meta = item.meta || {};
  //子菜单
  if (item.menu) {
    item.menu.forEach((item) => {
      generateRoute(item, routes, baseRoutes);
    });
  }
  //单页
  if (item.page === true) {
    r.path = "/" + item.name;
    r.meta._isPage = true;
    r.children = [
      {
        path: "page",
        name: item.name + "_" + "page",
      },
    ];
    baseRoutes.push(r);
  } else if (item.link) {
    //外链
    r.path = "/" + item.name;
    r.meta._link = item.link;
    r.component = new Vue({});
    baseRoutes.push(r);
  } else {
    // r.path = "/pc" + r.path;
    routes.push(r);
  }
  return routes;
}
