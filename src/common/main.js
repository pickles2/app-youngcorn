/**
 * main.js
 */
window.main = new (function($){
	var _this = this;
	var main = this;
	var it79 = this.it79 = require('iterate79');
	var php = this.php = require('phpjs');
	var __dirname = (function(){ var rtn = (function() { if (document.currentScript) {return document.currentScript.src;} else { var scripts = document.getElementsByTagName('script'), script = scripts[scripts.length-1]; if (script.src) {return script.src;} } })(); rtn = rtn.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, ''); return rtn; })();
	var socket = this.socket = window.baobabFw
		.createSocket(
			this,
			io,
			{
				'showSocketTest': require('./apis/showSocketTest.js'),
				'twig': require('./apis/twig.js')
			}
		)
	;
	var Keypress = this.Keypress = {};

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
					// 特定のキー操作を無効化
					_Keypress = new window.keypress.Listener();
					_this.Keypress = _Keypress;

					_Keypress.simple_combo("backspace", function(e) {
						// alert("You pressed backspace");
						e.preventDefault();
						e.stopPropagation();
						return false;
					});
					_Keypress.simple_combo("delete", function(e) {
						// alert("You pressed delete");
						e.preventDefault();
						e.stopPropagation();
						return false;
					});
					_Keypress.simple_combo("cmd left", function(e) {
						// alert("You pressed Cmd+Left");
						e.preventDefault();
						e.stopPropagation();
						return false;
					});
					_Keypress.simple_combo("cmd right", function(e) {
						// alert("You pressed Cmd+Right");
						e.preventDefault();
						e.stopPropagation();
						return false;
					});
					_Keypress.simple_combo("escape", function(e) {
						// alert("You pressed escape");
						e.preventDefault();
						return false;
					});

					it1.next();
				} ,
				function(it1, data){
					// ドラッグ＆ドロップ操作の無効化
					$('html, body')
						.bind( 'drop', function(e){
							// ドロップ操作を無効化
							// console.log(456);
							e.preventDefault();
							e.stopPropagation();
							return false;
						} )
						.bind( 'dragenter', function(e){
							// ドロップ操作を無効化
							// console.log(45645);
							e.preventDefault();
							e.stopPropagation();
							return false;
						} )
						.bind( 'dragover', function(e){
							// ドロップ操作を無効化
							// console.log(23456);
							e.preventDefault();
							e.stopPropagation();
							return false;
						} )
					;

					it1.next();
				} ,
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
