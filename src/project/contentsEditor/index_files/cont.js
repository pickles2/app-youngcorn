window.cont = new (function(){
	var _this = this;
	var it79 = require('iterate79');
	var php = require('phpjs');

	this.init = function(){
		/**
		 * initialize
		 */
		main.init(function(){
			it79.fnc({}, [
				function(it1, data){
					console.log('setup env...');
					document.querySelector('.cont_page_list').innerHTML = main.getLoadingImage().outerHTML;
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
					// サイトマップを取得
					main.socket.send(
						'getSitemap',
						{
							'projectIdx': data.projectIdx
						},
						function(sitemap){
							// console.log( sitemap );
							data.sitemap = sitemap.sitemap;
							it1.next(data);
						}
					);
				} ,
				function(it1, data){
					// 描画
					// console.log( data );
					var html =
						twig({data: document.getElementById('template-pageList').innerHTML})
						.render(data)
					;
					document.querySelector('.cont_page_list').innerHTML = html;

					it1.next(data);
				} ,
				function(it1, data){
					console.log('Started!');
				}
			]);
		});
	}

})();
