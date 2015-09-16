window.cont = new (function(){
	var _this = this;
	var php = require('phpjs');
	var data = {};

	this.init = function(){
		/**
		 * initialize
		 */
		main.init(function(){
			main.it79.fnc({}, [
				function(it1, data){
					// Parse Query string parameters
					data.projectIdx = php.intval($.url(window.location.href).param('projectIdx'));
					data.packageId = php.trim($.url(window.location.href).param('packageId'));
					data.moduleId = php.trim($.url(window.location.href).param('moduleId'));
					console.log( data );
					it1.next(data);
				} ,
				function(it1, data){
					// モジュールコードを取得
					main.socket.send('moduleEditor',
						{
							'fnc': 'loadSrc' ,
							'projectIdx': data.projectIdx ,
							'packageId': data.packageId ,
							'moduleId': data.moduleId
						},
						function(result){
							console.log( result );
							// data.projectInfo = result.projectInfo;
							// data.config = result.config;
							// data.path_homedir = result.path_homedir;
							it1.next(data);
						}
					);
				} ,
				function(it1, data){
					// 描画
					// var html =
					// 	twig({data: document.getElementById('template-moduleList').innerHTML})
					// 	.render(data)
					// ;
					// document.querySelector('.cont_module_list').innerHTML = html;
					//
					// var html =
					// 	twig({data: document.getElementById('template-content-footer').innerHTML})
					// 	.render(data)
					// ;
					// document.querySelector('.cont_cont_footer').innerHTML = html;

					it1.next(data);
				} ,
				function(it1, _data){
					data = _data;
					console.log('Started!');
				}
			]);
		});
	}

})();
