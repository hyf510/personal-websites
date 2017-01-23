/**
 * @author huangyanfeng137@163.com
 * @description 控制台（头部搜索框、底部控制台）
 * @date 2016/6/20
 */

define([ 'jquery','C'], function ($,C) {
    'use strict';

    var home = $('#home'),
        store = $('#store'),
        my_app = $('#my_app'),
        nav = $('#nav'),
        success = $('#success'),
        error = $('#error');

    home.on('click',function(){
        C.Native.forward({
            url:C.Constant.SKIP_PAGE.INDEX,
            data:{from:'index'}
        });
    });
    store.on('click',function(){
        C.Native.forward({
            url: C.Constant.SKIP_PAGE.STORE
        })
    });
    my_app.on('click',function(){
        C.Native.forward({
            url: C.Constant.SKIP_PAGE.MYAPP
        });
    });
    nav.on('click',function(){
        history.back();
    });

    var Control = {
        tipText:function(t){
            var $this = this;
            error.show();
            error.text(t);
            $this.handler && clearTimeout($this.handler);
            $this.handler = setTimeout(function(){
                error.hide();
            },2000)
        },
        sucText:function(t){
            var $this = this;
            success.show();
            success.text(t);
            $this.handler && clearTimeout($this.handler);
            $this.handler = setTimeout(function(){
                success.hide();
            },2000)
        }
    };

    return Control;
});
