
var Ajax = new (function () {
    var self = this;
    var nId = 0;
    this.objects = {};
    this.getJsonpCallbackName = function () {
        nId++;
        return "callbackFunction" + String(nId);
    };
})();
function httpPostAsynchronous(theUrl, callback, toSend, timeout, callbackTimedOut) {
    if (!toSend)
    {
        toSend = null;
    }
    var xmlHttp = new XMLHttpRequest();
    if (timeout)
    {
        xmlHttp.timeout = timeout;
    }
    if (callbackTimedOut)
    {
        xmlHttp.ontimeout = callbackTimedOut;
    }
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            if (callback != undefined) {
                console.log(xmlHttp.responseText);
                callback(xmlHttp.responseText);
            }
        }
    };
    xmlHttp.open("POST", theUrl, true); // false for synchronous request
    xmlHttp.send(toSend);
}
function httpGetAsynchronous(theUrl, callback, timeout, callbackTimedOut) {
    //function used to communicate with a handler sending parameters and retrieving a json object.
    var xmlHttp = new XMLHttpRequest();
    if (timeout)
    {
        xmlHttp.timeout = timeout;
    }
    if (callbackTimedOut)
    {
        xmlHttp.ontimeout = callbackTimedOut;
    }
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            if (callback != undefined) {
                callback(xmlHttp.responseText);
            }
        }
    };
    xmlHttp.open("GET", theUrl, true); // false for synchronous request
    xmlHttp.send(null);
}
function httpJsonpAsynchronous(theUrl, callback, toSend, timeout, callbackTimedOut, async, defer)
{
    var script = document.createElement('script');
    script.type = 'text/javascript';
    if (async != undefined)
        script.async = async;
    if (defer != undefined)
        script.defer = defer;
    var uniqueCallbackName = Ajax.getJsonpCallbackName();
    var timer;
    new (function (uniqueCallbackName, callback, callbackTimedOut, script) {
        var self=this;
        function deleteWaste()
        {
            
            if (Ajax[uniqueCallbackName])
                delete  Ajax[uniqueCallbackName];
           document.body.removeChild(script);
        }
        this.timer = new Timer(function () {
            console.log('trying to time out');
            return;
            if (callbackTimedOut)
            {
                try
                {
                    callbackTimedOut();
                } catch (ex) {
                    console.log(ex);
                }
            }
            deleteWaste();
        }
        , timeout, 1, true, true);
        timer = this.timer;
        Ajax[uniqueCallbackName] = function (response) {
            self.timer.stop();
            if (callback)
            {
                try
                {
                    callback(response);
                } catch (ex)
                {
                    console.log(ex);
                }
            }
            deleteWaste();
        };
    })(uniqueCallbackName, callback, callbackTimedOut, script);
    document.body.appendChild(script);
    if (!theUrl)
    {
        return new (function (uniqueCallbackName, timer, script) {
            this.callbackName = "Ajax." + uniqueCallbackName;
            this.run = function (newUrl) {
                script.src = newUrl;
                timer.reset();
            };
        })(uniqueCallbackName, timer, script);
    }
    var url = theUrl + (theUrl.indexOf('?') >= 0 ? '&' : '?') + 'callback=Ajax.' + uniqueCallbackName +'&data=' + (toSend != undefined ? encodeURIComponent(toSend) : '');
    script.src = url;
    timer.reset();


}