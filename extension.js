"use strict";
var or = Object.create;
var Re = Object.defineProperty;
var ar = Object.getOwnPropertyDescriptor;
var cr = Object.getOwnPropertyNames;
var lr = Object.getPrototypeOf,
    dr = Object.prototype.hasOwnProperty;
var y = (n, e) => () => (e || n((e = {
    exports: {}
}).exports, e), e.exports),
    hr = (n, e) => {
        for (var t in e) Re(n, t, {
            get: e[t],
            enumerable: !0
        })
    },
    Kt = (n, e, t, s) => {
        if (e && typeof e == "object" || typeof e == "function")
            for (let i of cr(e)) !dr.call(n, i) && i !== t && Re(n, i, {
                get: () => e[i],
                enumerable: !(s = ar(e, i)) || s.enumerable
            });
        return n
    };
var m = (n, e, t) => (t = n != null ? or(lr(n)) : {}, Kt(e || !n || !n.__esModule ? Re(t, "default", {
    value: n,
    enumerable: !0
}) : t, n)),
    ur = n => Kt(Re({}, "__esModule", {
        value: !0
    }), n);
var Yt = y((Co, Zt) => {
    "use strict";
    var pr = /[|\\{}()[\]^$+*?.-]/g;
    Zt.exports = n => {
        if (typeof n != "string") throw new TypeError("Expected a string");
        return n.replace(pr, "\\$&")
    }
});
var ss = y((xo, ts) => {
    "use strict";
    var fr = Yt(),
        gr = typeof process == "object" && process && typeof process.cwd == "function" ? process.cwd() : ".",
        es = [].concat(require("module").builtinModules, "bootstrap_node", "node").map(n => new RegExp(`(?:\\((?:node:)?${n}(?:\\.js)?:\\d+:\\d+\\)$|^\\s*at (?:node:)?${n}(?:\\.js)?:\\d+:\\d+$)`));
    es.push(/\((?:node:)?internal\/[^:]+:\d+:\d+\)$/, /\s*at (?:node:)?internal\/[^:]+:\d+:\d+$/, /\/\.node-spawn-wrap-\w+-\w+\/node:\d+:\d+\)?$/);
    var de = class {
        constructor(e) {
            e = {
                ignoredPackages: [],
                ...e
            }, "internals" in e || (e.internals = de.nodeInternals()), "cwd" in e || (e.cwd = gr), this._cwd = e.cwd.replace(/\\/g, "/"), this._internals = [].concat(e.internals, _r(e.ignoredPackages)), this._wrapCallSite = e.wrapCallSite || !1
        }
        static nodeInternals() {
            return [...es]
        }
        clean(e, t = 0) {
            t = " ".repeat(t), Array.isArray(e) || (e = e.split(`
`)), !/^\s*at /.test(e[0]) && /^\s*at /.test(e[1]) && (e = e.slice(1));
            let s = !1,
                i = null,
                r = [];
            return e.forEach(o => {
                if (o = o.replace(/\\/g, "/"), this._internals.some(c => c.test(o))) return;
                let a = /^\s*at /.test(o);
                s ? o = o.trimEnd().replace(/^(\s+)at /, "$1") : (o = o.trim(), a && (o = o.slice(3))), o = o.replace(`${this._cwd}/`, ""), o && (a ? (i && (r.push(i), i = null), r.push(o)) : (s = !0, i = o))
            }), r.map(o => `${t}${o}
`).join("")
        }
        captureString(e, t = this.captureString) {
            typeof e == "function" && (t = e, e = 1 / 0);
            let {
                stackTraceLimit: s
            } = Error;
            e && (Error.stackTraceLimit = e);
            let i = {};
            Error.captureStackTrace(i, t);
            let {
                stack: r
            } = i;
            return Error.stackTraceLimit = s, this.clean(r)
        }
        capture(e, t = this.capture) {
            typeof e == "function" && (t = e, e = 1 / 0);
            let {
                prepareStackTrace: s,
                stackTraceLimit: i
            } = Error;
            Error.prepareStackTrace = (a, c) => this._wrapCallSite ? c.map(this._wrapCallSite) : c, e && (Error.stackTraceLimit = e);
            let r = {};
            Error.captureStackTrace(r, t);
            let {
                stack: o
            } = r;
            return Object.assign(Error, {
                prepareStackTrace: s,
                stackTraceLimit: i
            }), o
        }
        at(e = this.at) {
            let [t] = this.capture(1, e);
            if (!t) return {};
            let s = {
                line: t.getLineNumber(),
                column: t.getColumnNumber()
            };
            Xt(s, t.getFileName(), this._cwd), t.isConstructor() && Object.defineProperty(s, "constructor", {
                value: !0,
                configurable: !0
            }), t.isEval() && (s.evalOrigin = t.getEvalOrigin()), t.isNative() && (s.native = !0);
            let i;
            try {
                i = t.getTypeName()
            } catch { }
            i && i !== "Object" && i !== "[object Object]" && (s.type = i);
            let r = t.getFunctionName();
            r && (s.function = r);
            let o = t.getMethodName();
            return o && r !== o && (s.method = o), s
        }
        parseLine(e) {
            let t = e && e.match(mr);
            if (!t) return null;
            let s = t[1] === "new",
                i = t[2],
                r = t[3],
                o = t[4],
                a = Number(t[5]),
                c = Number(t[6]),
                l = t[7],
                d = t[8],
                h = t[9],
                p = t[10] === "native",
                g = t[11] === ")",
                u, f = {};
            if (d && (f.line = Number(d)), h && (f.column = Number(h)), g && l) {
                let v = 0;
                for (let T = l.length - 1; T > 0; T--)
                    if (l.charAt(T) === ")") v++;
                    else if (l.charAt(T) === "(" && l.charAt(T - 1) === " " && (v--, v === -1 && l.charAt(T - 1) === " ")) {
                        let E = l.slice(0, T - 1);
                        l = l.slice(T + 1), i += ` (${E}`;
                        break
                    }
            }
            if (i) {
                let v = i.match(vr);
                v && (i = v[1], u = v[2])
            }
            return Xt(f, l, this._cwd), s && Object.defineProperty(f, "constructor", {
                value: !0,
                configurable: !0
            }), r && (f.evalOrigin = r, f.evalLine = a, f.evalColumn = c, f.evalFile = o && o.replace(/\\/g, "/")), p && (f.native = !0), i && (f.function = i), u && i !== u && (f.method = u), f
        }
    };

    function Xt(n, e, t) {
        e && (e = e.replace(/\\/g, "/"), e.startsWith(`${t}/`) && (e = e.slice(t.length + 1)), n.file = e)
    }

    function _r(n) {
        if (n.length === 0) return [];
        let e = n.map(t => fr(t));
        return new RegExp(`[/\\\\]node_modules[/\\\\](?:${e.join("|")})[/\\\\][^:]+:\\d+:\\d+`)
    }
    var mr = new RegExp("^(?:\\s*at )?(?:(new) )?(?:(.*?) \\()?(?:eval at ([^ ]+) \\((.+?):(\\d+):(\\d+)\\), )?(?:(.+?):(\\d+):(\\d+)|(native))(\\)?)$"),
        vr = /^(.*?) \[as (.*?)\]$/;
    ts.exports = de
});
var ms = y(X => {
    "use strict";
    Object.defineProperty(X, "__esModule", {
        value: !0
    });
    X.sync = X.isexe = void 0;
    var Pr = require("fs"),
        kr = require("fs/promises"),
        Ir = async (n, e = {}) => {
            let {
                ignoreErrors: t = !1
            } = e;
            try {
                return _s(await (0, kr.stat)(n), e)
            } catch (s) {
                let i = s;
                if (t || i.code === "EACCES") return !1;
                throw i
            }
        };
    X.isexe = Ir;
    var Rr = (n, e = {}) => {
        let {
            ignoreErrors: t = !1
        } = e;
        try {
            return _s((0, Pr.statSync)(n), e)
        } catch (s) {
            let i = s;
            if (t || i.code === "EACCES") return !1;
            throw i
        }
    };
    X.sync = Rr;
    var _s = (n, e) => n.isFile() && Mr(n, e),
        Mr = (n, e) => {
            var g, u, f, v, T, E, R, k;
            let t = (u = e.uid) != null ? u : (g = process.getuid) == null ? void 0 : g.call(process),
                s = (T = (v = e.groups) != null ? v : (f = process.getgroups) == null ? void 0 : f.call(process)) != null ? T : [],
                i = (k = (R = e.gid) != null ? R : (E = process.getgid) == null ? void 0 : E.call(process)) != null ? k : s[0];
            if (t === void 0 || i === void 0) throw new Error("cannot get uid or gid");
            let r = new Set([i, ...s]),
                o = n.mode,
                a = n.uid,
                c = n.gid,
                l = parseInt("100", 8),
                d = parseInt("010", 8),
                h = parseInt("001", 8),
                p = l | d;
            return !!(o & h || o & d && r.has(c) || o & l && a === t || o & p && t === 0)
        }
});
var Ts = y(ee => {
    "use strict";
    Object.defineProperty(ee, "__esModule", {
        value: !0
    });
    ee.sync = ee.isexe = void 0;
    var Fr = require("fs"),
        Or = require("fs/promises"),
        Lr = async (n, e = {}) => {
            let {
                ignoreErrors: t = !1
            } = e;
            try {
                return vs(await (0, Or.stat)(n), n, e)
            } catch (s) {
                let i = s;
                if (t || i.code === "EACCES") return !1;
                throw i
            }
        };
    ee.isexe = Lr;
    var Nr = (n, e = {}) => {
        let {
            ignoreErrors: t = !1
        } = e;
        try {
            return vs((0, Fr.statSync)(n), n, e)
        } catch (s) {
            let i = s;
            if (t || i.code === "EACCES") return !1;
            throw i
        }
    };
    ee.sync = Nr;
    var Dr = (n, e) => {
        let {
            pathExt: t = process.env.PATHEXT || ""
        } = e, s = t.split(";");
        if (s.indexOf("") !== -1) return !0;
        for (let i = 0; i < s.length; i++) {
            let r = s[i].toLowerCase(),
                o = n.substring(n.length - r.length).toLowerCase();
            if (r && o === r) return !0
        }
        return !1
    },
        vs = (n, e, t) => n.isFile() && Dr(e, t)
});
var ws = y(ys => {
    "use strict";
    Object.defineProperty(ys, "__esModule", {
        value: !0
    })
});
var Ps = y(w => {
    "use strict";
    var Ss = w && w.__createBinding || (Object.create ? function (n, e, t, s) {
        s === void 0 && (s = t);
        var i = Object.getOwnPropertyDescriptor(e, t);
        (!i || ("get" in i ? !e.__esModule : i.writable || i.configurable)) && (i = {
            enumerable: !0,
            get: function () {
                return e[t]
            }
        }), Object.defineProperty(n, s, i)
    } : function (n, e, t, s) {
        s === void 0 && (s = t), n[s] = e[t]
    }),
        jr = w && w.__setModuleDefault || (Object.create ? function (n, e) {
            Object.defineProperty(n, "default", {
                enumerable: !0,
                value: e
            })
        } : function (n, e) {
            n.default = e
        }),
        bs = w && w.__importStar || function (n) {
            if (n && n.__esModule) return n;
            var e = {};
            if (n != null)
                for (var t in n) t !== "default" && Object.prototype.hasOwnProperty.call(n, t) && Ss(e, n, t);
            return jr(e, n), e
        },
        Br = w && w.__exportStar || function (n, e) {
            for (var t in n) t !== "default" && !Object.prototype.hasOwnProperty.call(e, t) && Ss(e, n, t)
        };
    Object.defineProperty(w, "__esModule", {
        value: !0
    });
    w.sync = w.isexe = w.posix = w.win32 = void 0;
    var Es = bs(ms());
    w.posix = Es;
    var Cs = bs(Ts());
    w.win32 = Cs;
    Br(ws(), w);
    var Wr = process.env._ISEXE_TEST_PLATFORM_ || process.platform,
        xs = Wr === "win32" ? Cs : Es;
    w.isexe = xs.isexe;
    w.sync = xs.sync
});
var js = y((qo, Ds) => {
    var {
        isexe: Ar,
        sync: Ur
    } = Ps(), {
        join: qr,
        delimiter: Vr,
        sep: ks,
        posix: Is
    } = require("path"), Rs = process.platform === "win32", Ms = new RegExp(`[${Is.sep}${ks === Is.sep ? "" : ks}]`.replace(/(\\)/g, "\\$1")), Hr = new RegExp(`^\\.${Ms.source}`), Fs = n => Object.assign(new Error(`not found: ${n}`), {
        code: "ENOENT"
    }), Os = (n, {
        path: e = process.env.PATH,
        pathExt: t = process.env.PATHEXT,
        delimiter: s = Vr
    }) => {
        let i = n.match(Ms) ? [""] : [...Rs ? [process.cwd()] : [], ...(e || "").split(s)];
        if (Rs) {
            let r = t || [".EXE", ".CMD", ".BAT", ".COM"].join(s),
                o = r.split(s).flatMap(a => [a, a.toLowerCase()]);
            return n.includes(".") && o[0] !== "" && o.unshift(""), {
                pathEnv: i,
                pathExt: o,
                pathExtExe: r
            }
        }
        return {
            pathEnv: i,
            pathExt: [""]
        }
    }, Ls = (n, e) => {
        let t = /^".*"$/.test(n) ? n.slice(1, -1) : n;
        return (!t && Hr.test(e) ? e.slice(0, 2) : "") + qr(t, e)
    }, Ns = async (n, e = {}) => {
        let {
            pathEnv: t,
            pathExt: s,
            pathExtExe: i
        } = Os(n, e), r = [];
        for (let o of t) {
            let a = Ls(o, n);
            for (let c of s) {
                let l = a + c;
                if (await Ar(l, {
                    pathExt: i,
                    ignoreErrors: !0
                })) {
                    if (!e.all) return l;
                    r.push(l)
                }
            }
        }
        if (e.all && r.length) return r;
        if (e.nothrow) return null;
        throw Fs(n)
    }, Gr = (n, e = {}) => {
        let {
            pathEnv: t,
            pathExt: s,
            pathExtExe: i
        } = Os(n, e), r = [];
        for (let o of t) {
            let a = Ls(o, n);
            for (let c of s) {
                let l = a + c;
                if (Ur(l, {
                    pathExt: i,
                    ignoreErrors: !0
                })) {
                    if (!e.all) return l;
                    r.push(l)
                }
            }
        }
        if (e.all && r.length) return r;
        if (e.nothrow) return null;
        throw Fs(n)
    };
    Ds.exports = Ns;
    Ns.sync = Gr
});
var Gs = y((Ho, Hs) => {
    "use strict";
    var {
        Duplex: Qr
    } = require("stream");

    function qs(n) {
        n.emit("close")
    }

    function Kr() {
        !this.destroyed && this._writableState.finished && this.destroy()
    }

    function Vs(n) {
        this.removeListener("error", Vs), this.destroy(), this.listenerCount("error") === 0 && this.emit("error", n)
    }

    function Zr(n, e) {
        let t = !0,
            s = new Qr({
                ...e,
                autoDestroy: !1,
                emitClose: !1,
                objectMode: !1,
                writableObjectMode: !1
            });
        return n.on("message", function (r, o) {
            let a = !o && s._readableState.objectMode ? r.toString() : r;
            s.push(a) || n.pause()
        }), n.once("error", function (r) {
            s.destroyed || (t = !1, s.destroy(r))
        }), n.once("close", function () {
            s.destroyed || s.push(null)
        }), s._destroy = function (i, r) {
            if (n.readyState === n.CLOSED) {
                r(i), process.nextTick(qs, s);
                return
            }
            let o = !1;
            n.once("error", function (c) {
                o = !0, r(c)
            }), n.once("close", function () {
                o || r(i), process.nextTick(qs, s)
            }), t && n.terminate()
        }, s._final = function (i) {
            if (n.readyState === n.CONNECTING) {
                n.once("open", function () {
                    s._final(i)
                });
                return
            }
            n._socket !== null && (n._socket._writableState.finished ? (i(), s._readableState.endEmitted && s.destroy()) : (n._socket.once("finish", function () {
                i()
            }), n.close()))
        }, s._read = function () {
            n.isPaused && n.resume()
        }, s._write = function (i, r, o) {
            if (n.readyState === n.CONNECTING) {
                n.once("open", function () {
                    s._write(i, r, o)
                });
                return
            }
            n.send(i, o)
        }, s.on("end", Kr), s.on("error", Vs), s
    }
    Hs.exports = Zr
});
var q = y((Go, $s) => {
    "use strict";
    $s.exports = {
        BINARY_TYPES: ["nodebuffer", "arraybuffer", "fragments"],
        EMPTY_BUFFER: Buffer.alloc(0),
        GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
        kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
        kListener: Symbol("kListener"),
        kStatusCode: Symbol("status-code"),
        kWebSocket: Symbol("websocket"),
        NOOP: () => { }
    }
});
var _e = y(($o, Le) => {
    "use strict";
    var {
        EMPTY_BUFFER: Yr
    } = q();

    function Xr(n, e) {
        if (n.length === 0) return Yr;
        if (n.length === 1) return n[0];
        let t = Buffer.allocUnsafe(e),
            s = 0;
        for (let i = 0; i < n.length; i++) {
            let r = n[i];
            t.set(r, s), s += r.length
        }
        return s < e ? t.slice(0, s) : t
    }

    function Js(n, e, t, s, i) {
        for (let r = 0; r < i; r++) t[s + r] = n[r] ^ e[r & 3]
    }

    function zs(n, e) {
        for (let t = 0; t < n.length; t++) n[t] ^= e[t & 3]
    }

    function en(n) {
        return n.byteLength === n.buffer.byteLength ? n.buffer : n.buffer.slice(n.byteOffset, n.byteOffset + n.byteLength)
    }

    function vt(n) {
        if (vt.readOnly = !0, Buffer.isBuffer(n)) return n;
        let e;
        return n instanceof ArrayBuffer ? e = Buffer.from(n) : ArrayBuffer.isView(n) ? e = Buffer.from(n.buffer, n.byteOffset, n.byteLength) : (e = Buffer.from(n), vt.readOnly = !1), e
    }
    Le.exports = {
        concat: Xr,
        mask: Js,
        toArrayBuffer: en,
        toBuffer: vt,
        unmask: zs
    };
    if (!process.env.WS_NO_BUFFER_UTIL) try {
        let n = require("bufferutil");
        Le.exports.mask = function (e, t, s, i, r) {
            r < 48 ? Js(e, t, s, i, r) : n.mask(e, t, s, i, r)
        }, Le.exports.unmask = function (e, t) {
            e.length < 32 ? zs(e, t) : n.unmask(e, t)
        }
    } catch { }
});
var Zs = y((Jo, Ks) => {
    "use strict";
    var Qs = Symbol("kDone"),
        Tt = Symbol("kRun"),
        yt = class {
            constructor(e) {
                this[Qs] = () => {
                    this.pending--, this[Tt]()
                }, this.concurrency = e || 1 / 0, this.jobs = [], this.pending = 0
            }
            add(e) {
                this.jobs.push(e), this[Tt]()
            } [Tt]() {
                if (this.pending !== this.concurrency && this.jobs.length) {
                    let e = this.jobs.shift();
                    this.pending++, e(this[Qs])
                }
            }
        };
    Ks.exports = yt
});
var Te = y((zo, ti) => {
    "use strict";
    var me = require("zlib"),
        Ys = _e(),
        tn = Zs(),
        {
            kStatusCode: Xs
        } = q(),
        sn = Buffer.from([0, 0, 255, 255]),
        je = Symbol("permessage-deflate"),
        j = Symbol("total-length"),
        ve = Symbol("callback"),
        V = Symbol("buffers"),
        De = Symbol("error"),
        Ne, wt = class {
            constructor(e, t, s) {
                if (this._maxPayload = s | 0, this._options = e || {}, this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024, this._isServer = !!t, this._deflate = null, this._inflate = null, this.params = null, !Ne) {
                    let i = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
                    Ne = new tn(i)
                }
            }
            static get extensionName() {
                return "permessage-deflate"
            }
            offer() {
                let e = {};
                return this._options.serverNoContextTakeover && (e.server_no_context_takeover = !0), this._options.clientNoContextTakeover && (e.client_no_context_takeover = !0), this._options.serverMaxWindowBits && (e.server_max_window_bits = this._options.serverMaxWindowBits), this._options.clientMaxWindowBits ? e.client_max_window_bits = this._options.clientMaxWindowBits : this._options.clientMaxWindowBits == null && (e.client_max_window_bits = !0), e
            }
            accept(e) {
                return e = this.normalizeParams(e), this.params = this._isServer ? this.acceptAsServer(e) : this.acceptAsClient(e), this.params
            }
            cleanup() {
                if (this._inflate && (this._inflate.close(), this._inflate = null), this._deflate) {
                    let e = this._deflate[ve];
                    this._deflate.close(), this._deflate = null, e && e(new Error("The deflate stream was closed while data was being processed"))
                }
            }
            acceptAsServer(e) {
                let t = this._options,
                    s = e.find(i => !(t.serverNoContextTakeover === !1 && i.server_no_context_takeover || i.server_max_window_bits && (t.serverMaxWindowBits === !1 || typeof t.serverMaxWindowBits == "number" && t.serverMaxWindowBits > i.server_max_window_bits) || typeof t.clientMaxWindowBits == "number" && !i.client_max_window_bits));
                if (!s) throw new Error("None of the extension offers can be accepted");
                return t.serverNoContextTakeover && (s.server_no_context_takeover = !0), t.clientNoContextTakeover && (s.client_no_context_takeover = !0), typeof t.serverMaxWindowBits == "number" && (s.server_max_window_bits = t.serverMaxWindowBits), typeof t.clientMaxWindowBits == "number" ? s.client_max_window_bits = t.clientMaxWindowBits : (s.client_max_window_bits === !0 || t.clientMaxWindowBits === !1) && delete s.client_max_window_bits, s
            }
            acceptAsClient(e) {
                let t = e[0];
                if (this._options.clientNoContextTakeover === !1 && t.client_no_context_takeover) throw new Error('Unexpected parameter "client_no_context_takeover"');
                if (!t.client_max_window_bits) typeof this._options.clientMaxWindowBits == "number" && (t.client_max_window_bits = this._options.clientMaxWindowBits);
                else if (this._options.clientMaxWindowBits === !1 || typeof this._options.clientMaxWindowBits == "number" && t.client_max_window_bits > this._options.clientMaxWindowBits) throw new Error('Unexpected or invalid parameter "client_max_window_bits"');
                return t
            }
            normalizeParams(e) {
                return e.forEach(t => {
                    Object.keys(t).forEach(s => {
                        let i = t[s];
                        if (i.length > 1) throw new Error(`Parameter "${s}" must have only a single value`);
                        if (i = i[0], s === "client_max_window_bits") {
                            if (i !== !0) {
                                let r = +i;
                                if (!Number.isInteger(r) || r < 8 || r > 15) throw new TypeError(`Invalid value for parameter "${s}": ${i}`);
                                i = r
                            } else if (!this._isServer) throw new TypeError(`Invalid value for parameter "${s}": ${i}`)
                        } else if (s === "server_max_window_bits") {
                            let r = +i;
                            if (!Number.isInteger(r) || r < 8 || r > 15) throw new TypeError(`Invalid value for parameter "${s}": ${i}`);
                            i = r
                        } else if (s === "client_no_context_takeover" || s === "server_no_context_takeover") {
                            if (i !== !0) throw new TypeError(`Invalid value for parameter "${s}": ${i}`)
                        } else throw new Error(`Unknown parameter "${s}"`);
                        t[s] = i
                    })
                }), e
            }
            decompress(e, t, s) {
                Ne.add(i => {
                    this._decompress(e, t, (r, o) => {
                        i(), s(r, o)
                    })
                })
            }
            compress(e, t, s) {
                Ne.add(i => {
                    this._compress(e, t, (r, o) => {
                        i(), s(r, o)
                    })
                })
            }
            _decompress(e, t, s) {
                let i = this._isServer ? "client" : "server";
                if (!this._inflate) {
                    let r = `${i}_max_window_bits`,
                        o = typeof this.params[r] != "number" ? me.Z_DEFAULT_WINDOWBITS : this.params[r];
                    this._inflate = me.createInflateRaw({
                        ...this._options.zlibInflateOptions,
                        windowBits: o
                    }), this._inflate[je] = this, this._inflate[j] = 0, this._inflate[V] = [], this._inflate.on("error", nn), this._inflate.on("data", ei)
                }
                this._inflate[ve] = s, this._inflate.write(e), t && this._inflate.write(sn), this._inflate.flush(() => {
                    let r = this._inflate[De];
                    if (r) {
                        this._inflate.close(), this._inflate = null, s(r);
                        return
                    }
                    let o = Ys.concat(this._inflate[V], this._inflate[j]);
                    this._inflate._readableState.endEmitted ? (this._inflate.close(), this._inflate = null) : (this._inflate[j] = 0, this._inflate[V] = [], t && this.params[`${i}_no_context_takeover`] && this._inflate.reset()), s(null, o)
                })
            }
            _compress(e, t, s) {
                let i = this._isServer ? "server" : "client";
                if (!this._deflate) {
                    let r = `${i}_max_window_bits`,
                        o = typeof this.params[r] != "number" ? me.Z_DEFAULT_WINDOWBITS : this.params[r];
                    this._deflate = me.createDeflateRaw({
                        ...this._options.zlibDeflateOptions,
                        windowBits: o
                    }), this._deflate[j] = 0, this._deflate[V] = [], this._deflate.on("data", rn)
                }
                this._deflate[ve] = s, this._deflate.write(e), this._deflate.flush(me.Z_SYNC_FLUSH, () => {
                    if (!this._deflate) return;
                    let r = Ys.concat(this._deflate[V], this._deflate[j]);
                    t && (r = r.slice(0, r.length - 4)), this._deflate[ve] = null, this._deflate[j] = 0, this._deflate[V] = [], t && this.params[`${i}_no_context_takeover`] && this._deflate.reset(), s(null, r)
                })
            }
        };
    ti.exports = wt;

    function rn(n) {
        this[V].push(n), this[j] += n.length
    }

    function ei(n) {
        if (this[j] += n.length, this[je]._maxPayload < 1 || this[j] <= this[je]._maxPayload) {
            this[V].push(n);
            return
        }
        this[De] = new RangeError("Max payload size exceeded"), this[De].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH", this[De][Xs] = 1009, this.removeListener("data", ei), this.reset()
    }

    function nn(n) {
        this[je]._inflate = null, n[Xs] = 1007, this[ve](n)
    }
});
var ye = y((Qo, St) => {
    "use strict";
    var on = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0];

    function an(n) {
        return n >= 1e3 && n <= 1014 && n !== 1004 && n !== 1005 && n !== 1006 || n >= 3e3 && n <= 4999
    }

    function si(n) {
        let e = n.length,
            t = 0;
        for (; t < e;)
            if ((n[t] & 128) === 0) t++;
            else if ((n[t] & 224) === 192) {
                if (t + 1 === e || (n[t + 1] & 192) !== 128 || (n[t] & 254) === 192) return !1;
                t += 2
            } else if ((n[t] & 240) === 224) {
                if (t + 2 >= e || (n[t + 1] & 192) !== 128 || (n[t + 2] & 192) !== 128 || n[t] === 224 && (n[t + 1] & 224) === 128 || n[t] === 237 && (n[t + 1] & 224) === 160) return !1;
                t += 3
            } else if ((n[t] & 248) === 240) {
                if (t + 3 >= e || (n[t + 1] & 192) !== 128 || (n[t + 2] & 192) !== 128 || (n[t + 3] & 192) !== 128 || n[t] === 240 && (n[t + 1] & 240) === 128 || n[t] === 244 && n[t + 1] > 143 || n[t] > 244) return !1;
                t += 4
            } else return !1;
        return !0
    }
    St.exports = {
        isValidStatusCode: an,
        isValidUTF8: si,
        tokenChars: on
    };
    if (!process.env.WS_NO_UTF_8_VALIDATE) try {
        let n = require("utf-8-validate");
        St.exports.isValidUTF8 = function (e) {
            return e.length < 150 ? si(e) : n(e)
        }
    } catch { }
});
var xt = y((Ko, li) => {
    "use strict";
    var {
        Writable: cn
    } = require("stream"), ii = Te(), {
        BINARY_TYPES: ln,
        EMPTY_BUFFER: ri,
        kStatusCode: dn,
        kWebSocket: hn
    } = q(), {
        concat: bt,
        toArrayBuffer: un,
        unmask: pn
    } = _e(), {
        isValidStatusCode: fn,
        isValidUTF8: ni
    } = ye(), we = 0, oi = 1, ai = 2, ci = 3, Et = 4, gn = 5, Ct = class extends cn {
        constructor(e = {}) {
            super(), this._binaryType = e.binaryType || ln[0], this._extensions = e.extensions || {}, this._isServer = !!e.isServer, this._maxPayload = e.maxPayload | 0, this._skipUTF8Validation = !!e.skipUTF8Validation, this[hn] = void 0, this._bufferedBytes = 0, this._buffers = [], this._compressed = !1, this._payloadLength = 0, this._mask = void 0, this._fragmented = 0, this._masked = !1, this._fin = !1, this._opcode = 0, this._totalPayloadLength = 0, this._messageLength = 0, this._fragments = [], this._state = we, this._loop = !1
        }
        _write(e, t, s) {
            if (this._opcode === 8 && this._state == we) return s();
            this._bufferedBytes += e.length, this._buffers.push(e), this.startLoop(s)
        }
        consume(e) {
            if (this._bufferedBytes -= e, e === this._buffers[0].length) return this._buffers.shift();
            if (e < this._buffers[0].length) {
                let s = this._buffers[0];
                return this._buffers[0] = s.slice(e), s.slice(0, e)
            }
            let t = Buffer.allocUnsafe(e);
            do {
                let s = this._buffers[0],
                    i = t.length - e;
                e >= s.length ? t.set(this._buffers.shift(), i) : (t.set(new Uint8Array(s.buffer, s.byteOffset, e), i), this._buffers[0] = s.slice(e)), e -= s.length
            } while (e > 0);
            return t
        }
        startLoop(e) {
            let t;
            this._loop = !0;
            do switch (this._state) {
                case we:
                    t = this.getInfo();
                    break;
                case oi:
                    t = this.getPayloadLength16();
                    break;
                case ai:
                    t = this.getPayloadLength64();
                    break;
                case ci:
                    this.getMask();
                    break;
                case Et:
                    t = this.getData(e);
                    break;
                default:
                    this._loop = !1;
                    return
            }
            while (this._loop);
            e(t)
        }
        getInfo() {
            if (this._bufferedBytes < 2) {
                this._loop = !1;
                return
            }
            let e = this.consume(2);
            if ((e[0] & 48) !== 0) return this._loop = !1, S(RangeError, "RSV2 and RSV3 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_2_3");
            let t = (e[0] & 64) === 64;
            if (t && !this._extensions[ii.extensionName]) return this._loop = !1, S(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1");
            if (this._fin = (e[0] & 128) === 128, this._opcode = e[0] & 15, this._payloadLength = e[1] & 127, this._opcode === 0) {
                if (t) return this._loop = !1, S(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1");
                if (!this._fragmented) return this._loop = !1, S(RangeError, "invalid opcode 0", !0, 1002, "WS_ERR_INVALID_OPCODE");
                this._opcode = this._fragmented
            } else if (this._opcode === 1 || this._opcode === 2) {
                if (this._fragmented) return this._loop = !1, S(RangeError, `invalid opcode ${this._opcode}`, !0, 1002, "WS_ERR_INVALID_OPCODE");
                this._compressed = t
            } else if (this._opcode > 7 && this._opcode < 11) {
                if (!this._fin) return this._loop = !1, S(RangeError, "FIN must be set", !0, 1002, "WS_ERR_EXPECTED_FIN");
                if (t) return this._loop = !1, S(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1");
                if (this._payloadLength > 125) return this._loop = !1, S(RangeError, `invalid payload length ${this._payloadLength}`, !0, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH")
            } else return this._loop = !1, S(RangeError, `invalid opcode ${this._opcode}`, !0, 1002, "WS_ERR_INVALID_OPCODE");
            if (!this._fin && !this._fragmented && (this._fragmented = this._opcode), this._masked = (e[1] & 128) === 128, this._isServer) {
                if (!this._masked) return this._loop = !1, S(RangeError, "MASK must be set", !0, 1002, "WS_ERR_EXPECTED_MASK")
            } else if (this._masked) return this._loop = !1, S(RangeError, "MASK must be clear", !0, 1002, "WS_ERR_UNEXPECTED_MASK");
            if (this._payloadLength === 126) this._state = oi;
            else if (this._payloadLength === 127) this._state = ai;
            else return this.haveLength()
        }
        getPayloadLength16() {
            if (this._bufferedBytes < 2) {
                this._loop = !1;
                return
            }
            return this._payloadLength = this.consume(2).readUInt16BE(0), this.haveLength()
        }
        getPayloadLength64() {
            if (this._bufferedBytes < 8) {
                this._loop = !1;
                return
            }
            let e = this.consume(8),
                t = e.readUInt32BE(0);
            return t > Math.pow(2, 53 - 32) - 1 ? (this._loop = !1, S(RangeError, "Unsupported WebSocket frame: payload length > 2^53 - 1", !1, 1009, "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH")) : (this._payloadLength = t * Math.pow(2, 32) + e.readUInt32BE(4), this.haveLength())
        }
        haveLength() {
            if (this._payloadLength && this._opcode < 8 && (this._totalPayloadLength += this._payloadLength, this._totalPayloadLength > this._maxPayload && this._maxPayload > 0)) return this._loop = !1, S(RangeError, "Max payload size exceeded", !1, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");
            this._masked ? this._state = ci : this._state = Et
        }
        getMask() {
            if (this._bufferedBytes < 4) {
                this._loop = !1;
                return
            }
            this._mask = this.consume(4), this._state = Et
        }
        getData(e) {
            let t = ri;
            if (this._payloadLength) {
                if (this._bufferedBytes < this._payloadLength) {
                    this._loop = !1;
                    return
                }
                t = this.consume(this._payloadLength), this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0 && pn(t, this._mask)
            }
            if (this._opcode > 7) return this.controlMessage(t);
            if (this._compressed) {
                this._state = gn, this.decompress(t, e);
                return
            }
            return t.length && (this._messageLength = this._totalPayloadLength, this._fragments.push(t)), this.dataMessage()
        }
        decompress(e, t) {
            this._extensions[ii.extensionName].decompress(e, this._fin, (i, r) => {
                if (i) return t(i);
                if (r.length) {
                    if (this._messageLength += r.length, this._messageLength > this._maxPayload && this._maxPayload > 0) return t(S(RangeError, "Max payload size exceeded", !1, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"));
                    this._fragments.push(r)
                }
                let o = this.dataMessage();
                if (o) return t(o);
                this.startLoop(t)
            })
        }
        dataMessage() {
            if (this._fin) {
                let e = this._messageLength,
                    t = this._fragments;
                if (this._totalPayloadLength = 0, this._messageLength = 0, this._fragmented = 0, this._fragments = [], this._opcode === 2) {
                    let s;
                    this._binaryType === "nodebuffer" ? s = bt(t, e) : this._binaryType === "arraybuffer" ? s = un(bt(t, e)) : s = t, this.emit("message", s, !0)
                } else {
                    let s = bt(t, e);
                    if (!this._skipUTF8Validation && !ni(s)) return this._loop = !1, S(Error, "invalid UTF-8 sequence", !0, 1007, "WS_ERR_INVALID_UTF8");
                    this.emit("message", s, !1)
                }
            }
            this._state = we
        }
        controlMessage(e) {
            if (this._opcode === 8)
                if (this._loop = !1, e.length === 0) this.emit("conclude", 1005, ri), this.end();
                else {
                    if (e.length === 1) return S(RangeError, "invalid payload length 1", !0, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH");
                    {
                        let t = e.readUInt16BE(0);
                        if (!fn(t)) return S(RangeError, `invalid status code ${t}`, !0, 1002, "WS_ERR_INVALID_CLOSE_CODE");
                        let s = e.slice(2);
                        if (!this._skipUTF8Validation && !ni(s)) return S(Error, "invalid UTF-8 sequence", !0, 1007, "WS_ERR_INVALID_UTF8");
                        this.emit("conclude", t, s), this.end()
                    }
                }
            else this._opcode === 9 ? this.emit("ping", e) : this.emit("pong", e);
            this._state = we
        }
    };
    li.exports = Ct;

    function S(n, e, t, s, i) {
        let r = new n(t ? `Invalid WebSocket frame: ${e}` : e);
        return Error.captureStackTrace(r, S), r.code = i, r[dn] = s, r
    }
});
var Pt = y((Xo, ui) => {
    "use strict";
    var Zo = require("net"),
        Yo = require("tls"),
        {
            randomFillSync: _n
        } = require("crypto"),
        di = Te(),
        {
            EMPTY_BUFFER: mn
        } = q(),
        {
            isValidStatusCode: vn
        } = ye(),
        {
            mask: hi,
            toBuffer: se
        } = _e(),
        F = Symbol("kByteLength"),
        Tn = Buffer.alloc(4),
        L = class {
            constructor(e, t, s) {
                this._extensions = t || {}, s && (this._generateMask = s, this._maskBuffer = Buffer.alloc(4)), this._socket = e, this._firstFragment = !0, this._compress = !1, this._bufferedBytes = 0, this._deflating = !1, this._queue = []
            }
            static frame(e, t) {
                let s, i = !1,
                    r = 2,
                    o = !1;
                t.mask && (s = t.maskBuffer || Tn, t.generateMask ? t.generateMask(s) : _n(s, 0, 4), o = (s[0] | s[1] | s[2] | s[3]) === 0, r = 6);
                let a;
                typeof e == "string" ? (!t.mask || o) && t[F] !== void 0 ? a = t[F] : (e = Buffer.from(e), a = e.length) : (a = e.length, i = t.mask && t.readOnly && !o);
                let c = a;
                a >= 65536 ? (r += 8, c = 127) : a > 125 && (r += 2, c = 126);
                let l = Buffer.allocUnsafe(i ? a + r : r);
                return l[0] = t.fin ? t.opcode | 128 : t.opcode, t.rsv1 && (l[0] |= 64), l[1] = c, c === 126 ? l.writeUInt16BE(a, 2) : c === 127 && (l[2] = l[3] = 0, l.writeUIntBE(a, 4, 6)), t.mask ? (l[1] |= 128, l[r - 4] = s[0], l[r - 3] = s[1], l[r - 2] = s[2], l[r - 1] = s[3], o ? [l, e] : i ? (hi(e, s, l, r, a), [l]) : (hi(e, s, e, 0, a), [l, e])) : [l, e]
            }
            close(e, t, s, i) {
                let r;
                if (e === void 0) r = mn;
                else {
                    if (typeof e != "number" || !vn(e)) throw new TypeError("First argument must be a valid error code number");
                    if (t === void 0 || !t.length) r = Buffer.allocUnsafe(2), r.writeUInt16BE(e, 0);
                    else {
                        let a = Buffer.byteLength(t);
                        if (a > 123) throw new RangeError("The message must not be greater than 123 bytes");
                        r = Buffer.allocUnsafe(2 + a), r.writeUInt16BE(e, 0), typeof t == "string" ? r.write(t, 2) : r.set(t, 2)
                    }
                }
                let o = {
                    [F]: r.length,
                    fin: !0,
                    generateMask: this._generateMask,
                    mask: s,
                    maskBuffer: this._maskBuffer,
                    opcode: 8,
                    readOnly: !1,
                    rsv1: !1
                };
                this._deflating ? this.enqueue([this.dispatch, r, !1, o, i]) : this.sendFrame(L.frame(r, o), i)
            }
            ping(e, t, s) {
                let i, r;
                if (typeof e == "string" ? (i = Buffer.byteLength(e), r = !1) : (e = se(e), i = e.length, r = se.readOnly), i > 125) throw new RangeError("The data size must not be greater than 125 bytes");
                let o = {
                    [F]: i,
                    fin: !0,
                    generateMask: this._generateMask,
                    mask: t,
                    maskBuffer: this._maskBuffer,
                    opcode: 9,
                    readOnly: r,
                    rsv1: !1
                };
                this._deflating ? this.enqueue([this.dispatch, e, !1, o, s]) : this.sendFrame(L.frame(e, o), s)
            }
            pong(e, t, s) {
                let i, r;
                if (typeof e == "string" ? (i = Buffer.byteLength(e), r = !1) : (e = se(e), i = e.length, r = se.readOnly), i > 125) throw new RangeError("The data size must not be greater than 125 bytes");
                let o = {
                    [F]: i,
                    fin: !0,
                    generateMask: this._generateMask,
                    mask: t,
                    maskBuffer: this._maskBuffer,
                    opcode: 10,
                    readOnly: r,
                    rsv1: !1
                };
                this._deflating ? this.enqueue([this.dispatch, e, !1, o, s]) : this.sendFrame(L.frame(e, o), s)
            }
            send(e, t, s) {
                let i = this._extensions[di.extensionName],
                    r = t.binary ? 2 : 1,
                    o = t.compress,
                    a, c;
                if (typeof e == "string" ? (a = Buffer.byteLength(e), c = !1) : (e = se(e), a = e.length, c = se.readOnly), this._firstFragment ? (this._firstFragment = !1, o && i && i.params[i._isServer ? "server_no_context_takeover" : "client_no_context_takeover"] && (o = a >= i._threshold), this._compress = o) : (o = !1, r = 0), t.fin && (this._firstFragment = !0), i) {
                    let l = {
                        [F]: a,
                        fin: t.fin,
                        generateMask: this._generateMask,
                        mask: t.mask,
                        maskBuffer: this._maskBuffer,
                        opcode: r,
                        readOnly: c,
                        rsv1: o
                    };
                    this._deflating ? this.enqueue([this.dispatch, e, this._compress, l, s]) : this.dispatch(e, this._compress, l, s)
                } else this.sendFrame(L.frame(e, {
                    [F]: a,
                    fin: t.fin,
                    generateMask: this._generateMask,
                    mask: t.mask,
                    maskBuffer: this._maskBuffer,
                    opcode: r,
                    readOnly: c,
                    rsv1: !1
                }), s)
            }
            dispatch(e, t, s, i) {
                if (!t) {
                    this.sendFrame(L.frame(e, s), i);
                    return
                }
                let r = this._extensions[di.extensionName];
                this._bufferedBytes += s[F], this._deflating = !0, r.compress(e, s.fin, (o, a) => {
                    if (this._socket.destroyed) {
                        let c = new Error("The socket was closed while data was being compressed");
                        typeof i == "function" && i(c);
                        for (let l = 0; l < this._queue.length; l++) {
                            let d = this._queue[l],
                                h = d[d.length - 1];
                            typeof h == "function" && h(c)
                        }
                        return
                    }
                    this._bufferedBytes -= s[F], this._deflating = !1, s.readOnly = !1, this.sendFrame(L.frame(a, s), i), this.dequeue()
                })
            }
            dequeue() {
                for (; !this._deflating && this._queue.length;) {
                    let e = this._queue.shift();
                    this._bufferedBytes -= e[3][F], Reflect.apply(e[0], this, e.slice(1))
                }
            }
            enqueue(e) {
                this._bufferedBytes += e[3][F], this._queue.push(e)
            }
            sendFrame(e, t) {
                e.length === 2 ? (this._socket.cork(), this._socket.write(e[0]), this._socket.write(e[1], t), this._socket.uncork()) : this._socket.write(e[0], t)
            }
        };
    ui.exports = L
});
var wi = y((ea, yi) => {
    "use strict";
    var {
        kForOnEventAttribute: Se,
        kListener: kt
    } = q(), pi = Symbol("kCode"), fi = Symbol("kData"), gi = Symbol("kError"), _i = Symbol("kMessage"), mi = Symbol("kReason"), ie = Symbol("kTarget"), vi = Symbol("kType"), Ti = Symbol("kWasClean"), B = class {
        constructor(e) {
            this[ie] = null, this[vi] = e
        }
        get target() {
            return this[ie]
        }
        get type() {
            return this[vi]
        }
    };
    Object.defineProperty(B.prototype, "target", {
        enumerable: !0
    });
    Object.defineProperty(B.prototype, "type", {
        enumerable: !0
    });
    var J = class extends B {
        constructor(e, t = {}) {
            super(e), this[pi] = t.code === void 0 ? 0 : t.code, this[mi] = t.reason === void 0 ? "" : t.reason, this[Ti] = t.wasClean === void 0 ? !1 : t.wasClean
        }
        get code() {
            return this[pi]
        }
        get reason() {
            return this[mi]
        }
        get wasClean() {
            return this[Ti]
        }
    };
    Object.defineProperty(J.prototype, "code", {
        enumerable: !0
    });
    Object.defineProperty(J.prototype, "reason", {
        enumerable: !0
    });
    Object.defineProperty(J.prototype, "wasClean", {
        enumerable: !0
    });
    var re = class extends B {
        constructor(e, t = {}) {
            super(e), this[gi] = t.error === void 0 ? null : t.error, this[_i] = t.message === void 0 ? "" : t.message
        }
        get error() {
            return this[gi]
        }
        get message() {
            return this[_i]
        }
    };
    Object.defineProperty(re.prototype, "error", {
        enumerable: !0
    });
    Object.defineProperty(re.prototype, "message", {
        enumerable: !0
    });
    var be = class extends B {
        constructor(e, t = {}) {
            super(e), this[fi] = t.data === void 0 ? null : t.data
        }
        get data() {
            return this[fi]
        }
    };
    Object.defineProperty(be.prototype, "data", {
        enumerable: !0
    });
    var yn = {
        addEventListener(n, e, t = {}) {
            for (let i of this.listeners(n))
                if (!t[Se] && i[kt] === e && !i[Se]) return;
            let s;
            if (n === "message") s = function (r, o) {
                let a = new be("message", {
                    data: o ? r : r.toString()
                });
                a[ie] = this, Be(e, this, a)
            };
            else if (n === "close") s = function (r, o) {
                let a = new J("close", {
                    code: r,
                    reason: o.toString(),
                    wasClean: this._closeFrameReceived && this._closeFrameSent
                });
                a[ie] = this, Be(e, this, a)
            };
            else if (n === "error") s = function (r) {
                let o = new re("error", {
                    error: r,
                    message: r.message
                });
                o[ie] = this, Be(e, this, o)
            };
            else if (n === "open") s = function () {
                let r = new B("open");
                r[ie] = this, Be(e, this, r)
            };
            else return;
            s[Se] = !!t[Se], s[kt] = e, t.once ? this.once(n, s) : this.on(n, s)
        },
        removeEventListener(n, e) {
            for (let t of this.listeners(n))
                if (t[kt] === e && !t[Se]) {
                    this.removeListener(n, t);
                    break
                }
        }
    };
    yi.exports = {
        CloseEvent: J,
        ErrorEvent: re,
        Event: B,
        EventTarget: yn,
        MessageEvent: be
    };

    function Be(n, e, t) {
        typeof n == "object" && n.handleEvent ? n.handleEvent.call(n, t) : n.call(e, t)
    }
});
var It = y((ta, Si) => {
    "use strict";
    var {
        tokenChars: Ee
    } = ye();

    function N(n, e, t) {
        n[e] === void 0 ? n[e] = [t] : n[e].push(t)
    }

    function wn(n) {
        let e = Object.create(null),
            t = Object.create(null),
            s = !1,
            i = !1,
            r = !1,
            o, a, c = -1,
            l = -1,
            d = -1,
            h = 0;
        for (; h < n.length; h++)
            if (l = n.charCodeAt(h), o === void 0)
                if (d === -1 && Ee[l] === 1) c === -1 && (c = h);
                else if (h !== 0 && (l === 32 || l === 9)) d === -1 && c !== -1 && (d = h);
                else if (l === 59 || l === 44) {
                    if (c === -1) throw new SyntaxError(`Unexpected character at index ${h}`);
                    d === -1 && (d = h);
                    let g = n.slice(c, d);
                    l === 44 ? (N(e, g, t), t = Object.create(null)) : o = g, c = d = -1
                } else throw new SyntaxError(`Unexpected character at index ${h}`);
            else if (a === void 0)
                if (d === -1 && Ee[l] === 1) c === -1 && (c = h);
                else if (l === 32 || l === 9) d === -1 && c !== -1 && (d = h);
                else if (l === 59 || l === 44) {
                    if (c === -1) throw new SyntaxError(`Unexpected character at index ${h}`);
                    d === -1 && (d = h), N(t, n.slice(c, d), !0), l === 44 && (N(e, o, t), t = Object.create(null), o = void 0), c = d = -1
                } else if (l === 61 && c !== -1 && d === -1) a = n.slice(c, h), c = d = -1;
                else throw new SyntaxError(`Unexpected character at index ${h}`);
            else if (i) {
                if (Ee[l] !== 1) throw new SyntaxError(`Unexpected character at index ${h}`);
                c === -1 ? c = h : s || (s = !0), i = !1
            } else if (r)
                if (Ee[l] === 1) c === -1 && (c = h);
                else if (l === 34 && c !== -1) r = !1, d = h;
                else if (l === 92) i = !0;
                else throw new SyntaxError(`Unexpected character at index ${h}`);
            else if (l === 34 && n.charCodeAt(h - 1) === 61) r = !0;
            else if (d === -1 && Ee[l] === 1) c === -1 && (c = h);
            else if (c !== -1 && (l === 32 || l === 9)) d === -1 && (d = h);
            else if (l === 59 || l === 44) {
                if (c === -1) throw new SyntaxError(`Unexpected character at index ${h}`);
                d === -1 && (d = h);
                let g = n.slice(c, d);
                s && (g = g.replace(/\\/g, ""), s = !1), N(t, a, g), l === 44 && (N(e, o, t), t = Object.create(null), o = void 0), a = void 0, c = d = -1
            } else throw new SyntaxError(`Unexpected character at index ${h}`);
        if (c === -1 || r || l === 32 || l === 9) throw new SyntaxError("Unexpected end of input");
        d === -1 && (d = h);
        let p = n.slice(c, d);
        return o === void 0 ? N(e, p, t) : (a === void 0 ? N(t, p, !0) : s ? N(t, a, p.replace(/\\/g, "")) : N(t, a, p), N(e, o, t)), e
    }

    function Sn(n) {
        return Object.keys(n).map(e => {
            let t = n[e];
            return Array.isArray(t) || (t = [t]), t.map(s => [e].concat(Object.keys(s).map(i => {
                let r = s[i];
                return Array.isArray(r) || (r = [r]), r.map(o => o === !0 ? i : `${i}=${o}`).join("; ")
            })).join("; ")).join(", ")
        }).join(", ")
    }
    Si.exports = {
        format: Sn,
        parse: wn
    }
});
var Lt = y((ia, Oi) => {
    "use strict";
    var bn = require("events"),
        En = require("https"),
        Cn = require("http"),
        Ci = require("net"),
        xn = require("tls"),
        {
            randomBytes: Pn,
            createHash: kn
        } = require("crypto"),
        {
            Readable: sa
        } = require("stream"),
        {
            URL: Rt
        } = require("url"),
        H = Te(),
        In = xt(),
        Rn = Pt(),
        {
            BINARY_TYPES: bi,
            EMPTY_BUFFER: We,
            GUID: Mn,
            kForOnEventAttribute: Mt,
            kListener: Fn,
            kStatusCode: On,
            kWebSocket: C,
            NOOP: xi
        } = q(),
        {
            EventTarget: {
                addEventListener: Ln,
                removeEventListener: Nn
            }
        } = wi(),
        {
            format: Dn,
            parse: jn
        } = It(),
        {
            toBuffer: Bn
        } = _e(),
        Wn = 30 * 1e3,
        Pi = Symbol("kAborted"),
        Ft = [8, 13],
        W = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"],
        An = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/,
        _ = class extends bn {
            constructor(e, t, s) {
                super(), this._binaryType = bi[0], this._closeCode = 1006, this._closeFrameReceived = !1, this._closeFrameSent = !1, this._closeMessage = We, this._closeTimer = null, this._extensions = {}, this._paused = !1, this._protocol = "", this._readyState = _.CONNECTING, this._receiver = null, this._sender = null, this._socket = null, e !== null ? (this._bufferedAmount = 0, this._isServer = !1, this._redirects = 0, t === void 0 ? t = [] : Array.isArray(t) || (typeof t == "object" && t !== null ? (s = t, t = []) : t = [t]), ki(this, e, t, s)) : this._isServer = !0
            }
            get binaryType() {
                return this._binaryType
            }
            set binaryType(e) {
                !bi.includes(e) || (this._binaryType = e, this._receiver && (this._receiver._binaryType = e))
            }
            get bufferedAmount() {
                return this._socket ? this._socket._writableState.length + this._sender._bufferedBytes : this._bufferedAmount
            }
            get extensions() {
                return Object.keys(this._extensions).join()
            }
            get isPaused() {
                return this._paused
            }
            get onclose() {
                return null
            }
            get onerror() {
                return null
            }
            get onopen() {
                return null
            }
            get onmessage() {
                return null
            }
            get protocol() {
                return this._protocol
            }
            get readyState() {
                return this._readyState
            }
            get url() {
                return this._url
            }
            setSocket(e, t, s) {
                let i = new In({
                    binaryType: this.binaryType,
                    extensions: this._extensions,
                    isServer: this._isServer,
                    maxPayload: s.maxPayload,
                    skipUTF8Validation: s.skipUTF8Validation
                });
                this._sender = new Rn(e, this._extensions, s.generateMask), this._receiver = i, this._socket = e, i[C] = this, e[C] = this, i.on("conclude", Vn), i.on("drain", Hn), i.on("error", Gn), i.on("message", $n), i.on("ping", Jn), i.on("pong", zn), e.setTimeout(0), e.setNoDelay(), t.length > 0 && e.unshift(t), e.on("close", Ri), e.on("data", Ue), e.on("end", Mi), e.on("error", Fi), this._readyState = _.OPEN, this.emit("open")
            }
            emitClose() {
                if (!this._socket) {
                    this._readyState = _.CLOSED, this.emit("close", this._closeCode, this._closeMessage);
                    return
                }
                this._extensions[H.extensionName] && this._extensions[H.extensionName].cleanup(), this._receiver.removeAllListeners(), this._readyState = _.CLOSED, this.emit("close", this._closeCode, this._closeMessage)
            }
            close(e, t) {
                if (this.readyState !== _.CLOSED) {
                    if (this.readyState === _.CONNECTING) {
                        let s = "WebSocket was closed before the connection was established";
                        return I(this, this._req, s)
                    }
                    if (this.readyState === _.CLOSING) {
                        this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted) && this._socket.end();
                        return
                    }
                    this._readyState = _.CLOSING, this._sender.close(e, t, !this._isServer, s => {
                        s || (this._closeFrameSent = !0, (this._closeFrameReceived || this._receiver._writableState.errorEmitted) && this._socket.end())
                    }), this._closeTimer = setTimeout(this._socket.destroy.bind(this._socket), Wn)
                }
            }
            pause() {
                this.readyState === _.CONNECTING || this.readyState === _.CLOSED || (this._paused = !0, this._socket.pause())
            }
            ping(e, t, s) {
                if (this.readyState === _.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
                if (typeof e == "function" ? (s = e, e = t = void 0) : typeof t == "function" && (s = t, t = void 0), typeof e == "number" && (e = e.toString()), this.readyState !== _.OPEN) {
                    Ot(this, e, s);
                    return
                }
                t === void 0 && (t = !this._isServer), this._sender.ping(e || We, t, s)
            }
            pong(e, t, s) {
                if (this.readyState === _.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
                if (typeof e == "function" ? (s = e, e = t = void 0) : typeof t == "function" && (s = t, t = void 0), typeof e == "number" && (e = e.toString()), this.readyState !== _.OPEN) {
                    Ot(this, e, s);
                    return
                }
                t === void 0 && (t = !this._isServer), this._sender.pong(e || We, t, s)
            }
            resume() {
                this.readyState === _.CONNECTING || this.readyState === _.CLOSED || (this._paused = !1, this._receiver._writableState.needDrain || this._socket.resume())
            }
            send(e, t, s) {
                if (this.readyState === _.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
                if (typeof t == "function" && (s = t, t = {}), typeof e == "number" && (e = e.toString()), this.readyState !== _.OPEN) {
                    Ot(this, e, s);
                    return
                }
                let i = {
                    binary: typeof e != "string",
                    mask: !this._isServer,
                    compress: !0,
                    fin: !0,
                    ...t
                };
                this._extensions[H.extensionName] || (i.compress = !1), this._sender.send(e || We, i, s)
            }
            terminate() {
                if (this.readyState !== _.CLOSED) {
                    if (this.readyState === _.CONNECTING) {
                        let e = "WebSocket was closed before the connection was established";
                        return I(this, this._req, e)
                    }
                    this._socket && (this._readyState = _.CLOSING, this._socket.destroy())
                }
            }
        };
    Object.defineProperty(_, "CONNECTING", {
        enumerable: !0,
        value: W.indexOf("CONNECTING")
    });
    Object.defineProperty(_.prototype, "CONNECTING", {
        enumerable: !0,
        value: W.indexOf("CONNECTING")
    });
    Object.defineProperty(_, "OPEN", {
        enumerable: !0,
        value: W.indexOf("OPEN")
    });
    Object.defineProperty(_.prototype, "OPEN", {
        enumerable: !0,
        value: W.indexOf("OPEN")
    });
    Object.defineProperty(_, "CLOSING", {
        enumerable: !0,
        value: W.indexOf("CLOSING")
    });
    Object.defineProperty(_.prototype, "CLOSING", {
        enumerable: !0,
        value: W.indexOf("CLOSING")
    });
    Object.defineProperty(_, "CLOSED", {
        enumerable: !0,
        value: W.indexOf("CLOSED")
    });
    Object.defineProperty(_.prototype, "CLOSED", {
        enumerable: !0,
        value: W.indexOf("CLOSED")
    });
    ["binaryType", "bufferedAmount", "extensions", "isPaused", "protocol", "readyState", "url"].forEach(n => {
        Object.defineProperty(_.prototype, n, {
            enumerable: !0
        })
    });
    ["open", "error", "close", "message"].forEach(n => {
        Object.defineProperty(_.prototype, `on${n}`, {
            enumerable: !0,
            get() {
                for (let e of this.listeners(n))
                    if (e[Mt]) return e[Fn];
                return null
            },
            set(e) {
                for (let t of this.listeners(n))
                    if (t[Mt]) {
                        this.removeListener(n, t);
                        break
                    } typeof e == "function" && this.addEventListener(n, e, {
                        [Mt]: !0
                    })
            }
        })
    });
    _.prototype.addEventListener = Ln;
    _.prototype.removeEventListener = Nn;
    Oi.exports = _;

    function ki(n, e, t, s) {
        let i = {
            protocolVersion: Ft[1],
            maxPayload: 104857600,
            skipUTF8Validation: !1,
            perMessageDeflate: !0,
            followRedirects: !1,
            maxRedirects: 10,
            ...s,
            createConnection: void 0,
            socketPath: void 0,
            hostname: void 0,
            protocol: void 0,
            timeout: void 0,
            method: "GET",
            host: void 0,
            path: void 0,
            port: void 0
        };
        if (!Ft.includes(i.protocolVersion)) throw new RangeError(`Unsupported protocol version: ${i.protocolVersion} (supported versions: ${Ft.join(", ")})`);
        let r;
        if (e instanceof Rt) r = e, n._url = e.href;
        else {
            try {
                r = new Rt(e)
            } catch {
                throw new SyntaxError(`Invalid URL: ${e}`)
            }
            n._url = e
        }
        let o = r.protocol === "wss:",
            a = r.protocol === "ws+unix:",
            c;
        if (r.protocol !== "ws:" && !o && !a ? c = `The URL's protocol must be one of "ws:", "wss:", or "ws+unix:"` : a && !r.pathname ? c = "The URL's pathname is empty" : r.hash && (c = "The URL contains a fragment identifier"), c) {
            let f = new SyntaxError(c);
            if (n._redirects === 0) throw f;
            Ae(n, f);
            return
        }
        let l = o ? 443 : 80,
            d = Pn(16).toString("base64"),
            h = o ? En.request : Cn.request,
            p = new Set,
            g;
        if (i.createConnection = o ? qn : Un, i.defaultPort = i.defaultPort || l, i.port = r.port || l, i.host = r.hostname.startsWith("[") ? r.hostname.slice(1, -1) : r.hostname, i.headers = {
            ...i.headers,
            "Sec-WebSocket-Version": i.protocolVersion,
            "Sec-WebSocket-Key": d,
            Connection: "Upgrade",
            Upgrade: "websocket"
        }, i.path = r.pathname + r.search, i.timeout = i.handshakeTimeout, i.perMessageDeflate && (g = new H(i.perMessageDeflate !== !0 ? i.perMessageDeflate : {}, !1, i.maxPayload), i.headers["Sec-WebSocket-Extensions"] = Dn({
            [H.extensionName]: g.offer()
        })), t.length) {
            for (let f of t) {
                if (typeof f != "string" || !An.test(f) || p.has(f)) throw new SyntaxError("An invalid or duplicated subprotocol was specified");
                p.add(f)
            }
            i.headers["Sec-WebSocket-Protocol"] = t.join(",")
        }
        if (i.origin && (i.protocolVersion < 13 ? i.headers["Sec-WebSocket-Origin"] = i.origin : i.headers.Origin = i.origin), (r.username || r.password) && (i.auth = `${r.username}:${r.password}`), a) {
            let f = i.path.split(":");
            i.socketPath = f[0], i.path = f[1]
        }
        let u;
        if (i.followRedirects) {
            if (n._redirects === 0) {
                n._originalIpc = a, n._originalSecure = o, n._originalHostOrSocketPath = a ? i.socketPath : r.host;
                let f = s && s.headers;
                if (s = {
                    ...s,
                    headers: {}
                }, f)
                    for (let [v, T] of Object.entries(f)) s.headers[v.toLowerCase()] = T
            } else if (n.listenerCount("redirect") === 0) {
                let f = a ? n._originalIpc ? i.socketPath === n._originalHostOrSocketPath : !1 : n._originalIpc ? !1 : r.host === n._originalHostOrSocketPath;
                (!f || n._originalSecure && !o) && (delete i.headers.authorization, delete i.headers.cookie, f || delete i.headers.host, i.auth = void 0)
            }
            i.auth && !s.headers.authorization && (s.headers.authorization = "Basic " + Buffer.from(i.auth).toString("base64")), u = n._req = h(i), n._redirects && n.emit("redirect", n.url, u)
        } else u = n._req = h(i);
        i.timeout && u.on("timeout", () => {
            I(n, u, "Opening handshake has timed out")
        }), u.on("error", f => {
            u === null || u[Pi] || (u = n._req = null, Ae(n, f))
        }), u.on("response", f => {
            let v = f.headers.location,
                T = f.statusCode;
            if (v && i.followRedirects && T >= 300 && T < 400) {
                if (++n._redirects > i.maxRedirects) {
                    I(n, u, "Maximum redirects exceeded");
                    return
                }
                u.abort();
                let E;
                try {
                    E = new Rt(v, e)
                } catch {
                    let k = new SyntaxError(`Invalid URL: ${v}`);
                    Ae(n, k);
                    return
                }
                ki(n, E, t, s)
            } else n.emit("unexpected-response", u, f) || I(n, u, `Unexpected server response: ${f.statusCode}`)
        }), u.on("upgrade", (f, v, T) => {
            if (n.emit("upgrade", f), n.readyState !== _.CONNECTING) return;
            if (u = n._req = null, f.headers.upgrade.toLowerCase() !== "websocket") {
                I(n, v, "Invalid Upgrade header");
                return
            }
            let E = kn("sha1").update(d + Mn).digest("base64");
            if (f.headers["sec-websocket-accept"] !== E) {
                I(n, v, "Invalid Sec-WebSocket-Accept header");
                return
            }
            let R = f.headers["sec-websocket-protocol"],
                k;
            if (R !== void 0 ? p.size ? p.has(R) || (k = "Server sent an invalid subprotocol") : k = "Server sent a subprotocol but none was requested" : p.size && (k = "Server sent no subprotocol"), k) {
                I(n, v, k);
                return
            }
            R && (n._protocol = R);
            let zt = f.headers["sec-websocket-extensions"];
            if (zt !== void 0) {
                if (!g) {
                    I(n, v, "Server sent a Sec-WebSocket-Extensions header but no extension was requested");
                    return
                }
                let ct;
                try {
                    ct = jn(zt)
                } catch {
                    I(n, v, "Invalid Sec-WebSocket-Extensions header");
                    return
                }
                let Qt = Object.keys(ct);
                if (Qt.length !== 1 || Qt[0] !== H.extensionName) {
                    I(n, v, "Server indicated an extension that was not requested");
                    return
                }
                try {
                    g.accept(ct[H.extensionName])
                } catch {
                    I(n, v, "Invalid Sec-WebSocket-Extensions header");
                    return
                }
                n._extensions[H.extensionName] = g
            }
            n.setSocket(v, T, {
                generateMask: i.generateMask,
                maxPayload: i.maxPayload,
                skipUTF8Validation: i.skipUTF8Validation
            })
        }), u.end()
    }

    function Ae(n, e) {
        n._readyState = _.CLOSING, n.emit("error", e), n.emitClose()
    }

    function Un(n) {
        return n.path = n.socketPath, Ci.connect(n)
    }

    function qn(n) {
        return n.path = void 0, !n.servername && n.servername !== "" && (n.servername = Ci.isIP(n.host) ? "" : n.host), xn.connect(n)
    }

    function I(n, e, t) {
        n._readyState = _.CLOSING;
        let s = new Error(t);
        Error.captureStackTrace(s, I), e.setHeader ? (e[Pi] = !0, e.abort(), e.socket && !e.socket.destroyed && e.socket.destroy(), process.nextTick(Ae, n, s)) : (e.destroy(s), e.once("error", n.emit.bind(n, "error")), e.once("close", n.emitClose.bind(n)))
    }

    function Ot(n, e, t) {
        if (e) {
            let s = Bn(e).length;
            n._socket ? n._sender._bufferedBytes += s : n._bufferedAmount += s
        }
        if (t) {
            let s = new Error(`WebSocket is not open: readyState ${n.readyState} (${W[n.readyState]})`);
            t(s)
        }
    }

    function Vn(n, e) {
        let t = this[C];
        t._closeFrameReceived = !0, t._closeMessage = e, t._closeCode = n, t._socket[C] !== void 0 && (t._socket.removeListener("data", Ue), process.nextTick(Ii, t._socket), n === 1005 ? t.close() : t.close(n, e))
    }

    function Hn() {
        let n = this[C];
        n.isPaused || n._socket.resume()
    }

    function Gn(n) {
        let e = this[C];
        e._socket[C] !== void 0 && (e._socket.removeListener("data", Ue), process.nextTick(Ii, e._socket), e.close(n[On])), e.emit("error", n)
    }

    function Ei() {
        this[C].emitClose()
    }

    function $n(n, e) {
        this[C].emit("message", n, e)
    }

    function Jn(n) {
        let e = this[C];
        e.pong(n, !e._isServer, xi), e.emit("ping", n)
    }

    function zn(n) {
        this[C].emit("pong", n)
    }

    function Ii(n) {
        n.resume()
    }

    function Ri() {
        let n = this[C];
        this.removeListener("close", Ri), this.removeListener("data", Ue), this.removeListener("end", Mi), n._readyState = _.CLOSING;
        let e;
        !this._readableState.endEmitted && !n._closeFrameReceived && !n._receiver._writableState.errorEmitted && (e = n._socket.read()) !== null && n._receiver.write(e), n._receiver.end(), this[C] = void 0, clearTimeout(n._closeTimer), n._receiver._writableState.finished || n._receiver._writableState.errorEmitted ? n.emitClose() : (n._receiver.on("error", Ei), n._receiver.on("finish", Ei))
    }

    function Ue(n) {
        this[C]._receiver.write(n) || this.pause()
    }

    function Mi() {
        let n = this[C];
        n._readyState = _.CLOSING, n._receiver.end(), this.end()
    }

    function Fi() {
        let n = this[C];
        this.removeListener("error", Fi), this.on("error", xi), n && (n._readyState = _.CLOSING, this.destroy())
    }
});
var Ni = y((ra, Li) => {
    "use strict";
    var {
        tokenChars: Qn
    } = ye();

    function Kn(n) {
        let e = new Set,
            t = -1,
            s = -1,
            i = 0;
        for (i; i < n.length; i++) {
            let o = n.charCodeAt(i);
            if (s === -1 && Qn[o] === 1) t === -1 && (t = i);
            else if (i !== 0 && (o === 32 || o === 9)) s === -1 && t !== -1 && (s = i);
            else if (o === 44) {
                if (t === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
                s === -1 && (s = i);
                let a = n.slice(t, s);
                if (e.has(a)) throw new SyntaxError(`The "${a}" subprotocol is duplicated`);
                e.add(a), t = s = -1
            } else throw new SyntaxError(`Unexpected character at index ${i}`)
        }
        if (t === -1 || s !== -1) throw new SyntaxError("Unexpected end of input");
        let r = n.slice(t, i);
        if (e.has(r)) throw new SyntaxError(`The "${r}" subprotocol is duplicated`);
        return e.add(r), e
    }
    Li.exports = {
        parse: Kn
    }
});
var qi = y((ca, Ui) => {
    "use strict";
    var Zn = require("events"),
        qe = require("http"),
        na = require("https"),
        oa = require("net"),
        aa = require("tls"),
        {
            createHash: Yn
        } = require("crypto"),
        Di = It(),
        z = Te(),
        Xn = Ni(),
        eo = Lt(),
        {
            GUID: to,
            kWebSocket: so
        } = q(),
        io = /^[+/0-9A-Za-z]{22}==$/,
        ji = 0,
        Bi = 1,
        Ai = 2,
        Nt = class extends Zn {
            constructor(e, t) {
                if (super(), e = {
                    maxPayload: 100 * 1024 * 1024,
                    skipUTF8Validation: !1,
                    perMessageDeflate: !1,
                    handleProtocols: null,
                    clientTracking: !0,
                    verifyClient: null,
                    noServer: !1,
                    backlog: null,
                    server: null,
                    host: null,
                    path: null,
                    port: null,
                    WebSocket: eo,
                    ...e
                }, e.port == null && !e.server && !e.noServer || e.port != null && (e.server || e.noServer) || e.server && e.noServer) throw new TypeError('One and only one of the "port", "server", or "noServer" options must be specified');
                if (e.port != null ? (this._server = qe.createServer((s, i) => {
                    let r = qe.STATUS_CODES[426];
                    i.writeHead(426, {
                        "Content-Length": r.length,
                        "Content-Type": "text/plain"
                    }), i.end(r)
                }), this._server.listen(e.port, e.host, e.backlog, t)) : e.server && (this._server = e.server), this._server) {
                    let s = this.emit.bind(this, "connection");
                    this._removeListeners = ro(this._server, {
                        listening: this.emit.bind(this, "listening"),
                        error: this.emit.bind(this, "error"),
                        upgrade: (i, r, o) => {
                            this.handleUpgrade(i, r, o, s)
                        }
                    })
                }
                e.perMessageDeflate === !0 && (e.perMessageDeflate = {}), e.clientTracking && (this.clients = new Set, this._shouldEmitClose = !1), this.options = e, this._state = ji
            }
            address() {
                if (this.options.noServer) throw new Error('The server is operating in "noServer" mode');
                return this._server ? this._server.address() : null
            }
            close(e) {
                if (this._state === Ai) {
                    e && this.once("close", () => {
                        e(new Error("The server is not running"))
                    }), process.nextTick(Ce, this);
                    return
                }
                if (e && this.once("close", e), this._state !== Bi)
                    if (this._state = Bi, this.options.noServer || this.options.server) this._server && (this._removeListeners(), this._removeListeners = this._server = null), this.clients ? this.clients.size ? this._shouldEmitClose = !0 : process.nextTick(Ce, this) : process.nextTick(Ce, this);
                    else {
                        let t = this._server;
                        this._removeListeners(), this._removeListeners = this._server = null, t.close(() => {
                            Ce(this)
                        })
                    }
            }
            shouldHandle(e) {
                if (this.options.path) {
                    let t = e.url.indexOf("?");
                    if ((t !== -1 ? e.url.slice(0, t) : e.url) !== this.options.path) return !1
                }
                return !0
            }
            handleUpgrade(e, t, s, i) {
                t.on("error", Wi);
                let r = e.headers["sec-websocket-key"],
                    o = +e.headers["sec-websocket-version"];
                if (e.method !== "GET") {
                    Q(this, e, t, 405, "Invalid HTTP method");
                    return
                }
                if (e.headers.upgrade.toLowerCase() !== "websocket") {
                    Q(this, e, t, 400, "Invalid Upgrade header");
                    return
                }
                if (!r || !io.test(r)) {
                    Q(this, e, t, 400, "Missing or invalid Sec-WebSocket-Key header");
                    return
                }
                if (o !== 8 && o !== 13) {
                    Q(this, e, t, 400, "Missing or invalid Sec-WebSocket-Version header");
                    return
                }
                if (!this.shouldHandle(e)) {
                    xe(t, 400);
                    return
                }
                let a = e.headers["sec-websocket-protocol"],
                    c = new Set;
                if (a !== void 0) try {
                    c = Xn.parse(a)
                } catch {
                    Q(this, e, t, 400, "Invalid Sec-WebSocket-Protocol header");
                    return
                }
                let l = e.headers["sec-websocket-extensions"],
                    d = {};
                if (this.options.perMessageDeflate && l !== void 0) {
                    let h = new z(this.options.perMessageDeflate, !0, this.options.maxPayload);
                    try {
                        let p = Di.parse(l);
                        p[z.extensionName] && (h.accept(p[z.extensionName]), d[z.extensionName] = h)
                    } catch {
                        Q(this, e, t, 400, "Invalid or unacceptable Sec-WebSocket-Extensions header");
                        return
                    }
                }
                if (this.options.verifyClient) {
                    let h = {
                        origin: e.headers[`${o === 8 ? "sec-websocket-origin" : "origin"}`],
                        secure: !!(e.socket.authorized || e.socket.encrypted),
                        req: e
                    };
                    if (this.options.verifyClient.length === 2) {
                        this.options.verifyClient(h, (p, g, u, f) => {
                            if (!p) return xe(t, g || 401, u, f);
                            this.completeUpgrade(d, r, c, e, t, s, i)
                        });
                        return
                    }
                    if (!this.options.verifyClient(h)) return xe(t, 401)
                }
                this.completeUpgrade(d, r, c, e, t, s, i)
            }
            completeUpgrade(e, t, s, i, r, o, a) {
                if (!r.readable || !r.writable) return r.destroy();
                if (r[so]) throw new Error("server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration");
                if (this._state > ji) return xe(r, 503);
                let l = ["HTTP/1.1 101 Switching Protocols", "Upgrade: websocket", "Connection: Upgrade", `Sec-WebSocket-Accept: ${Yn("sha1").update(t + to).digest("base64")}`],
                    d = new this.options.WebSocket(null);
                if (s.size) {
                    let h = this.options.handleProtocols ? this.options.handleProtocols(s, i) : s.values().next().value;
                    h && (l.push(`Sec-WebSocket-Protocol: ${h}`), d._protocol = h)
                }
                if (e[z.extensionName]) {
                    let h = e[z.extensionName].params,
                        p = Di.format({
                            [z.extensionName]: [h]
                        });
                    l.push(`Sec-WebSocket-Extensions: ${p}`), d._extensions = e
                }
                this.emit("headers", l, i), r.write(l.concat(`\r
`).join(`\r
`)), r.removeListener("error", Wi), d.setSocket(r, o, {
                    maxPayload: this.options.maxPayload,
                    skipUTF8Validation: this.options.skipUTF8Validation
                }), this.clients && (this.clients.add(d), d.on("close", () => {
                    this.clients.delete(d), this._shouldEmitClose && !this.clients.size && process.nextTick(Ce, this)
                })), a(d, i)
            }
        };
    Ui.exports = Nt;

    function ro(n, e) {
        for (let t of Object.keys(e)) n.on(t, e[t]);
        return function () {
            for (let s of Object.keys(e)) n.removeListener(s, e[s])
        }
    }

    function Ce(n) {
        n._state = Ai, n.emit("close")
    }

    function Wi() {
        this.destroy()
    }

    function xe(n, e, t, s) {
        t = t || qe.STATUS_CODES[e], s = {
            Connection: "close",
            "Content-Type": "text/html",
            "Content-Length": Buffer.byteLength(t),
            ...s
        }, n.once("finish", n.destroy), n.end(`HTTP/1.1 ${e} ${qe.STATUS_CODES[e]}\r
` + Object.keys(s).map(i => `${i}: ${s[i]}`).join(`\r
`) + `\r
\r
` + t)
    }

    function Q(n, e, t, s, i) {
        if (n.listenerCount("wsClientError")) {
            let r = new Error(i);
            Error.captureStackTrace(r, Q), n.emit("wsClientError", r, t, e)
        } else xe(t, s, i)
    }
});
var bo = {};
hr(bo, {
    Extension: () => at,
    activate: () => yo
});
module.exports = ur(bo);
var ot = m(require("path")),
    rr = m(ss());
var b = require("./babelBundle");
var is = ["toBeChecked", "toBeDisabled", "toBeEditable", "toBeEmpty", "toBeEnabled", "toBeFocused", "toBeHidden", "toContainText", "toHaveAttribute", "toHaveClass", "toHaveCount", "toHaveCSS", "toHaveId", "toHaveJSProperty", "toHaveText", "toHaveValue", "toBeVisible"],
    rs = ["check", "click", "dblclick", "dragAndDrop", "fill", "focus", "getAttribute", "hover", "innerHTML", "innerText", "inputValue", "isChecked", "isDisabled", "isEditable", "isEnabled", "isHidden", "isVisible", "press", "selectOption", "setChecked", "setInputFiles", "tap", "textContent", "type", "uncheck"],
    ns = ["locator", "getByAltText", "getByLabel", "getByPlaceholder", "getByRole", "getByTestId", "getByText", "getByTitle", "first", "last", "and", "or", "nth", "filter"],
    os = /\.\s*(check|click|fill|type|locator|getBy[\w]+|first|last|nth|filter)\(/;

function as(n) {
    return n.replace(/\.\s*(?:check|click|fill|type)\(([^,]+)(?:,\s*{.*})\)/, ".locator($1)")
}
var he = new Map;

function cs(n) {
    let e = new Set(n);
    for (let t of he.keys()) e.has(t) || he.delete(t)
}

function dt(n, e, t, s) {
    let i = he.get(t),
        r = i == null ? void 0 : i.ast;
    if (!i || i.text !== n) try {
        r = (0, b.parse)(n, {
            errorRecovery: !0,
            plugins: ["typescript", "jsx"],
            sourceType: "module"
        }), he.set(t, {
            text: n,
            ast: r
        })
    } catch {
        he.set(t, {
            text: n,
            ast: void 0
        })
    }
    if (!r) return;
    let o, a;
    return (0, b.traverse)(r, {
        enter(c) {
            let l, d, h;
            if (b.t.isCallExpression(c.node) && b.t.isMemberExpression(c.node.callee) && b.t.isIdentifier(c.node.callee.object) && b.t.isIdentifier(c.node.callee.property) && e.pages.includes(c.node.callee.object.name) && rs.includes(c.node.callee.property.name) && (l = c.node, d = c.node.arguments[0], h = c.node.callee.object.name), b.t.isIdentifier(c.node) && e.locators.includes(c.node.name) && (l = c.node), b.t.isMemberExpression(c.node) && b.t.isIdentifier(c.node.property) && is.includes(c.node.property.name) && b.t.isCallExpression(c.node.object) && b.t.isIdentifier(c.node.object.callee) && c.node.object.callee.name === "expect" && (l = c.node.object.arguments[0]), b.t.isCallExpression(c.node) && b.t.isMemberExpression(c.node.callee) && b.t.isIdentifier(c.node.callee.property) && ns.includes(c.node.callee.property.name) && (l = c.node), !l || !l.loc) return;
            let p = Tr(l.loc, s),
                g = l.loc.start.line === s.line;
            if (p || g) {
                let u;
                d ? u = `${h}.locator(${n.substring(d.start, d.end)})` : u = n.substring(l.start, l.end), p && (!o || u.length < o.length) && (o = u), g && (!a || a.length < u.length) && (a = u)
            }
        }
    }), o || a
}

function Tr(n, e) {
    return !(e.line < n.start.line || e.line > n.end.line || e.line === n.start.line && e.column < n.start.column || e.line === n.end.line && e.column > n.end.column)
}
var Z = "Playwright Test";
var Me = class {
    constructor(e, t) {
        this._debugSessions = new Map;
        this._disposables = [];
        this._reusedBrowser = t, this._onErrorInDebuggerEmitter = new e.EventEmitter, this.onErrorInDebugger = this._onErrorInDebuggerEmitter.event, this._onStdOutEmitter = new e.EventEmitter, this.onStdOut = this._onStdOutEmitter.event;
        let s = this;
        this._disposables = [e.debug.onDidStartDebugSession(i => {
            ls(i) && this._debugSessions.set(i.id, i)
        }), e.debug.onDidTerminateDebugSession(i => {
            this._debugSessions.delete(i.id), s._hideHighlight()
        }), e.languages.registerHoverProvider("typescript", {
            provideHover(i, r, o) {
                return s._highlightLocator(i, r, o).catch(), null
            }
        }), e.languages.registerHoverProvider("javascript", {
            provideHover(i, r, o) {
                return s._highlightLocator(i, r, o).catch(), null
            }
        }), e.window.onDidChangeTextEditorSelection(i => {
            s._highlightLocator(i.textEditor.document, i.selections[0].start).catch()
        }), e.window.onDidChangeVisibleTextEditors(i => {
            Cr(e.window.visibleTextEditors.map(r => r.document.fileName))
        }), e.debug.registerDebugAdapterTrackerFactory("*", {
            createDebugAdapterTracker(i) {
                if (!ls(i)) return {};
                let r;
                return {
                    onDidSendMessage: async o => {
                        if (o.type === "event" && o.event === "output" && o.body.category === "stdout") {
                            let a = o.body.output;
                            s._onStdOutEmitter.fire(a)
                        }
                        if (!!o.success) {
                            if (o.command === "scopes" && o.type === "response") {
                                let a = o.body.scopes.find(c => c.name === "Catch Block");
                                a && (r = {
                                    file: a.source.path,
                                    line: a.line,
                                    column: a.column
                                })
                            }
                            if (o.command === "variables" && o.type === "response") {
                                let a = o.body.variables.find(c => c.name === "playwrightError" && c.type && c.type.toLowerCase() === "error");
                                if (a && r) {
                                    let c = a.value;
                                    s._onErrorInDebuggerEmitter.fire({
                                        error: c.replace(/\\n/g, `
`),
                                        location: r
                                    })
                                }
                            }
                        }
                    }
                }
            }
        })]
    }
    async _highlightLocator(e, t, s) {
        if (!this._reusedBrowser.pageCount()) return;
        let i = await wr(this._debugSessions, e, t, s);
        i ? this._reusedBrowser.highlight(i) : this._hideHighlight()
    }
    _hideHighlight() {
        this._reusedBrowser.hideHighlight()
    }
    dispose() {
        var e;
        for (let t of this._disposables) (e = t == null ? void 0 : t.dispose) == null || e.call(t);
        this._disposables = []
    }
},
    yr = new Set;
async function wr(n, e, t, s) {
    let i = e.uri.fsPath;
    if (!n.size) {
        let r = e.getText();
        if (!e.lineAt(t.line).text.match(os)) return;
        let a = dt(r, {
            pages: [],
            locators: []
        }, i, {
            line: t.line + 1,
            column: t.character + 1
        });
        a = a == null ? void 0 : a.replace(/^component\s*\./, "page.locator('#root').locator('internal:control=component')."), a = a == null ? void 0 : a.replace(/this\._?page\s*\./, "page."), a = a ? as(a) : void 0;
        let c = a == null ? void 0 : a.match(/^page\s*\.([\s\S]*)/m);
        return c ? c[1] : void 0
    }
    for (let r of n.values()) {
        if (s != null && s.isCancellationRequested) return;
        let o = await Sr(r, void 0);
        if (!!o)
            for (let a of o) {
                if (!a.source) continue;
                let c = xr(a.source.path);
                if (!c || e.uri.fsPath !== c) continue;
                if (s != null && s.isCancellationRequested) return;
                let l = await br(r, a),
                    d = e.getText(),
                    h = dt(d, l, i, {
                        line: t.line + 1,
                        column: t.character + 1
                    });
                if (!h) continue;
                if (s != null && s.isCancellationRequested) return;
                let p = await Er(r, a.id, h);
                if (p) return p
            }
    }
}
async function Sr(n, e) {
    let {
        threads: t
    } = await n.customRequest("threads").then(s => s, () => ({
        threads: []
    }));
    for (let s of t)
        if (!(e !== void 0 && s.id !== e)) try {
            let {
                stackFrames: i
            } = await n.customRequest("stackTrace", {
                threadId: s.id
            }).then(r => r, () => ({
                stackFrames: []
            }));
            return i
        } catch {
            continue
        }
}
async function br(n, e) {
    let t = [],
        s = [],
        {
            scopes: i
        } = await n.customRequest("scopes", {
            frameId: e.id
        }).then(r => r, () => ({
            scopes: []
        }));
    for (let r of i) {
        if (r.name === "Global") continue;
        let {
            variables: o
        } = await n.customRequest("variables", {
            variablesReference: r.variablesReference,
            filter: "names"
        }).then(a => a, () => ({
            variables: []
        }));
        for (let a of o) a.value.startsWith("Page ") && t.push(a.name), a.value.startsWith("Locator ") && s.push(a.name)
    }
    return {
        pages: t,
        locators: s
    }
}
async function Er(n, e, t) {
    let s = `(${t})._selector`,
        r = `eval(Buffer.from("${Buffer.from(s).toString("base64")}", "base64").toString())`;
    return yr.add(n), await n.customRequest("evaluate", {
        expression: r,
        frameId: e
    }).then(o => o.result.startsWith("'") && o.result.endsWith("'") ? o.result.substring(1, o.result.length - 1) : o.result, () => { })
}

function Cr(n) {
    cs(n)
}

function ls(n) {
    let e = n;
    for (; e.parentSession;) e = e.parentSession;
    return e.name === Z
}

function xr(n) {
    if (!!n) {
        if (n.startsWith("vscode-remote://")) {
            let e = decodeURIComponent(n.substring(16)),
                t = e.indexOf("/");
            return e.slice(t, e.length)
        }
        return n
    }
}
var ht = m(require("path")),
    us = m(require("fs")),
    ps = m(require("os"));
async function fs(n) {
    let [e] = n.workspace.workspaceFolders || [];
    if (!e) {
        await n.window.showErrorMessage("Please open a folder in VS Code to initialize Playwright. Either an empty folder or a folder with an existing package.json.");
        return
    }
    let t = [];
    t.push({
        label: "Select browsers to install",
        kind: n.QuickPickItemKind.Separator
    }), t.push(ue, pe, fe), t.push({
        label: "",
        kind: n.QuickPickItemKind.Separator
    }), t.push(hs), t.push(ds), process.platform === "linux" && (gs(), t.push(Y));
    let s = await n.window.showQuickPick(t, {
        title: "Install Playwright",
        canPickMany: !0
    });
    if (s === void 0) return;
    let i = n.window.createTerminal({
        name: "Install Playwright",
        cwd: e.uri.fsPath,
        env: process.env
    });
    i.show();
    let r = [];
    s.includes(ue) && r.push("--browser=chromium"), s.includes(pe) && r.push("--browser=firefox"), s.includes(fe) && r.push("--browser=webkit"), !s.includes(ue) && !s.includes(pe) && !s.includes(fe) && r.push("--no-browsers"), s.includes(hs) && r.push("--lang=js"), s.includes(ds) && r.push("--gha"), s.includes(Y) && r.push("--install-deps"), i.sendText(`npm init playwright@latest --yes -- --quiet ${r.join(" ")}`, !0)
}
async function Fe(n, e) {
    let t = [];
    t.push({
        label: "Select browsers to install",
        kind: n.QuickPickItemKind.Separator
    }), t.push(ue, pe, fe), t.push({
        label: "",
        kind: n.QuickPickItemKind.Separator
    }), process.platform === "linux" && (gs(), t.push(Y));
    let s = await n.window.showQuickPick(t, {
        title: `Install browsers for Playwright v${e.config.version}:`,
        canPickMany: !0
    });
    if (!(s != null && s.length)) return;
    let i = n.window.createTerminal({
        name: "Install Playwright",
        cwd: e.config.workspaceFolder,
        env: process.env
    });
    i.show();
    let r = [],
        o = s.includes(Y) ? "install --with-deps" : "install";
    s.includes(ue) && r.push("chromium"), s.includes(pe) && r.push("firefox"), s.includes(fe) && r.push("webkit"), r.length ? i.sendText(`npx playwright ${o} ${r.join(" ")}`, !0) : s.includes(Y) && i.sendText("npx playwright install-deps", !0)
}
var ue = {
    label: "Chromium",
    picked: !0,
    description: "\u2014 powers Google Chrome, Microsoft Edge, etc\u2026"
},
    pe = {
        label: "Firefox",
        picked: !0,
        description: "\u2014 powers Mozilla Firefox"
    },
    fe = {
        label: "WebKit",
        picked: !0,
        description: "\u2014 powers  Apple Safari"
    },
    ds = {
        label: "Add GitHub Actions workflow",
        picked: !0,
        description: "\u2014 adds GitHub Actions recipe"
    },
    hs = {
        label: "Use JavaScript",
        picked: !1,
        description: "\u2014 use JavaScript (TypeScript is the default)"
    },
    Y = {
        label: "Install Linux dependencies",
        picked: !1
    };

function gs() {
    Y.picked = process.platform === "linux" && !us.default.existsSync(ht.default.join(process.env.XDG_CACHE_HOME || ht.default.join(ps.default.homedir(), ".cache"), "ms-playwright"))
}
var gt = require("child_process"),
    Bs = m(require("crypto")),
    pt = m(require("fs")),
    G = m(require("path")),
    Ws = m(require("readline")),
    ft = m(js());

function te() {
    return Bs.default.randomBytes(16).toString("hex")
}

function _t(n) {
    let e = !1,
        t = !1,
        s = [];
    for (let i = 0; i < n.length; ++i) {
        let r = n.charAt(i);
        if (r === "\x1B") {
            t = !0;
            let o = n.indexOf("m", i + 1),
                a = n.substring(i + 1, o);
            if (!a.match(/\[\d+/)) continue;
            switch (e && (s.push("</span>"), e = !1), a) {
                case "[2": {
                    s.push("<span style='color:#666;'>"), e = !0;
                    break
                }
                case "[22":
                    break;
                case "[31": {
                    s.push("<span style='color:#f14c4c;'>"), e = !0;
                    break
                }
                case "[32": {
                    s.push("<span style='color:#73c991;'>"), e = !0;
                    break
                }
                case "[39":
                    break
            }
            i = o
        } else r === `
` ? s.push(`
<br>
`) : r === " " ? s.push("&nbsp;") : s.push($r(r))
    }
    return t && s.push(`
</span></br>`), s.join("")
}

function $r(n) {
    return n.replace(/[&"<>]/g, e => ({
        "&": "&amp;",
        '"': "&quot;",
        "<": "<b>&lt;</b>",
        ">": "<b>&gt;</b>"
    })[e])
}
async function Jr(n, e, t, s) {
    let i = (0, gt.spawn)(n, e, {
        stdio: "pipe",
        cwd: t,
        env: {
            ...process.env,
            ...s
        }
    }),
        r = "";
    return i.stdout.on("data", o => r += o.toString()), new Promise((o, a) => {
        i.on("error", c => a(c)), i.on("exit", () => o(r))
    })
}
async function As(n, e, t) {
    if (!n.endsWith(".js")) return [n];
    let s = e.get(n);
    if (s) return s;
    let i = Ws.default.createInterface({
        input: pt.default.createReadStream(n),
        crlfDelay: 1 / 0
    }),
        r;
    if (i.on("line", o => {
        r = o
    }), await new Promise(o => i.on("close", o)), r != null && r.startsWith("//# sourceMappingURL=")) {
        let o = G.default.resolve(G.default.dirname(n), r.substring(21));
        try {
            let a = await pt.default.promises.readFile(o, "utf-8"),
                l = JSON.parse(a).sources.map(d => {
                    let h = G.default.resolve(G.default.dirname(o), d);
                    return t.set(h, n), h
                });
            return e.set(n, l), l
        } catch { }
    }
    return e.set(n, [n]), [n]
}
var ge = class extends Error { },
    ut;
async function $(n, e) {
    if (ut) return ut;
    let t = await (0, ft.default)("node").catch(s => { });
    for (let s = 0; s < 5 && !t; ++s) await new Promise(i => setTimeout(i, 200)), t = await (0, ft.default)("node").catch(i => { });
    if (t != null || (t = await zr(n, e)), !t) throw new ge(`Unable to find 'node' executable.
Make sure to have Node.js installed and available in your PATH.
Current PATH: '${process.env.PATH}'.`);
    return ut = t, t
}
async function zr(n, e) {
    if (process.platform !== "win32") return new Promise(t => {
        let s = "___START_PW_SHELL__",
            i = "___END_PW_SHELL__",
            r = (0, gt.spawn)(`${n.env.shell} -i -c 'echo ${s} && which node && echo ${i}'`, {
                stdio: "pipe",
                shell: !0,
                cwd: e
            }),
            o = "";
        r.stdout.on("data", a => o += a.toString()), r.on("error", () => t(void 0)), r.on("exit", a => {
            if (a !== 0) return t(void 0);
            let c = o.indexOf(s),
                l = o.indexOf(i);
            return t(c === -1 || l === -1 ? void 0 : o.substring(c + s.length, l).trim())
        })
    })
}

function x(n) {
    return n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
var Oe = process.platform === "win32" ? ";" : ":";
async function mt(n, e, t, s) {
    return await Jr(await $(n, t), e, t, s)
}
async function Us(n, e, t, s) {
    let i = await mt(n, [require.resolve("./playwrightFinder")], G.default.dirname(t), s),
        {
            version: r,
            cli: o,
            error: a
        } = JSON.parse(i);
    if (a) throw new Error(a);
    let c = o;
    return o.includes("/playwright/packages/playwright-test/") && t.includes("playwright-test") && (c = G.default.join(e, "tests/playwright-test/stable-test-runner/node_modules/@playwright/test/cli.js")), {
        cli: c,
        version: r
    }
}
var Ji = m(require("path")),
    Wt = m(require("fs"));
var Hi = require("child_process");
var Gi = m(require("events"));
var no = m(Gs(), 1),
    oo = m(xt(), 1),
    ao = m(Pt(), 1),
    Vi = m(Lt(), 1),
    Dt = m(qi(), 1);
var D = Vi.default;
var ne = class {
    static async connect(e, t = {}) {
        let s = new ne(e, t);
        return await new Promise((i, r) => {
            s._ws.addEventListener("open", async () => {
                i(s)
            }), s._ws.addEventListener("error", o => {
                r(new Error("WebSocket error: " + o.message)), s._ws.close()
            })
        }), s
    }
    constructor(e, t = {}) {
        this.wsEndpoint = e, this._ws = new D(e, [], {
            perMessageDeflate: !1,
            maxPayload: 256 * 1024 * 1024,
            handshakeTimeout: 3e4,
            headers: t
        }), this._ws.addEventListener("message", s => {
            try {
                this.onmessage && this.onmessage.call(null, JSON.parse(s.data.toString()))
            } catch {
                this._ws.close()
            }
        }), this._ws.addEventListener("close", s => {
            this.onclose && this.onclose.call(null)
        }), this._ws.addEventListener("error", () => { })
    }
    isClosed() {
        return this._ws.readyState === D.CLOSING || this._ws.readyState === D.CLOSED
    }
    send(e) {
        this._ws.send(JSON.stringify(e))
    }
    close() {
        this._ws.close()
    }
    async closeAndWait() {
        let e = new Promise(t => this._ws.once("close", t));
        this.close(), await e
    }
};
var Ve = class {
    constructor(e, t, s) {
        this._vscode = e, this._clientFactory = t, this._options = s
    }
    async startAndConnect() {
        let e = this._clientFactory(),
            t = await jt(this._vscode, {
                ...this._options,
                onError: s => e._onErrorEvent.fire(s),
                onClose: () => e._onCloseEvent.fire()
            });
        return t ? (await e._connect(t), e) : null
    }
},
    Bt = class extends Gi.default {
        constructor(t) {
            super();
            this.vscode = t;
            this._callbacks = new Map;
            this._onCloseEvent = new t.EventEmitter, this.onClose = this._onCloseEvent.event, this._onErrorEvent = new t.EventEmitter, this.onError = this._onErrorEvent.event
        }
        rewriteWsEndpoint(t) {
            return t
        }
        rewriteWsHeaders(t) {
            return t
        }
        async _connect(t) {
            this.wsEndpoint = t, this._transport = await ne.connect(this.rewriteWsEndpoint(t), this.rewriteWsHeaders({})), this._transport.onmessage = s => {
                var r, o;
                if (!s.id) {
                    this.emit(s.method, s.params);
                    return
                }
                let i = this._callbacks.get(s.id);
                if (!!i)
                    if (this._callbacks.delete(s.id), s.error) {
                        let a = new Error(((r = s.error.error) == null ? void 0 : r.message) || s.error.value);
                        a.stack = (o = s.error.error) == null ? void 0 : o.stack, i.reject(a)
                    } else i.fulfill(s.result)
            }, await this.initialize()
        }
        async initialize() { }
        requestGracefulTermination() { }
        send(t, s = {}) {
            return new Promise((i, r) => {
                let o = ++Bt._lastId,
                    a = {
                        id: o,
                        guid: "DebugController",
                        method: t,
                        params: s,
                        metadata: {}
                    };
                this._transport.send(a), this._callbacks.set(o, {
                    fulfill: i,
                    reject: r
                })
            })
        }
        close() {
            this._transport.close()
        }
    },
    Pe = Bt;
Pe._lastId = 0;
async function jt(n, e) {
    var i;
    let t = await $(n, e.cwd),
        s = (0, Hi.spawn)(t, e.args, {
            cwd: e.cwd,
            stdio: "pipe",
            env: {
                ...process.env,
                ...e.envProvider()
            }
        });
    return (i = s.stderr) == null || i.on("data", r => {
        e.dumpIO && console.log("[server err]", r.toString())
    }), s.on("error", e.onError), s.on("close", e.onClose), new Promise(r => {
        var o;
        (o = s.stdout) == null || o.on("data", async a => {
            e.dumpIO && console.log("[server out]", a.toString());
            let c = a.toString().match(/Listening on (.*)/);
            if (!c) return;
            let l = c[1];
            r(l)
        }), s.on("exit", () => r(null))
    })
}
var He = class {
    constructor(e, t, s) {
        this._isRunningTests = !1;
        this._insertedEditActionCount = 0;
        this._disposables = [];
        this._pageCount = 0;
        this._editOperations = Promise.resolve();
        this._pausedOnPagePause = !1;
        this._vscode = e, this._envProvider = s, this._onPageCountChangedEvent = new e.EventEmitter, this.onPageCountChanged = this._onPageCountChangedEvent.event, this._onRunningTestsChangedEvent = new e.EventEmitter, this.onRunningTestsChanged = this._onRunningTestsChangedEvent.event, this._onHighlightRequestedForTestEvent = new e.EventEmitter, this.onHighlightRequestedForTest = this._onHighlightRequestedForTestEvent.event, this._settingsModel = t, this._disposables.push(t.showBrowser.onChange(i => {
            i || this.closeAllBrowsers()
        }))
    }
    dispose() {
        this._stop();
        for (let e of this._disposables) e.dispose();
        this._disposables = []
    }
    async _startBackendIfNeeded(e) {
        if (this._backend) {
            this._resetNoWait();
            return
        }
        let t = [e.cli, "run-server", `--path=/${te()}`],
            s = e.workspaceFolder,
            i = () => ({
                ...this._envProvider(),
                PW_CODEGEN_NO_INSPECTOR: "1",
                PW_EXTENSION_MODE: "1"
            }),
            o = await new Ve(this._vscode, () => new At(this._vscode), {
                args: t,
                cwd: s,
                envProvider: i
            }).startAndConnect();
        !o || (o.onClose(() => {
            o === this._backend && (this._backend = void 0, this._resetNoWait())
        }), o.onError(a => {
            o === this._backend && (this._vscode.window.showErrorMessage(a.message), this._backend = void 0, this._resetNoWait())
        }), this._backend = o, this._backend.on("inspectRequested", a => {
            var c;
            this._updateOrCancelInspecting || this._showInspectingBox(), (c = this._updateOrCancelInspecting) == null || c.call(this, {
                selector: a.locator || a.selector
            })
        }), this._backend.on("setModeRequested", a => {
            a.mode === "standby" && this._resetNoWait()
        }), this._backend.on("paused", async a => {
            var c;
            !this._pausedOnPagePause && a.paused && (this._pausedOnPagePause = !0, await this._vscode.window.showInformationMessage("Paused", {
                modal: !1
            }, "Resume"), this._pausedOnPagePause = !1, (c = this._backend) == null || c.resumeNoWait())
        }), this._backend.on("stateChanged", a => {
            this._pageCountChanged(a.pageCount)
        }), this._backend.on("sourceChanged", async a => {
            this._scheduleEdit(async () => {
                var l;
                if (!this._editor || !a.actions || !a.actions.length) return;
                let c = co(this._editor);
                if (a.actions.length > 1 && ((l = a.actions) == null ? void 0 : l.length) > this._insertedEditActionCount) {
                    let d = new this._vscode.Range(this._editor.selection.end, this._editor.selection.end);
                    await this._editor.edit(async h => {
                        h.replace(d, `
` + " ".repeat(c))
                    }), this._editor.selection = new this._vscode.Selection(this._editor.selection.end, this._editor.selection.end), this._insertedEditActionCount = a.actions.length
                }
                if (a.actions.length) {
                    let d = this._editor.selection.start;
                    await this._editor.edit(async p => {
                        if (!this._editor) return;
                        let g = a.actions[a.actions.length - 1];
                        p.replace(this._editor.selection, lo(g, c))
                    });
                    let h = this._editor.selection.end;
                    this._editor.selection = new this._vscode.Selection(d, h)
                }
            })
        }))
    }
    _scheduleEdit(e) {
        this._editOperations = this._editOperations.then(e).catch(t => console.log(t))
    }
    isRunningTests() {
        return this._isRunningTests
    }
    pageCount() {
        return this._pageCount
    }
    _pageCountChanged(e) {
        this._pageCount = e, this._onPageCountChangedEvent.fire(e), !this._isRunningTests && (e || this._stop())
    }
    browserServerWSEndpoint() {
        var e;
        return (e = this._backend) == null ? void 0 : e.wsEndpoint
    }
    async inspect(e) {
        var s;
        let t = e.selectedModel();
        if (!(!t || !this._checkVersion(t.config, "selector picker"))) {
            await this._startBackendIfNeeded(t.config);
            try {
                await ((s = this._backend) == null ? void 0 : s.setMode({
                    mode: "inspecting"
                }))
            } catch (i) {
                $i(this._vscode, t, i);
                return
            }
            this._showInspectingBox()
        }
    }
    _showInspectingBox() {
        let e = this._vscode.window.createInputBox();
        e.title = this._vscode.l10n.t("Pick locator"), e.value = "", e.prompt = this._vscode.l10n.t("Accept to copy locator into clipboard"), e.ignoreFocusOut = !0, e.onDidChangeValue(t => {
            var s;
            (s = this._backend) == null || s.highlight({
                selector: t
            }).catch(() => { })
        }), e.onDidHide(() => this._resetNoWait()), e.onDidAccept(() => {
            this._vscode.env.clipboard.writeText(e.value), e.hide()
        }), e.show(), this._updateOrCancelInspecting = t => {
            t.cancel ? e.dispose() : t.selector && (e.value = t.selector)
        }
    }
    canRecord() {
        return !this._isRunningTests
    }
    canClose() {
        return !this._isRunningTests && !!this._pageCount
    }
    async record(e, t) {
        let s = e.selectedModel();
        if (!(!s || !this._checkVersion(s.config))) {
            if (!this.canRecord()) {
                this._vscode.window.showWarningMessage(this._vscode.l10n.t("Can't record while running tests"));
                return
            }
            await this._vscode.window.withProgress({
                location: this._vscode.ProgressLocation.Notification,
                title: "Playwright codegen",
                cancellable: !0
            }, async (i, r) => this._doRecord(i, s, t, r))
        }
    }
    highlight(e) {
        var t;
        (t = this._backend) == null || t.highlight({
            selector: e
        }).catch(() => { }), this._onHighlightRequestedForTestEvent.fire(e)
    }
    hideHighlight() {
        var e;
        (e = this._backend) == null || e.hideHighlight().catch(() => { }), this._onHighlightRequestedForTestEvent.fire("")
    }
    _checkVersion(e, t = this._vscode.l10n.t("this feature")) {
        return e.version < 1.25 ? (this._vscode.window.showWarningMessage(this._vscode.l10n.t("Playwright v1.25+ is required for {0} to work, v{1} found", t, e.version)), !1) : this._vscode.env.uiKind === this._vscode.UIKind.Web && !process.env.DISPLAY ? (this._vscode.window.showWarningMessage(this._vscode.l10n.t("Show browser mode does not work in remote vscode")), !1) : !0
    }
    async _doRecord(e, t, s, i) {
        let r = this._startBackendIfNeeded(t.config),
            o;
        s ? o = await this._createFileForNewTest(t) : o = this._vscode.window.activeTextEditor;
        await r;
        this._editor = o;
        this._insertedEditActionCount = 0;
        e.report({
            message: "starting\u2026"
        });

        // Reset for reuse regardless of whether it's a new test or not
        await this._backend.resetForReuse();
        try {
            await (this._backend.setMode({
                mode: "recording",
                testIdAttributeName: t.config.testIdAttributeName
            }));
        } catch (d) {
            $i(this._vscode, t, d);
            this._stop();
            return;
        }
        e.report({
            message: "recording\u2026"
        })
        await Promise.race([new Promise(d => i.onCancellationRequested(d)), new Promise(d => this._cancelRecording = d)])
        this._resetNoWait()
    }
    async _createFileForNewTest(e) {
        let t = e.enabledProjects()[0];
        if (!t) return;
        let s;
        for (let o = 1; o < 100 && (s = Ji.default.join(t.project.testDir, `test-${o}.misc.ts`), !!Wt.default.existsSync(s)); ++o);
        if (!s) return;
        await Wt.default.promises.writeFile(s, `import { test, expect } from './lib/fixtures';

test('Image Gen: Test Pictures Appear', { tag: ['@younes'] }, async ({ page }) => {
  await page.goto('/');
  // Recording...
});`);
        let i = await this._vscode.workspace.openTextDocument(s),
            r = await this._vscode.window.showTextDocument(i);
        return r.selection = new this._vscode.Selection(new this._vscode.Position(4, 2), new this._vscode.Position(4, 2 + 15)), r
    }
    async onWillRunTests(e, t) {
        !this._settingsModel.showBrowser.get() && !t || !this._checkVersion(e, "Show & reuse browser") || (this._pausedOnPagePause = !1, this._isRunningTests = !0, this._onRunningTestsChangedEvent.fire(!0), await this._startBackendIfNeeded(e))
    }
    async onDidRunTests(e) {
        e && !this._settingsModel.showBrowser.get() ? this._stop() : this._pageCount || this._stop(), this._isRunningTests = !1, this._onRunningTestsChangedEvent.fire(!1)
    }
    closeAllBrowsers() {
        if (this._isRunningTests) {
            this._vscode.window.showWarningMessage(this._vscode.l10n.t("Can't close browsers while running tests"));
            return
        }
        this._stop()
    }
    _resetExtensionState() {
        var e, t;
        this._editor = void 0, this._insertedEditActionCount = 0, (e = this._updateOrCancelInspecting) == null || e.call(this, {
            cancel: !0
        }), this._updateOrCancelInspecting = void 0, (t = this._cancelRecording) == null || t.call(this), this._cancelRecording = void 0
    }
    _resetNoWait() {
        var e;
        this._resetExtensionState(), (e = this._backend) == null || e.resetRecorderModeNoWait()
    }
    _stop() {
        var e;
        this._resetExtensionState(), (e = this._backend) == null || e.requestGracefulTermination(), this._backend = void 0, this._pageCount = 0
    }
},
    At = class extends Pe {
        constructor(e) {
            super(e)
        }
        rewriteWsEndpoint(e) {
            return e + "?debug-controller"
        }
        rewriteWsHeaders(e) {
            return {
                ...e,
                "x-playwright-debug-controller": "true"
            }
        }
        async initialize() {
            await this.send("initialize", {
                codegenId: "playwright-test",
                sdkLanguage: "javascript"
            }), await this.send("setReportStateChanged", {
                enabled: !0
            })
        }
        requestGracefulTermination() {
            this.send("kill").catch(() => { })
        }
        async resetForReuse() {
            await this.send("resetForReuse")
        }
        resetRecorderModeNoWait() {
            this.resetRecorderMode().catch(() => { })
        }
        async resetRecorderMode() {
            await this.send("setRecorderMode", {
                mode: "none"
            })
        }
        async navigate(e) {
            await this.send("navigate", e)
        }
        async setMode(e) {
            await this.send("setRecorderMode", e)
        }
        async highlight(e) {
            await this.send("highlight", e)
        }
        async hideHighlight() {
            await this.send("hideHighlight")
        }
        resumeNoWait() {
            this.send("resume").catch(() => { })
        }
    };

function $i(n, e, t) {
    t.message.includes("Looks like Playwright Test or Playwright") ? Fe(n, e) : n.window.showErrorMessage(t.message)
}

function co(n) {
    let e = n.selection.start.line;
    for (let t = e; t >= 0; --t) {
        let s = n.document.lineAt(t);
        if (!s.isEmptyOrWhitespace) return s.firstNonWhitespaceCharacterIndex
    }
    return 0
}

function lo(n, e) {
    let t = n.split(`
`);
    if (!t.length) return n;
    let s = t[0].match(/\s*/)[0].length,
        i = " ".repeat(Math.max(0, e - s));
    return t.map((r, o) => o ? i + r : r.trimStart()).join(`
`)
}
var O = class {
    constructor() {
        this._disposables = []
    }
    dispose() {
        for (let e of this._disposables) e.dispose();
        this._disposables = []
    }
};
var oe = "pw.workspace-settings",
    Ge = class extends O {
        constructor(t, s) {
            super();
            this._settings = new Map;
            this._vscode = t, this._context = s, this._onChange = new t.EventEmitter, this.onChange = this._onChange.event, this.showBrowser = this._createSetting("reuseBrowser"), this.showTrace = this._createSetting("showTrace"), this.showBrowser.onChange(i => {
                i && this.showTrace.get() && this.showTrace.set(!1)
            }), this.showTrace.onChange(i => {
                i && this.showBrowser.get() && this.showBrowser.set(!1)
            }), this._modernize()
        }
        _modernize() {
            let t = this._vscode.workspace.getConfiguration("playwright").get("workspaceSettings");
            (t == null ? void 0 : t.configs) && !this._context.workspaceState.get(oe) && (this._context.workspaceState.update(oe, {
                configs: t.configs
            }), this._vscode.workspace.getConfiguration("playwright").update("workspaceSettings", void 0))
        }
        _createSetting(t) {
            let s = new Ut(this._vscode, t);
            return this._disposables.push(s), this._disposables.push(s.onChange(() => this._onChange.fire())), this._settings.set(t, s), s
        }
        json() {
            let t = {};
            for (let [s, i] of this._settings) t[s] = i.get();
            return t
        }
    },
    Ut = class extends O {
        constructor(t, s) {
            super();
            this._vscode = t, this.settingName = s, this._onChange = new t.EventEmitter, this.onChange = this._onChange.event;
            let i = `playwright.${s}`;
            this._disposables = [t.workspace.onDidChangeConfiguration(r => {
                r.affectsConfiguration(i) && this._onChange.fire(this.get())
            }), t.commands.registerCommand(`pw.extension.toggle.${s}`, async () => {
                this.set(!this.get())
            })]
        }
        get() {
            return this._vscode.workspace.getConfiguration("playwright").get(this.settingName)
        }
        async set(t) {
            var r;
            let s = this._vscode.workspace.getConfiguration("playwright");
            ((r = s.inspect(this.settingName)) == null ? void 0 : r.workspaceValue) !== void 0 && s.update(this.settingName, t, !1), s.update(this.settingName, t, !0)
        }
    };
var K = m(require("path")),
    $e = class extends O {
        constructor(t, s, i, r, o) {
            super();
            this._vscode = t, this._settingsModel = s, this._models = i, this._reusedBrowser = r, this._extensionUri = o, this._disposables = [r.onRunningTestsChanged(() => this._updateActions()), r.onPageCountChanged(() => this._updateActions()), t.window.registerWebviewViewProvider("pw.extension.settingsView", this)], this._models.onUpdated(() => {
                this._updateModels(), this._updateActions()
            })
        }
        resolveWebviewView(t, s, i) {
            this._view = t, t.webview.options = {
                enableScripts: !0,
                localResourceRoots: [this._extensionUri]
            }, t.webview.html = ho(this._vscode, this._extensionUri, t.webview), this._disposables.push(t.webview.onDidReceiveMessage(r => {
                if (r.method === "execute") this._vscode.commands.executeCommand(r.params.command);
                else if (r.method === "toggle") this._vscode.commands.executeCommand(`pw.extension.toggle.${r.params.setting}`);
                else if (r.method === "setProjectEnabled") {
                    let {
                        configFile: o,
                        projectName: a,
                        enabled: c
                    } = r.params;
                    this._models.setProjectEnabled(o, a, c)
                } else r.method === "selectModel" && this._models.selectModel(r.params.configFile)
            })), this._disposables.push(this._settingsModel.onChange(() => {
                this._updateSettings()
            })), this._disposables.push(t.onDidChangeVisibility(() => {
                !t.visible || (this._updateSettings(), this._updateModels(), this._updateActions())
            })), this._updateSettings(), this._updateModels(), this._updateActions()
        }
        updateActions() {
            this._view && this._updateActions()
        }
        _updateSettings() {
            this._view.webview.postMessage({
                method: "settings",
                params: {
                    settings: this._settingsModel.json()
                }
            })
        }
        _updateActions() {
            let t = [{
                command: "pw.extension.command.inspect",
                svg: '<svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M18 42h-7.5c-3 0-4.5-1.5-4.5-4.5v-27C6 7.5 7.5 6 10.5 6h27C42 6 42 10.404 42 10.5V18h-3V9H9v30h9v3Zm27-15-9 6 9 9-3 3-9-9-6 9-6-24 24 6Z"/></svg>',
                text: this._vscode.l10n.t("Pick locator")
            }, {
                command: "pw.extension.command.recordNew",
                svg: '<svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M22.65 34h3v-8.3H34v-3h-8.35V14h-3v8.7H14v3h8.65ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 23.95q0-4.1 1.575-7.75 1.575-3.65 4.3-6.35 2.725-2.7 6.375-4.275Q19.9 4 24.05 4q4.1 0 7.75 1.575 3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.275 6.375t-6.35 4.3Q28.15 44 24 44Zm.05-3q7.05 0 12-4.975T41 23.95q0-7.05-4.95-12T24 7q-7.05 0-12.025 4.95Q7 16.9 7 24q0 7.05 4.975 12.025Q16.95 41 24.05 41ZM24 24Z"/></svg>',
                text: this._vscode.l10n.t("Record new"),
                disabled: !this._reusedBrowser.canRecord()
            }, {
                command: "pw.extension.command.recordAtCursor",
                svg: '<svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M9 39h2.2l22.15-22.15-2.2-2.2L9 36.8Zm30.7-24.3-6.4-6.4 2.1-2.1q.85-.85 2.1-.85t2.1.85l2.2 2.2q.85.85.85 2.1t-.85 2.1Zm-2.1 2.1L12.4 42H6v-6.4l25.2-25.2Zm-5.35-1.05-1.1-1.1 2.2 2.2Z"/></svg>',
                text: this._vscode.l10n.t("Record at cursor"),
                disabled: !this._reusedBrowser.canRecord()
            }, {
                command: "testing.showMostRecentOutput",
                svg: '<svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M11.85 25.3H29.9v-3H11.85Zm0-6.45H29.9v-3H11.85ZM7 40q-1.2 0-2.1-.9Q4 38.2 4 37V11q0-1.2.9-2.1Q5.8 8 7 8h34q1.2 0 2.1.9.9.9.9 2.1v26q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h34V11H7v26Zm0 0V11v26Z"/></svg>',
                text: this._vscode.l10n.t("Reveal test output")
            }, {
                command: "pw.extension.command.closeBrowsers",
                svg: '<svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path xmlns="http://www.w3.org/2000/svg" d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z"/></svg>',
                text: this._vscode.l10n.t("Close all browsers"),
                disabled: !this._reusedBrowser.canClose()
            }, {
                command: "pw.extension.command.runGlobalSetup",
                svg: '<div class="action-indent"></div>',
                text: this._vscode.l10n.t("Run global setup"),
                location: "rareActions",
                disabled: !this._models.selectedModel() || !this._models.selectedModel().canRunGlobalHooks("setup")
            }, {
                command: "pw.extension.command.runGlobalTeardown",
                svg: '<div class="action-indent"></div>',
                text: this._vscode.l10n.t("Run global teardown"),
                location: "rareActions",
                disabled: !this._models.selectedModel() || !this._models.selectedModel().canRunGlobalHooks("teardown")
            }, {
                command: "pw.extension.command.startDevServer",
                svg: '<div class="action-indent"></div>',
                text: this._vscode.l10n.t("Start dev server"),
                location: "rareActions",
                disabled: !this._models.selectedModel() || !this._models.selectedModel().canStartDevServer(),
                hidden: !0
            }, {
                command: "pw.extension.command.stopDevServer",
                svg: '<div class="action-indent"></div>',
                text: this._vscode.l10n.t("Stop dev server"),
                location: "rareActions",
                disabled: !this._models.selectedModel() || !this._models.selectedModel().canStopDevServer(),
                hidden: !0
            }, {
                command: "pw.extension.command.clearCache",
                svg: '<div class="action-indent"></div>',
                text: this._vscode.l10n.t("Clear cache"),
                location: "rareActions",
                disabled: !this._models.selectedModel()
            }, {
                command: "pw.extension.command.toggleModels",
                svg: '<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="m388-80-20-126q-19-7-40-19t-37-25l-118 54-93-164 108-79q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521L80-600l93-164 118 54q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669-710l118-54 93 164-108 77q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l108 78-93 164-118-54q-16 13-36.5 25.5T592-206L572-80H388Zm48-60h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715-480q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112Zm44-210q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Zm0-130Z"/></svg>',
                title: this._vscode.l10n.t("Toggle Playwright Configs"),
                location: "configToolbar"
            }];
            this._view && this._view.webview.postMessage({
                method: "actions",
                params: {
                    actions: t
                }
            })
        }
        _updateModels() {
            if (!this._view) return;
            let t = [],
                s = new Set;
            this._models.enabledModels().forEach(i => s.add(i.config.workspaceFolder));
            for (let i of this._models.enabledModels()) {
                let r = s.size > 1 ? K.default.basename(i.config.workspaceFolder) + K.default.sep : "";
                t.push({
                    label: r + K.default.relative(i.config.workspaceFolder, i.config.configFile),
                    configFile: i.config.configFile,
                    selected: i === this._models.selectedModel(),
                    enabled: i.isEnabled,
                    projects: i.projects().map(o => ({
                        name: o.name,
                        enabled: o.isEnabled
                    }))
                })
            }
            this._view.webview.postMessage({
                method: "models",
                params: {
                    configs: t,
                    showModelSelector: this._models.models().length > 1
                }
            })
        }
        toggleModels() {
            let t = [],
                s = new Map,
                i = new Set;
            this._models.models().forEach(r => i.add(r.config.workspaceFolder));
            for (let r of this._models.models()) {
                let a = {
                    label: (i.size > 1 ? K.default.basename(r.config.workspaceFolder) + K.default.sep : "") + K.default.relative(r.config.workspaceFolder, r.config.configFile),
                    picked: r.isEnabled
                };
                s.set(r.config.configFile, a), t.push(a)
            }
            t.sort((r, o) => r.label.localeCompare(o.label)), this._vscode.window.showQuickPick(t, {
                title: this._vscode.l10n.t("Toggle Playwright Configs"),
                canPickMany: !0
            }).then(r => {
                if (!!r) {
                    for (let o of this._models.models()) {
                        let a = s.get(o.config.configFile);
                        !a || this._models.setModelEnabled(o.config.configFile, !!(r != null && r.includes(a)), !0)
                    }
                    this._models.ensureHasEnabledModels(), this._updateModels()
                }
            })
        }
    };

function ho(n, e, t) {
    let s = t.asWebviewUri(n.Uri.joinPath(e, "media", "settingsView.css")),
        i = uo();
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${t.cspSource}; script-src 'nonce-${i}';">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="${s}" rel="stylesheet">
      <title>Playwright</title>
    </head>
    <body>
      <div class="list" id="model-selector">
        <div>
          <label title="${n.l10n.t("Select Playwright Config")}">
            <select data-testid="models" id="models"></select>
          </label>
          <span id="configToolbar"></span>
        </div>
      </div>
      <div class="section-header">${n.l10n.t("PROJECTS")}</div>
      <div data-testid="projects" id="projects" class="list"></div>
      <div class="section-header">${n.l10n.t("SETTINGS")}</div>
      <div class="list">
        <div>
          <label title="${n.l10n.t("When enabled, Playwright will reuse the browser instance between tests. This will disable parallel execution.")}">
            <input type="checkbox" setting="reuseBrowser"></input>
            ${n.l10n.t("Show browser")}
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" setting="showTrace"></input>
            ${n.l10n.t("Show trace viewer")}
          </label>
        </div>
      </div>
      <div class="section-header">${n.l10n.t("TOOLS")}</div>
      <div id="actions" class="list"></div>
      <div class="section-header">${n.l10n.t("SETUP")}</div>
      <div id="rareActions" class="list"></div>
    </body>
    <script nonce="${i}">
      let selectConfig;
      function updateProjects(projects) {
        const projectsElement = document.getElementById('projects');
        projectsElement.textContent = '';
        for (const project of projects) {
          const { name, enabled } = project;
          const div = document.createElement('div');
          const label = document.createElement('label');
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.checked = enabled;
          input.addEventListener('change', event => {
            vscode.postMessage({ method: 'setProjectEnabled', params: { configFile: selectConfig.configFile, projectName: name, enabled: input.checked } });
          });
          label.appendChild(input);
          label.appendChild(document.createTextNode(name || '<untitled>'));
          div.appendChild(label);
          projectsElement.appendChild(div);
        }
      }

      const vscode = acquireVsCodeApi();
      for (const input of document.querySelectorAll('input[type=checkbox]')) {
        input.addEventListener('change', event => {
          vscode.postMessage({ method: 'toggle', params: { setting: event.target.getAttribute('setting') } });
        });
      }
      window.addEventListener('message', event => {
        const { method, params } = event.data;
        if (method === 'settings') {
          for (const [key, value] of Object.entries(params.settings)) {
            const input = document.querySelector('input[setting=' + key + ']');
            if (!input)
              continue;
            if (typeof value === 'boolean')
              input.checked = value;
            else
              input.value = value;
          }
        } else if (method === 'actions') {
          const actionsElement = document.getElementById('actions');
          actionsElement.textContent = '';
          const configToolbarElement = document.getElementById('configToolbar');
          configToolbarElement.textContent = '';
          const rareActionsElement = document.getElementById('rareActions');
          rareActionsElement.textContent = '';
          for (const action of params.actions) {
            const actionElement = document.createElement('div');
            if (action.hidden)
              continue;
            if (action.disabled)
              actionElement.setAttribute('disabled', 'true');
            const label = document.createElement('label');
            if (!action.disabled) {
              label.addEventListener('click', event => {
                vscode.postMessage({ method: 'execute', params: { command: event.target.getAttribute('command') } });
              });
            }
            label.setAttribute('role', 'button');
            label.setAttribute('command', action.command);
            const svg = document.createElement('svg');
            actionElement.appendChild(label);
            label.appendChild(svg);
            if (action.text)
              label.appendChild(document.createTextNode(action.text));
            label.title = action.title || action.text;
            if (action.location === 'configToolbar')
              configToolbarElement.appendChild(actionElement);
            else if (action.location === 'rareActions')
              rareActionsElement.appendChild(actionElement);
            else
              actionsElement.appendChild(actionElement);
            svg.outerHTML = action.svg;
          }
        } else if (method === 'models') {
          const { configs, showModelSelector } = params;
          const select = document.getElementById('models');
          select.textContent = '';
          const configsMap = new Map();
          for (const config of configs) {
            configsMap.set(config.configFile, config);
            const option = document.createElement('option');
            option.value = config.configFile;
            option.textContent = config.label;
            select.appendChild(option);
            if (config.selected) {
              selectConfig = config;
              select.value = config.configFile;
              updateProjects(config.projects);
            }
          }
          select.addEventListener('change', event => {
            vscode.postMessage({ method: 'selectModel', params: { configFile: select.value } });
            updateProjects(configsMap.get(select.value).projects);
          });
          const modelSelector = document.getElementById('model-selector');
          modelSelector.style.display = showModelSelector ? 'block' : 'none';
        }
      });
    <\/script>
    </html>`
}

function uo() {
    let n = "",
        e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let t = 0; t < 32; t++) n += e.charAt(Math.floor(Math.random() * e.length));
    return n
}
var A = class {
    constructor(e, t) {
        this._tests = new Map;
        this._rootSuite = new M("", "root"), this._options = t, this._reporter = e
    }
    reset() {
        this._rootSuite.suites = [], this._rootSuite.tests = [], this._tests.clear()
    }
    dispatch(e) {
        let {
            method: t,
            params: s
        } = e;
        if (t === "onConfigure") {
            this._onConfigure(s.config);
            return
        }
        if (t === "onProject") {
            this._onProject(s.project);
            return
        }
        if (t === "onBegin") {
            this._onBegin();
            return
        }
        if (t === "onTestBegin") {
            this._onTestBegin(s.testId, s.result);
            return
        }
        if (t === "onTestEnd") {
            this._onTestEnd(s.test, s.result);
            return
        }
        if (t === "onStepBegin") {
            this._onStepBegin(s.testId, s.resultId, s.step);
            return
        }
        if (t === "onStepEnd") {
            this._onStepEnd(s.testId, s.resultId, s.step);
            return
        }
        if (t === "onError") {
            this._onError(s.error);
            return
        }
        if (t === "onStdIO") {
            this._onStdIO(s.type, s.testId, s.resultId, s.data, s.isBase64);
            return
        }
        if (t === "onEnd") return this._onEnd(s.result);
        if (t === "onExit") return this._onExit()
    }
    _onConfigure(e) {
        var t, s;
        this._rootDir = e.rootDir, this._config = this._parseConfig(e), (s = (t = this._reporter).onConfigure) == null || s.call(t, this._config)
    }
    _onProject(e) {
        let t = this._options.mergeProjects ? this._rootSuite.suites.find(s => s.project().name === e.name) : void 0;
        t || (t = new M(e.name, "project"), this._rootSuite.suites.push(t), t.parent = this._rootSuite), t._project = this._parseProject(e), this._mergeSuitesInto(e.suites, t)
    }
    _onBegin() {
        var e, t;
        (t = (e = this._reporter).onBegin) == null || t.call(e, this._rootSuite)
    }
    _onTestBegin(e, t) {
        var r, o;
        let s = this._tests.get(e);
        this._options.clearPreviousResultsWhenTestBegins && s._clearResults();
        let i = s._createTestResult(t.id);
        i.retry = t.retry, i.workerIndex = t.workerIndex, i.parallelIndex = t.parallelIndex, i.setStartTimeNumber(t.startTime), (o = (r = this._reporter).onTestBegin) == null || o.call(r, s, i)
    }
    _onTestEnd(e, t) {
        var r, o, a;
        let s = this._tests.get(e.testId);
        s.timeout = e.timeout, s.expectedStatus = e.expectedStatus, s.annotations = e.annotations;
        let i = s._resultsMap.get(t.id);
        i.duration = t.duration, i.status = t.status, i.errors = t.errors, i.error = (r = i.errors) == null ? void 0 : r[0], i.attachments = this._parseAttachments(t.attachments), (a = (o = this._reporter).onTestEnd) == null || a.call(o, s, i), i._stepMap = new Map
    }
    _onStepBegin(e, t, s) {
        var l, d;
        let i = this._tests.get(e),
            r = i._resultsMap.get(t),
            o = s.parentStepId ? r._stepMap.get(s.parentStepId) : void 0,
            a = this._absoluteLocation(s.location),
            c = new Vt(s, o, a);
        o ? o.steps.push(c) : r.steps.push(c), r._stepMap.set(s.id, c), (d = (l = this._reporter).onStepBegin) == null || d.call(l, i, r, c)
    }
    _onStepEnd(e, t, s) {
        var a, c;
        let i = this._tests.get(e),
            r = i._resultsMap.get(t),
            o = r._stepMap.get(s.id);
        o.duration = s.duration, o.error = s.error, (c = (a = this._reporter).onStepEnd) == null || c.call(a, i, r, o)
    }
    _onError(e) {
        var t, s;
        (s = (t = this._reporter).onError) == null || s.call(t, e)
    }
    _onStdIO(e, t, s, i, r) {
        var l, d, h, p;
        let o = r ? globalThis.Buffer ? Buffer.from(i, "base64") : atob(i) : i,
            a = t ? this._tests.get(t) : void 0,
            c = a && s ? a._resultsMap.get(s) : void 0;
        e === "stdout" ? (c == null || c.stdout.push(o), (d = (l = this._reporter).onStdOut) == null || d.call(l, o, a, c)) : (c == null || c.stderr.push(o), (p = (h = this._reporter).onStdErr) == null || p.call(h, o, a, c))
    }
    async _onEnd(e) {
        var t, s;
        await ((s = (t = this._reporter).onEnd) == null ? void 0 : s.call(t, {
            status: e.status,
            startTime: new Date(e.startTime),
            duration: e.duration
        }))
    }
    _onExit() {
        var e, t;
        return (t = (e = this._reporter).onExit) == null ? void 0 : t.call(e)
    }
    _parseConfig(e) {
        let t = {
            ...po,
            ...e
        };
        return this._options.configOverrides && (t.configFile = this._options.configOverrides.configFile, t.reportSlowTests = this._options.configOverrides.reportSlowTests, t.quiet = this._options.configOverrides.quiet, t.reporter = [...this._options.configOverrides.reporter]), t
    }
    _parseProject(e) {
        return {
            metadata: e.metadata,
            name: e.name,
            outputDir: this._absolutePath(e.outputDir),
            repeatEach: e.repeatEach,
            retries: e.retries,
            testDir: this._absolutePath(e.testDir),
            testIgnore: Je(e.testIgnore),
            testMatch: Je(e.testMatch),
            timeout: e.timeout,
            grep: Je(e.grep),
            grepInvert: Je(e.grepInvert),
            dependencies: e.dependencies,
            teardown: e.teardown,
            snapshotDir: this._absolutePath(e.snapshotDir),
            use: {}
        }
    }
    _parseAttachments(e) {
        return e.map(t => ({
            ...t,
            body: t.base64 && globalThis.Buffer ? Buffer.from(t.base64, "base64") : void 0
        }))
    }
    _mergeSuitesInto(e, t) {
        for (let s of e) {
            let i = t.suites.find(r => r.title === s.title);
            i || (i = new M(s.title, t._type === "project" ? "file" : "describe"), i.parent = t, t.suites.push(i)), i.location = this._absoluteLocation(s.location), this._mergeSuitesInto(s.suites, i), this._mergeTestsInto(s.tests, i)
        }
    }
    _mergeTestsInto(e, t) {
        for (let s of e) {
            let i = this._options.mergeTestCases ? t.tests.find(r => r.title === s.title && r.repeatEachIndex === s.repeatEachIndex) : void 0;
            i || (i = new qt(s.testId, s.title, this._absoluteLocation(s.location), s.repeatEachIndex), i.parent = t, t.tests.push(i), this._tests.set(i.id, i)), this._updateTest(s, i)
        }
    }
    _updateTest(e, t) {
        var s;
        return t.id = e.testId, t.location = this._absoluteLocation(e.location), t.retries = e.retries, t.tags = (s = e.tags) != null ? s : [], t
    }
    _absoluteLocation(e) {
        return e && {
            ...e,
            file: this._absolutePath(e.file)
        }
    }
    _absolutePath(e) {
        if (e !== void 0) return this._options.resolvePath(this._rootDir, e)
    }
},
    M = class {
        constructor(e, t) {
            this._requireFile = "";
            this.suites = [];
            this.tests = [];
            this._parallelMode = "none";
            this.title = e, this._type = t
        }
        allTests() {
            let e = [],
                t = s => {
                    for (let i of [...s.suites, ...s.tests]) i instanceof M ? t(i) : e.push(i)
                };
            return t(this), e
        }
        titlePath() {
            let e = this.parent ? this.parent.titlePath() : [];
            return (this.title || this._type !== "describe") && e.push(this.title), e
        }
        project() {
            var e, t;
            return (t = this._project) != null ? t : (e = this.parent) == null ? void 0 : e.project()
        }
    },
    qt = class {
        constructor(e, t, s, i) {
            this.fn = () => { };
            this.results = [];
            this.expectedStatus = "passed";
            this.timeout = 0;
            this.annotations = [];
            this.retries = 0;
            this.tags = [];
            this.repeatEachIndex = 0;
            this._resultsMap = new Map;
            this.id = e, this.title = t, this.location = s, this.repeatEachIndex = i
        }
        titlePath() {
            let e = this.parent ? this.parent.titlePath() : [];
            return e.push(this.title), e
        }
        outcome() {
            var s, i;
            let e = [...this.results];
            for (;
                ((s = e[0]) == null ? void 0 : s.status) === "skipped" || ((i = e[0]) == null ? void 0 : i.status) === "interrupted";) e.shift();
            if (!e.length) return "skipped";
            let t = e.filter(r => r.status !== "skipped" && r.status !== "interrupted" && r.status !== this.expectedStatus);
            return t.length ? t.length === e.length ? "unexpected" : "flaky" : "expected"
        }
        ok() {
            let e = this.outcome();
            return e === "expected" || e === "flaky" || e === "skipped"
        }
        _clearResults() {
            this.results = [], this._resultsMap.clear()
        }
        _createTestResult(e) {
            let t = new Ht(this.results.length);
            return this.results.push(t), this._resultsMap.set(e, t), t
        }
    },
    Vt = class {
        constructor(e, t, s) {
            this.duration = -1;
            this.steps = [];
            this._startTime = 0;
            this.title = e.title, this.category = e.category, this.location = s, this.parent = t, this._startTime = e.startTime
        }
        titlePath() {
            var t;
            return [...((t = this.parent) == null ? void 0 : t.titlePath()) || [], this.title]
        }
        get startTime() {
            return new Date(this._startTime)
        }
        set startTime(e) {
            this._startTime = +e
        }
    },
    Ht = class {
        constructor(e) {
            this.parallelIndex = -1;
            this.workerIndex = -1;
            this.duration = -1;
            this.stdout = [];
            this.stderr = [];
            this.attachments = [];
            this.status = "skipped";
            this.steps = [];
            this.errors = [];
            this._stepMap = new Map;
            this._startTime = 0;
            this.retry = e
        }
        setStartTimeNumber(e) {
            this._startTime = e
        }
        get startTime() {
            return new Date(this._startTime)
        }
        set startTime(e) {
            this._startTime = +e
        }
    },
    po = {
        forbidOnly: !1,
        fullyParallel: !1,
        globalSetup: null,
        globalTeardown: null,
        globalTimeout: 0,
        grep: /.*/,
        grepInvert: null,
        maxFailures: 0,
        metadata: {},
        preserveOutput: "always",
        projects: [],
        reporter: [
            [process.env.CI ? "dot" : "list"]
        ],
        reportSlowTests: {
            max: 5,
            threshold: 15e3
        },
        configFile: "",
        rootDir: "",
        quiet: !1,
        shard: null,
        updateSnapshots: "missing",
        version: "",
        workers: 0,
        webServer: null
    };

function Je(n) {
    return n.map(e => e.s ? e.s : new RegExp(e.r.source, e.r.flags))
}
var le = m(require("path"));
var ze = class {
    constructor() {
        this._map = new Map
    }
    set(e, t) {
        let s = this._map.get(e);
        s || (s = [], this._map.set(e, s)), s.push(t)
    }
    get(e) {
        return this._map.get(e) || []
    }
    has(e) {
        return this._map.has(e)
    }
    delete(e, t) {
        let s = this._map.get(e);
        !s || s.includes(t) && this._map.set(e, s.filter(i => t !== i))
    }
    deleteAll(e) {
        this._map.delete(e)
    }
    hasValue(e, t) {
        let s = this._map.get(e);
        return s ? s.includes(t) : !1
    }
    get size() {
        return this._map.size
    } [Symbol.iterator]() {
        return this._map[Symbol.iterator]()
    }
    keys() {
        return this._map.keys()
    }
    values() {
        let e = [];
        for (let t of this.keys()) e.push(...this.get(t));
        return e
    }
    clear() {
        this._map.clear()
    }
};
var ce = m(require("path"));
var zi;
(e => {
    function n(t) {
        for (let s of t.splice(0)) s.dispose()
    }
    e.disposeAll = n
})(zi || (zi = {}));
var U = class {
    constructor() {
        this._listeners = new Set;
        this.event = (e, t) => {
            this._listeners.add(e);
            let s = !1,
                i = this,
                r = {
                    dispose() {
                        s || (s = !0, i._listeners.delete(e))
                    }
                };
            return t && t.push(r), r
        }
    }
    fire(e) {
        let t = !this._deliveryQueue;
        this._deliveryQueue || (this._deliveryQueue = []);
        for (let s of this._listeners) this._deliveryQueue.push({
            listener: s,
            event: e
        });
        if (!!t) {
            for (let s = 0; s < this._deliveryQueue.length; s++) {
                let {
                    listener: i,
                    event: r
                } = this._deliveryQueue[s];
                i.call(null, r)
            }
            this._deliveryQueue = void 0
        }
    }
    dispose() {
        this._listeners.clear(), this._deliveryQueue && (this._deliveryQueue = [])
    }
};
var ke = class {
    constructor(e) {
        this._onCloseEmitter = new U;
        this._onReportEmitter = new U;
        this._onStdioEmitter = new U;
        this._onListChangedEmitter = new U;
        this._onTestFilesChangedEmitter = new U;
        this._onLoadTraceRequestedEmitter = new U;
        this._lastId = 0;
        this._callbacks = new Map;
        this._isClosed = !1;
        this.onClose = this._onCloseEmitter.event, this.onReport = this._onReportEmitter.event, this.onStdio = this._onStdioEmitter.event, this.onListChanged = this._onListChangedEmitter.event, this.onTestFilesChanged = this._onTestFilesChangedEmitter.event, this.onLoadTraceRequested = this._onLoadTraceRequestedEmitter.event, this._ws = new D(e), this._ws.addEventListener("message", s => {
            let i = JSON.parse(String(s.data)),
                {
                    id: r,
                    result: o,
                    error: a,
                    method: c,
                    params: l
                } = i;
            if (r) {
                let d = this._callbacks.get(r);
                if (!d) return;
                this._callbacks.delete(r), a ? d.reject(new Error(a)) : d.resolve(o)
            } else this._dispatchEvent(c, l)
        });
        let t = setInterval(() => this._sendMessage("ping").catch(() => { }), 3e4);
        this._connectedPromise = new Promise((s, i) => {
            this._ws.addEventListener("open", () => s()), this._ws.addEventListener("error", i)
        }), this._ws.addEventListener("close", () => {
            this._isClosed = !0, this._onCloseEmitter.fire(), clearInterval(t)
        })
    }
    isClosed() {
        return this._isClosed
    }
    async _sendMessage(e, t) {
        let s = globalThis.__logForTest;
        s == null || s({
            method: e,
            params: t
        }), await this._connectedPromise;
        let i = ++this._lastId,
            r = {
                id: i,
                method: e,
                params: t
            };
        return this._ws.send(JSON.stringify(r)), new Promise((o, a) => {
            this._callbacks.set(i, {
                resolve: o,
                reject: a
            })
        })
    }
    _sendMessageNoReply(e, t) {
        this._sendMessage(e, t).catch(() => { })
    }
    _dispatchEvent(e, t) {
        e === "report" ? this._onReportEmitter.fire(t) : e === "stdio" ? this._onStdioEmitter.fire(t) : e === "listChanged" ? this._onListChangedEmitter.fire(t) : e === "testFilesChanged" ? this._onTestFilesChangedEmitter.fire(t) : e === "loadTraceRequested" && this._onLoadTraceRequestedEmitter.fire(t)
    }
    async initialize(e) {
        await this._sendMessage("initialize", e)
    }
    async ping(e) {
        await this._sendMessage("ping", e)
    }
    async pingNoReply(e) {
        this._sendMessageNoReply("ping", e)
    }
    async watch(e) {
        await this._sendMessage("watch", e)
    }
    watchNoReply(e) {
        this._sendMessageNoReply("watch", e)
    }
    async open(e) {
        await this._sendMessage("open", e)
    }
    openNoReply(e) {
        this._sendMessageNoReply("open", e)
    }
    async resizeTerminal(e) {
        await this._sendMessage("resizeTerminal", e)
    }
    resizeTerminalNoReply(e) {
        this._sendMessageNoReply("resizeTerminal", e)
    }
    async checkBrowsers(e) {
        return await this._sendMessage("checkBrowsers", e)
    }
    async installBrowsers(e) {
        await this._sendMessage("installBrowsers", e)
    }
    async runGlobalSetup(e) {
        return await this._sendMessage("runGlobalSetup", e)
    }
    async runGlobalTeardown(e) {
        return await this._sendMessage("runGlobalTeardown", e)
    }
    async startDevServer(e) {
        return await this._sendMessage("startDevServer", e)
    }
    async stopDevServer(e) {
        return await this._sendMessage("stopDevServer", e)
    }
    async clearCache(e) {
        return await this._sendMessage("clearCache", e)
    }
    async listFiles(e) {
        return await this._sendMessage("listFiles", e)
    }
    async listTests(e) {
        return await this._sendMessage("listTests", e)
    }
    async runTests(e) {
        return await this._sendMessage("runTests", e)
    }
    async findRelatedTestFiles(e) {
        return await this._sendMessage("findRelatedTestFiles", e)
    }
    async stopTests(e) {
        await this._sendMessage("stopTests", e)
    }
    stopTestsNoReply(e) {
        this._sendMessageNoReply("stopTests", e)
    }
    async closeGracefully(e) {
        await this._sendMessage("closeGracefully", e)
    }
    close() {
        try {
            this._ws.close()
        } catch { }
    }
};
var Qe = class {
    constructor(e, t, s) {
        this._vscode = e, this._model = t, this._options = s
    }
    reset() {
        this._disposeTestServer()
    }
    async listFiles() {
        let e = await this._testServer();
        if (!e) throw new Error("Internal error: unable to connect to the test server");
        let t = {
            projects: []
        },
            {
                report: s
            } = await e.listFiles({}),
            i = new A({
                onBegin(r) {
                    for (let o of r.suites) {
                        let a = o.project(),
                            c = [];
                        t.projects.push({
                            name: a.name,
                            testDir: a.testDir,
                            use: a.use || {},
                            files: c
                        });
                        for (let l of o.suites) c.push(l.location.file)
                    }
                },
                onError(r) {
                    t.error = r
                }
            }, {
                mergeProjects: !0,
                mergeTestCases: !0,
                resolvePath: (r, o) => this._vscode.Uri.file(ce.default.join(r, o)).fsPath
            });
        for (let r of s) i.dispatch(r);
        return t
    }
    async listTests(e, t, s) {
        let i = await this._testServer();
        if (s != null && s.isCancellationRequested || !i) return;
        e = e.map(x);
        let {
            report: r
        } = await i.listTests({
            locations: e
        }), o = new A(t, {
            mergeProjects: !0,
            mergeTestCases: !0,
            resolvePath: (a, c) => this._vscode.Uri.file(ce.default.join(a, c)).fsPath
        });
        for (let a of r) o.dispatch(a)
    }
    async runGlobalHooks(e, t) {
        let s = await this._testServer();
        return s ? await this._runGlobalHooksInServer(s, e, t) : "failed"
    }
    async _runGlobalHooksInServer(e, t, s) {
        var o;
        let i = new A(s, {
            mergeProjects: !0,
            mergeTestCases: !0,
            resolvePath: (a, c) => this._vscode.Uri.file(ce.default.join(a, c)).fsPath
        }),
            r = e.onStdio(a => {
                var c, l;
                a.type === "stdout" && ((c = s.onStdOut) == null || c.call(s, ae(a))), a.type === "stderr" && ((l = s.onStdErr) == null || l.call(s, ae(a)))
            });
        try {
            if (t === "setup") {
                (o = s.onStdOut) == null || o.call(s, `\x1B[2mRunning global setup if any\u2026\x1B[0m
`);
                let {
                    report: l,
                    status: d
                } = await e.runGlobalSetup({});
                for (let h of l) i.dispatch(h);
                return d
            }
            let {
                report: a,
                status: c
            } = await e.runGlobalTeardown({});
            for (let l of a) i.dispatch(l);
            return c
        } finally {
            r.dispose()
        }
    }
    async startDevServer() {
        let e = await this._testServer();
        return e ? (await e.startDevServer({})).status : "failed"
    }
    async stopDevServer() {
        let e = await this._testServer();
        return e ? (await e.stopDevServer({})).status : "failed"
    }
    async clearCache() {
        let e = await this._testServer();
        await (e == null ? void 0 : e.clearCache({}))
    }
    async runTests(e, t, s, i) {
        let r = await this._testServer();
        if (i != null && i.isCancellationRequested || !r) return;
        let {
            locations: o,
            testIds: a
        } = this._model.narrowDownLocations(e);
        if (!o && !a) return;
        let c = o ? o.map(x) : void 0,
            l = {
                projects: this._model.enabledProjectsFilter(),
                locations: c,
                testIds: a,
                ...t
            };
        r.runTests(l), i.onCancellationRequested(() => {
            r.stopTestsNoReply({})
        });
        let d = r.onStdio(h => {
            var p, g;
            h.type === "stdout" && ((p = s.onStdOut) == null || p.call(s, ae(h))), h.type === "stderr" && ((g = s.onStdErr) == null || g.call(s, ae(h)))
        });
        await this._wireTestServer(r, s, i), d.dispose()
    }
    async debugTests(e, t, s, i) {
        let o = ["test-server", "-c", ce.default.relative(this._model.config.workspaceFolder, this._model.config.configFile)],
            a = new Promise(h => {
                let p = this._options.onStdOut(g => {
                    let u = g.match(/Listening on (.*)/);
                    u && (p.dispose(), h(u[1]))
                })
            }),
            c = this._model.enabledProjects().map(h => h.project.testDir),
            l, d;
        try {
            if (await this._vscode.debug.startDebugging(void 0, {
                type: "pwa-node",
                name: Z,
                request: "launch",
                cwd: this._model.config.workspaceFolder,
                env: {
                    ...process.env,
                    CI: this._options.isUnderTest ? void 0 : process.env.CI,
                    ...this._options.envProvider(),
                    ELECTRON_RUN_AS_NODE: void 0,
                    FORCE_COLOR: "1",
                    PW_TEST_SOURCE_TRANSFORM: require.resolve("./debugTransform"),
                    PW_TEST_SOURCE_TRANSFORM_SCOPE: c.join(Oe),
                    PWDEBUG: "console"
                },
                program: this._model.config.cli,
                args: o
            }), i != null && i.isCancellationRequested) return;
            let h = await a;
            if (l = new ke(h), await l.initialize({
                serializer: require.resolve("./oopReporter"),
                closeOnDisconnect: !0
            }), i != null && i.isCancellationRequested) return;
            let {
                locations: p,
                testIds: g
            } = this._model.narrowDownLocations(e);
            if (!p && !g || await this._runGlobalHooksInServer(l, "setup", s) !== "passed" || i != null && i.isCancellationRequested) return;
            let f = p ? p.map(x) : void 0,
                v = {
                    projects: this._model.enabledProjectsFilter(),
                    locations: f,
                    testIds: g,
                    ...t
                };
            l.runTests(v), i.onCancellationRequested(() => {
                l.stopTestsNoReply({})
            }), d = l.onStdio(E => {
                var R, k;
                E.type === "stdout" && ((R = s.onStdOut) == null || R.call(s, ae(E))), E.type === "stderr" && ((k = s.onStdErr) == null || k.call(s, ae(E)))
            }), await this._wireTestServer(l, s, i)
        } finally {
            d == null || d.dispose(), !i.isCancellationRequested && l && !l.isClosed() && await this._runGlobalHooksInServer(l, "teardown", s), l == null || l.close(), await this._options.runHooks.onDidRunTests(!0)
        }
    }
    async watchFiles(e) {
        let t = await this._testServer();
        !t || await t.watch({
            fileNames: e
        })
    }
    async findRelatedTestFiles(e) {
        let t = await this._testServer();
        return t ? await t.findRelatedTestFiles({
            files: e
        }) : {
            testFiles: e,
            errors: [{
                message: "Internal error: unable to connect to the test server"
            }]
        }
    }
    _testServer() {
        return this._testServerPromise ? this._testServerPromise : (this._testServerPromise = this._createTestServer(), this._testServerPromise)
    }
    async _createTestServer() {
        let e = [this._model.config.cli, "test-server", "-c", this._model.config.configFile],
            t = await jt(this._vscode, {
                args: e,
                cwd: this._model.config.workspaceFolder,
                envProvider: () => ({
                    ...this._options.envProvider(),
                    FORCE_COLOR: "1"
                }),
                dumpIO: !1,
                onClose: () => {
                    this._testServerPromise = void 0
                },
                onError: i => {
                    this._testServerPromise = void 0
                }
            });
        if (!t) return null;
        let s = new ke(t);
        return s.onTestFilesChanged(i => this._testFilesChanged(i.testFiles)), await s.initialize({
            serializer: require.resolve("./oopReporter"),
            interceptStdio: !0,
            closeOnDisconnect: !0
        }), s
    }
    async _wireTestServer(e, t, s) {
        let i = new A(t, {
            mergeProjects: !0,
            mergeTestCases: !0,
            resolvePath: (r, o) => this._vscode.Uri.file(ce.default.join(r, o)).fsPath
        });
        return new Promise(r => {
            let o = [e.onReport(a => {
                s.isCancellationRequested && a.method !== "onEnd" || (i.dispatch(a), a.method === "onEnd" && (o.forEach(c => c.dispose()), r()))
            }), e.onClose(() => {
                o.forEach(a => a.dispose()), r()
            })]
        })
    }
    _testFilesChanged(e) {
        this._model.testFilesChanged(e.map(t => this._vscode.Uri.file(t).fsPath))
    }
    _disposeTestServer() {
        let e = this._testServerPromise;
        this._testServerPromise = void 0, e && e.then(t => t == null ? void 0 : t.close())
    }
};

function ae(n) {
    return n.buffer ? Buffer.from(n.buffer, "base64") : n.text || ""
}
var Zi = require("child_process"),
    P = m(require("path"));
var Qi = m(require("path")),
    Ki = m(require("http"));
var Ie = class {
    constructor(e) {
        this._vscode = e, this._clientSocketPromise = new Promise(t => this._clientSocketCallback = t)
    }
    async env() {
        let e = await this._listen();
        return {
            PW_TEST_REPORTER: require.resolve("./oopReporter"),
            PW_TEST_REPORTER_WS_ENDPOINT: e
        }
    }
    async _listen() {
        let e = Ki.createServer((r, o) => o.end());
        e.on("error", r => console.error(r));
        let t = "/" + te(),
            s = await new Promise((r, o) => {
                e.listen(0, () => {
                    let a = e.address();
                    if (!a) {
                        o(new Error("Could not bind server socket"));
                        return
                    }
                    let c = typeof a == "string" ? `${a}${t}` : `ws://127.0.0.1:${a.port}${t}`;
                    r(c)
                }).on("error", o)
            }),
            i = new Dt.default({
                server: e,
                path: t
            });
        return i.on("connection", async r => this._clientSocketCallback(r)), this._wsServer = i, s
    }
    async wireTestListener(e, t) {
        let s, i = await this._waitForTransport(),
            r = () => {
                if (!i.isClosed()) try {
                    i.send({
                        id: 0,
                        method: "stop",
                        params: {}
                    }), s = setTimeout(() => i.close(), 3e4)
                } catch {
                    i.close()
                }
            };
        t.onCancellationRequested(r), t.isCancellationRequested && r();
        let o = new A(e, {
            mergeProjects: !0,
            mergeTestCases: !0,
            resolvePath: (a, c) => this._vscode.Uri.file(Qi.default.join(a, c)).fsPath
        });
        i.onmessage = a => {
            t.isCancellationRequested && a.method !== "onEnd" || (a.method === "onEnd" && i.close(), o.dispatch(a))
        }, await new Promise(a => i.onclose = a), s && clearTimeout(s)
    }
    async _waitForTransport() {
        let e = await this._clientSocketPromise,
            t = {
                send: function (s) {
                    e.readyState !== D.CLOSING && e.send(JSON.stringify(s))
                },
                isClosed() {
                    return e.readyState === D.CLOSED || e.readyState === D.CLOSING
                },
                close: () => {
                    var s;
                    e.close(), (s = this._wsServer) == null || s.close()
                }
            };
        return e.on("message", s => {
            var i;
            (i = t.onmessage) == null || i.call(t, JSON.parse(Buffer.from(s).toString()))
        }), e.on("close", () => {
            var s, i;
            (s = this._wsServer) == null || s.close(), (i = t.onclose) == null || i.call(t)
        }), e.on("error", () => {
            var s, i;
            (s = this._wsServer) == null || s.close(), (i = t.onclose) == null || i.call(t)
        }), t
    }
};
var Ke = class {
    constructor(e, t, s) {
        this._vscode = e, this._model = t, this._options = s
    }
    reset() { }
    async listFiles() {
        let e = P.default.dirname(this._model.config.configFile),
            t = P.default.basename(this._model.config.configFile),
            s = [this._model.config.cli, "list-files", "-c", t];
        this._log(`${x(P.default.relative(this._model.config.workspaceFolder, e))}> playwright list-files -c ${t}`);
        let i = await this._runNode(s, e),
            r = JSON.parse(i);
        return {
            projects: [],
            ...r
        }
    }
    async listTests(e, t, s) {
        let i = [];
        i.push("--list", "--reporter=null"), await this._innerSpawn(e, i, {}, t, s)
    }
    async runGlobalHooks(e, t) {
        return "failed"
    }
    async startDevServer() { }
    async stopDevServer() { }
    async clearCache() { }
    async runTests(e, t, s, i) {
        let {
            locations: r,
            parametrizedTestTitle: o
        } = this._narrowDownLocations(e);
        if (!r) return;
        let a = [];
        this._model.enabledProjectsFilter().forEach(c => a.push(`--project=${c}`)), o && a.push(`--grep=${x(o)}`), a.push("--repeat-each=1"), a.push("--retries=0"), t.headed && a.push("--headed"), t.workers && a.push(`--workers=${t.workers}`), t.trace && a.push(`--trace=${t.trace}`), await this._innerSpawn(r, a, t, s, i)
    }
    async _innerSpawn(e, t, s, i, r) {
        if (r != null && r.isCancellationRequested) return;
        let o = new Ie(this._vscode),
            a = await $(this._vscode, this._model.config.workspaceFolder),
            c = P.default.dirname(this._model.config.configFile),
            l = P.default.basename(this._model.config.configFile),
            d = e.map(x).sort();
        {
            let g = e.map(f => P.default.relative(c, f)).map(x).sort(),
                u = t.filter(f => !f.includes("--repeat-each") && !f.includes("--retries") && !f.includes("--workers") && !f.includes("--trace"));
            this._log(`${x(P.default.relative(this._model.config.workspaceFolder, c))}> playwright test -c ${l}${u.length ? " " + u.join(" ") : ""}${g.length ? " " + g.join(" ") : ""}`)
        }
        let p = (0, Zi.spawn)(a, [this._model.config.cli, "test", "-c", l, ...t, ...d], {
            cwd: c,
            stdio: ["pipe", "pipe", "pipe", "pipe", "pipe"],
            env: {
                ...process.env,
                CI: this._options.isUnderTest ? void 0 : process.env.CI,
                NODE_OPTIONS: void 0,
                ...this._options.envProvider(),
                PW_TEST_REUSE_CONTEXT: s.reuseContext ? "1" : void 0,
                PW_TEST_CONNECT_WS_ENDPOINT: s.connectWsEndpoint,
                ...await o.env(),
                ELECTRON_RUN_AS_NODE: void 0,
                FORCE_COLOR: "1",
                PW_TEST_HTML_REPORT_OPEN: "never",
                PW_TEST_NO_REMOVE_OUTPUT_DIRS: "1"
            }
        }).stdio;
        p[1].on("data", g => {
            var u;
            return (u = i.onStdOut) == null ? void 0 : u.call(i, g)
        }), p[2].on("data", g => {
            var u;
            return (u = i.onStdErr) == null ? void 0 : u.call(i, g)
        }), await o.wireTestListener(i, r)
    }
    async debugTests(e, t, s, i) {
        let r = P.default.dirname(this._model.config.configFile),
            o = P.default.basename(this._model.config.configFile),
            {
                locations: a,
                parametrizedTestTitle: c
            } = this._narrowDownLocations(e);
        if (!a) return;
        let l = this._model.enabledProjects().map(u => u.project.testDir),
            d = a.map(x),
            h = ["test", "-c", o, ...d, t.headed ? "--headed" : "", ...this._model.enabledProjectsFilter().map(u => `--project=${u}`), "--repeat-each", "1", "--retries", "0", "--timeout", "0", "--workers", String(t.workers)].filter(Boolean);
        c && h.push(`--grep=${x(c)}`);
        {
            let u = a.map(f => P.default.relative(r, f)).map(x);
            this._log(`${x(P.default.relative(this._model.config.workspaceFolder, r))}> debug -c ${o}${u.length ? " " + u.join(" ") : ""}`)
        }
        let p = new Ie(this._vscode),
            g = await this._options.runHooks.onWillRunTests(this._model.config, !0);
        try {
            await this._vscode.debug.startDebugging(void 0, {
                type: "pwa-node",
                name: Z,
                request: "launch",
                cwd: r,
                env: {
                    ...process.env,
                    CI: this._options.isUnderTest ? void 0 : process.env.CI,
                    ...this._options.envProvider(),
                    PW_TEST_CONNECT_WS_ENDPOINT: g.connectWsEndpoint,
                    ...await p.env(),
                    ELECTRON_RUN_AS_NODE: void 0,
                    FORCE_COLOR: "1",
                    PW_TEST_SOURCE_TRANSFORM: require.resolve("./debugTransform"),
                    PW_TEST_SOURCE_TRANSFORM_SCOPE: l.join(Oe),
                    PW_TEST_HTML_REPORT_OPEN: "never",
                    PWDEBUG: "console"
                },
                program: this._model.config.cli,
                args: h
            }), await p.wireTestListener(s, i)
        } finally {
            await this._options.runHooks.onDidRunTests(!0)
        }
    }
    async watchFiles(e) { }
    async findRelatedTestFiles(e) {
        let t = P.default.dirname(this._model.config.configFile),
            s = P.default.basename(this._model.config.configFile),
            i = [this._model.config.cli, "find-related-test-files", "-c", s, ...e];
        this._log(`${x(P.default.relative(this._model.config.workspaceFolder, t))}> playwright find-related-test-files -c ${s}`);
        try {
            let r = await this._runNode(i, t);
            return JSON.parse(r)
        } catch (r) {
            return {
                errors: [{
                    location: {
                        file: s,
                        line: 0,
                        column: 0
                    },
                    message: r.message
                }],
                testFiles: e
            }
        }
    }
    async _runNode(e, t) {
        return await mt(this._vscode, e, t, this._options.envProvider())
    }
    _log(e) {
        this._options.playwrightTestLog.push(e)
    }
    _narrowDownLocations(e) {
        var i;
        if (!e.length) return {
            locations: [],
            parametrizedTestTitle: void 0
        };
        let t;
        if (e.length === 1) {
            let r = e[0];
            if (r.uri && r.range) {
                let o = 0;
                (i = r.parent) == null || i.children.forEach(a => {
                    var c, l, d, h;
                    ((c = a.uri) == null ? void 0 : c.fsPath) === ((l = r.uri) == null ? void 0 : l.fsPath) && ((d = a.range) == null ? void 0 : d.start.line) === ((h = r.range) == null ? void 0 : h.start.line) && ++o
                }), o > 1 && (t = r.label)
            }
        }
        let s = new Set;
        for (let r of e) {
            let o = r.uri.fsPath,
                a = this._model.enabledFiles();
            for (let c of a)
                if (c === o || c.startsWith(o)) {
                    let l = r.range ? ":" + (r.range.start.line + 1) : "";
                    s.add(r.uri.fsPath + l)
                }
        }
        return {
            locations: s.size ? [...s] : null,
            parametrizedTestTitle: t
        }
    }
};
var $t = m(require("path"));
var Ze = class {
    constructor(e, t, s, i, r) {
        this._treeItemById = new Map;
        this._treeItemByTestId = new Map;
        let o = i && [...i.values()].some(Boolean);
        this.pathSeparator = r, this.rootItem = {
            kind: "group",
            subKind: "folder",
            id: e,
            title: "",
            location: {
                file: "",
                line: 0,
                column: 0
            },
            duration: 0,
            parent: void 0,
            children: [],
            status: "none",
            hasLoadErrors: !1
        }, this._treeItemById.set(e, this.rootItem);
        let a = (c, l, d) => {
            for (let h of l.suites) {
                let p = h.title || "<anonymous>",
                    g = d.children.find(u => u.kind === "group" && u.title === p);
                g || (g = {
                    kind: "group",
                    subKind: "describe",
                    id: "suite:" + l.titlePath().join("") + "" + p,
                    title: p,
                    location: h.location,
                    duration: 0,
                    parent: d,
                    children: [],
                    status: "none",
                    hasLoadErrors: !1
                }, this._addChild(d, g)), a(c, h, g)
            }
            for (let h of l.tests) {
                let p = h.title,
                    g = d.children.find(T => T.kind !== "group" && T.title === p);
                g || (g = {
                    kind: "case",
                    id: "test:" + h.titlePath().join(""),
                    title: p,
                    parent: d,
                    children: [],
                    tests: [],
                    location: h.location,
                    duration: 0,
                    status: "none",
                    project: void 0,
                    test: void 0,
                    tags: h.tags
                }, this._addChild(d, g));
                let u = h.results[0],
                    f = "none";
                (u == null ? void 0 : u[Yi]) === "scheduled" ? f = "scheduled" : (u == null ? void 0 : u[Yi]) === "running" ? f = "running" : (u == null ? void 0 : u.status) === "skipped" ? f = "skipped" : (u == null ? void 0 : u.status) === "interrupted" ? f = "none" : u && h.outcome() !== "expected" ? f = "failed" : u && h.outcome() === "expected" && (f = "passed"), g.tests.push(h);
                let v = {
                    kind: "test",
                    id: h.id,
                    title: c.name,
                    location: h.location,
                    test: h,
                    parent: g,
                    children: [],
                    status: f,
                    duration: h.results.length ? Math.max(0, h.results[0].duration) : 0,
                    project: c
                };
                this._addChild(g, v), this._treeItemByTestId.set(h.id, v), g.duration = g.children.reduce((T, E) => T + E.duration, 0)
            }
        };
        for (let c of (t == null ? void 0 : t.suites) || [])
            if (!(o && !i.get(c.title)))
                for (let l of c.suites) {
                    let d = this._fileItem(l.location.file.split(r), !0);
                    a(c.project(), l, d)
                }
        for (let c of s) {
            if (!c.location) continue;
            let l = this._fileItem(c.location.file.split(r), !0);
            l.hasLoadErrors = !0
        }
    }
    _addChild(e, t) {
        e.children.push(t), t.parent = e, this._treeItemById.set(t.id, t)
    }
    filterTree(e, t, s) {
        let i = e.trim().toLowerCase().split(" "),
            r = [...t.values()].some(Boolean),
            o = c => {
                let l = [...c.tests[0].titlePath(), ...c.tests[0].tags].join(" ").toLowerCase();
                return !i.every(d => l.includes(d)) && !c.tests.some(d => s == null ? void 0 : s.has(d.id)) ? !1 : (c.children = c.children.filter(d => !r || (s == null ? void 0 : s.has(d.test.id)) || t.get(d.status)), c.tests = c.children.map(d => d.test), !!c.children.length)
            },
            a = c => {
                let l = [];
                for (let d of c.children) d.kind === "case" ? o(d) && l.push(d) : (a(d), (d.children.length || d.hasLoadErrors) && l.push(d));
                c.children = l
            };
        a(this.rootItem)
    }
    _fileItem(e, t) {
        if (e.length === 0) return this.rootItem;
        let s = e.join(this.pathSeparator),
            i = this._treeItemById.get(s);
        if (i) return i;
        let r = this._fileItem(e.slice(0, e.length - 1), !1),
            o = {
                kind: "group",
                subKind: t ? "file" : "folder",
                id: s,
                title: e[e.length - 1],
                location: {
                    file: s,
                    line: 0,
                    column: 0
                },
                duration: 0,
                parent: r,
                children: [],
                status: "none",
                hasLoadErrors: !1
            };
        return this._addChild(r, o), o
    }
    sortAndPropagateStatus() {
        Xi(this.rootItem)
    }
    flattenForSingleProject() {
        let e = t => {
            t.kind === "case" && t.children.length === 1 ? (t.project = t.children[0].project, t.test = t.children[0].test, t.children = [], this._treeItemByTestId.set(t.test.id, t)) : t.children.forEach(e)
        };
        e(this.rootItem)
    }
    shortenRoot() {
        let e = this.rootItem;
        for (; e.children.length === 1 && e.children[0].kind === "group" && e.children[0].subKind === "folder";) e = e.children[0];
        e.location = this.rootItem.location, this.rootItem = e
    }
    testIds() {
        let e = new Set,
            t = s => {
                s.kind === "case" && s.tests.forEach(i => e.add(i.id)), s.children.forEach(t)
            };
        return t(this.rootItem), e
    }
    fileNames() {
        let e = new Set,
            t = s => {
                s.kind === "group" && s.subKind === "file" ? e.add(s.id) : s.children.forEach(t)
            };
        return t(this.rootItem), [...e]
    }
    flatTreeItems() {
        let e = [],
            t = s => {
                e.push(s), s.children.forEach(t)
            };
        return t(this.rootItem), e
    }
    treeItemById(e) {
        return this._treeItemById.get(e)
    }
    collectTestIds(e) {
        return e ? Gt(e) : new Set
    }
};

function Xi(n) {
    for (let o of n.children) Xi(o);
    n.kind === "group" && n.children.sort((o, a) => o.location.file.localeCompare(a.location.file) || o.location.line - a.location.line);
    let e = n.children.length > 0,
        t = n.children.length > 0,
        s = !1,
        i = !1,
        r = !1;
    for (let o of n.children) t = t && o.status === "skipped", e = e && (o.status === "passed" || o.status === "skipped"), s = s || o.status === "failed", i = i || o.status === "running", r = r || o.status === "scheduled";
    i ? n.status = "running" : r ? n.status = "scheduled" : s ? n.status = "failed" : t ? n.status = "skipped" : e && (n.status = "passed")
}

function Gt(n) {
    let e = new Set,
        t = s => {
            var i;
            s.kind === "case" ? s.tests.map(r => r.id).forEach(r => e.add(r)) : s.kind === "test" ? e.add(s.id) : (i = s.children) == null || i.forEach(t)
        };
    return t(n), e
}
var Yi = Symbol("statusEx");
var Xe = class extends O {
    constructor(t, s, i) {
        super();
        this._testGeneration = "";
        this._rootItems = new Map;
        this._testItemByTestId = new Map;
        this._testItemByFile = new Map;
        this._vscode = t, this._models = s, this._testController = i, this._loadingItem = this._testController.createTestItem("loading", "Loading\u2026"), this._disposables = [s.onUpdated(() => this._update())]
    }
    startedLoading() {
        var t;
        this._testGeneration = te() + ":", this._testController.items.replace([]), this._testItemByTestId.clear(), this._testItemByFile.clear(), (t = this._vscode.workspace.workspaceFolders) != null && t.length && this._testController.items.replace([this._loadingItem])
    }
    finishedLoading() {
        this._loadingItem.parent ? this._loadingItem.parent.children.delete(this._loadingItem.id) : this._testController.items.get(this._loadingItem.id) && this._testController.items.delete(this._loadingItem.id)
    }
    collectTestsInside(t) {
        let s = [],
            i = r => {
                let o = r[Ye];
                !r || (((o == null ? void 0 : o.kind) === "case" || (o == null ? void 0 : o.kind) === "test") && o.test ? s.push(r) : r.children.forEach(i))
            };
        return i(t), s
    }
    _update() {
        var t;
        for (let s of (t = this._vscode.workspace.workspaceFolders) != null ? t : []) {
            let i = new M("", "root");
            for (let a of this._models.enabledModels().filter(c => c.config.workspaceFolder === s.uri.fsPath))
                for (let c of a.enabledProjects()) i.suites.push(c.suite);
            let r = new Ze(s.uri.fsPath, i, [], void 0, $t.default.sep);
            if (r.sortAndPropagateStatus(), r.flattenForSingleProject(), r.rootItem.children.length === 0) {
                this._deleteRootItem(s.uri.fsPath);
                continue
            }
            let o = this._createRootItemIfNeeded(s.uri);
            this._syncSuite(r.rootItem, o)
        }
        for (let s of this._rootItems.keys()) this._vscode.workspace.workspaceFolders.find(i => i.uri.fsPath === s) || this._deleteRootItem(s);
        this._indexTree()
    }
    _syncSuite(t, s) {
        let i = t.children,
            r = s.children,
            o = new Map(i.map(c => [c.id, c])),
            a = new Map;
        r.forEach(c => {
            c.id.startsWith(this._testGeneration) && a.set(c.id.substring(this._testGeneration.length), c)
        });
        for (let c of a.keys()) o.has(c) || (r.delete(this._idWithGeneration(c)), a.delete(c));
        for (let [c, l] of o) {
            let d = a.get(c);
            d || (d = this._testController.createTestItem(this._idWithGeneration(c), l.title, this._vscode.Uri.file(l.location.file)), l.kind === "group" && l.subKind === "file" && !l.children.length && (d.canResolveChildren = !0), a.set(c, d), r.add(d)), d[Ye] = l, l.kind === "case" && !_o(l.tags, d.tags) && (d.tags = l.tags.map(p => new this._vscode.TestTag(p)));
            let h = l.location.line || l.location.column;
            if (h && (!d.range || d.range.start.line + 1 !== l.location.line)) {
                let p = l.location.line;
                d.range = new this._vscode.Range(Math.max(p - 1, 0), 0, p, 0)
            } else h && !d.range && (d.range = void 0)
        }
        for (let [c, l] of o) {
            let d = a.get(c);
            this._syncSuite(l, d)
        }
    }
    _indexTree() {
        this._testItemByTestId.clear(), this._testItemByFile.clear();
        let t = s => {
            let i = s[Ye];
            ((i == null ? void 0 : i.kind) === "case" || (i == null ? void 0 : i.kind) === "test") && i.test && this._testItemByTestId.set(i.test.id, s);
            for (let [, r] of s.children) t(r);
            s.uri && !s.range && this._testItemByFile.set(s.uri.fsPath, s)
        };
        for (let s of this._rootItems.values()) t(s)
    }
    _createRootItemIfNeeded(t) {
        if (this._rootItems.has(t.fsPath)) return this._rootItems.get(t.fsPath);
        let s;
        return this._vscode.workspace.workspaceFolders.length === 1 ? s = {
            id: this._idWithGeneration(t.fsPath),
            uri: t,
            children: this._testController.items,
            parent: void 0,
            tags: [],
            canResolveChildren: !1,
            busy: !1,
            label: "<root>",
            range: void 0,
            error: void 0
        } : (s = this._testController.createTestItem(this._idWithGeneration(t.fsPath), $t.default.basename(t.fsPath), this._vscode.Uri.file(t.fsPath)), this._testController.items.add(s)), this._rootItems.set(t.fsPath, s), s
    }
    _deleteRootItem(t) {
        this._testController.items.delete(this._idWithGeneration(t)), this._rootItems.delete(t)
    }
    testItemForTest(t) {
        return this._testItemByTestId.get(t.id)
    }
    testItemForFile(t) {
        return this._testItemByFile.get(t)
    }
    _idWithGeneration(t) {
        return this._testGeneration + t
    }
};

function _o(n, e) {
    if (n.length !== e.length) return !1;
    let t = new Set(n);
    for (let s of e)
        if (!t.has(s.id)) return !1;
    return !0
}

function er(n) {
    return n[Ye]
}
var Ye = Symbol("testTreeItemSymbol");
var tt = class {
    constructor(e, t, s, i, r) {
        this._projects = new Map;
        this._watches = new Set;
        this._fileToSources = new Map;
        this._sourceToFile = new Map;
        this.isEnabled = !1;
        this._errorByFile = new ze;
        this._filesWithListedTests = new Set;
        this._ranGlobalSetup = !1;
        this._startedDevServer = !1;
        this._vscode = e, this._options = r, this.config = {
            ...i,
            workspaceFolder: t,
            configFile: s
        }, this._useLegacyCLIDriver = i.version < 1.44, this._playwrightTest = this._useLegacyCLIDriver ? new Ke(e, this, r) : new Qe(e, this, r), this._didUpdate = new e.EventEmitter, this.onUpdated = this._didUpdate.event, this.tag = new this._vscode.TestTag(this.config.configFile)
    }
    reset() {
        var e, t;
        clearTimeout((e = this._filesPendingListTests) == null ? void 0 : e.timer), (t = this._filesPendingListTests) == null || t.finishedCallback(), delete this._filesPendingListTests, this._projects.clear(), this._fileToSources.clear(), this._sourceToFile.clear(), this._errorByFile.clear(), this._playwrightTest.reset(), this._watches.clear(), this._ranGlobalSetup = !1
    }
    projects() {
        return [...this._projects.values()]
    }
    errors() {
        return this._errorByFile
    }
    projectMap() {
        return this._projects
    }
    testDirs() {
        return [...new Set([...this._projects.values()].map(e => e.project.testDir))]
    }
    enabledProjects() {
        return [...this._projects.values()].filter(e => e.isEnabled)
    }
    enabledProjectsFilter() {
        return [...this._projects.values()].some(t => !t.isEnabled) ? this.enabledProjects().map(t => t.name) : []
    }
    enabledFiles() {
        let e = new Set;
        for (let t of this.enabledProjects()) {
            let s = et(t);
            for (let i of s.keys()) e.add(i)
        }
        return e
    }
    async _listFiles() {
        var s, i, r, o;
        this._filesWithListedTests.clear();
        let e;
        try {
            e = await this._playwrightTest.listFiles();
            for (let a of e.projects) a.files = a.files.map(c => this._vscode.Uri.file(c).fsPath);
            (s = e.error) != null && s.location && (e.error.location.file = this._vscode.Uri.file(e.error.location.file).fsPath)
        } catch (a) {
            e = {
                error: {
                    location: {
                        file: this.config.configFile,
                        line: 0,
                        column: 0
                    },
                    message: a.message
                },
                projects: []
            }
        }
        if ((i = e.error) != null && i.location) {
            this._errorByFile.set((r = e.error) == null ? void 0 : r.location.file, e.error), this._didUpdate.fire();
            return
        }
        for (let a of e.projects) {
            let c = [];
            for (let l of a.files) c.push(...await As(l, this._fileToSources, this._sourceToFile));
            a.files = c, this.config.testIdAttributeName = (o = a.use) == null ? void 0 : o.testIdAttribute
        }
        let t = new Set;
        for (let a of e.projects) {
            t.add(a.name);
            let c = this._projects.get(a.name);
            c || (c = this._createProject(a)), this._updateProjectFiles(c, a)
        }
        for (let a of this._projects.keys()) t.has(a) || this._projects.delete(a);
        this._didUpdate.fire()
    }
    _createProject(e) {
        let t = new M(e.name, "project");
        t._project = {
            dependencies: [],
            grep: ".*",
            grepInvert: null,
            metadata: {},
            name: e.name,
            outputDir: "",
            repeatEach: 0,
            retries: 0,
            snapshotDir: "",
            testDir: e.testDir,
            testIgnore: [],
            testMatch: ".*",
            timeout: 0,
            use: e.use
        };
        let s = {
            model: this,
            name: e.name,
            suite: t,
            project: t._project,
            isEnabled: !1
        };
        return this._projects.set(s.name, s), s
    }
    _updateProjectFiles(e, t) {
        let s = new Set,
            i = et(e);
        for (let r of t.files)
            if (s.add(r), !i.get(r)) {
                let a = new M(r, "file");
                a.location = {
                    file: r,
                    line: 0,
                    column: 0
                }, a[mo] = !0, i.set(r, a)
            } for (let r of i.keys()) s.has(r) || i.delete(r);
        e.suite.suites = [...i.values()]
    }
    async handleWorkspaceChange(e) {
        let t = [...new Set([...this._projects.values()].map(o => o.project.testDir))],
            s = this._mapFilesToSources(t, e.changed),
            i = this._mapFilesToSources(t, e.created),
            r = this._mapFilesToSources(t, e.deleted);
        if ((i.length || r.length) && await this._listFiles(), s.length) {
            let o = s.filter(a => this._filesWithListedTests.has(a));
            for (let a of o) this._filesWithListedTests.delete(a);
            await this.ensureTests(o)
        }
    }
    testFilesChanged(e) {
        if (!this._watches.size || !e.length) return;
        let t = this.enabledFiles(),
            s = [],
            i = [];
        for (let r of this._watches || [])
            for (let o of e) {
                if (!r.include) {
                    s.push(o);
                    continue
                }
                for (let a of r.include)
                    if (!!a.uri && !!t.has(a.uri.fsPath)) {
                        if (o.startsWith(a.uri.fsPath + le.default.sep)) {
                            s.push(o);
                            continue
                        }
                        if (o === a.uri.fsPath && !a.range) {
                            i.push(a);
                            continue
                        }
                        if (o === a.uri.fsPath && a.range) {
                            i.push(a);
                            continue
                        }
                    }
            }
        this._options.requestWatchRun(s, i)
    }
    async ensureTests(e) {
        let t = this.enabledFiles(),
            s = e.filter(i => t.has(i) && !this._filesWithListedTests.has(i));
        if (!!s.length) {
            for (let i of s) this._filesWithListedTests.add(i);
            if (!this._filesPendingListTests) {
                let i, r = new Promise(c => i = c),
                    o = new Set,
                    a = setTimeout(async () => {
                        delete this._filesPendingListTests, await this._listTests([...o]).catch(c => console.log(c)), i()
                    }, 100);
                this._filesPendingListTests = {
                    files: o,
                    finishedCallback: i,
                    promise: r,
                    timer: a
                }
            }
            for (let i of s) this._filesPendingListTests.files.add(i);
            return this._filesPendingListTests.promise
        }
    }
    async _listTests(e) {
        let t = [],
            s;
        await this._playwrightTest.listTests(e, {
            onBegin: i => {
                s = i
            },
            onError: i => {
                t.push(i)
            }
        }, new this._vscode.CancellationTokenSource().token), this._updateProjects(s.suites, e, t)
    }
    _updateProjects(e, t, s) {
        for (let i of t) this._errorByFile.deleteAll(i);
        for (let i of s) i.location && this._errorByFile.set(i.location.file, i);
        for (let [i, r] of this._projects) {
            let o = et(r),
                a = e.find(l => l.project().name === i),
                c = new Set(t);
            for (let l of (a == null ? void 0 : a.suites) || []) this._errorByFile.has(l.location.file) || (c.delete(l.location.file), o.set(l.location.file, l));
            for (let l of c) {
                let d = o.get(l);
                d && (d.suites = [], d.tests = [])
            }
            r.suite.suites = [...o.values()]
        }
        this._didUpdate.fire()
    }
    updateFromRunningProjects(e) {
        for (let t of e) {
            let s = this._projects.get(t.project().name);
            s && this._updateFromRunningProject(s, t)
        }
    }
    _updateFromRunningProject(e, t) {
        let s = et(e);
        for (let i of t.suites) {
            if (!i.allTests().length) continue;
            this._filesWithListedTests.add(i.location.file);
            let r = s.get(i.location.file);
            (!r || !r.allTests().length) && s.set(i.location.file, i)
        }
        e.suite.suites = [...s.values()], this._didUpdate.fire()
    }
    canRunGlobalHooks(e) {
        return e === "setup" ? !this._useLegacyCLIDriver && !this._ranGlobalSetup : this._ranGlobalSetup
    }
    needsGlobalHooks(e) {
        return !!(e === "setup" && !this._ranGlobalSetup || e === "teardown" && this._ranGlobalSetup)
    }
    async runGlobalHooks(e, t) {
        if (!this.canRunGlobalHooks(e)) return "passed";
        if (e === "setup") {
            if (this._ranGlobalSetup) return "passed";
            let i = await this._playwrightTest.runGlobalHooks("setup", t);
            return i === "passed" && (this._ranGlobalSetup = !0), i
        }
        if (!this._ranGlobalSetup) return "passed";
        let s = await this._playwrightTest.runGlobalHooks("teardown", t);
        return this._ranGlobalSetup = !1, s
    }
    canStartDevServer() {
        return !this._useLegacyCLIDriver && !this._startedDevServer
    }
    canStopDevServer() {
        return this._startedDevServer
    }
    async startDevServer() {
        if (this._startedDevServer) return;
        await this._playwrightTest.startDevServer() === "passed" && (this._startedDevServer = !0)
    }
    async stopDevServer() {
        if (!this._startedDevServer) return;
        await this._playwrightTest.stopDevServer() === "passed" && (this._startedDevServer = !1)
    }
    async clearCache() {
        await this._playwrightTest.clearCache()
    }
    async runTests(e, t, s) {
        if (s != null && s.isCancellationRequested) return;
        let i = "passed";
        if (this.canRunGlobalHooks("setup") && (i = await this.runGlobalHooks("setup", t)), i !== "passed") return;
        let r = await this._options.runHooks.onWillRunTests(this.config, !1),
            o = this._options.settingsModel.showBrowser.get() && !!r.connectWsEndpoint,
            a, c;
        this._options.settingsModel.showTrace.get() && (a = "on"), this._options.settingsModel.showBrowser.get() && (a = "off", c = "off");
        let l = {
            headed: o && !this._options.isUnderTest,
            workers: o ? 1 : void 0,
            trace: a,
            video: c,
            reuseContext: o,
            connectWsEndpoint: o ? r.connectWsEndpoint : void 0
        };
        try {
            if (s != null && s.isCancellationRequested) return;
            await this._playwrightTest.runTests(e, l, t, s)
        } finally {
            await this._options.runHooks.onDidRunTests(!1)
        }
    }
    async debugTests(e, t, s) {
        if (s != null && s.isCancellationRequested || (await this.runGlobalHooks("teardown", t), s != null && s.isCancellationRequested)) return;
        let i = await this._options.runHooks.onWillRunTests(this.config, !0),
            r = {
                headed: !this._options.isUnderTest,
                workers: 1,
                video: "off",
                trace: "off",
                reuseContext: !1,
                connectWsEndpoint: i.connectWsEndpoint
            };
        try {
            if (s != null && s.isCancellationRequested) return;
            await this._playwrightTest.debugTests(e, r, t, s)
        } finally {
            await this._options.runHooks.onDidRunTests(!1)
        }
    }
    _mapFilesToSources(e, t) {
        let s = new Set;
        for (let i of t) {
            if (!e.some(o => i.startsWith(o + le.default.sep))) continue;
            let r = this._fileToSources.get(i);
            r ? r.forEach(o => s.add(o)) : s.add(i)
        }
        return [...s]
    }
    async addToWatch(e, t) {
        let s = {
            include: e
        };
        this._watches.add(s), t.onCancellationRequested(() => this._watches.delete(s));
        for (let r of e || [])
            for (let o of this._watches)
                for (let a of o.include || [])
                    if (vo(r, a)) {
                        this._watches.delete(o);
                        break
                    } let i = new Set;
        for (let r of this._watches) {
            if (!r.include) {
                for (let o of this.enabledFiles()) i.add(o);
                continue
            }
            for (let o of r.include) !o.uri || i.add(o.uri.fsPath)
        }
        await this._playwrightTest.watchFiles([...i])
    }
    narrowDownLocations(e) {
        if (!e.length) return {
            locations: []
        };
        let t = new Set,
            s = [];
        for (let i of e) {
            let r = er(i);
            if (r.kind === "group" && (r.subKind === "folder" || r.subKind === "file"))
                for (let o of this.enabledFiles()) (o === r.location.file || o.startsWith(r.location.file)) && t.add(r.location.file);
            else s.push(...Gt(r))
        }
        return {
            locations: t.size ? [...t] : null,
            testIds: s.length ? s : void 0
        }
    }
},
    st = class extends O {
        constructor(t, s) {
            super();
            this._models = [];
            this._context = s, this._didUpdate = new t.EventEmitter, this.onUpdated = this._didUpdate.event
        }
        setModelEnabled(t, s, i) {
            let r = this._models.find(o => o.config.configFile === t);
            !r || r.isEnabled !== s && (r.isEnabled = s, i && this._saveSettings(), r.reset(), this._loadModelIfNeeded(r).then(() => this._didUpdate.fire()))
        }
        setProjectEnabled(t, s, i) {
            let r = this._models.find(a => a.config.configFile === t);
            if (!r) return;
            let o = r.projectMap().get(s);
            !o || o.isEnabled !== i && (o.isEnabled = i, this._saveSettings(), this._didUpdate.fire())
        }
        testDirs() {
            let t = new Set;
            for (let s of this._models)
                for (let i of s.testDirs()) t.add(i);
            return t
        }
        async addModel(t) {
            this._models.push(t);
            let i = ((this._context.workspaceState.get(oe) || {}).configs || []).find(r => r.relativeConfigFile === le.default.relative(t.config.workspaceFolder, t.config.configFile));
            t.isEnabled = (i == null ? void 0 : i.enabled) || this._models.length === 1 && !i, await this._loadModelIfNeeded(t), this._disposables.push(t.onUpdated(() => this._didUpdate.fire())), this._didUpdate.fire()
        }
        async ensureHasEnabledModels() {
            this._models.length && !this.hasEnabledModels() && this.setModelEnabled(this._models[0].config.configFile, !1)
        }
        async _loadModelIfNeeded(t) {
            if (!t.isEnabled) return;
            await t._listFiles();
            let i = ((this._context.workspaceState.get(oe) || {}).configs || []).find(r => r.relativeConfigFile === le.default.relative(t.config.workspaceFolder, t.config.configFile));
            if (i) {
                let r = !0;
                for (let o of t.projects()) {
                    let a = i.projects.find(c => c.name === o.name);
                    a ? o.isEnabled = a.enabled : r && (o.isEnabled = !0), r = !1
                }
            } else t.projects().length && (t.projects()[0].isEnabled = !0)
        }
        hasEnabledModels() {
            return !!this.enabledModels().length
        }
        versions() {
            let t = new Map;
            for (let s of this._models) t.set(s.config.version, s);
            return t
        }
        clear() {
            this.dispose();
            for (let t of this._models) t.reset();
            this._models = [], this._didUpdate.fire()
        }
        enabledModels() {
            return this._models.filter(t => t.isEnabled)
        }
        models() {
            return this._models
        }
        selectedModel() {
            let t = this.enabledModels();
            if (!t.length) {
                this._selectedConfigFile = void 0;
                return
            }
            let s = t.find(i => i.config.configFile === this._selectedConfigFile);
            return s || (this._selectedConfigFile = t[0].config.configFile, t[0])
        }
        selectModel(t) {
            this._selectedConfigFile = t, this._saveSettings(), this._didUpdate.fire()
        }
        _saveSettings() {
            let t = {
                configs: []
            };
            for (let s of this._models) t.configs.push({
                relativeConfigFile: le.default.relative(s.config.workspaceFolder, s.config.configFile),
                selected: s.config.configFile === this._selectedConfigFile,
                enabled: s.isEnabled,
                projects: s.projects().map(i => ({
                    name: i.name,
                    enabled: i.isEnabled
                }))
            });
            this._context.workspaceState.update(oe, t)
        }
    };

function et(n) {
    let e = new Map;
    for (let t of n.suite.suites) e.set(t.location.file, t);
    return e
}
var mo = Symbol("listFilesFlag");

function vo(n, e) {
    for (; e.parent;) {
        if (e.parent === n) return !0;
        e = e.parent
    }
    return !1
}
var tr = m(require("path")),
    it = class {
        constructor(e, t) {
            this._folderWatchers = new Map;
            this._vscode = e, this._handler = t
        }
        setWatchFolders(e) {
            for (let t of e) {
                if (this._folderWatchers.has(t)) continue;
                let s = this._vscode.workspace.createFileSystemWatcher(t + tr.default.sep + "**"),
                    i = [s.onDidCreate(r => {
                        r.scheme === "file" && this._change().created.add(r.fsPath)
                    }), s.onDidChange(r => {
                        r.scheme === "file" && this._change().changed.add(r.fsPath)
                    }), s.onDidDelete(r => {
                        r.scheme === "file" && this._change().deleted.add(r.fsPath)
                    }), s];
                this._folderWatchers.set(t, i)
            }
            for (let [t, s] of this._folderWatchers) e.has(t) || (s.forEach(i => i.dispose()), this._folderWatchers.delete(t))
        }
        _change() {
            return this._pendingChange || (this._pendingChange = {
                created: new Set,
                changed: new Set,
                deleted: new Set
            }), this._timeout && clearTimeout(this._timeout), this._timeout = setTimeout(() => this._reportChange(), 50), this._pendingChange
        }
        _reportChange() {
            delete this._timeout, this._handler(this._pendingChange), this._pendingChange = void 0
        }
        dispose() {
            this._timeout && clearTimeout(this._timeout);
            for (let e of this._folderWatchers.values()) e.forEach(t => t.dispose());
            this._folderWatchers.clear()
        }
    };
var sr = require("child_process");
var rt = class {
    constructor(e, t, s) {
        this._disposables = [];
        this._vscode = e, this._envProvider = s, this._settingsModel = t, this._disposables.push(t.showTrace.onChange(i => {
            !i && this._traceViewerProcess && this.close().catch(() => { })
        }))
    }
    async willRunTests(e) {
        this._settingsModel.showTrace.get() && await this._startIfNeeded(e)
    }
    async open(e, t) {
        var s, i;
        !this._settingsModel.showTrace.get() || !this._checkVersion(t) || !e && !this._traceViewerProcess || (await this._startIfNeeded(t), (i = (s = this._traceViewerProcess) == null ? void 0 : s.stdin) == null || i.write(e + `
`))
    }
    dispose() {
        this.close().catch(() => { });
        for (let e of this._disposables) e.dispose();
        this._disposables = []
    }
    async _startIfNeeded(e) {
        var r, o;
        let t = await $(this._vscode, e.workspaceFolder);
        if (this._traceViewerProcess) return;
        let s = [e.cli, "show-trace", "--stdin"];
        this._vscode.env.remoteName && (s.push("--host", "0.0.0.0"), s.push("--port", "0"));
        let i = (0, sr.spawn)(t, s, {
            cwd: e.workspaceFolder,
            stdio: "pipe",
            detached: !0,
            env: {
                ...process.env,
                ...this._envProvider()
            }
        });
        this._traceViewerProcess = i, (r = i.stdout) == null || r.on("data", a => console.log(a.toString())), (o = i.stderr) == null || o.on("data", a => console.log(a.toString())), i.on("exit", () => {
            this._traceViewerProcess = void 0
        }), i.on("error", a => {
            this._vscode.window.showErrorMessage(a.message), this.close().catch(() => { })
        })
    }
    _checkVersion(e, t = this._vscode.l10n.t("this feature")) {
        return e.version < 1.35 ? (this._vscode.window.showWarningMessage(this._vscode.l10n.t("Playwright v1.35+ is required for {0} to work, v{1} found", t, e.version)), !1) : !0
    }
    async close() {
        var e, t;
        (t = (e = this._traceViewerProcess) == null ? void 0 : e.stdin) == null || t.end(), this._traceViewerProcess = void 0
    }
};

function ir(n) {
    return n.window.registerTerminalLinkProvider({
        provideTerminalLinks: (e, t) => {
            let s = /(npx|pnpm exec|yarn) playwright (show-report|show-trace).*$/,
                i = e.line.match(s);
            return i ? [{
                command: i[0],
                startIndex: i.index,
                length: i[0].length,
                tooltip: "Show HTML report"
            }] : []
        },
        handleTerminalLink: e => {
            let t = n.window.activeTerminal;
            t && t.sendText(e.command)
        }
    })
}
var To = new rr.default({
    cwd: "/ensure_absolute_paths"
});
async function yo(n) {
    new at(require("vscode"), n).activate()
}
var at = class {
    constructor(e, t) {
        this._disposables = [];
        this._activeSteps = new Map;
        this._completedSteps = new Map;
        this._playwrightTestLog = [];
        this._commandQueue = Promise.resolve();
        this.overridePlaywrightVersion = null;
        this._vscode = e, this._context = t, this._isUnderTest = !!this._vscode.isUnderTest, this._activeStepDecorationType = this._vscode.window.createTextEditorDecorationType({
            isWholeLine: !0,
            backgroundColor: {
                id: "editor.wordHighlightStrongBackground"
            },
            borderColor: {
                id: "editor.wordHighlightStrongBorder"
            },
            after: {
                color: {
                    id: "editorCodeLens.foreground"
                },
                contentText: " \u2014 \u231Bwaiting\u2026"
            }
        }), this._completedStepDecorationType = this._vscode.window.createTextEditorDecorationType({
            isWholeLine: !0,
            after: {
                color: {
                    id: "editorCodeLens.foreground"
                }
            }
        }), this._settingsModel = new Ge(e, t), this._models = new st(e, t), this._reusedBrowser = new He(this._vscode, this._settingsModel, this._envProvider.bind(this)), this._traceViewer = new rt(this._vscode, this._settingsModel, this._envProvider.bind(this)), this._testController = e.tests.createTestController("playwright", "Playwright"), this._testController.resolveHandler = i => this._resolveChildren(i), this._testController.refreshHandler = () => this._rebuildModels(!0).then(() => { });
        let s = !0;
        this._runProfile = this._testController.createRunProfile("playwright-run", this._vscode.TestRunProfileKind.Run, this._handleTestRun.bind(this, !1), !0, void 0, s), this._debugProfile = this._testController.createRunProfile("playwright-debug", this._vscode.TestRunProfileKind.Debug, this._handleTestRun.bind(this, !0), !0, void 0, s), this._testTree = new Xe(e, this._models, this._testController), this._debugHighlight = new Me(e, this._reusedBrowser), this._debugHighlight.onErrorInDebugger(i => this._errorInDebugger(i.error, i.location)), this._workspaceObserver = new it(this._vscode, i => this._workspaceChanged(i)), this._diagnostics = this._vscode.languages.createDiagnosticCollection("pw.testErrors.diagnostic"), this._treeItemObserver = new Jt(this._vscode)
    }
    async onWillRunTests(e, t) {
        return await this._reusedBrowser.onWillRunTests(e, t), {
            connectWsEndpoint: this._reusedBrowser.browserServerWSEndpoint()
        }
    }
    async onDidRunTests(e) {
        await this._reusedBrowser.onDidRunTests(e)
    }
    reusedBrowserForTest() {
        return this._reusedBrowser
    }
    dispose() {
        var e;
        for (let t of this._disposables) (e = t == null ? void 0 : t.dispose) == null || e.call(t)
    }
    async activate() {
        let e = this._vscode;
        this._settingsView = new $e(e, this._settingsModel, this._models, this._reusedBrowser, this._context.extensionUri);
        let t = this._vscode.l10n.t("No Playwright tests found.");
        this._disposables = [this._debugHighlight, this._settingsModel, e.workspace.onDidChangeWorkspaceFolders(r => {
            this._rebuildModels(!1)
        }), e.window.onDidChangeVisibleTextEditors(() => {
            this._updateVisibleEditorItems()
        }), e.commands.registerCommand("pw.extension.install", async () => {
            await fs(this._vscode)
        }), e.commands.registerCommand("pw.extension.installBrowsers", async () => {
            if (!this._models.hasEnabledModels()) {
                e.window.showWarningMessage(t);
                return
            }
            let r = this._models.versions();
            for (let o of r.values()) await Fe(this._vscode, o)
        }), e.commands.registerCommand("pw.extension.command.inspect", async () => {
            if (!this._models.hasEnabledModels()) {
                e.window.showWarningMessage(t);
                return
            }
            await this._reusedBrowser.inspect(this._models)
        }), e.commands.registerCommand("pw.extension.command.closeBrowsers", () => {
            this._reusedBrowser.closeAllBrowsers()
        }), e.commands.registerCommand("pw.extension.command.recordNew", async () => {
            if (!this._models.hasEnabledModels()) {
                e.window.showWarningMessage(t);
                return
            }
            await this._reusedBrowser.record(this._models, !0)
        }), e.commands.registerCommand("pw.extension.command.recordAtCursor", async () => {
            if (!this._models.hasEnabledModels()) {
                e.window.showWarningMessage(t);
                return
            }
            await this._reusedBrowser.record(this._models, !1)
        }), e.commands.registerCommand("pw.extension.command.toggleModels", async () => {
            this._settingsView.toggleModels()
        }), e.commands.registerCommand("pw.extension.command.runGlobalSetup", async () => {
            await this._queueGlobalHooks("setup"), this._settingsView.updateActions()
        }), e.commands.registerCommand("pw.extension.command.runGlobalTeardown", async () => {
            await this._queueGlobalHooks("teardown"), this._settingsView.updateActions()
        }), e.commands.registerCommand("pw.extension.command.startDevServer", async () => {
            var r;
            await ((r = this._models.selectedModel()) == null ? void 0 : r.startDevServer()), this._settingsView.updateActions()
        }), e.commands.registerCommand("pw.extension.command.stopDevServer", async () => {
            var r;
            await ((r = this._models.selectedModel()) == null ? void 0 : r.stopDevServer()), this._settingsView.updateActions()
        }), e.commands.registerCommand("pw.extension.command.clearCache", async () => {
            var r;
            await ((r = this._models.selectedModel()) == null ? void 0 : r.clearCache())
        }), e.workspace.onDidChangeTextDocument(() => {
            this._completedSteps.size && (this._completedSteps.clear(), this._executionLinesChanged())
        }), e.workspace.onDidChangeConfiguration(r => {
            r.affectsConfiguration("playwright.env") && this._rebuildModels(!1)
        }), this._models.onUpdated(() => this._modelsUpdated()), this._treeItemObserver.onTreeItemSelected(r => this._treeItemSelected(r)), this._settingsView, this._testController, this._runProfile, this._debugProfile, this._workspaceObserver, this._reusedBrowser, this._diagnostics, this._treeItemObserver, ir(this._vscode)];
        let s = [this._vscode.workspace.createFileSystemWatcher("**/*playwright*.config.{ts,js,mjs}"), this._vscode.workspace.createFileSystemWatcher("**/*.env*")];
        this._disposables.push(...s);
        let i = r => {
            r.fsPath.includes("node_modules") || !this._isUnderTest && r.fsPath.includes("test-results") || this._rebuildModels(!1)
        };
        await this._rebuildModels(!1), s.map(r => r.onDidChange(i)), s.map(r => r.onDidCreate(i)), s.map(r => r.onDidDelete(i)), this._context.subscriptions.push(this)
    }
    async _rebuildModels(e) {
        this._commandQueue = Promise.resolve(), this._models.clear(), this._testTree.startedLoading();
        let t = await this._vscode.workspace.findFiles("**/*playwright*.config.{ts,js,mjs}", "**/node_modules/**");
        for (let s of t) {
            let i = s.fsPath;
            if (!this._isUnderTest && i.includes("test-results")) continue;
            let o = this._vscode.workspace.getWorkspaceFolder(s).uri.fsPath;
            if (i.includes("test-results") && !o.includes("test-results")) continue;
            let a = null;
            try {
                a = await Us(this._vscode, o, i, this._envProvider())
            } catch (d) {
                e && this._vscode.window.showWarningMessage(d instanceof ge ? d.message : this._vscode.l10n.t("Please install Playwright Test via running `npm i --save-dev @playwright/test`")), console.error("[Playwright Test]:", d == null ? void 0 : d.message);
                continue
            }
            let c = 1.38;
            if (a.version < c) {
                e && this._vscode.window.showWarningMessage(this._vscode.l10n.t("Playwright Test v{0} or newer is required", c));
                continue
            }
            this.overridePlaywrightVersion && (a.version = this.overridePlaywrightVersion);
            let l = new tt(this._vscode, o, s.fsPath, a, {
                playwrightTestLog: this._playwrightTestLog,
                settingsModel: this._settingsModel,
                runHooks: this,
                isUnderTest: this._isUnderTest,
                envProvider: this._envProvider.bind(this),
                onStdOut: this._debugHighlight.onStdOut.bind(this._debugHighlight),
                requestWatchRun: this._runWatchedTests.bind(this)
            });
            await this._models.addModel(l)
        }
        return await this._models.ensureHasEnabledModels(), this._testTree.finishedLoading(), t
    }
    _modelsUpdated() {
        this._updateVisibleEditorItems(), this._updateDiagnostics(), this._workspaceObserver.setWatchFolders(this._models.testDirs())
    }
    _envProvider() {
        let e = this._vscode.workspace.getConfiguration("playwright").get("env", {});
        return Object.fromEntries(Object.entries(e).map(t => typeof t[1] == "string" ? t : [t[0], JSON.stringify(t[1])]))
    }
    async _handleTestRun(e, t, s) {
        if (!(this._testRun && !t.continuous) && (await this._queueTestRun(t.include, e ? "debug" : "run"), t.continuous))
            for (let i of this._models.enabledModels()) i.addToWatch(t.include, s)
    }
    async _queueTestRun(e, t) {
        await this._queueCommand(() => this._runTests(e, t), void 0)
    }
    async _queueGlobalHooks(e) {
        return await this._queueCommand(() => this._runGlobalHooks(e), "failed")
    }
    async _runGlobalHooks(e) {
        var r, o;
        if (!((r = this._models.selectedModel()) != null && r.needsGlobalHooks(e))) return "passed";
        let t = new this._vscode.TestRunRequest,
            s = this._testController.createTestRun(t),
            i = this._errorReportingListener(s);
        try {
            return await ((o = this._models.selectedModel()) == null ? void 0 : o.runGlobalHooks(e, i)) || "failed"
        } finally {
            s.end()
        }
    }
    async _runTests(e, t) {
        this._completedSteps.clear(), this._executionLinesChanged();
        let s = [];
        this._testController.items.forEach(l => s.push(l));
        let i = new this._vscode.TestRunRequest(s, [], void 0, t === "watch"),
            r = e == null ? void 0 : e[0];
        if (!r) {
            for (let l of s)
                if (!!l.children.size && (l.children.forEach(d => {
                    r || (r = d)
                }), r)) break
        }
        this._testRun = this._testController.createTestRun(i);
        let o = [],
            a = e != null && e.length ? e : s;
        for (let l of a)
            for (let d of this._testTree.collectTestsInside(l)) this._testRun.enqueued(d), o.push(d);
        let c = e ? [...e] : [];
        try {
            for (let l of this._models.enabledModels()) {
                let d = l.narrowDownLocations(c);
                !d.testIds && !d.locations || !l.enabledProjects().length || await this._runTest(this._testRun, c, r, new Set, l, t === "debug", o.length === 1)
            }
        } finally {
            this._activeSteps.clear(), this._executionLinesChanged(), this._testRun.end(), this._testRun = void 0
        }
    }
    async _resolveChildren(e) {
        !e || await this._ensureTestsInAllModels([e.uri.fsPath])
    }
    async _workspaceChanged(e) {
        await this._queueCommand(async () => {
            for (let t of this._models.enabledModels()) await t.handleWorkspaceChange(e)
        }, void 0), await this._updateVisibleEditorItems()
    }
    async _runTest(e, t, s, i, r, o, a) {
        let c = {
            ...this._errorReportingListener(e, s),
            onBegin: l => {
                r.updateFromRunningProjects(l.suites);
                for (let d of l.allTests()) {
                    let h = this._testTree.testItemForTest(d);
                    h && e.enqueued(h)
                }
            },
            onTestBegin: (l, d) => {
                let h = this._testTree.testItemForTest(l);
                if (h) {
                    e.started(h);
                    let g = `${So(l).outputDir}/.playwright-artifacts-${d.workerIndex}/traces/${l.id}.json`;
                    h[nt] = g
                }
                h && a && this._showTrace(h), o && (this._testItemUnderDebug = h)
            },
            onTestEnd: (l, d) => {
                var g;
                this._testItemUnderDebug = void 0, this._activeSteps.clear(), this._executionLinesChanged();
                let h = this._testTree.testItemForTest(l);
                if (!h) return;
                let p = ((g = d.attachments.find(u => u.name === "trace")) == null ? void 0 : g.path) || "";
                if (h[nt] = p, a && this._showTrace(h), d.status === l.expectedStatus) {
                    i.has(h) || (d.status === "skipped" ? e.skipped(h) : e.passed(h, d.duration));
                    return
                }
                i.add(h), e.failed(h, d.errors.map(u => this._testMessageForTestError(u, h)), d.duration)
            },
            onStepBegin: (l, d, h) => {
                var g;
                if (!h.location) return;
                let p = this._activeSteps.get(h);
                p || (p = {
                    location: new this._vscode.Location(this._vscode.Uri.file(h.location.file), new this._vscode.Position(h.location.line - 1, ((g = h.location) == null ? void 0 : g.column) - 1)),
                    activeCount: 0,
                    duration: 0
                }, this._activeSteps.set(h, p)), ++p.activeCount, this._executionLinesChanged()
            },
            onStepEnd: (l, d, h) => {
                if (!h.location) return;
                let p = this._activeSteps.get(h);
                !p || (--p.activeCount, p.duration = h.duration, this._completedSteps.set(h, p), p.activeCount === 0 && this._activeSteps.delete(h), this._executionLinesChanged())
            }
        };
        o ? await r.debugTests(t, c, e.token) : (await this._traceViewer.willRunTests(r.config), await r.runTests(t, c, e.token))
    }
    _errorReportingListener(e, t) {
        return {
            onStdOut: i => {
                e.appendOutput(i.toString().replace(/\n/g, `\r
`))
            },
            onStdErr: i => {
                e.appendOutput(i.toString().replace(/\n/g, `\r
`))
            },
            onError: i => {
                t ? (e.started(t), e.failed(t, this._testMessageForTestError(i), 0)) : i.location ? e.appendOutput(i.message || i.value || "", new this._vscode.Location(this._vscode.Uri.file(i.location.file), new this._vscode.Position(i.location.line - 1, i.location.column - 1))) : e.appendOutput(i.message || i.value || "")
            }
        }
    }
    async _runWatchedTests(e, t) {
        if (e.length) {
            let s = e.map(i => this._testTree.testItemForFile(i)).filter(Boolean);
            await this._queueTestRun(s, "watch")
        }
        t.length && await this._queueTestRun(t, "watch")
    }
    async _updateVisibleEditorItems() {
        let e = this._vscode.window.visibleTextEditors.map(t => t.document.uri.fsPath);
        await this._ensureTestsInAllModels(e)
    }
    async _ensureTestsInAllModels(e) {
        await this._queueCommand(async () => {
            for (let t of this._models.enabledModels()) await t.ensureTests(e)
        }, void 0)
    }
    _updateDiagnostics() {
        this._diagnostics.clear();
        let e = new Map,
            t = s => {
                var o, a;
                if (!s.location) return;
                let i = e.get(s.location.file);
                i || (i = new Map, e.set(s.location.file, i));
                let r = `${(o = s.location) == null ? void 0 : o.line}:${(a = s.location) == null ? void 0 : a.column}:${s.message}`;
                i.has(r) || i.set(r, {
                    severity: this._vscode.DiagnosticSeverity.Error,
                    source: "playwright",
                    range: new this._vscode.Range(Math.max(s.location.line - 1, 0), Math.max(s.location.column - 1, 0), s.location.line, 0),
                    message: s.message
                })
            };
        for (let s of this._models.enabledModels())
            for (let i of s.errors().values()) t(i);
        for (let [s, i] of e) this._diagnostics.set(this._vscode.Uri.file(s), [...i.values()])
    }
    _errorInDebugger(e, t) {
        if (!this._testRun || !this._testItemUnderDebug) return;
        let s = this._testMessageFromText(e),
            i = new this._vscode.Position(t.line - 1, t.column - 1);
        s.location = new this._vscode.Location(this._vscode.Uri.file(t.file), i), this._testRun.failed(this._testItemUnderDebug, s), this._testItemUnderDebug = void 0
    }
    _executionLinesChanged() {
        let e = [...this._activeSteps.values()],
            t = [...this._completedSteps.values()];
        for (let s of this._vscode.window.visibleTextEditors) {
            let i = [];
            for (let {
                location: o
            }
                of e) o.uri.fsPath === s.document.uri.fsPath && i.push({
                    range: o.range
                });
            let r = [];
            for (let {
                location: o,
                duration: a
            }
                of t) o.uri.fsPath === s.document.uri.fsPath && r.push({
                    range: o.range,
                    renderOptions: {
                        after: {
                            contentText: ` \u2014 ${a}ms`
                        }
                    }
                });
            s.setDecorations(this._activeStepDecorationType, i), s.setDecorations(this._completedStepDecorationType, r)
        }
    }
    _testMessageFromText(e) {
        let t = !1,
            s = [],
            i = [];
        for (let o of e.split(`
`)) {
            if (o.startsWith("    at "))
                for (let a of this._vscode.workspace.workspaceFolders || []) {
                    let c = ("    at " + a.uri.fsPath + ot.default.sep).toLowerCase(),
                        l = ("    at fn (" + a.uri.fsPath + ot.default.sep).toLowerCase(),
                        d = o.toLowerCase();
                    if (d.startsWith(c)) {
                        o = "    at " + o.substring(c.length);
                        break
                    }
                    if (d.startsWith(l)) {
                        o = "    at " + o.substring(l.length, o.length - 1);
                        break
                    }
                }
            if (o.includes("=====") && o.includes("log")) {
                t = !0, i.push(`

**Execution log**`);
                continue
            }
            if (o.includes("=====")) {
                t = !1;
                continue
            }
            if (t) {
                let [, a, c] = o.match(/(\s*)(.*)/);
                i.push(a + " - " + _t(c))
            } else s.push(o)
        }
        let r = new this._vscode.MarkdownString;
        return r.isTrusted = !0, r.supportHtml = !0, r.appendMarkdown(_t(s.join(`
`))), i.length && r.appendMarkdown(i.join(`
`)), new this._vscode.TestMessage(r)
    }
    _testMessageFromHtml(e) {
        let t = e.split(`
`).join("").trimStart(),
            s = new this._vscode.MarkdownString(t);
        return s.isTrusted = !0, s.supportHtml = !0, new this._vscode.TestMessage(s)
    }
    _testMessageForTestError(e, t) {
        let s = e.stack || e.message || e.value,
            i;
        s.includes("Looks like Playwright Test or Playwright") ? i = this._testMessageFromHtml(`
        <p>Playwright browser are not installed.</p>
        <p>
          Press
          ${process.platform === "darwin" ? "<kbd>Shift</kbd>+<kbd>Command</kbd>+<kbd>P</kbd>" : ""}
          ${process.platform !== "darwin" ? "<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>" : ""}
          to open the Command Palette in VSCode, type 'Playwright' and select 'Install Playwright Browsers'.
        </p>
      `) : i = this._testMessageFromText(s);
        let r = e.location || wo(e.stack, t);
        if (r) {
            let o = new this._vscode.Position(r.line - 1, r.column - 1);
            i.location = new this._vscode.Location(this._vscode.Uri.file(r.file), o)
        }
        return i
    }
    playwrightTestLog() {
        return this._playwrightTestLog
    }
    browserServerWSForTest() {
        return this._reusedBrowser.browserServerWSEndpoint()
    }
    _showTrace(e) {
        let t = e[nt],
            s = this._models.selectedModel();
        s && this._traceViewer.open(t, s.config)
    }
    _treeItemSelected(e) {
        if (!e) return;
        let t = e[nt] || "",
            s = this._models.selectedModel();
        s && this._traceViewer.open(t, s.config)
    }
    _queueCommand(e, t) {
        let s = this._commandQueue.then(e).catch(i => (console.error(i), t));
        return this._commandQueue = s.then(() => { }), s
    }
};

function wo(n, e) {
    let t = (n == null ? void 0 : n.split(`
`)) || [];
    for (let s of t) {
        let i = To.parseLine(s);
        if (!(!i || !i.file || !i.line || !i.column) && (i.file = i.file.replace(/\//g, ot.default.sep), !e || e.uri.fsPath === i.file)) return {
            file: i.file,
            line: i.line,
            column: i.column
        }
    }
}
var Jt = class {
    constructor(e) {
        this._selectedTreeItem = null;
        this._vscode = e, this._treeItemSelected = new e.EventEmitter, this.onTreeItemSelected = this._treeItemSelected.event, this._poll().catch(() => { })
    }
    dispose() {
        clearTimeout(this._timeout)
    }
    selectedTreeItem() {
        return this._selectedTreeItem
    }
    async _poll() {
        clearTimeout(this._timeout);
        let e = await this._vscode.commands.executeCommand("testing.getExplorerSelection"),
            t = e.include.length === 1 ? e.include[0] : null;
        t !== this._selectedTreeItem && (this._selectedTreeItem = t, this._treeItemSelected.fire(t)), this._timeout = setTimeout(() => this._poll().catch(() => { }), 250)
    }
};

function So(n) {
    let e = n.parent;
    for (; !e.project();) e = e.parent;
    return e.project()
}
var nt = Symbol("traceUrl");
0 && (module.exports = {
    Extension,
    activate
});