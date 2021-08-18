const webpack = require("webpack");
const merge = require("webpack-merge");
// const common = require("./webpack.base.config.js");
// 构建前清理
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// 路径获取
const resolve = require("./utils").resolve;
const {VueLoaderPlugin} = require("vue-loader");

module.exports = function(path) {
  let entry = {};
//   entry[module] = `./src/${type}/${module}/`;
  entry[module] = `./modules/src/${path}/index.js`;
    // console.log("entry[module]",entry[module]);
  const webpackConfig = {
    mode: "production",
    entry,
    output: {
      path: resolve(`modules/dist/${path}/latest`),
      filename: "index.js",
      chunkFilename: "[name].[contenthash].js",
      library: `${path}`,
      libraryTarget: "umd"
    },
    // devtool: "source-map",
	module: {
		rules: [
			{ test: /\.vue$/, use: "vue-loader" },
			{
				test: /\.css$/,
				use: ["vue-style-loader", "css-loader"],
			},
			{
				test: /\.less$/,
				use: [
					"vue-style-loader",
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
    plugins: [
      new CleanWebpackPlugin(),
      new VueLoaderPlugin(),
      // 解决动态模块导入打包重名的问题
      new webpack.NamedChunksPlugin(chunk => module + "/" + chunk.name)
    ],
	resolve: {
		alias: {
			// jquery: "jquery/dist/jquery.min.js",
			// build: path.resolve(__dirname, "../../build"),
			style: resolve("base/style"),
			// services: path.resolve(__dirname, "../..//build/services"),
			// netposa_xui: path.resolve(__dirname, "../..//build/netposa_xui"),
		},
		extensions: [".js", ".vue", ".coffee", ".html", ".css", ".scss", ".less"],
	},
  };
  return webpackConfig;
//   return merge(common, webpackConfig);
};
