/**
 * serverControl
 */
(function(exports){

	var php = require('phpjs');
	var _utils = require(__dirname+'/../index_files/_utils.node.js');
	var packageJson = require(__dirname+'/../package.json');
	var port = packageJson.baobabConfig.defaultPort;
	var svr;
	var _this = exports;
    var serverProc;

	/**
	 * server start
	 */
	exports.boot = function(cb, retry){
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
				__dirname+'/../index_files/node/node'+(process.platform=='win32'?'.exe':''),
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
				serverProc.kill('SIGTERM');
			}
			// $('body').append('<pre>retry.('+retry+')</pre>');
			setTimeout(function(){
				_this.boot(cb, retry);
			}, 500);
		});
		return _this;
	}

    /**
     * ポート番号を取得
     * @return {Number} ポート番号(package.jsonから取得した値)
     */
    exports.getPort = function(){
        return port;
    }

    /**
     * URLを取得
     * @return {String} サーバーにアクセスするURL
     */
    exports.getUrl = function(){
        return 'http://127.0.0.1:'+port+'/';
    }

    /**
     * サーバーのpidを取得
     * @return {Number} プロセス番号
     */
    exports.getPid = function(){
        return serverProc.pid;
    }

    /**
     * サーバーを落とす
     * @param  {Function} cb Callback function.
     * @return {Object}      this
     */
    exports.halt = function(cb){
        cb = cb || function(){};
        serverProc.kill('SIGTERM');
        setTimeout(function(){cb();}, 10);
        return _this;
    }

})(exports);
