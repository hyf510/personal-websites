define(["jquery","C","js/control","js/common/view","underscore"],function(o,t,e,n,a){"use strict";var l=n.extend(a.extend({
el:"section",Ltemplate:o("#loanding").html(),Etemplate:o("#exit").html(),Dtemplate:o("#login").html(),initialize:function(){
var o=this;o.$el.html(t.Utils.data("base_info")?o.Etemplate:o.Ltemplate)},render:function(){},events:{"click #loand":"kipLoand",
"click #home,#store,#user,#assets":"doTip","click #exit":"doExit","click #has_home":"doHome","click #has_store":"doStore",
"click #has_user":"doUser","click #has_assets":"doAssets","click #vertify":"doLoand"},kipLoand:function(){var o=this;o.$el.html(o.Dtemplate);

},doTip:function(){console.log("请登录！")},doExit:function(){console.log("退出APP");var o=this;t.Utils.data("base_info",null),
o.$el.html(o.Ltemplate)},doHome:function(){console.log("跳转到我的主页"),t.Native.forward({url:t.Constant.SKIP_PAGE.INDEX,data:{
from:"myApp"}})},doStore:function(){console.log("跳转到我的商城")},doUser:function(){console.log("跳转到基本信息设置"),t.Native.forward({
url:t.Constant.SKIP_PAGE.MYINFO})},doAssets:function(){console.log("跳转到资产管理")},doLoand:function(){var n=this,a=o("#accound").val(),l=o("#use_pw").val();

o.ajax({url:t.APP("LOAND"),type:"GET",data:{accound:a,usePassword:l},success:function(o){console.log(o),"string"==typeof o?o=JSON.parse(o):"",
o.flag&&o.flag==t.Flag.SUCCESS&&(o.data.hasLogin==t.Flag.LOAND_SUCCESS?(n.$el.html(n.Etemplate),t.Utils.data("base_info",o.data.baseInfo)):e.tipText(o.msg));

}})}}));o(function(){new l})});