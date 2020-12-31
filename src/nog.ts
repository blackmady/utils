// 思想

/**
 * 思想:此为日志记录工具，由于日志问题查看起来及其不方便，尤其是生产环境，如果有出现错误完全不知道该从哪入手查找问题，此工具就为解决此问题而存在
 * 先记录再通过彩蛋触发的方式查看输出，使用占用内存较小自制工具或vconsole或eruda或接口作为查看日志的工具，并通过异步引入html2canvas来获取报错时的用户界面
 */

// 配置接口
interface IConfig {
  color?: string
}

// 记录接口
interface IRecord {
  type?: string, // eg: console.log,console.info
  group?: string, // eg: '支付问题'
  name?: string, // eg: 'weixin-pay'
  color?: string, // eg: '#ccc'
  data?: JSON //eg: 其他数据 
}

interface INog {
  (...args: any[]): any
  globalConfig: { group: String, color: String }
  start: () => void
  record: (obj: IRecord) => void
  config: (config: IConfig) => void
}

function fnog(...args) {
}

const staticFuns = {
  // 全局配置
  globalConfig: {
    // 默认分组名
    group: 'default',
    // 默认颜色
    color: '#333',
  },
  // 开始
  async start() {

  },
  // 记录
  record(obj: IRecord = { group: 'default' }) {

  },
  // 配置
  config(config: IConfig = { color: '#333' }) {
    return (...args) => {
      nog(...args)
    };
  },
  
}

const nog: INog = Object.setPrototypeOf(fnog, staticFuns);

export default nog;
/**
// 记录
nog.record()
// 调用
nog()
*/