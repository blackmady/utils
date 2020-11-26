declare enum timerStatus {
    finished = 0,
    suspend = 1,
    progress = 2
}
interface ITimers {
    [name: string]: ITimer;
}
interface IOption {
    name?: string;
    step?: number;
    start?: number;
    end?: number;
    interval?: number;
}
interface ITimer {
    name: string;
    step: number;
    _startTime: number;
    _lastTime: number;
    _durationOfPause: number;
    status: number;
    interval: number;
    _times: number;
    start: number;
    value: number;
    end: number;
    tick: Function;
    timeup: Function;
    reset: Function;
    pause: Function;
    resume: Function;
    on: Function;
    off: Function;
}
declare const countdown: ((callback: FrameRequestCallback) => number) & typeof requestAnimationFrame;
declare const clearCountdown: ((handle: number) => void) & typeof cancelAnimationFrame;
/**
 * @description: 生成guid
 * @return string
 */
declare function guid(): string;
declare class GlobalTimer {
    timers: ITimers;
    lastTimer?: ITimer;
    private ticks;
    private timeups;
    constructor(opt?: IOption);
    /**
     * @description: 添加计时器
     * @param {string} name
     * @param {number} interval
     * @return GlobalTimer
     */
    now(): number;
    get(name?: string): ITimer;
    getTimerTick(name: string): (tick: Function) => void;
    add(opt: IOption): this;
    remove(name: string): void;
    start(): void;
    tick(timer: ITimer): void;
    timeup(timer: ITimer): void;
    countdown(): void;
}
