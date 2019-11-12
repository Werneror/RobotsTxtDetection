var urlCache = {};    // Caching of various path states under a URL
var pathCache = {};    // Status cache for full URL
var existCache = {};    // Cache of path states that exist under a URL
var pathList = [];
var nonexistentCode = [];
var currentUrl = '';
var currentTabId = 0;

chrome.runtime.onInstalled.addListener(function (e) {
  window.setTimeout(function () {
    if (e.reason === "install") {
      chrome.storage.local.get(["path", "code"], function(obj){
	    if (!obj.path) {
          chrome.storage.local.set({
            path: ['/robots.txt']
          }, function(){})
	    }
	    if (!obj.path) {
          chrome.storage.local.set({
            code: [404, 301, 302]
          }, function(){})
	    }
      });
    }
  }, 3000);
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
	chrome.tabs.query({}, function (tabs) {
		for (var i = 0; i < tabs.length; i++) {
			if (tabs[i].id === activeInfo.tabId) {
				currentUrl = tabs[i].url;
				currentTabId = tabs[i].id;
				if (urlCache[tabs[i].url]) {
					changePageAction(tabs[i].url, tabs[i].id);
				}
			}
		}
	});
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tabInfo) {
	if (tabId == currentTabId) {
		currentUrl = tabInfo.url;
	}
	if (tabInfo.url.indexOf('http') == 0) {
		checkUrl(tabInfo.url, tabInfo.id);
	}
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request == 'check') {
		sendResponse(existCache[currentUrl]);
	}
});

function loadConfig() {
	chrome.storage.local.get(["path", "code"], function(obj){
		pathList = obj.path;
		nonexistentCode = obj.code;
	});
}

function judgeExist(path, status) {
	loadConfig();
	var codeExist = true;
	for (code of nonexistentCode) {
		if (status == code) {
	    	codeExist = false;
	    }
	}
	var pathExist = false;
	for (p of pathList) {
		if (path == p) {
			pathExist = true;
		}
	}
	return pathExist && codeExist;
}

function changePageAction(url, tabId) {
	var info = urlCache[url];
	var title = chrome.i18n.getMessage('extensionName');
	existCache[url] = {};
	for (var path in info) {
		if (judgeExist(path, info[path]['status'])) {
			title += '\n' + info[path]['status'] + '  ' + path;
			existCache[url][path] = info[path];
		}
	}
	if (title != 'robots.txt Detection') {
		chrome.pageAction.show(tabId);
	    chrome.pageAction.setTitle({
	    	tabId: tabId,
	    	title: title
	    });
	} else {
		chrome.pageAction.hide(tabId);
	}
}

function checkUrl(url, tabId) {
	loadConfig();
	if (!urlCache[url]) {
		urlCache[url] = {};
	}
	for (var path of pathList) {
		if (!urlCache[url][path]) {
			checkPath(url, path, function (status) {
				changePageAction(url, tabId);
			});
		}
	}
	changePageAction(url, tabId);
}

function checkPath(url, path, callback) {
	var queryUrl = generateQeuryUrl(path, url);
	if (pathCache[queryUrl]) {
		urlCache[url][path] = {
			status: pathCache[queryUrl],
			fullurl: queryUrl
		}
		callback(pathCache[queryUrl]);
	} else {
		var xhr = new XMLHttpRequest();
	    xhr.open('GET', queryUrl, true);
	    xhr.onreadystatechange = function() {
	        if (xhr.readyState == XMLHttpRequest.DONE) {
	        	pathCache[queryUrl] = xhr.status;
				urlCache[url][path] = {
					status: pathCache[queryUrl],
					fullurl: queryUrl
				}
	        	callback(xhr.status);
	        }
	    }
	    xhr.send();
	}
}

function generateQeuryUrl(path, url) {
	var url = new URL(url);
	if (path.indexOf('/') == 0) {
		return url.origin + path;
	} else {
		var urlpathArray = url.pathname.split('/');
		urlpathArray.pop()
		return url.origin + urlpathArray.join('/') + '/' + path;
	}
}
