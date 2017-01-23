/**
 * @author huangyanfeng137@163.com
 * @description 我的APP-基本信息-修改密码
 * @date 2016/6/20
 */

define([ 'jquery','C','js/control','js/common/view','underscore'], function ($,C,Control,View,_) {
    'use strict';

    var Page = View.extend(_.extend({
        //指定根元素
        el:'section',
        className:'container-fluid',
        //获取账号
        accound:$('#accound'),
        //获取密码
        oldPw:$('#old_pw'),
        //获取新密码
        newPw:$('#new_pw'),
        //获取二次密码
        newPw2:$('#new_pw2'),
        //获取确认按钮元素
        btn:$('#vertify'),
        //获取取消按钮元素
        nbtn:$('#abolish'),
        //提交修改密码模块操作按钮
        updateBtn:$('#update-btn'),
        //修改成功后操作按钮
        successBtn:$('#success-btn'),
        //初始化
        initialize:function(){},
        render:function(){},
        //事件处理
        events:{
            'click #abolish':'doBack',
            'click #vertify':'doUpdate',
            'click #success-btn':'doExit'
        },
        doBack:function(){
            C.Native.forward({
                url: C.Constant.SKIP_PAGE.MYINFO
            });
        },
        doUpdate:function(){
            var $this = this,
                data = {
                    accound:$this.accound.val(),
                    oldPassword:$this.oldPw.val(),
                    newPassword:$this.newPw.val(),
                    newPassword2:$this.newPw2.val()
                };
            if(data.accound == ""  || data.oldPassword == ""  || data.newPassword == "" || data.newPassword2 == ""){
                Control.tipText('信息填写不完善！');
                return;
            }
            if(data.newPassword != data.newPassword2){
                Control.tipText('输入的新密码不一致！');
                return;
            }
            $.ajax({
                url: C.APP('UPDATE_PW'),
                type:'get',
                data:data,
                success:function(data){
                    if(data.flag && data.flag == C.Flag.SUCCESS){
                        console.log(data);
                        if(data.data.hasUpdate == C.Flag.UPDATE){
                            $this.updateBtn.hide();
                            $this.successBtn.show();
                        }
                    }
                }
            });
        },
        doExit:function(){
            C.Utils.data('base_info',null);
            C.Native.forward({
                url: C.Constant.SKIP_PAGE.MYAPP
            });
        }
    }));

    $(function(){
        new Page();
    })
});

