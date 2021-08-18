function initBaseUrls(a) {
	require.tlns = a;
}
function initSender() {
	var a = require(null, "ace/lib/event_emitter").EventEmitter,
		b = require(null, "ace/lib/oop"),
		c = function() {};
	return (
		function() {
			b.implement(this, a),
				(this.callback = function(a, b) {
					postMessage({ type: "call", id: b, data: a });
				}),
				(this.emit = function(a, b) {
					postMessage({ type: "event", name: a, data: b });
				});
		}.call(c.prototype),
		new c()
	);
}
("no use strict");
var console = {
		log: function(a) {
			postMessage({ type: "log", data: arguments.join(" ") });
		}
	},
	window = { console: console },
	normalizeModule = function(a, b) {
		if (b.indexOf("!") !== -1) {
			var c = b.split("!");
			return normalizeModule(a, c[0]) + "!" + normalizeModule(a, c[1]);
		}
		if (b.charAt(0) == ".") {
			var d = a
					.split("/")
					.slice(0, -1)
					.join("/"),
				b = d + "/" + b;
			while (b.indexOf(".") !== -1 && e != b)
				var e = b,
					b = b.replace(/\/\.\//, "/").replace(/[^\/]+\/\.\.\//, "");
		}
		return b;
	},
	require = function(a, b) {
		if (!b.charAt) throw new Error("worker.js require() accepts only (parentId, id) as arguments");
		var b = normalizeModule(a, b),
			c = require.modules[b];
		if (c) return c.initialized || ((c.initialized = !0), (c.exports = c.factory().exports)), c.exports;
		var d = b.split("/");
		d[0] = require.tlns[d[0]] || d[0];
		var e = d.join("/") + ".js";
		return (require.id = b), importScripts(e), require(a, b);
	};
(require.modules = {}), (require.tlns = {});
var define = function(a, b, c) {
		arguments.length == 2
			? ((c = b), typeof a != "string" && ((b = a), (a = require.id)))
			: arguments.length == 1 && ((c = a), (a = require.id));
		if (a.indexOf("text!") === 0) return;
		var d = function(b, c) {
			return require(a, b, c);
		};
		require.modules[a] = {
			factory: function() {
				var a = { exports: {} },
					b = c(d, a.exports, a);
				return b && (a.exports = b), a;
			}
		};
	},
	main,
	sender;
(onmessage = function(a) {
	var b = a.data;
	if (b.command) main[b.command].apply(main, b.args);
	else if (b.init) {
		initBaseUrls(b.tlns), require(null, "ace/lib/fixoldbrowsers"), (sender = initSender());
		var c = require(null, b.module)[b.classname];
		main = new c(sender);
	} else b.event && sender && sender._emit(b.event, b.data);
}),
	define("ace/lib/fixoldbrowsers", ["require", "exports", "module", "ace/lib/regexp", "ace/lib/es5-shim"], function(
		a,
		b,
		c
	) {
		a("./regexp"), a("./es5-shim");
	}),
	define("ace/lib/regexp", ["require", "exports", "module"], function(a, b, c) {
		function g(a) {
			return (
				(a.global ? "g" : "") +
				(a.ignoreCase ? "i" : "") +
				(a.multiline ? "m" : "") +
				(a.extended ? "x" : "") +
				(a.sticky ? "y" : "")
			);
		}
		function h(a, b, c) {
			if (Array.prototype.indexOf) return a.indexOf(b, c);
			for (var d = c || 0; d < a.length; d++) if (a[d] === b) return d;
			return -1;
		}
		var d = {
				exec: RegExp.prototype.exec,
				test: RegExp.prototype.test,
				match: String.prototype.match,
				replace: String.prototype.replace,
				split: String.prototype.split
			},
			e = d.exec.call(/()??/, "")[1] === undefined,
			f = (function() {
				var a = /^/g;
				return d.test.call(a, ""), !a.lastIndex;
			})();
		if (f && e) return;
		(RegExp.prototype.exec = function(a) {
			var b = d.exec.apply(this, arguments),
				c,
				i;
			if (typeof a == "string" && b) {
				!e &&
					b.length > 1 &&
					h(b, "") > -1 &&
					((i = RegExp(this.source, d.replace.call(g(this), "g", ""))),
					d.replace.call(a.slice(b.index), i, function() {
						for (var a = 1; a < arguments.length - 2; a++) arguments[a] === undefined && (b[a] = undefined);
					}));
				if (this._xregexp && this._xregexp.captureNames)
					for (var j = 1; j < b.length; j++) (c = this._xregexp.captureNames[j - 1]), c && (b[c] = b[j]);
				!f && this.global && !b[0].length && this.lastIndex > b.index && this.lastIndex--;
			}
			return b;
		}),
			f ||
				(RegExp.prototype.test = function(a) {
					var b = d.exec.call(this, a);
					return b && this.global && !b[0].length && this.lastIndex > b.index && this.lastIndex--, !!b;
				});
	}),
	define("ace/lib/es5-shim", ["require", "exports", "module"], function(a, b, c) {
		function p(a) {
			try {
				return Object.defineProperty(a, "sentinel", {}), "sentinel" in a;
			} catch (b) {}
		}
		Function.prototype.bind ||
			(Function.prototype.bind = function(b) {
				var c = this;
				if (typeof c != "function") throw new TypeError();
				var d = g.call(arguments, 1),
					e = function() {
						if (this instanceof e) {
							var a = function() {};
							a.prototype = c.prototype;
							var f = new a(),
								h = c.apply(f, d.concat(g.call(arguments)));
							return h !== null && Object(h) === h ? h : f;
						}
						return c.apply(b, d.concat(g.call(arguments)));
					};
				return e;
			});
		var d = Function.prototype.call,
			e = Array.prototype,
			f = Object.prototype,
			g = e.slice,
			h = d.bind(f.toString),
			i = d.bind(f.hasOwnProperty),
			j,
			k,
			l,
			m,
			n;
		if ((n = i(f, "__defineGetter__")))
			(j = d.bind(f.__defineGetter__)),
				(k = d.bind(f.__defineSetter__)),
				(l = d.bind(f.__lookupGetter__)),
				(m = d.bind(f.__lookupSetter__));
		Array.isArray ||
			(Array.isArray = function(b) {
				return h(b) == "[object Array]";
			}),
			Array.prototype.forEach ||
				(Array.prototype.forEach = function(b) {
					var c = G(this),
						d = arguments[1],
						e = 0,
						f = c.length >>> 0;
					if (h(b) != "[object Function]") throw new TypeError();
					while (e < f) e in c && b.call(d, c[e], e, c), e++;
				}),
			Array.prototype.map ||
				(Array.prototype.map = function(b) {
					var c = G(this),
						d = c.length >>> 0,
						e = Array(d),
						f = arguments[1];
					if (h(b) != "[object Function]") throw new TypeError();
					for (var g = 0; g < d; g++) g in c && (e[g] = b.call(f, c[g], g, c));
					return e;
				}),
			Array.prototype.filter ||
				(Array.prototype.filter = function(b) {
					var c = G(this),
						d = c.length >>> 0,
						e = [],
						f = arguments[1];
					if (h(b) != "[object Function]") throw new TypeError();
					for (var g = 0; g < d; g++) g in c && b.call(f, c[g], g, c) && e.push(c[g]);
					return e;
				}),
			Array.prototype.every ||
				(Array.prototype.every = function(b) {
					var c = G(this),
						d = c.length >>> 0,
						e = arguments[1];
					if (h(b) != "[object Function]") throw new TypeError();
					for (var f = 0; f < d; f++) if (f in c && !b.call(e, c[f], f, c)) return !1;
					return !0;
				}),
			Array.prototype.some ||
				(Array.prototype.some = function(b) {
					var c = G(this),
						d = c.length >>> 0,
						e = arguments[1];
					if (h(b) != "[object Function]") throw new TypeError();
					for (var f = 0; f < d; f++) if (f in c && b.call(e, c[f], f, c)) return !0;
					return !1;
				}),
			Array.prototype.reduce ||
				(Array.prototype.reduce = function(b) {
					var c = G(this),
						d = c.length >>> 0;
					if (h(b) != "[object Function]") throw new TypeError();
					if (!d && arguments.length == 1) throw new TypeError();
					var e = 0,
						f;
					if (arguments.length >= 2) f = arguments[1];
					else
						do {
							if (e in c) {
								f = c[e++];
								break;
							}
							if (++e >= d) throw new TypeError();
						} while (!0);
					for (; e < d; e++) e in c && (f = b.call(void 0, f, c[e], e, c));
					return f;
				}),
			Array.prototype.reduceRight ||
				(Array.prototype.reduceRight = function(b) {
					var c = G(this),
						d = c.length >>> 0;
					if (h(b) != "[object Function]") throw new TypeError();
					if (!d && arguments.length == 1) throw new TypeError();
					var e,
						f = d - 1;
					if (arguments.length >= 2) e = arguments[1];
					else
						do {
							if (f in c) {
								e = c[f--];
								break;
							}
							if (--f < 0) throw new TypeError();
						} while (!0);
					do f in this && (e = b.call(void 0, e, c[f], f, c));
					while (f--);
					return e;
				}),
			Array.prototype.indexOf ||
				(Array.prototype.indexOf = function(b) {
					var c = G(this),
						d = c.length >>> 0;
					if (!d) return -1;
					var e = 0;
					arguments.length > 1 && (e = E(arguments[1])), (e = e >= 0 ? e : Math.max(0, d + e));
					for (; e < d; e++) if (e in c && c[e] === b) return e;
					return -1;
				}),
			Array.prototype.lastIndexOf ||
				(Array.prototype.lastIndexOf = function(b) {
					var c = G(this),
						d = c.length >>> 0;
					if (!d) return -1;
					var e = d - 1;
					arguments.length > 1 && (e = Math.min(e, E(arguments[1]))), (e = e >= 0 ? e : d - Math.abs(e));
					for (; e >= 0; e--) if (e in c && b === c[e]) return e;
					return -1;
				}),
			Object.getPrototypeOf ||
				(Object.getPrototypeOf = function(b) {
					return b.__proto__ || (b.constructor ? b.constructor.prototype : f);
				});
		if (!Object.getOwnPropertyDescriptor) {
			var o = "Object.getOwnPropertyDescriptor called on a non-object: ";
			Object.getOwnPropertyDescriptor = function(b, c) {
				if ((typeof b != "object" && typeof b != "function") || b === null) throw new TypeError(o + b);
				if (!i(b, c)) return;
				var d, e, g;
				d = { enumerable: !0, configurable: !0 };
				if (n) {
					var h = b.__proto__;
					b.__proto__ = f;
					var e = l(b, c),
						g = m(b, c);
					b.__proto__ = h;
					if (e || g) return e && (d.get = e), g && (d.set = g), d;
				}
				return (d.value = b[c]), d;
			};
		}
		Object.getOwnPropertyNames ||
			(Object.getOwnPropertyNames = function(b) {
				return Object.keys(b);
			}),
			Object.create ||
				(Object.create = function(b, c) {
					var d;
					if (b === null) d = { __proto__: null };
					else {
						if (typeof b != "object") throw new TypeError("typeof prototype[" + typeof b + "] != 'object'");
						var e = function() {};
						(e.prototype = b), (d = new e()), (d.__proto__ = b);
					}
					return c !== void 0 && Object.defineProperties(d, c), d;
				});
		if (Object.defineProperty) {
			var q = p({}),
				r = typeof document == "undefined" || p(document.createElement("div"));
			if (!q || !r) var s = Object.defineProperty;
		}
		if (!Object.defineProperty || s) {
			var t = "Property description must be an object: ",
				u = "Object.defineProperty called on non-object: ",
				v = "getters & setters can not be defined on this javascript engine";
			Object.defineProperty = function(b, c, d) {
				if ((typeof b != "object" && typeof b != "function") || b === null) throw new TypeError(u + b);
				if ((typeof d != "object" && typeof d != "function") || d === null) throw new TypeError(t + d);
				if (s)
					try {
						return s.call(Object, b, c, d);
					} catch (e) {}
				if (i(d, "value"))
					if (n && (l(b, c) || m(b, c))) {
						var g = b.__proto__;
						(b.__proto__ = f), delete b[c], (b[c] = d.value), (b.__proto__ = g);
					} else b[c] = d.value;
				else {
					if (!n) throw new TypeError(v);
					i(d, "get") && j(b, c, d.get), i(d, "set") && k(b, c, d.set);
				}
				return b;
			};
		}
		Object.defineProperties ||
			(Object.defineProperties = function(b, c) {
				for (var d in c) i(c, d) && Object.defineProperty(b, d, c[d]);
				return b;
			}),
			Object.seal ||
				(Object.seal = function(b) {
					return b;
				}),
			Object.freeze ||
				(Object.freeze = function(b) {
					return b;
				});
		try {
			Object.freeze(function() {});
		} catch (w) {
			Object.freeze = (function(b) {
				return function(c) {
					return typeof c == "function" ? c : b(c);
				};
			})(Object.freeze);
		}
		Object.preventExtensions ||
			(Object.preventExtensions = function(b) {
				return b;
			}),
			Object.isSealed ||
				(Object.isSealed = function(b) {
					return !1;
				}),
			Object.isFrozen ||
				(Object.isFrozen = function(b) {
					return !1;
				}),
			Object.isExtensible ||
				(Object.isExtensible = function(b) {
					if (Object(b) === b) throw new TypeError();
					var c = "";
					while (i(b, c)) c += "?";
					b[c] = !0;
					var d = i(b, c);
					return delete b[c], d;
				});
		if (!Object.keys) {
			var x = !0,
				y = [
					"toString",
					"toLocaleString",
					"valueOf",
					"hasOwnProperty",
					"isPrototypeOf",
					"propertyIsEnumerable",
					"constructor"
				],
				z = y.length;
			for (var A in { toString: null }) x = !1;
			Object.keys = function H(a) {
				if ((typeof a != "object" && typeof a != "function") || a === null)
					throw new TypeError("Object.keys called on a non-object");
				var H = [];
				for (var b in a) i(a, b) && H.push(b);
				if (x)
					for (var c = 0, d = z; c < d; c++) {
						var e = y[c];
						i(a, e) && H.push(e);
					}
				return H;
			};
		}
		if (!Date.prototype.toISOString || new Date(-621987552e5).toISOString().indexOf("-000001") === -1)
			Date.prototype.toISOString = function() {
				var b, c, d, e;
				if (!isFinite(this)) throw new RangeError();
				(b = [
					this.getUTCMonth() + 1,
					this.getUTCDate(),
					this.getUTCHours(),
					this.getUTCMinutes(),
					this.getUTCSeconds()
				]),
					(e = this.getUTCFullYear()),
					(e =
						(e < 0 ? "-" : e > 9999 ? "+" : "") +
						("00000" + Math.abs(e)).slice(0 <= e && e <= 9999 ? -4 : -6)),
					(c = b.length);
				while (c--) (d = b[c]), d < 10 && (b[c] = "0" + d);
				return (
					e +
					"-" +
					b.slice(0, 2).join("-") +
					"T" +
					b.slice(2).join(":") +
					"." +
					("000" + this.getUTCMilliseconds()).slice(-3) +
					"Z"
				);
			};
		Date.now ||
			(Date.now = function() {
				return new Date().getTime();
			}),
			Date.prototype.toJSON ||
				(Date.prototype.toJSON = function(b) {
					if (typeof this.toISOString != "function") throw new TypeError();
					return this.toISOString();
				}),
			Date.parse("+275760-09-13T00:00:00.000Z") !== 864e13 &&
				(Date = (function(a) {
					var b = function e(b, c, d, f, g, h, i) {
							var j = arguments.length;
							if (this instanceof a) {
								var k =
									j == 1 && String(b) === b
										? new a(e.parse(b))
										: j >= 7
										? new a(b, c, d, f, g, h, i)
										: j >= 6
										? new a(b, c, d, f, g, h)
										: j >= 5
										? new a(b, c, d, f, g)
										: j >= 4
										? new a(b, c, d, f)
										: j >= 3
										? new a(b, c, d)
										: j >= 2
										? new a(b, c)
										: j >= 1
										? new a(b)
										: new a();
								return (k.constructor = e), k;
							}
							return a.apply(this, arguments);
						},
						c = new RegExp(
							"^(\\d{4}|[+-]\\d{6})(?:-(\\d{2})(?:-(\\d{2})(?:T(\\d{2}):(\\d{2})(?::(\\d{2})(?:\\.(\\d{3}))?)?(?:Z|(?:([-+])(\\d{2}):(\\d{2})))?)?)?)?$"
						);
					for (var d in a) b[d] = a[d];
					return (
						(b.now = a.now),
						(b.UTC = a.UTC),
						(b.prototype = a.prototype),
						(b.prototype.constructor = b),
						(b.parse = function(d) {
							var e = c.exec(d);
							if (e) {
								e.shift();
								for (var f = 1; f < 7; f++) (e[f] = +(e[f] || (f < 3 ? 1 : 0))), f == 1 && e[f]--;
								var g = +e.pop(),
									h = +e.pop(),
									i = e.pop(),
									j = 0;
								if (i) {
									if (h > 23 || g > 59) return NaN;
									j = (h * 60 + g) * 6e4 * (i == "+" ? -1 : 1);
								}
								var k = +e[0];
								return 0 <= k && k <= 99
									? ((e[0] = k + 400), a.UTC.apply(this, e) + j - 126227808e5)
									: a.UTC.apply(this, e) + j;
							}
							return a.parse.apply(this, arguments);
						}),
						b
					);
				})(Date));
		var B = "	\n\f\r   ᠎             　\u2028\u2029﻿";
		if (!String.prototype.trim || B.trim()) {
			B = "[" + B + "]";
			var C = new RegExp("^" + B + B + "*"),
				D = new RegExp(B + B + "*$");
			String.prototype.trim = function() {
				return String(this)
					.replace(C, "")
					.replace(D, "");
			};
		}
		var E = function(a) {
				return (
					(a = +a),
					a !== a
						? (a = 0)
						: a !== 0 && a !== 1 / 0 && a !== -Infinity && (a = (a > 0 || -1) * Math.floor(Math.abs(a))),
					a
				);
			},
			F = "a"[0] != "a",
			G = function(a) {
				if (a == null) throw new TypeError();
				return F && typeof a == "string" && a ? a.split("") : Object(a);
			};
	}),
	define("ace/lib/event_emitter", ["require", "exports", "module"], function(a, b, c) {
		var d = {};
		(d._emit = d._dispatchEvent = function(a, b) {
			(this._eventRegistry = this._eventRegistry || {}), (this._defaultHandlers = this._defaultHandlers || {});
			var c = this._eventRegistry[a] || [],
				d = this._defaultHandlers[a];
			if (!c.length && !d) return;
			if (typeof b != "object" || !b) b = {};
			b.type || (b.type = a),
				b.stopPropagation ||
					(b.stopPropagation = function() {
						this.propagationStopped = !0;
					}),
				b.preventDefault ||
					(b.preventDefault = function() {
						this.defaultPrevented = !0;
					});
			for (var e = 0; e < c.length; e++) {
				c[e](b);
				if (b.propagationStopped) break;
			}
			if (d && !b.defaultPrevented) return d(b);
		}),
			(d.setDefaultHandler = function(a, b) {
				this._defaultHandlers = this._defaultHandlers || {};
				if (this._defaultHandlers[a]) throw new Error("The default handler for '" + a + "' is already set");
				this._defaultHandlers[a] = b;
			}),
			(d.on = d.addEventListener = function(a, b) {
				this._eventRegistry = this._eventRegistry || {};
				var c = this._eventRegistry[a];
				c || (c = this._eventRegistry[a] = []), c.indexOf(b) == -1 && c.push(b);
			}),
			(d.removeListener = d.removeEventListener = function(a, b) {
				this._eventRegistry = this._eventRegistry || {};
				var c = this._eventRegistry[a];
				if (!c) return;
				var d = c.indexOf(b);
				d !== -1 && c.splice(d, 1);
			}),
			(d.removeAllListeners = function(a) {
				this._eventRegistry && (this._eventRegistry[a] = []);
			}),
			(b.EventEmitter = d);
	}),
	define("ace/lib/oop", ["require", "exports", "module"], function(a, b, c) {
		(b.inherits = (function() {
			var a = function() {};
			return function(b, c) {
				(a.prototype = c.prototype),
					(b.super_ = c.prototype),
					(b.prototype = new a()),
					(b.prototype.constructor = b);
			};
		})()),
			(b.mixin = function(a, b) {
				for (var c in b) a[c] = b[c];
			}),
			(b.implement = function(a, c) {
				b.mixin(a, c);
			});
	}),
	define("ace/mode/json_worker", [
		"require",
		"exports",
		"module",
		"ace/lib/oop",
		"ace/worker/mirror",
		"ace/mode/json/json_parse"
	], function(a, b, c) {
		var d = a("../lib/oop"),
			e = a("../worker/mirror").Mirror,
			f = a("./json/json_parse"),
			g = (b.JsonWorker = function(a) {
				e.call(this, a), this.setTimeout(200);
			});
		d.inherits(g, e),
			function() {
				(this.onUpdate = function() {
					var a = this.doc.getValue();
					try {
						var b = f(a);
					} catch (c) {
						var d = this.charToDocumentPosition(c.at - 1);
						this.sender.emit("error", { row: d.row, column: d.column, text: c.message, type: "error" });
						return;
					}
					this.sender.emit("ok");
				}),
					(this.charToDocumentPosition = function(a) {
						var b = 0,
							c = this.doc.getLength(),
							d = this.doc.getNewLineCharacter().length;
						if (!c) return { row: 0, column: 0 };
						var e = 0;
						while (b < c) {
							var f = this.doc.getLine(b),
								g = f.length + d;
							if (e + g > a) return { row: b, column: a - e };
							(e += g), (b += 1);
						}
						return { row: b - 1, column: f.length };
					});
			}.call(g.prototype);
	}),
	define("ace/worker/mirror", ["require", "exports", "module", "ace/document", "ace/lib/lang"], function(a, b, c) {
		var d = a("../document").Document,
			e = a("../lib/lang"),
			f = (b.Mirror = function(a) {
				this.sender = a;
				var b = (this.doc = new d("")),
					c = (this.deferredUpdate = e.deferredCall(this.onUpdate.bind(this))),
					f = this;
				a.on("change", function(a) {
					b.applyDeltas([a.data]), c.schedule(f.$timeout);
				});
			});
		(function() {
			(this.$timeout = 500),
				(this.setTimeout = function(a) {
					this.$timeout = a;
				}),
				(this.setValue = function(a) {
					this.doc.setValue(a), this.deferredUpdate.schedule(this.$timeout);
				}),
				(this.getValue = function(a) {
					this.sender.callback(this.doc.getValue(), a);
				}),
				(this.onUpdate = function() {});
		}.call(f.prototype));
	}),
	define("ace/document", [
		"require",
		"exports",
		"module",
		"ace/lib/oop",
		"ace/lib/event_emitter",
		"ace/range",
		"ace/anchor"
	], function(a, b, c) {
		var d = a("./lib/oop"),
			e = a("./lib/event_emitter").EventEmitter,
			f = a("./range").Range,
			g = a("./anchor").Anchor,
			h = function(a) {
				(this.$lines = []),
					a.length == 0
						? (this.$lines = [""])
						: Array.isArray(a)
						? this.insertLines(0, a)
						: this.insert({ row: 0, column: 0 }, a);
			};
		(function() {
			d.implement(this, e),
				(this.setValue = function(a) {
					var b = this.getLength();
					this.remove(new f(0, 0, b, this.getLine(b - 1).length)), this.insert({ row: 0, column: 0 }, a);
				}),
				(this.getValue = function() {
					return this.getAllLines().join(this.getNewLineCharacter());
				}),
				(this.createAnchor = function(a, b) {
					return new g(this, a, b);
				}),
				"aaa".split(/a/).length == 0
					? (this.$split = function(a) {
							return a.replace(/\r\n|\r/g, "\n").split("\n");
					  })
					: (this.$split = function(a) {
							return a.split(/\r\n|\r|\n/);
					  }),
				(this.$detectNewLine = function(a) {
					var b = a.match(/^.*?(\r\n|\r|\n)/m);
					b ? (this.$autoNewLine = b[1]) : (this.$autoNewLine = "\n");
				}),
				(this.getNewLineCharacter = function() {
					switch (this.$newLineMode) {
						case "windows":
							return "\r\n";
						case "unix":
							return "\n";
						case "auto":
							return this.$autoNewLine;
					}
				}),
				(this.$autoNewLine = "\n"),
				(this.$newLineMode = "auto"),
				(this.setNewLineMode = function(a) {
					if (this.$newLineMode === a) return;
					this.$newLineMode = a;
				}),
				(this.getNewLineMode = function() {
					return this.$newLineMode;
				}),
				(this.isNewLine = function(a) {
					return a == "\r\n" || a == "\r" || a == "\n";
				}),
				(this.getLine = function(a) {
					return this.$lines[a] || "";
				}),
				(this.getLines = function(a, b) {
					return this.$lines.slice(a, b + 1);
				}),
				(this.getAllLines = function() {
					return this.getLines(0, this.getLength());
				}),
				(this.getLength = function() {
					return this.$lines.length;
				}),
				(this.getTextRange = function(a) {
					if (a.start.row == a.end.row)
						return this.$lines[a.start.row].substring(a.start.column, a.end.column);
					var b = this.getLines(a.start.row + 1, a.end.row - 1);
					return (
						b.unshift((this.$lines[a.start.row] || "").substring(a.start.column)),
						b.push((this.$lines[a.end.row] || "").substring(0, a.end.column)),
						b.join(this.getNewLineCharacter())
					);
				}),
				(this.$clipPosition = function(a) {
					var b = this.getLength();
					return a.row >= b && ((a.row = Math.max(0, b - 1)), (a.column = this.getLine(b - 1).length)), a;
				}),
				(this.insert = function(a, b) {
					if (!b || b.length === 0) return a;
					(a = this.$clipPosition(a)), this.getLength() <= 1 && this.$detectNewLine(b);
					var c = this.$split(b),
						d = c.splice(0, 1)[0],
						e = c.length == 0 ? null : c.splice(c.length - 1, 1)[0];
					return (
						(a = this.insertInLine(a, d)),
						e !== null &&
							((a = this.insertNewLine(a)),
							(a = this.insertLines(a.row, c)),
							(a = this.insertInLine(a, e || ""))),
						a
					);
				}),
				(this.insertLines = function(a, b) {
					if (b.length == 0) return { row: a, column: 0 };
					if (b.length > 65535) {
						var c = this.insertLines(a, b.slice(65535));
						b = b.slice(0, 65535);
					}
					var d = [a, 0];
					d.push.apply(d, b), this.$lines.splice.apply(this.$lines, d);
					var e = new f(a, 0, a + b.length, 0),
						g = { action: "insertLines", range: e, lines: b };
					return this._emit("change", { data: g }), c || e.end;
				}),
				(this.insertNewLine = function(a) {
					a = this.$clipPosition(a);
					var b = this.$lines[a.row] || "";
					(this.$lines[a.row] = b.substring(0, a.column)),
						this.$lines.splice(a.row + 1, 0, b.substring(a.column, b.length));
					var c = { row: a.row + 1, column: 0 },
						d = { action: "insertText", range: f.fromPoints(a, c), text: this.getNewLineCharacter() };
					return this._emit("change", { data: d }), c;
				}),
				(this.insertInLine = function(a, b) {
					if (b.length == 0) return a;
					var c = this.$lines[a.row] || "";
					this.$lines[a.row] = c.substring(0, a.column) + b + c.substring(a.column);
					var d = { row: a.row, column: a.column + b.length },
						e = { action: "insertText", range: f.fromPoints(a, d), text: b };
					return this._emit("change", { data: e }), d;
				}),
				(this.remove = function(a) {
					(a.start = this.$clipPosition(a.start)), (a.end = this.$clipPosition(a.end));
					if (a.isEmpty()) return a.start;
					var b = a.start.row,
						c = a.end.row;
					if (a.isMultiLine()) {
						var d = a.start.column == 0 ? b : b + 1,
							e = c - 1;
						a.end.column > 0 && this.removeInLine(c, 0, a.end.column),
							e >= d && this.removeLines(d, e),
							d != b &&
								(this.removeInLine(b, a.start.column, this.getLine(b).length),
								this.removeNewLine(a.start.row));
					} else this.removeInLine(b, a.start.column, a.end.column);
					return a.start;
				}),
				(this.removeInLine = function(a, b, c) {
					if (b == c) return;
					var d = new f(a, b, a, c),
						e = this.getLine(a),
						g = e.substring(b, c),
						h = e.substring(0, b) + e.substring(c, e.length);
					this.$lines.splice(a, 1, h);
					var i = { action: "removeText", range: d, text: g };
					return this._emit("change", { data: i }), d.start;
				}),
				(this.removeLines = function(a, b) {
					var c = new f(a, 0, b + 1, 0),
						d = this.$lines.splice(a, b - a + 1),
						e = { action: "removeLines", range: c, nl: this.getNewLineCharacter(), lines: d };
					return this._emit("change", { data: e }), d;
				}),
				(this.removeNewLine = function(a) {
					var b = this.getLine(a),
						c = this.getLine(a + 1),
						d = new f(a, b.length, a + 1, 0),
						e = b + c;
					this.$lines.splice(a, 2, e);
					var g = { action: "removeText", range: d, text: this.getNewLineCharacter() };
					this._emit("change", { data: g });
				}),
				(this.replace = function(a, b) {
					if (b.length == 0 && a.isEmpty()) return a.start;
					if (b == this.getTextRange(a)) return a.end;
					this.remove(a);
					if (b) var c = this.insert(a.start, b);
					else c = a.start;
					return c;
				}),
				(this.applyDeltas = function(a) {
					for (var b = 0; b < a.length; b++) {
						var c = a[b],
							d = f.fromPoints(c.range.start, c.range.end);
						c.action == "insertLines"
							? this.insertLines(d.start.row, c.lines)
							: c.action == "insertText"
							? this.insert(d.start, c.text)
							: c.action == "removeLines"
							? this.removeLines(d.start.row, d.end.row - 1)
							: c.action == "removeText" && this.remove(d);
					}
				}),
				(this.revertDeltas = function(a) {
					for (var b = a.length - 1; b >= 0; b--) {
						var c = a[b],
							d = f.fromPoints(c.range.start, c.range.end);
						c.action == "insertLines"
							? this.removeLines(d.start.row, d.end.row - 1)
							: c.action == "insertText"
							? this.remove(d)
							: c.action == "removeLines"
							? this.insertLines(d.start.row, c.lines)
							: c.action == "removeText" && this.insert(d.start, c.text);
					}
				});
		}.call(h.prototype),
			(b.Document = h));
	}),
	define("ace/range", ["require", "exports", "module"], function(a, b, c) {
		var d = function(a, b, c, d) {
			(this.start = { row: a, column: b }), (this.end = { row: c, column: d });
		};
		(function() {
			(this.isEqual = function(a) {
				return (
					this.start.row == a.start.row &&
					this.end.row == a.end.row &&
					this.start.column == a.start.column &&
					this.end.column == a.end.column
				);
			}),
				(this.toString = function() {
					return (
						"Range: [" +
						this.start.row +
						"/" +
						this.start.column +
						"] -> [" +
						this.end.row +
						"/" +
						this.end.column +
						"]"
					);
				}),
				(this.contains = function(a, b) {
					return this.compare(a, b) == 0;
				}),
				(this.compareRange = function(a) {
					var b,
						c = a.end,
						d = a.start;
					return (
						(b = this.compare(c.row, c.column)),
						b == 1
							? ((b = this.compare(d.row, d.column)), b == 1 ? 2 : b == 0 ? 1 : 0)
							: b == -1
							? -2
							: ((b = this.compare(d.row, d.column)), b == -1 ? -1 : b == 1 ? 42 : 0)
					);
				}),
				(this.comparePoint = function(a) {
					return this.compare(a.row, a.column);
				}),
				(this.containsRange = function(a) {
					return this.comparePoint(a.start) == 0 && this.comparePoint(a.end) == 0;
				}),
				(this.intersects = function(a) {
					var b = this.compareRange(a);
					return b == -1 || b == 0 || b == 1;
				}),
				(this.isEnd = function(a, b) {
					return this.end.row == a && this.end.column == b;
				}),
				(this.isStart = function(a, b) {
					return this.start.row == a && this.start.column == b;
				}),
				(this.setStart = function(a, b) {
					typeof a == "object"
						? ((this.start.column = a.column), (this.start.row = a.row))
						: ((this.start.row = a), (this.start.column = b));
				}),
				(this.setEnd = function(a, b) {
					typeof a == "object"
						? ((this.end.column = a.column), (this.end.row = a.row))
						: ((this.end.row = a), (this.end.column = b));
				}),
				(this.inside = function(a, b) {
					return this.compare(a, b) == 0 ? (this.isEnd(a, b) || this.isStart(a, b) ? !1 : !0) : !1;
				}),
				(this.insideStart = function(a, b) {
					return this.compare(a, b) == 0 ? (this.isEnd(a, b) ? !1 : !0) : !1;
				}),
				(this.insideEnd = function(a, b) {
					return this.compare(a, b) == 0 ? (this.isStart(a, b) ? !1 : !0) : !1;
				}),
				(this.compare = function(a, b) {
					return !this.isMultiLine() && a === this.start.row
						? b < this.start.column
							? -1
							: b > this.end.column
							? 1
							: 0
						: a < this.start.row
						? -1
						: a > this.end.row
						? 1
						: this.start.row === a
						? b >= this.start.column
							? 0
							: -1
						: this.end.row === a
						? b <= this.end.column
							? 0
							: 1
						: 0;
				}),
				(this.compareStart = function(a, b) {
					return this.start.row == a && this.start.column == b ? -1 : this.compare(a, b);
				}),
				(this.compareEnd = function(a, b) {
					return this.end.row == a && this.end.column == b ? 1 : this.compare(a, b);
				}),
				(this.compareInside = function(a, b) {
					return this.end.row == a && this.end.column == b
						? 1
						: this.start.row == a && this.start.column == b
						? -1
						: this.compare(a, b);
				}),
				(this.clipRows = function(a, b) {
					if (this.end.row > b) var c = { row: b + 1, column: 0 };
					if (this.start.row > b) var e = { row: b + 1, column: 0 };
					if (this.start.row < a) var e = { row: a, column: 0 };
					if (this.end.row < a) var c = { row: a, column: 0 };
					return d.fromPoints(e || this.start, c || this.end);
				}),
				(this.extend = function(a, b) {
					var c = this.compare(a, b);
					if (c == 0) return this;
					if (c == -1) var e = { row: a, column: b };
					else var f = { row: a, column: b };
					return d.fromPoints(e || this.start, f || this.end);
				}),
				(this.isEmpty = function() {
					return this.start.row == this.end.row && this.start.column == this.end.column;
				}),
				(this.isMultiLine = function() {
					return this.start.row !== this.end.row;
				}),
				(this.clone = function() {
					return d.fromPoints(this.start, this.end);
				}),
				(this.collapseRows = function() {
					return this.end.column == 0
						? new d(this.start.row, 0, Math.max(this.start.row, this.end.row - 1), 0)
						: new d(this.start.row, 0, this.end.row, 0);
				}),
				(this.toScreenRange = function(a) {
					var b = a.documentToScreenPosition(this.start),
						c = a.documentToScreenPosition(this.end);
					return new d(b.row, b.column, c.row, c.column);
				});
		}.call(d.prototype),
			(d.fromPoints = function(a, b) {
				return new d(a.row, a.column, b.row, b.column);
			}),
			(b.Range = d));
	}),
	define("ace/anchor", ["require", "exports", "module", "ace/lib/oop", "ace/lib/event_emitter"], function(a, b, c) {
		var d = a("./lib/oop"),
			e = a("./lib/event_emitter").EventEmitter,
			f = (b.Anchor = function(a, b, c) {
				(this.document = a),
					typeof c == "undefined" ? this.setPosition(b.row, b.column) : this.setPosition(b, c),
					(this.$onChange = this.onChange.bind(this)),
					a.on("change", this.$onChange);
			});
		(function() {
			d.implement(this, e),
				(this.getPosition = function() {
					return this.$clipPositionToDocument(this.row, this.column);
				}),
				(this.getDocument = function() {
					return this.document;
				}),
				(this.onChange = function(a) {
					var b = a.data,
						c = b.range;
					if (c.start.row == c.end.row && c.start.row != this.row) return;
					if (c.start.row > this.row) return;
					if (c.start.row == this.row && c.start.column > this.column) return;
					var d = this.row,
						e = this.column;
					b.action === "insertText"
						? c.start.row === d && c.start.column <= e
							? c.start.row === c.end.row
								? (e += c.end.column - c.start.column)
								: ((e -= c.start.column), (d += c.end.row - c.start.row))
							: c.start.row !== c.end.row && c.start.row < d && (d += c.end.row - c.start.row)
						: b.action === "insertLines"
						? c.start.row <= d && (d += c.end.row - c.start.row)
						: b.action == "removeText"
						? c.start.row == d && c.start.column < e
							? c.end.column >= e
								? (e = c.start.column)
								: (e = Math.max(0, e - (c.end.column - c.start.column)))
							: c.start.row !== c.end.row && c.start.row < d
							? (c.end.row == d && (e = Math.max(0, e - c.end.column) + c.start.column),
							  (d -= c.end.row - c.start.row))
							: c.end.row == d &&
							  ((d -= c.end.row - c.start.row), (e = Math.max(0, e - c.end.column) + c.start.column))
						: b.action == "removeLines" &&
						  c.start.row <= d &&
						  (c.end.row <= d ? (d -= c.end.row - c.start.row) : ((d = c.start.row), (e = 0))),
						this.setPosition(d, e, !0);
				}),
				(this.setPosition = function(a, b, c) {
					var d;
					c ? (d = { row: a, column: b }) : (d = this.$clipPositionToDocument(a, b));
					if (this.row == d.row && this.column == d.column) return;
					var e = { row: this.row, column: this.column };
					(this.row = d.row), (this.column = d.column), this._emit("change", { old: e, value: d });
				}),
				(this.detach = function() {
					this.document.removeEventListener("change", this.$onChange);
				}),
				(this.$clipPositionToDocument = function(a, b) {
					var c = {};
					return (
						a >= this.document.getLength()
							? ((c.row = Math.max(0, this.document.getLength() - 1)),
							  (c.column = this.document.getLine(c.row).length))
							: a < 0
							? ((c.row = 0), (c.column = 0))
							: ((c.row = a), (c.column = Math.min(this.document.getLine(c.row).length, Math.max(0, b)))),
						b < 0 && (c.column = 0),
						c
					);
				});
		}.call(f.prototype));
	}),
	define("ace/lib/lang", ["require", "exports", "module"], function(a, b, c) {
		(b.stringReverse = function(a) {
			return a
				.split("")
				.reverse()
				.join("");
		}),
			(b.stringRepeat = function(a, b) {
				return new Array(b + 1).join(a);
			});
		var d = /^\s\s*/,
			e = /\s\s*$/;
		(b.stringTrimLeft = function(a) {
			return a.replace(d, "");
		}),
			(b.stringTrimRight = function(a) {
				return a.replace(e, "");
			}),
			(b.copyObject = function(a) {
				var b = {};
				for (var c in a) b[c] = a[c];
				return b;
			}),
			(b.copyArray = function(a) {
				var b = [];
				for (var c = 0, d = a.length; c < d; c++)
					a[c] && typeof a[c] == "object" ? (b[c] = this.copyObject(a[c])) : (b[c] = a[c]);
				return b;
			}),
			(b.deepCopy = function(a) {
				if (typeof a != "object") return a;
				var b = a.constructor();
				for (var c in a) typeof a[c] == "object" ? (b[c] = this.deepCopy(a[c])) : (b[c] = a[c]);
				return b;
			}),
			(b.arrayToMap = function(a) {
				var b = {};
				for (var c = 0; c < a.length; c++) b[a[c]] = 1;
				return b;
			}),
			(b.createMap = function(a) {
				var b = Object.create(null);
				for (var c in a) b[c] = a[c];
				return b;
			}),
			(b.arrayRemove = function(a, b) {
				for (var c = 0; c <= a.length; c++) b === a[c] && a.splice(c, 1);
			}),
			(b.escapeRegExp = function(a) {
				return a.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1");
			}),
			(b.getMatchOffsets = function(a, b) {
				var c = [];
				return (
					a.replace(b, function(a) {
						c.push({ offset: arguments[arguments.length - 2], length: a.length });
					}),
					c
				);
			}),
			(b.deferredCall = function(a) {
				var b = null,
					c = function() {
						(b = null), a();
					},
					d = function(a) {
						return d.cancel(), (b = setTimeout(c, a || 0)), d;
					};
				return (
					(d.schedule = d),
					(d.call = function() {
						return this.cancel(), a(), d;
					}),
					(d.cancel = function() {
						return clearTimeout(b), (b = null), d;
					}),
					d
				);
			});
	}),
	define("ace/mode/json/json_parse", ["require", "exports", "module"], function(a, b, c) {
		var d,
			e,
			f = { '"': '"', "\\": "\\", "/": "/", b: "\b", f: "\f", n: "\n", r: "\r", t: "	" },
			g,
			h = function(a) {
				throw { name: "SyntaxError", message: a, at: d, text: g };
			},
			i = function(a) {
				return a && a !== e && h("Expected '" + a + "' instead of '" + e + "'"), (e = g.charAt(d)), (d += 1), e;
			},
			j = function() {
				var a,
					b = "";
				e === "-" && ((b = "-"), i("-"));
				while (e >= "0" && e <= "9") (b += e), i();
				if (e === ".") {
					b += ".";
					while (i() && e >= "0" && e <= "9") b += e;
				}
				if (e === "e" || e === "E") {
					(b += e), i();
					if (e === "-" || e === "+") (b += e), i();
					while (e >= "0" && e <= "9") (b += e), i();
				}
				a = +b;
				if (!isNaN(a)) return a;
				h("Bad number");
			},
			k = function() {
				var a,
					b,
					c = "",
					d;
				if (e === '"')
					while (i()) {
						if (e === '"') return i(), c;
						if (e === "\\") {
							i();
							if (e === "u") {
								d = 0;
								for (b = 0; b < 4; b += 1) {
									a = parseInt(i(), 16);
									if (!isFinite(a)) break;
									d = d * 16 + a;
								}
								c += String.fromCharCode(d);
							} else {
								if (typeof f[e] != "string") break;
								c += f[e];
							}
						} else c += e;
					}
				h("Bad string");
			},
			l = function() {
				while (e && e <= " ") i();
			},
			m = function() {
				switch (e) {
					case "t":
						return i("t"), i("r"), i("u"), i("e"), !0;
					case "f":
						return i("f"), i("a"), i("l"), i("s"), i("e"), !1;
					case "n":
						return i("n"), i("u"), i("l"), i("l"), null;
				}
				h("Unexpected '" + e + "'");
			},
			n,
			o = function() {
				var a = [];
				if (e === "[") {
					i("["), l();
					if (e === "]") return i("]"), a;
					while (e) {
						a.push(n()), l();
						if (e === "]") return i("]"), a;
						i(","), l();
					}
				}
				h("Bad array");
			},
			p = function() {
				var a,
					b = {};
				if (e === "{") {
					i("{"), l();
					if (e === "}") return i("}"), b;
					while (e) {
						(a = k()),
							l(),
							i(":"),
							Object.hasOwnProperty.call(b, a) && h('Duplicate key "' + a + '"'),
							(b[a] = n()),
							l();
						if (e === "}") return i("}"), b;
						i(","), l();
					}
				}
				h("Bad object");
			};
		return (
			(n = function() {
				l();
				switch (e) {
					case "{":
						return p();
					case "[":
						return o();
					case '"':
						return k();
					case "-":
						return j();
					default:
						return e >= "0" && e <= "9" ? j() : m();
				}
			}),
			function(a, b) {
				var c;
				return (
					(g = a),
					(d = 0),
					(e = " "),
					(c = n()),
					l(),
					e && h("Syntax error"),
					typeof b == "function"
						? (function f(a, c) {
								var d,
									e,
									g = a[c];
								if (g && typeof g == "object")
									for (d in g)
										Object.hasOwnProperty.call(g, d) &&
											((e = f(g, d)), e !== undefined ? (g[d] = e) : delete g[d]);
								return b.call(a, c, g);
						  })({ "": c }, "")
						: c
				);
			}
		);
	});
