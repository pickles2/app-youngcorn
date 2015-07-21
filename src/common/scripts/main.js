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

		$('#mainform').submit(function(){
			window.main.showFontList();
		});
	}

	function windowResized(){
	}

	/**
	 * フォントリストを表示する
	 */
	this.showFontList = function(){
		$('.contents').html('<ul class="font-list">');
		socket.emit('command', {'api':'getSystemFontList'});
	};

	/**
	 * フォントにスターをつける
	 */
	this.checkStar = function(fontPostscriptName){
		$('li[data-postscriptname='+fontPostscriptName+'] .font-list__btn-star').removeClass('star__active').addClass('star__active');
		socket.emit('command', {'api':'updateFontInfo','postscriptName':fontPostscriptName, 'key':'star', 'val':true});
		return this;
	};

	/**
	 * フォントのスターを削除
	 */
	this.uncheckStar = function(fontPostscriptName){
		$('li[data-postscriptname='+fontPostscriptName+'] .font-list__btn-star').removeClass('star__active');
		socket.emit('command', {'api':'updateFontInfo','postscriptName':fontPostscriptName, 'key':'star', 'val':false});
		return this;
	};

	/**
	 * フォント情報を更新する
	 */
	this.updateFontInfo = function(fontPostscriptName, key, val) {
		var cmd = {
			'api':'updateFontInfo',
			'postscriptName': fontPostscriptName,
			'key': key,
			'val': val
		};
		socket.emit('command', cmd);
		return this;
	}

	$(window).load(function(){
		init();
	});

})(jQuery);