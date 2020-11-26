interface StoreData {
    expire?: number;
    data?: any;
    [propName: string]: any;
}
declare const _default: {
    /**
     * @description: 同getItem方法
     * @param {string} key
     * @param {Storage} store?
     * @return: object|null
     */
    getItem(key: string, store?: Storage): StoreData | null | string;
    /**
     * @description: CURD主函数
     * @param {string} key
     * @param {Storage} store?
     * @return: object|null
     */
    store(key: string, value?: any, time?: number, store?: Storage): any;
    /**
    * @description: localStorage
    * @param {string} key
    * @param {any} value
    * @param {number} time
    * @return: void|null
    */
    local(key: string, value?: any, time?: number | undefined): any;
    /**
    * @description: sessionStorage
    * @param {string} key
    * @param {any} value
    * @param {number} time
    * @return: void|null
    */
    session(key: string, value?: any, time?: number | undefined): any;
    /**
    * @description: 清理过期的storage，清理全部请直接调用localStorage.clear()或sessionStorage.clear()
    * @param {Storage} store
    * @return: void
    */
    clear(store: Storage): void;
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
    cookie(name: string, value?: string | undefined, hours?: number | undefined, path?: string | undefined, domain?: string | undefined, secure?: string | undefined): string | undefined;
};
export default _default;
