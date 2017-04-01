/*!
 * 环境变量，是Common模块的一部分
 * @module env
 * @require js/common/env 根据环境变量返回API
 * @author: huangyanfeng137@163.com
 */
define([
    'jquery',
    'js/common/env',
    'js/common/constant'
], function ($, Env, Constant) {
    'use strict';

    var prefix = '',
        app = {};
    switch (Env) {
        case 'DEVELOPMENT' :
            prefix = './data/';
            break;
        case 'STG1':
        case 'STG2':
        case 'STG3':
            prefix = 'http://localhost:8099';
            break;
        default:
            prefix = '';
    }
    app = Env == 'DEVELOPMENT' ? {
        //例如：本地开发环境模拟JSONPLUGIN_LOGIN: prefix + 'login.json'
        LOAND: prefix + 'loand.json',
        UPDATE_INFO:prefix + 'test_suc.json'

    } : {
        //天眼系统配置
        EYESKY: '/hyf/eyeObserver/submit.do',
        //例如： 登录接口PLUGIN_LOGIN: 'gs/user1/login/login.do'
        LOAND: '/eHome/user/login.do',
        UPDATE_PW:'/eHome/userInfo/updatePassword.do',
        UPDATE_INFO:'/eHome/userInfo/updateUserInfo.do',
        UPDATE_IMG:'/eHome/userInfo/updateUserImage.do',
        REGISTER:'/eHome/user/register.do'
    };

    var getUrl = function (name) {
        return Env == 'DEVELOPMENT' ? (app[name]) : (prefix + app[name]);
    };

    return getUrl;
});