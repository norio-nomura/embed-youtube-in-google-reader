/*

The MIT License

Copyright (c) 2010 Norio Nomura

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var iframes = {};

function resizeIframe(iframe) {
    var height = iframe.clientWidth * 3 / 4;
    iframe.style.height = height + "px";
}

function handleIframeLoaded(e) {
    resizeIframe(e.target);
}

function handleBeforeLoadEvent(messageEvent) {
    var element = messageEvent.target;
    var re = /^http:\/\/i\.ytimg\.com\/vi\/([^\/]+)\/[^\/]+$/i;
    var srcs = re.exec(element.src);
    if (element.nodeName == "IMG" && srcs) {
        var iframe;
        for (var key in iframes) {
            if (iframes[key].parentNode === null) {
                iframe = iframes[key];
                delete iframes[key];
                break;
            }
        }
        if (typeof(iframe) == "undefined") {
            iframe = document.createElement("iframe");
        }
        iframe.src = "http://www.youtube.com/embed/" + srcs[1] + "?fs=1&hd=1";
        iframe.setAttribute("class", "youtube-player");
        iframe.setAttribute("type", "text/html");
        iframe.setAttribute("frameborder", "0");
        iframe.style.width = "100%";
        iframe.style.maxWidth = "640px";
        iframe.style.height = "75%";
        iframe.style.webkitTransitionProperty = 'all';
        iframe.style.webkitTransitionDuration = '0.3s';
        iframe.addEventListener("load", handleIframeLoaded, false);
        element.parentNode.parentNode.parentNode.removeAttribute("width");
        element.parentNode.parentNode.parentNode.style.width = "100%";
        element.parentNode.parentNode.parentNode.style.maxWidth = "640px";
        element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.maxWidth = "1040px";
        element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.width = "100%";
        element.parentNode.parentNode.parentNode.replaceChild(iframe, element.parentNode.parentNode);
        iframes[srcs[1]] = iframe;
    }
}

function handleKeyUpEvent(event) {
    if (!event.altKey && !event.ctrlKey && !event.metaKey && event.keyCode == 'F'.charCodeAt(0)) {
        for (var key in iframes) {
            if (iframes[key].parentNode) {
                resizeIframe(iframes[key]);
            }
        }
    }
}

document.addEventListener("beforeload", handleBeforeLoadEvent, true);
document.addEventListener("keyup", handleKeyUpEvent, false);
