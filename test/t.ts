/*
 * @Author: None
 * @Date: 2019-11-05 16:19:12
 * @LastEditTime: 2019-11-06 15:21:55
 * @LastEditors: None
 * @Description: 
 */
// import utils from '@coon/utils'
import utils from '../lib/utils'
import timer from '../src/timers'
utils.countdown('x',6,t=>{
  console.log(t)
})
timer.countdown(12).on('tick', rest => {
  console.log(rest);
})