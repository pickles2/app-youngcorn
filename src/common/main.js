/**
 * main.js
 */
window.main = new (function($){
	var it79 = this.it79 = require('iterate79');
	var php = this.php = require('phpjs');
	var __dirname = (function(){ var rtn = (function() { if (document.currentScript) {return document.currentScript.src;} else { var scripts = document.getElementsByTagName('script'), script = scripts[scripts.length-1]; if (script.src) {return script.src;} } })(); rtn = rtn.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, ''); return rtn; })();
	var socket = this.socket = require('baobab-fw')
		.createSocket(
			this,
			io,
			{
				'showSocketTest': require('./apis/showSocketTest.js')
			}
		)
	;

	function windowResized(){
		// console.log('window resized');
	}

	/**
	 * initialize
	 * @param  {Function} callback Callback function.
	 * @return {Object}            return this;
	 */
	this.init = function(callback){
		callback = callback || function(){};

		it79.fnc(
			{},
			[
				function(it1, data){
					window.focus();
					it1.next();
				} ,
				function(it1, data){
					$(window).resize(windowResized);
					setTimeout(function(){
						callback();
					}, 0);
				}
			]
		);
		return this;
	}

	/**
	 * WebSocket疎通確認
	 */
	this.socketTest = function(){
		socket.send(
			'socketTest',
			{'message': 'socketTest from frontend.'} ,
			function(data){
				console.log(data);
				alert('callback function is called!');
			}
		);
		return this;
	}

})(jQuery);
