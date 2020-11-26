/*
 * @Author: None
 * @LastEditors: None
 * @Date: 2020-11-04 22:52:50
 * @LastEditTime: 2020-11-09 00:48:43
 */
/*
TODO: 全局只使用一个统一的时钟计时器,所有不同的计时器都由此分裂出来,如果支持使用worker.js 以及 wasm 来解决.
*/
/* 使用方法
timer.countdown({}).tick(rest=>{

})
*/
// 计时器状态
var timerStatus;
(function (timerStatus) {
    timerStatus[timerStatus["finished"] = 0] = "finished";
    timerStatus[timerStatus["suspend"] = 1] = "suspend";
    timerStatus[timerStatus["progress"] = 2] = "progress";
})(timerStatus || (timerStatus = {}));
// 全局timestamps,请自行避免重复
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
// 计时器静态库
const timer = {
    timestamps: {},
    timers: {},
    /**
     * @description: 计时器是否存在
     * @param {string} name
     * @return boolean
     */
    exist(name) {
        return !!this.timers[name];
    },
    /**
     * @description: 获取当前相对时间戳
     * @return number
     */
    get now() {
        return this.timestamp();
    },
    /**
     * @description: 获取当前相对时间戳
     * @return number
     */
    timestamp() {
        return performance?.now?.() || Date.now();
    },
    /**
     * @description: 创建计时器
     * @param {ITimerOption} opt
     * @return Timer
     */
    create(opt) {
        return new Timer(opt);
    },
    /**
     * @description: 倒计时,当start===end时会返回计数次数,当有name时优先获取已存在的。
     * @param {countdownOption} opt
     * @return Timer
     */
    countdown(opt) {
        const defOpt = {
            auto: true,
            name: guid(),
            interval: 1000,
            start: 0,
            end: 0,
        };
        if (typeof opt === 'number') {
            opt = { start: opt };
        }
        else if (typeof opt === 'string') {
            return this.timers[opt];
        }
        opt = { ...defOpt, ...opt };
        if (this.timers[opt.name]) {
            // console.warn(`计时器${opt.name}已存在，将被覆盖！`)
            this.timers[opt.name]?.destroy();
        }
        const newTimer = this.create(opt);
        this.timers[opt.name] = newTimer;
        return opt.auto ? newTimer.start() : newTimer;
    },
    /**
     * @description: 类似console.time
     * @param {string} name
     * @return number
     */
    time(name = 'none') {
        return this.timestamps[name] = this.timestamp();
    },
    /**
     * @description: 类似console.timeLog,只返回,不输出
     * @param {string} name
     * @return number
     */
    timeLog(name = 'none') {
        return this.timestamp() - this.timestamps[name];
    },
    /**
     * @description: 类似console.timeEnd,只返回,不输出
     * @param {string} name
     * @return number
     */
    timeEnd(name = 'none') {
        const r = this.timeLog(name);
        delete this.timestamps[name];
        return r;
    }
};
// 计时器类
export class Timer {
    constructor(opt) {
        this.setTimeout = window.requestAnimationFrame.bind(window) || window.setTimeout.bind(window);
        this.clearTimeout = window.cancelAnimationFrame.bind(window) || window.clearTimeout.bind(window);
        this.hz = opt.hz || 1000;
        this.status = timerStatus.finished; //0:未开始或已结束,1:正在进行中。
        this.ticks = [];
        this.timeups = [];
        this.name = opt.name || guid();
        this.begin = opt.begin || opt.start || 0;
        this.end = opt.end || 0;
        this.interval = opt.interval || 1000;
        this.tid = null;
        // 开始时间(相对)
        this.startTime = 0;
        if (this.hz) {
            this.setTimeout = window.setTimeout.bind(window);
            this.clearTimeout = window.clearTimeout.bind(window);
        }
    }
    destroy() {
        this.stop();
    }
    start() {
        this.startTime = timer.timestamp();
        const sign = Math.sign(this.begin - this.end);
        let resetTime = this.startTime;
        let times = 0;
        // 定义计时器
        // const globalTimer=new GlobalTimer()
        // const myTimer=globalTimer.add({start:120}).get();
        // myTimer.tick(value=>{
        //   this.ticks.forEach(tick => tick(value));
        //   console.log(value);
        // }).timeup(()=>{
        //   this.stop();
        // })
        const tickTimer = (interval, timerTick = () => { }) => {
            const curTime = timer.timestamp();
            if (curTime - resetTime >= interval) {
                times = Math.floor((curTime - this.startTime) / interval);
                resetTime = curTime;
                // timerTick();
                this.setTimeout(timerTick);
            }
            this.tid = this.setTimeout(() => tickTimer(interval, timerTick), this.hz);
        };
        tickTimer(this.interval, () => {
            const progress = this.begin - sign * times;
            this.ticks.forEach(tick => tick(!sign ? times : progress));
            if (progress < this.end + 1) {
                this.timeups.forEach(timeup => timeup());
                this.stop();
            }
        });
        return this;
    }
    pause() {
        if (this.status === timerStatus.finished)
            return false;
        this.status = timerStatus.suspend;
    }
    resume() {
        this.status = timerStatus.progress;
    }
    stop() {
        this.clearTimeout(this.tid);
        this.status = timerStatus.finished;
    }
    on(name, fun) {
        this[({ tick: 'ticks', timeup: 'timeups' })[name]].push(fun);
        return this;
    }
    off(name, fun) {
        const events = this[({ tick: 'ticks', timeup: 'timeups' })[name]];
        const idx = events.findIndex(item => item === fun);
        idx && events.splice(idx, 1);
        return this;
    }
    tick(fun) {
        this.ticks.push(fun);
        return this;
    }
    timeup(fun) {
        this.timeups.push(fun);
        return this;
    }
}
export default timer;
