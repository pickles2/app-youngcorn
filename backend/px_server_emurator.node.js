/**
 * Pickles2 server emurator
 */
module.exports = function(main){
	delete(require.cache[require('path').resolve(__filename)]);

	var http = require('http');
	var url = require('url');
	var path = require('path');
	var fs = require('fs');
	var php = require('phpjs');
	var _server;
	var _running = false;

	var projectInfo;
	var projectConfig;
	var px2proj;
	var serverInfo = {
		// 'protocol': 'http:',
		// 'host': '127.0.0.1:8080',
		// 'hostname': '127.0.0.1',
		// 'port': '8080',
		// 'origin': 'http://127.0.0.1:8080',

		'scheme': 'http',
		'domain': '127.0.0.1',
		'port': '8080' ,

		'php': 'php',
		'php_ini': null ,
		'php_extension_dir': null
	};
	var options = {};

	/**
	 * 初期化
	 */
	this.init = function(_projectInfo, _projectConfig, _px2proj, _serverInfo, _options, callback){
		callback = callback||function(){};
		projectInfo = _projectInfo;
		projectConfig = _projectConfig;
		px2proj = _px2proj;
		serverInfo = _serverInfo;
		options = _options || {};
		console.log(options);

		serverStart(function(){
			callback();
		});
		return this;
	}

	this.getScheme = function(){
		return serverInfo.scheme;
	}

	this.getDomain = function(){
		return serverInfo.domain;
	}

	this.getPort = function(){
		return serverInfo.port;
	}

	_server = http.createServer(function(request, response) {
		// アクセスされたURLを解析してパスを抽出
		var parsedUrl = url.parse(request.url, true);
		var params = parsedUrl.query;
		var requestPath = parsedUrl.pathname;

		// ディレクトリトラバーサル防止
		if (requestPath.indexOf("..") != -1) {
			requestPath = '/';
		}
		if(requestPath.length-1 == requestPath.lastIndexOf('/')) {
			// リクエストが「/」で終わっている場合、index.htmlをつける。
			requestPath += 'index.html';
		}

		var _cmdData = '';

		var pathExt = (function (requestPath) {
			var i = requestPath.lastIndexOf('.');
			return (i < 0) ? '' : requestPath.substr(i + 1);
		})(requestPath);
		var mime = 'application/octet-stream';
		var applyPx = false;
		switch( pathExt ){
			case 'html': case 'htm':		  mime = 'text/html'; applyPx = true; break;
			case 'js':						  mime = 'text/javascript'; applyPx = true; break;
			case 'css':						  mime = 'text/css'; applyPx = true; break;
			case 'gif':						  mime = 'image/gif';break;
			case 'jpg': case 'jpeg': case 'jpe': mime = 'image/jpeg';break;
			case 'png':						  mime = 'image/png';break;
			case 'svg':						  mime = 'image/svg+xml';break;
			case 'pdf':						  mime = 'application/pdf';break;
		}
		if( options.staticWeb ){
			applyPx = false;
		}

		if( applyPx && !requestPath.match( new RegExp( '^'+php.preg_quote( projectConfig.path_controot ) ) ) ){
			response.writeHead(500, 'Internal Server Error', {
				'Connection': 'close' ,
				'Content-Type': 'text/html'
			});
			response.write('<!DOCTYPE html>');
			response.write('<html>');
			response.write('<head>');
			response.write('<meta charset="UTF-8" />');
			response.write('<title>500 Internal Server Error.</title>');
			response.write('</head>');
			response.write('<body>');
			response.write('<h1>500 Internal Server Error.</h1>');
			response.write('<p>Pickles2 の管理外のパスにアクセスしました。</p>');
			response.write('</body>');
			response.write('</html>');
			response.end();
			return;
		}
		requestPath = requestPath.replace( new RegExp( '^'+php.preg_quote( projectConfig.path_controot ) ), '/' );

		if( applyPx ){
			px2proj.query(requestPath, {
				"output": "json",
				"userAgent": "Mozilla/5.0",
				"success": function(data){
					_cmdData += data;
				},
				"complete": function(data, code){
					// console.log(data, code);
					var dataDecoded, document_body, statusCode = 500;
					try{
						dataDecoded = JSON.parse(_cmdData);
						document_body = dataDecoded.body_base64;
						statusCode = dataDecoded.status;
						document_body = (new Buffer(document_body, 'base64')).toString();
					}catch(e){
						document_body = _cmdData;
						statusCode = 500;
						console.log('disabled to decode Base64 data.');
						console.log(document_body);
					}

					response.writeHead( statusCode, 'OK', {
						'Connection': 'close' ,
						'Content-Type': mime
					});
					response.write( document_body );
					if(mime=='text/html'){
						response.write(getBroccoliScript());
					}
					response.end();
				}
			});
			return ;
		}else{
			var pathDocumentRoot = path.dirname( projectInfo.path+'/'+projectInfo.entry_script );
			if( options.documentRoot ){
				pathDocumentRoot = options.documentRoot;
			}
			// console.log( pathDocumentRoot + requestPath );
			fs.readFile( pathDocumentRoot + requestPath, function(error, bin){
				if(error) {
					response.writeHead(404, 'Not Found', {
						'Connection': 'close' ,
						'Content-Type': 'text/html'
					});
					response.write('<!DOCTYPE html>');
					response.write('<html>');
					response.write('<head>');
					response.write('<meta charset="UTF-8" />');
					response.write('<title>404 Not found.</title>');
					response.write('</head>');
					response.write('<body>');
					response.write('<h1>404 Not found.</h1>');
					response.write('<p>File NOT found.</p>');
					response.write('</body>');
					response.write('</html>');
					response.end();
				} else {
					response.writeHead(200, 'OK', { 'Content-Type': mime });
					response.write(bin);
					if(mime=='text/html'){
						response.write(getBroccoliScript());
					}
					response.end();
				}
			});
			return ;
		}
		return ;
	});

	/**
	 * サーバーを起動
	 */
	function serverStart(cb){
		cb = cb||function(){};

		if( _running ){
			cb(true);
			return this;
		}

		// 指定ポートでLISTEN状態にする
		_server.listen(serverInfo.port, function(){
			_running = true;
			console.log( 'Pickles2 server emurator started;' );
			console.log( 'port: '+serverInfo.port );
			console.log( 'standby;' );
			cb(true);
		});
		return this;
	}// serverStart();

	/**
	 * broccoli-html-editor が要求するコードを取得
	 */
	function getBroccoliScript(){
		var fin = '';
			fin += '<script data-broccoli-receive-message="yes">'+"\n";
			fin += 'window.addEventListener(\'message\',(function() {'+"\n";
			fin += 'return function f(event) {'+"\n";
			// fin += 'if(event.origin!=\'http://127.0.0.1:8088\'){return;}'+"\n";
			fin += 'var s=document.createElement(\'script\');'+"\n";
			fin += 'document.querySelector(\'body\').appendChild(s);s.src=event.data.scriptUrl;'+"\n";
			fin += 'window.removeEventListener(\'message\', f, false);'+"\n";
			fin += '}'+"\n";
			fin += '})(),false);'+"\n";
			fin += '</script>'+"\n";
		return fin;
	}

	/**
	 * システムコマンドを実行する(spawn)
	 */
	function spawn(cmd, cliOpts, opts){
		opts = opts||{};
		if( opts.cd ){
			process.chdir( opts.cd );
		}
		// console.log( opts.cd );
		// console.log( process.cwd() );

		var proc = require('child_process').spawn(cmd, cliOpts);
		if( opts.success ){ proc.stdout.on('data', opts.success); }
		if( opts.error ){ proc.stderr.on('data', opts.error); }
		if( opts.complete ){ proc.on('close', opts.complete); }

		if( opts.cd ){
			process.chdir( _pathCurrentDir );
		}
		// console.log( process.cwd() );

		return proc;
	}

};
