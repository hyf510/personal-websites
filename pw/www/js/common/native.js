/**
 * @author huangyanfeng137@163.com
 * @description 首页
 * @date 2016/6/20
 */
define(['js/common/env','js/common/common'],function(Env,C){
    'use strict';

    // 获取url
    var  getUrl = function (url) {
        if (/html/.test(url) && Env != 'PRODUCTION' && C.Utils.getParameter('env')) {
            if (url.indexOf('?') > -1) {
                url += '&env=' + Env;
            } else {
                url += '?env=' + Env;
            }
        }
        return url;
        },

        __params__url__ = function(data, url) {
        if (data) {
            data = $.param(data);
            if (url.indexOf('?') > -1) {
                url += '&' + data;
            } else {
                url += '?' + data;
            }
        }

        /*
         *过滤param
         */
        if (url && url.indexOf('?') > -1) {
            var param = [],
                urlHost = url.split("?")[0],
                urlData = C.Utils.getQueryMap(url);
            for (var key in urlData) {
                var tmp = '';
                try {
                    tmp = decodeURIComponent(urlData[key]);
                } catch (e) {
                    tmp = urlData[key];
                }
                param.push(key + '=' + encodeURIComponent(tmp));
            }
            url = urlHost + "?" + param.join("&");
        }

        url = url.replace(/(%2F)/ig, "/");
        return url;
    },

     Native = {
        /**
         * WebView跳转（本地页面、服务端页面、及模块）
         * .url 字符串 跳转的链接
         */
         forward: function(options) {
             options = options || { data: {} };
             var _this = this,
                 _data = $.extend({}, C.Utils.getQueryMap(), options.data),
                 _url = __params__url__(_data, options.url);
            location.href = _url;
         },
        /**
         * WebView返回
         * @param options {url:''} 页面
         */
        back: function (option) {
            var options = option || {},
                url = options.url || '';
            if (url) {
                location.href = getUrl(url);
            } else {
                history.back();
            }
        }
    };
    return Native;
});
