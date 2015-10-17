window.cont = new (function(){
	var _this = this;
	var it79 = require('iterate79');
	var php = require('phpjs');
	var data = {};

	this.init = function(){
		/**
		 * initialize
		 */
		main.init(function(){
			it79.fnc({}, [
				function(it1, data){
					// Parse Query string parameters
					data.projectIdx = php.intval($.url(window.location.href).param('projectIdx'));
					data.path = php.trim($.url(window.location.href).param('path'));
					console.log( data );
					it1.next(data);
				} ,
				// function(it1, _data){
				// 	// 描画
				// 	data = _data;
				//
				// 	// info.json
				// 	if( data.src.infoJson ){
				// 		$('[name=src_infojson]')
				// 			.val( data.src.infoJson.src )
				// 			.attr( {"data-filename": data.src.infoJson.filename} )
				// 		;
				// 	}else{
				// 		$('[name=src_infojson]')
				// 			.val( JSON.stringify( {
				// 				"name": ""
				// 			}, null, 2 ) )
				// 			.attr( {"data-filename": 'info.json'} )
				// 		;
				// 	}
				//
				// 	// template.html
				// 	if( data.src.html ){
				// 		$('[name=src_html]')
				// 			.val( data.src.html.src )
				// 			.attr( {"data-filename": data.src.html.filename} )
				// 		;
				// 	}else{
				// 		$('[name=src_html]')
				// 			.val( '<div></div>' )
				// 			.attr( {"data-filename": 'template.html'} )
				// 		;
				// 	}
				//
				// 	// module.css.scss
				// 	if( data.src.css ){
				// 		$('[name=src_css]')
				// 			.val( data.src.css.src )
				// 			.attr( {"data-filename": data.src.css.filename} )
				// 		;
				// 	}else{
				// 		$('[name=src_css]')
				// 			.val( '/* module CSS */' )
				// 			.attr( {"data-filename": 'module.css.scss'} )
				// 		;
				// 	}
				//
				// 	// module.js
				// 	if( data.src.js ){
				// 		$('[name=src_js]')
				// 			.val( data.src.js.src )
				// 			.attr( {"data-filename": data.src.js.filename} )
				// 		;
				// 	}else{
				// 		$('[name=src_js]')
				// 			.val( '/* module JavaScript */' )
				// 			.attr( {"data-filename": 'module.js'} )
				// 		;
				// 	}
				//
				// 	_this.updatePreview(function(){
				// 		it1.next(data);
				// 	});
				//
				// } ,
				// function(it1, data){
				// 	// イベント処理
				//
				// 	$('textarea').change(function(e){
				// 		var $this = $(this);
				// 		// console.log('changed');
				// 		// console.log($this.attr('data-filename'));
				//
				// 		main.socket.send('moduleEditor',
				// 			{
				// 				'fnc': 'saveSrc' ,
				// 				'filename': $this.attr('data-filename') ,
				// 				'src': $this.val(),
				// 				'projectIdx': data.projectIdx ,
				// 				'packageId': data.packageId ,
				// 				'moduleId': data.moduleId
				// 			},
				// 			function(result){
				// 				console.log( result );
				// 				// alert( '保存しました。' );
				// 				_this.updatePreview( function(){} );
				// 			}
				// 		);
				//
				// 	});
				//
				//
				// 	it1.next(data);
				// } ,
				function(it1, _data){
					data = _data;
					console.log(data);
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
