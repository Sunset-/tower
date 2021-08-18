const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	"tower": {
		//构建目标文件件，放置静态资源
		contentBase: path.resolve(__dirname, "../static"),
		//构建入口
		entry: {
			main: [path.resolve(__dirname, `../base/app.js`)]
		},
		//构建出口
		output: {
			filename: "[name].[hash:8].js",
			path: path.resolve(__dirname, "../static")
		},
		//构建出口
		dist: {
			filename: "[name].[hash:8].js",
			path: path.resolve(__dirname, "../dist/tower_front")
		},
		//插件
		plugins: [
			new HtmlWebpackPlugin({
				chunks: ["main"],
				template: path.resolve(__dirname, "../base/index.html"),
				hash: true // 会在打包好的bundle.js后面加上hash串
			})
		]
	}
};
