/**
 * API: showSocketTest
 */
module.exports = function( data, callback, main, socket ){
	// console.log(data);
	alert(data.message);
	// console.log(callback);
	callback(data);
	return;
}
