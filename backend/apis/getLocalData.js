/**
 * API: getLocalData
 */
module.exports = function( data, callback, main, socket ){
	// delete(require.cache[require('path').resolve(__filename)]);

	main.px2dtLDA.getData(
		function( db ){
			callback( db );
		}
	);

	return;
}
