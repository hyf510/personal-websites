define(["jquery","C","js/control","js/common/view","underscore"],function(e,t,n,l,p){"use strict";var i=l.extend(p.extend({
el:"body",Tpl_app:p.template(e("#self-module").html()),Tpl_index:p.template(e("#look-module").html()),initialize:function(){
var e=this,n=t.Utils.getQueryMap();e.$el.append(n&&"myApp"==n.from?e.Tpl_app:e.Tpl_index)},events:{}}));e(function(){new i;

})});