(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        getItem(key, store = localStorage) {
            const item = store.getItem(key);
            if (item === null)
                return null;
            let json;
            try {
                json = JSON.parse(item);
            }
            catch (e) { }
            return typeof json === 'undefined' ? item : json;
        },
        // time:表示缓存时间，单位为毫秒，默认为永不过期
        store(key, value, time = 1e14, store = localStorage) {
            const now = Date.now();
            if (typeof value === 'undefined') {
                const obj = this.getItem(key);
                if (!obj)
                    return null;
                if (obj.expire <= now) {
                    // 清理当前数据
                    store.removeItem(key);
                    // 清除所有过期数据
                    // this.clear(store)
                    return null;
                }
                return typeof obj.data === 'undefined' ? obj : obj.data;
            }
            else if (value === null) {
                store.removeItem(key);
            }
            else {
                const nv = { expire: now + time, data: value };
                store.setItem(key, JSON.stringify(nv));
            }
        },
        // localStorage
        local(key, value, time) {
            return this.store(key, value, time, localStorage);
        },
        // sessionStorage
        session(key, value, time) {
            return this.store(key, value, time, sessionStorage);
        },
        // 清理过期的storage，清理全部请直接调用localStorage.clear()或sessionStorage.clear()
        clear(store) {
            const now = Date.now();
            for (let i = 0; i < store.length; i++) {
                let key = store.key(i);
                let obj = this.getItem(key, store);
                if (obj && obj.expire <= now) {
                    store.removeItem(key);
                }
            }
        },
        // cookie操作
        cookie(name, value, hours, path, domain, secure) {
            if (value === null) {
                hours = -1;
            }
            else if (typeof value === 'undefined') {
                const reg = new RegExp(`(?:^|;\\s*)${name}=([^=]+)(?:;|$)`);
                return reg.test(document.cookie) ? RegExp.$1 : "";
            }
            let cdata = name + "=" + value;
            if (hours) {
                const d = new Date();
                d.setHours(d.getHours() + hours);
                cdata += "; expires=" + d.toUTCString();
            }
            cdata += path ? ("; path=" + path) : "";
            cdata += domain ? ("; domain=" + domain) : "";
            cdata += secure ? ("; secure=" + secure) : "";
            document.cookie = cdata;
        },
    };
});
