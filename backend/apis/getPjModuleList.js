/**
 * API: getPjModuleList
 */
module.exports = function( data, callback, main, socket ){
	// delete(require.cache[require('path').resolve(__filename)]);
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
			rlv();
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// モジュールカテゴリをリスト化
			fs.readdir( rtn.packageRealpath, function(err, fileList){
				// console.log(fileList);
				rtn.categories = {};
				it79.ary(
					fileList,
					function( it1, row, idx ){
						var categoryRealpath = path.resolve(rtn.packageRealpath, row);
						if( fs.statSync(categoryRealpath).isDirectory() ){
							rtn.categories[row] = {};
							rtn.categories[row].categoryId = row;
							try {
								rtn.categories[row].categoryInfo = require( path.resolve( categoryRealpath, 'info.json' ) );
							} catch (e) {
								rtn.categories[row].categoryInfo = {};
							}
							rtn.categories[row].categoryName = rtn.categories[row].categoryInfo.name||row;
							rtn.categories[row].categoryRealpath = categoryRealpath;
							rtn.categories[row].modules = {};
						}
						it1.next();
					} ,
					function(){
						rlv();
					}
				);
			} );
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// 各カテゴリのモジュールをリスト化

			it79.ary(
				rtn.categories,
				function( it1, row, idx ){

					fs.readdir( rtn.categories[idx].categoryRealpath, function(err, fileList){
						it79.ary(
							fileList,
							function( it2, row2, idx2 ){
								var moduleRealpath = path.resolve(rtn.categories[idx].categoryRealpath, row2);
								if( fs.statSync(moduleRealpath).isDirectory() ){
									rtn.categories[idx].modules[row2] = {};
									rtn.categories[idx].modules[row2].moduleId = rtn.packageId+':'+rtn.categories[idx].categoryId+'/'+row2;
									try {
										rtn.categories[idx].modules[row2].moduleInfo = require( path.resolve( moduleRealpath, 'info.json' ) );
									} catch (e) {
										rtn.categories[idx].modules[row2].moduleInfo = {};
									}
									rtn.categories[idx].modules[row2].moduleName = rtn.categories[idx].modules[row2].moduleInfo.name||rtn.categories[idx].modules[row2].moduleId;
									rtn.categories[idx].modules[row2].moduleRealpath = moduleRealpath;
								}
								it2.next();
							} ,
							function(){
								it1.next();
							}
						);
					} );
				} ,
				function(){
					rlv();
				}
			);

		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// 返却
			callback(rtn);
			rlv();
		}); })
	;

	return;
}
