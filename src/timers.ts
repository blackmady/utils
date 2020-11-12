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

/**
 * @description: 计时器的配置对象,不需要手动配置
 * @param hz 计时频率,默认为0
 * @param name 计时器名称
 * @param start|begin 开始数值
 * @param end 结束数值
 * @param interval 计时间隔,一般为1000
 */
interface ITimerOption{
  hz?:number
  name?:string
  start?:number
  begin?:number
  end?:number
  interval?:number
}
/**
 * @description: 传入的配置对象
 * @param auto 是否自动开始计时
 * @param name 计时器名称,使用过已分配的计时器名称时会覆盖
 * @param interval 计时间隔,一般为1000
 * @param start 开始数值
 * @param end 结束数值
 */
interface ICountdownOption{
  auto?: boolean,
  name?: string,
  interval?: number,
  start?: number,
  end?: number,
}


interface ITimer{
  // 名字
  name:string
  // 步长
  step:number
  // 开始计时的时间戳
  _startTime:number
  // 最后一次触tick的时间戳
  _lastTime:number
  // 暂停时长
  _durationOfPause:number
  // 状态
  status:number
  // 计时间隔
  interval:number
  // 计次数
  _times:number
  // 开始数值
  start:number
  // 当前值
  value:number
  // 结束数值
  end:number
  // 滴嗒
  tick:Function
  // 结束
  timeup:Function
  // 重置
  reset:Function
  // 暂停
  pause:Function
  // 继续
  resume:Function
  // 注册事件:tick,timeup
  on:Function
  // 注销tick或timeup事件
  off:Function
}
interface ITimers{
  [name:string]:ITimer
}

// 计时器状态
enum timerStatus{finished,suspend,progress}


// 全局timestamps,请自行避免重复
/**
 * @description: 生成guid 
 * @return string
 */
function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
const countdown=window.requestAnimationFrame?.bind(window)||window.setTimeout.bind(window);
const clearCountdown=window.cancelAnimationFrame?.bind(window)||window.clearTimeout.bind(window);

interface IOption{
  name?:string,
  step?:number,
  start?:number,
  end?:number,
  interval?:number,
  // tick:Function,
}

// 定义全局唯一计时器类
class GlobalTimer{
  // 计时器,从start开始计时到end,时间间隔为interval,start默认值为0
  public timers:ITimers={};
  public lastTimer?:ITimer
  private ticks:{[name:string]:Function}={}
  private timeups:{[name:string]:Function}={}
  constructor(opt?:IOption){
    opt && this.add(opt)
  }
  /**
   * @description: 添加计时器
   * @param {string} name
   * @param {number} interval
   * @return GlobalTimer
   */
  now(){
    return performance?.now()||Date.now();
  }
  // 获取timer的数据
  get(name?:string){
    return name?this.timers[name]:this.lastTimer!
  }
  // 获取timerTick
  getTimerTick(name:string){
    const timer=this.get(name);
    return (tick:Function)=>{
      tick()
    }
  }
  // 注册一个计时器
  add(opt: IOption) {
    const timer:ITimer={
      step:-1,
      name:guid(),
      _startTime:this.now(),
      _lastTime:0,
      _durationOfPause:0,
      _times:0,
      status:timerStatus.finished,
      start:0,
      value:0,
      end:0,
      interval:1000,
      ...opt,
      tick: () => { },
      timeup: () => { },
      reset: () => { },
      pause: () => { },
      resume: () => { },
      on: () => { },
      off: () => { },
    }
    timer.step??=Math.sign(timer.start-timer.end);
    timer.value=timer.start!;
    timer.tick=(tick:Function)=>{
      this.ticks[timer.name]=tick
      return this;
    }
    timer.timeup=(timeup:Function)=>{
      this.timeups[timer.name]=timeup
      return this;
    }
    timer.reset=()=>{
      timer.status=timerStatus.finished
      timer.value=0;
      timer._lastTime=timer._startTime=this.now();
    }
    timer.pause=()=>{
      timer.status=timerStatus.suspend
    }
    timer.resume=()=>{
      timer.status=timerStatus.progress
    }
    timer.on=(name:string,fun:Function)=>{
      ({
        tick:this.ticks,
        timeup:this.timeups,
      })[name][timer.name]=fun 
    }
    timer.off=(name?:string)=>{
      if(!name){
        delete this.ticks[timer.name];
        delete this.timeups[timer.name];
      }else{
        delete ({
          tick:this.ticks,
          timeup:this.timeups,
        })[name][timer.name]
      }
    }
    this.lastTimer=timer;
    this.timers[timer.name]=timer
    return this;
  }
  remove(name:string){
    delete this.timers[name]
  }
  start(){
    // 开始tick
    this.countdown();
  }
  // 某一tick触发时执行
  tick(timer:ITimer){
    this.ticks[timer.name]?.(timer!.value,timer);
  }
  // 某一timeup触发时执行
  timeup(timer:ITimer){
    this.timeups[timer.name]?.(timer);
  }
  countdown(){
    countdown(this.countdown)
    // const currTime=timer.timestamp();
    const currTime=this.now();
    for(let name in this.timers){
      const timer=this.timers[name]
      if(timer.status===timerStatus.finished){ // 如果状态是未开始或者已结束就标记为开始
        timer._lastTime=timer._startTime;
        timer.status=timerStatus.progress
      }
      if(timer.status===timerStatus.progress){ // 如果状态是进行中则进行判断
        if((currTime-timer._lastTime)>=timer.interval){
          // timer._times++;
          timer._times=Math.floor((currTime-timer._startTime)/timer.interval)
          // timer._lastTime=currTime;
          timer._lastTime=timer._startTime+timer.interval*timer._times;
          timer.value=timer.start+timer.step;
          this.tick(timer);
        }
        if((timer.step<0 && timer.value<=timer.end)||(timer.step>0 && timer.value<=timer.end)){
          timer.status=timerStatus.finished
          this.timeup(timer);
        }
      }
    }
  }
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
  exist(name:string) {
    return !!this.timers[name]
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
    return performance?.now?.() || Date.now()
  },
  /**
   * @description: 创建计时器
   * @param {ITimerOption} opt
   * @return Timer
   */
  create(opt:ITimerOption) {
    return new Timer(opt);
  },
  /**
   * @description: 倒计时,当start===end时会返回计数次数,当有name时优先获取已存在的。
   * @param {countdownOption} opt
   * @return Timer
   */
  countdown(opt:ICountdownOption|number|string) {
    const defOpt = {
      auto: true,
      name: guid(),
      interval: 1000,
      start: 0,
      end: 0,
    }
    if (typeof opt === 'number') {
      opt = { start: opt }
    } else if (typeof opt === 'string') {
      return this.timers[opt];
    }
    opt = { ...defOpt, ...opt }
    if (this.timers[opt.name!]) {
      // console.warn(`计时器${opt.name}已存在，将被覆盖！`)
      this.timers[opt.name!]?.destroy();
    }
    const newTimer = this.create(opt);
    this.timers[opt.name!] = newTimer;
    return opt.auto ? newTimer.start() : newTimer;
  },

