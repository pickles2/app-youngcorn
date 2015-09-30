/**
 * API: moduleEditor
 */
module.exports = function( data, callback, main, socket ){
	delete(require.cache[require('path').resolve(__filename)]);
	var it79 = require('iterate79');
	var path = require('path');
	var php = require('phpjs');
	var fs = require('fs');
	var rtn = {},
		px2proj;

	new Promise(function(rlv){rlv();})
		.then(function(){ return new Promise(function(rlv, rjt){
			// プロジェクト情報を取得する
			main.px2dtLDA.getProject(
				data.projectIdx,
				function( projectInfo ){
					rtn.projectInfo = projectInfo;
					rlv();
				}
			);
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// px2projオブジェクトを生成する
			main.getPx2Proj( rtn.projectInfo, function(_px2proj){
				px2proj = _px2proj;
				rlv();
			} );
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// Px2のコンフィグを取得する
			px2proj.get_config(function(config){
				// console.log('message: '+ JSON.stringify(conf));
				rtn.config = config;

				if( !rtn.config ){
					rtn.config = false;
					rjt();
					return;
				}
				rlv();
			});
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// パッケージ情報を取得
			data.moduleId.match( new RegExp('^([\\s\\S]*)\\:([\\s\\S]*)\\/([\\s\\S]*)$') );
			rtn.packageId = RegExp.$1;
			rtn.categoryId = RegExp.$2;
			rtn.moduleId = RegExp.$3;
			rtn.packageId = data.packageId;
			try {
				rtn.packageRealpath = rtn.config.plugins.px2dt.paths_module_template[data.packageId];
				rtn.packageRealpath = path.resolve( php.dirname( rtn.projectInfo.path + '/' + rtn.projectInfo.entry_script ), rtn.packageRealpath )+'/';
			} catch (e) {
				rtn.packageId = false;
				rtn.packageRealpath = false;
				rjt();
				return;
			}
			try {
				rtn.packageInfo = require( rtn.packageRealpath + 'info.json' );
			} catch (e) {
				rtn.packageInfo = false;
			}
			rtn.moduleRealpath = path.resolve( rtn.packageRealpath, rtn.categoryId, rtn.moduleId );
			rlv();
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			if( data.fnc == 'loadSrc' ){
				// モジュールコードを取得
				getModuleCode( rtn.moduleRealpath, function(src){
					rtn.src = src;
					rtn.result = true;
					rlv();
				} );

			}else if( data.fnc == 'saveSrc' ){
				// モジュールコードを保存
				var filepath = path.resolve(rtn.moduleRealpath, data.filename);
				fs.writeFile( filepath, data.src, function(err){
					rtn.result = !err;
					rlv();
				} );

			}else if( data.fnc == 'generatePreviewHTML' ){
				// プレビューHTMLを生成する
				buildPreviewHtml(rtn.moduleRealpath, function(html){
					rtn.html = html;
					rlv();
				});

			}else{
				rjt();return;
			}
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// 返却
			callback(rtn);
			rlv();
		}); })
	;

	/**
	 * モジュールコードを取得する
	 * @param  {String} moduleRealpath Realpath of Module Definition.
	 * @param  {Function} callback callback function.
	 * @return {Object}            this
	 */
	function getModuleCode( moduleRealpath, callback ){
		var rtn = {};
		new Promise(function(rlv){rlv();})
			.then(function(){ return new Promise(function(rlv, rjt){
				rtn.src = {};
				function loadFile( filename ){
					var result = {};
					var filepath = path.resolve(moduleRealpath, filename);
					if( !fs.existsSync(filepath) || !fs.statSync(filepath).isFile() ){
						return false;
					}
					result.filename = filename;
					result.src = fs.readFileSync( filepath ).toString();
					return result;
				}
				rtn.src.infoJson = loadFile('info.json');
				rtn.src.html = loadFile('template.html');
				if( !rtn.src.html ){
					rtn.src.html = loadFile('template.html.twig');
				}
				rtn.src.css = loadFile('module.css.scss');
				if( !rtn.src.css ){
					rtn.src.css = loadFile('module.css');
				}
				rtn.src.js = loadFile('module.js');

				rlv();
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
				// 返却
				callback(rtn.src);
				rlv();
			}); })
		;
		return;
	}


	/**
	 * プレビューHTMLを構成する
	 * @param  {Function} callback callback function.
	 * @return {Object}            this
	 */
	function buildPreviewHtml( moduleRealpath, callback ){
		var html = '',
			loaderHtml = '',
			moduleHtml = '',
			htmlFilename = '',
			infoJson = {},
			uiModel = {}
		;

		/**
		 * モジュールデータからUI要素を抽出する
		 * @param  {[type]} code [description]
		 * @return {[type]}      [description]
		 */
		function extractUiModel(code, htmlFilename, callback){
			if( htmlFilename == 'template.html' ){
				// TODO: モジュールデータからUI要素を抽出する
				callback({});
				return;
			}else if( htmlFilename == 'template.html.twig' ){
				callback(code.infoJson.interface);
			}
			return;
		}
		function bindTemplate(template, uiModel, data, htmlFilename, callback){
			if( htmlFilename == 'template.html' ){
				var nameSpace = {'vars':{}};
				function bindData(src, uiModel, data){
					var rtn = '';
					while( 1 ){
						if( !src.match( new RegExp('^((?:.|\r|\n)*?)\\{\\&((?:.|\r|\n)*?)\\&\\}((?:.|\r|\n)*)$') ) ){
							rtn += src;
							break;
						}
						rtn += RegExp.$1;
						field = RegExp.$2;
						try{
							field = JSON.parse( field );
						}catch(e){
							field = {'input':{
								'type':'html',
								'name':'__error__'
							}};
						}
						src = RegExp.$3;

						if( typeof(field) == typeof('') ){
							// end系：無視
						}else if( field.input ){
							// input field
							var tmpVal = ' test text ';
							// if( px2dtGuiEditor.fieldDefinitions[field.input.type] ){
							// 	// フィールドタイプ定義を呼び出す
							// 	tmpVal += px2dtGuiEditor.fieldDefinitions[field.input.type].bind( fieldData[field.input.name], mode, field.input );
							// }else{
							// 	// ↓未定義のフィールドタイプの場合のデフォルトの挙動
							// 	tmpVal += px2dtGuiEditor.fieldBase.bind( fieldData[field.input.name], mode, field.input );
							// }
							if( !field.input.hidden ){//← "hidden": true だったら、非表示(=出力しない)
								rtn += tmpVal;
							}
							nameSpace.vars[field.input.name] = {
								fieldType: "input", type: field.input.type, val: tmpVal
							};

						}else if( field.module ){
							// module field
							rtn += '<p>include module</p>';
							// rtn += fieldData[field.module.name].join('');

						}else if( field.loop ){
							// loop field
							// var tmpSearchResult = searchEndTag( src, 'loop' );
							// rtn += fieldData[field.loop.name].join('');
							// src = tmpSearchResult.nextSrc;

						}else if( field.if ){
							// if field
							// is_set に指定されたフィールドに値があったら、という評価ロジックを取り急ぎ実装。
							// もうちょっとマシな条件の書き方がありそうな気がするが、あとで考える。
							// → 2015-04-25: cond のルールを追加。
							// var tmpSearchResult = searchEndTag( src, 'if' );
							// var boolResult = false;
							// src = '';
							// if( field.if.cond && typeof(field.if.cond) == typeof([]) ){
							// 	// cond に、2次元配列を受け取った場合。
							// 	// 1次元目は or 条件、2次元目は and 条件で評価する。
							// 	for( var condIdx in field.if.cond ){
							// 		var condBool = true;
							// 		for( var condIdx2 in field.if.cond[condIdx] ){
							// 			var tmpCond = field.if.cond[condIdx][condIdx2];
							// 			if( tmpCond.match( new RegExp('^([\\s\\S]*?)\\:([\\s\\S]*)$') ) ){
							// 				var tmpMethod = px.php.trim(RegExp.$1);
							// 				var tmpValue = px.php.trim(RegExp.$2);
							//
							// 				if( tmpMethod == 'is_set' ){
							// 					if( !nameSpace.vars[tmpValue] || !px.php.trim(nameSpace.vars[tmpValue].val).length ){
							// 						condBool = false;
							// 						break;
							// 					}
							// 				}else if( tmpMethod == 'is_mode' ){
							// 					if( tmpValue != mode ){
							// 						condBool = false;
							// 						break;
							// 					}
							// 				}
							// 			}else if( tmpCond.match( new RegExp('^([\\s\\S]*?)(\\!\\=|\\=\\=)([\\s\\S]*)$') ) ){
							// 				var tmpValue = px.php.trim(RegExp.$1);
							// 				var tmpOpe = px.php.trim(RegExp.$2);
							// 				var tmpDiff = px.php.trim(RegExp.$3);
							// 				if( tmpOpe == '==' ){
							// 					if( nameSpace.vars[tmpValue].val != tmpDiff ){
							// 						condBool = false;
							// 						break;
							// 					}
							// 				}else if( tmpOpe == '!=' ){
							// 					if( nameSpace.vars[tmpValue].val == tmpDiff ){
							// 						condBool = false;
							// 						break;
							// 					}
							// 				}
							// 			}
							//
							// 		}
							// 		if( condBool ){
							// 			boolResult = true;
							// 			break;
							// 		}
							// 	}
							// }
							// if( nameSpace.vars[field.if.is_set] && px.php.trim(nameSpace.vars[field.if.is_set].val).length ){
							// 	boolResult = true;
							// }
							// if( boolResult ){
							// 	src += tmpSearchResult.content;
							// }
							// src += tmpSearchResult.nextSrc;

						}else if( field.echo ){
							// echo field
							if( nameSpace.vars[field.echo.ref] && nameSpace.vars[field.echo.ref].val ){
								rtn += nameSpace.vars[field.echo.ref].val;
							}

						}

					}
					return rtn;
				}
				template = bindData(template, uiModel, data);
				callback(template);
			}else if( htmlFilename == 'template.html.twig' ){
				socket.send('twig',
					{
						'data':data,
						'template': template
					} ,
					function(result){
						console.log(result);
						callback(result);
					}
				);
			}

			return;
		}

		new Promise(function(rlv){rlv();})
			.then(function(){ return new Promise(function(rlv, rjt){
				getModuleCode( moduleRealpath, function(code){
					moduleHtml = code.html.src;
					htmlFilename = code.html.filename;
					try {
						infoJson = JSON.parse(code.infoJson.src);
					} catch (e) {
					}
					extractUiModel(code, htmlFilename, function(result){
						// モジュールコードからUIモデルを抽出する
						uiModel = result;
						rlv();
					});
				});
			}); })

			.then(function(){ return new Promise(function(rlv, rjt){
				px2proj.query(
					'/?PX=px2dthelper.document_modules.load',
					{
						"complete": function(loader, code){
							loaderHtml = loader;// ←全モジュールから生成されたCSSとJSのコード。(styleタグとscriptタグ)
							rlv();
						}
					}
				);
			}); })

			.then(function(){ return new Promise(function(rlv, rjt){
				// テンプレートにデータをはめてプレビューコードを完成させる
				bindTemplate(moduleHtml, uiModel, {}, htmlFilename, function(result){
					moduleHtml = result;
					rlv();
				});
			}); })

			.then(function(){ return new Promise(function(rlv, rjt){
				html += '<!DOCTYPE html>'+"\n";
				html += '<html>'+"\n";
				html += '<head>'+"\n";
				html += '<style>'+"\n";
				html += 'body{background:#fff;}'+"\n";
				html += '</style>'+"\n";
				html += loaderHtml+"\n";
				html += '</head>'+"\n";
				html += '<body>'+"\n";
				html += '<div class="contents">'+"\n";
				html += '<p style="background:#ddd; text-align:center;">(element before)</p>'+"\n";
				html += moduleHtml+"\n";
				html += '<p style="background:#ddd; text-align:center;">(element after)</p>'+"\n";
				html += '</div>'+"\n";
				html += '</body>'+"\n";
				html += '</html>';
				rlv();
			}); })

			.then(function(){ return new Promise(function(rlv, rjt){
				// 返却
				callback(html);
				rlv();
			}); })
		;
		return;
	}

	return;
}
