/**
 * API: getProjectAll
 */
module.exports = function( data, callback, main, socket ){
	// console.log(main);
	main.px2dtLDA.getProjectAll(function(projects){
		callback(projects);
	});
	return;
}
