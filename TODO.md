<!--
 * @Author: None
 * @LastEditors: None
 * @Date: 2020-10-11 12:11:48
 * @LastEditTime: 2020-11-09 00:50:09
-->
### TODO:

- store 的存储内容可以考虑把冗余的默认过期数据去掉,对于有过期设置的字段,加入一个特定的标记作为数据结构的判断比如 {__nonRaw:true}

- timers.ts
计时器把全局计时器中返回的timer换成类的实例.