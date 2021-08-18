const VueLoaderPlugin = require("vue-loader/lib/plugin");
const path = require("path");
const r = process.env.npm_config_pr;
if (!r) {
	throw new Error(`请带上参数 --pr=AccessManage/0.2（斜杠后为版本号若不带则为0.1版本）`);
}
let data = r.split("/");
let params = data[0];
module.exports = {
	mode: "production",
	entry: {
		app: path.resolve(__dirname, `../../modules/src/${params}/index.js`),
	},
	output: {
		publicPath: "/",
		filename: `index.js`,
		path: path.resolve(__dirname, `../../modules/dist/${params}/${data[1] || "Latest"}`),
		libraryTarget: "umd",
		library: "modulea",
	},
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
	plugins: [new VueLoaderPlugin()],
	resolve: {
		alias: {
			// jquery: "jquery/dist/jquery.min.js",
			// build: path.resolve(__dirname, "../../build"),
			style: path.resolve(__dirname, "../../build/style"),
			// services: path.resolve(__dirname, "../..//build/services"),
			// netposa_xui: path.resolve(__dirname, "../..//build/netposa_xui"),
		},
		extensions: [".js", ".vue", ".coffee", ".html", ".css", ".scss", ".less"],
	},
};
