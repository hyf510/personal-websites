/**
 * @author huangyanfeng137@163.com
 * @description 我的APP-注册
 * @date 2016/12/19
 */
define(['jquery','C','js/control','js/common/view','underscore'],function($,C,Control,View,_){
    'use strict';

    var Page = View.extend(_.extend({
        userName:$('#user-name'),
        password:$('#password'),
        password2:$('#password2'),

        //事件
        events:{
            'click #register-submit':'doSubmit'
        },
        initialize:function(){

        },
        doSubmit:function(){
            var $this = this;
            if(!$this.userName.val() || !$this.password.val()){
                console.log('用户名密码不能为空！');
                return;
            }
            if($this.password.val() !== $this.password2.val()){
                console.log('输入的密码不一致！');
                return;
            }
            $.ajax({
                url: C.APP('REGISTER'),
                type:'POST',
                data:{
                    userName:$this.userName.val(),
                    password:$this.password.val()
                },
                success:function(data){
                    console.log(data);
                },
                error:function(data){},
                complete:function(){}
            });
        }
    }));

    $(function(){
        new Page({
            el:'body'
        });
    });
});