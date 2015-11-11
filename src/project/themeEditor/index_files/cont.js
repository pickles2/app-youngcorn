window.cont = new (function(){
	var _this = this;
	var it79 = require('iterate79');
	var php = require('phpjs');

	var projectIdx;

	this.init = function(){
		/**
		 * initialize
		 */
		main.init(function(){
			it79.fnc({}, [
				function(it1, data){
					console.log('setup env...');
					setTimeout(function(){
						it1.next(data);
					}, 10);
				},
				function(it1, data){
					// Parse Query string parameters
					data.projectIdx = projectIdx = php.intval($.url(window.location.href).param('projectIdx'));
					console.log( data );
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
					// レイアウト一覧を取得
					main.socket.send(
						'themeEditor',
						{
							'api': 'getLayoutList',
							'projectIdx': data.projectIdx
						},
						function(result){
							console.log(result);
							data.layoutList = result;
							it1.next(data);
						}
					);
				} ,
				function(it1, data){
					// 描画
					var html =
						twig({data: document.getElementById('template-layoutList').innerHTML})
						.render(data)
					;
					document.querySelector('.cont_layout_list').innerHTML = html;

					var html =
						twig({data: document.getElementById('template-content-footer').innerHTML})
						.render(data)
					;
					document.querySelector('.cont_cont_footer').innerHTML = html;

					it1.next(data);
				} ,
				function(it1, data){
					console.log('Started!');
				}
			]);
		});
	}

	/**
	 * 新しいレイアウトを追加する
	 *
	 * @param  {[type]} form  [description]
	 * @param  {[type]} modal [description]
	 * @return {[type]}       [description]
	 */
	this.createNewLayout = function(form, modal){
		// プロジェクトを追加
		var value = {
			api: 'createNewLayout',
			projectIdx: projectIdx,
			layoutName: $(form).find('[name=name]').val()
		};
		if( value.layoutName.match(/[^a-zA-Z0-9\_\-]/) ){
			alert('使用できない文字が含まれています。');
			return this;
		}
		main.socket.send(
			'themeEditor',
			value,
			function(result){
				// console.log(result);
				if(!result.result){
					alert(result.message);
				}
				$(modal).modal('hide');
				_this.init();
			}
		);
		return this;
	}

	/**
	 * プロジェクトを削除する
	 *
	 * @param  {[type]} layoutName [description]
	 * @return {[type]}            [description]
	 */
	this.removeLayout = function( layoutName ){
		if( !confirm('本当に削除してよろしいですか？') ){
			return this;
		}
		main.socket.send(
			'themeEditor',
			{
				'api': 'removeLayout',
				'projectIdx': projectIdx,
				'layoutName': layoutName
			},
			function(result){
				// alert(result);
				_this.init();
			}
		);
		return this;
	}

})();
