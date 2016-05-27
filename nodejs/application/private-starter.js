//
// privatre-starter start daemon from ~/alc-project/private-starter.sh
// refer from ~/starter.json
var JOB=require('knmanager');
JOB.MAIN(function(){
  console.log("### プライベートスターター");
  var f=JOB.CFG.home+'/'+JOB.CFG.project+'/data/'+'starter.json';
  var table=JOB.getJson(f); console.log("### スターターファイル :"+f);
  var m, c, o;
  if(table){for(var i in table){
    switch(JOB.modifier(table[i].path)){
      case "js": case "jse": o=JOB.CFG.directory; break;
      default: o=JOB.CFG.project+"/nodejs/application/";
    }
    m=o+table[i].path;
    if(JOB.isExist(m)){
      switch(table[i].type){
       case "forever":
        c='forever start -a --uid '+table[i].name+' '+m; break;
       case "sudof":
        c='sudo forever start -a --uid '+table[i].name+' '+m; break;
       case "node":
        c='node '+table[i].name+' '+m; break;
       case "sudon":
        c='sudo node '+table[i].name+' '+m; break;
       case "shell":
        c=m; break;
      }
      require('child_process').exec(c, function(err, stdout, stderr){
        if(err){console.log('起動時エラー:'+err);}
        else{console.log('### アプリケーションを開始しました。:'+c);}
      });
      JOB.sleep(1000);
    }else{
      console.log('モジュールがありません。module='+table[i].path);
    }
  }}
  else{console.log('/starter.jsonが読めません。');}
});
