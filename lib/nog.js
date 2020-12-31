// 思想
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * 思想:此为日志记录工具，由于日志问题查看起来及其不方便，尤其是生产环境，如果有出现错误完全不知道该从哪入手查找问题，此工具就为解决此问题而存在
 * 先记录再通过彩蛋触发的方式查看输出，使用占用内存较小自制工具或vconsole或eruda或接口作为查看日志的工具，并通过异步引入html2canvas来获取报错时的用户界面
 */
import FingerprintJS from '@fingerprintjs/fingerprintjs';
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
    start() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    },
    // 记录
    record(obj = { group: 'default' }) {
    },
    // 配置
    config(config = { color: '#333' }) {
        return (...args) => {
            nog(...args);
        };
    },
    // 浏览器指纹，通过@fingerprintjs/fingerprintjs获取，准确率60%左右
    fingerprint() {
        return __awaiter(this, void 0, void 0, function* () {
            // We recommend to call `load` at application startup.
            const fp = yield FingerprintJS.load();
            // The FingerprintJS agent is ready.
            // Get a visitor identifier when you'd like to.
            const result = yield fp.get();
            // This is the visitor identifier:
            const visitorId = result.visitorId;
            return visitorId;
        });
    }
};
const nog = Object.setPrototypeOf(fnog, staticFuns);
export default nog;
/**
// 记录
nog.record()
// 调用
nog()
*/ 
