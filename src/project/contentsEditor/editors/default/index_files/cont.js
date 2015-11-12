window.cont = new (function(){
	var _this = this;
	var it79 = require('iterate79');
	var php = require('phpjs');
	var data = {};

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
					// getting Project Info
					main.socket.send(
						'findPageContent',
						{
							'projectIdx': data.projectIdx,
							'path': data.path
						},
						function(path_content){
							data.path_content = path_content;
							// console.log(data);
							it1.next(data);
						}
					);
				} ,
				function(it1, data){
					// getting Project Info
					main.socket.send(
						'contentsEditor',
						{
							'api': 'loadContentsSrc',
							'projectIdx': data.projectIdx,
							'path': data.path
						},
						function(srcContents){
							console.log(srcContents);
							// data.path_content = path_content;
							data.srcContents = srcContents;
							it1.next(data);
						}
					);
				} ,
				function(it1, data){
					main.previewServerUp(data.projectIdx, {}, function(serverInfo){
						var pareviewUrl = serverInfo.scheme+"://"+serverInfo.domain+":"+serverInfo.port+data.path;
						$('#preview')
							.attr({
								"data-broccoli-preview": pareviewUrl
							})
							.append( $('<iframe>')
								.attr({
									'src': pareviewUrl
								})
							)
						;
						it1.next(data);
					});
				} ,
				function(it1, data){
					$('#canvas')
						.append( $('<textarea>')
							.val( data.srcContents )
							.bind('change', function(){
								var $this = $(this);
								data.srcContents = $this.val();
								_this.save(function(result){
									var $iframe = $('#preview iframe');
									$iframe.attr({//reload
										'src': $iframe.attr('src')
									});
								});
							})
						)
					;
					it1.next(data);
				} ,
				function(it1, data){
					$(window).resize(function(){
						// このメソッドは、canvasの再描画を行います。
						// ウィンドウサイズが変更された際に、UIを再描画するよう命令しています。
						onWindowResized();
					}).resize();

					it1.next(data);
				} ,
				function(it1, data){
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
		$('#preview, #canvas')
			.css({
				'height': $('.cont_outline').outerHeight() - 5
			})
		;
		callback();
		return;
	}

	/**
	 * データを保存する。
	 *
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	this.save = function(callback){
		callback = callback||function(){};
		main.socket.send(
			'contentsEditor',
			{
				'api': 'save',
				'projectIdx': data.projectIdx,
				'path': data.path,
				'srcContents': data.srcContents
			},
			function(result){
				// console.log(result);
				callback(result);
			}
		);
		return this;
	}

})();
