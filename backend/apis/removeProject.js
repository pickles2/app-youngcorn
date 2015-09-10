/**
 * API: removeProject
 */
module.exports = function( data, callback, main, socket ){

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
