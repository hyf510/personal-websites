/*!
 * commonģ���ṩzed_H5�����л��������Լ�������ʼ��
 * @module common
 * @author: huangyanfeng137@163.com
 */
define([
    'jquery',
    // ����ϵͳ
    'js/common/eyeSky',
    // ������ ����������ģ��
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

    /****** jsģ����õķ�ʽ ******/
    var C = {
        // ��������(env.js)
        Env: Env,
        // ��˷��صı�ʶ��(flag.js)
        Flag: Flag,
        // ҳ�泣��(constant.js)
        Constant: Constant,
        // ������api(utils.js)
        Utils: Utils,
        // UI��api(ui.js)
        UI: UI,
        // Native��api(native.js)
        Native:Native,
        // ·������(app.js)
        APP:App,
        //���ۼ��
        Observer:Observer
    };

    return C;
});
