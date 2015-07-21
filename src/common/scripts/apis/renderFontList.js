/**
 * API: renderFontList
 */
window.main.apis.renderFontList = new (function(){

	this.run = function(cmd, socket, main){
		// console.log(cmd);
		var fontlist = cmd.fontlist;
		var template = twig({
			data: $('#template-fontlist-listitem').html()
		});

		var formVals = {};
		formVals.sampleText = ''+$('#mainform input[name=sampleText]').val();
		formVals.keywords = ''+$('#mainform input[name=keywords]').val();
		formVals.starOnly = $('#mainform input[name=starOnly]').prop('checked');

		var $ul = $('.font-list');
		$('.contents').append($ul);

		function searchiIn(keywords, value){
			if(typeof(value) !== typeof('')){return false;}
			var res = value.toLowerCase().indexOf( keywords.toLowerCase() );
			if( res >= 0 ){return true;}
			return false;
		}

		Object.keys(fontlist).forEach(function (idx) {

			var data = fontlist[idx];
			if( !formVals.sampleText.length ){formVals.sampleText=data.originalData.family;}
			if( formVals.starOnly && !data.star ){return;}
			if( formVals.keywords.length ){
				if(
					!searchiIn( formVals.keywords, data.url )
					&& !searchiIn( formVals.keywords, data.comment )
					&& !searchiIn( formVals.keywords, data.originalData.family )
					&& !searchiIn( formVals.keywords, data.originalData.postscriptName )
					&& !searchiIn( formVals.keywords, data.originalData.path )
				){
					return;
				}
			}
			var $output = $(template.render({
				'font': data,
				'sampleText': formVals.sampleText
			}));
			$output.find('.font-list__family a.font-list__btn-detail').click(function(){
				$(this).parent().parent().parent().find('.font-list__property').toggle('slow');
			});
			$output.find('.font-list__family a.font-list__btn-star').click(function(){
				var $this = $(this);
				var postscriptname = $this.parent().parent().parent().attr('data-postscriptname');
				if( !$this.hasClass('star__active') ){
					main.checkStar( postscriptname );
				}else{
					main.uncheckStar( postscriptname );
				}
			});
			$output.find('.font-list__memo input').change(function(){
				var $this = $(this);
				var postscriptname = $this.parent().parent().parent().parent().attr('data-postscriptname');
				main.updateFontInfo( postscriptname, $this.attr('name'), $this.val() );
			});
			$ul.append($output);
			// console.log(data);
		});

	}

})();