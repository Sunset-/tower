const webpack = require("webpack");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.config");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const appsConfig = require("../apps.js");

var appName = process.argv[6].substring(2);

var appBuildConfig = appsConfig[appName];
if (!appBuildConfig) {
	throw new Error(`未找到${appName}的构建配置,请在buildConfig/apps.js中声明`);
}
console.log("开始启动：" + appName);

const config = merge(baseConfig, {
	mode: "development",
	//入口
	entry: appBuildConfig.entry,
	//出口
	output: appBuildConfig.output,
	plugins: appBuildConfig.plugins.concat([new webpack.HotModuleReplacementPlugin()]),
	devServer: require("./devServer")(appBuildConfig),
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					"vue-style-loader",
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							plugins: loader => [require("autoprefixer")()]
						}
					}
				]
			},
			{
				test: /\.scss$/,
				use: [
					"vue-style-loader",
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							plugins: loader => [require("autoprefixer")()]
						}
					},
					"sass-loader"
				]
			},
			{
				test: /\.less$/,
				use: [
					"vue-style-loader",
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							plugins: loader => [require("autoprefixer")()]
						}
					},
					"less-loader"
				]
			}
		]
	}
});

module.exports = config;
