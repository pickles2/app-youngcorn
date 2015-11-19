/**
 * API: moduleEditor
 */
module.exports = function( data, callback, main, socket ){
	delete(require.cache[require('path').resolve(__filename)]);
	var it79 = require('iterate79');
	var path = require('path');
	var php = require('phpjs');
	var fs = require('fs');
	var fsx = require('fs-extra');
	var Broccoli = require('broccoli-html-editor');
	var rtn = {},
		broccoli,
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
			// broccoli setup.
			broccoli = new Broccoli();
			// console.log(rtn);
			// console.log(broccoli);
			var paths_module_template = {};
			paths_module_template[''+rtn.packageId] = rtn.packageRealpath;
			// console.log(paths_module_template);

			broccoli.init(
				{
					'paths_module_template': paths_module_template ,
					'documentRoot': rtn.moduleRealpath+'/_preview/',
					'pathHtml': '/preview.html',
					'pathResourceDir': '/preview_files/resources/',
					'realpathDataDir': rtn.moduleRealpath+'/_preview/preview_files/guieditor.ignore/',
					'customFields': {
						'table': require('broccoli-html-editor--table-field'),
						'psd': require('broccoli-psd-field')
					} ,
					'bindTemplate': function(htmls, callback){
						var fin = '';
						fin += '<!DOCTYPE html>'+"\n";
						fin += '<html>'+"\n";
						fin += '<head>'+"\n";
						fin += '<style>'+"\n";
						fin += 'body{background:#fff;}'+"\n";
						fin += '</style>'+"\n";
						// fin += loaderHtml+"\n";
						fin += '</head>'+"\n";
						fin += '<body>'+"\n";
						fin += '<div class="contents">'+"\n";
						fin += '<p style="background:#ddd; text-align:center;">(element before)</p>'+"\n";
						fin += '<div data-px2-contents-theme-editor="main">'+"\n";
						for( var bowlId in htmls ){
							fin += htmls[bowlId]+"\n";
						}
						fin += '</div>'+"\n";
						fin += '<p style="background:#ddd; text-align:center;">(element after)</p>'+"\n";
						fin += '</div>'+"\n";
						fin += '</body>'+"\n";
						fin += '</html>';

						callback(fin);
						return;
					}

				},
				function(){
					rlv();
				}
			);

		}); })

		.then(function(){ return new Promise(function(rlv, rjt){

			fsx.ensureDirSync(rtn.moduleRealpath+'/_preview/');
			// console.log(3456789);
			fsx.ensureDirSync(rtn.moduleRealpath+'/_preview/preview_files/');
			fsx.ensureDirSync(rtn.moduleRealpath+'/_preview/preview_files/resources/');
			fsx.ensureDirSync(rtn.moduleRealpath+'/_preview/preview_files/guieditor.ignore/');
			fs.writeFileSync(rtn.moduleRealpath+'/_preview/preview.html', '');
			var json = null;
			try {
				json = fsx.readJsonSync(rtn.moduleRealpath+'/_preview/preview_files/guieditor.ignore/data.json');
			} catch (e) {
			}
			json = json || {
				'bowl':{
					'main':{
						'modId': '_sys/root',
						'fields':{
							'main':[
								{
									'modId': data.moduleId,
									'fields': {
									}
								}
							]
						}
					}
				}
			};

			// console.log(data.moduleId);
			// console.log(broccoli);
			// console.log(broccoli.contentsSourceData);
			// console.log(broccoli.getModule);
			// console.log(broccoli.contentsSourceData.getModule);
			broccoli.getModule( data.moduleId, null, function(mod){
				// console.log(mod.fields);
				// 削除されたフィールドを削除
				for( var idx in json.bowl.main.fields.main[0].fields ){
					if( !mod.fields[idx] ){
						json.bowl.main.fields.main[0].fields[idx] = undefined;
						delete(json.bowl.main.fields.main[0].fields[idx]);
						console.log(json.bowl.main.fields.main[0].fields[idx]);
					}
				}
				// console.log(json.bowl.main.fields.main[0].fields);

				for( var idx in mod.fields ){
					if( mod.fields[idx].fieldType == 'module' ){
						json.bowl.main.fields.main[0].fields[idx] = [
							{
								'modId': '_sys/html',
								'fields': {
									'main': '<div style="border:1px dotted #ddd; color: #999; background: #eee; padding:1em;">'
											+'<h2>Dummy Module Contents</h2>'
											+'<p>moduleフィールドに仮適用されたダミーのコンテンツです。</p>'
											+'</div>'
								}
							}
						];
					}else if( mod.fields[idx].fieldType == 'module' ){
						// TODO: 未実装
					}
				}


				fs.writeFileSync( rtn.moduleRealpath+'/_preview/preview_files/guieditor.ignore/data.json', JSON.stringify(json, null, 1) );
				rlv();
			} );
			// console.log(mod);


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

			}else if(data.fnc == 'gpiBridge'){
				// console.log('----------------- gpi start:');
				broccoli.gpi(
					data.bridge.api,
					data.bridge.options,
					function(result){
						rtn = result;
						// console.log('----------------- gpi returns:');
						// console.log(rtn);
						rlv();
						return;
					}
				);
				return ;

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
			moduleHtml = ''
		;

		new Promise(function(rlv){rlv();})

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
				// console.log(broccoli);
				broccoli.buildHtml(
					{},
					function(htmls){
						// console.log(htmls);
						moduleHtml = htmls['main'];
						rlv();
					}
				);

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
