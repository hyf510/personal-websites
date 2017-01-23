define(["jquery","C","js/control","js/common/view","underscore"],function(e,t,a,n,i){"use strict";var s=n.extend(i.extend({
el:"section",className:"container-fluid",baseTpl:i.template(e("#base_info").html()),initialize:function(){var e=this,a=t.Utils.data("base_info");

a&&e.$el.append(e.baseTpl(a))},render:function(){},events:{"click .badge":"doUpdate","click #submit-update":"doSubmit","click #btn-pw":"skipPw",
"change #change-images":"changeImg","click #updata-img":"updataImg"},doUpdate:function(t){var a=e(t.currentTarget),n=a.siblings("input");

a.hide(),n.show().focus().on("blur",function(){n.hide(),n.val()!=a.text()?(a.show().text(n.val()),e("#submit-update").show()):a.show();

})},doSubmit:function(){var n=[];e.each(e(".badge"),function(t,a){n[t]=e(a).text()}),e.ajax({url:t.APP("UPDATE_INFO"),type:"get",
data:{id:t.Utils.data("base_info").id,userName:n[0],gender:n[1],birthday:n[2],tel:n[3],qq:n[4],email:n[5]},success:function(n){
console.log(n),n.flag&&n.flag==t.Flag.SUCCESS?(a.sucText("您好，信息修改成功！"),e("#submit-update").hide()):a.tipText(n.msg)}})},skipPw:function(){
t.Native.forward({url:t.Constant.SKIP_PAGE.UPDATEPASSWORD})},changeImg:function(){var t=document.getElementById("change-images").files[0],a=new FileReader;

a.readAsDataURL(t),a.onload=function(t){e("#imgPre").attr("src",t.target.result),e("#change-images").hide(),e("#updata-img").text("上传图片").removeClass("btn-primary").addClass("btn-danger");

}},updataImg:function(){var n=e("#imgPre").attr("src");return n?void e.ajax({url:t.APP("UPDATE_IMG"),type:"post",data:{id:t.Utils.data("base_info").id,
portrait:n},header:{Origin:"http://localhost:8089"},success:function(n){n.flag&&n.flag==t.Flag.SUCCESS?(a.sucText("您好，图片上传成功！"),
e("#change-images").show(),e("#updata-img").text("更换头像").removeClass("btn-danger").addClass("btn-primary")):a.tipText(n.msg);

},error:function(e){console.log(e)}}):void a.tipText("图片上传出错！请重试")},getBase64:function(e){var t=document.createElement("canvas"),a=t.getContext("2d");

a.width=230,a.height=230;var n=new Image;return n.src=e,a.drawImage(n,0,0),t.toDataURL()}}));e(function(){new s})});