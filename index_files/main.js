new (function($, window){
	window.main = this;
	var _this = this;
	window.focus();
	var _utils = require('./index_files/_utils.node.js');
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

		serverStart(packageJson.baobabConfig.defaultPort, function(url){
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

	/**
	 * server start
	 */
	function serverStart(port, cb, retry){
		if(!retry){retry=0;}
		console.log('sever port: '+(port+retry));
		cb = cb || function(){};

		var script_path = './index_files/server.js';
		if(!_utils.isFile(script_path)){
			console.log('ERROR: server script is NOT defined.');
			process.exit();
		}

		serverProc = require('child_process')
			.spawn(
				'./index_files/node/node'+(process.platform=='win32'?'.exe':''),
				[
					script_path,
					'port='+(port+retry)
				],
				{}
			)
		;
		serverProc.stdout.on('data', function(data){
			data = php.trim(data.toString());
			// console.log(data);
			var message = '';
			var dataRow = data.split(new RegExp('\r\n|\r|\n'));
			for(var idx in dataRow){
				data = php.trim(dataRow[idx]);
				if (data.match(new RegExp('^message\\:\s*(.*)$'))) {
					message = php.trim(RegExp.$1);
					console.log(message);
					switch(message){
						case 'server-standby':
							cb('http://127.0.0.1:'+(port+retry));
							break;
						default:
							// $('body').append('<div>unknown message.</div>');
							console.log('unknown message.');
							break;
					}
				}else{
					// $('body').append('<div>no message.</div>');
					console.log('no message.');
				}
			}
		});
		serverProc.stderr.on('data', function(err){
			// $('body').append('<div>--- server error</div>');
			// $('body').append('<pre>'+err.toString()+'</pre>');
		});
		serverProc.on('close', function(code){
			retry ++;
			if(retry>10){
				console.log('ERROR: exit;');
				process.exit();
				return;
			}
			if(serverProc.pid){
				serverProc.kill( 'SIGTERM' );
			}
			// $('body').append('<pre>retry.('+retry+')</pre>');
			setTimeout(function(){
				serverStart(port, cb, retry);
			}, 500);
		});
		return _this;
	}

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
		if(serverProc.pid){
			console.log( 'kill Express Server: '+serverProc.pid );
			serverProc.kill( 'SIGTERM' );
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
