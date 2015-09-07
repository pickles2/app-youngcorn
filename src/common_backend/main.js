/**
 * main.js
 */
module.exports = new (function(){
	var fs = this.fs = require('fs');
	var path = this.path = require('path');
	var it79 = this.it79 = require('iterate79');
	var packageJson = require(__dirname+'/../../package.json');
	var desktopUtils = this.desktopUtils = require('desktop-utils');
	var px2dtLDA = this.px2dtLDA = require('px2dt-localdata-access').create( desktopUtils.getLocalDataDir('.pickles2desktoptool') );

})();
