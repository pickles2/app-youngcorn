/**
 * API: findPageContent
 */
module.exports = function( data, callback, main, socket ){
	delete(require.cache[require('path').resolve(__filename)]);

	var it79 = require('iterate79');
	var fs = require('fs');
	var php = require('phpjs');
	var px2proj,
		projectInfo;


	it79.fnc(
		data,
		[
			function(it1, data){
				main.px2dtLDA.getProject(
					data.projectIdx,
					function( _projectInfo ){
						projectInfo = _projectInfo;
						main.getPx2Proj( projectInfo, function(_px2proj){
							px2proj = _px2proj;
							px2proj.get_page_info(data.path, function(pageInfo){
								data.pageInfo = pageInfo;
								it1.next( data );
							});
						} );
					}
				);
			},
			function(it1, data){
				px2proj.get_config(function(conf){
					// console.log('message: '+ JSON.stringify(conf));
					data.conf = conf;
					it1.next( data );
				});
			},
			function(it1, data){
				var contLocalpath = data.pageInfo.content;

				var controot = (function(){
					var pathBase = projectInfo.path;
					if( fs.statSync( projectInfo.path+'/'+projectInfo.entry_script ).isFile() ){
						pathBase = php.dirname( fs.realpathSync( projectInfo.path+'/'+projectInfo.entry_script ) )+'/';
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
			function(it1, data){
				callback( data.contLocalpath );
			}
		]
	);

	return;
}
