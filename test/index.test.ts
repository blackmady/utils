/*
 * @Author: None
 * @LastEditors: None
 * @Date: 2019-11-06 16:11:01
 * @LastEditTime: 2019-11-06 17:45:19
 * @Description: 
 */
import utils from '../lib/utils'

it('补零测试', () => { 
  expect(
    utils.zeroize(3)
  ).toBe('03')
})
