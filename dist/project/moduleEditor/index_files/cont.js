window.cont = new (function(){
	var _this = this;

	this.init = function(){
		/**
		 * initialize
		 */
		main.init(function(){
			main.it79.fnc({}, [
				function(it1, data){
					console.log('setup env...');
					setTimeout(function(){
						it1.next(data);
					}, 10);
				},
				// function(it1, data){
				// 	// プロジェクト一覧を取得
				// 	main.socket.send('getProjectAll', {}, function(projects){
				// 		data.projects = projects;
				// 		it1.next(data);
				// 	});
				// } ,
				// function(it1, data){
				// 	// プロジェクト一覧を描画
				// 	var tpl = $('#template-projectList').html();
				// 	var $ul = $('<div class="list-group">');
				// 	main.it79.ary(
				// 		data.projects,
				// 		function(it2, row, idx){
				// 			// console.log(row);
				// 			var html =
				// 				twig({data: tpl})
				// 				.render({projectIdx: idx, data: row})
				// 			;
				// 			$ul.append(html);
				// 			it2.next();
				// 		},
				// 		function(){
				// 			$('.cont_project_list').html('').append($ul);
				// 			it1.next();
				// 		}
				// 	);
				// 	console.log(data);
				// 	it1.next(data);
				// } ,
				function(it1, data){
					console.log('Started!');
				}
			]);
		});
	}

})();
