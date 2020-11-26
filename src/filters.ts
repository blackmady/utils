/*
 * @Author: None
 * @Date: 2019-11-06 14:50:24
 * @LastEditTime: 2019-11-06 15:08:50
 * @LastEditors: None
 * @Description: 脱敏及数字处理工具
 */
import utils from './utils'
export const filters = {
  '': (val: any) => val,
  /**姓名脱敏**/
  tmName: (name:string) => name && name.length > 1 ? name.replace(/.(?!$)/g, '*') : name || '',
  /**邮箱脱敏**/
  tmEmail: (mail = '') => {
    //固定显示三个*号长度
    return mail.replace(/(.{3}).*(@.*)/g, '$1***$2');
  },
  /**银行卡脱敏**/
  tmBankCard: (str='') => str && (str.length === 16 || str.length === 19) ? (str.substr(0, 6) + '******' + str.substr(-4, 4)) : str || '',
  tmIdCard: (str='') => str && (str.length === 15 || str.length === 18) ? (str.substr(0, 8) + '*******' + str.substr(-3, 3)) : str || '',
	/**电话或银行卡脱敏
	 ***规则为隐藏银行卡号或手机号的倒数第二个四位数
	 **/
  tmTel: (tel='') => tel && tel.length > 7 ? tel.replace(/\d{4}(?=\d{4}$)/, '****') : tel || '',
  tmCall: (tel='') => tel && tel.length > 7 ? tel.replace(/\d{4}/, '****') : tel || '',
  /**格式化*/
  /**格式化时间*/
  formatTime(d = new Date(), fmt:boolean|string = 'yyyy-MM-dd HH:mm:ss') {
    fmt = fmt === true ? 'yyyy-MM-dd HH:mm:ss' : fmt === false ? 'yyyy-MM-dd' : fmt;
    return utils.format(d, fmt);
  },
  /**格式化如下格式的时间201601080952134*/
  formatTime2(d:string|number, fmt='yyyy-MM-dd HH:mm:ss') {
    let nv = (d + '00000000000000').substr(0, 14);
    nv = nv.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1/$2/$3 $4:$5:$6');
    return filters.formatTime(new Date(nv), fmt);
  },
  /**格式化金额值，带逗号,u为单位字符串*/
  formatMoney: (v, l = 2, u='') => isNaN(v) ? v : (v - 0).toFixed(l).replace(l ? /(?!^)(?=(\d{3})+\.\d*)/g : /(?!^)(?=(\d{3})+$)/g, ',') + (u || ''),
  /**格式化以分为单位的金额.*/
  formatMoney2: (v, l = 2, u = ' 元') => filters.formatMoney((v || 0) / 100, l, u),
  /**格式化卡号，四位一空格*/
  formatCard: (cardNo:string) => cardNo.replace(/\d{4}/g, '$& '),
  /** 
   * @description: 补零(前置)
   * @param {number|string} num   原数据
   * @param {number} len  总长度:默认2
   * @param {string} str  填补字符串:默认'0'
   * @return: string
   */
  zeroize:(num:number|string,len:number=2,str:string='0'):string=>num.toString().padStart(len,str),
}