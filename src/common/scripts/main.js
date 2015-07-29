/**
 * main.js
 */
window.main = new (function($){
	var socket;
	var __dirname = (function(){
		var rtn = (function() {
			if (document.currentScript) {
				return document.currentScript.src;
			} else {
				var scripts = document.getElementsByTagName('script'),
				script = scripts[scripts.length-1];
				if (script.src) {
					return script.src;
				}
			}
		})();
		rtn = rtn.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '');
		return rtn;
	})();
	this.apis = new (function(){})();

	function init(callback){
		callback = callback || function(){};
		window.focus();
		$(window).resize(windowResized);

		socket = io.connect('http://'+window.location.host);
		socket.on('command', function (cmd) {
			// console.log(cmd);
			cmd = cmd || {};
			cmd.api = cmd.api || '';
			if( window.main.apis[cmd.api] ){
				window.main.apis[cmd.api].run(cmd, socket, window.main);
			}
		});

		callback();
	}

	function windowResized(){
		console.log('window resized');
	}

	/**
	 * initialize
	 * @param  {Function} callback Callback function.
	 * @return {Object}            return this;
	 */
	this.init = function(callback){
		callback = callback || function(){};
		init(callback);
		return this;
	}

})(jQuery);
