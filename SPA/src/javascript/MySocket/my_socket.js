

var MySocket;
(function () {
    var connectsToRunWhenInitialized = [];
    var initializing = false;
    var initialized = false;
    var websocket;
    var usingWebsocket = false;
    var urlWS;
    var doneFirstRun = false;
    MySocket = function (className)
    {
        if (!doneFirstRun)
        {
            doneFirstRun = true;
            firstRun();
        }
        var self = this;
        self.name = getNameString();
        self.listToSend = [];
        instances.push(this);
        mapNameToInstance[self.name] = this;
        EventEnabledBuilder(self);
        var messageEvent = new CustomEvent("message");
        var openEvent = new CustomEvent("open");
        var closeEvent = new CustomEvent("close");
        this.dispatchEventMessage = function (message) {
            messageEvent.message = message;
            self.dispatchEvent(messageEvent);
        };
        self.send = function (a)
        {
            console.log('sending to server');
            console.log(a);
            var jObject = {};
            jObject.name = self.name;
            jObject.message = a;
            listToSend.push(jObject);
            sendMessages();
        };
        self.close = function (skipMessage)
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
                        sendAsynchronous(urlClose, function (response) {
                            if (response.session_id)
                            {
                                sessionId = response.session_id;
                            }
                        }, parameters);
                    } catch (ex) {
                        console.log(ex);
                    }
                }
            new Task(function () {
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
        if (!initialized && !initializing)
        {
            initializing = true;
            connectsToRunWhenInitialized.push(connect);
            initialize(function () {
                var iterator = new Iterator(connectsToRunWhenInitialized);
                while (iterator.hasNext())
                {
                    (iterator.next())();
                    iterator.remove();
                }
            });

        } else
        {
            if (initializing)
                connectsToRunWhenInitialized.push(connect);
            else
                connect();
        }
        function onConnected() {
            console.log('did onconnect');
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
        }
        function connect()
        {
            function c()
            {
                new Task(function () {
                    if (!usingWebsocket)
                    {
                        var urlConnect = window.thePageUrl + "ServletMySocket";
                        var parameters = "t=" + new Date().getTime() + "&type=connect&name=" + encodeURIComponent(self.name) + "&class=" + encodeURIComponent(className) + getSessionParameterString();
                        sendAsynchronous(urlConnect, function (response) {
                            if (response.session_id)
                            {
                                sessionId = response.session_id;
                            }
                            onConnected();
                        }, parameters);
                    }
                    else
                    {
                        websocket.send(JSON.stringify({type: 'connect', class: className, name: self.name, persistent: (Configuration.isPersistent ? true : false)})); 
                        onConnected();
                    }
                }).run();
            }
            c();
        }
    };


    MySocket.Type = {WebSocket: 'websocket', AJAX: 'ajax'};


    var timerOnClose;
    var sessionId;
    function initialize(callback)
    {
        if (!usingWebsocket) {
            timerOnClose = new Timer(function () {
                closeAll();
            }, Configuration.ajaxTimeout, 1, true);
            var urlInitialize = window.thePageUrl + "ServletMySocket";
            var parameters = "t=" + new Date().getTime() + "&type=initialize" + getSessionParameterString() + "&persistent=" + (Configuration.isPersistent ? true : false);
            sendAsynchronous(urlInitialize, function (response) {
                if (response.session_id)
                {
                    sessionId = response.session_id;
                }
                read();
                initialized = true;
                initializing = false;
                callback();
            }, parameters);
        }
        else
        {
            console.log('doing new');
            websocket = new WebSocket(urlWS);
            websocket.onopen = function () {
                var jObject = {type: 'initialize', persistent: Configuration.isPersistent};
                websocket.send(JSON.stringify(jObject));
                initialized = true;
                initializing = false;
                callback();

            };
            websocket.onclose = function () {
            };
            websocket.onmessage = function (event) {
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
        send = function (jObject)
        {
            if (usingWebsocket)
            {
                console.log('websocket it sending : ');
                console.log(jObject);
                websocket.send(JSON.stringify({type: 'messages', data: jObject, persistent: (Configuration.isPersistent ? true : false)}));
            }
            else
            {
                var urlSetsMessages = window.thePageUrl + "ServletMySocket";
                var parameters = "t=" + new Date().getTime() + "&type=messages" + getSessionParameterString() + "&data=" + encodeURIComponent(JSON.stringify(jObject));
                sendAsynchronous(urlSetsMessages, function (response) {
                    processResponses(response);
                }, parameters);
            }
        };
        if (Configuration.isPersistent)
            messagePersistenceBuffer = new MessagePersistenceBuffer(send, _processMessages);
        processMessages = (Configuration.isPersistent ? messagePersistenceBuffer.got : _processMessages);
        _sendMessages = (Configuration.isPersistent ? messagePersistenceBuffer.send : send);

        processResponses = function (jObject)
        {
            console.log('got from server:');
            console.log(jObject);
            if (timerOnClose)
            {
                timerOnClose.reset();
            }
            if (jObject.session_id)
            {
                sessionId = jObject.session_id;
            }
            switch (jObject.type) {
                case "messages":
                    processMessages(jObject.messages);
                    break;
                case 'is_disconnected':
                    console.log('is disconnected');
                    run = false;
                    timerOnClose.stop();
                    closeAll();
                    //MySocket.initialize();//reconnect when the server restarts.
                    break;
            }
        };
        sendMessages = function ()
        {
            if (timerRead)
            {
                timerRead.reset();
            }
            if (!timerSend)
            {
                timerSend = new Timer(function () {
                    var jObject = {messages: listToSend};
                    listToSend = [];
                    _sendMessages(jObject);
                }, 500, 1);
            } else
            {
                timerSend.reset();
            }

        };
        read = function ()
        {
            var funcRead;
            funcRead = function () {
                if (!run)
                    return;
                var urlSetsMessages = window.thePageUrl + "ServletMySocket";
                var parameters = "t=" + new Date().getTime() + "&type=read" + getSessionParameterString();
                sendAsynchronous(urlSetsMessages, function (response) {
                    if (response != undefined && response != null && response != "")
                    {
                        processResponses(response);
                        funcRead();
                    }

                }, parameters, Configuration.ajaxTimeout, function () {
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
            console.log(urlWS);
        }
        window.onbeforeunload = function (e) {
            var urlDisconnect = window.thePageUrl + "ServletMySocket";
            var parameters = "t=" + new Date().getTime() + "&type=disconnect" + getSessionParameterString();
            sendAsynchronous(urlDisconnect, function () {
            }, parameters);
        };
    }
    function closeAll()
    {
        console.log('closeAll');
        MySocket.closedAll = true;
        var iterator = new Iterator(openSockets);
        while (iterator.hasNext())
        {
            var instance = iterator.next();
            instance.close(true);
            iterator.remove();
        }
        websocket.close();
        delete websocket;
    };
    function getSessionParameterString()
    {

        if (sessionId)
        {
            return "&session_id=" + sessionId;
        }
        return"";
    }
})();