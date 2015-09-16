/**
 * API: getPjModulePkgList
 */
module.exports = function( data, callback, main, socket ){
	// delete(require.cache[require('path').resolve(__filename)]);
	var it79 = require('iterate79');
	var path = require('path');
	var php = require('phpjs');
	var fs = require('fs');
	var $modules = {};

	if( !data.config ){
		callback(false);
		return;
	}
	try {
		$modules = data.config.plugins.px2dt.paths_module_template;
	} catch (e) {
		callback(false);
		return;
	}

	var rtn = [];
	main.px2dtLDA.getProject(
		data.projectIdx,
		function( projectInfo ){
			it79.ary(
				$modules,
				function(it1, row, idx){
					var realpath = path.resolve( php.dirname(projectInfo.path+'/'+projectInfo.entry_script), row )+'/';
					var infoJson = {};
					try {
						infoJson = JSON.parse(fs.readFileSync( realpath+'info.json' ));
					} catch (e) {
						infoJson = {};
					}
					rtn.push({
						'packageId': idx,
						'packageName': (infoJson.name || idx),
						'realpath': realpath,
						'infoJson': infoJson
					});
					it1.next();
				},
				function(){
					callback(rtn);
				}
			);
		}
	);

	return;
}
