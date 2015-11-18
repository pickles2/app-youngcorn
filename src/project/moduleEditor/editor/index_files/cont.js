window.cont = new (function(){
	var _this = this;
	var it79 = require('iterate79');
	var php = require('phpjs');
	var data = {};
	var broccoli = new Broccoli();

	this.init = function(){
		/**
		 * initialize
		 */
		main.init(function(){
			it79.fnc(data, [
				function(it1, data){
					// 編集中は Keypress の監視を停止する。
					$('textarea')
						.bind("focus", function() { main.Keypress.stop_listening(); })
						.bind("blur", function() { main.Keypress.listen(); })
					;
					// cmd+sで保存
					main.Keypress.simple_combo("cmd s", function(e) {
						_this.save(function(){
						});
						// console.log("You pressed cmd+s");
						e.preventDefault();
						return false;
					});

					it1.next(data);
				} ,
				function(it1, data){
					// Parse Query string parameters
					data.projectIdx = php.intval($.url(window.location.href).param('projectIdx'));
					data.packageId = php.trim($.url(window.location.href).param('packageId'));
					data.moduleId = php.trim($.url(window.location.href).param('moduleId'));
					// console.log( data );
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
							// console.log( result );
							data.src = result.src;
							// data.projectInfo = result.projectInfo;
							// data.config = result.config;
							// data.path_homedir = result.path_homedir;
							it1.next(data);
						}
					);
				} ,
				function(it1, data){
					// broccoli-html-editor standby.
					// console.log('broccoli init();');
					broccoli.init(
						{
							'elmCanvas': document.createElement('div'),
							'elmModulePalette': document.createElement('div'),
							'elmInstanceTreeView': document.createElement('div'),
							'elmInstancePathView': document.createElement('div'),
							'contents_area_selector': '[data-broccoli-bowl]',
							'contents_bowl_name_by': 'data-broccoli-bowl',
							'customFields': {
								'table': window.BroccoliHtmlEditorTableField,
								'psd': window.BroccoliPSDField
							},
							'gpiBridge': function(api, options, callback){
								// GPI(General Purpose Interface) Bridge
								// broccoliは、バックグラウンドで様々なデータ通信を行います。
								// GPIは、これらのデータ通信を行うための汎用的なAPIです。
								main.socket.send(
									'moduleEditor',
									{
										'fnc': 'gpiBridge' ,
										'projectIdx': php.intval($.url(window.location.href).param('projectIdx')),
										'packageId': php.trim($.url(window.location.href).param('packageId')),
										'moduleId': php.trim($.url(window.location.href).param('moduleId')),
										'bridge': {
											'api': api ,
											'options': options
										}
									} ,
									function(rtn){
										// console.log('----------------- gpi returns:');
										// console.log(rtn);
										callback(rtn);
									}
								);
								return;
							}
						} ,
						function(){
							// 初期化が完了すると呼びだされるコールバック関数です。

							// $(window).resize(function(){
							// 	// このメソッドは、canvasの再描画を行います。
							// 	// ウィンドウサイズが変更された際に、UIを再描画するよう命令しています。
							// 	onWindowResized();
							// }).resize();

							console.log('broccoli init(); - done.');
							it1.next(data);
						}
					);
				} ,
				function(it1, data){
					// 描画

					// info.json
					if( data.src.infoJson ){
						$('[name=src_infojson]')
							.val( data.src.infoJson.src )
							.attr( {"data-filename": data.src.infoJson.filename} )
						;
					}else{
						$('[name=src_infojson]')
							.val( JSON.stringify( {
								"name": ""
							}, null, 2 ) )
							.attr( {"data-filename": 'info.json'} )
						;
					}

					// template.html
					if( data.src.html ){
						$('[name=src_html]')
							.val( data.src.html.src )
							.attr( {"data-filename": data.src.html.filename} )
						;
					}else{
						$('[name=src_html]')
							.val( '<div></div>' )
							.attr( {"data-filename": 'template.html'} )
						;
					}

					// module.css.scss
					if( data.src.css ){
						$('[name=src_css]')
							.val( data.src.css.src )
							.attr( {"data-filename": data.src.css.filename} )
						;
					}else{
						$('[name=src_css]')
							.val( '/* module CSS */' )
							.attr( {"data-filename": 'module.css.scss'} )
						;
					}

					// module.js
					if( data.src.js ){
						$('[name=src_js]')
							.val( data.src.js.src )
							.attr( {"data-filename": data.src.js.filename} )
						;
					}else{
						$('[name=src_js]')
							.val( '/* module JavaScript */' )
							.attr( {"data-filename": 'module.js'} )
						;
					}

					_this.updatePreview(function(){
						it1.next(data);
					});

				} ,
				function(it1, data){
					// イベント処理

					$('textarea').change(function(e){
						var $this = $(this);
						// console.log('changed');
						// console.log($this.attr('data-filename'));

						main.socket.send('moduleEditor',
							{
								'fnc': 'saveSrc' ,
								'filename': $this.attr('data-filename') ,
								'src': $this.val(),
								'projectIdx': data.projectIdx ,
								'packageId': data.packageId ,
								'moduleId': data.moduleId
							},
							function(result){
								console.log( result );
								// alert( '保存しました。' );
								_this.updatePreview( function(){} );
							}
						);

					});


					it1.next(data);
				} ,
				function(it1, data){
					// console.log(data);
					console.log('Started!');
				}
			]);
		});
		return this;
	}

	/**
	 * すべての変更を保存する
	 * TODO: 未実装です。
	 * @return {Object} this
	 */
	this.save = function(callback){
		callback = callback||function(){};
		callback();
		return this;
	}

	/**
	 * プレビューを更新する。
	 * @param  {Function} callback コールバック関数
	 * @return {Object}            this
	 */
	this.updatePreview = function(callback){
		callback = callback||function(){};
		var $iframe = $($('iframe.cont_preview').get(0).contentWindow);
		var doc = $iframe.get(0).document;

		var html = '';
		main.socket.send('moduleEditor',
			{
				'fnc': 'generatePreviewHTML' ,
				'projectIdx': data.projectIdx ,
				'packageId': data.packageId ,
				'moduleId': data.moduleId
			},
			function(result){
				console.log( result );
				doc.write(result.html);
				doc.close();

				setTimeout(function(){
					callback();
				}, 0);
			}
		);

		return this;
	}

})();
