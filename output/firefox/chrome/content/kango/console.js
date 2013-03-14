/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
YandexnReadernChecker_kango.Console=function(){this._consoleService=Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService)};YandexnReadernChecker_kango.Console.prototype=YandexnReadernChecker_kango.oop.extend(YandexnReadernChecker_kango.IConsole,{_consoleService:null,log:function(a){1<arguments.length&&(a=YandexnReadernChecker_kango.string.format.apply(YandexnReadernChecker_kango.string,arguments));this._consoleService.logStringMessage(a)}});YandexnReadernChecker_kango.console=new YandexnReadernChecker_kango.Console;
