/**
 * API: publish
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
				/**
				 * パブリッシュする
				 */
				px2proj.publish({
					"success": function(output){
						console.log(output);
					},
					"complete":function(output){
						it1.next( data );
					}
				});
			},
			function(it1, data){
				callback( data.contLocalpath );
			}
		]
	);

	return;
}
