/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
YandexnReadernChecker_kango.UserscriptEngineClient=function(){};YandexnReadernChecker_kango.UserscriptEngineClient.prototype={run:function(c,b,a){var d=this;YandexnReadernChecker_kango.invokeAsync("kango.userscript.getScripts",c.document.URL,b,a,function(a){for(var b in a)a.hasOwnProperty(b)&&d.executeScript(c,a[b].join("\n\n"))})},executeScript:function(c,b){try{var a=new YandexnReadernChecker_kango.UserscriptApi(c);a.kango=YandexnReadernChecker_kango;YandexnReadernChecker_kango.lang.evalInSandbox(c,a,b)}catch(d){YandexnReadernChecker_kango.console.log("US: "+d.message+"\n"+d.stack||"")}}};YandexnReadernChecker_kango.UserscriptApi=function(){};
YandexnReadernChecker_kango.UserscriptApi.prototype={};
