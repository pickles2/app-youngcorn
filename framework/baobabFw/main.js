/**
 * baobab framework
 * @param  {[type]} function( [description]
 * @return {[type]}		   [description]
 */
(function(module){
	module.exports = {};


	module.exports.createSvrCtrl = function(){
		return require(__dirname+'/svrCtrl.js');
	}


	/**
	 * create socket (frontend)
	 * @param  {[type]} main [description]
	 * @param  {[type]} io   [description]
	 * @param  {[type]} host [description]
	 * @param  {[type]} apis [description]
	 * @return {[type]}      [description]
	 */
	module.exports.createSocket = function(main, io, host, apis){
		return new (function(main, io, host, apis){
			_this = this;
			this.main = main;
			this.apis = apis;

			_this.socket = io.connect( host );
			_this.socket.on('command', function (cmd) {
				// console.log(cmd);
				cmd = cmd || {};
				cmd.api = cmd.api || '';
				if( _this.apis[cmd.api] ){
					_this.apis[cmd.api].run(cmd, _this.socket, _this.main);
				}
			});
		})(main, io, host, apis);
	}
})(module);
