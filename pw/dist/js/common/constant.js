/*!
 * constant 模块常量
 * @module constant
 * @author: huangyanfeng137@163.com
 */
define(['js/common/flag'], function (Flag) {
    'use strict';

    var Constant = {
        /****** 后台接口标示 ******/
        Flag: Flag,

        /****** 本地储存名称 DataKey ******/
        DK: {
            // 例如： USER_LOGIN_INFO: 'PAPC_USER_LOGIN_INFO'

        },

        /****** 页面标题设置 调用方式 C.T.PAPC Constant.TITLE.PAPC ******/
        TITLE: {
            //例如：PAPC: '受理中心'

        },

        /****** 页面提示内容  调用方式 C.HT.M_B ******/
        TIP_TEXT: {
            //例如：客户名 U_B: '用户名不能为空'
            'ZHUCE':'您尚未注册有效账户，请注册！'
        },

        /****** 页面跳转 ******/
        SKIP_PAGE:{
            //首页
            INDEX:'index.html',
            //商城
            STORE:'store.html',
            //我的APP
            MYAPP:'my-app.html',
            //我的APP-基本信息
            MYINFO:'my-info.html',
            //基本信息-修改密码
            UPDATEPASSWORD:'update-password.html'
        }
    };
    return Constant;
});


