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
					document.querySelector('.cont_main').innerHTML = main.getLoadingImage().outerHTML;
					setTimeout(function(){
						it1.next(data);
					}, 10);
				},
				function(it1, data){
					// Parse Query string parameters
					data.projectIdx = php.intval($.url(window.location.href).param('projectIdx'));
					data.path = php.trim($.url(window.location.href).param('path'));
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
					// ページ情報を取得
					main.socket.send(
						'getPageInfo',
						{
							'projectIdx': data.projectIdx,
							'path': data.path
						},
						function(pageInfo){
							// console.log( pageInfo );
							data.pageInfo = pageInfo;
							it1.next(data);
						}
					);
				} ,
				function(it1, data){
					// ページのパス情報を取得
					main.socket.send(
						'getPagePaths',
						{
							'projectIdx': data.projectIdx,
							'path': data.path
						},
						function(paths){
							// console.log( paths );
							data.pagePaths = paths;
							it1.next(data);
						}
					);
				} ,
				function(it1, data){
					// ページのパス情報を取得
					main.socket.send(
						'getPageEditorType',
						{
							'projectIdx': data.projectIdx,
							'path': data.path
						},
						function(type){
							// console.log( type );
							data.editorType = type;
							it1.next(data);
						}
					);
				} ,
				function(it1, data){
					switch( data.editorType ){
						case 'html.gui':
							window.location.href = './broccoli-html-editor/index.html?projectIdx='+php.urlencode(data.projectIdx)+'&path='+php.urlencode(data.path);
							break;
						case 'html':
							window.location.href = './html/index.html?projectIdx='+php.urlencode(data.projectIdx)+'&path='+php.urlencode(data.path);
							break;
						case 'md':
							window.location.href = './markdown/index.html?projectIdx='+php.urlencode(data.projectIdx)+'&path='+php.urlencode(data.path);
							break;
						case '.not_exists':
							document.querySelector('.cont_main').innerHTML = '<p>.not_exists</p>';
							break;
					}
					console.log('Started!');
				}
			]);
		});
	}

})();
