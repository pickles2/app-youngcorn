/**
 * API: getPagePaths
 */
module.exports = function( data, callback, main, socket ){
	delete(require.cache[require('path').resolve(__filename)]);

	var fs = require('fs');
	var path = require('path');
	var it79 = require('iterate79');
	var php = require('phpjs');
	var px2proj,
		projectInfo;
	data.result = {};

	function isFile(path){
		if( !fs.existsSync(path) || !fs.statSync(path).isFile() ){
			return false;
		}
		return true;
	}

	it79.fnc(
		data,
		[
			function( it1, data ){
				main.px2dtLDA.getProject(
					data.projectIdx,
					function( projectInfo ){
						// console.log(main.getPx2Proj);
						data.projectInfo = projectInfo;
						main.getPx2Proj( projectInfo, function(px2proj){
							// console.log('message: '+ JSON.stringify(px2proj));
							data.px2proj = px2proj;
							data.px2proj.get_page_info(data.path, function(pageInfo){
								data.pageInfo = pageInfo;
								it1.next( data );
							});
						} );
					}
				);
			},
			function(it1, data){
				data.px2proj.get_config(function(conf){
					// console.log('message: '+ JSON.stringify(conf));
					data.conf = conf;
					it1.next( data );
				});
			},
			function( it1, data ){
				data.path = data.path;
				data.realpath = path.resolve(data.projectInfo.path, './'+data.projectInfo.entry_script, '..', './'+data.path);
				it1.next( data );
			},
			function( it1, data ){
				data.px2proj.realpath_files(data.path, '', function(path){
					// console.log(path);
					data.realpath_files = path;
					it1.next( data );
				});
			},
			function(it1, data){
				var contLocalpath = data.pageInfo.content;

				var controot = (function(){
					var pathBase = data.projectInfo.path;
					if( fs.statSync( data.projectInfo.path+'/'+data.projectInfo.entry_script ).isFile() ){
						pathBase = php.dirname( fs.realpathSync( data.projectInfo.path+'/'+data.projectInfo.entry_script ) )+'/';
					}
					return pathBase;
				})();

				for( var tmpExt in data.conf.funcs.processor ){
					if( fs.existsSync( controot+'/'+contLocalpath+'.'+ tmpExt) ){
						contLocalpath = contLocalpath+'.'+ tmpExt;
						break;
					}
				}
				data.contLocalpath = contLocalpath;
				it1.next( data );
			},
			function( it1, data ){
				// console.log(data);
				if( isFile( data.realpath_files+'/guieditor.ignore/data.json' ) && isFile( data.realpath ) ){
					data.result = 'html.gui'
				}else if( isFile( data.realpath+'.md' ) ){
					data.result = 'md'
				}else if( isFile( data.realpath ) ){
					data.result = 'html'
				}else{
					data.result = '.not_exists'
				}
				it1.next( data );
			},
			function( it1, data ){
				callback( data.result );
			}
		]
	);
	return;
}
