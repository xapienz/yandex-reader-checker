/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
YandexnReadernChecker_kango.ui.ContextMenuItem=function(a){this.superclass.apply(this,arguments);this.init(a)};
YandexnReadernChecker_kango.ui.ContextMenuItem.prototype=YandexnReadernChecker_kango.oop.extend(YandexnReadernChecker_kango.ui.ContextMenuItemBase,{init:function(a){this.addItem("kango-item1",a.caption,a.context||"all")},addItem:function(a,d,e){var c=document.getElementById("contentAreaContextMenu"),b=document.createElement("menuitem");b.setAttribute("id",a);b.setAttribute("label",d);b.addEventListener("command",YandexnReadernChecker_kango.lang.bind(function(a){var b=document.popupNode;this.fireEvent(this.event.CLICK,{srcUrl:b.src,linkUrl:b.href});a.preventDefault()},this),!1);c.appendChild(b);
c.addEventListener("popupshowing",function(){var b=document.getElementById(a);null!=b&&"image"==e&&(b.hidden=!gContextMenu.onImage)},!1)}});YandexnReadernChecker_kango.ContextMenuModule=function(){};YandexnReadernChecker_kango.ContextMenuModule.prototype.init=function(){var a=YandexnReadernChecker_kango.getExtensionInfo();"undefined"!=typeof a.context_menu_item&&(YandexnReadernChecker_kango.ui.contextMenuItem=new YandexnReadernChecker_kango.ui.ContextMenuItem(a.context_menu_item))};YandexnReadernChecker_kango.registerModule(YandexnReadernChecker_kango.ContextMenuModule);
