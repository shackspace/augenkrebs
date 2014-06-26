!function(){"use strict";var t="undefined"!=typeof window?window:global;if("function"!=typeof t.require){var e={},r={},o=function(t,e){return{}.hasOwnProperty.call(t,e)},n=function(t,e){var r,o,n=[];r=/^\.\.?(\/|$)/.test(e)?[t,e].join("/").split("/"):e.split("/");for(var i=0,s=r.length;s>i;i++)o=r[i],".."===o?n.pop():"."!==o&&""!==o&&n.push(o);return n.join("/")},i=function(t){return t.split("/").slice(0,-1).join("/")},s=function(e){return function(r){var o=i(e),s=n(o,r);return t.require(s,e)}},a=function(t,e){var o={id:t,exports:{}};return r[t]=o,e(o.exports,s(t),o),o.exports},u=function(t,i){var s=n(t,".");if(null==i&&(i="/"),o(r,s))return r[s].exports;if(o(e,s))return a(s,e[s]);var u=n(s,"./index");if(o(r,u))return r[u].exports;if(o(e,u))return a(u,e[u]);throw new Error('Cannot find module "'+t+'" from "'+i+'"')},p=function(t,r){if("object"==typeof t)for(var n in t)o(t,n)&&(e[n]=t[n]);else e[t]=r},c=function(){var t=[];for(var r in e)o(e,r)&&t.push(r);return t};t.require=u,t.require.define=p,t.require.register=p,t.require.list=c,t.require.brunch=!0}}(),require.register("application",function(t,e,r){var o,n,i,s={}.hasOwnProperty,a=function(t,e){function r(){this.constructor=t}for(var o in e)s.call(e,o)&&(t[o]=e[o]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};n=e("mediator"),r.exports=o=function(t){function e(){return i=e.__super__.constructor.apply(this,arguments)}return a(e,t),e}(Chaplin.Application)}),require.register("controllers/authentication_controller",function(t,e,r){var o,n,i,s,a,u,p=function(t,e){return function(){return t.apply(e,arguments)}},c={}.hasOwnProperty,l=function(t,e){function r(){this.constructor=t}for(var o in e)c.call(e,o)&&(t[o]=e[o]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};a=e("mediator"),n=e("controllers/base/controller"),s=e("models/user"),i=e("views/base/modal"),r.exports=o=function(t){function e(){return this.logout=p(this.logout,this),this.getSession=p(this.getSession,this),u=e.__super__.constructor.apply(this,arguments)}return l(e,t),e.prototype.initialize=function(){return a.subscribe("!auth:logout",this.logout),this.publishEvent("!auth:success")},e.prototype.getSession=function(){var t=this;return this.publishEvent("!io:emit","login",null,function(e){return null!=e?(a.user=new s(e),t.publishEvent("!auth:success")):(a.user=new s,t.view=new LoginView({model:a.user}),a.user.on("change",function(){return t.view.dispose(),t.publishEvent("!io:emit","login",a.user.toJSON(),function(){return t.publishEvent("!auth:success")})}))}),this.subscribeEvent("!io:disconnect",function(){var t;return console.log("disconnected"),t=new ConnectionErrorDialog,t.container="#page-container",t.render()})},e.prototype.logout=function(){return this.publishEvent("!io:emit","logout",function(){return console.log("logged out"),window.location.reload(!0)})},e}(n)}),require.register("controllers/base/controller",function(t,e,r){var o,n,i,s={}.hasOwnProperty,a=function(t,e){function r(){this.constructor=t}for(var o in e)s.call(e,o)&&(t[o]=e[o]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};n=e("views/site_view"),r.exports=o=function(t){function e(){return i=e.__super__.constructor.apply(this,arguments)}return a(e,t),e.prototype.beforeAction=function(){return this.reuse("site",n)},e}(Chaplin.Controller)}),require.register("controllers/dashboard_controller",function(t,e,r){var o,n,i,s,a={}.hasOwnProperty,u=function(t,e){function r(){this.constructor=t}for(var o in e)a.call(e,o)&&(t[o]=e[o]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};o=e("controllers/base/controller"),i=e("views/icon_view"),r.exports=n=function(t){function e(){return s=e.__super__.constructor.apply(this,arguments)}return u(e,t),e.prototype.icon=function(){return this.view=new i({region:"main"})},e}(o)}),require.register("controllers/footer_controller",function(t,e,r){var o,n,i,s,a,u={}.hasOwnProperty,p=function(t,e){function r(){this.constructor=t}for(var o in e)u.call(e,o)&&(t[o]=e[o]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};o=e("controllers/base/controller"),s=e("mediator"),i=e("views/footer_view"),r.exports=n=function(t){function e(){return a=e.__super__.constructor.apply(this,arguments)}return p(e,t),e.prototype.initialize=function(){return e.__super__.initialize.apply(this,arguments),this.view=new i},e}(o)}),require.register("controllers/home_controller",function(t,e,r){var o,n,i,s,a,u,p,c,l={}.hasOwnProperty,h=function(t,e){function r(){this.constructor=t}for(var o in e)l.call(e,o)&&(t[o]=e[o]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};n=e("controllers/base/controller"),u=e("views/home_page_view"),o=e("views/about_view"),i=e("models/header"),s=e("views/header_view"),p=e("models/status"),r.exports=a=function(t){function e(){return c=e.__super__.constructor.apply(this,arguments)}return h(e,t),e.prototype.beforeAction=function(){var t;return e.__super__.beforeAction.apply(this,arguments),t=new i,this.reuse("header",s,{region:"header",model:t})},e.prototype.index=function(){var t;return t=new p,setInterval(function(){return console.log(t),t.fetch({contentType:"json",error:function(){return console.log("nope")}})},1e3),this.view=new u({model:t,region:"main"}),this.listenTo(this.view,"open",function(t){return console.log("open",t),$.ajax({url:"/api/open",type:"POST",data:JSON.stringify({url:t}),contentType:"application/json",dataType:"json"})}),this.listenTo(this.view,"play",function(){return console.log("play"),$.ajax({type:"GET",url:"/api/play"})}),this.listenTo(this.view,"pause",function(){return console.log("pause"),$.ajax({type:"GET",url:"/api/pause"})}),this.listenTo(this.view,"stop",function(){return console.log("stop"),$.ajax({type:"GET",url:"/api/stop"})}),this.listenTo(this.view,"next",function(){return console.log("next")}),this.listenTo(this.view,"previous",function(){return console.log("previous")}),this.listenTo(this.view,"forward",function(){return console.log("forward")}),this.listenTo(this.view,"fast-forward",function(){return console.log("fast-forward")}),this.listenTo(this.view,"backward",function(){return console.log("backward")}),this.listenTo(this.view,"fast-backward",function(){return console.log("fast-backward")}),this.listenTo(this.view,"mute",function(){return console.log("mute"),t.save({muted:+!t.get("muted")})}),this.listenTo(this.view,"seek",function(e){return t.save({position:e})}),this.listenTo(this.view,"volume",function(e){return t.save({volume:e})}),this.listenTo(this.view,"subtitles",function(e){return console.log("subtitles",e),t.save({subtitle:e})}),this.listenTo(this.view,"subtitle-delay",function(e){return console.log("subtitle-delay",e),t.save({subtitle_delay:e})}),this.listenTo(this.view,"audiotrack-list",function(e){return console.log("audiotrack",e),t.save({audiotrack:e})}),this.listenTo(this.view,"audio-delay",function(e){return console.log("audio-delay",e),t.save({audio_delay:e})})},e.prototype.about=function(){return this.view=new o({region:"main"})},e}(n)}),require.register("index.static",function(t,e,r){var o=function(){var t=[];return t.push('<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui"><title>augenkrebs</title><link rel="stylesheet" href="/css/app.css"><script defer src="/js/vendor.js"></script><script defer src="/js/app.js" onload="require(&quot;initialize&quot;)"></script></head><body><div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div></body></html>'),t.join("")};"function"==typeof define&&define.amd?define([],function(){return o}):"object"==typeof r&&r&&r.exports&&(r.exports=o)}),require.register("initialize",function(t,e){var r,o;r=e("application"),o=e("routes"),$(function(){return new r({title:"augenkrebs",controllerSuffix:"_controller",routes:o})})}),require.register("lib/services/service_provider",function(t,e,r){var o,n,i;i=e("lib/utils"),o=e("chaplin"),r.exports=n=function(){function t(){_(this).extend($.Deferred()),i.deferMethods({deferred:this,methods:["triggerLogin","getLoginStatus"],onDeferral:this.load})}return _(t.prototype).extend(o.Subscriber),t.prototype.loading=!1,t.prototype.disposed=!1,t.prototype.dispose=function(){return this.disposed?void 0:(this.unsubscribeAllEvents(),this.disposed=!0,"function"==typeof Object.freeze?Object.freeze(this):void 0)},t}()}),require.register("lib/support",function(t,e,r){var o,n,i;o=e("chaplin"),i=e("lib/utils"),n=i.beget(o.support),r.exports=n}),require.register("lib/utils",function(t,e,r){var o,n,i,s={}.hasOwnProperty;o=e("chaplin"),n=e("mediator"),i=o.utils.beget(o.utils),_(i).extend({deferMethods:function(t){var e,r,o,n,a,u,p,c,l,h,f;if(e=t.deferred,n=t.methods,o=t.host||e,c=t.target||o,p=t.onDeferral,a={},"string"==typeof n)a[n]=o[n];else if(n.length&&n[0])for(l=0,h=n.length;h>l;l++){if(u=n[l],r=o[u],"function"!=typeof r)throw new TypeError("utils.deferMethods: method "+u+" notfound on host "+o);a[u]=r}else a=n;f=[];for(u in a)s.call(a,u)&&(r=a[u],"function"==typeof r&&f.push(c[u]=i.createDeferredFunction(e,r,c,p)));return f},createDeferredFunction:function(t,e,r,o){return null==r&&(r=t),function(){var n;return n=arguments,"resolved"===t.state()?e.apply(r,n):(t.done(function(){return e.apply(r,n)}),"function"==typeof o?o.apply(r):void 0)}}}),r.exports=i}),require.register("mediator",function(t,e,r){var o;o=r.exports=Chaplin.mediator}),require.register("models/base/collection",function(t,e,r){var o,n,i={}.hasOwnProperty,s=function(t,e){function r(){this.constructor=t}for(var o in e)i.call(e,o)&&(t[o]=e[o]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};r.exports=o=function(t){function e(){return n=e.__super__.constructor.apply(this,arguments)}return s(e,t),e}(Chaplin.Collection)}),require.register("models/base/model",function(t,e,r){var o,n,i={}.hasOwnProperty,s=function(t,e){function r(){this.constructor=t}for(var o in e)i.call(e,o)&&(t[o]=e[o]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};r.exports=o=function(t){function e(){return n=e.__super__.constructor.apply(this,arguments)}return s(e,t),e}(Chaplin.Model)}),require.register("models/header",function(t,e,r){var o,n,i,s={}.hasOwnProperty,a=function(t,e){function r(){this.constructor=t}for(var o in e)s.call(e,o)&&(t[o]=e[o]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};n=e("models/base/model"),r.exports=o=function(t){function e(){return i=e.__super__.constructor.apply(this,arguments)}return a(e,t),e.prototype.defaults={items:[{href:"/admin",title:"Admin"}]},e}(n)}),require.register("models/status",function(t,e,r){var o,n,i,s,a=function(t,e){return function(){return t.apply(e,arguments)}},u={}.hasOwnProperty,p=function(t,e){function r(){this.constructor=t}for(var o in e)u.call(e,o)&&(t[o]=e[o]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};o=e("models/base/model"),i={read:"GET",update:"POST",create:"POST",patch:"POST"},r.exports=n=function(t){function e(){return this.fetch=a(this.fetch,this),this.save=a(this.save,this),s=e.__super__.constructor.apply(this,arguments)}return p(e,t),e.prototype.url="/api/status",e.prototype.sync=function(t,e,r){var o,n,s;return n=i[t],null==n?null:(o={type:n,dataType:"json",url:this.url},"POST"===n&&(o.contentType="application/json",o.data=JSON.stringify(r.attrs||e.toJSON(r))),s=r.xhr=Backbone.ajax(_.extend(o,r)))},e.prototype.save=function(t){var r=this;return this.writeLock=!0,e.__super__.save.call(this,t,{patch:!0,complete:function(){return r.writeLock=!1}})},e.prototype.fetch=function(t){return this.writeLock?void 0:e.__super__.fetch.call(this,t)},e.prototype.isNew=function(){return!1},e}(o)}),require.register("models/user",function(t,e,r){var o,n,i,s={}.hasOwnProperty,a=function(t,e){function r(){this.constructor=t}for(var o in e)s.call(e,o)&&(t[o]=e[o]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};o=e("models/base/model"),r.exports=n=function(t){function e(){return i=e.__super__.constructor.apply(this,arguments)}return a(e,t),e}(o)}),require.register("routes",function(t,e,r){r.exports=function(t){return t("","home#index"),t("about","home#about"),t("icon","dashboard#icon")}}),require.register("views/about_view",function(t,e,r){var o,n,i,s={}.hasOwnProperty,a=function(t,e){function r(){this.constructor=t}for(var o in e)s.call(e,o)&&(t[o]=e[o]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};n=e("views/base/view"),r.exports=o=function(t){function r(){return i=r.__super__.constructor.apply(this,arguments)}return a(r,t),r.prototype.autoRender=!0,r.prototype.template=e("views/templates/about"),r.prototype.className="about-page container",r}(n)}),require.register("views/base/collection_view",function(t,e,r){var o,n,i,s={}.hasOwnProperty,a=function(t,e){function r(){this.constructor=t}for(var o in e)s.call(e,o)&&(t[o]=e[o]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};n=e("views/base/view"),r.exports=o=function(t){function e(){return i=e.__super__.constructor.apply(this,arguments)}return a(e,t),e.prototype.getTemplateFunction=n.prototype.getTemplateFunction,e}(Chaplin.CollectionView)}),require.register("views/base/modal",function(t,e,r){var o,n,i,s=function(t,e){return function(){return t.apply(e,arguments)}},a={}.hasOwnProperty,u=function(t,e){function r(){this.constructor=t}for(var o in e)a.call(e,o)&&(t[o]=e[o]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};n=e("views/base/view"),r.exports=o=function(t){function e(){return this.render=s(this.render,this),this.hide=s(this.hide,this),this.keydown=s(this.keydown,this),i=e.__super__.constructor.apply(this,arguments)}return u(e,t),e.prototype.className="modal fade",e.prototype.events={"click .save":"save","click .close,.btn-close":"hide",hidden:"hidden",keydown:"keydown"},e.prototype.keydown=function(t){return 13===t.keyCode?(t.preventDefault(),this.save(t),!1):void 0},e.prototype.hide=function(t){return null!=t&&t.preventDefault(),this.$el.modal("hide")},e.prototype.render=function(){return e.__super__.render.apply(this,arguments),this.$el.modal({keyboard:!0,backdrop:!0}),this.delegateEvents(),this.$el.modal({show:!0}),this},e.prototype.hidden=function(){return this.remove(),!1},e}(n)}),require.register("views/base/page_view",function(t,e,r){var o,n,i,s,a={}.hasOwnProperty,u=function(t,e){function r(){this.constructor=t}for(var o in e)a.call(e,o)&&(t[o]=e[o]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};i=e("mediator"),n=e("views/base/view"),r.exports=o=function(t){function e(){return s=e.__super__.constructor.apply(this,arguments)}return u(e,t),e.prototype.container="#page-container",e.prototype.autoRender=!0,e}(n)}),require.register("views/base/view",function(t,e,r){var o,n,i={}.hasOwnProperty,s=function(t,e){function r(){this.constructor=t}for(var o in e)i.call(e,o)&&(t[o]=e[o]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};r.exports=o=function(t){function e(){return n=e.__super__.constructor.apply(this,arguments)}return s(e,t),e.prototype.getTemplateFunction=function(){return this.template},e.prototype.getTemplateData=function(){var t;return t=e.__super__.getTemplateData.call(this),t.moment=moment,t},e}(Chaplin.View)}),require.register("views/footer_view",function(t,e,r){var o,n,i,s,a,u={}.hasOwnProperty,p=function(t,e){function r(){this.constructor=t}for(var o in e)u.call(e,o)&&(t[o]=e[o]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};i=e("mediator"),n=e("views/base/view"),s=e("views/templates/footer"),r.exports=o=function(t){function e(){return a=e.__super__.constructor.apply(this,arguments)}return p(e,t),e.prototype.template=s,e.prototype.container="#footer-container",e.prototype.className="footer",e.prototype.autoRender=!0,e.prototype.initialize=function(){return e.__super__.initialize.apply(this,arguments),this.subscribeEvent("loginStatus",this.render),this.subscribeEvent("startupController",this.render)},e}(n)}),require.register("views/header_view",function(t,e,r){var o,n,i,s,a=function(t,e){return function(){return t.apply(e,arguments)}},u={}.hasOwnProperty,p=function(t,e){function r(){this.constructor=t}for(var o in e)u.call(e,o)&&(t[o]=e[o]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};i=e("mediator"),n=e("views/base/view"),r.exports=o=function(t){function r(){return this.getTemplateData=a(this.getTemplateData,this),s=r.__super__.constructor.apply(this,arguments)}return p(r,t),r.prototype.template=e("views/templates/header"),r.prototype.id="header",r.prototype.tagName="nav",r.prototype.className="navbar navbar-default navbar-fixed-top",r.prototype.autoRender=!0,r.prototype.initialize=function(){return r.__super__.initialize.apply(this,arguments),this.subscribeEvent("loginStatus",this.render),this.subscribeEvent("startupController",this.render)},r.prototype.getTemplateData=function(){var t;return t=r.__super__.getTemplateData.apply(this,arguments),t.user={username:"DER USER"},t},r}(n)}),require.register("views/home_page_view",function(t,e,r){var o,n,i,s=function(t,e){return function(){return t.apply(e,arguments)}},a={}.hasOwnProperty,u=function(t,e){function r(){this.constructor=t}for(var o in e)a.call(e,o)&&(t[o]=e[o]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};n=e("views/base/view"),r.exports=o=function(t){function r(){return this.changeAudioDelay=s(this.changeAudioDelay,this),this.changeAudiotrack=s(this.changeAudiotrack,this),this.changeAudiotrackList=s(this.changeAudiotrackList,this),this.changeSubtitleDelay=s(this.changeSubtitleDelay,this),this.changeSubtitle=s(this.changeSubtitle,this),this.changeSubtitleList=s(this.changeSubtitleList,this),this.changeMuted=s(this.changeMuted,this),this.changeVolume=s(this.changeVolume,this),this.changePosition=s(this.changePosition,this),this.changeLength=s(this.changeLength,this),this.changeIsPlaying=s(this.changeIsPlaying,this),this.render=s(this.render,this),this.audioDelay=s(this.audioDelay,this),this.audiotrackList=s(this.audiotrackList,this),this.subtitleDelay=s(this.subtitleDelay,this),this.subtitles=s(this.subtitles,this),this.mute=s(this.mute,this),this.fastBackward=s(this.fastBackward,this),this.backward=s(this.backward,this),this.fastForward=s(this.fastForward,this),this.forward=s(this.forward,this),this.previous=s(this.previous,this),this.next=s(this.next,this),this.stop=s(this.stop,this),this.pause=s(this.pause,this),this.play=s(this.play,this),this.open=s(this.open,this),i=r.__super__.constructor.apply(this,arguments)}return u(r,t),r.prototype.autoRender=!0,r.prototype.template=e("views/templates/home"),r.prototype.className="home-page container",r.prototype.events={"submit form":"open","click #play":"play","click #pause":"pause","click #stop":"stop","click #next":"next","click #previous":"previous","click #forward":"forward","click #fast-forward":"fastForward","click #backward":"backward","click #fast-backward":"fastBackward","click #muted":"mute","change #subtitles":"subtitles","change #audiotrack-list":"audiotrackList","change #subtitle-delay":"subtitleDelay","change #audio-delay":"audioDelay"},r.prototype.open=function(t){return t.preventDefault(),this.trigger("open",this.$("#url").val())},r.prototype.play=function(t){return t.preventDefault(),this.trigger("play")},r.prototype.pause=function(t){return t.preventDefault(),this.trigger("pause")},r.prototype.stop=function(t){return t.preventDefault(),this.trigger("stop")},r.prototype.next=function(t){return t.preventDefault(),this.trigger("next")},r.prototype.previous=function(t){return t.preventDefault(),this.trigger("previous")},r.prototype.forward=function(t){return t.preventDefault(),this.trigger("forward")},r.prototype.fastForward=function(t){return t.preventDefault(),this.trigger("fast-forward")},r.prototype.backward=function(t){return t.preventDefault(),this.trigger("backward")},r.prototype.fastBackward=function(t){return t.preventDefault(),this.trigger("fast-backward")},r.prototype.mute=function(t){return t.preventDefault(),this.trigger("mute")},r.prototype.subtitles=function(){return this.trigger("subtitles",$("#subtitles option:selected").val())},r.prototype.subtitleDelay=function(){var t;return t=parseFloat(this.$("#subtitle-delay").val()),isNaN(t)?void 0:this.trigger("subtitle-delay",t)},r.prototype.audiotrackList=function(){return this.trigger("audiotrack-list",$("#audiotrack-list option:selected").val())},r.prototype.audioDelay=function(){var t;return t=parseFloat(this.$("#audio-delay").val()),isNaN(t)?void 0:this.trigger("audio-delay",t)},r.prototype.render=function(){var t,e,o,n,i=this;return r.__super__.render.apply(this,arguments),t=this.$("#position").slider({min:0,max:3600,step:1,handle:"custom",enabled:!1}),e=function(t){return i.trigger("seek",t.value)},t.on("slideStop",e),t.on("slide",e),n=this.$("#volume").slider({min:0,max:150,step:1}),o=function(t){return i.trigger("volume",t.value)},n.on("slideStop",o),n.on("slide",o)},r.prototype.listen={"change:is_playing model":"changeIsPlaying","change:length model":"changeLength","change:position model":"changePosition","change:volume model":"changeVolume","change:muted model":"changeMuted","change:subtitle_list model":"changeSubtitleList","change:subtitle model":"changeSubtitle","change:subtitle_delay model":"changeSubtitleDelay","change:audiotrack_list model":"changeAudiotrackList","change:audiotrack model":"changeAudiotrack","change:audio_delay model":"changeAudioDelay"},r.prototype.changeIsPlaying=function(){},r.prototype.changeLength=function(t,e){var r;return r=this.$("#position"),-1===e?r.slider("disable"):(r.slider("isEnabled")||r.slider("enable"),r.slider("setAttribute","max",e))},r.prototype.changePosition=function(t,e){var r;if(-1!==e)return r=this.$("#position"),r.slider("setValue",e)},r.prototype.changeVolume=function(t,e){var r;return r=this.$("#volume"),r.slider("setValue",e)},r.prototype.changeMuted=function(t,e){return e?($("#muted span").removeClass("glyphicon-volume-up"),$("#muted span").addClass("glyphicon-volume-off")):($("#muted span").removeClass("glyphicon-volume-off"),$("#muted span").addClass("glyphicon-volume-up"))},r.prototype.changeSubtitleList=function(t,e){var r,o,n,i,s;for(o=$("#subtitles"),o.empty(),s=[],n=0,i=e.length;i>n;n++)r=e[n],s.push(o.append($("<option>",{value:r,text:r})));return s},r.prototype.changeSubtitle=function(t,e){return $("#subtitles option:selected").prop("selected",!1),$('#subtitles option[value="'+e+'"]').prop("selected",!0)},r.prototype.changeSubtitleDelay=function(t,e){return $("#subtitle-delay").val(e)},r.prototype.changeAudiotrackList=function(t,e){var r,o,n,i,s;for(r=$("#audiotrack-list"),r.empty(),s=[],n=0,i=e.length;i>n;n++)o=e[n],s.push(r.append($("<option>",{value:o,text:o})));return s},r.prototype.changeAudiotrack=function(t,e){return $("#audiotrack-list option:selected").prop("selected",!1),$('#audiotrack-list option[value="'+e+'"]').prop("selected",!0)},r.prototype.changeAudioDelay=function(t,e){return $("#audio-delay").val(e)},r}(n)}),require.register("views/icon_view",function(t,e,r){var o,n,i,s={}.hasOwnProperty,a=function(t,e){function r(){this.constructor=t}for(var o in e)s.call(e,o)&&(t[o]=e[o]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};n=e("views/base/view"),r.exports=o=function(t){function r(){return i=r.__super__.constructor.apply(this,arguments)}return a(r,t),r.prototype.autoRender=!0,r.prototype.template=e("views/templates/icon"),r.prototype.className="icon-page container",r}(n)}),require.register("views/layout",function(t,e,r){var o,n,i,s={}.hasOwnProperty,a=function(t,e){function r(){this.constructor=t}for(var o in e)s.call(e,o)&&(t[o]=e[o]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};o=e("chaplin"),r.exports=n=function(t){function e(){return i=e.__super__.constructor.apply(this,arguments)}return a(e,t),e.prototype.initialize=function(){return e.__super__.initialize.apply(this,arguments)},e}(o.Layout)}),require.register("views/site_view",function(t,e,r){var o,n,i,s={}.hasOwnProperty,a=function(t,e){function r(){this.constructor=t}for(var o in e)s.call(e,o)&&(t[o]=e[o]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t};n=e("views/base/view"),r.exports=o=function(t){function r(){return i=r.__super__.constructor.apply(this,arguments)}return a(r,t),r.prototype.container="body",r.prototype.id="site-container",r.prototype.regions={header:"#header-container",main:"#page-container"},r.prototype.template=e("./templates/site"),r}(n)}),require.register("views/templates/about",function(t,e,r){var o=function(){var t=[];return t.push('<div class="row"><div style="text-align: center;" class="page-header"><img src="/img/logo.svg" class="big-logo"/><h1>augenkrebs</h1><h2>Internetabspielgerät</h2><h3>a <a href="http://shackspace.de">shackspace</a> project</h3><h4>inspired by <a href="http://wiki.bytewerk.org/index.php/Byteplayer">Byteplayer</a></h4><h5>incubated by <a href="http://shackspace.de">shackspace</a></h5></div></div>'),t.join("")};"function"==typeof define&&define.amd?define([],function(){return o}):"object"==typeof r&&r&&r.exports&&(r.exports=o)}),require.register("views/templates/footer",function(t,e,r){var o=function(){var t=[];return t.push("<hr/><footer><p>&copy; COPY</p></footer>"),t.join("")};"function"==typeof define&&define.amd?define([],function(){return o}):"object"==typeof r&&r&&r.exports&&(r.exports=o)}),require.register("views/templates/header",function(t,e,r){var o=function(){var t=[];return t.push('<div class="container"><div class="navbar-header"><a href="/" class="navbar-brand"><img src="/img/logo-filled.svg"/>augenkrebs</a></div><div class="collapse navbar-collapse"><div class="btn-group navbar-right"><button id="shutdown" href="#" class="btn btn-primary navbar-btn">shutdown \n&nbsp;<span class="glyphicon glyphicon-off"></span></button></div><ul style="margin-right: 50px" class="nav navbar-nav navbar-right"><li><a href="/about">aboot</a></li></ul></div></div>'),t.join("")};"function"==typeof define&&define.amd?define([],function(){return o}):"object"==typeof r&&r&&r.exports&&(r.exports=o)}),require.register("views/templates/home",function(t,e,r){var o=function(){var t=[];return t.push('<div class="container"><form class="form-inline"><div class="form-group col-md-12"><div class="input-group"><input id="url" type="text" placeholder="url" class="form-control"/><div class="input-group-btn"><button type="submit" class="btn btn-primary">Open</button></div></div></div><div style="padding: 5em 0 2em" class="text-center"><div class="form-group"><div class="btn-group btn-group-lg"><button id="backward" type="button" class="btn btn-default"><span class="glyphicon glyphicon-backward"></span></button><button id="play" type="button" style="color: green" class="btn btn-default"><span class="glyphicon glyphicon-play"></span></button><button id="pause" type="button" style="color: blue" class="btn btn-default"><span class="glyphicon glyphicon-pause"></span></button><button id="stop" type="button" style="color: red" class="btn btn-default"><span class="glyphicon glyphicon-stop"></span></button><button id="forward" type="button" class="btn btn-default"><span class="glyphicon glyphicon-forward"></span></button></div></div><div style="padding: 0 1em" class="form-group"><input id="volume" type="text"/></div><div class="form-group"><button id="muted" type="button" class="btn btn-default btn-lg"><span class="glyphicon glyphicon-volume-off"></span></button></div></div></form><form class="form-horizontal"><div class="row"><div class="form-group"><label class="control-label col-md-2">Audio</label><div class="col-md-4"><select id="audiotrack-list" class="form-control"></select></div><label class="control-label col-md-1">Delay</label><div class="col-md-1"><input id="audio-delay" type="text" class="form-control"/></div></div></div><div class="row"><div class="form-group"><label class="control-label col-md-2">Subtitles</label><div class="col-md-4"><select id="subtitles" class="form-control"></select></div><label class="control-label col-md-1">Delay</label><div class="col-md-1"><input id="subtitle-delay" type="text" class="form-control"/></div></div></div></form><form class="form-inline"><div class="form-group col-md-10 col-md-offset-1 position"><input id="position" type="text"/></div></form></div>'),t.join("")};"function"==typeof define&&define.amd?define([],function(){return o}):"object"==typeof r&&r&&r.exports&&(r.exports=o)}),require.register("views/templates/icon",function(t,e,r){var o=function(){var t=[];return t.push('<div class="center"><img src="/img/logo.svg" class="huge-logo"/></div>'),t.join("")};"function"==typeof define&&define.amd?define([],function(){return o}):"object"==typeof r&&r&&r.exports&&(r.exports=o)}),require.register("views/templates/mixins/form_helpers",function(t,e,r){var o=function(){var t=[];return t.join("")};"function"==typeof define&&define.amd?define([],function(){return o}):"object"==typeof r&&r&&r.exports&&(r.exports=o)}),require.register("views/templates/modal",function(t,e,r){var o=function(){var t=[];return t.push('<div class="modal-header"><button class="close">×</button><h3>Foo</h3></div><form class="form-horizontal modal-body"></form><div class="modal-footer"><button class="btn btn-close">Abbrechen</button><button class="btn btn-primary save">Speichern</button></div>'),t.join("")};"function"==typeof define&&define.amd?define([],function(){return o}):"object"==typeof r&&r&&r.exports&&(r.exports=o)}),require.register("views/templates/site",function(t,e,r){var o=function(){var t=[];return t.push('<div id="header-container" class="header-container"></div><div class="outer-page-container"><div id="page-container" class="page-container"></div></div>'),t.join("")};"function"==typeof define&&define.amd?define([],function(){return o}):"object"==typeof r&&r&&r.exports&&(r.exports=o)});