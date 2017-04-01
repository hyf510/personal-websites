/**
 * Created by huangyanfeng on 2017/2/13.
 * description：天眼系统
 */
define(['C','js/common/buried', 'jquery'], function (C,bpo,$) {

    /*
     * @class 收集器控制开关
     * @value true
     * @value false
     * */
    var control = {
        Monitor: true, //用户轨迹
        buriedPoint: false, //埋点种植
        register: false, //JS异常监听
        XMLInterface: false, //XML接口监听
        JQInterface: true //JQ接口监听
    };

    /*
    * @module 程序入口
    * @class 创建数据
    * */
    (function(){
        var dataSet = {},
            pathName = window.location.pathname.split('/')[1].split('.')[0] + '_' + new Date().getTime();
        if(localStorage.getItem('webCollector')){
            dataSet = JSON.parse(localStorage.getItem('webCollector'));
        }
        dataSet[pathName] = {};
        localStorage.setItem('webCollector',JSON.stringify(dataSet));
    })();

    /*
     * @module 数据处理
     * */
    var dataStore = function(pathName,type,data){
        var dataSet = {},
            nameArr = [],
            pageArr = [];
        if (localStorage.getItem('webCollector')) {
            dataSet = JSON.parse(localStorage.getItem('webCollector'));
        }
        for (var name in dataSet) {
            nameArr.push(name);
            pageArr.push(name.split('_')[0]);
        }
        if(pageArr.indexOf(pathName) != -1){
            if(dataSet[nameArr[pageArr.lastIndexOf(pathName)]][type]){
                dataSet[nameArr[pageArr.lastIndexOf(pathName)]][type].push(data);
            }else{
                dataSet[nameArr[pageArr.lastIndexOf(pathName)]][type] = [data];
            }
        }
        localStorage.setItem('webCollector', JSON.stringify(dataSet));
    };

    /*
    * @module 数据上报
    * */
    var httpRequest = function(){
        console.log("————TODO:进入数据上传！————");
        var handler,xml,
            pathUrl = 'http://localhost:8099/hyf/eyeObserver/submit.do',//配置数据上报接口
            dataSet = localStorage.getItem('webCollector');//获取本地存储数据
        if($){
            $.ajax({
                url:pathUrl,
                type:'post',
                data:dataSet,
                header:{
                    "Origin":"http://localhost:8089"
                },
                success:function(res){
                    if(res && res.flag == '1'){
                        //数据提交后清除本地缓存
                        localStorage.removeItem('webCollector');
                    }
                },
                error:function(){
                    //10秒后重新发起请求
                    handler && clearTimeout(handler);
                    handler = setTimeout(function () {
                        httpRequest();
                    }, 10000);
                }
            });
        }else{
            if(window.XMLHttpRequest){
                xml = new XMLHttpRequest();
            }else if (window.ActiveXObject){
                xml = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xml.onreadystatechange = function(){
                if(xml.readyState == 4 && xml.status == 200){
                    console.log('数据提交成功！');
                }
            };
            xml.open('post',pathUrl);
            xml.send(dataSet);
        }
    };

    /*
    * @module 重写XMLHttpRequest
    * */
    if(control.XMLInterface){
        (function(){
            function ajaxEventTrigger(event) {
                var ajaxEvent = new CustomEvent(event, { detail: this });
                window.dispatchEvent(ajaxEvent);
            }
            var oldXHR = window.XMLHttpRequest;
            function newXHR() {
                var realXHR = new oldXHR();
                realXHR.addEventListener('abort', function () { ajaxEventTrigger.call(this, 'ajaxAbort'); }, false);
                realXHR.addEventListener('error', function () { ajaxEventTrigger.call(this, 'ajaxError'); }, false);
                realXHR.addEventListener('load', function () { ajaxEventTrigger.call(this, 'ajaxLoad'); }, false);
                realXHR.addEventListener('loadstart', function () { ajaxEventTrigger.call(this, 'ajaxLoadStart'); }, false);
                realXHR.addEventListener('progress', function () { ajaxEventTrigger.call(this, 'ajaxProgress'); }, false);
                realXHR.addEventListener('timeout', function () { ajaxEventTrigger.call(this, 'ajaxTimeout'); }, false);
                realXHR.addEventListener('loadend', function () { ajaxEventTrigger.call(this, 'ajaxLoadEnd'); }, false);
                realXHR.addEventListener('readystatechange', function() { ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);
                return realXHR;
            }
            window.XMLHttpRequest = newXHR;
        })();
    }

    var main = {
        /*
         * @module 注册点击事件监听器
         * @params eventType 定义页面需要监听的事件类型
         * @params dataSet 数据集
         * @params pathName 页面路径
         * @params nodeInfo 事件节点信息
         * @params Elm 事件源
         * @params Text 事件源文本
         * */
        Monitor: function () {
            var eventType = ['tap'];
            for (var i = 0; i < eventType.length; i++) {
                window.addEventListener(eventType[i], function (Event) {
                    var pathName = window.location.pathname.split('/')[1].split('.')[0],
                        nodeInfo = {
                            timeNode: new Date(),
                            Elm: Event.target.tagName || Event.target.nodeName,//获取元素名称
                            id: Event.target.id,//获取id标识符
                            className: Event.target.className,//获取class类名
                            nodeType: Event.target.nodeType,//元素节点类型
                            Text: Event.target.innerText || Event.target.textContent//获取文本内容
                        };
                    dataStore(pathName,'Tap',nodeInfo);
                });
            }
        },

        /*
         * @module 埋点插入
         * @params point 埋点对象
         * */
        buriedPoint: (function (point) {
            var pathName = window.location.pathname.split('/')[1].split('.')[0];
            if (pathName in point) {
                var i = 0;
                return function () {
                    var current = point[pathName][i];
                    dataStore(pathName,'EDO',current);
                    i = i + 1;
                    return current;
                }
            }
        })(bpo),

        /*
         * @module JS异常监听  TODO 待开发
         * */
        register:function(){
            window.onerror = function(msg,url,line,column){
                //上报数据
               console.log(msg);
            }
        },

        /*
        * @module 接口监听 TODO 待开发
        * @class XMLInterface XMLHttpRequest请求
        * @class JQInterface $.ajax请求
        * */
        XMLInterface: function(){
            console.log('......执行XMLHttpRequest接口监听......');

            window.addEventListener('ajaxReadyStateChange', function (e) {
                console.log(e.detail); // 监控flag异常
            });
            window.addEventListener('ajaxError', function (e) {
                console.log(e.detail); // 监控请求错误
            });
            window.addEventListener('ajaxTimeout', function (e) {
                console.log(e.detail); // 监控请求超时
            });
        },

        JQInterface: function(){
            var pathName = window.location.pathname.split('/')[1].split('.')[0],
                customFlag = ['1', '2'],//定义接口异常标识符
                threshold = 3,//设定阀值
                count = 0,//起始基数
                ajaxBack = $.ajax,
                DATA = {};
            $.ajax = function(setting){
                var suc = setting.success;//克隆success副本
                setting.success = function(){
                    if($.isFunction(suc)){
                        //接口返回参数
                        DATA.SS = {
                            data: arguments[0],
                            readyState: arguments[2].readyState,
                            status: arguments[2].status,
                            responseURL: arguments[2].responseURL
                        };
                        //接口H5入参
                        DATA.H5 = {
                            data: setting.data ? setting.data : {},
                            type: setting.type,
                            url: setting.url
                        };
                        DATA.timeNode = new Date();
                        dataStore(pathName,'INTERFACE',DATA);
                        //处理各种异常情况
                        switch (arguments[0].flag) {
                            case customFlag[0]:
                                //接口返回正常 但可能由于开关等引起短暂阻塞性问题（达到设定警戒条件立即触发上报数据，否则只执行记录数据）
                                if(count >= threshold){
                                    //TODO 触发数据上报 待开发
                                }else{
                                    count ++
                                }
                                break;
                            case customFlag[1]:
                                //触发数据上报
                                httpRequest();
                                break;
                        }
                        suc.apply(setting.success, arguments);
                    }
                };
                ajaxBack(setting);//重新发起请求
            };
        }
    };

    /*
     * @module 程序出口
     * */
    var col = {};
    for (var name in control) {
        if (control[name]) {
            (main[name])();
        } else {
            col[name] = main[name];
        }
    }
    return col;
});

/*
* 问题
* 1：当埋点种植关闭时，js执行报错（not function）
* */