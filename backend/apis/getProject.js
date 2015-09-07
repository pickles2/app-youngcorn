/**
 * API: getProject
 */
module.exports = function( data, callback, main, socket ){
	// console.log('message: '+ JSON.stringify(main));
	main.px2dtLDA.getProject(
		data.projectId,
		function( projectInfo ){
			callback( projectInfo );
		}
	);
	return;
}
