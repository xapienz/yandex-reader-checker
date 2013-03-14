/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
YandexnReadernChecker_kango.ui.OptionsPage=function(){var a=YandexnReadernChecker_kango.getExtensionInfo();if("undefined"!=typeof a.options_page){var b=this._optionsUrl=YandexnReadernChecker_kango.io.getExtensionFileUrl(a.options_page).toLowerCase();YandexnReadernChecker_kango.browser.addEventListener("DOMContentLoaded",function(a){0==a.url.toLowerCase().indexOf(b)&&(a.window.kango=YandexnReadernChecker_kango)})}};
YandexnReadernChecker_kango.ui.OptionsPage.prototype=YandexnReadernChecker_kango.oop.extend(YandexnReadernChecker_kango.ui.IOptionsPage,{_optionsUrl:"",open:function(a){if(""!=this._optionsUrl){var b=this._optionsUrl;"undefined"!=typeof a&&(b+="#"+a);YandexnReadernChecker_kango.browser.tabs.create({url:b,focused:!0,reuse:!0});return!0}return!1}});YandexnReadernChecker_kango.ui.optionsPage=new YandexnReadernChecker_kango.ui.OptionsPage;
