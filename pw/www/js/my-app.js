/**
 * @author huangyanfeng137@163.com
 * @description 我的APP
 * @date 2016/6/20
 */

define([ 'jquery','C','js/control','js/common/view','underscore'], function ($,C,Control,View,_) {
    'use strict';

    var Page = View.extend(_.extend({
        //指定根元素
        el:'section',
        //模板
        Ltemplate:$('#loanding').html(),//未登录
        Etemplate:$('#exit').html(),//已登录
        Dtemplate:$('#login').html(),//登录框模板
        //初始化
        initialize:function(){
            var $this = this;
            C.Utils.data('base_info') ? $this.$el.html($this.Etemplate) :  $this.$el.html($this.Ltemplate);
            localStorage.removeItem('webCollector');
        },
        render:function(){},
        events:{
            'click #loand':'kipLoand',
            'click #home,#store,#user,#assets':'doTip',
            'click #exit':'doExit',
            'click #has_home':'doHome',
            'click #has_store':'doStore',
            'click #has_user':'doUser',
            'click #has_assets':'doAssets',
            'click #vertify':'doLoand',
            'click #register':'doRegister'
        },
        kipLoand:function(){
            var $this = this;
            $this.$el.html($this.Dtemplate);
        },
        doTip:function(){
            console.log('请登录！');
        },
        doExit:function(){
            console.log("退出APP");
            var $this = this;
            C.Utils.data('base_info',null);
            $this.$el.html($this.Ltemplate)
        },
        doHome:function(){
            console.log("跳转到我的主页");
            C.Native.forward({
                url:C.Constant.SKIP_PAGE.INDEX,
                data:{from:'myApp'}
            });
        },
        doStore:function(){
            console.log("跳转到我的商城");
        },
        doUser:function(){
            console.log("跳转到基本信息设置");
            C.Native.forward({
                url:C.Constant.SKIP_PAGE.MYINFO
            });
        },
        doAssets:function(){
            console.log("跳转到资产管理");
        },
        doLoand:function() {
            var $this = this,
                accound = $('#accound').val(),
                usePassword = $('#use_pw').val();
            $.ajax({
                url: C.APP('LOAND'),
                type: 'GET',
                data: {
                    accound:accound,
                    usePassword:usePassword
                },
                success: function (data) {
                    console.log(data);
                    typeof data == 'string' ? data = JSON.parse(data) : '';
                    if (data.flag && data.flag == C.Flag.SUCCESS) {
                        data.data.hasLogin == C.Flag.LOAND_SUCCESS ? ($this.$el.html($this.Etemplate), C.Utils.data('base_info', data.data.baseInfo)) : Control.tipText(data.msg);
                    }
                }
            });
        },
        doRegister:function(){
            console.log("跳转到注册页面");
            C.Native.forward({
                url:C.Constant.SKIP_PAGE.REGISTER
            });
        }
    }));

    $(function () {
        new Page();
    });
});
