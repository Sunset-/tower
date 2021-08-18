const inquirer = require("inquirer");
const { getAllDirs,getModuleDirs } = require("./utils");
const webpackPromise = require("./utils").webpackPromise;
// 屏蔽核心dll
// const _core = require("./webpack.build.core");
const _common = require("./webpack.build.common");

const promptList = [
//   {
//     type: "checkbox",
//     message: "请选择需要打包的架构:",
//     name: "frames",
//     choices: getAllDirs("./src/frames"),
//     validate: function(val) {
//       var done = this.async();
//       if (val.length == 0) {
//         done("请至少选择一个！");
//         return;
//       }
//       done(null, true);
//     }
//   },
  {
    type: "checkbox",
    message: "请选择需要打包的模块:",
    name: "modules",
    choices: getModuleDirs("modules"),
    validate: function(val) {
      var done = this.async();
      if (val.length == 0) {
        done("请至少选择一个！");
        return;
      }
      done(null, true);
    }
  }
];

(async function() {
  // 选择打包内容
  let answers = await inquirer.prompt(promptList);
  console.log(answers); // 返回的结果

  // 屏蔽核心和架构层
//   console.log("\n--------------- BUILD CORE ---------------");
//   await webpackPromise(_core);
//   // 打包架构
//   console.log("\n--------------- BUILD FRAMES ---------------");
//   for (let item of answers.frames)
//     await webpackPromise(_common("frames", item));

  // 打包模块
  console.log("\n--------------- BUILD MODULES ---------------");
  for (let item of answers.modules){
    await webpackPromise(_common(item));
    // await webpackPromise(_common(item.type, item.module));
  }
//   for (let item of answers.modules){
//     await webpackPromise(_common("modules", item));
//   }
})().then(() => {
  console.log("\n--------------- ALL DONE ---------------\n");
});
