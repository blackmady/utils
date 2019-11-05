const utils = {
  getType(v: any) {
    return Object.prototype.toString.call(v).slice(8, -1).toLowerCase();
  },
  isType(obj: any, type: string) {
    return utils.getType(obj) === type
  },
  isObject(v: any) {
    return typeof v === 'object'
  },
  isNumber(v: any) {
    return typeof v === 'number';
  },
  isArray(v: any) {
    return Array.isArray(v)
  },
  isBoolean(v: any) {
    return typeof v === 'boolean'
  },
  isFunction(v: any) {
    return typeof v === 'function'
  },
  isPercent(v: any) {
    return /%$/.test(v + '');
  },
  isPlainObject(v: any) {
    return utils.getType(v === 'object');
  },
  // 是否为空(0,'',undefined,null,false,{},[] 都被认为是空)
  isEmpty(v: any): boolean {
    const r = ({
      object: (v: any) => !Object.keys(v).length,
      array: (v: any) => !v.length,
    })[utils.getType(v)]
    return r === void (0) ? !v : r
  },
  //类数组转数组
  toArray(v: any) {
    return Array.prototype.map.call(v, n => n);
  },
  // 对象按key排序
  sortObject(obj: object) {
    let tmp = {};
    Object.keys(obj).sort((a, b) => a > b ? 1 : -1).forEach(key => tmp[key] = obj[key]);
    return tmp;
  },
  // 把objs的对象属性合并到target中，深层合并，不同于Object.assign的单层合并，常用于函数的option类的参数与默认参数合并
  merge(target: object, ...objs: Array<object>) {
    if (!objs.length) {
      objs = [target]
      target = {}
    }
    let obj = objs[0]
    for (let key in obj) {
      let tv = target[key]
      let ov = obj[key]
      if (utils.isObject(tv) && utils.isObject(ov)) {
        utils.merge(target[key], obj[key])
        continue
      }
      target[key] = obj[key]
    }
    let nobjs = objs.slice(1)
    return nobjs.length ? utils.merge(target, ...nobjs) : target
  },
  // 缓存函数返回值
  cached: (fn: Function): Function => {
    const cache: {} = Object.create(null)
    return function (str: string): any {
      const hit = cache[str]
      return hit || (cache[str] = fn(str))
    }
  },
  // querystring to json
  search2Json: function (search?: string) {
    //无参数时默认返回window.location.search 转换成JSON后的对象
    //1个参数时把此参数当成search看待
    const obj = Object.create(null);
    search = search || window.location.search;
    if (!search) return obj;
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
  countdown: function (name: string, timeout?: number, ticker?: Function) {
    let timer: any;
    if (utils.timers[name]) {
      timer = utils.timers[name];
    } else {
      class Timer {
        private tid: number = 0
        private name: string
        private timeout: number
        private _timeout: number
        constructor(name: string, timeout: number) {
          this.name = name;
          this.timeout = this._timeout = timeout;
        }
        reset() {
          this.timeout = this.timeout
        }
        tick(fun?: Function) {
          var me = this;
          var tick = function () {
            me.timeout--
            fun && fun(me.timeout);
            if (me.timeout <= 0) {
              me.clearInterval();
              me.reset();
            }
          }
          this.tid && clearInterval(this.tid);
          this.tid = setInterval(tick, 1000);
          tick();
        }
        clearInterval() {
          clearInterval(this.tid);
        }
      }
      timer = new Timer(name, timeout!);
      utils.timers[name] = timer;
    }
    timer.tick((rest: number) => {
      ticker && ticker(rest);
    });
  },
  // sleep
  sleep(duration = 1000): Promise<any> {
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    })
  },
  // 时间格式化
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
  //获取或判断当前平台(android,ios,other)
  platform(platform?: string) {
    const u = navigator.userAgent
    const app = navigator.appVersion;
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
    const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    const p = isAndroid ? 'android' : isIOS ? 'ios' : 'other';
    return platform ? (p === platform.toLowerCase()) : p;
  }
}

export default utils