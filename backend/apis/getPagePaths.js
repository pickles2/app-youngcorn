/**
 * API: getPagePaths
 */
module.exports = function( data, callback, main, socket ){
	delete(require.cache[require('path').resolve(__filename)]);

	var it79 = require('iterate79');
	data.result = {};

	it79.fnc(
		data,
		[
			function( it1, data ){
				main.px2dtLDA.getProject(
					data.projectIdx,
					function( projectInfo ){
						// console.log(main.getPx2Proj);
						main.getPx2Proj( projectInfo, function(px2proj){
							// console.log('message: '+ JSON.stringify(px2proj));
							data.px2proj = px2proj;
							it1.next( data );
						} );
					}
				);
			},
			function( it1, data ){
				data.result.path = data.path;
				it1.next( data );
			},
			function( it1, data ){
				data.px2proj.realpath_files(data.path, '', function(path){
					// console.log(path);
					data.result.realpath_files = path;
					it1.next( data );
				});
			},
			function( it1, data ){
				data.px2proj.path_files(data.path, '', function(path){
					// console.log(path);
					data.result.path_files = path;
					it1.next( data );
				});
			},
			function( it1, data ){
				callback( data.result );
			}
		]
	);
	return;
}
