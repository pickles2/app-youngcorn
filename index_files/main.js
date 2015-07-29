new (function($, window){
	window.main = this;
	var _this = this;
	window.focus();
	var _utils = require('./index_files/_utils.node.js');
	var _svrCtrl = require('./index_files/_svrCtrl.js');
	var _nw_gui = require('nw.gui');
	var php = require('phpjs');
	var path = require('path');
	var packageJson = require('./package.json');
	var $mainFrame;
	var serverProc;
	var __dirname = (function() {
		if (document.currentScript) {
			return document.currentScript.src;
		} else {
			var scripts = document.getElementsByTagName('script'),
			script = scripts[scripts.length-1];
			if (script.src) {
				return script.src;
			}
		}
	})().replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '');

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
			console.log('server standby!!!!');
			$mainFrame = $('<iframe>')
				.attr({'src':url})
			;
			$('body')
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
				'height':$(window).innerHeight()-4
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
		console.log(e.message);
		console.log('ERROR: Uncaught Exception');
	} );


	return this;
})(jQuery, window);
