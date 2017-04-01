/*!
 * common模块提供zed_H5的所有基础功能以及环境初始化
 * @module common
 * @author: huangyanfeng137@163.com
 */
define([
    'jquery',
    // 天眼系统
    'js/common/eyeSky',
    // 基础库 不依赖其他模块
    'js/common/env',
    'js/common/utils',
    'js/common/app',
    'js/common/flag',
    'js/common/constant',
    'js/common/ui',
    'js/common/native'
], function ($,
             Observer,
             Env,
             Utils,
             App,
             Flag,
             Constant,
             UI,
             Native
) {
    'use strict';

    /****** js模块调用的方式 ******/
    var C = {
        // 环境变量(env.js)
        Env: Env,
        // 后端返回的标识符(flag.js)
        Flag: Flag,
        // 页面常量(constant.js)
        Constant: Constant,
        // 功能类api(utils.js)
        Utils: Utils,
        // UI类api(ui.js)
        UI: UI,
        // Native类api(native.js)
        Native:Native,
        // 路径配置(app.js)
        APP:App,
        //天眼监控
        Observer:Observer
    };

    return C;
});
