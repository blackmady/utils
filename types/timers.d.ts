/**
 * @description: 计时器的配置对象,不需要手动配置
 * @param hz 计时频率,默认为0
 * @param name 计时器名称
 * @param start|begin 开始数值
 * @param end 结束数值
 * @param interval 计时间隔,一般为1000
 */
interface ITimerOption {
    hz?: number;
    name?: string;
    start?: number;
    begin?: number;
    end?: number;
    interval?: number;
}
/**
 * @description: 传入的配置对象
 * @param auto 是否自动开始计时
 * @param name 计时器名称,使用过已分配的计时器名称时会覆盖
 * @param interval 计时间隔,一般为1000
 * @param start 开始数值
 * @param end 结束数值
 */
interface ICountdownOption {
    auto?: boolean;
    name?: string;
    interval?: number;
    start?: number;
    end?: number;
}
declare const timer: {
    timestamps: {};
    timers: {};
    /**
     * @description: 计时器是否存在
     * @param {string} name
     * @return boolean
     */
    exist(name: string): boolean;
    /**
     * @description: 获取当前相对时间戳
     * @return number
     */
    readonly now: number;
    /**
     * @description: 获取当前相对时间戳
     * @return number
     */
    timestamp(): number;
    /**
     * @description: 创建计时器
     * @param {ITimerOption} opt
     * @return Timer
     */
    create(opt: ITimerOption): Timer;
    /**
     * @description: 倒计时,当start===end时会返回计数次数,当有name时优先获取已存在的。
     * @param {countdownOption} opt
     * @return Timer
     */
    countdown(opt: ICountdownOption | number | string): any;
    /**
     * @description: 类似console.time
     * @param {string} name
     * @return number
     */
    time(name?: string): number;
    /**
     * @description: 类似console.timeLog,只返回,不输出
     * @param {string} name
     * @return number
     */
    timeLog(name?: string): number;
    /**
     * @description: 类似console.timeEnd,只返回,不输出
     * @param {string} name
     * @return number
     */
    timeEnd(name?: string): number;
};
export declare class Timer {
    private tid;
    private setTimeout;
    private clearTimeout;
    private ticks;
    private timeups;
    private hz;
    name: string;
    status: number;
    begin: number;
    end: number;
    interval: number;
    startTime: number;
    constructor(opt: ITimerOption);
    destroy(): void;
    start(): this;
    pause(): false | undefined;
    resume(): void;
    stop(): void;
    on(name: string, fun: Function): this;
    off(name: string, fun: Function): this;
    tick(fun: Function): this;
    timeup(fun: Function): this;
}
export default timer;
