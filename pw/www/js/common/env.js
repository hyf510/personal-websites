/*!
 * env模块 common子模块
 * 用于指定GS环境
 * @module account
 * @author: huangyanfeng137@163.com
 */
define([], function () {
    'use strict';

    var getParameter = function (param) {
            var reg = new RegExp('[&,?,&amp;]' + param + '=([^\\&]*)', 'i');
            var value = reg.exec(location.search);
            return value ? value[1] : '';
        },
        GS_ENV = getParameter('env');
    return (GS_ENV || 'DEVELOPMENT').toUpperCase();
});
