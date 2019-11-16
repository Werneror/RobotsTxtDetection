# RobotsTxtDetection

Automatically check whether a website has robots.txt.

## Installation

This browser extension is compatible with Firefox and Google Chrome. However, we recommend using it in Firefox.

### Firefox

Open <https://addons.mozilla.org/firefox/addon/robots-txt-detection/>, and click `Add to Firefox`.

### Google Chrome

Download source code.

```
git clone https://github.com/Werneror/RobotsTxtDetection.git
```

Open Google Chrome, enter `Chrome://extensions/` in the address bar, enable `Developer mode`, click `Load unpacked` and  chose `RobotsTxtDetection`。

## Usage

Surf the web as usual, and if a website has robots.txt, a small icon will appear automatically, or a gray icon will automatically light up.

## Configuration 

By default, only `/robots.txt` is detected. You can configure to detect more paths. If the path starts with `/` absolute path is detected, otherwise relative path is detected.

The HTTP status code 404, 301, or 302 assumes that the path does not exist. You can also configure other HTTP status codes if necessary. 

For example, your configuration is to detect:

```
/robots.txt
security.txt
```

and you are visiting `https://www.example.com/test/index.html`, we actually detect:

```
https://www.example.com/robots.txt
https://www.example.com/test/security.txt
```

## Details

### Cache

The path of a website is relatively stable, generally speaking, it will not change frequently. So we cache as much as we can. Requests for a specific URL will only be sent once, unless the browser is restarted.

### Redirect

In fact, we can't get the 301 or 302 status code because `XMLHttpRequest` automatically follows the redirection. We compare the URL of the request and the URL of the response to determine whether a redirect has occurred. So we can't distinguish 301 and 302 very well.

## License

MIT
