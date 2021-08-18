const webpack = require("webpack");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.config");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const appsConfig = require("../apps.js");
const clean = require("./clean");
const resolve = require("./utils").resolve;

// 纯静态资源复制
const CopyWebpackPlugin = require("copy-webpack-plugin");

var appName = process.argv[4].substring(2);

var appBuildConfig = appsConfig[appName];
if (!appBuildConfig) {
	throw new Error(`未找到${appName}的构建配置,请在buildConfig/apps.js中声明`);
}
console.log("开始构建：" + appName);

// clean(path.join(__dirname,'../../dist/urm_front'));
clean(path.join(__dirname, "../../dist/waterwheel_front"));

const config = merge(baseConfig, {
	mode: "production",
	//入口
	entry: appBuildConfig.entry,
	//出口
	output: appBuildConfig.dist,
	plugins: appBuildConfig.plugins.concat([
		new MiniCssExtractPlugin({
			filename: "[name].[hash:8].css",
		}),
		// 纯静态资源复制
		new CopyWebpackPlugin([
			{
				from: resolve("static"),
				to: resolve("dist/iot-gw_front"),
				ignore: [".*"],
			},
			{
				from: resolve("base/netposa_xui/.*"),
				to: resolve("dist/iot-gw_front/NetPosaXUI"),
				ignore: [".*"],
			},
		]),
	]),
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					"vue-style-loader",
					MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							plugins: (loader) => [require("autoprefixer")()],
						},
					},
				],
			},
			{
				test: /\.scss$/,
				use: [
					"vue-style-loader",
					MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							plugins: (loader) => [require("autoprefixer")()],
						},
					},
					"sass-loader",
				],
			},
			{
				test: /\.less$/,
				use: [
					"vue-style-loader",
					MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							plugins: (loader) => [require("autoprefixer")()],
						},
					},
					"less-loader",
				],
			},
		],
	},
	resolve: {
		alias: {
			style: resolve("base/style"),
		},
		extensions: [".js", ".vue", ".coffee", ".html", ".css", ".scss", ".less"],
	},
});

module.exports = config;