  /**
   * @description: 类似console.time
   * @param {string} name
   * @return number
   */
  time(name:string='none'):number {
    return this.timestamps[name] = this.timestamp()
  },
  /**
   * @description: 类似console.timeLog,只返回,不输出
   * @param {string} name 
   * @return number
   */
  timeLog(name:string='none') {
    return this.timestamp() - this.timestamps[name]
  },
  /**
   * @description: 类似console.timeEnd,只返回,不输出
   * @param {string} name
   * @return number
   */
  timeEnd(name:string='none') {
    const r = this.timeLog(name);
    delete this.timestamps[name];
    return r;
  }
}
// 计时器类
export class Timer {
  private tid:number|null;
  private setTimeout:Function;
  private clearTimeout:Function;
  private ticks:Function[];
  private timeups:Function[];
  private hz:number;
  public name:string;
  public status:number;
  public begin:number;
  public end:number;
  public interval:number;
  public startTime:number;
  constructor(opt:ITimerOption) {
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
  public destroy() {
    this.stop();
  }
  public start() {
    const globalTimer=new GlobalTimer()
    this.startTime = timer.timestamp();
    const sign = Math.sign(this.begin - this.end);
    let resetTime = this.startTime;
    let times = 0;
    // 定义计时器
    const myTimer=globalTimer.add({start:120}).get();
    myTimer.tick(value=>{
      this.ticks.forEach(tick => tick(value));
      console.log(value);
    }).timeup(()=>{
      this.stop();
    })
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
  }
  public pause() { 
    if(this.status===timerStatus.finished)return false;
    this.status=timerStatus.suspend;
  }
  public resume() {
    this.status=timerStatus.progress;
  }
  public stop() {
    this.clearTimeout(this.tid);
    this.status=timerStatus.finished;
  }
  public on(name:string, fun:Function) {
    this[({ tick: 'ticks', timeup: 'timeups' })[name]].push(fun);
    return this;
  }
  public off(name:string, fun:Function) {
    const events:Function[] = this[({ tick: 'ticks', timeup: 'timeups' })[name]];
    const idx = events.findIndex(item => item === fun);
    idx && events.splice(idx, 1);
    return this;
  }
  public tick(fun:Function) {
    this.ticks.push(fun);
    return this;
  }
  public timeup(fun:Function) {
    this.timeups.push(fun)
    return this;
  }
}

export default timer;