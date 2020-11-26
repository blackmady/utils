export default {
    /**
     * @description: 同getItem方法
     * @param {string} key
     * @param {Storage} store?
     * @return: object|null
     */
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
    /**
     * @description: CURD主函数
     * @param {string} key
     * @param {Storage} store?
     * @return: object|null
     */
    store(key, value, time = 1e14, store = localStorage) {
        const now = Date.now();
        if (typeof value === 'undefined') {
            const obj = this.getItem(key);
            if (!obj)
                return null;
            // @ts-ignore
            if (obj.expire <= now) {
                // 清理当前数据
                store.removeItem(key);
                // 清除所有过期数据
                // this.clear(store)
                return null;
            }
            // @ts-ignore
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
    /**
    * @description: localStorage
    * @param {string} key
    * @param {any} value
    * @param {number} time
    * @return: void|null
    */
    local(key, value, time) {
        return this.store(key, value, time, localStorage);
    },
    /**
    * @description: sessionStorage
    * @param {string} key
    * @param {any} value
    * @param {number} time
    * @return: void|null
    */
    session(key, value, time) {
        return this.store(key, value, time, sessionStorage);
    },
    /**
    * @description: 清理过期的storage，清理全部请直接调用localStorage.clear()或sessionStorage.clear()
    * @param {Storage} store
    * @return: void
    */
    clear(store) {
        const now = Date.now();
        for (let i = 0; i < store.length; i++) {
            let key = store.key(i);
            let obj = this.getItem(key, store);
            // @ts-ignore 
            if (obj && obj.expire <= now) {
                store.removeItem(key);
            }
        }
    },
    /**
    * @description: cookie操作
    * @param {string} name
    * @param {string} value
    * @param {number} hours?
    * @param {string} path?
    * @param {string} domain?
    * @param {string} secure?
    * @return: any
    */
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
