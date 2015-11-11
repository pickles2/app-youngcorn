/**
 * main.js
 */
window.main = new (function($){
	var _this = this;
	var main = this;
	var it79 = require('iterate79');
	var php = require('phpjs');
	// var $ = require('jquery');
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
	var _commandKeyName = (function(){
		var platform = 'unknown';
		if(process.env.LOCALAPPDATA)return 'ctrl';//Windows
		if(process.env.HOME)return 'cmd';//Darwin
		return 'ctrl';
	})();
	var params = {};

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
						switch(e.target.tagName.toLowerCase()){
							case 'input': case 'textarea':
								return true; break;
						}
						e.preventDefault();
						e.stopPropagation();
						return false;
					});
					_Keypress.simple_combo("delete", function(e) {
						// alert("You pressed delete");
						switch(e.target.tagName.toLowerCase()){
							case 'input': case 'textarea':
								return true; break;
						}
						e.preventDefault();
						e.stopPropagation();
						return false;
					});
					_Keypress.simple_combo(_commandKeyName+" left", function(e) {
						// alert("You pressed Cmd+Left");
						e.preventDefault();
						e.stopPropagation();
						return false;
					});
					_Keypress.simple_combo(_commandKeyName+" right", function(e) {
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

					it1.next(data);
				} ,
				function(it1, data){
					// ドラッグ＆ドロップ操作の無効化
					$('html, body')
						.bind( 'drop', function(e){
							// ドロップ操作を無効化
							e.preventDefault();
							e.stopPropagation();
							return false;
						} )
						.bind( 'dragenter', function(e){
							// ドロップ操作を無効化
							e.preventDefault();
							e.stopPropagation();
							return false;
						} )
						.bind( 'dragover', function(e){
							// ドロップ操作を無効化
							e.preventDefault();
							e.stopPropagation();
							return false;
						} )
					;

					it1.next(data);
				} ,
				function(it1, data){
					// URL内のGETパラメータを抽出
					params = $.url(window.location.href).param();
					it1.next(data);
				} ,
				function(it1, data){
					window.focus();
					it1.next(data);
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
	 * ページに遷移する
	 * @param  {String} path 遷移先の画面パス
	 * @return {[type]}      [description]
	 */
	this.goto = function(path){
		window.location.href = path + '?projectIdx='+params.projectIdx;
		return this;
	}

	/**
	 * Pickles2 プレビュー用サーバーを起動
	 * @param  {Integer}  projectIdx プロジェクトインデックス番号
	 * @param  {Object}   options    オプション
	 * @param  {Function} callback   callback function.
	 * @return {Object}              this.
	 */
	this.previewServerUp = function(projectIdx, options, callback){
		callback = callback||function(){};
		var params = options || {};
		params.projectIdx = projectIdx;
		socket.send(
			'initPx2ServerEmurator',
			params ,
			function(serverInfo){
				console.log('--- Pickles2 Server Emurator, standby. ---');
				console.log(serverInfo);
				callback(serverInfo);
			}
		);
		return this;
	}

	/**
	 * ローディングイメージを表現するDOM要素を取得
	 * @return {[type]} [description]
	 */
	this.getLoadingImage = function(){
		var nowLoading = '';
		nowLoading += '<div style="padding:130px 30%;">';
		nowLoading += '<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" style="width: 100%"></div></div>';
		nowLoading += '</div>';
		return $(nowLoading).get(0);
	}

	/**
	 * WebSocket疎通確認
	 * (baobabFwの疎通確認用メソッド)
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
