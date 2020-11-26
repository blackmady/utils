// 废弃

// 计时器状态
enum timerStatus{ finished, suspend, progress }

interface ITimers{
  [name:string]:ITimer
}


interface IOption{
  name?:string,
  step?:number,
  start?:number,
  end?:number,
  interval?:number,
  // tick:Function,
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

const countdown=window.requestAnimationFrame?.bind(window)||window.setTimeout.bind(window);
const clearCountdown=window.cancelAnimationFrame?.bind(window)||window.clearTimeout.bind(window);

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