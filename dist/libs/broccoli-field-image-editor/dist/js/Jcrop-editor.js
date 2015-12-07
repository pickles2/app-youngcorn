function JcropEditorLib(rectData, editData){
  // onloadの代替
  if($.Jcrop == null){
    setTimeout(JcropEditorLib(rectData, editData),200);
    return;
  }

  $(function($) {
    var startEditor = function($) {
    // $(function($) {
      $trimGrp = $('.jCrop-trim-group');
      var defaultRect = [100, 100, 400, 300];
      var defaultEdit = [];
      // rectData = '{"x":0,"y":0,"w":99,"h":140}';
      var hasRect = false;
      if(rectData != null){
        // defaultRect = [rectData.x, rectData.y, rectData.w, rectData.h];
        // 再編集時のx,y座標は切り捨てる
        defaultRect = [0, 0, rectData.w, rectData.h];
        hasRect = true;
      }
      // editData = [{"x":22,"y":100,"w":77,"h":40,"color":null,"label":null,"url":null,"target":null},{"x":22,"y":73,"w":77,"h":40,"color":null,"label":null,"url":null,"target":null}]
      if(editData != null){
        defaultEdit = editData;
      }
      console.log('defaultRect', defaultRect);
      console.log('defaultEdit', defaultEdit);

      var defaultColor = [
        "#ff7f7f",
        "#ff7fbf",
        "#ff7fff",
        "#bf7fff",
        "#7f7fff",
        "#7fbfff",
        "#7fffff",
        "#7fffbf",
        "#7fff7f",
        "#bfff7f",
        "#ffff7f",
        "#ffbf7f"
      ];
      $('#jCrop-interface').on('cropmove cropend', function(e, s, c) {
        $('#crop-x').val(c.x);
        $('#crop-y').val(c.y);
        $('#crop-w').val(c.w);
        $('#crop-h').val(c.h);
      });
      // Most basic attachment example
      // $('#jCrop-target').Jcrop(); // 初期化
      $('#jCrop-target').Jcrop({
        setSelect: [defaultRect[0], defaultRect[1], defaultRect[2], defaultRect[3]],
        bgOpacity: .35,
        linked: false,
        multi: false
      }, function() {
        this.container.addClass('jcrop-dark jcrop-hl-active');
        interface_load(this);
      });

      function interface_load(obj) {
        cb = obj;
        init();
      }

      // ヒアドキュメント
      var uHereDoc = function(str) {
        return str.replace(/^function\s?\(\)\s?\{\/\*/gi, "").replace(/\*\/;?\}$/gi, "");
      };

      var changeRect = function() {
        $('#jCrop-target').Jcrop('api').animateTo([
          parseInt($('#crop-x').val()),
          parseInt($('#crop-y').val()),
          parseInt($('#crop-w').val()),
          parseInt($('#crop-h').val())
        ])
      }

      $('#text-inputs').on('change', 'input', changeRect);

      // 初期化
      function init() {
        // コピーを作成
        var org_canvas = $("#jCrop-original-canvas")[0];
        if (!org_canvas || !org_canvas.getContext) {
          return false;
        }
        var org_ctx = org_canvas.getContext('2d');
        var img = $("#jCrop-target")[0];
        var img_real_w, img_real_h;
        $("<img/>") // Make in memory copy of image to avoid css issues
          .attr("src", $(img).attr("src"))
          .load(function() {
            img_real_w = this.width; // Note: $(this).width() will not
            img_real_h = this.height; // work for in memory images.

            if(hasRect){
              $('#jCrop-rect').val(JSON.stringify(rectData));
              // TODO 再編集用元オリジナル画像はクライアント側で実装した。
            }else{
              // 画像サイズ
              var data = {
                "x": 0,
                "y": 0,
                "w": img_real_w,
                "h": img_real_h,
              };
              $('#jCrop-rect').val(JSON.stringify(data));
              /* 画像を描画 */
              $(org_canvas).attr('width', img_real_w);
              $(org_canvas).attr('height', img_real_h);
              org_ctx.drawImage(img, 0, 0, img_real_w, img_real_h);
              $('#jCrop-imgBase64').val(org_canvas.toDataURL());
            }
          });
      }

      // 再描画
      function reDraw(data) {

        var canvas = $("#jCrop-work-canvas")[0];
        if (!canvas || !canvas.getContext) {
          return false;
        }
        var ctx = canvas.getContext('2d');
        var img = $("#jCrop-target")[0];
        var img_real_w, img_real_h;
        $("<img/>") // Make in memory copy of image to avoid css issues
          .attr("src", $(img).attr("src"))
          .load(function() {
            img_real_w = this.width; // Note: $(this).width() will not
            img_real_h = this.height; // work for in memory images.
            console.log(img_real_w, img_real_h);

            $('#jCrop-interface').css({'width': img_real_w,'height': img_real_h});
            $('.jCrop-origin-imgSize').css({'width': img_real_w,'height': img_real_h});

            //リサイズした画像
            $('#jCrop-work-canvas').attr('width', data.w);
            $('#jCrop-work-canvas').attr('height', data.h);

            ctx.drawImage(img,
              data.x, data.y, data.w, data.h,
              0, 0, data.w, data.h);

            console.log(canvas.toDataURL());
            $('#jCrop-imgBase64').val(canvas.toDataURL());
            $trimGrp.toggleClass("isCroped");
            // ;.fadeIn("slow");
          });
      }
      // 切り取りボタン
      $('.jCrop-trim').on('click', function() {

        var data = {
          "x": parseInt($('#crop-x').val()),
          "y": parseInt($('#crop-y').val()),
          "w": parseInt($('#crop-w').val()),
          "h": parseInt($('#crop-h').val()),
        };
        reDraw(data);
        $('#jCrop-rect').val(JSON.stringify(data));
      });
      // 最小
      $('.jCrop-minimum').on('click', function() {
        $('#crop-x').val(parseInt($("#jCrop-interface .jcrop-active").css('width')) / 2);
        $('#crop-y').val(parseInt($("#jCrop-interface .jcrop-active").css('height')) / 2);
        $('#crop-w').val(0);
        $('#crop-h').val(0);
        changeRect();
      });
      // 最大
      $('.jCrop-maximum').on('click', function() {
        $('#crop-x').val(0);
        $('#crop-y').val(0);
        $('#crop-w').val(parseInt($("#jCrop-interface .jcrop-active").css('width')));
        $('#crop-h').val(parseInt($("#jCrop-interface .jcrop-active").css('height')));
        changeRect();
      });
      // 横中央
      $('.jCrop-horizontal-center').on('click', function() {
        var x1 = parseInt($("#jCrop-interface .jcrop-active").css('width'));
        var x2 = $('#crop-w').val();
        $('#crop-x').val((x1 - x2) / 2);
        changeRect();
      });
      // 縦中央
      $('.jCrop-vertical-middle').on('click', function() {
        var y1 = parseInt($("#jCrop-interface .jcrop-active").css('height'));
        var y2 = $('#crop-h').val();
        $('#crop-y').val((y1 - y2) / 2);
        changeRect();
      });
      // 中央
      $('.jCrop-center').on('click', function() {
        var x1 = parseInt($("#jCrop-interface .jcrop-active").css('width'));
        var x2 = $('#crop-w').val();
        $('#crop-x').val((x1 - x2) / 2);
        var y1 = parseInt($("#jCrop-interface .jcrop-active").css('height'));
        var y2 = $('#crop-h').val();
        $('#crop-y').val((y1 - y2) / 2);
        changeRect();
      });
      // 横分割
      $('.jCrop-hSplit').on('click', function() {
        var sc = parseInt(prompt("分割数は？",2));
        var x3 = parseInt($('#crop-w').val() / sc);
        $('#crop-w').val(x3);
        function loop(){
          changeRect();
          setTimeout(function(){
            $('.jCrop-addLink').click();
            $('#crop-x').val(parseInt($('#crop-x').val()) + x3);
            if(--sc > 0){
              loop();
            }
          }, 900);
        }
        loop();
      });
      // 縦分割
      $('.jCrop-vSplit').on('click', function() {
        var sc = parseInt(prompt("分割数は？",2));
        var x3 = parseInt($('#crop-h').val() / sc);
        $('#crop-h').val(x3);
        function loop(){
          changeRect();
          setTimeout(function(){
            $('.jCrop-addLink').click();
            $('#crop-y').val(parseInt($('#crop-y').val()) + x3);
            if(--sc > 0){
              loop();
            }
          }, 900);
        }
        loop();
      });

      // 切り取り解除ボタン
      $('.jCrop-reset-trim').on('click', function() {
        var img = $("#jCrop-target")[0];
        $('.jcrop-selection').css({
          top: '50%',
          left: '50%',
          width: '0px',
          height: '0px'
        });
        var img_real_w, img_real_h;
        $("<img/>") // Make in memory copy of image to avoid css issues
          .attr("src", $(img).attr("src"))
          .load(function() {
            img_real_w = this.width; // Note: $(this).width() will not
            img_real_h = this.height; // work for in memory images.

            $('#crop-x').val(0);
            $('#crop-y').val(0);
            $('#crop-w').val(img_real_w);
            $('#crop-h').val(img_real_h);
            // 切り取り
            $('.jCrop-trim').click();

            // リサイズ
            changeRect();
          });
      });

      var linkHTML = uHereDoc((function() {/*
        <li class="<%= linkId %>" style="list-style:none;padding:5px;">
          <div style="display: table; width: 100%;" >
            <label class="input-group" style="display: table-cell; width: 5%; box-sizing:border-box;padding-left:5px;">
              <input type="color" name="color" value="<%= color %>"  style=" width: 18px; padding: 0; margin: 0; border: 0; border-radius: 50%; height: 20px; line-height: 20px; background-color: transparent;">
            </label>
            <label class="input-group" style="display: table-cell; width: 30%; box-sizing:border-box;padding-left:5px;"><b>ラベル:</b>
              <input type="text" name="linkName" value="<%= linkName %>" style="width: 70%;">
            </label>
            <label class="input-group" style="display: table-cell; width: 50%; box-sizing:border-box;padding-left:5px;"><b>URL:</b>
              <input type="text" name="linkURL" value="<%= linkURL %>" style="width: 90%;">
            </label>
            <label class="input-group" style="display: table-cell; width: 15%; box-sizing:border-box;padding-left:5px;"><b>_blank:</b>
              <input type="checkbox" name="linkTarget" <%= linkTarget %> style="width: 90%;">
            </label>
          </div>
          <form onsubmit="return false;" style="display:inline;">
            <label><b>X:</b><input type="text" name="cx" class="span1" style="width:4em; border:0;" value="<%= X %>" readonly></label>
            <label><b>Y:</b><input type="text" name="cy" class="span1" style="width:4em; border:0;" value="<%= Y %>" readonly></label>
            <label><b>W:</b><input type="text" name="cw" class="span1" style="width:4em; border:0;" value="<%= W %>" readonly></label>
            <label><b>H:</b><input type="text" name="ch" class="span1" style="width:4em; border:0;" value="<%= H %>" readonly></label>
            <a class="jCrop-update button-S">更新</a>
            <a class="jCrop-delete button-S">削除</a>
          </form>
        </li>
  */}).toString());
      var htmlTmpl = _.template(linkHTML);

      // リンク追加
      $('.jCrop-addLink').on('click', function(e) {
        var $jcrop_current_style = $('.jcrop-current')[0].style;
        var dt = (new Date().getTime());
        var linkClass = "jCrop-link-" + dt;
        var linkName = $('.jCrop-link-group input[name="linkName"]').val();
        var color = defaultColor[$('#jCrop-link li').length % defaultColor.length];
        var url = $('.jCrop-link-group input[name="linkURL"]').val();
        if (url === '') url = "#" + $('#jCrop-link li').length;
        var html = htmlTmpl({
          'color': color,
          'linkId': linkClass,
          'linkName': linkName,
          'linkURL': url,
          'linkTarget': "",
          'X': parseInt($jcrop_current_style.left),
          'Y': parseInt($jcrop_current_style.top),
          'W': parseInt($jcrop_current_style.width),
          'H': parseInt($jcrop_current_style.height)
        });
        $('#jCrop-link').append($(html));
        console.log(html);


        // エリア表示
        $('#jCrop-link li').on('click', function() {
          $('#crop-x').val($(this).find('input[name="cx"]').val());
          $('#crop-y').val($(this).find('input[name="cy"]').val());
          $('#crop-w').val($(this).find('input[name="cw"]').val());
          $('#crop-h').val($(this).find('input[name="ch"]').val());

          // リサイズ
          changeRect();
          bgFlash($(this), 'lightgreen');
        });
        // 更新
        $('.jCrop-update').on('click', function(e) {
          // e.stopPropagation();
          var $jcrop_current_style = $('.jcrop-current')[0].style;
          $parntLi = $(this).parents('#jCrop-link li');
          $parntLi.find('input[name="cx"]').val(parseInt($jcrop_current_style.left));
          $parntLi.find('input[name="cy"]').val(parseInt($jcrop_current_style.top));
          $parntLi.find('input[name="cw"]').val(parseInt($jcrop_current_style.width));
          $parntLi.find('input[name="ch"]').val(parseInt($jcrop_current_style.height));
          console.log("upd");

          showClickable();
          bgFlash($parntLi, 'lightpink');

        });
        // 削除
        $('.jCrop-delete').on('click', function() {
          console.log($(this).parents('#jCrop-link li').remove());
          showClickable();
        });

        // イベントの伝播抑制
        $('#jCrop-link input').on('click', function(e){
          e.stopPropagation();
          console.log(this, e);
        });

        $('#jCrop-link input[type="color"]').on('change', function(e){
          showClickable();
        });

        // クリックエリア表示
        showClickable();
      });
      // $('.jCrop-delete').on('click', function(){});

      // 切り取り確定
      $('.jCrop-commit').on('click', function() {
        // console.log($(this).parents('#jCrop-link li').remove());
        // 元キャンバスに反映
        var main_canvas = $("#jCrop-interface canvas")[0];
        var main_ctx = main_canvas.getContext('2d');
        var work_canvas = $("#jCrop-work-canvas")[0];
        $("<img/>").attr("src", work_canvas.toDataURL())
          .load(function() {
            $('.jcrop-shades').empty();
            // 元画像サイズに広げる
            $('#crop-x').val(0);
            $('#crop-y').val(0);
            $('#crop-w').val(work_canvas.width);
            $('#crop-h').val(work_canvas.height);

            // main_canvas.width = work_canvas.width;
            // main_canvas.height = work_canvas.height;
            $(main_canvas).attr('width', work_canvas.width);
            $(main_canvas).attr('height', work_canvas.height);
            $("#jCrop-interface .jcrop-active").css({
              width: work_canvas.width
            });
            $("#jCrop-interface .jcrop-active").css({
              height: work_canvas.height
            });

            main_ctx.drawImage($(this)[0], 0, 0);
            $trimGrp.toggleClass("isFixed");

            // リサイズ
            changeRect();

            // 変更フラグ
            $elem = $("[data-broccoli-edit-window-field-name='image_src']");
            $elem.data('isChanged', true);
          })
      });

      // 元画像から画像を読み込み
      $('.jCrop-restore').on('click', function() {
        // console.log($(this).parents('#jCrop-link li').remove());
        // 元キャンバスに反映
        var main_canvas = $("#jCrop-interface canvas")[0];
        var main_ctx = main_canvas.getContext('2d');
        var origin_canvas = $("#jCrop-original-canvas")[0];
        $("<img/>").attr("src", origin_canvas.toDataURL())
          .load(function() {
            // 元画像サイズに広げる
            $('#crop-x').val(0);
            $('#crop-y').val(0);
            $('#crop-w').val(origin_canvas.width);
            $('#crop-h').val(origin_canvas.height);

            // メインcanvasを更新
            $(main_canvas).attr('width', origin_canvas.width);
            $(main_canvas).attr('height', origin_canvas.height);
            $("#jCrop-interface .jcrop-active").css({
              width: origin_canvas.width
            });
            $("#jCrop-interface .jcrop-active").css({
              height: origin_canvas.height
            });

            // 元画像復元
            $("#jCrop-target").attr('src', $(this)[0].src);

            main_ctx.drawImage($(this)[0], 0, 0);
            $trimGrp.removeClass("isCroped isFixed");

            // $trimGrp.toggleClass("isCroped");
            // リサイズ
            changeRect();
          })
      });

      var bgFlash = function($ele, color) {
        $ele.animate({
          backgroundColor: color
        }, 'fast', function() {
          console.log($(this));
          $(this).animate({
            backgroundColor: 'rgba(255, 255, 255, 255)'
          }, 'fast');
        });
      }

      // エリアの色付き表示
      var showClickable = function() {
        // 以前のエリアを破棄
        $('.jcrop-active').find('.jCrop-clickablearia').remove();
        if (!$('.jCrop-showClickable').prop('checked')) {
          $('.jCrop-showClickable + a').removeClass('btn_icon_eye_on').addClass('btn_icon_eye_off');
          return;
        }else{
          $('.jCrop-showClickable + a').removeClass('btn_icon_eye_off').addClass('btn_icon_eye_on');
        }

        var areaHTML = uHereDoc((function() {/*
          <div class="jCrop-clickablearia" style="position: absolute;background-color: <%= color %>;top: <%= y %>; left: <%= x %>; width: <%= w %>; height: <%= h %>; border: 0;text-align: center;">
            <span style=" position: absolute; top: 0; left: 0; right: 0; bottom: 0; margin: auto; height: 1.2em; line-height: 1.2; color: white;
            "><%= labelName %></span>
    */}).toString());
        var htmlTmpl = _.template(areaHTML);

        $.each($('#jCrop-link li'), function(i, val) {
          $this = $(this);
          var labelName = $this.find('input[name="linkName"]').val();
          if (labelName === '') {
            // ラベルが空の場合はURLを入れる
            labelName = $this.find('input[name="linkURL"]').val()
          }
          var color = $this.find('input[type="color"]').val();
          color = new RGBColor(color).toRGB().replace('rgb(', 'rgba(').replace(')', ', 0.2)'); // rgbaに変換, 透過度設定
          var data = {
            'color': color,
            'labelName': labelName,
            'x': $this.find('input[name="cx"]').val() + "px",
            'y': $this.find('input[name="cy"]').val() + "px",
            'w': $this.find('input[name="cw"]').val() + "px",
            'h': $this.find('input[name="ch"]').val() + "px"
          };
          console.log(data);
          var html = htmlTmpl(data);

          $('.jcrop-active').append($(html));

        });
      }
      $('.jCrop-showClickable').on('click', function() {
        showClickable();
      });

      // キャンパスサイズ変更
      var fixed = function(){
        console.log('fixed');
        var main_canvas = $("#jCrop-interface canvas")[0];
        var max_x = $(main_canvas).attr('width');
        var max_y =$(main_canvas).attr('height');
        var isCheck = true;
        $.when(
          $.each($('.jcrop-active .jCrop-clickablearia'), function(i, val){
            $this = $(this);
            var xw = parseInt($this.css('left')) + parseInt($this.css('width'));
            var yh = parseInt($this.css('top')) + parseInt($this.css('height'));
            console.log(xw +  '>' + max_x + '||' +  yh + '>' + max_y);
            if(xw > max_x || yh >max_y){
              isCheck = false;
              return;
            }
          })
        ).done(function(){
          // console.log('完了');
          // console.log('isCheck',isCheck);
           $('#jCrop-interface').css({'width':'', 'height':''});
        });
      }

      // 自動調節（画像からはみ出したエリアのリサイズ）
      $('.jCrop-autofix').on('click', function() {
        var $li = $('#jCrop-link li');
        var action = function($li, i){
          console.log("i",i);
          function listClick(){
           console.log("ii",i);
           var main_canvas = $("#jCrop-interface canvas")[0];
           var max_x = $(main_canvas).attr('width');
           var max_y =$(main_canvas).attr('height');
           var x = parseInt($li.eq(i).find('input[name="cx"]').val()); if(x > max_x) x = max_x - 5;
           var y = parseInt($li.eq(i).find('input[name="cy"]').val()); if(y > max_y) y = max_y - 5;
           var w = parseInt($li.eq(i).find('input[name="cw"]').val()); var xw = x + w; if(xw > max_x) w = w - (xw - max_x);
           var h = parseInt($li.eq(i).find('input[name="ch"]').val()); var yh = y + h; if(yh > max_y) h = h - (yh - max_y);
           function updateClick(){
             console.log("iii",i);
             setTimeout(function(){
                console.log($li.eq(i).find('.jCrop-update'));
                function nextCursor(){
                   if(i < $li.length){
                    action($li, ++i);// loop
                   }else{
                    fixed();
                   }
                 }
                $li.eq(i).find('.jCrop-update').click(); // <-コールバックにfnを渡しても実行されない？
                nextCursor()
            //  }, 900 * (i + 1));
             }, 900);
            }
            $('#jCrop-target').Jcrop('api').animateTo([x, y, w, h], updateClick());
          }
          $li.eq(i).click(listClick());
       }
       action($li, 0)
      });

      // モーダルウィンドウで閉じるのを抑制
      $('button').on('click', function(e) {
        e.stopPropagation();
      });

      // 編集データロード
      {
        $.each(defaultEdit, function(i, v){
          var data = defaultEdit[i];
          var $jcrop_current_style = $('.jcrop-current')[0].style;
          var dt = (new Date().getTime());
          var linkClass = "jCrop-link-" + dt;
          // var linkName = $('.jCrop-link-group input[name="linkName"]').val();
          // if (linkName === '') linkName = dt;
          // var color = defaultColor[$('#jCrop-link li').length % defaultColor.length];
          var target = "";
          if(data.target){target= "checked"}
          var listHtml = htmlTmpl({
            'color': data.color,
            'linkId': linkClass,
            'linkName': data.label,
            'linkURL': data.url,
            'linkTarget': target,
            'X': data.x,
            'Y': data.y,
            'W': data.w,
            'H': data.h
          });
          console.log('$(listHtml)', $(listHtml)[0]);
          var $listHtml = $(listHtml);
          $('#jCrop-link').append($listHtml);
          $listHtml.on('click', function(e){
            e.stopPropagation();
            console.log('done live click', e);
            var _target = e.currentTarget;
            $('#crop-x').val($(_target).find('input[name="cx"]').val());
            $('#crop-y').val($(_target).find('input[name="cy"]').val());
            $('#crop-w').val($(_target).find('input[name="cw"]').val());
            $('#crop-h').val($(_target).find('input[name="ch"]').val());
            changeRect();
          });
          // 更新
          $listHtml.on('click','.jCrop-update', function(e) {
            e.stopPropagation();
            var $jcrop_current_style = $('.jcrop-current')[0].style;
            $parntLi = $(this).parents('#jCrop-link li');
            $parntLi.find('input[name="cx"]').val(parseInt($jcrop_current_style.left));
            $parntLi.find('input[name="cy"]').val(parseInt($jcrop_current_style.top));
            $parntLi.find('input[name="cw"]').val(parseInt($jcrop_current_style.width));
            $parntLi.find('input[name="ch"]').val(parseInt($jcrop_current_style.height));
            console.log("upd");

            showClickable();
            bgFlash($parntLi, 'lightpink');

          });
          // 削除
          $listHtml.on('click','.jCrop-delete', function(e) {
            e.stopPropagation();
            console.log($(this).parents('#jCrop-link li').remove());
            showClickable();
          });
          console.log('defaultEdit load', i);
        });
        showClickable();
      }
    }

    startEditor($);
  });
}
