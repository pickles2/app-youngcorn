window.cont = new (function(){
	var _this = this;
	var it79 = require('iterate79');
	var php = require('phpjs');
	var data = {};
	var broccoli = new Broccoli();

	this.init = function(callback){
		callback = callback||function(){};

		/**
		 * initialize
		 */
		main.init(function(){
			it79.fnc(data, [
				function(it1, data){
					// Parse Query string parameters
					data.projectIdx = php.intval($.url(window.location.href).param('projectIdx'));
					data.path = php.trim($.url(window.location.href).param('path'));
					// console.log( data );
					it1.next(data);
				} ,
				function(it1, data){
					// getting Project Info
					main.socket.send(
						'getProject',
						{'projectIdx': data.projectIdx},
						function(pjInfo){
							data.projectInfo = pjInfo;
							// console.log(data);
							it1.next(data);
						}
					);
				} ,
				function(it1, data){
					main.previewServerUp(data.projectIdx, {}, function(serverInfo){
						$('#canvas').attr({
							"data-broccoli-preview": serverInfo.scheme+"://"+serverInfo.domain+":"+serverInfo.port+data.path
						});
						it1.next(data);
					});
				} ,
				function(it1, data){
					// broccoli-html-editor standby.
					broccoli.init(
						{
							'elmCanvas': document.getElementById('canvas'),
							'elmModulePalette': document.getElementById('palette'),
							'elmInstanceTreeView': document.getElementById('instanceTreeView'),
							'elmInstancePathView': document.getElementById('instancePathView'),
							'contents_area_selector': data.projectInfo.config.plugins.px2dt.contents_area_selector,
							'contents_bowl_name_by': data.projectInfo.config.plugins.px2dt.contents_bowl_name_by,
							'customFields': {
								'table': window.BroccoliHtmlEditorTableField
							},
							'gpiBridge': function(api, options, callback){
								// GPI(General Purpose Interface) Bridge
								// broccoliは、バックグラウンドで様々なデータ通信を行います。
								// GPIは、これらのデータ通信を行うための汎用的なAPIです。
								main.socket.send(
									'broccoliBridge',
									{
										'api': 'gpiBridge' ,
										'projectIdx': php.intval($.url(window.location.href).param('projectIdx')),
										'path': php.trim($.url(window.location.href).param('path')),
										'bridge': {
											'api': api ,
											'options': options
										}
									} ,
									function(rtn){
										// console.log(rtn);
										callback(rtn);
									}
								);
								return;
							}
						} ,
						function(){
							// 初期化が完了すると呼びだされるコールバック関数です。

							$(window).resize(function(){
								// このメソッドは、canvasの再描画を行います。
								// ウィンドウサイズが変更された際に、UIを再描画するよう命令しています。
								onWindowResized();
							}).resize();

							it1.next(data);
						}
					);
				} ,
				function(it1, _data){
					data = _data;
					console.log(data);
					console.log('Started!');
					callback();
				}
			]);
		});
		return this;
	}

	/**
	 * Window Resize Event
	 */
	function onWindowResized(callback){
		callback = callback||function(){};
		$('.cont_outline')
			.css({
				'width': $(window).innerWidth() ,
				'height': $(window).innerHeight()
			})
		;
		$('#instanceTreeView, #canvas, #palette')
			.css({
				'height': $('.cont_outline').outerHeight() - $('#instancePathView').outerHeight()
			})
		;

		broccoli.redraw();
		callback();
		return;
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
	 * @return {Object}			this
	 */
	this.updatePreview = function(callback){
		callback = callback||function(){};
		var $iframe = $($('iframe.cont_preview').get(0).contentWindow);
		var doc = $iframe.get(0).document;

		var html = '';
		this.save(function(){
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
		});
		return this;
	}

})();
