/**
 * API: createNewProject
 */
module.exports = function( data, callback, main, socket ){

	main.px2dtLDA.addProject(
		{
			"name": data.name,
			"path": data.path,
			"entry_script": data.entry_script
		} ,
		function(pjCd){
			main.px2dtLDA.save( function(result){
				callback(pjCd);
			} );
		}
	);
	return;
}
