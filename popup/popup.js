function addPathInfo(path, info) {
	var divNode = document.createElement("div");
	var spanNode = document.createElement("span");
	var aNode = document.createElement("a");

	spanNode.innerText = info['status'];
	spanNode.classList.add('status');
	if (info['status'] > 199 && info['status'] < 300) {
		spanNode.classList.add('green');
	} else {
		spanNode.classList.add('red');
	}

	aNode.href = info['fullurl'];
	aNode.innerText = path;
	aNode.classList.add('black');
	aNode.target = '_blank';

	divNode.classList.add('path');
	divNode.appendChild(spanNode);
	divNode.appendChild(aNode);
	document.querySelector("body").appendChild(divNode);
}

chrome.runtime.sendMessage('check', function(response) {
	for (path in response) {
		addPathInfo(path, response[path]);
	}
});
