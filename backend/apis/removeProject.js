/**
 * API: removeProject
 */
module.exports = function( data, callback, main, socket ){
	// delete(require.cache[require('path').resolve(__filename)]);

	main.px2dtLDA.removeProject(
		data.projectIdx ,
		function(pjCd){
			main.px2dtLDA.save( function(result){
				callback(pjCd);
			} );
		}
	);
	return;
}
