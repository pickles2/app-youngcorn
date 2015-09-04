/**
 * main.js
 */
new (function($, window){
	window.main = this;
	var _this = this;
	var __dirname = (function(){ var rtn = (function() { if (document.currentScript) {return document.currentScript.src;} else { var scripts = document.getElementsByTagName('script'), script = scripts[scripts.length-1]; if (script.src) {return script.src;} } })(); rtn = rtn.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, ''); return rtn; })();
	window.focus();
	var _svrCtrl = require('./framework/baobabFw/main.js').createSvrCtrl();
	var _nw_gui = require('nw.gui');
	var it79 = require('iterate79');
	var php = require('phpjs');
	var path = require('path');
	var packageJson = require('./package.json');
	var $mainFrame;
	var serverProc;

	$(window).load(function(){

		(function(){
			// node-webkit の標準的なメニューを出す
			var win = _nw_gui.Window.get();
			var nativeMenuBar = new _nw_gui.Menu({ type: "menubar" });
			try {
				nativeMenuBar.createMacBuiltin( 'YoungCorn' );
				win.menu = nativeMenuBar;
			} catch (ex) {
				console.log(ex.message);
			}

		})();

		_svrCtrl.boot( function(url){
			console.log('server standby!!');
			$mainFrame = $('<iframe>')
				.attr({'src':url})
			;
			$('body')
				.css({'overflow':'hidden'})
				.html($mainFrame)
			;
			windowResize();
		});

	});

	// Windowサイズ変更に伴うレイアウト調整
	function windowResize(){
		$mainFrame
			.css({
				'width':'100%',
				'height':$(window).innerHeight() - 0
			})
		;
	}

	$(window).resize(function(){
		windowResize();
	});


	// 終了処理
	process.on( 'exit', function(e){
		if(_svrCtrl.getPid()){
			console.log( 'kill Express Server: '+_svrCtrl.getPid() );
			_svrCtrl.halt();
		}
		console.log( 'Application exit;' );
	});
	process.on( 'uncaughtException', function(e){
		// alert('ERROR: Uncaught Exception');
		// console.log(e.message);
		console.log('ERROR: Uncaught Exception');
	} );


	return this;
})(jQuery, window);
