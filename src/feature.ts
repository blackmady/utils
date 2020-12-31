// 浏览器等相关的一些特性功能
// 浏览器指纹，振动，通知等等功能
import FingerprintJS from '@fingerprintjs/fingerprintjs'
export default {
  // 浏览器指纹，通过@fingerprintjs/fingerprintjs获取，准确率60%左右
  async fingerprint() {
    // We recommend to call `load` at application startup.
    const fp = await FingerprintJS.load();
    // The FingerprintJS agent is ready.
    // Get a visitor identifier when you'd like to.
    const result = await fp.get();
    // This is the visitor identifier:
    const visitorId = result.visitorId;
    return visitorId;
  }
}