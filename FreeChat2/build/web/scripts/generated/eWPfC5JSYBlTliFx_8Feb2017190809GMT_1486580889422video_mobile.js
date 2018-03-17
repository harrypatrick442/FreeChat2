var isMobile=true;window.isCors=false;function EventEnabledBuilder(obj)
{

	obj.addEventListener= function ( type, listener ) {

		if ( this._listeners == undefined )
                this._listeners = {};
		var listeners = this._listeners;

		if ( listeners[ type ] == undefined ) {
			listeners[ type ] = [];
		}

		if ( listeners[ type ].indexOf( listener ) == - 1 ) {

			listeners[ type ].push( listener );

		}
	};

	obj.hasEventListener= function ( type, listener ) {

		if ( this._listeners == undefined ) return false;

		var listeners = this._listeners;

		if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 ) {

			return true;

		}

		return false;

	};

	obj.removeEventListener= function ( type, listener ) {

		if ( this._listeners == undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ type ];

		if ( listenerArray !== undefined ) {

			var index = listenerArray.indexOf( listener );

			if ( index !== - 1 ) {

				listenerArray.splice( index, 1 );

			}

		}

	};

	obj.dispatchEvent= function ( event ) {
		if ( this._listeners == undefined )
                    return;
		var listeners = this._listeners;
		var listenerArray = listeners[ event.type ];
                
		if ( listenerArray !== undefined ) {

			event.target = this;
			var array = [], i = 0;
			var length = listenerArray.length;

			for ( i = 0; i < length; i ++ ) {
				array[ i ] = listenerArray[ i ];
			}
			for ( i = 0; i < length; i ++ ) {
				array[ i ].call( this, event );

			}

		}

	};
}
function Task(callback, done)
{
        this.run = function (c)
        {
    setTimeout(function() {
        try
        {
        callback();
        }catch(ex)
        {
         console.log(ex);
        }
                    if(done)
                    {
                        try
                        {
                     done();       
                        }
                        catch(ex)
                        {
         console.log(ex);
                        }
                    }
                    if(c)
                    {
                        try
                        {
                     c();       
                        }
                        catch(ex)
                        {
         console.log(ex);
                        }
                    }
    }, 0);

       };
}
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function Timer(funct, delayMs, times, useWorkerIfAvailable, postponeStart)
{
    var self = this;
    var timesCount = 0;
    if (times == undefined)
    {
        times = -1;
    }
    if (delayMs == undefined)
    {
        delayMs = 10;
    }
    function tick()
    {
        if (times >= 0)
        {
            timesCount++;
            if (timesCount >= times)
            {
                self.stop();
            }
        }
        try
        {
            funct();
        } catch (ex)
        {
            console.log(ex);
        }
    }
    ;
    if (Timer.useWorker && (useWorkerIfAvailable == undefined || useWorkerIfAvailable))
    {


        var worker;
        try
        {

            worker = new Worker(window.thePageUrl + 'scripts/timer_worker.js');
        } catch (ex) {
            worker = new Worker(URL.createObjectURL(new Blob(["(" + TimerWorker.toString() + ")()"], {type: 'text/javascript'})));
        }
        worker.onmessage = function(e) {
            var data = e.data;
            switch (data.cmd)
            {
                case "tick":
                    tick();
                    break;
            }
        };
        this.stop = function()
        {
            worker.postMessage({'cmd': 'stop'});
        };
        this.reset = function()
        {
            timesCount = 0;
            worker.postMessage({'cmd': 'reset'});
        };
        worker.postMessage({'cmd': 'interval', 'delayMs': delayMs});
        if (!postponeStart)
            worker.postMessage({'cmd': 'start'}); // Start the worker.
    } else
    {

        var interval;
        function setInterval()
        {
            interval = window.setInterval(tick, delayMs);
        }
        function cancelInterval()
        {
            if (interval)
            {
                clearInterval(interval);
            }
        }
        this.stop = function()
        {
            cancelInterval();
        };
        this.reset = function()
        {
            timesCount = 0;
            cancelInterval();
            setInterval();
        };
        if (!postponeStart)
            setInterval();
    }
    this.setDelay = function(delay)
    {
        self.stop();
        delayMs = delay;
        self.reset();
    };
}
if (window.Worker && window.Blob)
{
    Timer.useWorker = true;
    var blob = new Blob();
    Timer.blobUrl = window.URL.createObjectURL(blob);

} else
{
    Timer.useWorker = false;
}
function TimerWorker()
{
    var self = this;
    var interval;
    function tick()
    {
        postMessage({'cmd': 'tick'});
    }
    function stop()
    {
        cancelInterval();
    }
    function _setInterval()
    {
        interval = setInterval(tick, String(self.delayMs));
    }
    function reset()
    {
        if (interval)
            cancelInterval();
        _setInterval();
    }
    ;
    function cancelInterval()
    {
        if (interval)
        {
            clearInterval(interval);
        }
    }
    function start()
    {
        _setInterval();
    }
    self.onmessage = function(e) {
        switch (e.data.cmd) {
            case 'reset':
                reset();
                break;
            case 'stop':
                stop();
                break;
            case 'start':
                start();
                break;
            case 'interval':
                self.delayMs = e.data.delayMs;
                break;
        }
    };
}
function MessageBuffer(sendUnsynched) {

    var toSend = [];
    this.getMessages = function(nMax) {
        if (nMax != undefined)
        {
            var length = toSend.length;
            var i = 0;
            var j = (length < nMax) ? length : nMax;
            while (i < j) {
                sendUnsynched(toSend.splice(0, 1)[0]);
                i++;
            }
        }
        else
        {
            var returns = toSend;
            toSend = [];
            return returns;
        }
    };
    this.send = function(jObject) {
        toSend.push(jObject);
    };
}

function objectSize(obj)
{
    var length=0;
    for(var i in obj)
    {
        length++;
    }
    return length;
}
function Iterator(array)
{
    var index=0;
    var length=array.length;
    this.next=function()
    {
        var next=array[index];
        index++;
        return next;
    };
    this.hasNext=function()
    {
      return index<length;
    };
    this.remove=function()
    {
        array.splice(index-1, 1);
        index--;
        length--;
    };
};
function AtomicBoolean(value) {
this.get=function(){return value;};
this.set=function(valueIn){value=valueIn;};
}

function Looper(SLEEP_MS) {

    if (!SLEEP_MS)
        SLEEP_MS = 60000;
    var list=[];
    var stopped = true;
    this.add = function(callbackRun) {
        if (list.indexOf(callbackRun) < 0) {
            list.push(callbackRun);
        }
        if (stopped)
        {
            timer.reset();
            stopped = false;
        }
    };
    this.remove = function(callbackRun) {
        var index = list.indexOf(callbackRun);
        if (index >= 0) {
            list.splice(index, 1);
        }
    };
    var timer = new Timer(function() {
        if (list.length < 1)
        {
            timer.stop();
            stopped = true;
            return;
        }
        var iterator = new Iterator(list);
        while (iterator.hasNext()) {
            try {
                var remove = new AtomicBoolean(false);
                (iterator.next())(remove);
                if (remove.get()) {
                    iterator.remove();
                }
            } catch (ex) {
                console.log(ex);

            }
        }
    }, SLEEP_MS, -1);
}

var SixSecondLooper = new (function() {
    var looper = new Looper(6000);
    this.add = looper.add;
    this.remove = looper.rempve;
})();

