<!--
 * @Author: None
 * @LastEditors: None
 * @Date: 2020-10-11 12:11:48
 * @LastEditTime: 2020-11-09 00:50:09
-->

### TODO:

- store 的存储内容可以考虑把冗余的默认过期数据去掉,对于有过期设置的字段,加入一个特定的标记作为数据结构的判断比如 {\_\_nonRaw:true}

- timers.ts

- 前端日志记录工具 nog
  通过localStorage + vConsole|eruda|自产 (彩蛋：生产环境可通过特殊链接(query或localStorage字段值，对应到用户)加操作来打开)
  主要功能：localStorage用来记录前端日志，可设置最大日志记录条数与日志各种真实数目，可以分类，可配置vConsole或工具自带的简易控制台，可记录错误日志及用户事件。
  localStorage仅用于记录，在import或者script加载的时候就已经开始记录，不受框架限制，vConsole用于展示。

nog.color('#ccc').log;


