"use strict";
exports.__esModule = true;
var utils = {
    getType: function (v) {
        return Object.prototype.toString.call(v).slice(8, -1).toLowerCase();
    },
    isType: function (obj, type) {
        return utils.getType(obj) === type;
    },
    isObject: function (v) {
        return typeof v === 'object';
    },
    isNumber: function (v) {
        return typeof v === 'number';
    },
    isArray: function (v) {
        return Array.isArray(v);
    },
    isBoolean: function (v) {
        return typeof v === 'boolean';
    },
    isFunction: function (v) {
        return typeof v === 'function';
    },
    isPercent: function (v) {
        return /%$/.test(v + '');
    },
    isPlainObject: function (v) {
        return utils.getType(v === 'object');
    },
    // 是否为空(0,'',undefined,null,false,{},[] 都被认为是空)
    isEmpty: function (v) {
        var r = ({
            object: function (v) { return !Object.keys(v).length; },
            array: function (v) { return !v.length; }
        })[utils.getType(v)];
        return r === void (0) ? !v : r;
    },
    //类数组转数组
    toArray: function (v) {
        return Array.prototype.map.call(v, function (n) { return n; });
    },
    // 对象按key排序
    sortObject: function (obj) {
        var tmp = {};
        Object.keys(obj).sort(function (a, b) { return a > b ? 1 : -1; }).forEach(function (key) { return tmp[key] = obj[key]; });
        return tmp;
    },
    // 把objs的对象属性合并到target中，深层合并，不同于Object.assign的单层合并，常用于函数的option类的参数与默认参数合并
    merge: function (target) {
        var objs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            objs[_i - 1] = arguments[_i];
        }
        if (!objs.length) {
            objs = [target];
            target = {};
        }
        var obj = objs[0];
        for (var key in obj) {
            var tv = target[key];
            var ov = obj[key];
            if (utils.isObject(tv) && utils.isObject(ov)) {
                utils.merge(target[key], obj[key]);
                continue;
            }
            target[key] = obj[key];
        }
        var nobjs = objs.slice(1);
        return nobjs.length ? utils.merge.apply(utils, [target].concat(nobjs)) : target;
    },
    // 缓存函数返回值
    cached: function (fn) {
        var cache = Object.create(null);
        return function (str) {
            var hit = cache[str];
            return hit || (cache[str] = fn(str));
        };
    },
    // querystring to json
    search2Json: function (search) {
        //无参数时默认返回window.location.search 转换成JSON后的对象
        //1个参数时把此参数当成search看待
        var obj = Object.create(null);
        search = search || window.location.search;
        if (!search)
            return obj;
        var arr = search.replace(/^\?/g, '').replace(/\#/g, '').split('&');
        for (var i = 0; i < arr.length; i++) {
            var tmp = arr[i].split('=');
            obj[tmp[0]] = obj[tmp[0]] ? (obj[tmp[0]] instanceof Array) ? obj[tmp[0]].concat(tmp[1]) : [obj[tmp[0]], tmp[1]] : tmp[1];
            obj[tmp[0]] = decodeURIComponent(obj[tmp[0]]);
        }
        return obj;
    },
    //简单倒计时
    timers: Object.create(null),
    countdown: function (name, timeout, ticker) {
        var timer;
        if (utils.timers[name]) {
            timer = utils.timers[name];
        }
        else {
            var Timer = /** @class */ (function () {
                function Timer(name, timeout) {
                    this.tid = 0;
                    this.name = name;
                    this.timeout = this._timeout = timeout;
                }
                Timer.prototype.reset = function () {
                    this.timeout = this.timeout;
                };
                Timer.prototype.tick = function (fun) {
                    var me = this;
                    var tick = function () {
                        me.timeout--;
                        fun && fun(me.timeout);
                        if (me.timeout <= 0) {
                            me.clearInterval();
                            me.reset();
                        }
                    };
                    this.tid && clearInterval(this.tid);
                    this.tid = setInterval(tick, 1000);
                    tick();
                };
                Timer.prototype.clearInterval = function () {
                    clearInterval(this.tid);
                };
                return Timer;
            }());
            timer = new Timer(name, timeout);
            utils.timers[name] = timer;
        }
        timer.tick(function (rest) {
            ticker && ticker(rest);
        });
    },
    // sleep
    sleep: function (duration) {
        if (duration === void 0) { duration = 1000; }
        return new Promise(function (resolve) {
            setTimeout(resolve, duration);
        });
    },
    // 时间格式化
    format: function (d, fmt) {
        if (d === void 0) { d = new Date(); }
        if (fmt === void 0) { fmt = 'yyyy-MM-dd HH:mm:ss'; }
        d = new Date(d);
        var o = {
            "M+": d.getMonth() + 1,
            "d+": d.getDate(),
            "h+": d.getHours() % 12 == 0 ? 12 : d.getHours() % 12,
            "H+": d.getHours(),
            "m+": d.getMinutes(),
            "s+": d.getSeconds(),
            "q+": Math.floor((d.getMonth() + 3) / 3),
            "S": d.getMilliseconds()
        };
        var week = ['日', '一', '二', '三', '四', '五', '六'];
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[d.getDay()]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    },
    //获取或判断当前平台(android,ios,other)
    platform: function (platform) {
        var u = navigator.userAgent;
        var app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        var p = isAndroid ? 'android' : isIOS ? 'ios' : 'other';
        return platform ? (p === platform.toLowerCase()) : p;
    }
};
exports["default"] = utils;
