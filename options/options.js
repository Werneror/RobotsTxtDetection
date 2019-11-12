function prompt(title, color) {
  document.querySelector("#prompt").innerText = title;
  document.querySelector("#prompt").style.color = color;
  document.querySelector("#prompt").style.display = "inline";
  setTimeout(function () {
    document.querySelector("#prompt").style.display = "none";
  }, 1500);
}

function checkPath(paths) {
  if (paths == "") {
    paths = "/robots.txt";
  }
  return paths.split("\n");
}

function joinPath(paths) {
  if (paths) {
    return paths.join("\n");
  } else {
    return undefined;
  }
}

function checkCode(codes) {
  if (codes == "") {
    prompt(chrome.i18n.getMessage('statusCodeNotEmpty'), "red");
    return undefined;
  }
  var numberCodes = new Array();
  for (code of codes.split("\n")) {
    if (code == "") {
      continue;
    }
    var numberCode = parseInt(code);
    if (isNaN(numberCode)) {
      prompt(chrome.i18n.getMessage('statusCodeMustInteger'), "red");
      return undefined;
    } else {
      numberCodes.push(parseInt(code));
    }
  }
  return numberCodes;
}

function joinCode(codes) {
  if (codes) {
    return codes.join("\n");
  } else {
    return undefined;
  }
}

function saveOptions(e) {
  e.preventDefault();
  var codes = checkCode(document.querySelector("#code").value);
  if (codes) {
    chrome.storage.local.set({
      path: checkPath(document.querySelector("#path").value),
      code: codes,
    }, function(){
      prompt(chrome.i18n.getMessage('saveSuccessfully'), "black");
    })
  }
}

function restoreOptions() {
  chrome.storage.local.get(["path", "code"], function(obj){
    document.querySelector("#path").value = joinPath(obj.path);
    document.querySelector("#code").value = joinCode(obj.code);
  });
}

function localizeHtmlPage()
{
    //Localize by replacing __MSG_***__ meta tags
    var objects = document.getElementsByTagName('html');
    for (var j = 0; j < objects.length; j++)
    {
        var obj = objects[j];

        var valStrH = obj.innerHTML.toString();
        var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function(match, v1)
        {
            console.log(v1);
            return v1 ? chrome.i18n.getMessage(v1) : "";
        });

        if(valNewH != valStrH)
        {
            obj.innerHTML = valNewH;
        }
    }
}

localizeHtmlPage();

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
