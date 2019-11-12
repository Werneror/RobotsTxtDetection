function addPathInfo(path, info) {
	if (info['status'] > 199 && info['status'] < 300) {
		var status_html = '<span class="status green">' + info['status'] + '</span>'
	} else {
		var status_html = '<span class="status red">' + info['status'] + '</span>'
	}
	var newNode = document.createElement("div");
	newNode.innerHTML = status_html + '<a class="black" href="' + info['fullurl']  + '">' + path + '</a>';
	document.querySelector("body").appendChild(newNode);
}

chrome.runtime.sendMessage('check', function(response) {
	for (path in response) {
		addPathInfo(path, response[path]);
	}
});
