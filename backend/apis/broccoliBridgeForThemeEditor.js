/**
 * API: broccoliBridgeForThemeEditor
 */
module.exports = function( data, callback, main, socket ){
	delete(require.cache[require('path').resolve(__filename)]);
	var fs = require('fs');
	var path = require('path');
	var it79 = require('iterate79');
	var mkdirp = require('mkdirp');

	data = data||{};
	callback = callback||function(){};
	// console.log(data);

	var Broccoli = require('broccoli-html-editor');
	var broccoli,
		px2proj;

	it79.fnc(data, [
		function(it1, data){
			main.px2dtLDA.getProject(
				data.projectIdx,
				function( projectInfo ){
					// console.log(main.getPx2Proj);
					data.projectInfo = projectInfo;

					main.getPx2Proj( projectInfo, function(_px2proj){
						// console.log('message: '+ JSON.stringify(_px2proj));
						px2proj = _px2proj;

						px2proj.get_config(function(conf){
							// console.log('message: '+ JSON.stringify(conf));
							data.conf = conf;

							px2proj.get_path_homedir(function(path_homedir){
								// console.log('message: '+ JSON.stringify(path_homedir));
								data.path_homedir = path_homedir;
								it1.next(data);
							});
						});
					} );
				}
			);
		} ,
		function(it1, data){
			data.documentRoot = path.resolve(data.path_homedir, 'themes/broccoli')+'/'
			data.realpathDataDir = path.resolve(data.documentRoot, 'guieditor.ignore', './'+data.layout, 'data')+'/';
			data.pathResourceDir = path.resolve('/theme_files/layouts/', './'+data.layout, 'resources')+'/';

			// ディレクトリ作成
			mkdirp(data.realpathDataDir, function(err){
				mkdirp(data.documentRoot+'/'+data.pathResourceDir, function(err){
					it1.next(data);
				});
			});
		} ,
		function(it1, data){
			// データファイル作成
			console.log(fs.existsSync(data.realpathDataDir+'/data.json'));
			if( !fs.existsSync(data.realpathDataDir+'/data.json') ){
				fs.writeFileSync(data.realpathDataDir+'/data.json', '{}');
			}
			it1.next(data);
		} ,
		function(it1, data){
			// console.log(data);
			// console.log(data.conf.plugins.px2dt);

			// broccoli setup.
			broccoli = new Broccoli();

			// console.log(broccoli);
			broccoli.init(
				{
					'paths_module_template': {
						"local": data.documentRoot+'/modules/'
					} ,
					'documentRoot': data.documentRoot,
					'pathHtml': path.resolve('/'+data.layout+'.html'),
					'pathResourceDir': data.pathResourceDir,
					'realpathDataDir': data.realpathDataDir,
					'customFields': {
						'table': require('broccoli-html-editor--table-field'),
						'psd': require('broccoli-psd-field')
					} ,
					'bindTemplate': function(htmls, callback){
						var fin = '';
						fin += '<!DOCTYPE html>'+"\n";
						fin += '<html>'+"\n";
						fin += '	<head>'+"\n";
						fin += '		<title><?= htmlspecialchars( $px->site()->get_current_page_info(\'title_full\') ) ?></title>'+"\n";
						fin += '		<meta charset="UTF-8" />'+"\n";
						fin += '		<meta name="keywords" content="<?= htmlspecialchars($px->site()->get_current_page_info(\'keywords\')); ?>" />'+"\n";
						fin += '		<meta name="description" content="<?= htmlspecialchars($px->site()->get_current_page_info(\'description\')); ?>" />'+"\n";
						fin += ''+"\n";
						fin += '		<!-- Bootstrap -->'+"\n";
						fin += '		<link rel="stylesheet" href="./theme_files/bootstrap/css/bootstrap.css">'+"\n";
						fin += '		<link rel="stylesheet" href="./theme_files/bootstrap/css/bootstrap-theme.css">'+"\n";
						fin += '		<scri'+'pt src="./theme_files/bootstrap/js/bootstrap.js"></scr'+'ipt>'+"\n";
						fin += ''+"\n";
						fin += '		<!-- Custom Styles -->'+"\n";
						fin += '		<link rel="stylesheet" href="./theme_files/styles/theme.css">'+"\n";
						fin += ''+"\n";
						fin += '<?= $px->get_contents_manifesto(); ?>'+"\n";
						fin += '<?= $px->bowl()->pull(\'head\') ?>'+"\n";
						fin += ''+"\n";
						fin += '	</head>'+"\n";
						fin += '	<body data-px2-contents-theme-editor="main">'+"\n";
						for( var bowlId in htmls ){
							fin += htmls[bowlId]+"\n";
						}
						fin += '<?= $px->bowl()->pull(\'foot\') ?>'+"\n";
						fin += '	</body>'+"\n";
						fin += '</html>'+"\n";
						callback(fin);
						return;
					}

				},
				function(){
					it1.next(data);
				}
			);
		} ,
		function(it1, data){
			if(data.api == 'gpiBridge'){
				broccoli.gpi(
					data.bridge.api,
					data.bridge.options,
					function(rtn){
						it1.next(rtn);
					}
				);
				return ;

			}

			setTimeout(function(){
				data.messageByBackend = 'Callbacked by backend API "broccoli".';
				it1.next(data);
			}, 0);
			return;

		} ,
		function(it1, data){
			callback(data);
			it1.next(data);
		}
	]);


	return;
}
