const webpack = require("webpack");
const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
console.log(__dirname)
const config = {
	plugins: [new VueLoaderPlugin()],
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: "vue-loader"
			},
			{
				test: /\.js$/,
				exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
				use: "babel-loader"
			},
			{
				test: /\.(gif|jpg|jpeg|png|woff|svg|eot|ttf)\??.*$/,
				use: "url-loader?limit=10000&name=./images/[name].[ext]"
			}
		]
	},
	externals: {
		$: "window.jQuery",
		jQuery: "window.jQuery"
	},
	resolve: {
		alias: {
			style: path.resolve(__dirname, "../../base/style"),
			// netposa_xui: path.resolve(__dirname, "../../base/netposa_xui"),
			// vue: "vue/dist/vue.js",
			// jquery: "jquery/dist/jquery.min.js",
			// src: path.resolve(__dirname, "../../modules/src"),
			// modules: path.resolve(__dirname, "../../modules/src/modules"),
			// components: path.resolve(__dirname, "../../modules/src/components"),
			// build: path.resolve(__dirname, "../../build"),
			// services: path.resolve(__dirname, "../../build/services"),
			// common: path.resolve(__dirname, "../../build/common"),
		},
		extensions: [".js", ".vue", ".coffee", ".html", ".css", ".scss", ".less"]
	}
};
module.exports = config;