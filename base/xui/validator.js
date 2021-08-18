//安装校验规则
export default function (SukiiXUI) {
	function strLength(value) {
		if (!value) {
			return 0;
		}
		value = value + "";
		var valueLength = 0;
		var chinese = /[\u0391-\uFFE5]/;
		/* 获取字段值的长度，如果含中文字符，则每个中文字符长度为2，否则为1 */
		for (var i = 0; i < value.length; i++) {
			/* 获取一个字符 */
			var temp = value.substring(i, i + 1);
			/* 判断是否为中文字符 */
			if (chinese.test(temp)) {
				/* 中文字符长度为2 */
				valueLength += 2;
			} else {
				/* 其他字符长度为1 */
				valueLength += 1;
			}
		}
		return valueLength;
	}

	//最大长度
	SukiiXUI.Validator.regist("maxlength", {
		message: function (a, b, c) {
			return `最大长度${b.rule}${/[\u0391-\uFFE5]/.test(a) ? "（汉字占2位）" : ""}`;
		},
		check: function (val, rule, b) {
			if (strLength(val) > rule) {
				return false;
			}
			return true;
		}
	});
	SukiiXUI.Validator.regist("number", {
		message: "请设置数值",
		check: function (val, r) {
			if (!r) {
				return true;
			}
			if (!val) {
				return true;
			}
			return Sunset.isNumber(val);
		}
	});
	SukiiXUI.Validator.regist("integer", {
		message: "请设置整数",
		check: function (val, r) {
			if (!r) {
				return true;
			}
			if (!val) {
				return true;
			}
			return Sunset.isNumber(val) && String(val).indexOf(".") == -1;
		}
	});
	SukiiXUI.Validator.regist("positiveInteger", {
		message: "请设置正整数",
		check: function (val, r) {
			if (!r) {
				return true;
			}
			if (!val) {
				return true;
			}
			return Sunset.isNumber(val) && String(val).indexOf(".") == -1 && +val > 0;
		}
	});
	SukiiXUI.Validator.regist("naturalNumber", {
		message: "请设置自然数",
		check: function (val, r) {
			if (!r) {
				return true;
			}
			if (!val) {
				return true;
			}
			return Sunset.isNumber(val) && String(val).indexOf(".") == -1 && +val >= 0;
		}
	});
	SukiiXUI.Validator.regist("gbId", {
		message: "国标id格式不正确",
		check: function (val, r) {
			if (!r) {
				return true;
			}
			if (!val) {
				return true;
			}
			return /^\d{1,30}$/.test(val);
		}
	});
	SukiiXUI.Validator.regist("ip", {
		message: function (a, b, c) {
			return `${b.rule==true?'ip':b.rule}格式不规范`;
		},
		check: function (val, r) {
			if (!r) {
				return true;
			}
			if (!val) {
				return true;
			}
			return /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/.test(
				val
			);
		}
	});
	SukiiXUI.Validator.regist("port", {
		message: "端口1-65535",
		check: function (val, r) {
			if (!r) {
				return true;
			}
			if (!val) {
				return true;
			}
			if (Sunset.isNumber(val) && String(val).indexOf(".") == -1) {
				val = +val;
				return val > 0 && val <= 65535;
			}
			return false;
		}
	});
	SukiiXUI.Validator.regist("ports", {
		message: "端口1-65535,多个不同端口号逗号分隔",
		check: function (val, r) {
			if (!r) {
				return true;
			}
			if (!val) {
				return true;
			}
			var ps = String(val).split(",");
			var cache = {};
			for (var i = 0; i < ps.length; i++) {
				var v = ps[i];
				if (Sunset.isNumber(v) && String(val).indexOf(".") == -1) {
					v = +v;
					if (v > 0 && v <= 65535) {
						if (cache[v]) {
							return false;
						}
						cache[v] = true;
						continue;
					}
				}
				return false;
			}
			return true;
		}
	});
	SukiiXUI.Validator.regist("ipport", {
		message: "如192.168.100.100:3000",
		check: function (val, r) {
			if (!r) {
				return true;
			}
			if (!val) {
				return true;
			}
			var val = val + "";
			var ipport = val.split(":");
			if (ipport.length == 2) {
				return (
					/^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/.test(
						ipport[0]
					) &&
					(Sunset.isNumber(ipport[1]) && +ipport[1] > 0 && +ipport[1] <= 65535)
				);
			}
			return false;
		}
	});
	SukiiXUI.Validator.regist("lon", {
		message: "经度-180 至 180 (可精确到小数点后6位)",
		check: function (val, r) {
			if (!r) {
				return true;
			}
			if (!val) {
				return true;
			}
			return /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/.test(
				val
			);
		}
	});
	SukiiXUI.Validator.regist("lat", {
		message: "纬度-90 至 90 (可精确到小数点后6位)",
		check: function (val, r) {
			if (!r) {
				return true;
			}
			if (!val) {
				return true;
			}
			return /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/.test(val);
		}
	});
	SukiiXUI.Validator.regist("phone", {
		message: "请输入正确电话",
		check: function (val, r) {
			if (!r) {
				return true;
			}
			if (!val) {
				return true;
			}
			return /^(13[0-9]|15[012356789]|16[6]|17[13678]|18[0-9]|19[89]|14[957])[0-9]{8}$/.test(val);
		}
	});
	SukiiXUI.Validator.regist("email", {
		message: "请输入正确邮箱",
		check: function (val, r) {
			if (!r) {
				return true;
			}
			if (!val) {
				return true;
			}
			return /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(val);
		}
	});
	SukiiXUI.Validator.regist("hourMinute", {
		message: "00:00 - 23:59",
		check: function (val, r) {
			if (!r) {
				return true;
			}
			if (!val) {
				return true;
			}
			return new RegExp(/^(([0-1]{1}[0-9]{1})|([2]{1}[0-3]{1})):([0-5]{1}[0-9]{1})$/).test(val);
		}
	});
	SukiiXUI.Validator.regist("userName", {
		message: "用户名1-20个字符,可使用字母(区分大小写)、数字、下划线 (特殊字符不支持)",
		check: function (val, r) {
			if (!r) {
				return true;
			}
			if (!val) {
				return true;
			}
			return /^[a-zA-Z0-9_-]{1,20}$/.test(val);
		}
	});
	SukiiXUI.Validator.regist("password", {
		message: "密码6~20个字符,可使用字母(区分大小写)、数字 (特殊字符不支持)",
		check: function (val, r) {
			if (!r) {
				return true;
			}
			if (!val) {
				return true;
			}
			return /^[0-9A-Za-z]{6,20}$/.test(val);
		}
	});
}