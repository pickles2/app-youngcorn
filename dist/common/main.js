!function t(n,i,e){function r(o,c){if(!i[o]){if(!n[o]){var a="function"==typeof require&&require;if(!c&&a)return a(o,!0);if(s)return s(o,!0);throw new Error("Cannot find module '"+o+"'")}var u=i[o]={exports:{}};n[o][0].call(u.exports,function(t){var i=n[o][1][t];return r(i?i:t)},u,u.exports,t,n,i,e)}return i[o].exports}for(var s="function"==typeof require&&require,o=0;o<e.length;o++)r(e[o]);return r}({1:[function(t,n,i){(function(i){!function(n){n.exports={},n.exports.createSvrCtrl=function(){return t(i+"/svrCtrl.js")},n.exports.createSocket=function(n,i,e){var r=window.location.href;return new function(n,i,e,r){_this=this,this.main=n,this.apis=r,this.temporaryApis={},this.temporaryApis=t("./temporaryApis.js"),_this.socket=i.connect(e),this.send=function(t,n,i){var e={api:t,data:n,callback:_this.temporaryApis.addNewFunction(i)};return this.socket.emit("command",e),this},_this.socket.on("command",function(t){t=t||{},t.api=t.api||"",t.data=t.data||{},t.callback=t.callback||null;var n=_this.temporaryApis.getCallbackFunction(t.api),i=t.callback;!n&&_this.apis[t.api]&&(n=_this.apis[t.api]),n&&n(t.data,function(t){_this.temporaryApis.callRemoteFunction(_this,i,t)},_this.main,_this)})}(n,i,r,e)},n.exports.conf=function(){return t(i+"/conf.js")}}(n)}).call(this,"/../../node_modules/baobab-fw/lib")},{"./temporaryApis.js":2}],2:[function(t,n,i){n.exports=new function(){var t={};this.addNewFunction=function(n){for(var i=0;;)if(i++,!t["fnc"+i])return t["fnc"+i]=n,"fnc"+i;return!1},this.getCallbackFunction=function(n){if(t[n]){var i=t[n];return t[n]=null,i}return!1},this.callRemoteFunction=function(t,n,i){t.send(n,i)}}},{}],3:[function(t,n,i){!function(t){t.ary=function(t,n,i){return new function(t,n,i){this.idx=-1,this.idxs=[];for(var e in t)this.idxs.push(e);this.ary=t||[],this.fnc=n||function(){},this.fncComplete=i||function(){},this.next=function(){return this.idx+1>=this.idxs.length?(this.fncComplete(),this):(this.idx++,this.fnc(this,this.ary[this.idxs[this.idx]],this.idxs[this.idx]),this)},this.next()}(t,n,i)},t.fnc=function(t){function n(t){t=t||[];var n=0,i=t,e=!1;this.start=function(t){return e?this:(e=!0,this.next(t))},this.next=function(t){return t=t||{},i.length<=n?this:(i[n++](this,t),this)}}var i="explicit",e=void 0;arguments.length>=2&&(i="implicit",e=arguments[0],t=arguments[arguments.length-1]);var r=new n(t);return"implicit"==i?r.start(e):r}}(i)},{}],4:[function(t,n,i){n.exports=function(t,n,i,e){console.log(t),alert(t.message),n(t)}},{}],5:[function(t,n,i){window.main=new function(n){function i(){}var e=(this.it79=t("iterate79"),function(){var t=function(){if(document.currentScript)return document.currentScript.src;var t=document.getElementsByTagName("script"),n=t[t.length-1];return n.src?n.src:void 0}();return t=t.replace(/\\/g,"/").replace(/\/[^\/]*\/?$/,"")}(),t("baobab-fw").createSocket(this,io,{showSocketTest:t("./apis/showSocketTest.js")}));this.init=function(t){return t=t||function(){},window.focus(),n(window).resize(i),setTimeout(function(){t()},0),this},this.socketTest=function(){return e.send("socketTest",{message:"socketTest from frontend."},function(t){alert("callback function is called!"),console.log(t)}),this}}(jQuery)},{"./apis/showSocketTest.js":4,"baobab-fw":1,iterate79:3}]},{},[5]);