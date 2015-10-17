/**
 * API: getSitemap
 */
module.exports = function( data, callback, main, socket ){
	delete(require.cache[require('path').resolve(__filename)]);

	main.px2dtLDA.getProject(
		data.projectIdx,
		function( projectInfo ){
			// console.log(main.getPx2Proj);
			main.getPx2Proj( projectInfo, function(px2proj){
				// console.log('message: '+ JSON.stringify(px2proj));
				px2proj.get_sitemap(function(sitemap){
					// console.log('message: '+ JSON.stringify(sitemap));
					callback( {
						'projectIdx': data.projectIdx ,
						'projectInfo': projectInfo ,
						'sitemap': sitemap
					} );
				});
			} );
		}
	);
	return;
}
