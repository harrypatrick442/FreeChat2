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
                    returns.push(i);
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