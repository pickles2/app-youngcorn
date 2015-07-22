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

	function init(){
		window.focus();

		socket = io.connect('http://'+window.location.host);
		socket.on('command', function (cmd) {
			// console.log(cmd);
			cmd = cmd || {};
			cmd.api = cmd.api || '';
			if( window.main.apis[cmd.api] ){
				window.main.apis[cmd.api].run(cmd, socket, window.main);
			}
		});
	}

	function windowResized(){
	}

	$(window).load(function(){
		init();
	});

})(jQuery);
