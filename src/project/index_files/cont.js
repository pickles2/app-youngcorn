window.cont = new (function(){
	var it79 = require('iterate79');
	var php = require('phpjs');
	var data = {};

	this.init = function(){
		/**
		 * initialize
		 */
		main.init(function(){
			it79.fnc(data, [
				function(it1, data){
					console.log('setup env...');
					document.querySelector('.cont_project_info').innerHTML = main.getLoadingImage().outerHTML;
					setTimeout(function(){
						it1.next(data);
					}, 10);
				},
				function(it1, data){
					// Parse Query string parameters
					data.projectIdx = php.intval($.url(window.location.href).param('projectIdx'));
					// console.log( data );
					it1.next(data);
				} ,
				function(it1, data){
					// プロジェクト情報を取得
					main.socket.send('getProject', {'projectIdx': data.projectIdx}, function(result){
						// console.log( result );
						data.projectInfo = result.projectInfo;
						data.config = result.config;
						data.path_homedir = result.path_homedir;
						it1.next(data);
					});
				} ,
				function(it1, data){
					// プロジェクト情報を描画
					// console.log(row);
					var html =
						twig({data: document.getElementById('template-projectInfo').innerHTML})
						.render(data)
					;
					document.querySelector('.cont_project_info').innerHTML = html;
					it1.next(data);
				} ,
				function(it1, _data){
					data = _data;
					console.log('Started!');
					console.log(data);
					it1.next(data);
				}
			]);
		});
	}

	/**
	 * テキストエディタで開く
	 * @return {Object}       this
	 */
	this.openInTextEditor = function(){
		main.socket.send(
			'open' ,
			{
				'path': data.projectInfo.path,
				'in': 'texteditorForDir'
			} ,
			function(result){
			}
		);
		return this;
	}

	/**
	 * フォルダを開く
	 * @return {Object}       this
	 */
	this.openFolder = function(){
		main.socket.send(
			'open' ,
			{
				'path': data.projectInfo.path
			} ,
			function(result){
			}
		);
		return this;
	}

	/**
	 * ブラウザで開く
	 * @return {Object}       this
	 */
	this.openInBrowser = function(){
		// プロジェクト情報を取得
		// console.log(data.projectIdx);
		main.previewServerUp(data.projectIdx, {}, function(serverInfo){
			var pareviewUrl = serverInfo.scheme+"://"+serverInfo.domain+":"+serverInfo.port;
			// console.log(pareviewUrl);
			main.socket.send(
				'open' ,
				{
					'path': pareviewUrl
				} ,
				function(result){
					console.log( 'Opened URL: '+pareviewUrl );
				}
			);
		});
		return this;
	}

})();
