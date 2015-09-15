/**
 * API: getPjModuleList
 */
module.exports = function( data, callback, main, socket ){
	var it79 = require('iterate79');
	var path = require('path');
	var php = require('phpjs');
	var $modules = {};

	// if( !data.config ){
	// 	callback(false);
	// 	return;
	// }
	// try {
	// 	$modules = data.config.plugins.px2dt.paths_module_template;
	// } catch (e) {
	// 	callback(false);
	// 	return;
	// }
	//
	// var rtn = [];
	// main.px2dtLDA.getProject(
	// 	data.projectIdx,
	// 	function( projectInfo ){
	// 		it79.ary(
	// 			$modules,
	// 			function(it1, row, idx){
	// 				console.log(row);
	// 				console.log(idx);
	// 				rtn.push({
	// 					'packageId': idx,
	// 					'realpath': path.resolve( php.dirname(projectInfo.entry_script), row )
	// 				});
	// 				it1.next();
	// 			},
	// 			function(){
	// 				callback(rtn);
	// 			}
	// 		);
	// 	}
	// );

	return;
}