function MessagePersistenceBuffer(callbackSend, callbackGot) {
    var futureConfirmeds = new FutureConfirmeds();
    var messageBuffer = new MessageBuffer(sendUnsynched);
    var receivedHandler = new ReceivedHandler(callbackGot);
    var counterConfirmed = -1;
    var counter = 0;
    var currentBuffer = {};
    var MAX_BUFFER = 20;
    var watchDog = new WatchDog();
    
    function addToCurrentBufferJSONObject(jObject, nMessage) {
        currentBuffer[nMessage] = jObject;
    }

    function removeRangeFromCurrentBuffer(from, toInclusive) {
        var i = from;
        while (i <= toInclusive) {
            if (currentBuffer[i]) {
                delete currentBuffer[i];
            }
            i++;
        }

    }

    function writeException(o) {

    }
    function resend(list) {
        var length = list.length;
        for (var i = 0; i < length; i++) {
            var nMessage = list[i];
            if (currentBuffer[nMessage]) {
                callbackSend(currentBuffer[nMessage]);
            } else {
                console.log("ERROR" + nMessage);
                sendSkip(nMessage);
                writeException(new DroppedMessageException("A message appears to have been dropped :(! This should never happen"));
            }
        }
    }

    function sendSkip(nMessage) {
        var jObject = {type: "skip", nMessage: nMessage};
        try {
            callbackSend(jObject);
        } catch (ex) {
            console.log(ex);
        }
    }

    function fillCurrentBuffer() {
        messageBuffer.getMessages(MAX_BUFFER - (futureConfirmeds.size() + objectSize(currentBuffer)));
    }

    function confirmSent(from, toInclusive) {

        if (from <= counterConfirmed + 1) {
            if (toInclusive >= counterConfirmed + 1) {
                removeRangeFromCurrentBuffer(counterConfirmed + 1, toInclusive);
                counterConfirmed = futureConfirmeds.forwardToInclusive(toInclusive);
                futureConfirmeds.progressStart(counterConfirmed);
                fillCurrentBuffer();
            }
        } else {
            futureConfirmeds.addRange(from, toInclusive);
            removeRangeFromCurrentBuffer(from, toInclusive);
            if (counterConfirmed + 1 < counter) {
                resend(futureConfirmeds.getUnconfirmedInRange(counterConfirmed + 1, from - 1));
            }
        }
    }
    function sendConfirmation(from, toInclusive) {
        var jObjectConfirmation = {type: "confirmation", from: from, to: toInclusive};
        try {
            callbackSend(jObjectConfirmation);
        } catch (ex) {

            console.log(ex);
        }

    }
    this.send = function(jObject) {
        if (jObject) {
            messageBuffer.send(jObject);
            fillCurrentBuffer();
            watchDog.reset();
        }
    };

    function sendUnsynched(jObject) {
        if (jObject) {
            try {
                var jObjectWrapped = {type: "content", content: jObject, nMessage: counter};
                addToCurrentBufferJSONObject(jObjectWrapped, counter++);
                callbackSend(jObjectWrapped);
            } catch (ex) {
                console.log(ex);
            }
        }
    }
    this.got=function(jObject) {
        try {
            watchDog.reset();
            var type = jObject["type"];
            if (type == "confirmation") {
                confirmSent(jObject["from"], jObject["to"]);
            } else {
                if (type == "content") {
                    var nMessage = jObject["nMessage"];
                    sendConfirmation(nMessage, nMessage);
                    receivedHandler.add(jObject["content"], nMessage);
                } else {
                    if (type == "skip") {
                        var nMessage = jObject["nMessage"];
                        sendConfirmation(nMessage, nMessage);
                        receivedHandler.skip(nMessage);
                    }
                }
            }
        } catch (ex) {
            console.log(ex);
        }
    };




    function DroppedMessageException(message) {
        this.message = message;
    }

    function FutureConfirmeds() {

        var countConfirmed = -1;
        var list = [];
        this.progressStart = function(to) {
            while (countConfirmed < to) {
                list.splice(list.indexOf(++countConfirmed), 1);
            }
        };
        this.forwardToInclusive = function(toInclusive) {
            var i = toInclusive + 1;
            while (list.indexOf(i) >= 0) {
                i++;
            }
            return i - 1;
        };
        this.addRange = function(from, toInclusive) {
            var counterPOne = (countConfirmed + 1);
            for (var i = (from < counterPOne ? counterPOne : from); i <= toInclusive; i++) {
                if (!list.indexOf(i) >= 0) {
                    list.push(i);
                }
            }
        };
        this.getUnconfirmedInRange = function(from, toInclusive) {
            var returns = [];
            var counterPOne = countConfirmed + 1;
            for (var i = (from < counterPOne ? counterPOne : from); i <= toInclusive; i++) {

                if (!list.indexOf(i) >= 0) {
                    returns.add(i);
                }
            }
            return list;
        };
        this.size = function() {
            return list.length;
        };
    }
    ;
    function WatchDog() {
        var self = this;
        var reset = true;
        var removed = false;
        SixSecondLooper.add(run);
        this.reset = function() {
            reset = false;
            if (removed) {
                SixSecondLooper.add(run);
                removed = false;
            }
        };
        function run(remove) {
            if (!reset) {
                if (currentBuffer.size > 0) {
                    console.log("running_.");
                    resend(futureConfirmeds.getUnconfirmedInRange(counterConfirmed + 1, counter - 1));
                } else {
                    remove.set(true);
                    removed = true;
                }
            }
        };
    }
    function ReceivedHandler(callbackGot) {

        var map = {};
        var count = 0;
        this.add = function(jObject, nMessage) {
            if (nMessage >= count) {
                if (map[nMessage] == undefined) {
                    map[nMessage] = jObject;
                    attemptOutput();
                }
            }
        };
        this.skip = function(nMessage) {
            var jObject = {skip: true};
            map[nMessage] = jObject;
        };
        function attemptOutput() {

            var i = count;
            while (true) {
                var jObject = map[i];
                if(jObject==undefined)
                    break;
                var skip = jObject['skip'];
                if (!skip) {
                    callbackGot(jObject);
                }
                delete map[i];
                i++;
            }
            count = i;

        }
        ;
    }
}
var Ajax = new (function() {
    var self = this;
    var nId = 0;
    this.objects = {};
    this.getJsonpCallbackName = function() {
        nId++;
        return "callbackFunction" + String(nId);
    };
})();
function httpPostAsynchronous(theUrl, callback, parameters, timeout, callbackTimedOut, contentType) {
    if (parameters == undefined)
    {
        parameters = null;
    }
    if (!contentType)
        contentType = "application/x-www-form-urlencoded";
    var xmlHttp = new XMLHttpRequest();
    if (timeout)
    {
        xmlHttp.timeout = timeout;
    }
    if (callbackTimedOut)
    {
        xmlHttp.ontimeout = callbackTimedOut;
    }
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            if (callback != undefined) {
                console.log(xmlHttp.responseText);
                callback(xmlHttp.responseText);
            }
        }
    };
    xmlHttp.open("POST", theUrl, true); // false for synchronous request
    if (contentType)
        xmlHttp.setRequestHeader("Content-type", contentType);
    //xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send(parameters);
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
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            if (callback != undefined) {
                callback(xmlHttp.responseText);
            }
        }
    };
    xmlHttp.open("GET", theUrl, true); // false for synchronous request
    xmlHttp.send(null);
}
function httpJsonpAsynchronous(theUrl, callback, parameters, timeout, callbackTimedOut, async, defer)
{  
    
    var script = document.createElement('script');
    script.type = 'text/javascript';
    if (async != undefined)
        script.async = async;
    if (defer != undefined)
        script.defer = defer;
    var uniqueCallbackName = Ajax.getJsonpCallbackName();
    var timer;
    new (function(uniqueCallbackName, callback, callbackTimedOut, script) {
        var self = this;
        function deleteWaste()
        {

            if (Ajax[uniqueCallbackName])
                delete  Ajax[uniqueCallbackName];
            document.body.removeChild(script);
        }
        this.timer = new Timer(function() {
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
        Ajax[uniqueCallbackName] = function(response) {
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
        return new (function(uniqueCallbackName, timer, script) {
            this.callbackName = "Ajax." + uniqueCallbackName;
            this.run = function(newUrl) {
                script.src = newUrl;
                timer.reset();
            };
        })(uniqueCallbackName, timer, script);
    }
    var url = theUrl + (theUrl.indexOf('?') >= 0 ? '&' : '?') + 'callback=Ajax.' + uniqueCallbackName + ((parameters != undefined ) ? '&'+parameters:'');
    script.src = url;
    timer.reset();
}

var MySocket;
(function() {
    var websocket;
    var usingWebsocket = false;
    var urlWS;
    var doneFirstRun = false;
    MySocket = function(className)
    {
        if (!doneFirstRun)
        {
            doneFirstRun = true;
            firstRun();
        }
        var self = this;
        self.name = getNameString();
        instances.push(this);
        mapNameToInstance[self.name] = this;
        self.listToSend = [];
        EventEnabledBuilder(self);
        var messageEvent = new CustomEvent("message");
        var openEvent = new CustomEvent("open");
        var closeEvent = new CustomEvent("close");
        this.dispatchEventMessage = function(message) {
            messageEvent.message = message;
            self.dispatchEvent(messageEvent);
        };
        self.send = function(a)
        {
            var jObject = {};
            jObject.name = self.name;
            jObject.message = a;
            listToSend.push(jObject);
            sendMessages();
        };
        self.close = function(skipMessage)
        {
            instances.splice(instances.indexOf(self), 1);
            delete mapNameToInstance[self.name];
            if (!skipMessage)
                if (!usingWebsocket)
                {
                    var urlClose = window.thePageUrl + "ServletMySocket";
                    var parameters = "t=" + new Date().getTime() + "&type=close&name=" + encodeURIComponent(self.name) + getSessionParameterString();

                    try
                    {
                        sendAsynchronous(urlClose, function(response) {
                            var jObject = JSON.parse(response);
                            if (jObject.session_id)
                            {
                                sessionId = jObject.session_id;
                            }
                        }, parameters);
                    } catch (ex) {
                        console.log(ex);
                    }
                }
                else
                {

                }
            new Task(function() {
                try
                {
                    if (self.onclose) {
                        self.onclose();
                    }
                    self.dispatchEvent(closeEvent);
                } catch (ex) {
                    console.log(ex);
                }
            }).run();

            removeFromOpen(self);
        };

        function connect()
        {
            function c()
            {
                new Task(function() {
                    if (!usingWebsocket)
                    {
                        var urlConnect = window.thePageUrl + "ServletMySocket";
                        var parameters = "t=" + new Date().getTime() + "&type=connect&name=" + encodeURIComponent(self.name) + "&class=" + encodeURIComponent(className) + getSessionParameterString();
                        sendAsynchronous(urlConnect, function(response) {
                            var jObject = JSON.parse(response);
                            if (jObject.session_id)
                            {
                                sessionId = jObject.session_id;
                            }
                            openSockets.push(self);
                            try
                            {
                                if (self.onopen)
                                {
                                    self.onopen();
                                }
                                self.dispatchEvent(openEvent);
                            } catch (ex)
                            {
                                console.log(ex);
                            }
                        }, parameters);
                    }
                    else
                    {
                        websocket.send(JSON.stringify({type: 'connect', class: className, name: self.name, persistent: (Configuration.isPersistent ? true : false)
                        }));
                    }
                }).run();
            }
            c();
        }
        if (!timerOnClose)
        {
            initialize(connect);

        } else
        {
            connect();
        }
    };


    MySocket.Type = {WebSocket: 'websocket', AJAX: 'ajax'};


    var timerOnClose;
    var sessionId;
    function initialize(callback)
    {

        timerOnClose = new Timer(function() {
            closeAll();
        }, Configuration.ajaxTimeout, 1, true);
        if (!usingWebsocket) {
            var urlInitialize = window.thePageUrl + "ServletMySocket";
            var parameters = "t=" + new Date().getTime() + "&type=initialize" + getSessionParameterString() + "&persistent=" + (Configuration.isPersistent ? true : false);
            sendAsynchronous(urlInitialize, function(response) {
                var jObject = JSON.parse(response);
                if (jObject.session_id)
                {
                    sessionId = jObject.session_id;
                }
                read();
                callback();
            }, parameters);
        }
        else
        {
            websocket = new WebSocket(urlWS);
            websocket.onopen = function() {
                var jObject = {type: 'initialize', persistent: Configuration.isPersistent};
                websocket.send(JSON.stringify(jObject));
                callback();
            };
            websocket.onclose = function() {
            };
            websocket.onmessage = function(event) {
                processResponses(JSON.parse(event.data));
            };
        }
    }
    ;
    function removeFromOpen(instance)
    {
        var index = openSockets.indexOf(instance);
        if (index || index == 0)
        {
            openSockets.splice(index, 1);
        }
    }
    ;
    var number = 0;
    function getNameString()
    {
        var num = number;
        number++;
        return String(num);
    }
    ;
    var listToSend = [];
    var instances = [];
    var mapNameToInstance = {};
    function _processMessage(jObject)
    {
        var instance = mapNameToInstance[jObject.name];
        if (instance)
        {
            try
            {
                if (instance.onmessage)
                    instance.onmessage(jObject.message);
                instance.dispatchEventMessage(jObject.message);
            } catch (ex)
            {
                console.log(ex);
            }
        }
    }
    function _processMessages(jObject)
    {
        var messages = jObject.messages;
        if (messages)
        {
            for (var j = 0; j < messages.length; j++)
            {
                var message = messages[j];
                _processMessage(message);
            }
        }
        else
        {
            _processMessage(jObject);
        }
    }
    var listToSend = [];
    var timerRead;
    var timerSend;
    var openSockets = [];
    var run = true;
    var sendAsynchronous;
    var sendMessages;
    var read;
    var processMessages;
    var _sendMessages;
    var send;
    function firstRun()
    {
        var messagePersistenceBuffer;
        send = function(jObject)
        {

            if (usingWebsocket)
            {
                websocket.send(JSON.stringify({type: 'messages', data: encodeURIComponent(jObject), persistent: (Configuration.isPersistent ? true : false)}));
            }
            else
            {
                var urlSetsMessages = window.thePageUrl + "ServletMySocket";
                var parameters = "t=" + new Date().getTime() + "&type=messages" + getSessionParameterString() + "&data=" + JSON.stringify(jObject);
                sendAsynchronous(urlSetsMessages, function(str) {
                    processResponses(JSON.parse(str));
                }, parameters);
            }
        };
        if (Configuration.isPersistent)
            messagePersistenceBuffer = new MessagePersistenceBuffer(send, _processMessages);
        processMessages = (Configuration.isPersistent ? messagePersistenceBuffer.got : _processMessages);
        _sendMessages = (Configuration.isPersistent ? messagePersistenceBuffer.send : send);

        processResponses = function(jObject)
        {
            if (timerOnClose)
            {
                timerOnClose.reset();
            }
            if (jObject.session_id)
            {
                sessionId = jObject.session_id;
            }
            var type = jObject.type;
            if (type == "messages")
            {

                console.log('calling on: ');
                console.log(jObject);
                processMessages(jObject.messages);
            }
            else
            {
                if (type == 'is_disconnected')
                {
                    run = false;
                    timerOnClose.stop();
                    closeAll();
                    //MySocket.initialize();//reconnect when the server restarts.
                    return;
                }
            }
        }
        ;
        sendMessages = function()
        {
            if (timerRead)
            {
                timerRead.reset();
            }
            if (!timerSend)
            {
                timerSend = new Timer(function() {
                    var jObject = {};
                    jObject.messages = listToSend;
                    listToSend = [];
                    _sendMessages(jObject);
                }, 500, 1);
            } else
            {
                timerSend.reset();
            }

        }
        ;
        read = function()
        {
            var funcRead;
            funcRead = function() {
                if (!run)
                    return;
                var urlSetsMessages = window.thePageUrl + "ServletMySocket";
                var parameters = "t=" + new Date().getTime() + "&type=read" + getSessionParameterString();
                sendAsynchronous(urlSetsMessages, function(str) {
                    if (str != undefined && str != null && str != "")
                    {
                        processResponses(JSON.parse(str));
                        funcRead();
                    }

                }, parameters, Configuration.ajaxTimeout, function() {
                    funcRead();
                });
            };
            funcRead();

        }
        ;
        if (window.isCors)
            sendAsynchronous = httpJsonpAsynchronous;
        else
        if (!((!Configuration.ENDPOINT_TYPE) || (Configuration.ENDPOINT_TYPE == MySocket.Type.WebSocket)))
        {
            sendAsynchronous = httpPostAsynchronous;
        }
        else
        {
            usingWebsocket = true;
            urlWS = window.thePageUrl;
            var b = 7;
            var a = urlWS.indexOf('http://');
            if (a < 0)
                b = 8;
            urlWS = 'ws://' + urlWS.substring(a + b, urlWS.length) + 'EndpointMySocket';
        }
        window.onbeforeunload = function(e) {
            var urlDisconnect = window.thePageUrl + "ServletMySocket";
            var parameters = "t=" + new Date().getTime() + "&type=disconnect" + getSessionParameterString();
            sendAsynchronous(urlDisconnect, function() {
            }, parameters);
        };
    }
    function closeAll()
    {
        console.log('closeAll');
        MySocket.closedAll = true;
        while (openSockets.length > 0)
        {
            var instance = openSockets[0];
            instance.close(true);
        }
        if (websocket)
        {
            websocket.close();
            delete websocket;
        }
    }
    ;
    function getSessionParameterString()
    {

        if (sessionId)
        {
            return "&session_id=" + sessionId;
        }
        return"";
    }
})();

var pickupElseCreateElement;
new (function() {
    var mapElementToDefaultDisplay = {};
    pickupElseCreateElement = function(id, tag)
    {

        var element = document.getElementById(id);
        if (element)
        {
            element.style.display = getDefaultDisplay(element);
            return element;
        }
        else
        {
            var element = document.createElement(tag);
            element.id = id;
            element.isStatic = true;
            element.setAttribute("isStatic", true);
            return element;
        }
    };
    function getDefaultDisplay(element)
    {
        var display = mapElementToDefaultDisplay[element.tag];
        if (!display)
        {
            var temp = document.createElement(element.tag);
            display = temp.style.display;
            delete temp;
            mapElementToDefaultDisplay[element.tag] = display;
        }
        return display;
    }
    function getAllElementsWithAttribute(attribute)
    {
        var matchingElements = [];
        var allElements = document.getElementsByTagName('*');
        for (var i = 0, n = allElements.length; i < n; i++)
        {
            if (allElements[i].getAttribute(attribute) !== null)
            {
                // Element exists with attribute. Add to array.
                matchingElements.push(allElements[i]);
            }
        }
        return matchingElements;
    }
    var iterator = new Iterator(getAllElementsWithAttribute('isStatic'));
    while (iterator.hasNext())
    {
        var element = iterator.next();
        if (element.getAttribute('isStatic'))
        {
            element.style.display = 'none';
        }
    }
    document.body.style.display = bodyDefaultDisplay;
})();
function FfmpegWrapper(includeAudio)
{
    var self = this;
    var worker;
    this.running = false;
    try
    {
        worker = new Worker('scripts/ffmpeg_worker.js');
    } catch (ex) {
        worker = new Worker(URL.createObjectURL(new Blob(["(" + TimerWorker.toString() + ")()"], {type: 'text/javascript'})));
    }
    worker.postMessage({type: 'setup', 'ffmpegType': includeAudio ? 'audio' : 'standard'});
    function isReady() {
        return !self.running;
    }
    function parseArguments(text) {
        text = text.replace(/\s+/g, ' ');
        var args = [];
        // Allow double quotes to not split args.
        text.split('"').forEach(function(t, i) {
            t = t.trim();
            if ((i % 2) === 1) {
                args.push(t);
            } else {
                args = args.concat(t.split(" "));
            }
        });
        return args;
    }


    this.runCommand = function(inputs, arguments) {
        if (isReady()) {
            var args = parseArguments(arguments);
            var files = [];
            for (var i = 0; i < inputs.length; i++)
            {
                var input = inputs[i];
                files.push(includeAudio ? {"name": input.name, "buffer": input.data} :
                        {"name": input.name, "data": input.data});
            }
            worker.postMessage({
                type: "command",
                arguments: args,
                files: files
            });
        }
    };
    worker.onmessage = function(e) {
        var data = e.data;
        switch (data.type)
        {
            case "start":
                self.running = true;
                console.log('start');
                if (self.onstart)
                    self.onstart();
                break;
            case "done":
                self.running = false;
                alert('done');
                var results;
                if (includeAudio)
                {
                    results = [];
                    for (var i in data.data.outputFiles)
                    {
                        results.push({name: i, data: data.data.outputFiles[i]});
                    }
                }
                else
                    results = data.data;
                if (self.ondone)
                    self.ondone(results);
                break;
            case "ready":
                console.log('ready');
                if (self.onready)
                    self.onready();
                break;
            case "stdout":
                console.log('ffmpeg: ' + data.data);
                break;
        }
    };
}
function YoutubeDownloader(callbackListVideos, callbackProgress, callbackFailed) {
    var mySocket = new MySocket('video_downloader');
    mySocket.addEventListener("message", interpret
            );
    var Formats = {mp3: 'mp3', wav: 'wav', avi: 'avi', mp4: 'mp4', flv: 'flv'};
    var VideosAvailableAllowedFormats = {mp4: 'mp4', webm: 'webm', '3gpp': '3gpp'};
    var qualitiesSubStrings = ['hd', 'high', 'medium', 'low'];
    var currentFfmpegWrappers = [];
    this.getVideosAvailable = function(url) {
        if (url)
        {
            var jObject = {url: url, type: 'download'};
            console.log('sending now');
            mySocket.send(jObject);
            console.log("sent");
        }
        else
            callbackFailed('URL can not be empty!');
    };
    function interpret(event) {
        var message = event.message;
        switch (message.type)
        {
            case 'done':
                var i = new Iterator(message.cookies);
                while (i.hasNext())
                {
                    var cookie = i.next();
                    console.log(cookie);
                    document.cookie = cookie;
                }
                callbackListVideos(message.links_videos, message.links_audios, message.title, message.icon);
                break;
            case 'progress':
                callbackProgress(message.message);
                break;
            case 'failed':
                callbackFailed(message.message);
                break;
        }
    }
    function getVideoId(url)
    {
        console.log('getVideoId');
        var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[2].length == 11) {
            return match[2];
        }
    }
    this.getDownloadLink = function(url, fileName, text)
    {
        var link = document.createElement('a');
        link.href = url;
        //link.type=type;
        link.download = fileName;
        link.textContent = text;
    };
    function convert(input, toFormat, callback, callbackFailed)
    {
        console.log('convert');
        var outputFileName;
        var toAudio = false;
        switch (toFormat)
        {
            case 'mp4':
                callback({format: toFormat, data: input.data});
                return;
            case 'mp3':
                console.log('is mp3');
                outputFileName = 'output.mp3';
                toAudio = true;
                break;
            case 'wav':
                outputFileName = 'output.wav';
                break;
        }
        var ffmpegWrapper = new FfmpegWrapper(toAudio);
        ffmpegWrapper.ondone = function(results)
        {
            if (results.length > 0)
            {
                var result = results[0];
                if (result.name)
                {
                    currentFfmpegWrappers.splice(currentFfmpegWrappers.indexOf(ffmpegWrapper), 1);
                    callback({format: toFormat, data: new Uint8Array(result.data)});
                    return;
                }
            }
            callbackFailed();
        };
        currentFfmpegWrappers.push(ffmpegWrapper);
        var inputFileName = 'input.' + input.format;
        ffmpegWrapper.runCommand([{name: inputFileName, data: input.data}], '-i ' + inputFileName + ' ' + outputFileName);
    }
    //ffmpegWrapper.runCommand('input.mp4', uint8Array, '-i input.mp4 output.wav');
    //ffmpegWrapper.runCommand('input.wav', uint8Array, '-i input.wav -codec:a libmp3lame -qscale:a 2 output.mp3');
    //ffmpegWrapper.runCommand('input.mp4', uint8Array, '-i input.mp4 -vf showinfo -strict -2 output.webm');
    // ffmpegWrapper.runCommand('input.wav', new Uint8Array(result.data), '-i input.wav  output.mp3');

}
/*
 function getVideoId(url)
 {
 var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
/*var match = url.match(regExp);
 if (match && match[2].length == 11) {
 return match[2];
 }
 }
 const videoUrls = ytplayer.config.args.url_encoded_fmt_stream_map
 .split(',')
 .map(item => item
 .split('&')
 .reduce((prev, curr) => (curr = curr.split('='),
 Object.assign(prev, {[curr[0]]: decodeURIComponent(curr[1])})
 ), {})
 )
 .reduce((prev, curr) => Object.assign(prev, {
 [curr.quality + ':' + curr.type.split(';')[0]]: curr
 }), {});
 
 //console.log(videoUrls);
 
 // ES5 version
 var videoUrls = ytplayer.config.args.url_encoded_fmt_stream_map
 .split(',')
 .map(function (item) {
 return item
 .split('&')
 .reduce(function (prev, curr) {
 curr = curr.split('=');
 return Object.assign(prev, {[curr[0]]: decodeURIComponent(curr[1])});
 }, {});
 })
 .reduce(function (prev, curr) {
 return Object.assign(prev, {
 [curr.quality + ':' + curr.type.split(';')[0]]: curr
 });
 }, {});
 console.log(videoUrls);Youtu
 */


/*
 * 
 if (videoId)
 {
 alternative();
 return;
 getRawVideoInformation(videoId, function(rawVideoInformation) {
 console.log(rawVideoInformation);
 var failedMessage = 'found no suitable video sources :(!';
 if (rawVideoInformation) {
 var videoInformations = PrepareVideoInformation(rawVideoInformation);
 console.log(videoInformations);
 if (videoInformations) {
 if (videoInformations.length > 0)
 {
 callback(filterVideoInformations(videoInformations));
 return;
 }
 }
 //do other way
 
 //end do other way
 return;
 }
 callbackFailed(failedMessage);
 }, alternative);
 }*/

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Hover(element, callbackEnter, callbackLeave)
{
    var previousStyle;
    
    element.addEventListener('mouseenter', function(e){
        
                            if (!e) var e = window.event;
                            previousStyle=element.style.cssText; callbackEnter(e);
                        });
    element.addEventListener('mouseleave', function(e){
        
                            if (!e) var e = window.event;
                            element.style.cssText=previousStyle; if(callbackLeave){callbackLeave(e);}
                        });
}
function HoverAndClick(element, callbackEnter, callbackLeave, callbackMousedown, callbackMouseUp)
{
    var previousStyle;
    element.addEventListener('mouseenter', function(e){
        
                            if (!e) var e = window.event;
                            enter(e);
                        });
    element.addEventListener('mouseleave', function(e){
        
                            if (!e) var e = window.event;
                            leave(e);
                        });
    element.addEventListener('mousedown', function(e){
        
                            if (!e) var e = window.event;
                            if(callbackMousedown){leave(e);callbackMousedown(e);enter(e);}
                        });
    element.addEventListener('mouseup', function(e){
        
                            if (!e) var e = window.event;
                            if(callbackMouseUp){callbackMouseUp(e);}
                        });
    function enter(e)

    {
        previousStyle=element.style.cssText; if(callbackEnter)callbackEnter(e);
    }
    function leave(e)
    {
    element.style.cssText=previousStyle; if(callbackLeave){callbackLeave(e);}
    }
}
var CssLoader = new (function() {

    this.load = function(url) {
        var cssId = '#spinnerKartLoader';  // you could encode the css path itself to generate id..
        if (!document.getElementById(cssId))
        {
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.id = cssId;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = url;
            link.media = 'all';
            head.appendChild(link);
        }
    };
})();
function SpinnerKartLoader()
{
    CssLoader.load(window.thePageUrl+'styles/spinner_kart_loader.css');
    this.div = pickupElseCreateElement('kartLoader', 'div');
    this.div.className = 'kart-loader';
    this.div.style.paddingLeft='28px'; 
    this.div.style.paddingTop='32px'; 
    this.div.style.width='45px';
    this.div.style.height='38px';
    this.div.style.position='relative';
    this.div.style.display='inline-block';
    this.div.style.margin='0px';
    this.div.style.top='0px';
    this.div.style.bottom='0px';
    this.div.style.left='0px';
    this.div.style.right='0px';
    this.width=45;
    this.height=38;
    for (var i = 0; i < 12; i++)
    {
        var sheath = pickupElseCreateElement('sheath_'+i, 'div');
        var segment = pickupElseCreateElement('segment_'+i, 'div');
        sheath.className = 'sheath';
        segment.className = 'segment';
        this.div.appendChild(sheath);
        sheath.appendChild(segment);
    }
}
var Cursors={grab:'url('+window.thePageUrl+'cursors/hand_move_grab.png)11 0, auto', hand:'url('+window.thePageUrl+'cursors/hand_move_no_grab.png)14 0, auto'};
var Random = new (function() {
    var self = this;
    this.get = function(minIncluded, maxExclu) {
        var res = Math.floor(Math.random() * (minIncluded + maxExclu)) + minIncluded;
        if (res >= maxExclu)
            res--;
        return res;
    };
    this.getIgnoring = function(minIncluded, maxExclu, ignores)
    {
        var range = maxExclu - minIncluded;
        range -= ignores.length;
        var from = minIncluded;
        var pAt = Math.random() * range;
        var dSum = 0;
        var i = 0;
        while (i < ignores.length)
        {
            var to = ignores[i];
            var d = to - from;
            dSum += d;
            if (dSum >= pAt)
            {

                return self.get(from, to);
            }
            from = to;
            i++;
        }
        return self.get(to, maxExclu);
    };
})();
function EfficientMovingCycle(element)
{
    var self = this;
    var moveEvent;
    var upEvent;
    this.onmousedown = function () {
    };
    this.onmousemove = function () {
    };
    this.onmouseup = function () {
    };
    this.ontouchstart = function () {
    };
    this.ontouchmove = function () {
    };
    this.ontouchend = function () {
    };
    if (!isMobile)
    {
        element.addEventListener("mousedown", function (e) {
            if (!e)
                var e = window.event;
            try
            {
                if(self.onmousedown(e)==false)
                    return;
            }
            catch (ex)
            {
                console.log(ex);
            }
        if(moveEvent)
                document.documentElement.removeEventListener("mousemove", moveEvent);
            if(upEvent)
                document.documentElement.removeEventListener("mouseup", upEvent);
            moveEvent = function (e) {
                if (!e)
                    var e = window.event;
                try
                {
                    self.onmousemove(e);
                }
                catch (ex)
                {
                    console.log(ex);
                }
            };
            document.documentElement.addEventListener("mousemove", moveEvent);
            upEvent = function (e) {
                if (!e)
                    var e = window.event;
                try
                {
                    self.onmouseup(e);
                }
                catch (ex)
                {
                    console.log(ex);
                }
                document.documentElement.removeEventListener("mousemove", moveEvent);
                document.documentElement.removeEventListener("mouseup", upEvent);
            };
            document.documentElement.addEventListener("mouseup", upEvent);
        });
    }
    else
    {
        element.addEventListener("touchstart", function (e) {
            if (!e)
                var e = window.event;
            try
            {
                if(self.ontouchstart(e)==false)
                    return;
            }
            catch (ex)
            {
                console.log(ex);
            }
        if(moveEvent)
                document.documentElement.removeEventListener("mousemove", moveEvent);
            if(upEvent)
                document.documentElement.removeEventListener("mouseup", upEvent);
            moveEvent = function (e) {
                if (!e)
                    var e = window.event;
                try
                {
                    self.ontouchmove(e);
                }
                catch (ex)
                {
                    console.log(ex);
                }
                if (e.preventDefault)
                {
                    e.preventDefault();
                }
            };
            document.documentElement.addEventListener("touchmove", moveEvent);
            upEvent = function (e) {
                if (!e)
                    var e = window.event;
                try
                {
                    self.ontouchend(e);
                }
                catch (ex)
                {
                    console.log(ex);
                }
                document.documentElement.removeEventListener("touchmove", moveEvent);
                document.documentElement.removeEventListener("touchend", upEvent);
            };
            document.documentElement.addEventListener("touchend", upEvent);
            if (e.preventDefault)
            {
                e.preventDefault();
            }
        });
    } 
}

function MrVideo()
{
    var self = this;
    this.div = pickupElseCreateElement('divMrVideo', 'div');
    this.div.style.width = '100px';
    this.div.style.height = '53px';
    this.div.style.position = 'absolute';
    this.div.style.left = 'calc(50% - 50px)';
    this.div.style.zIndex = '1000';
    // this.div.style.marginLeft = '-50px';
    this.div.style.top = '10px';
    var img = pickupElseCreateElement('imgMrVideo', 'img');
    img.style.width = '100%';
    img.style.height = '100%';
    this.div.appendChild(img);
    this.div.style.cursor = Cursors.hand;
    makeUndraggable(this.div);
    makeUndraggable(img);

    function makeUndraggable(element)
    {
        element.style.webkitUserDrag = ' none';
        element.style.khtmlUserDrag = ' none';
        element.style.mozUserDrag = ' none';
        element.style.oUserDrag = ' none';
        element.style.userDrag = ' none';
    }
    (function Controller(img, div)
    {
        var CurrentEyes = {right: 'right', left: 'left', cross: 'cross', sad: 'sad'};
        var urlLeft = window.thePageUrl + 'images/video_downloader/mr_video_left.png';
        var urlRight = window.thePageUrl + 'images/video_downloader/mr_video_right.png';
        var urlCrossed = window.thePageUrl + 'images/video_downloader/mr_video_cross_eyed.png';
        var urlSad = window.thePageUrl + 'images/video_downloader/mr_video_sad.png';
        var urlSmoking = window.thePageUrl + 'images/video_downloader/mr_video_smoking.png';
        var urlSmokingStoned = window.thePageUrl + 'images/video_downloader/mr_video_smoking_stoned.png';
        var currentEyes = CurrentEyes.right;
        (function initialize()
        {
            img.src = urlRight;
        })();
        function setLeft()
        {
            img.src = urlLeft;
            currentEyes = CurrentEyes.left;
        }
        function setRight()
        {
            img.src = urlRight;
            currentEyes = CurrentEyes.right;
        }
        function setCrossed()
        {
            img.src = urlCrossed;
            currentEyes = CurrentEyes.cross;
        }
        function setSad()
        {
            img.src = urlSad;
            currentEyes = CurrentEyes.sad;
        }
        function setSmoking()
        {
            img.src = urlSmoking;
            currentEyes = CurrentEyes.smoking;
            timer.stop();
            new Timer(function() {
                img.src = urlSmokingStoned;
                timer.reset();
            }, 3000, 1, false);

        }
        self.setSmoking = setSmoking;
        function change()
        {
            if (currentEyes == CurrentEyes.right)
                setLeft();
            else
            if (currentEyes == CurrentEyes.left)
                setRight();
            else
            if (currentEyes == CurrentEyes.smoking)
                setLeft();
        }
        var timer = new Timer(function() {
            change();
            timer.setDelay(Random.get(2000, 1000));

        }, 3000, -1, false);
        var efficientMoveCycle = new EfficientMovingCycle(img);
        var start;
        efficientMoveCycle.onmousedown = function(e) {
            start = [div.offsetLeft - e.pageX, div.offsetTop - e.pageY];
            timer.stop();
            if (timerCrossEyed)
                timerCrossEyed.stop();
            setSad();
            div.style.cursor = Cursors.grab;
        };
        efficientMoveCycle.onmousemove = function(e) {
            drag((start[0] + e.pageX), (start[1] + e.pageY));
        };
        var timerCrossEyed;
        efficientMoveCycle.onmouseup = function() {
            div.style.cursor = Cursors.hand;
            setCrossed();
            if (!timerCrossEyed)
            {
                timerCrossEyed = new Timer(function() {
                    setLeft();
                    timer.reset();
                }, 2000, 1, false);
            }
            else
                timerCrossEyed.reset();
        };

        function drag(x, y)
        {
            div.style.left = String(x) + 'px';
            div.style.top = String(y) + 'px';
        }
        ;
    })(img, this.div);
}
function LobbyVideoDownloader()
{
    this.div = pickupElseCreateElement('divLobbyVideoDownloader', 'div');
    this.div.style.height = '1000px';
    this.div.style.width = '100%';
    this.div.style.textAlign = 'center';
    this.div.style.backgroundColor = '#f7f7f7';//#1199ff';
    var downloadPanel = new DownloadPanel();
    function DownloadPanel()
    {
        var youtubeDownloader = new YoutubeDownloader(function(linksVideos, linksAudios, title, icon) {
            availablePanel.setLinks(linksVideos, linksAudios);
            progressPanel.hide();
            aboutPanel.set(title, icon);
            enterPanel.unlock();

        }, function(txt) {
            enterPanel.lock();
            progressPanel.setText(txt);
        }, function(txt) {
            errorPanel.setError(txt);
            progressPanel.hide();
            aboutPanel.hide();
            enterPanel.unlock();
        });
        var borderRadiusString = '10px';
        var borderString = '2px solid #f9ddff';
        var aboutPanel = new AboutPanel();
        var enterPanel = new EnterPanel();
        var errorPanel = new ErrorPanel();
        var progressPanel = new ProgressPanel();
        availablePanel = new AvailablePanel();
        this.div = pickupElseCreateElement('divDownloadPanel', 'div');
        this.div.style.maxWidth = '100%';
        this.div.style.width = '450px';
        this.div.style.webkitBoxShadow = '1px 1px 16px 1px rgba(109,30,204,1)';
        this.div.style.mozBoxShadow = '1px 1px 16px 1px rgba(109,30,204,1)';
        this.div.style.boxShadow = '1px 1px 16px 1px rgba(109,30,204,1)';
        this.div.style.display = 'inline-block';
        this.div.style.backgroundColor = '#5A99F0';
        //this.div.style.background = 'background: -moz-radial-gradient(center, ellipse cover, rgba(0,153,204,1) 0%, rgba(255,255,255,1) 70%, rgba(255,255,255,1) 100%);'; /* ff3.6+ */
//this.div.style.background=' -webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%, rgba(0,153,204,1)), color-stop(78%, rgba(255,255,255,1)), color-stop(100%, rgba(255,255,255,1)))'; /* safari4+,chrome */
//this.div.style.background='-webkit-radial-gradient(center, ellipse cover, rgba(0,153,204,1) 0%, rgba(255,255,255,1) 78%, rgba(255,255,255,1) 100%)'; /* safari5.1+,chrome10+ */
//this.div.style.background=' -o-radial-gradient(center, ellipse cover, rgba(0,153,204,1) 0%, rgba(255,255,255,1) 78%, rgba(255,255,255,1) 100%)'; /* opera 11.10+ */
//this.div.style.background=' -ms-radial-gradient(center, ellipse cover, rgba(0,153,204,1) 0%, rgba(255,255,255,1) 78%, rgba(255,255,255,1) 100%)'; /* ie10+ */
//this.div.style.background='radial-gradient(ellipse at center, rgba(0,153,204,1) 0%, rgba(255,255,255,1) 78%, rgba(255,255,255,1) 100%)'; /* w3c */
//this.div.style.filter=" progid:DXImageTransform.Microsoft.gradient( startColorstr='#0099cc', endColorstr='#ffffff',GradientType=1 )"; /* ie6-9 */
        this.div.style.height = 'auto';
        this.div.style.top = /*String(document.documentElement.clientHeight/2)+*/'70px';
        this.div.style.position = 'relative';
        this.div.style.paddingTop = '8px';
        this.div.style.paddingBottom = '7px';
        this.div.style.textAlign = 'center';
        this.div.style.borderRadius = '8px';
        var divCentered = pickupElseCreateElement('divCenteredDownloadPanel', 'div');
        divCentered.style.width = '580px';
        divCentered.style.maxWidth = '96%';
        divCentered.style.maxWidth = 'calc(100% - 16px)';
        divCentered.style.display = 'inline-block';
        function AboutPanel()
        {
            var self = this;
            this.div = pickupElseCreateElement('divAboutPanel', 'div');
            var divText = pickupElseCreateElement('divTextAboutPanel', 'div');
            var img = pickupElseCreateElement('imgAboutPanel', 'img');
            this.div.style.width = '100%';
            this.div.style.display = 'none';
            this.div.style.marginTop = '4px';
            this.div.style.float = 'top';
            divText.style.fontFamily = 'Arial';
            divText.style.fontSize = '20px';
            divText.style.display = 'block';
            divText.style.boxSizing = 'border-box';
            divText.style.margin = '4px';
            img.style.maxHeight = '100px';
            this.set = function(title, icon) {
                if (title || icon)
                {
                    if (title)
                    {
                        divText.textContent = title;

                        divText.style.display = 'block';
                    }
                    if (icon)
                        img.src = icon;
                    self.div.style.display = 'inline-block';
                }
                else
                    self.hide();
            };
            this.hide = function() {
                self.div.style.display = 'none';
            };
            this.div.appendChild(divText);
            this.div.appendChild(img);
        }
        function EnterPanel()
        {
            var self = this;
            this.div = pickupElseCreateElement('divEnterPanel', 'div');
            var textUrl = pickupElseCreateElement('textUrlEnterPanel', 'input');
            var divUrl = pickupElseCreateElement('divUrlEnterPanel', 'div');
            var buttonDownload = pickupElseCreateElement('buttonDownloadEnterPanel', 'div');
            var imgButtonDownload = pickupElseCreateElement('imgButtonDownloadEnterPanel', 'img');
            this.div.style.heigt = 'auto';
            this.div.style.width = '100%';
            this.div.style.borderRadius = borderRadiusString;
            this.div.style.float = 'top';
            this.div.style.boxSizing = 'border-box';

            console.log('set it as: ');
            console.log(borderRadiusString);
            this.div.style.backgroundColor = '#ffffff';
            this.div.style.border = borderString;
            textUrl.type = 'text';
            textUrl.style.boxSizing = 'border-box';
            textUrl.style.height = '100%';
            textUrl.style.width = '100%';
            textUrl.style.border = '0';
            textUrl.style.borderTopLeftRadius = borderRadiusString;
            textUrl.style.borderBottomLeftRadius = borderRadiusString;
            textUrl.style.paddingLeft = '4px';
            textUrl.style.fontFamily = 'Arial';
            textUrl.style.fontSize = '20px';
            textUrl.placeholder = 'https://www.youtube.com/watch?v=G0scbIjVquU';
            textUrl.onkeydown = function(event) {
                event = event || window.event;
                if (event.keyCode == 13) {
                    startDownload();
                }
            };
            textUrl.onpaste = function(event)
            {
                new Task(function() {
                    startDownload();
                }).run();
            };
            divUrl.style.height = '35px';
            divUrl.style.overflow = 'hidden';
            divUrl.style.margin = '2px';
            divUrl.style.marginRight = '0px';
            buttonDownload.style.height = '35px';
            buttonDownload.style.width = '30px';
            buttonDownload.style.float = 'right';
            buttonDownload.style.overflow = 'hidden';
            buttonDownload.style.boxSizing = 'border-box';
            buttonDownload.style.borderTopRightRadius = borderRadiusString;
            buttonDownload.style.borderBottomRightRadius = borderRadiusString;
            buttonDownload.style.cursor = 'pointer';
            buttonDownload.style.margin = '2px';
            buttonDownload.style.marginLeft = '0px';
            imgButtonDownload.style.height = '100%';
            imgButtonDownload.style.width = '100%';
            var imgDownloadUrl = window.thePageUrl + 'images/video_downloader/download.png';
            var imgDownloadUrlClick = window.thePageUrl + 'images/video_downloader/download_click.png';
            var imgDownloadUrlHover = window.thePageUrl + 'images/video_downloader/download_hover.png';
            var imgDownloadUrlLocked = window.thePageUrl + 'images/video_downloader/download_locked.png';
            imgButtonDownload.src = imgDownloadUrl;
            var hovering = false;
            var mouseDown = false;
            var locked = false;
            if (!isMobile)
                new Hover(buttonDownload, function() {
                    hovering = true;
                    setButtonDownloadImage();
                }, function() {
                    hovering = false;
                    setButtonDownloadImage();
                });
            function setButtonDownloadImage()
            {
                if (!locked)
                {
                    if (!hovering)
                    {
                        mouseDown = false;
                        imgButtonDownload.src = imgDownloadUrl;
                    }
                    else
                    {
                        if (mouseDown)
                            imgButtonDownload.src = imgDownloadUrlClick;
                        else
                            imgButtonDownload.src = imgDownloadUrlHover;
                    }
                }
                else
                {
                    imgButtonDownload.src = imgDownloadUrlLocked;
                }
            }
            this.lock = function()
            {
                locked = true;
                buttonDownload.disabled = true;
                textUrl.disabled = true;
                setButtonDownloadImage();
            };
            this.unlock = function()
            {
                buttonDownload.disabled = false;
                textUrl.disabled = false;
                locked = false;
                setButtonDownloadImage();
            };
            function startDownload() {
                mouseDown = true;
                setButtonDownloadImage();
                if (!locked)
                {
                    self.lock();
                    new Task(function() {
                        progressPanel.setText('starting..');
                        download(textUrl.value);
                    }).run();
                }
            }
            buttonDownload.addEventListener('mousedown', startDownload);
            buttonDownload.addEventListener('mouseup', function() {
                mouseDown = false;
                setButtonDownloadImage();
            });
            this.div.appendChild(buttonDownload);
            buttonDownload.appendChild(imgButtonDownload);
            this.div.appendChild(divUrl);
            divUrl.appendChild(textUrl);
        }
        function ProgressPanel()
        {
            var self = this;
            var spinnerKartLoader = new SpinnerKartLoader();
            this.div = pickupElseCreateElement('divProgressPanel', 'div');
            var divText = pickupElseCreateElement('divTextProgressPanel', 'div');
            this.div.style.width = '100%';
            this.div.style.display = 'none';
            this.div.style.border = borderString;
            this.div.style.backgroundColor = '#711089';
            this.div.style.marginTop = '4px';
            this.div.style.float = 'top';
            this.div.style.boxSizing = 'border-box';
            divText.style.fontFamily = 'Arial';
            divText.style.fontSize = '20px';
            divText.style.color = '#0c1849';
            divText.style.boxSizing = 'border-box';
            divText.style.margin = '4px';
            this.setText = function(text) {
                if (text)
                {
                    divText.textContent = text;
                    self.div.style.display = 'inline-block';
                }
                else
                    self.hide();
            };
            this.hide = function() {
                self.div.style.display = 'none';
            };
            this.div.appendChild(divText);
            this.div.appendChild(spinnerKartLoader.div);
        }
        function ErrorPanel()
        {
            var self = this;
            this.div = pickupElseCreateElement('divErrorPanel', 'div');
            var divText = pickupElseCreateElement('divTextErrorPanel', 'div');
            this.div.style.width = '100%';
            this.div.style.display = 'none';
            this.div.style.border = borderString;
            this.div.style.backgroundColor = '#ffffff';
            this.div.style.marginTop = '4px';
            this.div.style.float = 'top';

            this.div.style.boxSizing = 'border-box';
            divText.style.fontFamily = 'Arial';
            divText.style.fontSize = '20px';
            divText.style.color = '#dd1d1d';
            divText.style.boxSizing = 'border-box';
            divText.style.margin = '4px';
            this.setError = function(text) {
                if (text)
                {
                    divText.textContent = text;
                    self.div.style.display = 'inline-block';
                }
                else
                    self.hide();
            };
            this.hide = function() {
                self.div.style.display = 'none';
            };
            this.div.appendChild(divText);
        }
        function AvailablePanel()
        {
            var self = this;
            this.div = pickupElseCreateElement('divAvailablePanel', 'div');
            this.div.style.width = '100%';
            this.div.style.display = 'none';
            this.div.style.marginTop = '4px';
            this.div.style.float = 'top';
            this.div.style.boxSizing = 'border-box';
            var linkButtons = [];
            var nLinkButton = 0;
            function LinkButton(link, isMp3)
            {
                var self = this;
                this.div = pickupElseCreateElement('divLinkButton' + nLinkButton, 'div');
                this.div.style.height = '34px';
                if (document.body.clientWidth > 400)
                {
                    this.div.style.width = '31%';
                    this.div.style.width = 'calc(33.3% - 4px)';
                }
                else
                {
                    if (document.body.clientWidth > 200)
                    {
                        this.div.style.width = '48%';
                        this.div.style.width = 'calc(50% - 4px)';
                    }
                    else
                    {
                        this.div.style.width = '96%';
                        this.div.style.width = 'calc(100% - 4px)';
                    }
                }
                this.div.style.float = 'left';
                this.div.style.position = 'relative';
                this.div.style.overflow = 'hidden';
                this.div.style.boxSizing = 'border-box';
                var img = pickupElseCreateElement('imgLinkButton' + nLinkButton, 'img');
                img.style.height = '100%';
                img.style.width = '100%';
                img.style.position = 'absolute';
                img.style.left = '0px';
                var divText = pickupElseCreateElement('divTextLinkButton' + nLinkButton, 'a');
                divText.href = link.url;
                divText.type = 'video/' + link.type;
                divText.download = 'video';
                divText.style.textDecoration = 'none';
                divText.style.width = '100%';
                divText.style.left = '0px';
                divText.style.top = '3px';
                divText.style.position = 'absolute';
                divText.textContent = link.format + (link.quality ? '(' + link.quality + ')' : '');
                divText.style.fontFamily = 'Arial';
                divText.style.fontSize = '20px';
                divText.style.textAlign = 'center';
                divText.style.verticalAlign = 'middle';
                divText.style.overflow = 'hidden';
                divText.style.display = 'inline-block';
                divText.style.textOverflow = 'ellipsis';
                divText.style.whiteSpace = 'nowrap';
                divText.style.color = '#000000';
                this.div.appendChild(img);
                this.div.appendChild(divText);
                this.div.style.borderRadius = '6px';
                this.div.style.cursor = 'pointer';
                this.div.style.border = borderString;
                this.div.style.margin = '2px';
                var url1 = 'images/video_downloader/download_specific.png';
                var url2 = 'images/video_downloader/download_specific_hover.png';
                var imgUrl = window.thePageUrl + (isMp3 ? url2 : url1);
                var imgUrlClick = window.thePageUrl + 'images/video_downloader/download_specific_clicked.png';
                var imgUrlHover = window.thePageUrl + (isMp3 ? url1 : url2);
                var hovering = false;
                var mouseDown = false;
                new Hover(self.div, function() {
                    hovering = true;
                    setImage();
                }, function() {
                    hovering = false;
                    setImage();
                });
                function setImage()
                {
                    if (!hovering)
                    {
                        mouseDown = false;
                        img.src = imgUrl;
                    }
                    else
                    {
                        if (mouseDown)
                            img.src = imgUrlClick;
                        else
                            img.src = imgUrlHover;
                    }
                }
                setImage();
                this.div.addEventListener('mousedown', function() {
                    mouseDown = true;
                    setImage();
                });
                this.div.addEventListener('mouseup', function() {
                    mouseDown = false;
                    setImage();
                    mrVideo.setSmoking();
                });
                nLinkButton++;
            }
            this.setLinks = function(linksVideos, linksAudios) {
                clearLinks();
                var iterator = new Iterator(linksVideos);
                while (iterator.hasNext())
                {
                    var link = iterator.next();
                    var linkButton = new LinkButton(link, false);
                    linkButtons.push(linkButton);
                    self.div.appendChild(linkButton.div);
                }
                iterator = new Iterator(linksAudios);
                while (iterator.hasNext())
                {
                    var link = iterator.next();
                    var linkButton = new LinkButton(link, true);
                    linkButtons.push(linkButton);
                    self.div.appendChild(linkButton.div);
                }
                this.div.style.display = 'inline-block';
            };
            this.clearLinks = clearLinks;
            function clearLinks()
            {
                nLinkButton = 0;
                self.div.style.display = 'none';
                var iterator = new Iterator(linkButtons);
                while (iterator.hasNext())
                {
                    var linkButton = iterator.next();
                    self.div.removeChild(linkButton.div);
                    iterator.remove();
                }
            }
        }
        this.div.appendChild(divCentered);
        divCentered.appendChild(aboutPanel.div);
        divCentered.appendChild(enterPanel.div);
        divCentered.appendChild(progressPanel.div);
        divCentered.appendChild(availablePanel.div);
        divCentered.appendChild(errorPanel.div);
        function download(url)
        {
            errorPanel.hide();
            youtubeDownloader.getVideosAvailable(url);
            availablePanel.clearLinks();
            aboutPanel.hide();
        }
        function failed(text)
        {
            if (!text)
                text = 'Sorry but downloading failed! Please try again!';
            errorPanel.setError(text);
        }
    }
    try
    {
        var mrVideo = new MrVideo();
        this.div.appendChild(mrVideo.div);
    }
    catch (ex)
    {
        console.log(ex);
    }
    this.div.appendChild(downloadPanel.div);
    document.body.appendChild(this.div);
    document.body.style.padding = '0';
    document.body.style.margin = '0';
}
var Configuration={};Configuration.debugging=false;Configuration.ajaxTimeout=120000;Configuration.authenticationType='full';Configuration.isPersistent=false;if(!window.isCors)Configuration.videoEnabled=true;Configuration.wallsEnabled=false;Configuration.allowRude=true;if(window.isCors==undefined)window.isCors=false;Configuration.emoticonsXmlString = "<?xml version=\'1.0\' encoding=\'UTF-8\' ?> \n<messaging_emoticons>\n  <folder>\n      <path>emoticons-icons-pack-42286<\/path>\n      <name>general<\/name>\n    <emoticon>\n<path>smile.gif<\/path>\n      <string>:)<\/string>\n      <String>:-)<\/String>\n      <string>:smile:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>grin.png<\/path>\n      <string>:D<\/string>\n      <String>:d<\/String>\n      <string>:grin:<\/string>\n    <\/emoticon>\n    <emoticon>\n<path>0.gif<\/path>\n      <string>:kiss:<\/string>\n      <string>:*<\/string>\n      <string>:-*<\/string>\n    <\/emoticon>\n\n    <emoticon>\n<path>1.gif<\/path>\n      <string>:snigger:<\/string>\n      <string>:chuckle:<\/string>\n    <\/emoticon>\n<emoticon>\n<path>2.gif<\/path>\n      <string>:cry:<\/string>\n      <string>:\'(<\/string>\n      <string>:,(<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>3.gif<\/path>\n      <string>:laugh:<\/string>\n      <string>:lol:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>4.gif<\/path>\n      <string>:sun:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>5.gif<\/path>\n      <string>:doubt:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>6.gif<\/path>\n      <string>:rara:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>7.gif<\/path>\n      <string>>:clap:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>8.gif<\/path>\n      <string>:present:<\/string>\n      <string>:gift:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>9.gif<\/path>\n      <string>:angry:<\/string>\n      <string>:snarl:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>10.gif<\/path>\n      <string>:mobile:<\/string>\n      <string>:cell:<\/string>\n      <string>:phone:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>12.gif<\/path>\n      <string>:brokenheart:<\/string>\n      <string>:nolove:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>13.gif<\/path>\n      <string>&lt;3<\/string>\n      <string>:heart:<\/string>\n      <string>:love:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>14.gif<\/path>\n      <string>:drink:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>15.gif<\/path>\n      <string>:peace:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>16.gif<\/path>\n      <string>:wine:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>17.gif<\/path>\n      <string>:fedup:<\/string>\n      <string>:bored:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>18.gif<\/path>\n      <string>:hide:<\/string>\n      <string>:peak:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>19.gif<\/path>\n      <string>:cloud:<\/string>\n      <string>:clouds:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>20.gif<\/path>\n      <string>:music:<\/string>\n      <string>:notes:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>21.gif<\/path>\n      <string>:speachless:<\/string>\n      <string>:shocked:<\/string>\n      <string>:O<\/string>\n      <string>:o<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>23.gif<\/path>\n      <string>:disgusted:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>24.gif<\/path>\n      <string>:karate:<\/string>\n      <string>:threaten:<\/string>\n    <\/emoticon>\n\n\n    <emoticon>\n        <path>25.gif<\/path>\n      <string>:moon:<\/string>\n      <string>:night:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>26.gif<\/path>\n      <string>:bomb:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>27.gif<\/path>\n      <string>:wink:<\/string>\n      <string>;)<\/string>\n      <string>;-)<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>28.gif<\/path>\n      <string>:agent:<\/string>\n      <string>:spy:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>29.gif<\/path>\n      <string>:teary:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>30.gif<\/path>\n      <string>:balloons:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>31.gif<\/path>\n        <string>:rainbow:<\/string>\n\n    <\/emoticon>\n\n    <emoticon>\n        <path>32.gif<\/path>\n      <string>:chopper:<\/string>\n      <string>:cleaver:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>35.gif<\/path>\n      <string>:handshake:<\/string>\n      <string>:shake:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>36.gif<\/path>\n      <string>:stars:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>37.gif<\/path>\n      <string>:coffee:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>39.gif<\/path>\n      <string>:cake:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>40.gif<\/path>\n      <string>:delight:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>41.gif<\/path>\n      <string>:blush:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>43.gif<\/path>\n      <string>:sad:<\/string>\n      <string>:(<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>45.gif<\/path>\n      <string>:snail:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>46.gif<\/path>\n      <string>:poop:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>47.gif<\/path>\n      <string>:wave:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>48.gif<\/path>\n      <string>:idea:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>53.gif<\/path>\n      <string>:shhh:<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>42.gif<\/path>\n      <string>:impertinent:<\/string>\n      <string>:-P<\/string>\n      <string>:-p<\/string>\n      <string>:P<\/string>\n      <string>:p<\/string>\n    <\/emoticon>\n\n    <emoticon>\n        <path>54.gif<\/path>\n      <string>:ok:<\/string>\n    <\/emoticon>\n  <\/folder>\n  \n  <folderXXX>\n      <path>evil<\/path>\n      <name>evil<\/name>\n    <emoticon>\n        <path>animated-devil-smiley-image-0164.gif<\/path>\n      <string>:evil1:<\/string>\n    <\/emoticon>\n    \n    <emoticon>\n        <path>smileys-devil-006872.gif<\/path>\n      <string>:666:<\/string>\n    <\/emoticon>\n    \n    <emoticon>\n        <path>smileys-devil-195541.gif<\/path>\n      <string>:satan:<\/string>\n    <\/emoticon>\n    \n    <emoticon>\n        <path>smileys-devil-558545.gif<\/path>\n      <string>:evil5:<\/string>\n    <\/emoticon>\n    \n    <emoticon>\n        <path>smileys-devil-229910.gif<\/path>\n      <string>:evil2:<\/string>\n    <\/emoticon>\n    \n    <emoticon>\n        <path>smileys-devil-352992.gif<\/path>\n      <string>:evil3:<\/string>\n    <\/emoticon>\n    \n    <emoticon>\n        <path>smileys-devil-360723.gif<\/path>\n      <string>:evil4:<\/string>\n    <\/emoticon>\n    \n    <emoticon>\n        <path>smileys-devil-828560.gif<\/path>\n      <string>:evil6:<\/string>\n    <\/emoticon>\n  <\/folderXXX>\n  \n  <folderXXX>\n    <path>offensive<\/path>\n    <name>offensive<\/name>\n    <emoticon>\n        <path>animated-bizarre-smiley-image-0021.gif<\/path>\n      <string>:bukake:<\/string>\n    <\/emoticon>\n    \n    <emoticon>\n        <path>animated-bizarre-smiley-image-0043.gif<\/path>\n      <string>:breast:<\/string>\n    <\/emoticon>\n    \n    <emoticon>\n        <path>animated-bizarre-smiley-image-0038.gif<\/path>\n        <string>:zoophilia:<\/string>\n      <string>:welsh:<\/string>\n    <\/emoticon>\n    \n    <emoticon>\n        <path>animated-bizarre-smiley-image-0047.gif<\/path>\n      <string>:shag:<\/string>\n    <\/emoticon>\n    \n    <emoticon>\n        <path>animated-love-smiley-image-0051.gif<\/path>\n      <string>:dogging:<\/string>\n    <\/emoticon>\n    \n    <emoticon>\n        <path>animated-bizarre-smiley-image-0004.gif<\/path>\n      <string>:flash:<\/string>\n    <\/emoticon>\n    \n    <emoticon>\n        <path>animated-bizarre-smiley-image-0019.gif<\/path>\n      <string>:wank:<\/string>\n    <\/emoticon>\n    \n    <emoticon>\n        <path>0084.gif<\/path>\n      <string>:bums:<\/string>\n    <\/emoticon>\n    \n    <emoticon>\n        <path>fart1.gif<\/path>\n      <string>:fart:<\/string>\n    <\/emoticon>\n    \n    <emoticon>\n        <path>frombehind.gif<\/path>\n      <string>:anal:<\/string>\n    <\/emoticon>\n    \n    <emoticon>\n        <path>spermy3.gif<\/path>\n      <string>:sperm:<\/string>\n    <\/emoticon>\n    \n    <emoticon>\n        <path>animated-bizarre-smiley-image-0017.gif<\/path>\n      <string>:oral:<\/string>\n    <\/emoticon>\n  <\/folderXXX>\n  \n  <folderXXX>\n      <path>toilet<\/path>\n      <name>toilet<\/name>\n    <emoticon>\n        <path>smiley-toilet06.gif<\/path>\n      <string>:2:<\/string>\n    <\/emoticon>\n    \n    <emoticon>\n        <path>smiley-toilet13.gif<\/path>\n      <string>:sitting:<\/string>\n    <\/emoticon>\n    \n    \n    <emoticon>\n        <path>smiley-toilet02.gif<\/path>\n      <string>:urinal:<\/string>\n    <\/emoticon>\n  <\/folderXXX>\n  <folder>\n      <path>aliens<\/path>\n      <name>aliens<\/name>\n    <emoticon>\n        <path>alien42.gif<\/path>\n      <string>:alien42:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>alien47.gif<\/path>\n      <string>:alien47:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>alien48.gif<\/path>\n      <string>:alien48:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>alien49.gif<\/path>\n      <string>:alien49:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>alien51.gif<\/path>\n      <string>:alien51:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>alien60.gif<\/path>\n      <string>:alien60:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>alien66.gif<\/path>\n      <string>:alien66:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>alien70.gif<\/path>\n      <string>:alien70:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>alien72.gif<\/path>\n      <string>:alien72:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>alien73.gif<\/path>\n      <string>:alien73:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>alien80.gif<\/path>\n      <string>:alien80:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>alien81.gif<\/path>\n      <string>:alien81:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>alien82.gif<\/path>\n      <string>:alien82:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>alien85.gif<\/path>\n      <string>:alien85:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>alien93.gif<\/path>\n      <string>:alien93:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>alien95.gif<\/path>\n      <string>:alien95:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>alien96.gif<\/path>\n      <string>:alien96:<\/string>\n    <\/emoticon>\n  <\/folder>\n  <folder>\n      <path>signs<\/path>\n      <name>signs<\/name>\n    <emoticon>\n        <path>smileys-smiley-with-sign-363798.gif<\/path>\n      <string>:do not feed:<\/string>\n    <\/emoticon>\n    <emoticonXXX>\n        <path>smileys-smiley-with-sign-083208.gif<\/path>\n      <string>:idiot:<\/string>\n    <\/emoticonXXX>\n    <emoticon>\n        <path>welcome1.gif<\/path>\n      <string>:welcome:<\/string>\n    <\/emoticon>\n    <emoticonXXX>\n        <path>feminazi_smiley.gif<\/path>\n      <string>:feminazi:<\/string>\n    <\/emoticonXXX>\n  <\/folder>\n  <folder>\n      <path>animals<\/path>\n      <name>animals<\/name>\n    <emoticon>\n        <path>serpentbleu.gif<\/path>\n      <string>:snake:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>sponge1.gif<\/path>\n      <string>:spongebob:<\/string>\n    <\/emoticon>\n    <emoticonXXX>\n        <path>bear1.gif<\/path>\n      <string>:bear:<\/string>\n    <\/emoticonXXX>\n    <emoticon>\n        <path>butterfly07.gif<\/path>\n      <string>:butterfly1:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>butterfly08.gif<\/path>\n      <string>:butterfly2:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>fish5.gif<\/path>\n      <string>:fish1:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>fish10.gif<\/path>\n      <string>:fish2:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>parrot.gif<\/path>\n      <string>:parrot:<\/string>\n    <\/emoticon>\n  <\/folder>\n  <folderXXX>\n      <path>drugs<\/path>\n      <name>drugs<\/name>\n    <emoticon>\n        <path>bong.gif<\/path>\n      <string>:bong:<\/string>\n    <\/emoticon>\n    <emoticon>\n      <string>:cigarette:<\/string>\n        <path>cigarette.gif<\/path>\n    <\/emoticon>\n    <emoticon>\n        <path>joint.gif<\/path>\n      <string>:joint:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>passing-joint-smiley-emoticon.gif<\/path>\n      <string>:passing_joint:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>smiley-rolling-joint.gif<\/path>\n      <string>:rolling:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>drugs.gif<\/path>\n      <string>:drugs:<\/string>\n    <\/emoticon>\n  <\/folderXXX>\n  <folder>\n      <path>transport<\/path>\n      <name>transport<\/name>\n    <emoticon>\n        <path>smiley-transport003.gif<\/path>\n      <string>:sherif:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>smiley-transport022.gif<\/path>\n      <string>:train:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>smiley-transport029.gif<\/path>\n      <string>:school_bus:<\/string>\n    <\/emoticon>\n  <\/folder>\n  <folder>\n      <path>violent<\/path>\n      <name>violent<\/name>\n    <emoticon>\n        <path>smiley-violent013.gif<\/path>\n      <string>:chainsaw:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>smiley-violent029.gif<\/path>\n      <string>:microwave:<\/string>\n    <\/emoticon>\n  <\/folder>\n  <folder>\n      <path>sport<\/path>\n      <name>sport<\/name>\n    <emoticon>\n        <path>smiley-sport002.gif<\/path>\n      <string>:header:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>smiley-sport003.gif<\/path>\n      <string>:goal:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>smiley-sport006.gif<\/path>\n      <string>:football:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>smiley-sport007.gif<\/path>\n      <string>:surfing:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>smiley-sport017.gif<\/path>\n      <string>:weights:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>smiley-sport031.gif<\/path>\n      <string>:ref:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>smiley-sport035.gif<\/path>\n      <string>:spectator:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>smiley-sport037.gif<\/path>\n      <string>:shooting:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>smiley-sport038.gif<\/path>\n      <string>:diving:<\/string>\n    <\/emoticon>\n    <emoticon>\n        <path>smiley-sport041.gif<\/path>\n      <string>:fishing:<\/string>\n    <\/emoticon>\n  <\/folder>\n<\/messaging_emoticons>\n";Configuration.radioChannelsXmlString = "<?xml version=\'1.0\' encoding=\'UTF-8\' ?> \n<channels>\n    <channel>\n        <url>http:\/\/bbcmedia.ic.llnwd.net\/stream\/bbcmedia_radio2_mf_q<\/url>\n        <name>BBC Radio 2<\/name>\n    <\/channel>\n    <channel>\n        <url>http:\/\/bbcmedia.ic.llnwd.net\/stream\/bbcmedia_6music_mf_p<\/url>\n        <name>BBC 6<\/name>\n    <\/channel>\n    <channel>\n        <url>http:\/\/media-ice.musicradio.com\/CapitalSouthCoastMP3<\/url>\n        <name>103.2 Capital FM<\/name>\n    <\/channel>\n    <channel>\n        <url>http:\/\/ice-sov.musicradio.com:80\/CapitalXTRALondon<\/url>\n        <name>Capital XTRA London<\/name>\n    <\/channel>\n    <channel>\n        <url>http:\/\/media-ice.musicradio.com:80\/ClassicFMMP3<\/url>\n        <name>Classic FM<\/name>\n    <\/channel>\n    <channel>\n        <url>http:\/\/ice01.va.audionow.com:8000\/DesiBite.mp3<\/url>\n        <name>Desi Bite Radio<\/name>\n    <\/channel>\n    <channel>\n        <url>http:\/\/ice-sov.musicradio.com:80\/HeartLondonMP3<\/url>\n        <name>Heart 106.2 FM<\/name>\n    <\/channel>\n    <channel>\n        <url>http:\/\/icy-e-bz-03-gos.sharp-stream.com:8000\/metro.mp3<\/url>\n        <name>Metro Radio<\/name>\n    <\/channel>\n    <channel>\n        <url>http:\/\/s3.xrad.io:8096<\/url>\n        <name>107.7 Splash FM<\/name>\n    <\/channel>\n    <channel>\n        <url>http:\/\/s04.whooshclouds.net:8220\/live<\/url>\n        <name>Totalrock<\/name>\n    <\/channel>\n    <channel>\n        <url>http:\/\/radio.virginradio.co.uk\/stream<\/url>\n        <name>Virgin Radio UK<\/name>\n    <\/channel>\n    <channel>\n        <url>http:\/\/media-ice.musicradio.com:80\/Capital<\/url>\n        <name>Capital FM<\/name>\n    <\/channel>\n<\/channels>\n";Configuration.pageType='video_mobile';Configuration.ENDPOINT_TYPE =  MySocket.Type.AJAX;Configuration.forcedImports=[pickupElseCreateElement];var preloadedImages=[];var imagesToPreload=[window.thePageUrl+'images/video_downloader/download.png',window.thePageUrl+'images/video_downloader/download_click.png',window.thePageUrl+'images/video_downloader/download_hover.png',window.thePageUrl+'images/video_downloader/download_locked.png',window.thePageUrl+'images/video_downloader/download_specific.png',window.thePageUrl+'images/video_downloader/download_specific_clicked.png',window.thePageUrl+'images/video_downloader/download_specific_hover.png',window.thePageUrl+'images/video_downloader/joint.png',window.thePageUrl+'images/video_downloader/mr_video_cross_eyed.png',window.thePageUrl+'images/video_downloader/mr_video_left.png',window.thePageUrl+'images/video_downloader/mr_video_right.png',window.thePageUrl+'images/video_downloader/mr_video_sad.png',window.thePageUrl+'images/video_downloader/mr_video_smoking.png',window.thePageUrl+'images/video_downloader/mr_video_smoking_stoned.png']; var taskPreloadImages = new Task(function(){for(var i=0; i<imagesToPreload.length; i++){var img = new Image(); img.src=imagesToPreload[i]; preloadedImages.push(img);}});var lobby = new LobbyVideoDownloader();