var Sv=require('knserver');
var Nm=require('nodemailer');
var Fs=require('fs');
var Main={COUNT: {}, CTL: {},
  begin: function(){
    var me=this;
    Sv.prologue=function(cfg){
      me.LogName=cfg.home+'/log/communicator.';
      me.CTL.cph=cfg.countPerHour||100;
      me.COUNT[Sv.today()]=0;
    };
    var rc, txt, sbj;
    Sv.MAIN(function(data, cfg, ss){
      switch(data.level){
       case "sevier": me.sevier(data, cfg, ss); break;
       case "notice": me.notice(data, cfg, ss); break;
       default: me.log(data);
      }
    });
  },
//
  sevier: function(data, cfg, ss){
    var me=this;

    if(data.debug){sbj="デバッグメッセージです。"+data.subject;}
    else{sbj=data.subject;}
    txt=data.subject+"\n";
    txt=data.msg+"\n";
    txt+='プログラム:'+data.program+"\n";
    txt+='場所:'+data.pos+"\n";
    txt+='原因:'+data.err+"\n";
    me.log(data);
    if(me.count(data, cfg.communicator))
      {me.send([{to: cfg.communicator.errorTo, subject: sbj, text: txt}]);}
    return {rc: 'ok'};

  },
//
  notice: function(data, cfg, ss){
    var me=this;
    
    if(data.debug){sbj="デバッグメッセージです。"+data.subject;}
    else{sbj=data.subject;}
    txt=data.subject+"\n";
    txt=data.msg+"\n";
    txt+='プログラム:'+data.program+"\n\n\n\n";
    txt+=JSON.stringify(data);
    cfg.communicator.noticeTo=cfg.communicator.noticeTo||cfg.communicator.errorTo;
    me.log(data);
    if(me.count(data, cfg.communicator))
      {me.send([{to: cfg.communicator.noticeTo, subject: sbj, text: txt}]);}
    return {rc: 'ok'};

  },
//
  count: function(data){
    var me=this;
    
    if(!me.COUNT[data.pos]){me.COUNT[data.pos]={}; me.COUNT[data.pos].count=0;}
    if(me.COUNT[data.pos].now!=me.date('YMDH')){
      me.COUNT[data.pos].now=me.date('YMDH'); me.COUNT[data.pos].count=0;
    }

    me.COUNT[Sv.today()]=me.COUNT[Sv.today()]||0; me.COUNT[Sv.today()]++;
    me.COUNT[data.pos].count++;

    if(me.COUNT[data.pos].count<me.CTL.cph){return true;} return false;
  },
//
  send: function(to){
    var me=this; var ix, op;
    if(op=Sv.CFG.communicator){}else{return false;}
    var mtp=Nm.createTransport({
      service: op.service, auth: {user: op.user, pass: op.pass}
    });
    for(ix in to){
      mtp.sendMail(
        {from: op.user, to: to[ix].to, subject: to[ix].subject, text: to[ix].text},
        function(error, res){if(error){console.log(error);}}
      );
    }
  },
//
  log: function(data){
    var me=this; var fn;

    if(data.debug){fn=me.LogName+'debug';}else{fn=me.LogName+'log';}
    Fs.appendFile(fn, Sv.today()+' '+Sv.now()+'['+data.level+'] >>'+JSON.stringify(data)+"\n");
  },
//
  finish: {}
};
Main.begin();
