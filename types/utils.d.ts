declare const utils: {
    /**
     * @description: 返回对象的类型全小写字符串
     * @param {any} v
     * @return: string
     */
    getType(v: any): string;
    /**
     * @description: 是否为某类型
     * @param {any} obj
     * @param {string} type
     * @return: boolean
     */
    isType(obj: any, type: string): boolean;
    /**
     * @description: 是否未定义,undefine或null
     * @param {any} obj
     * @return: boolean
     */
    isUndef(obj: any): boolean;
    /**
     * @description: 是否为对象类型
     * @param {any} v
     * @return: boolean
     */
    isObject(v: any): boolean;
    /**
     * @description: 是否为数字类型
     * @param {any} v
     * @return: boolean
     */
    isNumber(v: any): boolean;
    /**
     * @description: 是否为数组
     * @param {any} v
     * @return: boolean
     */
    isArray(v: any): boolean;
    /**
     * @description: 是否为布尔值
     * @param {any} v
     * @return: boolean
     */
    isBoolean(v: any): boolean;
    /**
     * @description: 是否为函数类型
     * @param {any} v
     * @return: boolean
     */
    isFunction(v: any): boolean;
    /**
     * @description: 是否为百分比数值
     * @param {any} v
     * @return: boolean
     */
    isPercent(v: any): boolean;
    /**
     * @description: 是否为原对象类型
     * @param {any} v
     * @return: boolean
     */
    isPlainObject(v: any): boolean;
    /**
     * @description: 是否为空(0,'',undefined,null,false,{},[] 都被认为是空)
     * @param {any} v
     * @return: boolean
     */
    isEmpty(v: any): boolean;
    /**
     * @description: 类数组转数组
     * @param {any} v
     * @return: Array
     */
    toArray(v: any): any[];
    /**
     * @description: 补零(前置)
     * @param {number|string} num   原数据
     * @param {number} len  总长度:默认2
     * @param {string} str  填补字符串:默认'0'
     * @return: string
     */
    zeroize(num: number | string, len?: number, str?: string): string;
    /**
     * @description: 对象按key排序
     * @param {Object} obj
     * @return: Object
     */
    sortObject(obj: object): Object;
    /**
     * @description: 把objs的对象属性合并到target中，深层合并，不同于Object.assign的单层合并，常用于函数的option类的参数与默认参数合并
     * 最终返回结果就是修改后的target,如果不想有target引用，把{}或null加到第一个参数即可
     * @param {Object} target
     * @param {Array<Object>} objs
     * @return: Object
     */
    merge(target?: {}, ...objs: Array<object>): Object;
    /**
     * @description: 根据单一参数缓存函数返回值
     * @param {Function} fn
     * @return: Function
     */
    cached: (fn: Function) => Function;
    /**
     * @description: querystring to json
     * @param {string} search?
     * @return: Object
     */
    search2Json: (search?: string | undefined) => Object;
    timers: any;
    /**
     * @description: 简单倒计时
     * @param {string} name
     * @param {number} timeout?
     * @param {Function} ticker?
     * @return: void
     */
    countdown: (name: string, timeout?: number | undefined, ticker?: Function | undefined) => void;
    /**
     * @description: sleep
     * @param {number} duration?
     * @return: Promise<any>
     */
    sleep(duration?: number): Promise<any>;
    /**
     * @description: 时间格式化
     * @param {number|striing|Date} d?
     * @param {string} fmt?
     * @return: string
     */
    format(d?: Date, fmt?: string): string;
    /**
     * @description: 获取或判断当前平台(android,ios,other)
     * @param {string} platform?
     * @return: string
     */
    platform(platform?: string | undefined): boolean | "android" | "ios" | "other";
};
export default utils;
