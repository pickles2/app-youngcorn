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

	if( data.fnc == 'loadSrc' ){
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
				// モジュールコードを取得
				rtn.src = {};
				function loadFile( filename ){
					var result = {};
					var filepath = path.resolve(rtn.moduleRealpath, filename);
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
				callback(rtn);
				rlv();
			}); })
		;
	}else{
		callback(false);
	}

	return;
}
