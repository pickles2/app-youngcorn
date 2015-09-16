/**
 * API: getProjectAll
 */
module.exports = function( data, callback, main, socket ){
	// delete(require.cache[require('path').resolve(__filename)]);
	// console.log('message: '+ JSON.stringify(main));
	main.px2dtLDA.getProjectAll(function(projects){
		callback(projects);
	});
	return;
}
