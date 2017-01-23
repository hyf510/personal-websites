/**
 * @author huangyanfeng137@163.com
 * @description 我的APP-基本信息
 * @date 2016/6/20
 */

define([ 'jquery','C','js/control','js/common/view','underscore'], function ($,C,Control,View,_) {
    'use strict';

    var Page = View.extend(_.extend({
        //指定根元素
        el:'section',
        className:'container-fluid',
        //模板
        baseTpl: _.template($('#base_info').html()),
        //初始化
        initialize:function(){
            var $this = this,
                data = C.Utils.data('base_info');
            if(data){
                $this.$el.append($this.baseTpl(data));
            }
        },
        render:function(){},
        //事件处理
        events:{
            'click .badge':'doUpdate',
            'click #submit-update':'doSubmit',
            'click #btn-pw':'skipPw',
            'change #change-images':'changeImg',
            'click #updata-img':'updataImg'
        },
        doUpdate:function(e){
            var $this = this,
                dom = $(e.currentTarget),
                input = dom.siblings('input');
            dom.hide();
            input.show().focus().on('blur',function(){
                input.hide();
                input.val() != dom.text() ? (dom.show().text(input.val()),$('#submit-update').show()) : dom.show();
            });
        },
        doSubmit:function(){
            var paramer = [];
            $.each($('.badge'),function(index,item){
                paramer[index] = $(item).text();
            });
            $.ajax({
                url: C.APP('UPDATE_INFO'),
                type:'get',
                data:{
                    id: C.Utils.data('base_info').id,
                    userName : paramer[0],
                    gender : paramer[1],
                    birthday : paramer[2],
                    tel : paramer[3],
                    qq : paramer[4],
                    email : paramer[5]
                },
                success:function(data){
                    console.log(data);
                    if(data.flag && data.flag == C.Flag.SUCCESS ){
                        Control.sucText('您好，信息修改成功！');
                        $('#submit-update').hide();
                    }else{
                        Control.tipText(data.msg);
                    }
                }
            });
        },
        skipPw:function(){
            C.Native.forward({
                url: C.Constant.SKIP_PAGE.UPDATEPASSWORD
            });
        },
        /**
         * 更改头像
         */
        changeImg:function(){
            var file = document.getElementById('change-images').files[0],
                readObj = new FileReader();
            readObj.readAsDataURL(file);
            readObj.onload = function(ProgressEvent){
                console.log(ProgressEvent.target.result);
                $('#imgPre').attr('src',ProgressEvent.target.result);
                $('#change-images').hide();
                $('#updata-img').text('上传图片').removeClass('btn-primary').addClass('btn-danger');
            };
        },
        updataImg:function(){
            var srcTar = $('#imgPre').attr('src');
            if(!srcTar){
                Control.tipText('图片上传出错！请重试');
                return;
            }
            $.ajax({
                url: C.APP('UPDATE_IMG'),
                type:'post',
                data:{
                    id: C.Utils.data('base_info').id,
                    portrait:srcTar
                },
                header:{
                    "Origin":"http://localhost:8089"
                },
                success:function(data){
                    if(data.flag && data.flag == C.Flag.SUCCESS ){
                        Control.sucText('您好，图片上传成功！');
                        $('#change-images').show();
                        $('#updata-img').text('更换头像').removeClass('btn-danger').addClass('btn-primary');
                    }else{
                        Control.tipText(data.msg);
                    }
                },
                error:function(data){
                    console.log(data);
                }
            });
        },
        /**
         * 将canvas画布内容保存为base64位的图片
         */
        getBase64:function(url){
            var canvas = document.createElement('canvas'),
                cOb = canvas.getContext('2d');
            cOb.width = 230;
            cOb.height = 230;
            var image = new Image();
            image.src = url;
            cOb.drawImage(image,0,0);
            return canvas.toDataURL();
        }

    }));

    $(function(){
        new Page();
    })
});

