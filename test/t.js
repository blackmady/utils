"use strict";
exports.__esModule = true;
/*
 * @Author: None
 * @Date: 2019-11-05 16:19:12
 * @LastEditTime: 2019-11-06 15:21:55
 * @LastEditors: None
 * @Description:
 */
// import utils from '@coon/utils'
var utils_1 = require("../lib/utils");
var timers_1 = require("../src/timers");
utils_1["default"].countdown('x', 6, function (t) {
    console.log(t);
});
timers_1["default"].countdown(12).on('tick', function (rest) {
    console.log(rest);
});
