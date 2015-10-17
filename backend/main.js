/**
 * main.js
 */
module.exports = new (function(){
	var _this = this;
	var fs = this.fs = require('fs');
	var path = require('path');
	var Promise = require("es6-promise").Promise;
	var php = require('phpjs');
	var it79 = require('iterate79');

	var packageJson = require(__dirname+'/../package.json');
	var desktopUtils = this.desktopUtils = require('desktop-utils');
	var nodePhpBin = this.nodePhpBin = require('node-php-bin').get();
	var px2agent = this.px2agent = require('px2agent');
	var px2dtLDA = this.px2dtLDA = require('px2dt-localdata-access').create(
		desktopUtils.getLocalDataDir('.pickles2desktoptool'),
		{
			"path_php": nodePhpBin.getPath(),
			"path_php_ini": nodePhpBin.getIniPath(),
			"path_extension_dir": nodePhpBin.getExtensionDir()
		}
	);

	/**
	 * px2agent からプロジェクトオブジェクトを生成する
	 * @param Number pjInfo プロジェクト情報
	 * @param Function callback コールバック関数
	 * @return Object this
	 */
	this.getPx2Proj = function( pjInfo, callback ){
		callback = callback||function(){};

		var entryScriptName = path.resolve( pjInfo.path, pjInfo.entry_script );
		var options = {
			"bin": nodePhpBin.getPath(),
			"ini": nodePhpBin.getIniPath(),
			"extension_dir": nodePhpBin.getExtensionDir()
		};
		var rtn = px2agent.createProject( entryScriptName, options );

		setTimeout(function(){
			callback(rtn);
		}, 100);
		return this;
	}
})();
