var RES={Bs: {}, Save: {}, Sec: [], Fdata: {},
//
// begin トリガー
//
  begin: function(op){
    var me=this; op=op||{};

    if(op.loadConfig){op=me.loadConfig(op);}
    $(window).on('load', function(){
      
      me.config(op, 'init'); me.section('init');
      me.depend(); me.image('init'); me.hide(); me.cell(); me.section('padding');
      me.zone(); me.body('init');
      me.section('position');
      me.another('init');
      me.footer('init');

      $(window).on('resize', function(){
        me.config();
        me.carousel('image'); me.tabs('cont'); me.accordion('cont');
        me.depend(); me.image(); me.hide(); me.cell(); me.section('padding');
        me.zone(); me.body();
        me.map('cont');
        me.another('cont');
        me.footer();
        me.Save.mode=me.Bs.mode;
      });

      $(window).on('scroll', function(){
        var pos=me.scroll(); me.footer('cont', pos); me.section('indicator', pos);
        me.modal('reset');
      });

      me.photoUp(); me.tipup(); me.carousel('init'); me.tabs('init'); me.accordion('init');
      me.map('init'); me.rollover(); me.modal('init');

      me.Save.mode=me.Bs.mode;

    });
  },
//
// config　初期設定
//
  config: function(op, mode){
    var me=this;

    if(mode=='init'){
      me.Bs.minPc=op.minPc||750;              // PC表示最小幅
      me.Bs.maxPc=op.maxPc||1200;             // PC表示最大幅
      me.Bs.width=op.width||1050;             // 設計基本幅(パソコン)
      me.Bs.widthMobile=op.widthMobile||400;  // 設計基本幅(モバイル)
      me.Bs.main=op.maxMain||800;             // 設計基本メイン幅
      me.Bs.minSide=op.minSide||200;          // 最小サイド幅
      me.Bs.animate=op.animate||1000;         // 基本アニメートタイム
      me.Bs.interval=op.interval||2000;       // 基本インターバルタイム
      me.Bs.opacity=op.opacity||0.7;          // 基本透過度
      me.Bs.cellPc=op.cellPc||200;            // Pcセル幅
      me.Bs.cellMobile=op.cellMobile||120;    // Mobileセル幅
      op.image=op.image||{}; me.Bs.image=op.image;
      me.Bs.image.pc=me.Bs.image.pc||600;     // PC基本イメージ幅
      me.Bs.image.mobile=me.Bs.image.mobile||300; // mobile基本イメージ幅
      me.Bs.image.fixPc=me.Bs.image.fixPc||600;
      me.Bs.image.fixmobile=me.Bs.image.fixMobile||300;
      op.carousel=op.carousel||{}; me.Bs.carousel=op.carousel;
      me.Bs.carousel.width=op.carousel.width||'auto';  // Pcカルーセル幅
      me.Bs.carousel.pc=op.carousel.pc||300;  // Pcカルーセル画像幅
      me.Bs.carousel.mobile=op.carousel.mobile||200; // Mobileカルーセル画像幅
      me.Bs.carousel.num=op.carousel.num||3;  // カルーセル表示個数
      me.Bs.carousel.direction=op.carousel.direction||'H';  // カルーセル移動方向
      me.Bs.carousel.animate=op.carousel.animate||me.Bs.animate;
      me.Bs.carousel.interval=op.carousel.interval||me.Bs.interval;
      me.Bs.carousel.priority=op.carousel.priority||'width'; //優先順位, width, num
      me.Bs.tabs=op.tabs||{};
      me.Bs.accordion=op.accordion||{};
      me.Bs.map=op.map||{};
      op.footer=op.footer||{}; me.Bs.footer=op.footer||{};
      me.Bs.footer.remain=op.footer.remain||0;
      me.Bs.footer.rate=op.footer.rate||80;
      me.Bs.footer.animate=op.footer.animate||me.Bs.animate;
      op.tipup=op.tipup||{}; me.Bs.tipup=op.tipup;
      me.Bs.tipup.xdiff=me.Bs.tipup.xdiff||30;
      me.Bs.tipup.ydiff=me.Bs.tipup.ydiff||30;
      me.Bs.animateScroll=op.animateScroll||op.animate;
    }
    me.Bs.wwi=$(window).width();
    me.Bs.mode='pc';                          // 現状モード
    if(me.Bs.wwi<me.Bs.minPc){me.Bs.mode='mobile';} if(me.Bs.wwi>me.Bs.maxPc){me.Bs.mode='wide';}
    if(me.Bs.mode=='wide'){me.Bs.wwi=me.Bs.maxPc;}else{me.Bs.wwi=$('body').outerWidth();}
    
    if(me.Bs.mode=='mobile'){
      me.Bs.scale=me.Bs.wwi/me.Bs.widthMobile;
    }else{
      me.Bs.scale=me.Bs.wwi/me.Bs.width;      // 現状スケール
    }

  },
//
// loadConfig　サーバーからの自動設定
//
  loadConfig: function(op){
    var me=this; var m, e, out; op=op||{}; if(!op.loadConfig){return;}
    
    m='/config/'+location.pathname; e=$(this);
    $.ajax({async: false, url: m, success: function(data){
      out=JSON.parse(data); for(i in op){out[i]=op[i];}
    }});
    return out;
  },
//
// zone: Content, Sideゾーン制御
//ok
  zone: function(){
    var me=this; var d; var wm, ws, wi;

    if(me.Bs.mode=='wide'){wi=me.Bs.maxPc;}else{wi=$('body').outerWidth();}

    if(me.Bs.mode=='mobile'){
      wm=$(window).width();
      $('#Side').css({display: 'none'}); me.css('#Content', {outerWidth: wm});
    }else{
      if(wi-me.Bs.minSide>me.Bs.maxMain){ws=wi-me.Bs.maxMain;}else{ws=me.Bs.minSide;}
      wm=wi-ws;
      me.css("#Content", {position: "absolute", top: 0, left: 0, outerWidth: wm});
      me.css("#Side", {display: 'block', position: "absolute", top: 0, left: wm+"px", outerWidth: ws});
    }
  },
//
// body フレームワーク
//
  body: function(mode){
    var me=this; var hi, wi, f, x, lf, r, top, fixed, tag, main, area=true;

    lf=0;
    if(me.Bs.mode=='wide'){
      lf=Math.floor(($(window).width()-me.Bs.maxPc)/2);
      wi=me.Bs.maxPc;
    }else{
      wi=$('body').outerWidth();
    }
 
    var h1=$('#Content').outerHeight(); var h2=$('#Side').outerHeight();
    if(h1<h2){h1=h2;}
    me.css($('#Side'), {outerHeight: h1}); me.css($('#Content'), {outerHeight: h1});
    main=h1;

    me.Bs.shrinkHeight=0; me.Save.fixedTop=0; top=0; fixed=0;
    $('body').children().each(function(){
      $(this).css({height: 'auto'});
      if($(this).css('display')=='none'){hi=0;}else{hi=$(this).outerHeight();}
      tag=$(this)[0].localName;
      switch($(this).attr('pos')){
       case 'Fix':
        $(this).css({
          'z-index': 500, position: 'fixed', top: top+'px', left: lf+'px',
          width: wi+'px', height: hi+'px'
        });
        top=top+hi; me.Save.fixedTop+=hi; fixed=fixed+hi;
        break;
       case 'Behind':
        $(this).css({
          'z-index': 0, position: 'fixed', top: top+'px', left: lf+'px',
          width: wi+'px', height: hi+'px'
        });
        top=top+hi; me.Bs.shrinkHeight+=hi;
        break;
       case 'Parallax':
        $(this).css({
          'z-index': 0, position: 'absolute', top: top+'px', left: lf+'px',
          width: wi+'px', height: hi+'px'
        });
        $(this).attr('save', top); top=top+hi; me.Bs.shrinkHeight+=hi;
        break;
       case 'Remain':
        $(this).css({
          'z-index': 500, position: 'absolute', top: top+'px', left: lf+'px',
          width: wi+'px', height: hi+'px'
        });
        $(this).attr('save', top); top=top+hi;
        $(this).attr('fixed', fixed); fixed=fixed+hi; me.Save.fixedTop+=hi;
        break;
       default:
        if(tag=='main'){hi=main;}
        if(area){
          $(this).css({
            'z-index': 1, position: 'absolute', top: top+'px', left: lf+'px',
            width: wi+'px', height: hi+'px'
          });
          $(this).attr('save', top);
          top=top+hi;
        }
      }
      if(tag=='footer'){
        if(me.Bs.footer.remain>0){
          $('main').css({height: $('main').outerHeight()+$('footer').outerHeight()+'px'});
        }
        area=false;
      }
    });

  },
//
// scroll スクロール移動
//
  scroll: function(){
    var me=this; var t, n, d;
    
    var p=$(window).scrollTop();
    $('body').children().each(function(){
      switch($(this).attr('pos')){
       case 'Parallax':
        t=$(this).attr('save')-0; n=t+(p/2); $(this).css({top: n+'px'});
        break;
       case 'Remain':
        t=$(this).attr('save')-0; d=$(this).attr('fixed')-0;
        if(p>t-d){n=p+d}else{n=t;} $(this).css({top: n+'px'});
        break;
      }
    });
    return p;    
  },
//
// footer フッタの位置調整
//
  footer: function(mode, pos){
    var me=this;
    var t, h, l, w={};

    if(mode=='init'){
      $('footer').css({'z-index': 700});
      $('#Menu').on('click', function(){
        $('footer').css({top: $('body').scrollTop()});
        $('footer').attr('saveleft', $('footer').css('margin-left'));
        me.modal('set', function(){
          var l=$('footer').attr('saveleft');
          $('footer').animate({'margin-left': l}, me.Bs.footer.animate);
        });
        $('footer').animate({'margin-left': 0}, me.Bs.footer.animate);
        $('footer').attr('ix', 1);
      });
      me.Fdata.footer={area: $('footer'), mode: 'hide', modal: true};
      me.flick(me.Fdata.footer);

      if(me.Bs.footer.remain){
        $("#FTlabel").on('click', function(){if(me.Bs.mode!='mobile'){
          t=$('footer').attr("savetop")-0;
          if(t){
            $('footer').stop(); $("footer").animate({top: t+"px"}, me.Bs.footer.animate);
            $('footer').attr("savetop", 0);
          }else{
            t=$('footer').position().top-0; $('footer').attr("savetop", t);
            t=$('footer').position().top-0-$('footer').outerHeight()+me.Bs.footer.remain;
            $('footer').stop(); $("footer").animate({top: t+"px"}, me.Bs.footer.animate);
          }
        }});
      }

    }

    if(me.Bs.mode=='mobile'){
      if(mode!='init'){$('footer').removeClass('pc');} $('footer').addClass('mobile');

      h=$(document).outerHeight(); l=Math.floor($(window).outerWidth()*me.Bs.footer.rate/100);
      $('footer').css({
        top: 0, 'margin-left': -l+'px', width: l+'px', height: h+'px', 'z-index': 700
      });
      $('footer').attr('min', 0); $('footer').attr('max', h);
      me.modal('clear');

    }else{
      if(mode!='init'){$('footer').removeClass('mobile');} $('footer').addClass('pc');

      w.ypos=pos+$(window).height()-me.Bs.shrinkHeight;
      w.limit=$('footer').attr('save')-0-me.Bs.shrinkHeight;
      w.usual=$(window).height()-me.Bs.footer.remain;
      if(me.Bs.footer.remain==0 || w.limit<w.ypos){
        $('footer').css({
          position: 'absolute', top: $('footer').attr('save')+'px', width: me.Bs.wwi+'px',
          'margin-left': 0
        });
      }else{
        $('footer').css({position: 'fixed', top: w.usual+'px', 'margin-left': 0});
      }
    }

  },
//
// depend: Dependクラス対応
//ok
  depend: function(){
    var me=this; if(me.Bs.mode==me.Save.mode){return;}
    
    $('.Depend').each(function(){
      var f; if(me.Bs.mode=='mobile'){f=$(this).attr('mobile');}else{f=$(this).attr('pc');}
      if(f){$(this).attr('src', f);}
    });

  },
//
// hide Pc, Mobile クラス対応
//ok
  hide: function(){
    var me=this; if(me.Bs.mode==me.Save.mode){return;}
    
    if(me.Bs.mode=='mobile'){
      $('.Pc').each(function(){$(this).css({display: 'none'});});
      $('.Mobile').each(function(){$(this).css({display: 'block'});});
    }else{
      $('.Pc').each(function(){$(this).css({display: 'block'});});
      $('.Mobile').each(function(){$(this).css({display: 'none'});});
    }
  },
//
// image: 画像大きさ制御
//
  image: function(mode){
    var me=this; var w, e, p, obj={};
    
                                            // 全幅
    $('.PhotoF').each(function(){$(this).css({width: me.Bs.wwi+'px'});});
                                            // 親幅幅合わせ
    $(".PhotoP").each(function(){
      w=0; e=$(this);
      while(w==0){
        e=e.parent();
        if(e[0].tagName=='DIV' || e[0].tagName=='SECTION' ||
           e[0].tagName=='HEADER' || e[0].tagName=='FOOTER' || e[0].tagName=='NAV'){w=e.width();}
        if(w!=0){$(this).css({width: w+'px'});}
        if(e[0].tagName=='BODY'){w=-1;}
      }
    });
                                            // 縮尺比例
    $('.PhotoS').each(function(){
      if(me.Bs.mode=='mobile'){
        w=Math.floor(me.Bs.image.mobile*me.Bs.scale); $(this).css({width: w+'px'});
      }else{
        w=Math.floor(me.Bs.image.pc*me.Bs.scale); $(this).css({width: w+'px'});
      }
    });
                                            // モバイル100%
    $('.PhotoM, .PhotoU').each(function(){
      if(me.Bs.mode=='mobile'){w='100%';}else{w='auto';}
      $(this).css({width: w});
    });
                                            // ２段階調整
    $('.PhotoC').each(function(){
      p=0; e=$(this); w=$(this).attr('width');
      while(p==0){
        e=e.parent();
        if(e[0].tagName=='DIV' || e[0].tagName=='SECTION' ||
           e[0].tagName=='HEADER' || e[0].tagName=='FOOTER' || e[0].tagName=='NAV'){p=e.width();}
        if(e[0].tagName=='BODY'){p=w;}
      }
      if(p<w*me.Bs.sRate){w=p;} $(this).css({width: w+"px"});
    });
                                            // デバイス依存
    $('.PhotoD').each(function(){
      var s; if(me.Bs.mode=='mobile'){
        w=$(this).attr('msize')||me.Bs.image.fixMobile;
      }else{
        w=$(this).attr('psize')||me.Bs.image.fixPc;
      }
      $(this).css({width: w+'px'});
    });
  },
//
// cell: セルの幅・高さ調整
//ok
  cell: function(){
    var me=this; var w, m, h, max; if(me.Bs.mode==me.Save.mode){return;}

    $('.Cell').each(function(){

      if(me.Bs.mode=='mobile'){w=$(this).attr('mobile')||me.Bs.cellMobile;}
      else{w=$(this).attr('pc')||me.Bs.cellPc;}
      n=Math.floor($(window).width/w); m=($(window).width-(n*w))/(n*2);
      max=0;

      $(this).children().each(function(){
        $(this).css({'margin-left': m+'px', 'margin-right': m+'px', width: w+'px'});
        $(this).css({float: 'left'});
        h=$(this).height(); if(h>max){max=h;}
      });
      $(this).children().each(function(){$(this).css({height: max+'px'});});
    });
  },
//
// carousel: カルーセル
//ok
  carousel: function(mode, ix){
    var me=this; var pm, op; ix=ix||0;
//    
    var setSize=function(pm, obj){
      var wi, hi, wn, hn, w, n, a, max;

      if(me.Bs.mode=='mobile'){w=pm.mobile;}else{w=pm.pc;}

      a=obj.parent().width();
      if(pm.priority=='width'){n=Math.floor(a/w); w=Math.floor(a/n); pm.num=n;}
      else{n=pm.num; w=Math.floor(a/n);}

      pm.max=0;
      obj.find('li').each(function(){$(this).find('img').css({width: w+'px'}); pm.max++;});

      pm.wi=$('#'+pm.id+' img:first').width(); pm.hi=$('#'+pm.id+' img:first').height();
      pm.wf=(pm.wi*0)+"px"; pm.wt=(pm.wi*-1)+'px'; pm.wn=pm.wi*$('#'+pm.id+' img').size();
      pm.hf=(pm.hi*0)+"px"; pm.ht=(pm.hi*-1)+'px'; pm.hn=pm.hi*$('#'+pm.id+' img').size();
      $('#'+pm.id+' li:last').prependTo('#'+pm.id+' ul');
      if(pm.direction=='V'){
        $('#'+pm.id+' ul').css({height: pm.hn}); $('#'+pm.id+' ul').css("margin-top", pm.hf);
        pm.hn=pm.hi*pm.num; $('#'+pm.id).css({width: pm.wi, height: pm.hn, overflow: 'hidden'});
      }else{
        $('#'+pm.id+' ul').css({width: pm.wn});
        $('#'+pm.id+' ul').css({"margin-left": pm.wf}); $('#'+pm.id+' img').css({float: 'left'});
        pm.wn=pm.wi*pm.num; $('#'+pm.id).css({width: pm.wn, height: pm.hi, overflow: 'hidden'});
      }
      return pm;
    };
//
    var indicator=function(op, mode){
      var l=op.max, p=op.ix, mk='', i, j;
      if(mode=='init'){
        $('#'+op.id).empty();
        for(i=0; i<l; i++){
          if(i==0){mk=op.onf;}else{mk=op.off;} $('#'+op.id).append('<img src="'+mk+'" ix="'+i+'"/>');
        }
        $('#'+op.id).find('img').each(function(){
          $(this).on('click', function(){
            i=me.Save.carousel[op.pix].jx; j=$(this).attr('ix')-0;
            while(j!=i){
              $('#'+op.pid+' li:first').appendTo('#'+op.pid+' ul'); i++; if(i>=pm.max){i=0; break;}
            }
            i=0; $('#'+op.id).find('img').each(function(){
              if(i==j){mk=op.onf;}else{mk=op.off;} $(this).attr('src', mk);
            i++;});
            me.Save.carousel[op.pix].jx=j;
          });
        })
      }else{
        i=0; $('#'+op.id).find('img').each(function(){
          if(i==p){mk=op.onf;}else{mk=op.off;} $(this).attr('src', mk);
        i++;});
      }
    };
//
    switch(mode){
     case 'image':
                                            //
      $('.Carousel').each(function(){
        me.Save.carousel[ix]=setSize(me.Save.carousel[ix], $(this)); ix++;
      });
      return;

     case 'loop':
                                           //
      pm=me.Save.carousel[ix];

      if(pm.direction=='V'){
        $('#'+pm.id+' ul').animate({"marginTop": pm.ht}, pm.animate, "swing", function(){
          $(this).css("margin-top", pm.hf); $('#'+pm.id+' li:first').appendTo('#'+pm.id+' ul');
        })
      }else{
        $('#'+pm.id+' ul').animate({"marginLeft": pm.wt}, pm.animate, "swing", function(){
          $(this).css("margin-left", pm.wf); $('#'+pm.id+' li:first').appendTo('#'+pm.id+' ul');
        })
      }
      if(pm.indicator){
        pm.jx++; if(pm.jx>=pm.max){pm.jx=0;}
        indicator({id: pm.indicator, ix: pm.jx, onf: pm.onsign, off: pm.offsign});
      }

      pm.tid=setTimeout(function(){me.carousel('loop', ix);}, pm.interval);

      me.Save.carousel[ix]=pm;
      return;

     default:
                                            //
      $('.Carousel').each(function(){
        var k, i;
        op=me.Bs.carousel||{}; pm={};
        pm.id=$(this).attr('id');
        if(!pm.id){
          pm.id='CA'+Math.floor(Math.random()*1000); $(this).attr('id', pm.id);
        }
        k=[
          'num', 'direction', 'interval', 'animate', 'priority', 'pc', 'mobile',
          'down', 'up', 'fore', 'back', 'play', 'stop', 'toggle', 'indicator', 'onsign', 'offsign'
        ];
        for(i in k){pm[k[i]]=$(this).attr(k[i])||me.Bs.carousel[k[i]];}

        pm.iw=$(this).width();
        pm=setSize(pm, $(this));
        pm.jx=0;
        if(pm.indicator){
          indicator({id: pm.indicator, onf: pm.onsign, off: pm.offsign, max: pm.max, pix: ix}, 'init');
        }

        pm.tid=setTimeout(function(){me.carousel('loop', ix);}, pm.interval);

        if(pm.down){$('#'+pm.down).click(function(){
          clearTimeout(pm.tid); $('#'+pm.id+' ul').css("margin-top", pm.ht);
          $('#'+pm.id+' li:first').appendTo('#'+pm.id+' ul');
          $('#'+pm.id+' ul').css("margin-top", pm.hf);
          pm.tid=setTimeout(function(){me.carousel('loop', ix);}, pm.interval);
        });}
        
        if(pm.up){$('#'+pm.up).click(function(){
          clearTimeout(pm.tid); $('#'+pm.id+' ul').css("margin-top", 0);
          $('#'+pm.id+' li:last').prependTo('#'+pm.id+' ul');
          $('#'+pm.id+' ul').css("margin-top", -pm.hi);
          pm.tid=setTimeout(function(){me.carousel('loop', ix);}, pm.interval);
        });}

        if(pm.fore){$('#'+pm.fore).click(function(){
          clearTimeout(pm.tid);
          $('#'+pm.id+' ul').css("margin-left", pm.wf);
          $('#'+pm.id+' li:first').appendTo('#'+pm.id+' ul');
          pm.tid=setTimeout(function(){me.carousel('loop', ix);}, pm.interval);
        });}
        if(pm.back){$('#'+pm.back).click(function(){
          clearTimeout(pm.tid);
          $('div#'+pm.id+' div').css("margin-left", 0);
          $('#'+pm.id+' li:last').prependTo('#'+pm.id+' ul');
          $('#'+pm.id+' ul').css("margin-left", -pm.wi);
          pm.tid=setTimeout(function(){me.carousel('loop', ix);}, pm.interval);
        });}
        if(pm.play){$('#'+pm.play).click(function(){if(!pm.tid){
          pm.tid=setTimeout(function(){me.carousel('loop', ix);}, pm.interval);
        }});}
        if(pm.stop){$('#'+pm.stop).click(function(){if(pm.tid){
          clearTimeout(pm.tid); pm.tid='';
        }});}
        if(pm.toggle){$('#'+pm.toggle).click(function(){
          var cnvt=function(x){
            var a=x.split('.'); var o=''; var d='';
            for(i=a.length; i>0; i--){if(i==a.length-1){o='_x.'+o; d='.';}else{o=d+o;} o=a[i-1]+o;}
            return o;
          };
          if(pm.tid){
            clearTimeout(pm.tid); pm.tid='';
            var s=$('#'+pm.toggle).attr('src'); $('#'+pm.toggle).attr('data-save', s);
            s=cnvt(s); $('#'+pm.toggle).attr('src', s);
          }else{
            pm.tid=setTimeout(function(){me.carousel('loop', ix);}, pm.interval);
            var s=$('#'+pm.toggle).attr('data-save'); $('#'+pm.toggle).attr('src', s);
          }
        });}

        me.Save.carousel=me.Save.carousel||[]; me.Save.carousel[ix]=pm;

      });

      return;

    }

  },
//
// ドロップダウンメニュー
//
  dropdown: function(){
    var me=this; var op=me.Bs.dropdown; var vi;

    $('.Dropdown').each(function(){
      vi=op.animate||500;
      $(this).find('dd').css("display", "none");
      $(this).find('dt').click(function(){
        if($(this).siblings().css("display")=="block"){
          $(this).siblings().slideUp(vi); var o=$(this).find('img');
          if(o){var s=o.attr('data-src'); o.attr('src', s);}
        }else{
          $(this).siblings().slideDown(vi); var o=$(this).find('img');
          if(o){var s=o.attr('src'); o.attr('data-src', s); o.attr('src', me.insert(s, '_r'));}
        }
      });
    });

  },
//
// タブ操作
//ok
  tabs: function(mode){
    var me=this; var ix, jx;
////
//  molding HTMLを成形
    var molding=function(mode, obj, save, ix){
      var max=0, wi, hi;

      wi=obj.find('dt').outerWidth(); hi=obj.find('dt').outerHeight();
      obj.find('.Tabpage').each(function(){
        var h=$(this).outerHeight(); if(h>max){max=h;}
      });

      if(mode=='mobile'){
        var l=0, j=0; obj.find('.Tabpage').each(function(){
          me.css($(this), {
            outerHeight: max+'px', outerWidth: wi+'px',
            position: 'absolute', left: l+'px', top: 0,
            display: 'block'
          });
          me.Save.tabs[ix][j].width=wi;
        l=l+wi; j++;});
      }else{
        var j=0; obj.find('.Tabpage').each(function(){
          var d; if(save[j].open){d='block';}else{d='none';}
          me.css($(this), {
            outerHeight: max+'px', outerWidth: wi+'px',
            position: 'absolute', left: 0, top: 0,
            display: d
          });
          me.Save.tabs[ix][j].width=wi;
        j++;});
      }
      obj.find('dd').css({
        overflow: 'hidden', height: max+'px', width: wi+'px'
      });
      $('#'+me.Save.tabs[ix][0].id).css({
        position: 'relative', top: 0, left: 0, height: max+'px'
      });

    };
////
//  locating ページを位置づけ
    var locating=function(obj, ix, jx, direct){

      if(me.Bs.mode=='mobile'){
        l=me.Save.tabs[ix][0].width*jx*-1;
        if(direct){
          $('#'+me.Save.tabs[ix][0].id).css({marginLeft: l+'px'});
        }else{
          $('#'+me.Save.tabs[ix][0].id).animate({marginLeft: l+'px'}, me.Bs.animate);
        }
      }else{
        j=0; obj.find('.Tabpage').each(function(){
          if(jx==j){$(this).css({display: 'block'});}else{$(this).css({display: 'none'});}
        j++;});
      }
    };
////
//
    var config=function(obj){

      var m, j, w, id, save=[];
      w=obj.outerWidth();
      id='TB'+Math.floor(Math.random()*1000);
      j=0; obj.find('.Tabpage').each(function(){
        var t, h, l;
        save[j]={};
        save[j].id=id;
        save[j].width=w;
        save[j].img=$(this).attr('img');
        if($(this).attr('mobile')){
          save[j].mobile=$(this).attr('mobile')||$(this).attr('img');
        }
        t=$(this).attr('title');
        switch(t){
         case 'h2': case 'h3': case 'h4':
          save[j].title=$(this).find(t).html();
          break;
         default:
          save[j].title=t;
        }
        save[j].open=$(this).attr('open');
      j++;});
      return save;
    };
////
//  createTabs タブを作成
    var createTabs=function(mode, obj, save){
      var s, m, j;
      obj.find('dt').append('<ul></ul>');
      for(j in save){
        if(save[j].img){
          if(mode=='mobile'){s=save[j].mobile;}else{s=save[j].img;}
          if(save[j].open){s=me.insert(s, '_r');}
          obj.find('dt').find('ul').append(
            '<li ix="'+ix+'" jx="'+j+'"><img src="'+s+'" alt="'+save[j].title+'"/></li>'
          );
        }else{
          if(save[j].open){s='Open';}else{s='Close';}
          obj.find('dt').find('ul').append(
            '<li ix="'+ix+'" jx="'+j+'" class="'+s+' '+mode+'">'+save[j].title+'</li>'
          );
        }
      }

      obj.find('dd').append('<div id="'+save[j].id+'"></div>');
      obj.find('dd').children().each(function(){
        $(this).appendTo('#'+save[j].id);
      });
    };
////
////  monitoring クリック監視
    var monitoring=function(mode, obj){
      var obk;
      obj.find('dt').each(function(){
        obk=$(this); o='';
        obk.find('li').each(function(){
          $(this).on('click', function(){
            var ix=$(this).attr('ix')-0; var jx=$(this).attr('jx')-0;
            var j, s;
            if(me.Save.tabs[ix][jx].img){
              j=0; obk.find('img').each(function(){
                if(jx==j){s=me.insert(me.Save.tabs[ix][jx].img, '_r');}
                else{s=me.Save.tabs[ix][jx].img;}
                $(this).attr('src', s);
              j++;});
            }else{
              j=0; obk.find('li').each(function(){
                if(jx==j){s='open';}else{s='close';}
                $(this).attr('class', s);
              j++;});
            }
            locating(obj, ix, jx);
          });
        });
      });
    };
////
//  changeTabs タブ画像切換
      var changeTabs=function(mode, obj, save){
        var i, j, s, f;
      
        obj.find('dt').each(function(){
          $(this).find('img').each(function(){
            j=$(this).attr('jx');
            s=$(this).attr('src'); f=s.find(/_r/);
            if(mode=='mobile'){s=save[j].mobile||save[j].img;}else{s=save[j].img;}
            if(f){s=me.insert(s, '_r');}
            $(this).attr('src', s);
          });
        });
      };
////
////
    var ix, obj, id, js, data=[];
    if(mode=='init'){
      me.Save.tabs=[];
      
      ix=0; $(".Tabs").each(function(){
        me.Save.tabs[ix]=config($(this)); 
        createTabs(me.Bs.mode, $(this), me.Save.tabs[ix]);
        molding(me.Bs.mode, $(this), me.Save.tabs[ix], ix);
        monitoring(me.Bs.mode, $(this));
        id=me.Save.tabs[ix][0].id;
        me.Fdata.tabs={area: $(this).find('dd'), object: $('#'+id), max: me.Save.tabs[ix].length};
        me.flick(me.Fdata.tabs);
      ix++;});
    }else{
        
      ix=0; $(".Tabs").each(function(){
        changeTabs(me.Bs.mode, $(this), me.Save.tabs[ix]);
        molding(me.Bs.mode, $(this), me.Save.tabs[ix], ix);
        jx=0; sj=0; $(this).find('dt').find('li').each(function(){
          if($(this).attr('open')=='y'){sj=jx;}
        jx++;});
        locating($(this), ix, sj, true);
      ix++;});

    }

    return;
  },
//
// accordion:アコーディオン
//ok
  accordion: function(mode){
    var me=this; var op=me.Bs.accordion;
    op=op||{};
////
//  initialize 初期化
    var initialize=function(dl, op){
      var s=dl.attr('img')||op.img;
      if(me.Bs.mode=='mobile'){s=dl.attr('mobile')||op.mobile||s;}
      dl.attr('save', s);

      if(dl.attr('state')!='open'){s=me.insert(s, '_r'); dl.find('dd').css('display', 'none');}
      dl.find('dt').prepend('<img src="'+s+'"/>');
    };
////
//  changeImage イメージ対応
    var changeImage=function(dl){

      dl.find('dt').each(function(){
        s=dl.attr('save'); if(me.Bs.mode=='mobile'){s=dl.attr('mobile')||op.mobile||s;}
        if(dl.attr('state')!="open"){s=me.insert(s, '_r');}
        $(this).find('img').attr('src', s);
      });
    };
////
//  monitoring クリック監視
    var monitoring=function(dl, vi){
      dl.find('dt').each(function(){
        var dt=$(this), s;
        dt.on('click', function(){
          s=dl.attr('save');
          if(dl.attr('state')!='open'){
            dl.find('dd').slideDown(vi); dl.attr('state', 'open');
          }else{
            dl.find('dd').slideUp(vi); dl.attr('state', 'close'); s=me.insert(s, '_r');
          }
          dt.find('img').attr('src', s);
          me.section('position');
        });
      });
    };
////
    $('.Accordion').each(function(){
      var dl=$(this);
      var vi=dl.attr('animate')||op.animate||me.Bs.animate;

      if(mode=='init'){
        initialize(dl, vi); monitoring(dl, vi);
      }else{
        changeImage(dl);
      }
    });
  },
//
// map: 地図
//
  map: function(mode){
    var me=this; var ix, obj;
    if(!me.Bs.map.key){return;}
////
//  molding タグ成形
    var molding=function(){
      if(!document.getElementById('Pbody')){
        var apikey=me.Bs.map.key||'AIzaSyBqorhjZ69rxicwm8LWZ09cAWNLAbsuR-I';
        $('body').append('<div id="Pbody"></div>');
        $('body').append('<img src="'+op.close+'" alt="close" id="Pclose"/>');
        $('body').append('<script type="text/javascript" src="http://maps.google.com/maps/api/js?'+
        'key='+apikey+'&language=ja&region=JP"></script>');
      }else{
        $('#Pbody').html('<div id="Pbody"></div>');
      }
      $("#Pbody").css({"display":"none", "position":"absolute", "z-index": 500});
      $("#Pbody").css({"padding":"0 0 12px 0"});
      $("#Pclose").css({"border":"none","display":"none","position":"absolute"});
    };
////
//  altSize サイズ変更
    var altSize=function(obj, ix){
      if(me.Bs.mode!='mobile'){
        var w=Math.floor(me.Save.map[ix].width*me.Bs.scale);
        var h=Math.floor(me.Save.map[ix].height*me.Bs.scale);
        obj.css({width: w+'px', height: h+'px', display: 'block'});
      }
    };
////
//  blockMap 埋め込み地図  
    var blockMap=function(obj, ix){
      var a, t, lat, lon, s, w, h, e, o;
      a=JSON.parse($(this).html()); t=a.title||'';
      lat=a.lat||135; lon=a.lon||45; s=a.scale||me.Bs.map.scale||13;
      w=a.width||me.Bs.map.width||400; h=a.height||me.Bs.map.height||400;
      if(me.Bs.mode=='mobile'){
          w=0; e=$(this);
          while(w==0){
            e=e.parent();
            if(e[0].tagName=='DIV' || e[0].tagName=='SECTION' ||
              e[0].tagName=='HEADER' || e[0].tagName=='FOOTER' || e[0].tagName=='NAV'){w=e.width();}
            if(w!=0){wi=w; hi=w;}
            if(e[0].tagName=='BODY'){w=-1;}
          }
      }else{
        w=Math.floor(w*me.Bs.scale); h=Math.floor(h*me.Bs.scale);
      }
      obj.css({width: w+'px', height: h+'px', display: 'block'});
      o={}; o.zoom=s; o.mapTypeId=google.maps.MapTypeId.ROADMAP;
      var map=new google.maps.Map(this, o);
      map.setCenter(new google.maps.LatLng(lat, lon));
      var p=new google.maps.LatLng(lat, lon);
      new google.maps.Marker({position: p, map: map, title: t}); 
    };
////
//  popup 地図のポップアップ
    var popup=function(obj, ix){
      var lat=obj.attr("lat")-0||135; var lon=obj.attr("lon")-0||45; var ti=obj.attr("title")||'';
      var ra=obj.attr("rate")||me.Bs.map.rate||80;
      var tp=$(window).scrollTop()+$(window).height()*(100-ra)/200;
      var wi=Math.floor($(window).width()*ra/100);
      var hi=Math.floor($(window).height()*ra/100);
      var lf=($(window).width()-wi)/2; var cl=lf+wi-$('#Pclose').width();
      $('#Pbody').attr('ix', ix);
      $("#Pbody").css({
        display: 'block', width: wi+'px', height: hi+'px', top: tp+'px', left: lf+'px'
      });
      $("#Pclose").css({position: 'abosolute', right: 0, top: 0, display: 'block', 'z-index': 50});
      var o={}; o.zoom=obj.attr('scale')||me.Bs.map.scale; o.mapTypeId=google.maps.MapTypeId.ROADMAP;
      var x=document.getElementById('Pbody'); map=new google.maps.Map(x, o);
      map.setCenter(new google.maps.LatLng(lat, lon));
      var ps=new google.maps.LatLng(lat, lon);
      new google.maps.Marker({position: ps, map: map, title: ti});
    };
////
//  elevate 地図のせり上がり
    var elevate=function(obj, ix){
      var lat=obj.attr("lat")-0||135; var lon=obj.attr("lon")-0||45; var ti=obj.attr("title")||'';
      var ra=obj.attr("rate")||me.Bs.map.rate||80;
      var tp=Math.floor($(window).height()*(100-ra)/100);
      var wi=$(window).width();
      var hi=$(window).height()-tp;
      $('#Pbody').attr('ix', ix);
      $("#Pbody").css({
        position: 'absolute', display: 'block', width: wi+'px', height: hi+'px', top: 0, left: 0
      });
      $("#Pclose").css({position: 'absolute', right: 0, top: 0, display: 'block', 'z-index': 50});
      var o={}; o.zoom=obj.attr('scale')||me.Bs.map.scale; o.mapTypeId=google.maps.MapTypeId.ROADMAP;
      var x=document.getElementById('Pbody'); map=new google.maps.Map(x, o);
      map.setCenter(new google.maps.LatLng(lat, lon));
      var ps=new google.maps.LatLng(lat, lon);
      new google.maps.Marker({position: ps, map: map, title: ti});
    };
////
//  monitoring 監視
    var monitoring=function(obj, ix){
      me.Save.map[ix]={};
      
      obj.on('click', function(){
        if(me.Bs.mode=='mobile'){
          if(!me.Save.map[ix].toggle){
            var t=$(window).height()-$(window).width();
            $('#Pmap').css({display: 'block'});
            $('#Pmap').animate({top: t+'px'}, me.Bs.animate);
            me.Save.map[ix].toggle=true;
          }else{
            var t=$(window).height();
            $('#Pmap').animate({top: t+'px'}, me.Bs.animate, function(){
              $('#Pmap').css({display: 'none'});
            });
            me.Save.map[ix].toggle=false;
          }
        }else{
          if(!me.Save.map[ix].toggle){
            popup(obj, ix); toggle=obj.attr('lat'); return false;
          }else{
            if(toggle!=obj.attr('lat')){
              popup(obj, ix); me.Save.map[ix].lat=obj.attr('lat');
            }else{
              $("#Pclose").css("display","none"); $("#Pbody").fadeOut("fast");
              me.Save.pmap[ix].toggle=false;
            }
            return false;
          }
        }
      });

    $("#Pclose").on('click', function(){
      if(me.Bs.mode=='mobile'){
        var t=$(window).height();
        $('#Pmap').animate({top: t+'px'}, me.Bs.animate);
        me.Save.map[ix].toggle=false;
      }else{
        $("#Pclose").css("display","none"); $("#Pbody").fadeOut("fast");
        var ix=$("#Pbody").attr('data-ix'); me.Save.pmap[ix]='';
      }
    });

    };
////
////
    ix=0; $('.Map').each(function(){
      obj=this;
      if(obj.tagname=='img'){
        switch(mode){
         case 'init':
          molding();
          if(me.Bs.mode=='mobile'){elevate(obj, ix);}else{popup(obj, ix);}
          monitoring(obj, ix);
          break;
         case 'cont':
          altSize(obj, ix);
          break;
        }
      }else{
        switch(mode){
         case 'init': molding(); blockMap(obj, ix); break;
         case 'cont': altSize(obj, ix); break;
        }
      }
    ix++; });
  },
//
//
//
  another: function(mode){
    var me=this;

    switch(mode){
     case 'init':
      $(".Another").on('click', function(){
        if(me.Bs.mode=='mobile'){
          me.elevate('<iframe src="'+$(this).attr("href")+'"></iframe>');
        }else{
          var wi=$(this).attr("popWidth")-0||me.Bs.pop.width;
          var hi=$(this).attr("popHeight")-0||me.Bs.pop.height;
          var bar=$(this).attr("data-bar")||me.Bs.pop.bar; if(bar=='yes'){var x=',scrollbars=yes';}
          window.open($(this).attr("href"), "", "width="+wi+",height="+hi+x);
          return false;
        }
      });
      return;

     case 'cont':
        if(me.Bs.mode=='mobile'){me.elevate('');}
      return;
    }
  },
//
// rollover ロールオーバー
//ok
  rollover: function(){
    var me=this; var op=me.Bs.rollover||{}; op.over=op.over||'_r';

    $('img.Rollover').each(function(){var x=$(this).attr('src'); $(this).attr('save', x);});

    $('img.Rollover').on('mouseover', function(){
      var x=$(this).attr('save'); x=me.insert(x, op.over); $(this).attr('src', x);
    });

    $('img.Rollover').on('mouseout', function(){
      var x=$(this).attr('save'); if(x){$(this).attr('src', x);}
    });

  },
//
// セクションガイド(#Posvar)
//ok
  section: function(mode, pos, direct){
    var me=this; var id, p, t, i, out;
    
    switch(mode){

     case 'init':
                                    // 初期化
      me.Save.section=false;
      $('#Posvar').each(function(){
        out='<ul>';
        var now='now';
        $('section').each(function(){
          id='#'+$(this).attr('id'); t=$(this).find('h2').html();
          if(t){
            p=t.search(/\//); if(p>0){t=t.substr(0, p);}
            out+='<li class="'+now+'"><a href="'+id+'">'+t+'</a></li>';
            now='';
            if(!me.Sec[id]){me.Sec[id]={};} me.Sec[id].title=t;
          }else{
            console.log('<h2>tag not found');
            if(!me.Sec[id]){me.Sec[id]={};} me.Sec[id].title="Not Found";
          }
        });
        out+='</ul>';
        $('#Posvar').html(out);
        me.Save.section=true;
      });

      $("#Posvar a").click(function(){
        var x=$(this).attr('href'); me.section('goto', x);
        return false;
      });

      return;

     case 'position':

      if(!me.Save.section){return;}
      i=0; $('section').each(function(){
        k='#'+$(this).attr('id');
        if(k=='#top'){y=0;}else{y=$(k).position().top+$('main').position().top-me.Save.fixedTop;}
        me.Sec[k].pos=y; me.Sec[k].index=i; i++;
      });
      return;

     case 'goto':
                                      // セクションのポジショニング
      if(!me.Save.section){return;}
      var tag, ix, f;
      if(navigator.userAgent.toLowerCase().indexOf('applewebkit')>0){tag='body';}else{tag='html';}
      if(pos.charAt(0)=='#'){
        me.Now=pos;
        var y;
        if(pos=='#Top'){y=0;}else{y=$(pos).position().top+$('main').position().top-me.Save.fixedTop;}
        if(direct){$(tag).scrollTop(y);}
        else{$('body').animate({"scrollTop": y}, me.Bs.animateScroll, "swing");}
      }
      return false;

     case 'indicator':
                                      // ガイド表示
      if(!me.Save.section){return;}
      var i, k, d, s, j, f, y;
      d=Math.floor($(window).height()/2);
      s='#Top'; j=0; f=true; i=0;
      for(k in me.Sec){
        $('#Posvar').find('li').eq(i).attr('class', '');
        y=$(k).position().top+$('main').position().top-me.Save.fixedTop;
        if(pos<y){f=false;} if(f){s=k; j=i;}
        i++;
      }
      $('#Posvar').find('li').eq(j).attr('class', 'now');
      me.Now=s;
      return;

     case 'padding' :
      
      if(!me.Save.section){return;}
      $('section').each(function(){
        $(this).css({"padding-bottom": Math.floor($(window).height()/2)+"px"});
      });

      return;

    }
  },
//
// ajaxSource Ajaxによるソースのダイナミックロード
//ok
  ajaxSource: function(){
    var me=this; var m, e;
    
    $('.Load').each(function(){
      m=$(this).attr('href'); e=$(this);
      $.ajax({async: true, url: m, success: function(data){e.html(data);}});
    });

  },
//
// photoUp
//
  photoUp: function(){
    var me=this;
    var e, w, h, w, x, wn, hn, px, py, r, rh, rw, f, a;

    if(!document.getElementById('PhotoU')){x='<img id="PhotoU" src="" />'; $('body').append(x);}
    me.Fdata.photo={area: $('#PhotoU'), mode: 'move'};
    me.flick(me.Fdata.photo);
    $('#PhotoU').on('load', function(){
      rh=$(window).height()/$('#PhotoU').height(); rw=$(window).width()/$('#PhotoU').width();
      if(rh>1.1 && rw>1.1){
        py=Math.floor(($(window).height()-$('#PhotoU').height())/2);
        px=Math.floor(($(window).width()-$('#PhotoU').width())/2);
        hn=$('#PhotoU').height(); wn=$('#PhotoU').width();
      }else{
        if(rh<rw){r=rw*0.9;}else{r=rh*0.9;}
        hn=Math.floor($('#PhotoU').height()*r); wn=Math.floor($('#PhotoU').width()*r);
        py=Math.floor(($(window).height()-hn)/2);
        px=Math.floor(($(window).width()-wn)/2);
      }
      $('#PhotoU').css({
        width: wn+'px', height: hn+'px',
        position: 'fixed', top: py+'px', left: px+'px',
        'z-index': 1010
      });
    });
//
    $(".PhotoU").on('click', function(){
      f=$(this).attr('href');
      if(!f){f=me.insert($(this).attr('src'), '_r');}
      $('#PhotoU').attr('src', f);
      $('#PhotoU').css({display: 'block'});
      me.modal('set', function(){
        $('#PhotoU').css({display: 'none'});
      });
    });
//
  },
//
// tipup ホーバーでの説明文ポップアップ
//
  tipup: function(){
    var me=this; var x, y, z, t, w;

    var elm=document.getElementById('Tipup');
    if(!elm){
      $("body").append('<div id="Tipup"></div>');
      $("#Tipup").css({opacity:0.9, position:"fixed", display:"none", 'z-index': 1000});
    }

    $(".Tipup").on('mouseover', function(e){
      y=e.clientY-me.Bs.tipup.ydiff; x=e.clientX+me.Bs.tipup.xdiff;
      t=$(this).attr("alt"); $("#Tipup").html(t);
      w=$('#Tipup').outerWidth();
      z=Math.floor(e.pageX+me.Bs.tipup.xdiff-w/2);
      if(z>$(window).width()){x=$(window).width()-w;} 
      $("#Tipup").css({top: y+"px", left: x+'px'});
      if(t){$("#Tipup").show();}
    });
    $(".Tipup").on('mouseout', function(){$("#Tipup").hide();  $("#Tipup").html('');});
    $(".Tipup").on('mousemove', function(e){
      y=e.clientY-me.Bs.tipup.ydiff; x=e.clientX+me.Bs.tipup.xdiff;
      t=$(this).attr("alt"); $("#Tipup").html(t);
      w=$('#Tipup').outerWidth();
      z=Math.floor(e.pageX+me.Bs.tipup.xdiff-w/2);
      if(z>$(window).width()){x=$(window).width()-w;} 
      $("#Tipup").css({top: y+"px", left: x+'px'});
    });
  },
//
// フリック操作
//
  flick: function(data, indicator, direct){
    var me=this;

                                                // 構造データ
    data.mode=data.mode||'page';                // 操作モード(page, hide, move)
    data.area=data.area;                        // area: 移動オブジェクト
    data.wi=data.wi||300;                       // wi: 移動体幅(px)
    data.hi=data.hi||500;                       // hi: 窓高(px)
    data.ix=data.ix||1;                         // ix: 表示開始頁(1~)
    data.max=data.max||0;                       // max:最大個数
    data.threshold=data.threshold||100;         // threshold: 動くかどうかの閾値(px)
    data.animate=data.animate||400;             // animate: アニメーション時間(ms)
    data.move=data.move||0;                     // move: 指定されたixに移動
    data.menu=data.menu||false;                // menu: メニュー動作(true/false)
    data.modal=data.modal||false;              // modal 消去
    data.object=data.object||data.area;
    indicator=indicator||function(){};         // インディケーター表示アクション

    if(data.mode=='hide'){data.max=2; data.ix=1;}
    $(data.area).attr('ix', data.ix);
    if(data.move>0){
      if(data.ix>data.max){return;}
      var l=(1-data.move)*data.wi;
      if(direct){data.object.css({'margin-left': l+'px'});}
      else{data.object.animate({'margin-left': l+'px'}, data.animate);}
      data.ix=data.move; data.move=0;
      indicator(data);
      return;
    }
    
    var isTouch=('ontouchstart' in window);

    data.area.on({

      'touchstart mousedown': function(e){
        if(me.Bs.mode!='mobile'){return;}

        data.flg=true;
        data.wi=data.area.outerWidth();
        data.hi=data.area.outerHeight();
        data.stx=(isTouch ? event.changedTouches[0].pageX : e.pageX);
        data.sty=(isTouch ? event.changedTouches[0].pageY : e.pageY);
        data.inx=parseInt($(data.object).css('margin-left'));
        data.iny=parseInt($(data.object).css('margin-top'));
        var a=$(data.object).attr('min'); if(a){data.maxtop=(a-0)*-1;}else{data.maxtop=0;}
        var b=$(data.object).attr('max'); if(b){data.minbot=(b-0)*-1;}else{data.minbot=0;}
      },

      'touchmove mousemove': function(e){if(data.flg){
        if(me.Bs.mode!='mobile'){return;}

        e.preventDefault();
        var nx=(isTouch ? event.changedTouches[0].pageX : e.pageX);
        var ny=(isTouch ? event.changedTouches[0].pageY : e.pageY);
        var dx, dy;
        if(data.mode=='move'){dx=nx-data.stx;}else{dx=data.wi*(data.ix-1)*-1+nx-data.stx;}
        dy=ny-data.sty;
        if(Math.abs(nx-data.stx)>Math.abs(dy)){
          if(data.mode=='move'){
            var tx=data.inx+dx;
            if(ty>data.maxtop){ty=data.maxtop;} if(ty<data.minbot){ty=data.minbot;}
            $(data.object).css({'margin-left': tx+'px'});
          }else{
            if(dx<0){data.object.css({'margin-left': dx+'px'});}
          }
        }else{
          var ty=data.iny+dy;
          if(ty>data.maxtop){ty=data.maxtop;} if(ty<data.minbot){ty=data.minbot;}
          $(data.object).css({'margin-top': ty+'px'});

        }
      }},

      'touchend mouseup': function(e){
        if(me.Bs.mode!='mobile'){return;}

        data.flg=false;

        if(data.mode!='move'){
          data.ix=$(data.area).attr('ix')-0;
          var n=(isTouch ? event.changedTouches[0].pageX : e.pageX);
          var df=n-data.stx;
          if(df<0-data.threshold){
            data.ix++; if(data.ix>data.max){data.ix=data.max;}
            if(data.modal){me.modal('clear');}
          }
          if(df>data.threshold){
            data.ix--; if(data.ix<1){data.ix=1;}
            if(data.modal){me.modal('clear');}
          }
          var d=data.wi*(data.ix-1)*-1;
          data.object.stop();
          data.object.animate({'margin-left': d}, data.animate); indicator(data);
          $(data.area).attr('ix', data.ix);
        }
      }
    });

  },
//
//
//
  elevate: function(html, animate){
    var me=this; var t, l; animate=animate||me.Bs.animate;

    if(!document.getElementById('#Elevate')){
      $('body').append('<div id="#Elevate"> </div>');
      $('#Eclose').on('click', function(){
        if($('#Elevate').attr('state')=='on'){
          t=$(window).height(); $('#Elevate').stop(); $('#Elevate').animate({top: t+'px'}, animate);
          $('#Elevate').attr('state', ''); $('#Elevate').html('');
        }
      });
    }
    if(html==''){
      if($('#Elevate').attr('state')=='on'){
        t=$(window).height(); $('#Elevate').css({top: t+'px'});
        $('#Elevate').attr('state', ''); $('#Elevate').html('');
      }
    }else{
      t=$(window).height();
      $('#Elevate').css({position: 'absolute', top: t+'px', left: 0, 'z-index': 800});
      $('#Elevate').html('<img id="Eclise" src="'+me.pngclose+'"/>'+html);
      l=$(window).width()-$('#Eclose').outerWidth();
      $('#Eclose').css({position: 'absolute', top: 0, left: l+'px', 'z-index': 810});
      t=t-$('#Elevate').height();
      $('#Elevate').stop(); $('#Elevate').animate({top: t+'px'}, animate);
      $('#Elevate').attr('state', 'on');
    }
  },
//
//modal モーダルスクリーン
//
  modal: function(mode, proc){
    var me=this; var t, l;
    
    switch(mode){
     case 'init':
      $('body').append('<div id="Modal"></div>');
      $('body').append('<img id="Mclose" src="" />');
      $("#Mclose").attr("src", me.pngclose);
      t=$(window).scrollTop(); l=$(window).width()-$('#Mclose').width();
      $('#Modal').css({
        position: 'absolute', top: 0, left: 0,
        'background-color': '#000', opacity: me.Bs.opacity, display: 'none', 'z-index': 600
      });

      $('#Mclose').css({
        position: 'absolute', top: 0, left: 0, display: 'none', 'z-index': 1020
      });
      me.Save.proc=function(){};
      $('#Modal, #Mclose').on('click', function(){
        me.Save.proc(); $('#Modal').css({display: 'none'}); $('#Mclose').css({display: 'none'});
        me.Save.proc=function(){};
      });
      break;
     case 'set':
      proc=proc||function(){};
      $('#Modal').css({
        display: 'block', width: $(document).width()+'px', height: $(document).height()+'px',
      });
      t=$(window).scrollTop(); l=$(window).width()-$('#Mclose').width();
      $('#Mclose').css({display: 'block', top: t+'px', left: l+'px'});
      me.Save.proc=proc;
      break;
     case 'clear':
      $('#Modal').css({display: 'none'}); $('#Mclose').css({display: 'none'});
      me.Save.proc=function(){};
      break;
     case 'reset':
      me.Save.proc();
      $('#PhotoU').css({display: 'none'});
      $('#Modal').css({display: 'none'}); $('#Mclose').css({display: 'none'});
      me.Save.proc=function(){};
      break;
    }
  },
//
// パラメタの展開
//
  parm: function(ln, dt, ix, i, j, c, sw, out, cc, key){
    var me=this; sw=0; out=''; key=''; if(!ix){ix=0;}
    if(!ln){return '';}
    for(i=0; i<ln.length; i++){
      c=ln.substr(i, 1); cc=ln.substr(i, 2);
      switch(sw){
       case 0:
        switch(cc){
          case '?{': sw=1; i++; key='';
          default: if(cc>'?0' && cc<'?9'){sw=9;}else{out+=c;} break;
        } break;
       case 1:
        if(c=='}'){if(PARM[key]!==undefined){out+=PARM[key];} sw=0;}
        else{key+=c;} break;
      }
    }

    return out;
  },
//
// css 設定
//
  css: function(selector, para){
    if(!selector){return false;}
    var e; if(typeof(selector)=='object'){e=selector;}else{e=$(selector);} if(!e){return false;}
    var me=this, para=para||{}, v;

    if(para.outerHeight){
      v=parseInt(para.outerHeight)-parseInt(e.css('padding-top'))-parseInt(e.css('padding-bottom'));
      para.height=v+'px'; delete para['outerHeight'];
    }
    
    if(para.outerWidth){
      v=parseInt(para.outerWidth)-parseInt(e.css('padding-left'))-parseInt(e.css('padding-right'));
      para.width=v+'px'; delete para['outerWidth'];
    }

    if(para.fullHeight){
      v=parseInt(para.fullHeight)-parseInt(e.css('padding-top'))-parseInt(e.css('padding-bottom'))
      -parseInt(e.css('margin-top'))-parseInt(e.css('margin-bottom'));
      para.height=v+'px'; delete para['gullHeight'];
    }

    if(para.fullWidth){
      v=parseInt(para.fullwidth)-parseInt(e.css('padding-left'))-parseInt(e.css('padding-right'))
       -parseInt(e.css('margin-left'))-parseInt(e.css('margin-right'));
      para.height=v+'px'; delete para['fullWidth'];
    }
    if(para.saveHeight){
      v=me.Save[selector].height; para.height=v; delete para['saveHeight'];
    }

    if(para.saveWidth){
      v=me.Save[selector].width; para.width=v; delete para['saveWeight'];
    }

    if(para.saveColor){
      v=me.Save[selector].color; para.color=v; delete para['saveColor'];
    }

    if(para.saveOuterHeight){
      v=me.Save[selector].outerHeight
       -parseInt(e.css('padding-top'))-parseInt(e.css('padding-bottom'));
       para.height=v+'px'; delete para['saveOuterHeight'];
    }

    if(para.saveOuterWidth){
      v=me.Save[selector].outerWidth
       -parseInt(e.css('padding-top'))-parseInt(e.css('padding-bottom'));
       para.width=v+'px'; delete para['saveOuterWidth'];
    }

    if(para){$(selector).css(para);}
  },
//
  cut: function(x){
    var p=x.search(/px/); if(p>-1){return x.substring(0, p)-0;}else{return x-0;}
  },
//
  insert: function(txt, over){
    var sw, out, x, i; sw=0; out=''; if(!txt){return '';}
    for(i=txt.length; i>0; i--){
      x=txt.substr(i-1, 1);
      if(sw==0){if(x=='.'){out=over+'.'+out; sw=1;}else{out=x+out;}}else{out=x+out;}
    }
    return out;
  },
//
  pngclose: 'data:image/png;base64,'+ // close
       'iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAByElEQVR42t2W2YrCQBBF/RoN6JNxR'+
       'eMC7t/r9iouT4r6RTWchpI2dmcZxxmYgpAYk5zcqludKsgvRuFPYIPBQOr1uoRhaPa1Ws0cs9ffaZ'+
       'vrOp77AqtUKh9RUy6XX2G8xSfCfq4TViqVpNPpyOFwyP3wzWYj1WrVpJSgFC8w+yQggL1eT/b7fWb'+
       'Qer02L8298/ncr0zfhDidTqawCtztdqmg5XL5AI3HY7ndbtnSSJBCBfb7/UQgoEajYa5dLBZyvV6z'+
       '10wDAKAgCGQ4HDprCKjVaj1Sp4pcGUt1I8AoigwQpcfj8ckM7XbbgGazmVwul/xujAeKABaLRWMeT'+
       'LPdbo0izgGyU/cWTIHdbteo0NVBQfHUvQ0jUEQNALJRR5+it2HUSO2NKlJr19AVuQzialgcqo0PMK'+
       'nxcyvD3pq+yWQi9/vdKNK2AOjrQ+dy5YMlNawC+Y+2cAGdyuw38DWsywwAdKVhH2/8TGmkRnbDns9'+
       'nb5oBsoZiGhxqmybVIKvVSprN5gOUZm+78fXzpKZJVcb3iJum02liw8YDRepSapkJxrFrUc0SKCSV'+
       'o9HI70Z7VvjJsGebp+nKnpJ0svruplOac7r6d0PqF4sKdR93ekf9AAAAAElFTkSuQmCC',
//
  finish: function(){
  }
}
