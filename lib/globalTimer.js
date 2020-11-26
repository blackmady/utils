"use strict";
// 废弃
// 计时器状态
var timerStatus;
(function (timerStatus) {
    timerStatus[timerStatus["finished"] = 0] = "finished";
    timerStatus[timerStatus["suspend"] = 1] = "suspend";
    timerStatus[timerStatus["progress"] = 2] = "progress";
})(timerStatus || (timerStatus = {}));
const countdown = window.requestAnimationFrame?.bind(window) || window.setTimeout.bind(window);
const clearCountdown = window.cancelAnimationFrame?.bind(window) || window.clearTimeout.bind(window);
/**
 * @description: 生成guid
 * @return string
 */
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
// 定义全局唯一计时器类
class GlobalTimer {
    constructor(opt) {
        // 计时器,从start开始计时到end,时间间隔为interval,start默认值为0
        this.timers = {};
        this.ticks = {};
        this.timeups = {};
        opt && this.add(opt);
    }
    /**
     * @description: 添加计时器
     * @param {string} name
     * @param {number} interval
     * @return GlobalTimer
     */
    now() {
        return performance?.now() || Date.now();
    }
    // 获取timer的数据
    get(name) {
        return name ? this.timers[name] : this.lastTimer;
    }
    // 获取timerTick
    getTimerTick(name) {
        const timer = this.get(name);
        return (tick) => {
            tick();
        };
    }
    // 注册一个计时器
    add(opt) {
        const timer = {
            step: -1,
            name: guid(),
            _startTime: this.now(),
            _lastTime: 0,
            _durationOfPause: 0,
            _times: 0,
            status: timerStatus.finished,
            start: 0,
            value: 0,
            end: 0,
            interval: 1000,
            ...opt,
            tick: () => { },
            timeup: () => { },
            reset: () => { },
            pause: () => { },
            resume: () => { },
            on: () => { },
            off: () => { },
        };
        timer.step ??= Math.sign(timer.start - timer.end);
        timer.value = timer.start;
        timer.tick = (tick) => {
            this.ticks[timer.name] = tick;
            return this;
        };
        timer.timeup = (timeup) => {
            this.timeups[timer.name] = timeup;
            return this;
        };
        timer.reset = () => {
            timer.status = timerStatus.finished;
            timer.value = 0;
            timer._lastTime = timer._startTime = this.now();
        };
        timer.pause = () => {
            timer.status = timerStatus.suspend;
        };
        timer.resume = () => {
            timer.status = timerStatus.progress;
        };
        timer.on = (name, fun) => {
            ({
                tick: this.ticks,
                timeup: this.timeups,
            })[name][timer.name] = fun;
        };
        timer.off = (name) => {
            if (!name) {
                delete this.ticks[timer.name];
                delete this.timeups[timer.name];
            }
            else {
                delete ({
                    tick: this.ticks,
                    timeup: this.timeups,
                })[name][timer.name];
            }
        };
        this.lastTimer = timer;
        this.timers[timer.name] = timer;
        return this;
    }
    remove(name) {
        delete this.timers[name];
    }
    start() {
        // 开始tick
        this.countdown();
    }
    // 某一tick触发时执行
    tick(timer) {
        this.ticks[timer.name]?.(timer.value, timer);
    }
    // 某一timeup触发时执行
    timeup(timer) {
        this.timeups[timer.name]?.(timer);
    }
    countdown() {
        countdown(this.countdown);
        // const currTime=timer.timestamp();
        const currTime = this.now();
        for (let name in this.timers) {
            const timer = this.timers[name];
            if (timer.status === timerStatus.finished) { // 如果状态是未开始或者已结束就标记为开始
                timer._lastTime = timer._startTime;
                timer.status = timerStatus.progress;
            }
            if (timer.status === timerStatus.progress) { // 如果状态是进行中则进行判断
                if ((currTime - timer._lastTime) >= timer.interval) {
                    // timer._times++;
                    timer._times = Math.floor((currTime - timer._startTime) / timer.interval);
                    // timer._lastTime=currTime;
                    timer._lastTime = timer._startTime + timer.interval * timer._times;
                    timer.value = timer.start + timer.step;
                    this.tick(timer);
                }
                if ((timer.step < 0 && timer.value <= timer.end) || (timer.step > 0 && timer.value <= timer.end)) {
                    timer.status = timerStatus.finished;
                    this.timeup(timer);
                }
            }
        }
    }
}
