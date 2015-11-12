window.cont = new (function(){
	var _this = this;
	var it79 = require('iterate79');
	var php = require('phpjs');
	var path = require('path');
	var data = {};

	var projectIdx;

	this.init = function(){
		/**
		 * initialize
		 */
		main.init(function(){
			it79.fnc(data, [
				function(it1, data){
					console.log('setup env...');
					setTimeout(function(){
						it1.next(data);
					}, 10);
				},
				function(it1, data){
					data.projectIdx = php.intval($.url(window.location.href).param('projectIdx'));
					it1.next(data);
				},
				function(it1, data){
					// プロジェクト情報を取得
					main.socket.send('getProject', {'projectIdx': data.projectIdx}, function(result){
						// console.log( result );
						data.projectInfo = result.projectInfo;
						data.config = result.config;
						data.path_homedir = result.path_homedir;
						data.realpath_docroot = path.resolve(php.dirname(data.projectInfo.path+'/'+data.projectInfo.entry_script))+'/';
						it1.next(data);
					});
				},
				function(it1, data){
					console.log('Started!');
				}
			]);
		});
	}

	/**
	 * パブリッシュする
	 * @return {[type]} [description]
	 */
	this.publishRun = function(){
		alert('現在開発中です。');
		var region = prompt('パブリッシュ対象のパスを指定してください。スラッシュから始まるパスで指定します。省略時、すべてのファイルが対象になります。','/');
		if( region === null ){
			return this;
		}
		main.socket.send(
			'publish' ,
			{
				'projectIdx': data.projectIdx,
				'region': region
			} ,
			function(result){
			}
		);
		return this;
	}

	/**
	 * パブリッシュディレクトリ(最近のパブリッシュのみ) を開く
	 * @return {[type]} [description]
	 */
	this.openPublishTmpFolder = function(){
		main.socket.send(
			'open' ,
			{
				'path': data.path_homedir+'/_sys/ram/publish/'
			} ,
			function(result){
			}
		);
		return this;
	}

	/**
	 * パブリッシュディレクトリ(統合された最新の全データ) を開く
	 * @return {[type]} [description]
	 */
	this.openPublishFolder = function(){
		// console.log(data);
		if( !data.config.path_publish_dir ){
			alert('$conf->path_publish_dir が設定されていません。');
			return this;
		}
		main.socket.send(
			'open' ,
			{
				'path': path.resolve(data.realpath_docroot, data.config.path_publish_dir)+'/'
			} ,
			function(result){
			}
		);
		return this;
	}

})();
