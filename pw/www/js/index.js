/**
 * @author huangyanfeng137@163.com
 * @description 首页
 * @date 2016/6/20
 */

define(['jquery','C','js/control','js/common/view','underscore'], function ($,C,Control,View,_) {
    'use strict';

    var Page = View.extend(_.extend({
        el:'body',
        Tpl_app: _.template($('#self-module').html()),//我的个人主页模板
        Tpl_index: _.template($('#look-module').html()),//我的主页模板
        initialize:function(){
            var $this = this,
                paramer = C.Utils.getQueryMap();
            if(paramer && paramer.from == 'myApp'){
                $this.$el.append($this.Tpl_app);
            }else{
                $this.$el.append($this.Tpl_index);
            }

        },
        events:{}
    }));

    $(function(){
        new Page();
    });
});
