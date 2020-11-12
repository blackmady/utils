"use strict";
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a, _b;
exports.__esModule = true;
exports.Timer = void 0;
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
var countdown = ((_a = window.requestAnimationFrame) === null || _a === void 0 ? void 0 : _a.bind(window)) || window.setTimeout.bind(window);
var clearCountdown = ((_b = window.cancelAnimationFrame) === null || _b === void 0 ? void 0 : _b.bind(window)) || window.clearTimeout.bind(window);
// 定义全局唯一计时器类
var GlobalTimer = /** @class */ (function () {
    function GlobalTimer(opt) {
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
    GlobalTimer.prototype.now = function () {
        return (performance === null || performance === void 0 ? void 0 : performance.now()) || Date.now();
    };
    // 获取timer的数据
    GlobalTimer.prototype.get = function (name) {
        return name ? this.timers[name] : this.lastTimer;
    };
    // 获取timerTick
    GlobalTimer.prototype.getTimerTick = function (name) {
        var timer = this.get(name);
        return function (tick) {
            tick();
        };
    };
    // 注册一个计时器
    GlobalTimer.prototype.add = function (opt) {
        var _this = this;
        var _a;
        var timer = __assign(__assign({ step: -1, name: guid(), _startTime: this.now(), _lastTime: 0, _durationOfPause: 0, _times: 0, status: timerStatus.finished, start: 0, value: 0, end: 0, interval: 1000 }, opt), { tick: function () { }, timeup: function () { }, reset: function () { }, pause: function () { }, resume: function () { }, on: function () { }, off: function () { } });
        (_a = timer.step) !== null && _a !== void 0 ? _a : (timer.step = Math.sign(timer.start - timer.end));
        timer.value = timer.start;
        timer.tick = function (tick) {
            _this.ticks[timer.name] = tick;
            return _this;
        };
        timer.timeup = function (timeup) {
            _this.timeups[timer.name] = timeup;
            return _this;
        };
        timer.reset = function () {
            timer.status = timerStatus.finished;
            timer.value = 0;
            timer._lastTime = timer._startTime = _this.now();
        };
        timer.pause = function () {
            timer.status = timerStatus.suspend;
        };
        timer.resume = function () {
            timer.status = timerStatus.progress;
        };
        timer.on = function (name, fun) {
            ({
                tick: _this.ticks,
                timeup: _this.timeups
            })[name][timer.name] = fun;
        };
        timer.off = function (name) {
            if (!name) {
                delete _this.ticks[timer.name];
                delete _this.timeups[timer.name];
            }
            else {
                delete ({
                    tick: _this.ticks,
                    timeup: _this.timeups
                })[name][timer.name];
            }
        };
        this.lastTimer = timer;
        this.timers[timer.name] = timer;
        return this;
    };
    GlobalTimer.prototype.remove = function (name) {
        delete this.timers[name];
    };
    GlobalTimer.prototype.start = function () {
        // 开始tick
        this.countdown();
    };
    // 某一tick触发时执行
    GlobalTimer.prototype.tick = function (timer) {
        var _a, _b;
        (_b = (_a = this.ticks)[timer.name]) === null || _b === void 0 ? void 0 : _b.call(_a, timer.value, timer);
    };
    // 某一timeup触发时执行
    GlobalTimer.prototype.timeup = function (timer) {
        var _a, _b;
        (_b = (_a = this.timeups)[timer.name]) === null || _b === void 0 ? void 0 : _b.call(_a, timer);
    };
    GlobalTimer.prototype.countdown = function () {
        countdown(this.countdown);
        // const currTime=timer.timestamp();
        var currTime = this.now();
        for (var name_1 in this.timers) {
            var timer_1 = this.timers[name_1];
            if (timer_1.status === timerStatus.finished) { // 如果状态是未开始或者已结束就标记为开始
                timer_1._lastTime = timer_1._startTime;
                timer_1.status = timerStatus.progress;
            }
            if (timer_1.status === timerStatus.progress) { // 如果状态是进行中则进行判断
                if ((currTime - timer_1._lastTime) >= timer_1.interval) {
                    // timer._times++;
                    timer_1._times = Math.floor((currTime - timer_1._startTime) / timer_1.interval);
                    // timer._lastTime=currTime;
                    timer_1._lastTime = timer_1._startTime + timer_1.interval * timer_1._times;
                    timer_1.value = timer_1.start + timer_1.step;
                    this.tick(timer_1);
                }
                if ((timer_1.step < 0 && timer_1.value <= timer_1.end) || (timer_1.step > 0 && timer_1.value <= timer_1.end)) {
                    timer_1.status = timerStatus.finished;
                    this.timeup(timer_1);
                }
            }
        }
    };
    return GlobalTimer;
}());
// 计时器静态库
var timer = {
    timestamps: {},
    timers: {},
    /**
     * @description: 计时器是否存在
     * @param {string} name
     * @return boolean
     */
    exist: function (name) {
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
    timestamp: function () {
        var _a;
        return ((_a = performance === null || performance === void 0 ? void 0 : performance.now) === null || _a === void 0 ? void 0 : _a.call(performance)) || Date.now();
    },
    /**
     * @description: 创建计时器
     * @param {ITimerOption} opt
     * @return Timer
     */
    create: function (opt) {
        return new Timer(opt);
    },
    /**
     * @description: 倒计时,当start===end时会返回计数次数,当有name时优先获取已存在的。
     * @param {countdownOption} opt
     * @return Timer
     */
    countdown: function (opt) {
        var _a;
        var defOpt = {
            auto: true,
            name: guid(),
            interval: 1000,
            start: 0,
            end: 0
        };
        if (typeof opt === 'number') {
            opt = { start: opt };
        }
        else if (typeof opt === 'string') {
            return this.timers[opt];
        }
        opt = __assign(__assign({}, defOpt), opt);
        if (this.timers[opt.name]) {
            // console.warn(`计时器${opt.name}已存在，将被覆盖！`)
            (_a = this.timers[opt.name]) === null || _a === void 0 ? void 0 : _a.destroy();
        }
        var newTimer = this.create(opt);
        this.timers[opt.name] = newTimer;
        return opt.auto ? newTimer.start() : newTimer;
    },
    /**
     * @description: 类似console.time
     * @param {string} name
     * @return number
     */
    time: function (name) {
        if (name === void 0) { name = 'none'; }
        return this.timestamps[name] = this.timestamp();
    },
    /**
     * @description: 类似console.timeLog,只返回,不输出
     * @param {string} name
     * @return number
     */
    timeLog: function (name) {
        if (name === void 0) { name = 'none'; }
        return this.timestamp() - this.timestamps[name];
    },
    /**
     * @description: 类似console.timeEnd,只返回,不输出
     * @param {string} name
     * @return number
     */
    timeEnd: function (name) {
        if (name === void 0) { name = 'none'; }
        var r = this.timeLog(name);
        delete this.timestamps[name];
        return r;
    }
};
// 计时器类
var Timer = /** @class */ (function () {
    function Timer(opt) {
        this.setTimeout = window.requestAnimationFrame.bind(window) || window.setTimeout.bind(window);
        this.clearTimeout = window.cancelAnimationFrame.bind(window) || window.clearTimeout.bind(window);
        this.hz = opt.hz || 0;
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
    Timer.prototype.destroy = function () {
        this.stop();
    };
    Timer.prototype.start = function () {
        var _this = this;
        var globalTimer = new GlobalTimer();
        this.startTime = timer.timestamp();
        var sign = Math.sign(this.begin - this.end);
        var resetTime = this.startTime;
        var times = 0;
        // 定义计时器
        var myTimer = globalTimer.add({ start: 120 }).get();
        myTimer.tick(function (value) {
            _this.ticks.forEach(function (tick) { return tick(value); });
            console.log(value);
        }).timeup(function () {
            _this.stop();
        });
        // const tickTimer = (interval:number, timerTick = () => { }) => {
        //   const curTime = timer.timestamp();
        //   if (curTime - resetTime >= interval) {
        //     times = Math.floor((curTime - this.startTime) / interval);
        //     resetTime = curTime;
        //     // timerTick();
        //     this.setTimeout(timerTick);
        //   }
        //   this.tid = this.setTimeout(() => tickTimer(interval, timerTick), this.hz);
        // }
        // tickTimer(this.interval, () => {
        //   const progress = this.begin - sign * times;
        //   this.ticks.forEach(tick => tick(!sign ? times : progress));
        //   if (progress < this.end + 1) {
        //     this.timeups.forEach(timeup => timeup());
        //     this.stop();
        //   }
        // })
        return this;
    };
    Timer.prototype.pause = function () {
        if (this.status === timerStatus.finished)
            return false;
        this.status = timerStatus.suspend;
    };
    Timer.prototype.resume = function () {
        this.status = timerStatus.progress;
    };
    Timer.prototype.stop = function () {
        this.clearTimeout(this.tid);
        this.status = timerStatus.finished;
    };
    Timer.prototype.on = function (name, fun) {
        this[({ tick: 'ticks', timeup: 'timeups' })[name]].push(fun);
        return this;
    };
    Timer.prototype.off = function (name, fun) {
        var events = this[({ tick: 'ticks', timeup: 'timeups' })[name]];
        var idx = events.findIndex(function (item) { return item === fun; });
        idx && events.splice(idx, 1);
        return this;
    };
    Timer.prototype.tick = function (fun) {
        this.ticks.push(fun);
        return this;
    };
    Timer.prototype.timeup = function (fun) {
        this.timeups.push(fun);
        return this;
    };
    return Timer;
}());
exports.Timer = Timer;
exports["default"] = timer;
