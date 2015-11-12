window.cont = new (function(){
	var _this = this;
	var it79 = require('iterate79');
	var php = require('phpjs');
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
	 * サイトマップフォルダを開く
	 * @return {[type]} [description]
	 */
	this.openSitemapFolder = function(){
		main.socket.send(
			'open' ,
			{
				'path': data.path_homedir+'/sitemaps/'
			} ,
			function(result){
			}
		);
		return this;
	}

})();
