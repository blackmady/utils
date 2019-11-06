"use strict";
/*
 * @Author: None
 * @Date: 2019-11-05 11:29:27
 * @LastEditTime: 2019-11-06 11:49:05
 * @LastEditors: None
 * @Description: 工具包
 */
Object.defineProperty(exports, "__esModule", { value: true });
const utils = {
    /**
     * @description: 返回对象的类型全小写字符串
     * @param {any} v
     * @return: string
     */
    getType(v) {
        return Object.prototype.toString.call(v).slice(8, -1).toLowerCase();
    },
    /**
     * @description: 是否为某类型
     * @param {any} obj
     * @param {string} type
     * @return: boolean
     */
    isType(obj, type) {
        return utils.getType(obj) === type;
    },
    /**
     * @description: 是否为对象类型
     * @param {any} v
     * @return: boolean
     */
    isObject(v) {
        return typeof v === 'object';
    },
    /**
   * @description: 是否为数字类型
   * @param {any} v
   * @return: boolean
   */
    isNumber(v) {
        return typeof v === 'number';
    },
    /**
   * @description: 是否为数组
   * @param {any} v
   * @return: boolean
   */
    isArray(v) {
        return Array.isArray(v);
    },
    /**
     * @description: 是否为布尔值
     * @param {any} v
     * @return: boolean
     */
    isBoolean(v) {
        return typeof v === 'boolean';
    },
    /**
     * @description: 是否为函数类型
     * @param {any} v
     * @return: boolean
     */
    isFunction(v) {
        return typeof v === 'function';
    },
    /**
   * @description: 是否为百分比数值
   * @param {any} v
   * @return: boolean
   */
    isPercent(v) {
        return /%$/.test(v + '');
    },
    /**
   * @description: 是否为原对象类型
   * @param {any} v
   * @return: boolean
   */
    isPlainObject(v) {
        return utils.getType(v) === 'object';
    },
    /**
   * @description: 是否为空(0,'',undefined,null,false,{},[] 都被认为是空)
   * @param {any} v
   * @return: boolean
   */
    isEmpty(v) {
        const r = ({
            object: (v) => !Object.keys(v).length,
            array: (v) => !v.length,
        })[utils.getType(v)];
        return r === void (0) ? !v : r;
    },
    /**
   * @description: 类数组转数组
   * @param {any} v
   * @return: Array
   */
    toArray(v) {
        return Array.prototype.map.call(v, n => n);
    },
    /**
   * @description: 对象按key排序
   * @param {Object} obj
   * @return: Object
   */
    sortObject(obj) {
        let tmp = {};
        Object.keys(obj).sort((a, b) => a > b ? 1 : -1).forEach(key => tmp[key] = obj[key]);
        return tmp;
    },
    /**
     * @description: 把objs的对象属性合并到target中，深层合并，不同于Object.assign的单层合并，常用于函数的option类的参数与默认参数合并
     * @param {Object} target
     * @param {Array<Object>} objs
     * @return: Object
     */
    merge(target, ...objs) {
        if (!objs.length) {
            objs = [target];
            target = {};
        }
        let obj = objs[0];
        for (let key in obj) {
            let tv = target[key];
            let ov = obj[key];
            if (utils.isObject(tv) && utils.isObject(ov)) {
                utils.merge(target[key], obj[key]);
                continue;
            }
            target[key] = obj[key];
        }
        let nobjs = objs.slice(1);
        return nobjs.length ? utils.merge(target, ...nobjs) : target;
    },
    /**
     * @description: 根据单一参数缓存函数返回值
     * @param {Function} fn
     * @return: Function
     */
    cached: (fn) => {
        const cache = Object.create(null);
        return function (str) {
            const hit = cache[str];
            return hit || (cache[str] = fn(str));
        };
    },
    /**
     * @description: querystring to json
     * @param {string} search?
     * @return: Object
     */
    search2Json: function (search) {
        //无参数时默认返回window.location.search 转换成JSON后的对象
        //1个参数时把此参数当成search看待
        const obj = Object.create(null);
        search = search || window.location.search;
        if (!search)
            return obj;
        const arr = search.replace(/^\?/g, '').replace(/\#/g, '').split('&');
        for (let i = 0; i < arr.length; i++) {
            const tmp = arr[i].split('=');
            obj[tmp[0]] = obj[tmp[0]] ? (obj[tmp[0]] instanceof Array) ? obj[tmp[0]].concat(tmp[1]) : [obj[tmp[0]], tmp[1]] : tmp[1];
            obj[tmp[0]] = decodeURIComponent(obj[tmp[0]]);
        }
        return obj;
    },
    //简单倒计时
    timers: Object.create(null),
    /**
     * @description: 简单倒计时
     * @param {string} name
     * @param {number} timeout?
     * @param {Function} ticker?
     * @return: void
     */
    countdown: function (name, timeout, ticker) {
        let timer;
        if (utils.timers[name]) {
            timer = utils.timers[name];
        }
        else {
            class Timer {
                constructor(name, timeout) {
                    this.tid = 0;
                    this.name = name;
                    this.timeout = this._timeout = timeout;
                }
                reset() {
                    this.timeout = this.timeout;
                }
                tick(fun) {
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
                }
                clearInterval() {
                    clearInterval(this.tid);
                }
            }
            timer = new Timer(name, timeout);
            utils.timers[name] = timer;
        }
        timer.tick((rest) => {
            ticker && ticker(rest);
        });
    },
    /**
     * @description: sleep
     * @param {number} duration?
     * @return: Promise<any>
     */
    sleep(duration = 1000) {
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    },
    /**
     * @description: 时间格式化
     * @param {number|striing|Date} d?
     * @param {string} fmt?
     * @return: string
     */
    format(d = new Date(), fmt = 'yyyy-MM-dd HH:mm:ss') {
        d = new Date(d);
        let o = {
            "M+": d.getMonth() + 1,
            "d+": d.getDate(),
            "h+": d.getHours() % 12 == 0 ? 12 : d.getHours() % 12,
            "H+": d.getHours(),
            "m+": d.getMinutes(),
            "s+": d.getSeconds(),
            "q+": Math.floor((d.getMonth() + 3) / 3),
            "S": d.getMilliseconds()
        };
        let week = ['日', '一', '二', '三', '四', '五', '六'];
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[d.getDay()]);
        }
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    },
    /**
     * @description: 获取或判断当前平台(android,ios,other)
     * @param {string} platform?
     * @return: string
     */
    platform(platform) {
        const u = navigator.userAgent;
        const app = navigator.appVersion;
        const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
        const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        const p = isAndroid ? 'android' : isIOS ? 'ios' : 'other';
        return platform ? (p === platform.toLowerCase()) : p;
    }
};
exports.default = utils;
