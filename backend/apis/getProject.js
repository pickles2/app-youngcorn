/**
 * API: getProject
 */
module.exports = function( data, callback, main, socket ){
	// delete(require.cache[require('path').resolve(__filename)]);

	main.px2dtLDA.getProject(
		data.projectIdx,
		function( projectInfo ){
			// console.log(main.getPx2Proj);
			main.getPx2Proj( projectInfo, function(px2proj){
				// console.log('message: '+ JSON.stringify(px2proj));
				px2proj.get_config(function(conf){
					// console.log('message: '+ JSON.stringify(conf));
					px2proj.get_path_homedir(function(path_homedir){
						// console.log('message: '+ JSON.stringify(path_homedir));
						callback( {
							'projectIdx': data.projectIdx ,
							'projectInfo': projectInfo ,
							'config': conf,
							'path_homedir': path_homedir
						} );
					});
				});
			} );
		}
	);
	return;
}
