// 不用點擊，而是用懸停開啟新分頁按鈕的方式來開啟新分頁/標籤
// open new tab by hovering over tabs-newtab-button
(function(){

let delay		= 1000	;//懸停幾毫秒，才執行動作
let multi		= false ;//能否允許存在多個新分頁


let tbt = document.getElementById("tabbrowser-tabs");
if(!tbt)return;
let timeoutID;
let hasTabMixPlus = (function()'undefined'!==typeof Tabmix)();
let newTabURL = function(){
	let prefService = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
	return hasTabMixPlus?(function(){
		switch(prefService.getIntPref('extensions.tabmix.loadOnNewTab.type')){
			case 0:
				return 'about:blank';
			case 1:
				return 'about:home';
			case 2://目前分頁
			case 3://複製分頁
				return window.content.location.href;
			case 4://自定網址
			default:
				return BROWSER_NEW_TAB_URL;
		}
	})():BROWSER_NEW_TAB_URL;
};
let openNewTab = function(){
	multi?BrowserOpenTab():(function(){
		let url = newTabURL(),
			ii = gBrowser.browsers.length;
		while(ii--){
			if(gBrowser.getBrowserAtIndex(ii).currentURI.spec===url){
				gBrowser.selectedTab = gBrowser.tabContainer.childNodes[ii];
				return;
			}
		}
		BrowserOpenTab();
	})();
};
let listener = function(){
	timeoutID = setTimeout(function(){
		openNewTab();
	}, delay);
};
let newTabBtn = document.getAnonymousElementByAttribute(tbt, "class", "tabs-newtab-button");
newTabBtn.addEventListener('mouseover', listener, false);
newTabBtn.addEventListener('mouseout', function(){
	clearTimeout(timeoutID);
}, false);

})();