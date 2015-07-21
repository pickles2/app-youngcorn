var fs = require('fs');
var path = require('path');
var express = require('express'),
	app = express();
var server = require('http').Server(app);
var main = require(__dirname+'/../dist/common/node/main.js');
var packageJson = require(__dirname+'/../package.json');

// オプションを整理
var options = (function(){
	var rtn = {};
	for( var idx = 0; process.argv.length > idx; idx ++ ){
		if(process.argv[idx].match(new RegExp('^(.*?)\=(.*)$'))){
			rtn[RegExp.$1] = RegExp.$2;
		}
	}
	return rtn;
})();

// console.log(process.argv);
var _port = options['port'];
if(!_port){_port = packageJson.baobabConfig.defaultPort;}
if(!_port){_port = 8080;}
console.log('port number is '+_port);

// middleware
app.use( express.static( __dirname+'/../dist/' ) );

// {$_port}番ポートでLISTEN状態にする
server.listen( _port, function(){
	console.log('message: server-standby');
} );

var io = require('socket.io')(server);
io.on('connection', function (socket) {
	// console.log('Socket Connected.');
	socket.on('command', function (cmd) {
		var rtn = {};
		cmd = cmd || {};
		cmd.api = cmd.api || '';
		var commandName = cmd.api.replace(new RegExp('[^a-zA-Z0-9\\_\\-]+','g'), '');

		if( fs.existsSync(__dirname+'/../dist/common/node/apis/'+cmd.api+'.js') ){
			console.log( cmd );
			var api = require(__dirname+'/../dist/common/node/apis/'+cmd.api+'.js');
			api.run(cmd, socket, main);
		}
		return;
	});
});



