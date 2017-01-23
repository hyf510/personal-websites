define(["jquery","C"],function(t,n){"use strict";var e=t("#home"),r=t("#store"),o=t("#my_app"),i=t("#nav"),a=t("#success"),c=t("#error");

e.on("click",function(){n.Native.forward({url:n.Constant.SKIP_PAGE.INDEX,data:{from:"index"}})}),r.on("click",function(){
n.Native.forward({url:n.Constant.SKIP_PAGE.STORE})}),o.on("click",function(){n.Native.forward({url:n.Constant.SKIP_PAGE.MYAPP
})}),i.on("click",function(){history.back()});var u={tipText:function(t){var n=this;c.show(),c.text(t),n.handler&&clearTimeout(n.handler),
n.handler=setTimeout(function(){c.hide()},2e3)},sucText:function(t){var n=this;a.show(),a.text(t),n.handler&&clearTimeout(n.handler),
n.handler=setTimeout(function(){a.hide()},2e3)}};return u});