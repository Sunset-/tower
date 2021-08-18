const path = require("path");

function getLocalIP() {
	const os = require("os");
	const ifaces = os.networkInterfaces();
	let locatIp = "";
	for (let dev in ifaces) {
		for (let j = 0; j < ifaces[dev].length; j++) {
			if (ifaces[dev][j].family === "IPv4" && ifaces[dev][j].address != "127.0.0.1") {
				locatIp = ifaces[dev][j].address;
				break;
			}
		}
	}
	return locatIp;
}
module.exports = (config) => ({
	contentBase: config.contentBase,
	hot: true,
	inline: true,
	host: "0.0.0.0",
	port: 29999,
	disableHostCheck: true,
	proxy: {
		"/api//*": {
			// target: "http://120.78.161.176:8030/",
			target: "http://www.qg-lot.com:8090/",
			// target: "http://192.168.1.118:8060/",
			// pathRewrite: {
			// 	"^/api": "/",
			// },
			secure: false,
			changeOrigin: true,
		},
	},
});
