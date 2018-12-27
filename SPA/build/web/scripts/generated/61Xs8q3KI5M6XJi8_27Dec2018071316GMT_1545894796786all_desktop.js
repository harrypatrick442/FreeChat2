var isMobile=false;window.isCors=false;function EventEnabledBuilder(obj)
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
        /*try
        {

            worker = new Worker(window.thePageUrl + 'scripts/timer_worker.js');
        } catch (ex) {
          *///  console.log("(" + TimerWorker.toString() + ")();");
            worker = new Worker(URL.createObjectURL(new Blob(["(" + TimerWorker.toString() + ")();"], {type: 'text/javascript'})));
        //}
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
/* NUGET: BEGIN LICENSE TEXT
 *
 * Microsoft grants you the right to use these script files for the sole
 * purpose of either: (i) interacting through your browser with the Microsoft
 * website or online service, subject to the applicable licensing or use
 * terms; or (ii) using the files as included with a Microsoft product subject
 * to that product's license terms. Microsoft reserves all other rights to the
 * files not expressly granted by Microsoft, whether by implication, estoppel
 * or otherwise. Insofar as a script file is dual licensed under GPL,
 * Microsoft neither took the code under GPL nor distributes it thereunder but
 * under the terms set out in this paragraph. All notices and licenses
 * below are for informational purposes only.
 *
 * JQUERY CORE 1.10.2; Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors; http://jquery.org/license
 * Includes Sizzle.js; Copyright 2013 jQuery Foundation, Inc. and other contributors; http://opensource.org/licenses/MIT
 *
 * NUGET: END LICENSE TEXT */
/*! jQuery v1.10.2 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license
//@ sourceMappingURL=jquery-1.10.2.min.map
*/
(function(e,t){var n,r,i=typeof t,o=e.location,a=e.document,s=a.documentElement,l=e.jQuery,u=e.$,c={},p=[],f="1.10.2",d=p.concat,h=p.push,g=p.slice,m=p.indexOf,y=c.toString,v=c.hasOwnProperty,b=f.trim,x=function(e,t){return new x.fn.init(e,t,r)},w=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,T=/\S+/g,C=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,N=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,k=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,E=/^[\],:{}\s]*$/,S=/(?:^|:|,)(?:\s*\[)+/g,A=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,j=/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,D=/^-ms-/,L=/-([\da-z])/gi,H=function(e,t){return t.toUpperCase()},q=function(e){(a.addEventListener||"load"===e.type||"complete"===a.readyState)&&(_(),x.ready())},_=function(){a.addEventListener?(a.removeEventListener("DOMContentLoaded",q,!1),e.removeEventListener("load",q,!1)):(a.detachEvent("onreadystatechange",q),e.detachEvent("onload",q))};x.fn=x.prototype={jquery:f,constructor:x,init:function(e,n,r){var i,o;if(!e)return this;if("string"==typeof e){if(i="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:N.exec(e),!i||!i[1]&&n)return!n||n.jquery?(n||r).find(e):this.constructor(n).find(e);if(i[1]){if(n=n instanceof x?n[0]:n,x.merge(this,x.parseHTML(i[1],n&&n.nodeType?n.ownerDocument||n:a,!0)),k.test(i[1])&&x.isPlainObject(n))for(i in n)x.isFunction(this[i])?this[i](n[i]):this.attr(i,n[i]);return this}if(o=a.getElementById(i[2]),o&&o.parentNode){if(o.id!==i[2])return r.find(e);this.length=1,this[0]=o}return this.context=a,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):x.isFunction(e)?r.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),x.makeArray(e,this))},selector:"",length:0,toArray:function(){return g.call(this)},get:function(e){return null==e?this.toArray():0>e?this[this.length+e]:this[e]},pushStack:function(e){var t=x.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return x.each(this,e,t)},ready:function(e){return x.ready.promise().done(e),this},slice:function(){return this.pushStack(g.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},map:function(e){return this.pushStack(x.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:h,sort:[].sort,splice:[].splice},x.fn.init.prototype=x.fn,x.extend=x.fn.extend=function(){var e,n,r,i,o,a,s=arguments[0]||{},l=1,u=arguments.length,c=!1;for("boolean"==typeof s&&(c=s,s=arguments[1]||{},l=2),"object"==typeof s||x.isFunction(s)||(s={}),u===l&&(s=this,--l);u>l;l++)if(null!=(o=arguments[l]))for(i in o)e=s[i],r=o[i],s!==r&&(c&&r&&(x.isPlainObject(r)||(n=x.isArray(r)))?(n?(n=!1,a=e&&x.isArray(e)?e:[]):a=e&&x.isPlainObject(e)?e:{},s[i]=x.extend(c,a,r)):r!==t&&(s[i]=r));return s},x.extend({expando:"jQuery"+(f+Math.random()).replace(/\D/g,""),noConflict:function(t){return e.$===x&&(e.$=u),t&&e.jQuery===x&&(e.jQuery=l),x},isReady:!1,readyWait:1,holdReady:function(e){e?x.readyWait++:x.ready(!0)},ready:function(e){if(e===!0?!--x.readyWait:!x.isReady){if(!a.body)return setTimeout(x.ready);x.isReady=!0,e!==!0&&--x.readyWait>0||(n.resolveWith(a,[x]),x.fn.trigger&&x(a).trigger("ready").off("ready"))}},isFunction:function(e){return"function"===x.type(e)},isArray:Array.isArray||function(e){return"array"===x.type(e)},isWindow:function(e){return null!=e&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?c[y.call(e)]||"object":typeof e},isPlainObject:function(e){var n;if(!e||"object"!==x.type(e)||e.nodeType||x.isWindow(e))return!1;try{if(e.constructor&&!v.call(e,"constructor")&&!v.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(r){return!1}if(x.support.ownLast)for(n in e)return v.call(e,n);for(n in e);return n===t||v.call(e,n)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw Error(e)},parseHTML:function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||a;var r=k.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=x.buildFragment([e],t,i),i&&x(i).remove(),x.merge([],r.childNodes))},parseJSON:function(n){return e.JSON&&e.JSON.parse?e.JSON.parse(n):null===n?n:"string"==typeof n&&(n=x.trim(n),n&&E.test(n.replace(A,"@").replace(j,"]").replace(S,"")))?Function("return "+n)():(x.error("Invalid JSON: "+n),t)},parseXML:function(n){var r,i;if(!n||"string"!=typeof n)return null;try{e.DOMParser?(i=new DOMParser,r=i.parseFromString(n,"text/xml")):(r=new ActiveXObject("Microsoft.XMLDOM"),r.async="false",r.loadXML(n))}catch(o){r=t}return r&&r.documentElement&&!r.getElementsByTagName("parsererror").length||x.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(t){t&&x.trim(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(D,"ms-").replace(L,H)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,n){var r,i=0,o=e.length,a=M(e);if(n){if(a){for(;o>i;i++)if(r=t.apply(e[i],n),r===!1)break}else for(i in e)if(r=t.apply(e[i],n),r===!1)break}else if(a){for(;o>i;i++)if(r=t.call(e[i],i,e[i]),r===!1)break}else for(i in e)if(r=t.call(e[i],i,e[i]),r===!1)break;return e},trim:b&&!b.call("\ufeff\u00a0")?function(e){return null==e?"":b.call(e)}:function(e){return null==e?"":(e+"").replace(C,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(M(Object(e))?x.merge(n,"string"==typeof e?[e]:e):h.call(n,e)),n},inArray:function(e,t,n){var r;if(t){if(m)return m.call(t,e,n);for(r=t.length,n=n?0>n?Math.max(0,r+n):n:0;r>n;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var r=n.length,i=e.length,o=0;if("number"==typeof r)for(;r>o;o++)e[i++]=n[o];else while(n[o]!==t)e[i++]=n[o++];return e.length=i,e},grep:function(e,t,n){var r,i=[],o=0,a=e.length;for(n=!!n;a>o;o++)r=!!t(e[o],o),n!==r&&i.push(e[o]);return i},map:function(e,t,n){var r,i=0,o=e.length,a=M(e),s=[];if(a)for(;o>i;i++)r=t(e[i],i,n),null!=r&&(s[s.length]=r);else for(i in e)r=t(e[i],i,n),null!=r&&(s[s.length]=r);return d.apply([],s)},guid:1,proxy:function(e,n){var r,i,o;return"string"==typeof n&&(o=e[n],n=e,e=o),x.isFunction(e)?(r=g.call(arguments,2),i=function(){return e.apply(n||this,r.concat(g.call(arguments)))},i.guid=e.guid=e.guid||x.guid++,i):t},access:function(e,n,r,i,o,a,s){var l=0,u=e.length,c=null==r;if("object"===x.type(r)){o=!0;for(l in r)x.access(e,n,l,r[l],!0,a,s)}else if(i!==t&&(o=!0,x.isFunction(i)||(s=!0),c&&(s?(n.call(e,i),n=null):(c=n,n=function(e,t,n){return c.call(x(e),n)})),n))for(;u>l;l++)n(e[l],r,s?i:i.call(e[l],l,n(e[l],r)));return o?e:c?n.call(e):u?n(e[0],r):a},now:function(){return(new Date).getTime()},swap:function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i}}),x.ready.promise=function(t){if(!n)if(n=x.Deferred(),"complete"===a.readyState)setTimeout(x.ready);else if(a.addEventListener)a.addEventListener("DOMContentLoaded",q,!1),e.addEventListener("load",q,!1);else{a.attachEvent("onreadystatechange",q),e.attachEvent("onload",q);var r=!1;try{r=null==e.frameElement&&a.documentElement}catch(i){}r&&r.doScroll&&function o(){if(!x.isReady){try{r.doScroll("left")}catch(e){return setTimeout(o,50)}_(),x.ready()}}()}return n.promise(t)},x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){c["[object "+t+"]"]=t.toLowerCase()});function M(e){var t=e.length,n=x.type(e);return x.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||"function"!==n&&(0===t||"number"==typeof t&&t>0&&t-1 in e)}r=x(a),function(e,t){var n,r,i,o,a,s,l,u,c,p,f,d,h,g,m,y,v,b="sizzle"+-new Date,w=e.document,T=0,C=0,N=st(),k=st(),E=st(),S=!1,A=function(e,t){return e===t?(S=!0,0):0},j=typeof t,D=1<<31,L={}.hasOwnProperty,H=[],q=H.pop,_=H.push,M=H.push,O=H.slice,F=H.indexOf||function(e){var t=0,n=this.length;for(;n>t;t++)if(this[t]===e)return t;return-1},B="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",P="[\\x20\\t\\r\\n\\f]",R="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",W=R.replace("w","w#"),$="\\["+P+"*("+R+")"+P+"*(?:([*^$|!~]?=)"+P+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+W+")|)|)"+P+"*\\]",I=":("+R+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+$.replace(3,8)+")*)|.*)\\)|)",z=RegExp("^"+P+"+|((?:^|[^\\\\])(?:\\\\.)*)"+P+"+$","g"),X=RegExp("^"+P+"*,"+P+"*"),U=RegExp("^"+P+"*([>+~]|"+P+")"+P+"*"),V=RegExp(P+"*[+~]"),Y=RegExp("="+P+"*([^\\]'\"]*)"+P+"*\\]","g"),J=RegExp(I),G=RegExp("^"+W+"$"),Q={ID:RegExp("^#("+R+")"),CLASS:RegExp("^\\.("+R+")"),TAG:RegExp("^("+R.replace("w","w*")+")"),ATTR:RegExp("^"+$),PSEUDO:RegExp("^"+I),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+P+"*(even|odd|(([+-]|)(\\d*)n|)"+P+"*(?:([+-]|)"+P+"*(\\d+)|))"+P+"*\\)|)","i"),bool:RegExp("^(?:"+B+")$","i"),needsContext:RegExp("^"+P+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+P+"*((?:-\\d)?\\d*)"+P+"*\\)|)(?=[^-]|$)","i")},K=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,et=/^(?:input|select|textarea|button)$/i,tt=/^h\d$/i,nt=/'|\\/g,rt=RegExp("\\\\([\\da-f]{1,6}"+P+"?|("+P+")|.)","ig"),it=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:0>r?String.fromCharCode(r+65536):String.fromCharCode(55296|r>>10,56320|1023&r)};try{M.apply(H=O.call(w.childNodes),w.childNodes),H[w.childNodes.length].nodeType}catch(ot){M={apply:H.length?function(e,t){_.apply(e,O.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function at(e,t,n,i){var o,a,s,l,u,c,d,m,y,x;if((t?t.ownerDocument||t:w)!==f&&p(t),t=t||f,n=n||[],!e||"string"!=typeof e)return n;if(1!==(l=t.nodeType)&&9!==l)return[];if(h&&!i){if(o=Z.exec(e))if(s=o[1]){if(9===l){if(a=t.getElementById(s),!a||!a.parentNode)return n;if(a.id===s)return n.push(a),n}else if(t.ownerDocument&&(a=t.ownerDocument.getElementById(s))&&v(t,a)&&a.id===s)return n.push(a),n}else{if(o[2])return M.apply(n,t.getElementsByTagName(e)),n;if((s=o[3])&&r.getElementsByClassName&&t.getElementsByClassName)return M.apply(n,t.getElementsByClassName(s)),n}if(r.qsa&&(!g||!g.test(e))){if(m=d=b,y=t,x=9===l&&e,1===l&&"object"!==t.nodeName.toLowerCase()){c=mt(e),(d=t.getAttribute("id"))?m=d.replace(nt,"\\$&"):t.setAttribute("id",m),m="[id='"+m+"'] ",u=c.length;while(u--)c[u]=m+yt(c[u]);y=V.test(e)&&t.parentNode||t,x=c.join(",")}if(x)try{return M.apply(n,y.querySelectorAll(x)),n}catch(T){}finally{d||t.removeAttribute("id")}}}return kt(e.replace(z,"$1"),t,n,i)}function st(){var e=[];function t(n,r){return e.push(n+=" ")>o.cacheLength&&delete t[e.shift()],t[n]=r}return t}function lt(e){return e[b]=!0,e}function ut(e){var t=f.createElement("div");try{return!!e(t)}catch(n){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function ct(e,t){var n=e.split("|"),r=e.length;while(r--)o.attrHandle[n[r]]=t}function pt(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||D)-(~e.sourceIndex||D);if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function ft(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function dt(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function ht(e){return lt(function(t){return t=+t,lt(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}s=at.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},r=at.support={},p=at.setDocument=function(e){var n=e?e.ownerDocument||e:w,i=n.defaultView;return n!==f&&9===n.nodeType&&n.documentElement?(f=n,d=n.documentElement,h=!s(n),i&&i.attachEvent&&i!==i.top&&i.attachEvent("onbeforeunload",function(){p()}),r.attributes=ut(function(e){return e.className="i",!e.getAttribute("className")}),r.getElementsByTagName=ut(function(e){return e.appendChild(n.createComment("")),!e.getElementsByTagName("*").length}),r.getElementsByClassName=ut(function(e){return e.innerHTML="<div class='a'></div><div class='a i'></div>",e.firstChild.className="i",2===e.getElementsByClassName("i").length}),r.getById=ut(function(e){return d.appendChild(e).id=b,!n.getElementsByName||!n.getElementsByName(b).length}),r.getById?(o.find.ID=function(e,t){if(typeof t.getElementById!==j&&h){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){return e.getAttribute("id")===t}}):(delete o.find.ID,o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){var n=typeof e.getAttributeNode!==j&&e.getAttributeNode("id");return n&&n.value===t}}),o.find.TAG=r.getElementsByTagName?function(e,n){return typeof n.getElementsByTagName!==j?n.getElementsByTagName(e):t}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},o.find.CLASS=r.getElementsByClassName&&function(e,n){return typeof n.getElementsByClassName!==j&&h?n.getElementsByClassName(e):t},m=[],g=[],(r.qsa=K.test(n.querySelectorAll))&&(ut(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||g.push("\\["+P+"*(?:value|"+B+")"),e.querySelectorAll(":checked").length||g.push(":checked")}),ut(function(e){var t=n.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("t",""),e.querySelectorAll("[t^='']").length&&g.push("[*^$]="+P+"*(?:''|\"\")"),e.querySelectorAll(":enabled").length||g.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),g.push(",.*:")})),(r.matchesSelector=K.test(y=d.webkitMatchesSelector||d.mozMatchesSelector||d.oMatchesSelector||d.msMatchesSelector))&&ut(function(e){r.disconnectedMatch=y.call(e,"div"),y.call(e,"[s!='']:x"),m.push("!=",I)}),g=g.length&&RegExp(g.join("|")),m=m.length&&RegExp(m.join("|")),v=K.test(d.contains)||d.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},A=d.compareDocumentPosition?function(e,t){if(e===t)return S=!0,0;var i=t.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(t);return i?1&i||!r.sortDetached&&t.compareDocumentPosition(e)===i?e===n||v(w,e)?-1:t===n||v(w,t)?1:c?F.call(c,e)-F.call(c,t):0:4&i?-1:1:e.compareDocumentPosition?-1:1}:function(e,t){var r,i=0,o=e.parentNode,a=t.parentNode,s=[e],l=[t];if(e===t)return S=!0,0;if(!o||!a)return e===n?-1:t===n?1:o?-1:a?1:c?F.call(c,e)-F.call(c,t):0;if(o===a)return pt(e,t);r=e;while(r=r.parentNode)s.unshift(r);r=t;while(r=r.parentNode)l.unshift(r);while(s[i]===l[i])i++;return i?pt(s[i],l[i]):s[i]===w?-1:l[i]===w?1:0},n):f},at.matches=function(e,t){return at(e,null,null,t)},at.matchesSelector=function(e,t){if((e.ownerDocument||e)!==f&&p(e),t=t.replace(Y,"='$1']"),!(!r.matchesSelector||!h||m&&m.test(t)||g&&g.test(t)))try{var n=y.call(e,t);if(n||r.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(i){}return at(t,f,null,[e]).length>0},at.contains=function(e,t){return(e.ownerDocument||e)!==f&&p(e),v(e,t)},at.attr=function(e,n){(e.ownerDocument||e)!==f&&p(e);var i=o.attrHandle[n.toLowerCase()],a=i&&L.call(o.attrHandle,n.toLowerCase())?i(e,n,!h):t;return a===t?r.attributes||!h?e.getAttribute(n):(a=e.getAttributeNode(n))&&a.specified?a.value:null:a},at.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},at.uniqueSort=function(e){var t,n=[],i=0,o=0;if(S=!r.detectDuplicates,c=!r.sortStable&&e.slice(0),e.sort(A),S){while(t=e[o++])t===e[o]&&(i=n.push(o));while(i--)e.splice(n[i],1)}return e},a=at.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=a(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r];r++)n+=a(t);return n},o=at.selectors={cacheLength:50,createPseudo:lt,match:Q,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(rt,it),e[3]=(e[4]||e[5]||"").replace(rt,it),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||at.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&at.error(e[0]),e},PSEUDO:function(e){var n,r=!e[5]&&e[2];return Q.CHILD.test(e[0])?null:(e[3]&&e[4]!==t?e[2]=e[4]:r&&J.test(r)&&(n=mt(r,!0))&&(n=r.indexOf(")",r.length-n)-r.length)&&(e[0]=e[0].slice(0,n),e[2]=r.slice(0,n)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(rt,it).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=N[e+" "];return t||(t=RegExp("(^|"+P+")"+e+"("+P+"|$)"))&&N(e,function(e){return t.test("string"==typeof e.className&&e.className||typeof e.getAttribute!==j&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=at.attr(r,e);return null==i?"!="===t:t?(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i+" ").indexOf(n)>-1:"|="===t?i===n||i.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,l){var u,c,p,f,d,h,g=o!==a?"nextSibling":"previousSibling",m=t.parentNode,y=s&&t.nodeName.toLowerCase(),v=!l&&!s;if(m){if(o){while(g){p=t;while(p=p[g])if(s?p.nodeName.toLowerCase()===y:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?m.firstChild:m.lastChild],a&&v){c=m[b]||(m[b]={}),u=c[e]||[],d=u[0]===T&&u[1],f=u[0]===T&&u[2],p=d&&m.childNodes[d];while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if(1===p.nodeType&&++f&&p===t){c[e]=[T,d,f];break}}else if(v&&(u=(t[b]||(t[b]={}))[e])&&u[0]===T)f=u[1];else while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if((s?p.nodeName.toLowerCase()===y:1===p.nodeType)&&++f&&(v&&((p[b]||(p[b]={}))[e]=[T,f]),p===t))break;return f-=i,f===r||0===f%r&&f/r>=0}}},PSEUDO:function(e,t){var n,r=o.pseudos[e]||o.setFilters[e.toLowerCase()]||at.error("unsupported pseudo: "+e);return r[b]?r(t):r.length>1?(n=[e,e,"",t],o.setFilters.hasOwnProperty(e.toLowerCase())?lt(function(e,n){var i,o=r(e,t),a=o.length;while(a--)i=F.call(e,o[a]),e[i]=!(n[i]=o[a])}):function(e){return r(e,0,n)}):r}},pseudos:{not:lt(function(e){var t=[],n=[],r=l(e.replace(z,"$1"));return r[b]?lt(function(e,t,n,i){var o,a=r(e,null,i,[]),s=e.length;while(s--)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),!n.pop()}}),has:lt(function(e){return function(t){return at(e,t).length>0}}),contains:lt(function(e){return function(t){return(t.textContent||t.innerText||a(t)).indexOf(e)>-1}}),lang:lt(function(e){return G.test(e||"")||at.error("unsupported lang: "+e),e=e.replace(rt,it).toLowerCase(),function(t){var n;do if(n=h?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===d},focus:function(e){return e===f.activeElement&&(!f.hasFocus||f.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!o.pseudos.empty(e)},header:function(e){return tt.test(e.nodeName)},input:function(e){return et.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:ht(function(){return[0]}),last:ht(function(e,t){return[t-1]}),eq:ht(function(e,t,n){return[0>n?n+t:n]}),even:ht(function(e,t){var n=0;for(;t>n;n+=2)e.push(n);return e}),odd:ht(function(e,t){var n=1;for(;t>n;n+=2)e.push(n);return e}),lt:ht(function(e,t,n){var r=0>n?n+t:n;for(;--r>=0;)e.push(r);return e}),gt:ht(function(e,t,n){var r=0>n?n+t:n;for(;t>++r;)e.push(r);return e})}},o.pseudos.nth=o.pseudos.eq;for(n in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})o.pseudos[n]=ft(n);for(n in{submit:!0,reset:!0})o.pseudos[n]=dt(n);function gt(){}gt.prototype=o.filters=o.pseudos,o.setFilters=new gt;function mt(e,t){var n,r,i,a,s,l,u,c=k[e+" "];if(c)return t?0:c.slice(0);s=e,l=[],u=o.preFilter;while(s){(!n||(r=X.exec(s)))&&(r&&(s=s.slice(r[0].length)||s),l.push(i=[])),n=!1,(r=U.exec(s))&&(n=r.shift(),i.push({value:n,type:r[0].replace(z," ")}),s=s.slice(n.length));for(a in o.filter)!(r=Q[a].exec(s))||u[a]&&!(r=u[a](r))||(n=r.shift(),i.push({value:n,type:a,matches:r}),s=s.slice(n.length));if(!n)break}return t?s.length:s?at.error(e):k(e,l).slice(0)}function yt(e){var t=0,n=e.length,r="";for(;n>t;t++)r+=e[t].value;return r}function vt(e,t,n){var r=t.dir,o=n&&"parentNode"===r,a=C++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||o)return e(t,n,i)}:function(t,n,s){var l,u,c,p=T+" "+a;if(s){while(t=t[r])if((1===t.nodeType||o)&&e(t,n,s))return!0}else while(t=t[r])if(1===t.nodeType||o)if(c=t[b]||(t[b]={}),(u=c[r])&&u[0]===p){if((l=u[1])===!0||l===i)return l===!0}else if(u=c[r]=[p],u[1]=e(t,n,s)||i,u[1]===!0)return!0}}function bt(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function xt(e,t,n,r,i){var o,a=[],s=0,l=e.length,u=null!=t;for(;l>s;s++)(o=e[s])&&(!n||n(o,r,i))&&(a.push(o),u&&t.push(s));return a}function wt(e,t,n,r,i,o){return r&&!r[b]&&(r=wt(r)),i&&!i[b]&&(i=wt(i,o)),lt(function(o,a,s,l){var u,c,p,f=[],d=[],h=a.length,g=o||Nt(t||"*",s.nodeType?[s]:s,[]),m=!e||!o&&t?g:xt(g,f,e,s,l),y=n?i||(o?e:h||r)?[]:a:m;if(n&&n(m,y,s,l),r){u=xt(y,d),r(u,[],s,l),c=u.length;while(c--)(p=u[c])&&(y[d[c]]=!(m[d[c]]=p))}if(o){if(i||e){if(i){u=[],c=y.length;while(c--)(p=y[c])&&u.push(m[c]=p);i(null,y=[],u,l)}c=y.length;while(c--)(p=y[c])&&(u=i?F.call(o,p):f[c])>-1&&(o[u]=!(a[u]=p))}}else y=xt(y===a?y.splice(h,y.length):y),i?i(null,a,y,l):M.apply(a,y)})}function Tt(e){var t,n,r,i=e.length,a=o.relative[e[0].type],s=a||o.relative[" "],l=a?1:0,c=vt(function(e){return e===t},s,!0),p=vt(function(e){return F.call(t,e)>-1},s,!0),f=[function(e,n,r){return!a&&(r||n!==u)||((t=n).nodeType?c(e,n,r):p(e,n,r))}];for(;i>l;l++)if(n=o.relative[e[l].type])f=[vt(bt(f),n)];else{if(n=o.filter[e[l].type].apply(null,e[l].matches),n[b]){for(r=++l;i>r;r++)if(o.relative[e[r].type])break;return wt(l>1&&bt(f),l>1&&yt(e.slice(0,l-1).concat({value:" "===e[l-2].type?"*":""})).replace(z,"$1"),n,r>l&&Tt(e.slice(l,r)),i>r&&Tt(e=e.slice(r)),i>r&&yt(e))}f.push(n)}return bt(f)}function Ct(e,t){var n=0,r=t.length>0,a=e.length>0,s=function(s,l,c,p,d){var h,g,m,y=[],v=0,b="0",x=s&&[],w=null!=d,C=u,N=s||a&&o.find.TAG("*",d&&l.parentNode||l),k=T+=null==C?1:Math.random()||.1;for(w&&(u=l!==f&&l,i=n);null!=(h=N[b]);b++){if(a&&h){g=0;while(m=e[g++])if(m(h,l,c)){p.push(h);break}w&&(T=k,i=++n)}r&&((h=!m&&h)&&v--,s&&x.push(h))}if(v+=b,r&&b!==v){g=0;while(m=t[g++])m(x,y,l,c);if(s){if(v>0)while(b--)x[b]||y[b]||(y[b]=q.call(p));y=xt(y)}M.apply(p,y),w&&!s&&y.length>0&&v+t.length>1&&at.uniqueSort(p)}return w&&(T=k,u=C),x};return r?lt(s):s}l=at.compile=function(e,t){var n,r=[],i=[],o=E[e+" "];if(!o){t||(t=mt(e)),n=t.length;while(n--)o=Tt(t[n]),o[b]?r.push(o):i.push(o);o=E(e,Ct(i,r))}return o};function Nt(e,t,n){var r=0,i=t.length;for(;i>r;r++)at(e,t[r],n);return n}function kt(e,t,n,i){var a,s,u,c,p,f=mt(e);if(!i&&1===f.length){if(s=f[0]=f[0].slice(0),s.length>2&&"ID"===(u=s[0]).type&&r.getById&&9===t.nodeType&&h&&o.relative[s[1].type]){if(t=(o.find.ID(u.matches[0].replace(rt,it),t)||[])[0],!t)return n;e=e.slice(s.shift().value.length)}a=Q.needsContext.test(e)?0:s.length;while(a--){if(u=s[a],o.relative[c=u.type])break;if((p=o.find[c])&&(i=p(u.matches[0].replace(rt,it),V.test(s[0].type)&&t.parentNode||t))){if(s.splice(a,1),e=i.length&&yt(s),!e)return M.apply(n,i),n;break}}}return l(e,f)(i,t,!h,n,V.test(e)),n}r.sortStable=b.split("").sort(A).join("")===b,r.detectDuplicates=S,p(),r.sortDetached=ut(function(e){return 1&e.compareDocumentPosition(f.createElement("div"))}),ut(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||ct("type|href|height|width",function(e,n,r){return r?t:e.getAttribute(n,"type"===n.toLowerCase()?1:2)}),r.attributes&&ut(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||ct("value",function(e,n,r){return r||"input"!==e.nodeName.toLowerCase()?t:e.defaultValue}),ut(function(e){return null==e.getAttribute("disabled")})||ct(B,function(e,n,r){var i;return r?t:(i=e.getAttributeNode(n))&&i.specified?i.value:e[n]===!0?n.toLowerCase():null}),x.find=at,x.expr=at.selectors,x.expr[":"]=x.expr.pseudos,x.unique=at.uniqueSort,x.text=at.getText,x.isXMLDoc=at.isXML,x.contains=at.contains}(e);var O={};function F(e){var t=O[e]={};return x.each(e.match(T)||[],function(e,n){t[n]=!0}),t}x.Callbacks=function(e){e="string"==typeof e?O[e]||F(e):x.extend({},e);var n,r,i,o,a,s,l=[],u=!e.once&&[],c=function(t){for(r=e.memory&&t,i=!0,a=s||0,s=0,o=l.length,n=!0;l&&o>a;a++)if(l[a].apply(t[0],t[1])===!1&&e.stopOnFalse){r=!1;break}n=!1,l&&(u?u.length&&c(u.shift()):r?l=[]:p.disable())},p={add:function(){if(l){var t=l.length;(function i(t){x.each(t,function(t,n){var r=x.type(n);"function"===r?e.unique&&p.has(n)||l.push(n):n&&n.length&&"string"!==r&&i(n)})})(arguments),n?o=l.length:r&&(s=t,c(r))}return this},remove:function(){return l&&x.each(arguments,function(e,t){var r;while((r=x.inArray(t,l,r))>-1)l.splice(r,1),n&&(o>=r&&o--,a>=r&&a--)}),this},has:function(e){return e?x.inArray(e,l)>-1:!(!l||!l.length)},empty:function(){return l=[],o=0,this},disable:function(){return l=u=r=t,this},disabled:function(){return!l},lock:function(){return u=t,r||p.disable(),this},locked:function(){return!u},fireWith:function(e,t){return!l||i&&!u||(t=t||[],t=[e,t.slice?t.slice():t],n?u.push(t):c(t)),this},fire:function(){return p.fireWith(this,arguments),this},fired:function(){return!!i}};return p},x.extend({Deferred:function(e){var t=[["resolve","done",x.Callbacks("once memory"),"resolved"],["reject","fail",x.Callbacks("once memory"),"rejected"],["notify","progress",x.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return x.Deferred(function(n){x.each(t,function(t,o){var a=o[0],s=x.isFunction(e[t])&&e[t];i[o[1]](function(){var e=s&&s.apply(this,arguments);e&&x.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[a+"With"](this===r?n.promise():this,s?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?x.extend(e,r):r}},i={};return r.pipe=r.then,x.each(t,function(e,o){var a=o[2],s=o[3];r[o[1]]=a.add,s&&a.add(function(){n=s},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=a.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=g.call(arguments),r=n.length,i=1!==r||e&&x.isFunction(e.promise)?r:0,o=1===i?e:x.Deferred(),a=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?g.call(arguments):r,n===s?o.notifyWith(t,n):--i||o.resolveWith(t,n)}},s,l,u;if(r>1)for(s=Array(r),l=Array(r),u=Array(r);r>t;t++)n[t]&&x.isFunction(n[t].promise)?n[t].promise().done(a(t,u,n)).fail(o.reject).progress(a(t,l,s)):--i;return i||o.resolveWith(u,n),o.promise()}}),x.support=function(t){var n,r,o,s,l,u,c,p,f,d=a.createElement("div");if(d.setAttribute("className","t"),d.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=d.getElementsByTagName("*")||[],r=d.getElementsByTagName("a")[0],!r||!r.style||!n.length)return t;s=a.createElement("select"),u=s.appendChild(a.createElement("option")),o=d.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",t.getSetAttribute="t"!==d.className,t.leadingWhitespace=3===d.firstChild.nodeType,t.tbody=!d.getElementsByTagName("tbody").length,t.htmlSerialize=!!d.getElementsByTagName("link").length,t.style=/top/.test(r.getAttribute("style")),t.hrefNormalized="/a"===r.getAttribute("href"),t.opacity=/^0.5/.test(r.style.opacity),t.cssFloat=!!r.style.cssFloat,t.checkOn=!!o.value,t.optSelected=u.selected,t.enctype=!!a.createElement("form").enctype,t.html5Clone="<:nav></:nav>"!==a.createElement("nav").cloneNode(!0).outerHTML,t.inlineBlockNeedsLayout=!1,t.shrinkWrapBlocks=!1,t.pixelPosition=!1,t.deleteExpando=!0,t.noCloneEvent=!0,t.reliableMarginRight=!0,t.boxSizingReliable=!0,o.checked=!0,t.noCloneChecked=o.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!u.disabled;try{delete d.test}catch(h){t.deleteExpando=!1}o=a.createElement("input"),o.setAttribute("value",""),t.input=""===o.getAttribute("value"),o.value="t",o.setAttribute("type","radio"),t.radioValue="t"===o.value,o.setAttribute("checked","t"),o.setAttribute("name","t"),l=a.createDocumentFragment(),l.appendChild(o),t.appendChecked=o.checked,t.checkClone=l.cloneNode(!0).cloneNode(!0).lastChild.checked,d.attachEvent&&(d.attachEvent("onclick",function(){t.noCloneEvent=!1}),d.cloneNode(!0).click());for(f in{submit:!0,change:!0,focusin:!0})d.setAttribute(c="on"+f,"t"),t[f+"Bubbles"]=c in e||d.attributes[c].expando===!1;d.style.backgroundClip="content-box",d.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle="content-box"===d.style.backgroundClip;for(f in x(t))break;return t.ownLast="0"!==f,x(function(){var n,r,o,s="padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",l=a.getElementsByTagName("body")[0];l&&(n=a.createElement("div"),n.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",l.appendChild(n).appendChild(d),d.innerHTML="<table><tr><td></td><td>t</td></tr></table>",o=d.getElementsByTagName("td"),o[0].style.cssText="padding:0;margin:0;border:0;display:none",p=0===o[0].offsetHeight,o[0].style.display="",o[1].style.display="none",t.reliableHiddenOffsets=p&&0===o[0].offsetHeight,d.innerHTML="",d.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",x.swap(l,null!=l.style.zoom?{zoom:1}:{},function(){t.boxSizing=4===d.offsetWidth}),e.getComputedStyle&&(t.pixelPosition="1%"!==(e.getComputedStyle(d,null)||{}).top,t.boxSizingReliable="4px"===(e.getComputedStyle(d,null)||{width:"4px"}).width,r=d.appendChild(a.createElement("div")),r.style.cssText=d.style.cssText=s,r.style.marginRight=r.style.width="0",d.style.width="1px",t.reliableMarginRight=!parseFloat((e.getComputedStyle(r,null)||{}).marginRight)),typeof d.style.zoom!==i&&(d.innerHTML="",d.style.cssText=s+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=3===d.offsetWidth,d.style.display="block",d.innerHTML="<div></div>",d.firstChild.style.width="5px",t.shrinkWrapBlocks=3!==d.offsetWidth,t.inlineBlockNeedsLayout&&(l.style.zoom=1)),l.removeChild(n),n=d=o=r=null)}),n=s=l=u=r=o=null,t
}({});var B=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,P=/([A-Z])/g;function R(e,n,r,i){if(x.acceptData(e)){var o,a,s=x.expando,l=e.nodeType,u=l?x.cache:e,c=l?e[s]:e[s]&&s;if(c&&u[c]&&(i||u[c].data)||r!==t||"string"!=typeof n)return c||(c=l?e[s]=p.pop()||x.guid++:s),u[c]||(u[c]=l?{}:{toJSON:x.noop}),("object"==typeof n||"function"==typeof n)&&(i?u[c]=x.extend(u[c],n):u[c].data=x.extend(u[c].data,n)),a=u[c],i||(a.data||(a.data={}),a=a.data),r!==t&&(a[x.camelCase(n)]=r),"string"==typeof n?(o=a[n],null==o&&(o=a[x.camelCase(n)])):o=a,o}}function W(e,t,n){if(x.acceptData(e)){var r,i,o=e.nodeType,a=o?x.cache:e,s=o?e[x.expando]:x.expando;if(a[s]){if(t&&(r=n?a[s]:a[s].data)){x.isArray(t)?t=t.concat(x.map(t,x.camelCase)):t in r?t=[t]:(t=x.camelCase(t),t=t in r?[t]:t.split(" ")),i=t.length;while(i--)delete r[t[i]];if(n?!I(r):!x.isEmptyObject(r))return}(n||(delete a[s].data,I(a[s])))&&(o?x.cleanData([e],!0):x.support.deleteExpando||a!=a.window?delete a[s]:a[s]=null)}}}x.extend({cache:{},noData:{applet:!0,embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(e){return e=e.nodeType?x.cache[e[x.expando]]:e[x.expando],!!e&&!I(e)},data:function(e,t,n){return R(e,t,n)},removeData:function(e,t){return W(e,t)},_data:function(e,t,n){return R(e,t,n,!0)},_removeData:function(e,t){return W(e,t,!0)},acceptData:function(e){if(e.nodeType&&1!==e.nodeType&&9!==e.nodeType)return!1;var t=e.nodeName&&x.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),x.fn.extend({data:function(e,n){var r,i,o=null,a=0,s=this[0];if(e===t){if(this.length&&(o=x.data(s),1===s.nodeType&&!x._data(s,"parsedAttrs"))){for(r=s.attributes;r.length>a;a++)i=r[a].name,0===i.indexOf("data-")&&(i=x.camelCase(i.slice(5)),$(s,i,o[i]));x._data(s,"parsedAttrs",!0)}return o}return"object"==typeof e?this.each(function(){x.data(this,e)}):arguments.length>1?this.each(function(){x.data(this,e,n)}):s?$(s,e,x.data(s,e)):null},removeData:function(e){return this.each(function(){x.removeData(this,e)})}});function $(e,n,r){if(r===t&&1===e.nodeType){var i="data-"+n.replace(P,"-$1").toLowerCase();if(r=e.getAttribute(i),"string"==typeof r){try{r="true"===r?!0:"false"===r?!1:"null"===r?null:+r+""===r?+r:B.test(r)?x.parseJSON(r):r}catch(o){}x.data(e,n,r)}else r=t}return r}function I(e){var t;for(t in e)if(("data"!==t||!x.isEmptyObject(e[t]))&&"toJSON"!==t)return!1;return!0}x.extend({queue:function(e,n,r){var i;return e?(n=(n||"fx")+"queue",i=x._data(e,n),r&&(!i||x.isArray(r)?i=x._data(e,n,x.makeArray(r)):i.push(r)),i||[]):t},dequeue:function(e,t){t=t||"fx";var n=x.queue(e,t),r=n.length,i=n.shift(),o=x._queueHooks(e,t),a=function(){x.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return x._data(e,n)||x._data(e,n,{empty:x.Callbacks("once memory").add(function(){x._removeData(e,t+"queue"),x._removeData(e,n)})})}}),x.fn.extend({queue:function(e,n){var r=2;return"string"!=typeof e&&(n=e,e="fx",r--),r>arguments.length?x.queue(this[0],e):n===t?this:this.each(function(){var t=x.queue(this,e,n);x._queueHooks(this,e),"fx"===e&&"inprogress"!==t[0]&&x.dequeue(this,e)})},dequeue:function(e){return this.each(function(){x.dequeue(this,e)})},delay:function(e,t){return e=x.fx?x.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var r,i=1,o=x.Deferred(),a=this,s=this.length,l=function(){--i||o.resolveWith(a,[a])};"string"!=typeof e&&(n=e,e=t),e=e||"fx";while(s--)r=x._data(a[s],e+"queueHooks"),r&&r.empty&&(i++,r.empty.add(l));return l(),o.promise(n)}});var z,X,U=/[\t\r\n\f]/g,V=/\r/g,Y=/^(?:input|select|textarea|button|object)$/i,J=/^(?:a|area)$/i,G=/^(?:checked|selected)$/i,Q=x.support.getSetAttribute,K=x.support.input;x.fn.extend({attr:function(e,t){return x.access(this,x.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){x.removeAttr(this,e)})},prop:function(e,t){return x.access(this,x.prop,e,t,arguments.length>1)},removeProp:function(e){return e=x.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,r,i,o,a=0,s=this.length,l="string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).addClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):" ")){o=0;while(i=t[o++])0>r.indexOf(" "+i+" ")&&(r+=i+" ");n.className=x.trim(r)}return this},removeClass:function(e){var t,n,r,i,o,a=0,s=this.length,l=0===arguments.length||"string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).removeClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):"")){o=0;while(i=t[o++])while(r.indexOf(" "+i+" ")>=0)r=r.replace(" "+i+" "," ");n.className=e?x.trim(r):""}return this},toggleClass:function(e,t){var n=typeof e;return"boolean"==typeof t&&"string"===n?t?this.addClass(e):this.removeClass(e):x.isFunction(e)?this.each(function(n){x(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if("string"===n){var t,r=0,o=x(this),a=e.match(T)||[];while(t=a[r++])o.hasClass(t)?o.removeClass(t):o.addClass(t)}else(n===i||"boolean"===n)&&(this.className&&x._data(this,"__className__",this.className),this.className=this.className||e===!1?"":x._data(this,"__className__")||"")})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(U," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,r,i,o=this[0];{if(arguments.length)return i=x.isFunction(e),this.each(function(n){var o;1===this.nodeType&&(o=i?e.call(this,n,x(this).val()):e,null==o?o="":"number"==typeof o?o+="":x.isArray(o)&&(o=x.map(o,function(e){return null==e?"":e+""})),r=x.valHooks[this.type]||x.valHooks[this.nodeName.toLowerCase()],r&&"set"in r&&r.set(this,o,"value")!==t||(this.value=o))});if(o)return r=x.valHooks[o.type]||x.valHooks[o.nodeName.toLowerCase()],r&&"get"in r&&(n=r.get(o,"value"))!==t?n:(n=o.value,"string"==typeof n?n.replace(V,""):null==n?"":n)}}}),x.extend({valHooks:{option:{get:function(e){var t=x.find.attr(e,"value");return null!=t?t:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,a=o?null:[],s=o?i+1:r.length,l=0>i?s:o?i:0;for(;s>l;l++)if(n=r[l],!(!n.selected&&l!==i||(x.support.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&x.nodeName(n.parentNode,"optgroup"))){if(t=x(n).val(),o)return t;a.push(t)}return a},set:function(e,t){var n,r,i=e.options,o=x.makeArray(t),a=i.length;while(a--)r=i[a],(r.selected=x.inArray(x(r).val(),o)>=0)&&(n=!0);return n||(e.selectedIndex=-1),o}}},attr:function(e,n,r){var o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return typeof e.getAttribute===i?x.prop(e,n,r):(1===s&&x.isXMLDoc(e)||(n=n.toLowerCase(),o=x.attrHooks[n]||(x.expr.match.bool.test(n)?X:z)),r===t?o&&"get"in o&&null!==(a=o.get(e,n))?a:(a=x.find.attr(e,n),null==a?t:a):null!==r?o&&"set"in o&&(a=o.set(e,r,n))!==t?a:(e.setAttribute(n,r+""),r):(x.removeAttr(e,n),t))},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(T);if(o&&1===e.nodeType)while(n=o[i++])r=x.propFix[n]||n,x.expr.match.bool.test(n)?K&&Q||!G.test(n)?e[r]=!1:e[x.camelCase("default-"+n)]=e[r]=!1:x.attr(e,n,""),e.removeAttribute(Q?n:r)},attrHooks:{type:{set:function(e,t){if(!x.support.radioValue&&"radio"===t&&x.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},propFix:{"for":"htmlFor","class":"className"},prop:function(e,n,r){var i,o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return a=1!==s||!x.isXMLDoc(e),a&&(n=x.propFix[n]||n,o=x.propHooks[n]),r!==t?o&&"set"in o&&(i=o.set(e,r,n))!==t?i:e[n]=r:o&&"get"in o&&null!==(i=o.get(e,n))?i:e[n]},propHooks:{tabIndex:{get:function(e){var t=x.find.attr(e,"tabindex");return t?parseInt(t,10):Y.test(e.nodeName)||J.test(e.nodeName)&&e.href?0:-1}}}}),X={set:function(e,t,n){return t===!1?x.removeAttr(e,n):K&&Q||!G.test(n)?e.setAttribute(!Q&&x.propFix[n]||n,n):e[x.camelCase("default-"+n)]=e[n]=!0,n}},x.each(x.expr.match.bool.source.match(/\w+/g),function(e,n){var r=x.expr.attrHandle[n]||x.find.attr;x.expr.attrHandle[n]=K&&Q||!G.test(n)?function(e,n,i){var o=x.expr.attrHandle[n],a=i?t:(x.expr.attrHandle[n]=t)!=r(e,n,i)?n.toLowerCase():null;return x.expr.attrHandle[n]=o,a}:function(e,n,r){return r?t:e[x.camelCase("default-"+n)]?n.toLowerCase():null}}),K&&Q||(x.attrHooks.value={set:function(e,n,r){return x.nodeName(e,"input")?(e.defaultValue=n,t):z&&z.set(e,n,r)}}),Q||(z={set:function(e,n,r){var i=e.getAttributeNode(r);return i||e.setAttributeNode(i=e.ownerDocument.createAttribute(r)),i.value=n+="","value"===r||n===e.getAttribute(r)?n:t}},x.expr.attrHandle.id=x.expr.attrHandle.name=x.expr.attrHandle.coords=function(e,n,r){var i;return r?t:(i=e.getAttributeNode(n))&&""!==i.value?i.value:null},x.valHooks.button={get:function(e,n){var r=e.getAttributeNode(n);return r&&r.specified?r.value:t},set:z.set},x.attrHooks.contenteditable={set:function(e,t,n){z.set(e,""===t?!1:t,n)}},x.each(["width","height"],function(e,n){x.attrHooks[n]={set:function(e,r){return""===r?(e.setAttribute(n,"auto"),r):t}}})),x.support.hrefNormalized||x.each(["href","src"],function(e,t){x.propHooks[t]={get:function(e){return e.getAttribute(t,4)}}}),x.support.style||(x.attrHooks.style={get:function(e){return e.style.cssText||t},set:function(e,t){return e.style.cssText=t+""}}),x.support.optSelected||(x.propHooks.selected={get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}}),x.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){x.propFix[this.toLowerCase()]=this}),x.support.enctype||(x.propFix.enctype="encoding"),x.each(["radio","checkbox"],function(){x.valHooks[this]={set:function(e,n){return x.isArray(n)?e.checked=x.inArray(x(e).val(),n)>=0:t}},x.support.checkOn||(x.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var Z=/^(?:input|select|textarea)$/i,et=/^key/,tt=/^(?:mouse|contextmenu)|click/,nt=/^(?:focusinfocus|focusoutblur)$/,rt=/^([^.]*)(?:\.(.+)|)$/;function it(){return!0}function ot(){return!1}function at(){try{return a.activeElement}catch(e){}}x.event={global:{},add:function(e,n,r,o,a){var s,l,u,c,p,f,d,h,g,m,y,v=x._data(e);if(v){r.handler&&(c=r,r=c.handler,a=c.selector),r.guid||(r.guid=x.guid++),(l=v.events)||(l=v.events={}),(f=v.handle)||(f=v.handle=function(e){return typeof x===i||e&&x.event.triggered===e.type?t:x.event.dispatch.apply(f.elem,arguments)},f.elem=e),n=(n||"").match(T)||[""],u=n.length;while(u--)s=rt.exec(n[u])||[],g=y=s[1],m=(s[2]||"").split(".").sort(),g&&(p=x.event.special[g]||{},g=(a?p.delegateType:p.bindType)||g,p=x.event.special[g]||{},d=x.extend({type:g,origType:y,data:o,handler:r,guid:r.guid,selector:a,needsContext:a&&x.expr.match.needsContext.test(a),namespace:m.join(".")},c),(h=l[g])||(h=l[g]=[],h.delegateCount=0,p.setup&&p.setup.call(e,o,m,f)!==!1||(e.addEventListener?e.addEventListener(g,f,!1):e.attachEvent&&e.attachEvent("on"+g,f))),p.add&&(p.add.call(e,d),d.handler.guid||(d.handler.guid=r.guid)),a?h.splice(h.delegateCount++,0,d):h.push(d),x.event.global[g]=!0);e=null}},remove:function(e,t,n,r,i){var o,a,s,l,u,c,p,f,d,h,g,m=x.hasData(e)&&x._data(e);if(m&&(c=m.events)){t=(t||"").match(T)||[""],u=t.length;while(u--)if(s=rt.exec(t[u])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){p=x.event.special[d]||{},d=(r?p.delegateType:p.bindType)||d,f=c[d]||[],s=s[2]&&RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),l=o=f.length;while(o--)a=f[o],!i&&g!==a.origType||n&&n.guid!==a.guid||s&&!s.test(a.namespace)||r&&r!==a.selector&&("**"!==r||!a.selector)||(f.splice(o,1),a.selector&&f.delegateCount--,p.remove&&p.remove.call(e,a));l&&!f.length&&(p.teardown&&p.teardown.call(e,h,m.handle)!==!1||x.removeEvent(e,d,m.handle),delete c[d])}else for(d in c)x.event.remove(e,d+t[u],n,r,!0);x.isEmptyObject(c)&&(delete m.handle,x._removeData(e,"events"))}},trigger:function(n,r,i,o){var s,l,u,c,p,f,d,h=[i||a],g=v.call(n,"type")?n.type:n,m=v.call(n,"namespace")?n.namespace.split("."):[];if(u=f=i=i||a,3!==i.nodeType&&8!==i.nodeType&&!nt.test(g+x.event.triggered)&&(g.indexOf(".")>=0&&(m=g.split("."),g=m.shift(),m.sort()),l=0>g.indexOf(":")&&"on"+g,n=n[x.expando]?n:new x.Event(g,"object"==typeof n&&n),n.isTrigger=o?2:3,n.namespace=m.join("."),n.namespace_re=n.namespace?RegExp("(^|\\.)"+m.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,n.result=t,n.target||(n.target=i),r=null==r?[n]:x.makeArray(r,[n]),p=x.event.special[g]||{},o||!p.trigger||p.trigger.apply(i,r)!==!1)){if(!o&&!p.noBubble&&!x.isWindow(i)){for(c=p.delegateType||g,nt.test(c+g)||(u=u.parentNode);u;u=u.parentNode)h.push(u),f=u;f===(i.ownerDocument||a)&&h.push(f.defaultView||f.parentWindow||e)}d=0;while((u=h[d++])&&!n.isPropagationStopped())n.type=d>1?c:p.bindType||g,s=(x._data(u,"events")||{})[n.type]&&x._data(u,"handle"),s&&s.apply(u,r),s=l&&u[l],s&&x.acceptData(u)&&s.apply&&s.apply(u,r)===!1&&n.preventDefault();if(n.type=g,!o&&!n.isDefaultPrevented()&&(!p._default||p._default.apply(h.pop(),r)===!1)&&x.acceptData(i)&&l&&i[g]&&!x.isWindow(i)){f=i[l],f&&(i[l]=null),x.event.triggered=g;try{i[g]()}catch(y){}x.event.triggered=t,f&&(i[l]=f)}return n.result}},dispatch:function(e){e=x.event.fix(e);var n,r,i,o,a,s=[],l=g.call(arguments),u=(x._data(this,"events")||{})[e.type]||[],c=x.event.special[e.type]||{};if(l[0]=e,e.delegateTarget=this,!c.preDispatch||c.preDispatch.call(this,e)!==!1){s=x.event.handlers.call(this,e,u),n=0;while((o=s[n++])&&!e.isPropagationStopped()){e.currentTarget=o.elem,a=0;while((i=o.handlers[a++])&&!e.isImmediatePropagationStopped())(!e.namespace_re||e.namespace_re.test(i.namespace))&&(e.handleObj=i,e.data=i.data,r=((x.event.special[i.origType]||{}).handle||i.handler).apply(o.elem,l),r!==t&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,e),e.result}},handlers:function(e,n){var r,i,o,a,s=[],l=n.delegateCount,u=e.target;if(l&&u.nodeType&&(!e.button||"click"!==e.type))for(;u!=this;u=u.parentNode||this)if(1===u.nodeType&&(u.disabled!==!0||"click"!==e.type)){for(o=[],a=0;l>a;a++)i=n[a],r=i.selector+" ",o[r]===t&&(o[r]=i.needsContext?x(r,this).index(u)>=0:x.find(r,this,null,[u]).length),o[r]&&o.push(i);o.length&&s.push({elem:u,handlers:o})}return n.length>l&&s.push({elem:this,handlers:n.slice(l)}),s},fix:function(e){if(e[x.expando])return e;var t,n,r,i=e.type,o=e,s=this.fixHooks[i];s||(this.fixHooks[i]=s=tt.test(i)?this.mouseHooks:et.test(i)?this.keyHooks:{}),r=s.props?this.props.concat(s.props):this.props,e=new x.Event(o),t=r.length;while(t--)n=r[t],e[n]=o[n];return e.target||(e.target=o.srcElement||a),3===e.target.nodeType&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,o):e},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var r,i,o,s=n.button,l=n.fromElement;return null==e.pageX&&null!=n.clientX&&(i=e.target.ownerDocument||a,o=i.documentElement,r=i.body,e.pageX=n.clientX+(o&&o.scrollLeft||r&&r.scrollLeft||0)-(o&&o.clientLeft||r&&r.clientLeft||0),e.pageY=n.clientY+(o&&o.scrollTop||r&&r.scrollTop||0)-(o&&o.clientTop||r&&r.clientTop||0)),!e.relatedTarget&&l&&(e.relatedTarget=l===e.target?n.toElement:l),e.which||s===t||(e.which=1&s?1:2&s?3:4&s?2:0),e}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==at()&&this.focus)try{return this.focus(),!1}catch(e){}},delegateType:"focusin"},blur:{trigger:function(){return this===at()&&this.blur?(this.blur(),!1):t},delegateType:"focusout"},click:{trigger:function(){return x.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):t},_default:function(e){return x.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){e.result!==t&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=x.extend(new x.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?x.event.trigger(i,null,t):x.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},x.removeEvent=a.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]===i&&(e[r]=null),e.detachEvent(r,n))},x.Event=function(e,n){return this instanceof x.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?it:ot):this.type=e,n&&x.extend(this,n),this.timeStamp=e&&e.timeStamp||x.now(),this[x.expando]=!0,t):new x.Event(e,n)},x.Event.prototype={isDefaultPrevented:ot,isPropagationStopped:ot,isImmediatePropagationStopped:ot,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=it,e&&(e.preventDefault?e.preventDefault():e.returnValue=!1)},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=it,e&&(e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=it,this.stopPropagation()}},x.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){x.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return(!i||i!==r&&!x.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),x.support.submitBubbles||(x.event.special.submit={setup:function(){return x.nodeName(this,"form")?!1:(x.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,r=x.nodeName(n,"input")||x.nodeName(n,"button")?n.form:t;r&&!x._data(r,"submitBubbles")&&(x.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),x._data(r,"submitBubbles",!0))}),t)},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&x.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){return x.nodeName(this,"form")?!1:(x.event.remove(this,"._submit"),t)}}),x.support.changeBubbles||(x.event.special.change={setup:function(){return Z.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(x.event.add(this,"propertychange._change",function(e){"checked"===e.originalEvent.propertyName&&(this._just_changed=!0)}),x.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),x.event.simulate("change",this,e,!0)})),!1):(x.event.add(this,"beforeactivate._change",function(e){var t=e.target;Z.test(t.nodeName)&&!x._data(t,"changeBubbles")&&(x.event.add(t,"change._change",function(e){!this.parentNode||e.isSimulated||e.isTrigger||x.event.simulate("change",this.parentNode,e,!0)}),x._data(t,"changeBubbles",!0))}),t)},handle:function(e){var n=e.target;return this!==n||e.isSimulated||e.isTrigger||"radio"!==n.type&&"checkbox"!==n.type?e.handleObj.handler.apply(this,arguments):t},teardown:function(){return x.event.remove(this,"._change"),!Z.test(this.nodeName)}}),x.support.focusinBubbles||x.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){x.event.simulate(t,e.target,x.event.fix(e),!0)};x.event.special[t]={setup:function(){0===n++&&a.addEventListener(e,r,!0)},teardown:function(){0===--n&&a.removeEventListener(e,r,!0)}}}),x.fn.extend({on:function(e,n,r,i,o){var a,s;if("object"==typeof e){"string"!=typeof n&&(r=r||n,n=t);for(a in e)this.on(a,n,r,e[a],o);return this}if(null==r&&null==i?(i=n,r=n=t):null==i&&("string"==typeof n?(i=r,r=t):(i=r,r=n,n=t)),i===!1)i=ot;else if(!i)return this;return 1===o&&(s=i,i=function(e){return x().off(e),s.apply(this,arguments)},i.guid=s.guid||(s.guid=x.guid++)),this.each(function(){x.event.add(this,e,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,n,r){var i,o;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,x(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if("object"==typeof e){for(o in e)this.off(o,n,e[o]);return this}return(n===!1||"function"==typeof n)&&(r=n,n=t),r===!1&&(r=ot),this.each(function(){x.event.remove(this,e,r,n)})},trigger:function(e,t){return this.each(function(){x.event.trigger(e,t,this)})},triggerHandler:function(e,n){var r=this[0];return r?x.event.trigger(e,n,r,!0):t}});var st=/^.[^:#\[\.,]*$/,lt=/^(?:parents|prev(?:Until|All))/,ut=x.expr.match.needsContext,ct={children:!0,contents:!0,next:!0,prev:!0};x.fn.extend({find:function(e){var t,n=[],r=this,i=r.length;if("string"!=typeof e)return this.pushStack(x(e).filter(function(){for(t=0;i>t;t++)if(x.contains(r[t],this))return!0}));for(t=0;i>t;t++)x.find(e,r[t],n);return n=this.pushStack(i>1?x.unique(n):n),n.selector=this.selector?this.selector+" "+e:e,n},has:function(e){var t,n=x(e,this),r=n.length;return this.filter(function(){for(t=0;r>t;t++)if(x.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(ft(this,e||[],!0))},filter:function(e){return this.pushStack(ft(this,e||[],!1))},is:function(e){return!!ft(this,"string"==typeof e&&ut.test(e)?x(e):e||[],!1).length},closest:function(e,t){var n,r=0,i=this.length,o=[],a=ut.test(e)||"string"!=typeof e?x(e,t||this.context):0;for(;i>r;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(11>n.nodeType&&(a?a.index(n)>-1:1===n.nodeType&&x.find.matchesSelector(n,e))){n=o.push(n);break}return this.pushStack(o.length>1?x.unique(o):o)},index:function(e){return e?"string"==typeof e?x.inArray(this[0],x(e)):x.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){var n="string"==typeof e?x(e,t):x.makeArray(e&&e.nodeType?[e]:e),r=x.merge(this.get(),n);return this.pushStack(x.unique(r))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function pt(e,t){do e=e[t];while(e&&1!==e.nodeType);return e}x.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return x.dir(e,"parentNode")},parentsUntil:function(e,t,n){return x.dir(e,"parentNode",n)},next:function(e){return pt(e,"nextSibling")},prev:function(e){return pt(e,"previousSibling")},nextAll:function(e){return x.dir(e,"nextSibling")},prevAll:function(e){return x.dir(e,"previousSibling")},nextUntil:function(e,t,n){return x.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return x.dir(e,"previousSibling",n)},siblings:function(e){return x.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return x.sibling(e.firstChild)},contents:function(e){return x.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:x.merge([],e.childNodes)}},function(e,t){x.fn[e]=function(n,r){var i=x.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=x.filter(r,i)),this.length>1&&(ct[e]||(i=x.unique(i)),lt.test(e)&&(i=i.reverse())),this.pushStack(i)}}),x.extend({filter:function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?x.find.matchesSelector(r,e)?[r]:[]:x.find.matches(e,x.grep(t,function(e){return 1===e.nodeType}))},dir:function(e,n,r){var i=[],o=e[n];while(o&&9!==o.nodeType&&(r===t||1!==o.nodeType||!x(o).is(r)))1===o.nodeType&&i.push(o),o=o[n];return i},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}});function ft(e,t,n){if(x.isFunction(t))return x.grep(e,function(e,r){return!!t.call(e,r,e)!==n});if(t.nodeType)return x.grep(e,function(e){return e===t!==n});if("string"==typeof t){if(st.test(t))return x.filter(t,e,n);t=x.filter(t,e)}return x.grep(e,function(e){return x.inArray(e,t)>=0!==n})}function dt(e){var t=ht.split("|"),n=e.createDocumentFragment();if(n.createElement)while(t.length)n.createElement(t.pop());return n}var ht="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",gt=/ jQuery\d+="(?:null|\d+)"/g,mt=RegExp("<(?:"+ht+")[\\s/>]","i"),yt=/^\s+/,vt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bt=/<([\w:]+)/,xt=/<tbody/i,wt=/<|&#?\w+;/,Tt=/<(?:script|style|link)/i,Ct=/^(?:checkbox|radio)$/i,Nt=/checked\s*(?:[^=]|=\s*.checked.)/i,kt=/^$|\/(?:java|ecma)script/i,Et=/^true\/(.*)/,St=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,At={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:x.support.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},jt=dt(a),Dt=jt.appendChild(a.createElement("div"));At.optgroup=At.option,At.tbody=At.tfoot=At.colgroup=At.caption=At.thead,At.th=At.td,x.fn.extend({text:function(e){return x.access(this,function(e){return e===t?x.text(this):this.empty().append((this[0]&&this[0].ownerDocument||a).createTextNode(e))},null,e,arguments.length)},append:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.appendChild(e)}})},prepend:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){var n,r=e?x.filter(e,this):this,i=0;for(;null!=(n=r[i]);i++)t||1!==n.nodeType||x.cleanData(Ft(n)),n.parentNode&&(t&&x.contains(n.ownerDocument,n)&&_t(Ft(n,"script")),n.parentNode.removeChild(n));return this},empty:function(){var e,t=0;for(;null!=(e=this[t]);t++){1===e.nodeType&&x.cleanData(Ft(e,!1));while(e.firstChild)e.removeChild(e.firstChild);e.options&&x.nodeName(e,"select")&&(e.options.length=0)}return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return x.clone(this,e,t)})},html:function(e){return x.access(this,function(e){var n=this[0]||{},r=0,i=this.length;if(e===t)return 1===n.nodeType?n.innerHTML.replace(gt,""):t;if(!("string"!=typeof e||Tt.test(e)||!x.support.htmlSerialize&&mt.test(e)||!x.support.leadingWhitespace&&yt.test(e)||At[(bt.exec(e)||["",""])[1].toLowerCase()])){e=e.replace(vt,"<$1></$2>");try{for(;i>r;r++)n=this[r]||{},1===n.nodeType&&(x.cleanData(Ft(n,!1)),n.innerHTML=e);n=0}catch(o){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=x.map(this,function(e){return[e.nextSibling,e.parentNode]}),t=0;return this.domManip(arguments,function(n){var r=e[t++],i=e[t++];i&&(r&&r.parentNode!==i&&(r=this.nextSibling),x(this).remove(),i.insertBefore(n,r))},!0),t?this:this.remove()},detach:function(e){return this.remove(e,!0)},domManip:function(e,t,n){e=d.apply([],e);var r,i,o,a,s,l,u=0,c=this.length,p=this,f=c-1,h=e[0],g=x.isFunction(h);if(g||!(1>=c||"string"!=typeof h||x.support.checkClone)&&Nt.test(h))return this.each(function(r){var i=p.eq(r);g&&(e[0]=h.call(this,r,i.html())),i.domManip(e,t,n)});if(c&&(l=x.buildFragment(e,this[0].ownerDocument,!1,!n&&this),r=l.firstChild,1===l.childNodes.length&&(l=r),r)){for(a=x.map(Ft(l,"script"),Ht),o=a.length;c>u;u++)i=l,u!==f&&(i=x.clone(i,!0,!0),o&&x.merge(a,Ft(i,"script"))),t.call(this[u],i,u);if(o)for(s=a[a.length-1].ownerDocument,x.map(a,qt),u=0;o>u;u++)i=a[u],kt.test(i.type||"")&&!x._data(i,"globalEval")&&x.contains(s,i)&&(i.src?x._evalUrl(i.src):x.globalEval((i.text||i.textContent||i.innerHTML||"").replace(St,"")));l=r=null}return this}});function Lt(e,t){return x.nodeName(e,"table")&&x.nodeName(1===t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function Ht(e){return e.type=(null!==x.find.attr(e,"type"))+"/"+e.type,e}function qt(e){var t=Et.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function _t(e,t){var n,r=0;for(;null!=(n=e[r]);r++)x._data(n,"globalEval",!t||x._data(t[r],"globalEval"))}function Mt(e,t){if(1===t.nodeType&&x.hasData(e)){var n,r,i,o=x._data(e),a=x._data(t,o),s=o.events;if(s){delete a.handle,a.events={};for(n in s)for(r=0,i=s[n].length;i>r;r++)x.event.add(t,n,s[n][r])}a.data&&(a.data=x.extend({},a.data))}}function Ot(e,t){var n,r,i;if(1===t.nodeType){if(n=t.nodeName.toLowerCase(),!x.support.noCloneEvent&&t[x.expando]){i=x._data(t);for(r in i.events)x.removeEvent(t,r,i.handle);t.removeAttribute(x.expando)}"script"===n&&t.text!==e.text?(Ht(t).text=e.text,qt(t)):"object"===n?(t.parentNode&&(t.outerHTML=e.outerHTML),x.support.html5Clone&&e.innerHTML&&!x.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):"input"===n&&Ct.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):"option"===n?t.defaultSelected=t.selected=e.defaultSelected:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}}x.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){x.fn[e]=function(e){var n,r=0,i=[],o=x(e),a=o.length-1;for(;a>=r;r++)n=r===a?this:this.clone(!0),x(o[r])[t](n),h.apply(i,n.get());return this.pushStack(i)}});function Ft(e,n){var r,o,a=0,s=typeof e.getElementsByTagName!==i?e.getElementsByTagName(n||"*"):typeof e.querySelectorAll!==i?e.querySelectorAll(n||"*"):t;if(!s)for(s=[],r=e.childNodes||e;null!=(o=r[a]);a++)!n||x.nodeName(o,n)?s.push(o):x.merge(s,Ft(o,n));return n===t||n&&x.nodeName(e,n)?x.merge([e],s):s}function Bt(e){Ct.test(e.type)&&(e.defaultChecked=e.checked)}x.extend({clone:function(e,t,n){var r,i,o,a,s,l=x.contains(e.ownerDocument,e);if(x.support.html5Clone||x.isXMLDoc(e)||!mt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(Dt.innerHTML=e.outerHTML,Dt.removeChild(o=Dt.firstChild)),!(x.support.noCloneEvent&&x.support.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||x.isXMLDoc(e)))for(r=Ft(o),s=Ft(e),a=0;null!=(i=s[a]);++a)r[a]&&Ot(i,r[a]);if(t)if(n)for(s=s||Ft(e),r=r||Ft(o),a=0;null!=(i=s[a]);a++)Mt(i,r[a]);else Mt(e,o);return r=Ft(o,"script"),r.length>0&&_t(r,!l&&Ft(e,"script")),r=s=i=null,o},buildFragment:function(e,t,n,r){var i,o,a,s,l,u,c,p=e.length,f=dt(t),d=[],h=0;for(;p>h;h++)if(o=e[h],o||0===o)if("object"===x.type(o))x.merge(d,o.nodeType?[o]:o);else if(wt.test(o)){s=s||f.appendChild(t.createElement("div")),l=(bt.exec(o)||["",""])[1].toLowerCase(),c=At[l]||At._default,s.innerHTML=c[1]+o.replace(vt,"<$1></$2>")+c[2],i=c[0];while(i--)s=s.lastChild;if(!x.support.leadingWhitespace&&yt.test(o)&&d.push(t.createTextNode(yt.exec(o)[0])),!x.support.tbody){o="table"!==l||xt.test(o)?"<table>"!==c[1]||xt.test(o)?0:s:s.firstChild,i=o&&o.childNodes.length;while(i--)x.nodeName(u=o.childNodes[i],"tbody")&&!u.childNodes.length&&o.removeChild(u)}x.merge(d,s.childNodes),s.textContent="";while(s.firstChild)s.removeChild(s.firstChild);s=f.lastChild}else d.push(t.createTextNode(o));s&&f.removeChild(s),x.support.appendChecked||x.grep(Ft(d,"input"),Bt),h=0;while(o=d[h++])if((!r||-1===x.inArray(o,r))&&(a=x.contains(o.ownerDocument,o),s=Ft(f.appendChild(o),"script"),a&&_t(s),n)){i=0;while(o=s[i++])kt.test(o.type||"")&&n.push(o)}return s=null,f},cleanData:function(e,t){var n,r,o,a,s=0,l=x.expando,u=x.cache,c=x.support.deleteExpando,f=x.event.special;for(;null!=(n=e[s]);s++)if((t||x.acceptData(n))&&(o=n[l],a=o&&u[o])){if(a.events)for(r in a.events)f[r]?x.event.remove(n,r):x.removeEvent(n,r,a.handle);
u[o]&&(delete u[o],c?delete n[l]:typeof n.removeAttribute!==i?n.removeAttribute(l):n[l]=null,p.push(o))}},_evalUrl:function(e){return x.ajax({url:e,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})}}),x.fn.extend({wrapAll:function(e){if(x.isFunction(e))return this.each(function(t){x(this).wrapAll(e.call(this,t))});if(this[0]){var t=x(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&1===e.firstChild.nodeType)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return x.isFunction(e)?this.each(function(t){x(this).wrapInner(e.call(this,t))}):this.each(function(){var t=x(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=x.isFunction(e);return this.each(function(n){x(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){x.nodeName(this,"body")||x(this).replaceWith(this.childNodes)}).end()}});var Pt,Rt,Wt,$t=/alpha\([^)]*\)/i,It=/opacity\s*=\s*([^)]*)/,zt=/^(top|right|bottom|left)$/,Xt=/^(none|table(?!-c[ea]).+)/,Ut=/^margin/,Vt=RegExp("^("+w+")(.*)$","i"),Yt=RegExp("^("+w+")(?!px)[a-z%]+$","i"),Jt=RegExp("^([+-])=("+w+")","i"),Gt={BODY:"block"},Qt={position:"absolute",visibility:"hidden",display:"block"},Kt={letterSpacing:0,fontWeight:400},Zt=["Top","Right","Bottom","Left"],en=["Webkit","O","Moz","ms"];function tn(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=en.length;while(i--)if(t=en[i]+n,t in e)return t;return r}function nn(e,t){return e=t||e,"none"===x.css(e,"display")||!x.contains(e.ownerDocument,e)}function rn(e,t){var n,r,i,o=[],a=0,s=e.length;for(;s>a;a++)r=e[a],r.style&&(o[a]=x._data(r,"olddisplay"),n=r.style.display,t?(o[a]||"none"!==n||(r.style.display=""),""===r.style.display&&nn(r)&&(o[a]=x._data(r,"olddisplay",ln(r.nodeName)))):o[a]||(i=nn(r),(n&&"none"!==n||!i)&&x._data(r,"olddisplay",i?n:x.css(r,"display"))));for(a=0;s>a;a++)r=e[a],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[a]||"":"none"));return e}x.fn.extend({css:function(e,n){return x.access(this,function(e,n,r){var i,o,a={},s=0;if(x.isArray(n)){for(o=Rt(e),i=n.length;i>s;s++)a[n[s]]=x.css(e,n[s],!1,o);return a}return r!==t?x.style(e,n,r):x.css(e,n)},e,n,arguments.length>1)},show:function(){return rn(this,!0)},hide:function(){return rn(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){nn(this)?x(this).show():x(this).hide()})}}),x.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Wt(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":x.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,r,i){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var o,a,s,l=x.camelCase(n),u=e.style;if(n=x.cssProps[l]||(x.cssProps[l]=tn(u,l)),s=x.cssHooks[n]||x.cssHooks[l],r===t)return s&&"get"in s&&(o=s.get(e,!1,i))!==t?o:u[n];if(a=typeof r,"string"===a&&(o=Jt.exec(r))&&(r=(o[1]+1)*o[2]+parseFloat(x.css(e,n)),a="number"),!(null==r||"number"===a&&isNaN(r)||("number"!==a||x.cssNumber[l]||(r+="px"),x.support.clearCloneStyle||""!==r||0!==n.indexOf("background")||(u[n]="inherit"),s&&"set"in s&&(r=s.set(e,r,i))===t)))try{u[n]=r}catch(c){}}},css:function(e,n,r,i){var o,a,s,l=x.camelCase(n);return n=x.cssProps[l]||(x.cssProps[l]=tn(e.style,l)),s=x.cssHooks[n]||x.cssHooks[l],s&&"get"in s&&(a=s.get(e,!0,r)),a===t&&(a=Wt(e,n,i)),"normal"===a&&n in Kt&&(a=Kt[n]),""===r||r?(o=parseFloat(a),r===!0||x.isNumeric(o)?o||0:a):a}}),e.getComputedStyle?(Rt=function(t){return e.getComputedStyle(t,null)},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s.getPropertyValue(n)||s[n]:t,u=e.style;return s&&(""!==l||x.contains(e.ownerDocument,e)||(l=x.style(e,n)),Yt.test(l)&&Ut.test(n)&&(i=u.width,o=u.minWidth,a=u.maxWidth,u.minWidth=u.maxWidth=u.width=l,l=s.width,u.width=i,u.minWidth=o,u.maxWidth=a)),l}):a.documentElement.currentStyle&&(Rt=function(e){return e.currentStyle},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s[n]:t,u=e.style;return null==l&&u&&u[n]&&(l=u[n]),Yt.test(l)&&!zt.test(n)&&(i=u.left,o=e.runtimeStyle,a=o&&o.left,a&&(o.left=e.currentStyle.left),u.left="fontSize"===n?"1em":l,l=u.pixelLeft+"px",u.left=i,a&&(o.left=a)),""===l?"auto":l});function on(e,t,n){var r=Vt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function an(e,t,n,r,i){var o=n===(r?"border":"content")?4:"width"===t?1:0,a=0;for(;4>o;o+=2)"margin"===n&&(a+=x.css(e,n+Zt[o],!0,i)),r?("content"===n&&(a-=x.css(e,"padding"+Zt[o],!0,i)),"margin"!==n&&(a-=x.css(e,"border"+Zt[o]+"Width",!0,i))):(a+=x.css(e,"padding"+Zt[o],!0,i),"padding"!==n&&(a+=x.css(e,"border"+Zt[o]+"Width",!0,i)));return a}function sn(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=Rt(e),a=x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,o);if(0>=i||null==i){if(i=Wt(e,t,o),(0>i||null==i)&&(i=e.style[t]),Yt.test(i))return i;r=a&&(x.support.boxSizingReliable||i===e.style[t]),i=parseFloat(i)||0}return i+an(e,t,n||(a?"border":"content"),r,o)+"px"}function ln(e){var t=a,n=Gt[e];return n||(n=un(e,t),"none"!==n&&n||(Pt=(Pt||x("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(t.documentElement),t=(Pt[0].contentWindow||Pt[0].contentDocument).document,t.write("<!doctype html><html><body>"),t.close(),n=un(e,t),Pt.detach()),Gt[e]=n),n}function un(e,t){var n=x(t.createElement(e)).appendTo(t.body),r=x.css(n[0],"display");return n.remove(),r}x.each(["height","width"],function(e,n){x.cssHooks[n]={get:function(e,r,i){return r?0===e.offsetWidth&&Xt.test(x.css(e,"display"))?x.swap(e,Qt,function(){return sn(e,n,i)}):sn(e,n,i):t},set:function(e,t,r){var i=r&&Rt(e);return on(e,t,r?an(e,n,r,x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,i),i):0)}}}),x.support.opacity||(x.cssHooks.opacity={get:function(e,t){return It.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=x.isNumeric(t)?"alpha(opacity="+100*t+")":"",o=r&&r.filter||n.filter||"";n.zoom=1,(t>=1||""===t)&&""===x.trim(o.replace($t,""))&&n.removeAttribute&&(n.removeAttribute("filter"),""===t||r&&!r.filter)||(n.filter=$t.test(o)?o.replace($t,i):o+" "+i)}}),x(function(){x.support.reliableMarginRight||(x.cssHooks.marginRight={get:function(e,n){return n?x.swap(e,{display:"inline-block"},Wt,[e,"marginRight"]):t}}),!x.support.pixelPosition&&x.fn.position&&x.each(["top","left"],function(e,n){x.cssHooks[n]={get:function(e,r){return r?(r=Wt(e,n),Yt.test(r)?x(e).position()[n]+"px":r):t}}})}),x.expr&&x.expr.filters&&(x.expr.filters.hidden=function(e){return 0>=e.offsetWidth&&0>=e.offsetHeight||!x.support.reliableHiddenOffsets&&"none"===(e.style&&e.style.display||x.css(e,"display"))},x.expr.filters.visible=function(e){return!x.expr.filters.hidden(e)}),x.each({margin:"",padding:"",border:"Width"},function(e,t){x.cssHooks[e+t]={expand:function(n){var r=0,i={},o="string"==typeof n?n.split(" "):[n];for(;4>r;r++)i[e+Zt[r]+t]=o[r]||o[r-2]||o[0];return i}},Ut.test(e)||(x.cssHooks[e+t].set=on)});var cn=/%20/g,pn=/\[\]$/,fn=/\r?\n/g,dn=/^(?:submit|button|image|reset|file)$/i,hn=/^(?:input|select|textarea|keygen)/i;x.fn.extend({serialize:function(){return x.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=x.prop(this,"elements");return e?x.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!x(this).is(":disabled")&&hn.test(this.nodeName)&&!dn.test(e)&&(this.checked||!Ct.test(e))}).map(function(e,t){var n=x(this).val();return null==n?null:x.isArray(n)?x.map(n,function(e){return{name:t.name,value:e.replace(fn,"\r\n")}}):{name:t.name,value:n.replace(fn,"\r\n")}}).get()}}),x.param=function(e,n){var r,i=[],o=function(e,t){t=x.isFunction(t)?t():null==t?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(n===t&&(n=x.ajaxSettings&&x.ajaxSettings.traditional),x.isArray(e)||e.jquery&&!x.isPlainObject(e))x.each(e,function(){o(this.name,this.value)});else for(r in e)gn(r,e[r],n,o);return i.join("&").replace(cn,"+")};function gn(e,t,n,r){var i;if(x.isArray(t))x.each(t,function(t,i){n||pn.test(e)?r(e,i):gn(e+"["+("object"==typeof i?t:"")+"]",i,n,r)});else if(n||"object"!==x.type(t))r(e,t);else for(i in t)gn(e+"["+i+"]",t[i],n,r)}x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){x.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),x.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}});var mn,yn,vn=x.now(),bn=/\?/,xn=/#.*$/,wn=/([?&])_=[^&]*/,Tn=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Cn=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Nn=/^(?:GET|HEAD)$/,kn=/^\/\//,En=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,Sn=x.fn.load,An={},jn={},Dn="*/".concat("*");try{yn=o.href}catch(Ln){yn=a.createElement("a"),yn.href="",yn=yn.href}mn=En.exec(yn.toLowerCase())||[];function Hn(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(T)||[];if(x.isFunction(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function qn(e,n,r,i){var o={},a=e===jn;function s(l){var u;return o[l]=!0,x.each(e[l]||[],function(e,l){var c=l(n,r,i);return"string"!=typeof c||a||o[c]?a?!(u=c):t:(n.dataTypes.unshift(c),s(c),!1)}),u}return s(n.dataTypes[0])||!o["*"]&&s("*")}function _n(e,n){var r,i,o=x.ajaxSettings.flatOptions||{};for(i in n)n[i]!==t&&((o[i]?e:r||(r={}))[i]=n[i]);return r&&x.extend(!0,e,r),e}x.fn.load=function(e,n,r){if("string"!=typeof e&&Sn)return Sn.apply(this,arguments);var i,o,a,s=this,l=e.indexOf(" ");return l>=0&&(i=e.slice(l,e.length),e=e.slice(0,l)),x.isFunction(n)?(r=n,n=t):n&&"object"==typeof n&&(a="POST"),s.length>0&&x.ajax({url:e,type:a,dataType:"html",data:n}).done(function(e){o=arguments,s.html(i?x("<div>").append(x.parseHTML(e)).find(i):e)}).complete(r&&function(e,t){s.each(r,o||[e.responseText,t,e])}),this},x.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){x.fn[t]=function(e){return this.on(t,e)}}),x.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:yn,type:"GET",isLocal:Cn.test(mn[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Dn,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":x.parseJSON,"text xml":x.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?_n(_n(e,x.ajaxSettings),t):_n(x.ajaxSettings,e)},ajaxPrefilter:Hn(An),ajaxTransport:Hn(jn),ajax:function(e,n){"object"==typeof e&&(n=e,e=t),n=n||{};var r,i,o,a,s,l,u,c,p=x.ajaxSetup({},n),f=p.context||p,d=p.context&&(f.nodeType||f.jquery)?x(f):x.event,h=x.Deferred(),g=x.Callbacks("once memory"),m=p.statusCode||{},y={},v={},b=0,w="canceled",C={readyState:0,getResponseHeader:function(e){var t;if(2===b){if(!c){c={};while(t=Tn.exec(a))c[t[1].toLowerCase()]=t[2]}t=c[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===b?a:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return b||(e=v[n]=v[n]||e,y[e]=t),this},overrideMimeType:function(e){return b||(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>b)for(t in e)m[t]=[m[t],e[t]];else C.always(e[C.status]);return this},abort:function(e){var t=e||w;return u&&u.abort(t),k(0,t),this}};if(h.promise(C).complete=g.add,C.success=C.done,C.error=C.fail,p.url=((e||p.url||yn)+"").replace(xn,"").replace(kn,mn[1]+"//"),p.type=n.method||n.type||p.method||p.type,p.dataTypes=x.trim(p.dataType||"*").toLowerCase().match(T)||[""],null==p.crossDomain&&(r=En.exec(p.url.toLowerCase()),p.crossDomain=!(!r||r[1]===mn[1]&&r[2]===mn[2]&&(r[3]||("http:"===r[1]?"80":"443"))===(mn[3]||("http:"===mn[1]?"80":"443")))),p.data&&p.processData&&"string"!=typeof p.data&&(p.data=x.param(p.data,p.traditional)),qn(An,p,n,C),2===b)return C;l=p.global,l&&0===x.active++&&x.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Nn.test(p.type),o=p.url,p.hasContent||(p.data&&(o=p.url+=(bn.test(o)?"&":"?")+p.data,delete p.data),p.cache===!1&&(p.url=wn.test(o)?o.replace(wn,"$1_="+vn++):o+(bn.test(o)?"&":"?")+"_="+vn++)),p.ifModified&&(x.lastModified[o]&&C.setRequestHeader("If-Modified-Since",x.lastModified[o]),x.etag[o]&&C.setRequestHeader("If-None-Match",x.etag[o])),(p.data&&p.hasContent&&p.contentType!==!1||n.contentType)&&C.setRequestHeader("Content-Type",p.contentType),C.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+Dn+"; q=0.01":""):p.accepts["*"]);for(i in p.headers)C.setRequestHeader(i,p.headers[i]);if(p.beforeSend&&(p.beforeSend.call(f,C,p)===!1||2===b))return C.abort();w="abort";for(i in{success:1,error:1,complete:1})C[i](p[i]);if(u=qn(jn,p,n,C)){C.readyState=1,l&&d.trigger("ajaxSend",[C,p]),p.async&&p.timeout>0&&(s=setTimeout(function(){C.abort("timeout")},p.timeout));try{b=1,u.send(y,k)}catch(N){if(!(2>b))throw N;k(-1,N)}}else k(-1,"No Transport");function k(e,n,r,i){var c,y,v,w,T,N=n;2!==b&&(b=2,s&&clearTimeout(s),u=t,a=i||"",C.readyState=e>0?4:0,c=e>=200&&300>e||304===e,r&&(w=Mn(p,C,r)),w=On(p,w,C,c),c?(p.ifModified&&(T=C.getResponseHeader("Last-Modified"),T&&(x.lastModified[o]=T),T=C.getResponseHeader("etag"),T&&(x.etag[o]=T)),204===e||"HEAD"===p.type?N="nocontent":304===e?N="notmodified":(N=w.state,y=w.data,v=w.error,c=!v)):(v=N,(e||!N)&&(N="error",0>e&&(e=0))),C.status=e,C.statusText=(n||N)+"",c?h.resolveWith(f,[y,N,C]):h.rejectWith(f,[C,N,v]),C.statusCode(m),m=t,l&&d.trigger(c?"ajaxSuccess":"ajaxError",[C,p,c?y:v]),g.fireWith(f,[C,N]),l&&(d.trigger("ajaxComplete",[C,p]),--x.active||x.event.trigger("ajaxStop")))}return C},getJSON:function(e,t,n){return x.get(e,t,n,"json")},getScript:function(e,n){return x.get(e,t,n,"script")}}),x.each(["get","post"],function(e,n){x[n]=function(e,r,i,o){return x.isFunction(r)&&(o=o||i,i=r,r=t),x.ajax({url:e,type:n,dataType:o,data:r,success:i})}});function Mn(e,n,r){var i,o,a,s,l=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),o===t&&(o=e.mimeType||n.getResponseHeader("Content-Type"));if(o)for(s in l)if(l[s]&&l[s].test(o)){u.unshift(s);break}if(u[0]in r)a=u[0];else{for(s in r){if(!u[0]||e.converters[s+" "+u[0]]){a=s;break}i||(i=s)}a=a||i}return a?(a!==u[0]&&u.unshift(a),r[a]):t}function On(e,t,n,r){var i,o,a,s,l,u={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)u[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!l&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),l=o,o=c.shift())if("*"===o)o=l;else if("*"!==l&&l!==o){if(a=u[l+" "+o]||u["* "+o],!a)for(i in u)if(s=i.split(" "),s[1]===o&&(a=u[l+" "+s[0]]||u["* "+s[0]])){a===!0?a=u[i]:u[i]!==!0&&(o=s[0],c.unshift(s[1]));break}if(a!==!0)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(p){return{state:"parsererror",error:a?p:"No conversion from "+l+" to "+o}}}return{state:"success",data:t}}x.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return x.globalEval(e),e}}}),x.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),x.ajaxTransport("script",function(e){if(e.crossDomain){var n,r=a.head||x("head")[0]||a.documentElement;return{send:function(t,i){n=a.createElement("script"),n.async=!0,e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,t){(t||!n.readyState||/loaded|complete/.test(n.readyState))&&(n.onload=n.onreadystatechange=null,n.parentNode&&n.parentNode.removeChild(n),n=null,t||i(200,"success"))},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(t,!0)}}}});var Fn=[],Bn=/(=)\?(?=&|$)|\?\?/;x.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Fn.pop()||x.expando+"_"+vn++;return this[e]=!0,e}}),x.ajaxPrefilter("json jsonp",function(n,r,i){var o,a,s,l=n.jsonp!==!1&&(Bn.test(n.url)?"url":"string"==typeof n.data&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Bn.test(n.data)&&"data");return l||"jsonp"===n.dataTypes[0]?(o=n.jsonpCallback=x.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,l?n[l]=n[l].replace(Bn,"$1"+o):n.jsonp!==!1&&(n.url+=(bn.test(n.url)?"&":"?")+n.jsonp+"="+o),n.converters["script json"]=function(){return s||x.error(o+" was not called"),s[0]},n.dataTypes[0]="json",a=e[o],e[o]=function(){s=arguments},i.always(function(){e[o]=a,n[o]&&(n.jsonpCallback=r.jsonpCallback,Fn.push(o)),s&&x.isFunction(a)&&a(s[0]),s=a=t}),"script"):t});var Pn,Rn,Wn=0,$n=e.ActiveXObject&&function(){var e;for(e in Pn)Pn[e](t,!0)};function In(){try{return new e.XMLHttpRequest}catch(t){}}function zn(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}x.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&In()||zn()}:In,Rn=x.ajaxSettings.xhr(),x.support.cors=!!Rn&&"withCredentials"in Rn,Rn=x.support.ajax=!!Rn,Rn&&x.ajaxTransport(function(n){if(!n.crossDomain||x.support.cors){var r;return{send:function(i,o){var a,s,l=n.xhr();if(n.username?l.open(n.type,n.url,n.async,n.username,n.password):l.open(n.type,n.url,n.async),n.xhrFields)for(s in n.xhrFields)l[s]=n.xhrFields[s];n.mimeType&&l.overrideMimeType&&l.overrideMimeType(n.mimeType),n.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");try{for(s in i)l.setRequestHeader(s,i[s])}catch(u){}l.send(n.hasContent&&n.data||null),r=function(e,i){var s,u,c,p;try{if(r&&(i||4===l.readyState))if(r=t,a&&(l.onreadystatechange=x.noop,$n&&delete Pn[a]),i)4!==l.readyState&&l.abort();else{p={},s=l.status,u=l.getAllResponseHeaders(),"string"==typeof l.responseText&&(p.text=l.responseText);try{c=l.statusText}catch(f){c=""}s||!n.isLocal||n.crossDomain?1223===s&&(s=204):s=p.text?200:404}}catch(d){i||o(-1,d)}p&&o(s,c,p,u)},n.async?4===l.readyState?setTimeout(r):(a=++Wn,$n&&(Pn||(Pn={},x(e).unload($n)),Pn[a]=r),l.onreadystatechange=r):r()},abort:function(){r&&r(t,!0)}}}});var Xn,Un,Vn=/^(?:toggle|show|hide)$/,Yn=RegExp("^(?:([+-])=|)("+w+")([a-z%]*)$","i"),Jn=/queueHooks$/,Gn=[nr],Qn={"*":[function(e,t){var n=this.createTween(e,t),r=n.cur(),i=Yn.exec(t),o=i&&i[3]||(x.cssNumber[e]?"":"px"),a=(x.cssNumber[e]||"px"!==o&&+r)&&Yn.exec(x.css(n.elem,e)),s=1,l=20;if(a&&a[3]!==o){o=o||a[3],i=i||[],a=+r||1;do s=s||".5",a/=s,x.style(n.elem,e,a+o);while(s!==(s=n.cur()/r)&&1!==s&&--l)}return i&&(a=n.start=+a||+r||0,n.unit=o,n.end=i[1]?a+(i[1]+1)*i[2]:+i[2]),n}]};function Kn(){return setTimeout(function(){Xn=t}),Xn=x.now()}function Zn(e,t,n){var r,i=(Qn[t]||[]).concat(Qn["*"]),o=0,a=i.length;for(;a>o;o++)if(r=i[o].call(n,t,e))return r}function er(e,t,n){var r,i,o=0,a=Gn.length,s=x.Deferred().always(function(){delete l.elem}),l=function(){if(i)return!1;var t=Xn||Kn(),n=Math.max(0,u.startTime+u.duration-t),r=n/u.duration||0,o=1-r,a=0,l=u.tweens.length;for(;l>a;a++)u.tweens[a].run(o);return s.notifyWith(e,[u,o,n]),1>o&&l?n:(s.resolveWith(e,[u]),!1)},u=s.promise({elem:e,props:x.extend({},t),opts:x.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:Xn||Kn(),duration:n.duration,tweens:[],createTween:function(t,n){var r=x.Tween(e,u.opts,t,n,u.opts.specialEasing[t]||u.opts.easing);return u.tweens.push(r),r},stop:function(t){var n=0,r=t?u.tweens.length:0;if(i)return this;for(i=!0;r>n;n++)u.tweens[n].run(1);return t?s.resolveWith(e,[u,t]):s.rejectWith(e,[u,t]),this}}),c=u.props;for(tr(c,u.opts.specialEasing);a>o;o++)if(r=Gn[o].call(u,e,c,u.opts))return r;return x.map(c,Zn,u),x.isFunction(u.opts.start)&&u.opts.start.call(e,u),x.fx.timer(x.extend(l,{elem:e,anim:u,queue:u.opts.queue})),u.progress(u.opts.progress).done(u.opts.done,u.opts.complete).fail(u.opts.fail).always(u.opts.always)}function tr(e,t){var n,r,i,o,a;for(n in e)if(r=x.camelCase(n),i=t[r],o=e[n],x.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),a=x.cssHooks[r],a&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}x.Animation=x.extend(er,{tweener:function(e,t){x.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;i>r;r++)n=e[r],Qn[n]=Qn[n]||[],Qn[n].unshift(t)},prefilter:function(e,t){t?Gn.unshift(e):Gn.push(e)}});function nr(e,t,n){var r,i,o,a,s,l,u=this,c={},p=e.style,f=e.nodeType&&nn(e),d=x._data(e,"fxshow");n.queue||(s=x._queueHooks(e,"fx"),null==s.unqueued&&(s.unqueued=0,l=s.empty.fire,s.empty.fire=function(){s.unqueued||l()}),s.unqueued++,u.always(function(){u.always(function(){s.unqueued--,x.queue(e,"fx").length||s.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],"inline"===x.css(e,"display")&&"none"===x.css(e,"float")&&(x.support.inlineBlockNeedsLayout&&"inline"!==ln(e.nodeName)?p.zoom=1:p.display="inline-block")),n.overflow&&(p.overflow="hidden",x.support.shrinkWrapBlocks||u.always(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t)if(i=t[r],Vn.exec(i)){if(delete t[r],o=o||"toggle"===i,i===(f?"hide":"show"))continue;c[r]=d&&d[r]||x.style(e,r)}if(!x.isEmptyObject(c)){d?"hidden"in d&&(f=d.hidden):d=x._data(e,"fxshow",{}),o&&(d.hidden=!f),f?x(e).show():u.done(function(){x(e).hide()}),u.done(function(){var t;x._removeData(e,"fxshow");for(t in c)x.style(e,t,c[t])});for(r in c)a=Zn(f?d[r]:0,r,u),r in d||(d[r]=a.start,f&&(a.end=a.start,a.start="width"===r||"height"===r?1:0))}}function rr(e,t,n,r,i){return new rr.prototype.init(e,t,n,r,i)}x.Tween=rr,rr.prototype={constructor:rr,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(x.cssNumber[n]?"":"px")},cur:function(){var e=rr.propHooks[this.prop];return e&&e.get?e.get(this):rr.propHooks._default.get(this)},run:function(e){var t,n=rr.propHooks[this.prop];return this.pos=t=this.options.duration?x.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):rr.propHooks._default.set(this),this}},rr.prototype.init.prototype=rr.prototype,rr.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=x.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){x.fx.step[e.prop]?x.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[x.cssProps[e.prop]]||x.cssHooks[e.prop])?x.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},rr.propHooks.scrollTop=rr.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},x.each(["toggle","show","hide"],function(e,t){var n=x.fn[t];x.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ir(t,!0),e,r,i)}}),x.fn.extend({fadeTo:function(e,t,n,r){return this.filter(nn).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=x.isEmptyObject(e),o=x.speed(t,n,r),a=function(){var t=er(this,x.extend({},e),o);(i||x._data(this,"finish"))&&t.stop(!0)};return a.finish=a,i||o.queue===!1?this.each(a):this.queue(o.queue,a)},stop:function(e,n,r){var i=function(e){var t=e.stop;delete e.stop,t(r)};return"string"!=typeof e&&(r=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=null!=e&&e+"queueHooks",o=x.timers,a=x._data(this);if(n)a[n]&&a[n].stop&&i(a[n]);else for(n in a)a[n]&&a[n].stop&&Jn.test(n)&&i(a[n]);for(n=o.length;n--;)o[n].elem!==this||null!=e&&o[n].queue!==e||(o[n].anim.stop(r),t=!1,o.splice(n,1));(t||!r)&&x.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=x._data(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=x.timers,a=r?r.length:0;for(n.finish=!0,x.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;a>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}});function ir(e,t){var n,r={height:e},i=0;for(t=t?1:0;4>i;i+=2-t)n=Zt[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}x.each({slideDown:ir("show"),slideUp:ir("hide"),slideToggle:ir("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){x.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),x.speed=function(e,t,n){var r=e&&"object"==typeof e?x.extend({},e):{complete:n||!n&&t||x.isFunction(e)&&e,duration:e,easing:n&&t||t&&!x.isFunction(t)&&t};return r.duration=x.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in x.fx.speeds?x.fx.speeds[r.duration]:x.fx.speeds._default,(null==r.queue||r.queue===!0)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){x.isFunction(r.old)&&r.old.call(this),r.queue&&x.dequeue(this,r.queue)},r},x.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},x.timers=[],x.fx=rr.prototype.init,x.fx.tick=function(){var e,n=x.timers,r=0;for(Xn=x.now();n.length>r;r++)e=n[r],e()||n[r]!==e||n.splice(r--,1);n.length||x.fx.stop(),Xn=t},x.fx.timer=function(e){e()&&x.timers.push(e)&&x.fx.start()},x.fx.interval=13,x.fx.start=function(){Un||(Un=setInterval(x.fx.tick,x.fx.interval))},x.fx.stop=function(){clearInterval(Un),Un=null},x.fx.speeds={slow:600,fast:200,_default:400},x.fx.step={},x.expr&&x.expr.filters&&(x.expr.filters.animated=function(e){return x.grep(x.timers,function(t){return e===t.elem}).length}),x.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){x.offset.setOffset(this,e,t)});var n,r,o={top:0,left:0},a=this[0],s=a&&a.ownerDocument;if(s)return n=s.documentElement,x.contains(n,a)?(typeof a.getBoundingClientRect!==i&&(o=a.getBoundingClientRect()),r=or(s),{top:o.top+(r.pageYOffset||n.scrollTop)-(n.clientTop||0),left:o.left+(r.pageXOffset||n.scrollLeft)-(n.clientLeft||0)}):o},x.offset={setOffset:function(e,t,n){var r=x.css(e,"position");"static"===r&&(e.style.position="relative");var i=x(e),o=i.offset(),a=x.css(e,"top"),s=x.css(e,"left"),l=("absolute"===r||"fixed"===r)&&x.inArray("auto",[a,s])>-1,u={},c={},p,f;l?(c=i.position(),p=c.top,f=c.left):(p=parseFloat(a)||0,f=parseFloat(s)||0),x.isFunction(t)&&(t=t.call(e,n,o)),null!=t.top&&(u.top=t.top-o.top+p),null!=t.left&&(u.left=t.left-o.left+f),"using"in t?t.using.call(e,u):i.css(u)}},x.fn.extend({position:function(){if(this[0]){var e,t,n={top:0,left:0},r=this[0];return"fixed"===x.css(r,"position")?t=r.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),x.nodeName(e[0],"html")||(n=e.offset()),n.top+=x.css(e[0],"borderTopWidth",!0),n.left+=x.css(e[0],"borderLeftWidth",!0)),{top:t.top-n.top-x.css(r,"marginTop",!0),left:t.left-n.left-x.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||s;while(e&&!x.nodeName(e,"html")&&"static"===x.css(e,"position"))e=e.offsetParent;return e||s})}}),x.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var r=/Y/.test(n);x.fn[e]=function(i){return x.access(this,function(e,i,o){var a=or(e);return o===t?a?n in a?a[n]:a.document.documentElement[i]:e[i]:(a?a.scrollTo(r?x(a).scrollLeft():o,r?o:x(a).scrollTop()):e[i]=o,t)},e,i,arguments.length,null)}});function or(e){return x.isWindow(e)?e:9===e.nodeType?e.defaultView||e.parentWindow:!1}x.each({Height:"height",Width:"width"},function(e,n){x.each({padding:"inner"+e,content:n,"":"outer"+e},function(r,i){x.fn[i]=function(i,o){var a=arguments.length&&(r||"boolean"!=typeof i),s=r||(i===!0||o===!0?"margin":"border");return x.access(this,function(n,r,i){var o;return x.isWindow(n)?n.document.documentElement["client"+e]:9===n.nodeType?(o=n.documentElement,Math.max(n.body["scroll"+e],o["scroll"+e],n.body["offset"+e],o["offset"+e],o["client"+e])):i===t?x.css(n,r,s):x.style(n,r,i,s)},n,a?i:t,a,null)}})}),x.fn.size=function(){return this.length},x.fn.andSelf=x.fn.addBack,"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=x:(e.jQuery=e.$=x,"function"==typeof define&&define.amd&&define("jquery",[],function(){return x}))})(window);

var includeJQuery=true;

var button_grey_play = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAAEgBckRAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAADZBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDQuMi4yLWMwNjMgNTMuMzUyNjI0LCAyMDA4LzA3LzMwLTE4OjA1OjQxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOklwdGM0eG1wQ29yZT0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcENvcmUvMS4wL3htbG5zLyIKICAgeG1wUmlnaHRzOldlYlN0YXRlbWVudD0iaHR0cDovL2Jsb2cuYWRkaWN0ZWR0b2NvZmZlZS5kZSIKICAgcGhvdG9zaG9wOkF1dGhvcnNQb3NpdGlvbj0iIj4KICAgPGRjOnJpZ2h0cz4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+wqkgICAgICAgICAgICYjeEE7IDIwMDkgYnkgT2xpdmVyIFR3YXJkb3dza2k8L3JkZjpsaT4KICAgIDwvcmRmOkFsdD4KICAgPC9kYzpyaWdodHM+CiAgIDxkYzpjcmVhdG9yPgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaT5PbGl2ZXIgVHdhcmRvd3NraTwvcmRmOmxpPgogICAgPC9yZGY6U2VxPgogICA8L2RjOmNyZWF0b3I+CiAgIDxkYzp0aXRsZT4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCIvPgogICAgPC9yZGY6QWx0PgogICA8L2RjOnRpdGxlPgogICA8eG1wUmlnaHRzOlVzYWdlVGVybXM+CiAgICA8cmRmOkFsdD4KICAgICA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiLz4KICAgIDwvcmRmOkFsdD4KICAgPC94bXBSaWdodHM6VXNhZ2VUZXJtcz4KICAgPElwdGM0eG1wQ29yZTpDcmVhdG9yQ29udGFjdEluZm8KICAgIElwdGM0eG1wQ29yZTpDaUFkckV4dGFkcj0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyQ2l0eT0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyUmVnaW9uPSIiCiAgICBJcHRjNHhtcENvcmU6Q2lBZHJQY29kZT0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyQ3RyeT0iIgogICAgSXB0YzR4bXBDb3JlOkNpVGVsV29yaz0iIgogICAgSXB0YzR4bXBDb3JlOkNpRW1haWxXb3JrPSIiCiAgICBJcHRjNHhtcENvcmU6Q2lVcmxXb3JrPSIiLz4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PgiL5zQAAAzuSURBVHjabE3LDQARFJy3WeLmpCklaEElGlGCcvTggiB5GxK3ndN8M8TM+MN7SUqJhRCYc8JaS7QX29RaQymF3jtKKXh2u9aKtRa898g5H32CMQZaawghwBhzNN3zGCNLKY/pnKNPADHiddWxY8f+f/nyBSzw6cevvyF+PizMr34yrleTl9YAuUZERISBmeE/k5KSUjOTkbKML8ji5uZmhpycHLAjGLiFDzMycgkrrVs65y5INchzID8EBAQwMoAsNzC1+rBq1ar/IMzIJbQAJAYQQGAJZOyfkDl/7YZNv69du/Z/2qz538saWk2R5eHe2L59+38mJiYGUDiysLAwMDJCbAGFFMjqp2/f/U6KimQDa+idOOWrrqYaFyhsOTk5Gdrb28GGNDY2gsMa5AEQvePExXPgoD126tQHkOM/ffrEAAqXJ0+egE3/+vUrmA8SB8lPbG3cBneSjqHJj7rKMnZQsKM7CRQNEbHpK//9fB+B4mEg4ABiPUY2vqWMnIK3GVm5uoF8NWQ1AAGEM+5wASZ0gbTCsjcnTp78d/DwkX8qdl5X0eXhNhj7hN9ozIhVB7kfFLwg8O/fPzDef/K8Y3dj9QG4htC0/FkJ/m6pIA+D4oGZmRms4e/fv+A4AHna29ubEa5hy5Yt4ETJzs4OxiBNIABS/PPnTzC+ee/ht9yMVG6w3aAgBJkKUgjS0NbWxrBmzRq4ZpCckqwUF9zToEgBRRAookAx+vTpU4b9+/czpKenwyMPpAYlP8I8CIookDOXL18O1gjKaSBxlFBauHDhPy4uLkZQOgI5A+QfWG4EuR+UlsIjo1/9+/NLHOykxKxidpgHQZIgJ4AwiA0TAylGiQcmbhGJrsaK57KysijxsH37zv8LFsxDRDBaWpJlZGGNY2QXOMPAzr8PyDcFYmFkNQABRHJaIhWw4JIIT8uf4G5jkaGmJMv+4cMHcNyCMLJPQF6VkpJiCMmvvhfv7axbU1r4DWdahQHrwNjbNWlRKqDwASUIkCEgDDIcFnaw8APphUU3KJn++c/499jZ8zqd9dU3MCwAGsA4e/6ibxIighygDAEyHJYxYBkcmwWgdARLT2BLgPSCLfv2r5nR54SSPbPLa97BDAdhUJJGzh/d3d0Mvb29YDYovcHSHCzdwQo/EE7wcXLMKa8ORokDI3UlHlDag7kMlqdgrv78+TOYX15eDuaDXBoaGspgYGAAZsNKUxAG+WTX8bPVQGVr4Ra8fvvuFwc7OwvIJbCwhVkEokEWwCwFAWBtwGBtbc3w/v17cI4BYVj5CLLkzvFDH1F8UFFZ+XTx/HmqsAgDGQTSALMAJD579mxwZoepeffuHdgwWPiDMEju8+cvv69eveSLkYqYWNgeL1owTwY5PEGRjZya0AsLmMGwYHr69NnfktpWxX9f3zzGmkyBWVpFX1vlemlBHgvMYBCNKxXBXA0Kquz88lN/f340x5sP0CyrsDI3rLUyMeSSlJRkgLUsQAXPmzdvGG7dus2waPn6S0CvOgBd/B6bGTQvKgACiOYWMDHQGLDgkyxvbDNdu/fIguLYMCUtDRV2MRFhxk+fPv9/+uLl3x0HDn989eHL5g3zpyWSHEQt3f1cC7fuvbx6QovS8+fPwakEuSSF5Q1QpN+69/jn9iPHZ6+eNSmXKAtK61sdzI309nCxMjPDimRYaQqzBFaZwPKCoKAgQ27bxJtnt6zUwGtBeWOrhpWx4RVmhn/MsPRPjAWwnN8ya9mdo+sXq+KMZHVVpUsgw2FFNYzGh2FqQABUj4CaNVgtCMko2ifGx8sKczkMIxffyBi9KAFhkK88rE1jgb5hQrEAJGCnrwHO4si1F8wQYIMXpwWwSgmmR1xYgCOzomEtigXZZVWBoLYSLLyRXQXCz549Y2hqamI4e/Ys3HBYGwsZw/Qz/f/jgGIBGy9/Naysh2F0jSBDd+7cyVBdXQ1uRKMbjqxXWVqCDSWjbdm1j8FaUxlsCCxlwFILCIAKN1iNBgKg/gmo0KupqYHXYrAKB4QF+XjYUHxw+9yZ77C+AKhpBtMA0wwyHORqGAbxX716xdDT04OiFqQXZMbfP38ZUXzA+PPbT+SkBSvrkVpwqOUL0Kdz584FWwIyGJYnYOD9h48/US1gYjoKpByRDUTOSMji9fX1DBISEgxv375FkUfOgCfOX/iAEkRXLl/o/Pr12x+YBuSqEFZjubi4MMyZMwdcLICCE7kehqmB4bUrl3/BKCqA9fFLYH0shp4MQTSobwkKe+SiAmYwrJkCq/yB8fA/IbNIBVjD3UMtrtn5TF6+fHVfUlICXA6BNMEAKKxhmQk5+NB9AKITklKeAtvu9zDqA1ArgIldcM38WRPCYZU7ekQjWwDrNiHjtu6+n0CHKuEtrpnZ+U9OmdBhBirrYWUNvtIU1mTpnjD5z8WrtzWBDr1DsMJh4hZeEBviE+fq6sqIXNZgswDUcVq8ct3HS1dvagANf0F0pQ9ssggCnXYgLjJQT01NFRzRPDw84IwEinBQTXfszPlvR0+cawYa3EFyqwLoWmFQdwiI+YHd7LD/TKzGwPwiy/Dv/0eG//9uMvz7vvP/n98XQPkK1LQFmvNjQJotAAG6tfaYtsoofvsAbumD0TC6ORFSBrKtIJWJNqEryB9uikHtDBk64sIjizOaSDKXdZHNgdn2j3GJsrmwLYaAipAQipnJeGWJTlC60BFd3RgOcO1KukFLH7S03nPTj3x+ubeDzG2JNzm5t/fRe37f45zz+333ob/gsZZFq9k+MB0ptztdJbNz82mue+71/mCAds27lXBNqZC76LgEv3KN/HZKkmJq3VrlwOdNDd2PrQcONR3PuPLHRJPtb7vhUHXlWk1OdjxMEAiBKDvADIFj2CCawUxCTA7YHWzW322LjS1tzuwn1g3l56hNjaaPJh8agANHPtUM/jp26q1XSp/VbdVKQPOA2UYmcjxgcW1k4gBTKBTsDP5peNTX2ntxtHhr3t5jDQev/icAoE4dsFjPfVz3TloiLRZBmMAdJg2LArzOkwBwA87t9YeWPvnq/FSJNncPUsJWDQCq9yHL1f66neUFUob6o+odL+CQk2Sg5eoJvOXJYIznL7SHZz2BUOhMR/dvBq3mRS6NhRcAcJqxaceP7722PSkSWRIi50jNBeU8HABOchEI8h14jYIA4LUJfiwUisMnu36Yy3tS9dLxhoMj9wWw/3CT/prjrrl6xzY544wAdxY5ijRM8jzeK/ieq/VJZxEQyL3keeZ35EzvoPtpVXLZicOmS7wAMjI3Kgq3v2F7s7gwRSKhRaTzsQzubW5uphwOB6XT6ajS0tLlaMM17rkAxDK/P7D0bf/l2eELXdmTN67Pc+aBypp9p4QBN71S5xEdwDkHTEKLxcIaVDEqlYoqKyuj1Gr1v5yHe1Grx4paaKPpBFFWiiwhq3bfl8zPtzkBjF2z5Zbrn6PxF5D1HJpg6Dzch64jMQ13CHoESmX0nF6vpwwGA5sTWLk2+p9kHY9KOdwHdXq6pPvScD5vJh7oG/TtLNaJ2RUkrJVJJk6SNtjDi0A4R+I5X6uazWaqp6eHBQpKrtFopEDE5qr/8Uoa9mKRUNx3sd/LC8B/57bP61sIi8XCZfmAK35zVH6soSwcCwA8L5fLqZqaGqqoqIhVy6DBcAA458CpAfgGPvICiIS98zf+mvZoNZuS+SYeGjLkebzYxiMPOl9QUEBVVVWxqg/0Egw34PQkx8QnOMk7J25NeyJh3z1eABk5zzR+09HZmb/FlMyXLVHMJjMvGSalUilVUVHB0kVYm2EXQpjnQL7lGuck5ed679ft33kzNucf5QUwYR0ZEcZL27rMF2qNr+5YQw6TZV7FDC3U1Ui3gZ7JzMyk6uvrqdTUVJb+g0N2u53TKb7JSgJC1tHde9c5M9PquGkbvV8mFggT5KdLirft2rN7lyxW+CSzMp6R+RIZFwB82HABONfa7unrG2wPB9x7YQCsjPMlKt9Xp284Ztr/oQRiO2p5rgSGygfymC8T43IGX0IDIBAQjp74zHdzcupA2Os6uepqlCGuqYJQsFOr1Tz/bl11HEhOZNlAHuNDjRT/Y2Vk/BjmyxenW4IWi/WXiDjOyJDiOw/EB2CFggkbLZu2bHyh0vh6PMRtku6vhBNwDSVkEIJhNb2to3NxfPz6ZeYF1aQG8cCMjAECC8u7qchSbV7e5twSXaEUVkHgKwkYZuTwiUVogFc4nU42lA79PLJwZWzcSglEZ5lL5xnHg4+E1DOA0kCAZuzltKc2ZK1PUSoVSbJ4mUQSJ5MmChJpmkXi9fsjngVvxOPzBT1znsWZWZdr6tbMn/DRCWPfo8WpR8KJmdaFTxukjMECvST6qQPM8vioiaMmxGT2cNRCUVuMGgidoMdAdoUSYYFPn/nfyir/AM9HvkJajVznAAAAAElFTkSuQmCC';
var button_grey_stop = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAAEgBckRAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAADZBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDQuMi4yLWMwNjMgNTMuMzUyNjI0LCAyMDA4LzA3LzMwLTE4OjA1OjQxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOklwdGM0eG1wQ29yZT0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcENvcmUvMS4wL3htbG5zLyIKICAgeG1wUmlnaHRzOldlYlN0YXRlbWVudD0iaHR0cDovL2Jsb2cuYWRkaWN0ZWR0b2NvZmZlZS5kZSIKICAgcGhvdG9zaG9wOkF1dGhvcnNQb3NpdGlvbj0iIj4KICAgPGRjOnJpZ2h0cz4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+wqkgICAgICAgICAgICYjeEE7IDIwMDkgYnkgT2xpdmVyIFR3YXJkb3dza2k8L3JkZjpsaT4KICAgIDwvcmRmOkFsdD4KICAgPC9kYzpyaWdodHM+CiAgIDxkYzpjcmVhdG9yPgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaT5PbGl2ZXIgVHdhcmRvd3NraTwvcmRmOmxpPgogICAgPC9yZGY6U2VxPgogICA8L2RjOmNyZWF0b3I+CiAgIDxkYzp0aXRsZT4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCIvPgogICAgPC9yZGY6QWx0PgogICA8L2RjOnRpdGxlPgogICA8eG1wUmlnaHRzOlVzYWdlVGVybXM+CiAgICA8cmRmOkFsdD4KICAgICA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiLz4KICAgIDwvcmRmOkFsdD4KICAgPC94bXBSaWdodHM6VXNhZ2VUZXJtcz4KICAgPElwdGM0eG1wQ29yZTpDcmVhdG9yQ29udGFjdEluZm8KICAgIElwdGM0eG1wQ29yZTpDaUFkckV4dGFkcj0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyQ2l0eT0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyUmVnaW9uPSIiCiAgICBJcHRjNHhtcENvcmU6Q2lBZHJQY29kZT0iIgogICAgSXB0YzR4bXBDb3JlOkNpQWRyQ3RyeT0iIgogICAgSXB0YzR4bXBDb3JlOkNpVGVsV29yaz0iIgogICAgSXB0YzR4bXBDb3JlOkNpRW1haWxXb3JrPSIiCiAgICBJcHRjNHhtcENvcmU6Q2lVcmxXb3JrPSIiLz4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PgiL5zQAAAvhSURBVHjabI3LCQAhDEQnyyre7MsSbMFKbMQS7MuLih+yGPC2A4GZl4QhZsaf3mtyzqyUwpwTzjmi83GgtRbGGPTeUUrBc65rrTIhBKy1xMtijIG9N2KMaK1JplueUmKttUDvPX0CiBGvq44dO/b/y5cvYIFPP379DfHzYWF+9ZNxvZq8tAbIVZycnAzMDP+ZlJSUmpmMlGV8QRbm5OSAMYjNwC18mJGRS1hp3dI5d0E6QADkh4CAAEYGkOUGplYfVq1a9R+EGbmEFoDEAAIILIGM/RMy56/dsOn3tWvX/k+bNf97WUOrKbI83Bvbt2//z8TExAAKRxYWFgZGRogtoBAChevTt+9+J0VFsoE19E6c8lVXU40LFLYgxT09PXANlZWVYA+AwnzHiYvnIOFx6tQHOSlxLlDogWx48uQJXAMonL5+/QrWNLG1cRvcSTqGJj/qKsvYQcGO7iSQQRGx6Sv//XwfgeJhIOAAYj1GNr6ljJyCtxlZubqBfDVkNQABhDPucAEmdIG0wrI3J06e/Hfw8JF/KnZeV9Hl4TYY+4TfaMyIVQe5HxS8IPDv3z8w3n/yvGN3Y/UBuIbQtPxZCf5uqSAPg0KJmZkZrAGUKEFxAPK0t7c3I1zDli1bwImSnZ0djEGaQACk+OfPn2B8897Db7kZqdzgeAAFIchUkEJQMkd2UmlpKTholWSluOAJGZTiQIIgBU+fPkXRAIo0UOYB0Sj5EeZBpDgB0zBxlFBauHDhPy4uLkZQjgD5AeQfWG4EuR+ULMIjo1/9+/NLHGx3YlYxO8yDIElQ+gFhEBsmBlKMEg9M3CISXY0Vz2VlZVH8sH37zv8LFsxDRDBaWpJlZGGNY2QXOMPAzr8PyDcFYmFkNQABRHJaIhWw4JIIT8uf4G5jkaGmJMv+4cMHcNyCMLJPQF6VkpJiCMmvvhfv7axbU1r4DWdahQHrwNjbNWlRKqDwASUWkCEgDDIcFnaw8EOOVlAy/fOf8e+xs+d1Ouurb2BYADSAcfb8Rd8kRAQ5QBkCZDgsY8AyODYLYAkQRIMtAdILtuzbv2ZGnxOKBTkVte89bMwFQIbBMCipgzT39vZiDSIQrqiogGcykOEwvOPw8ZApna1r4XFgpK7EA1IEcxksT4EAKA3C2LCiCtkSmKEg/SAMsnDX8bPVQCUIC16/ffeLg52dBeRqWNjCDPr06RNOC0C5BYZh5SPIkjvHD31EKcEqKiufIkcYLDxBGpDzLXrkwgyG6QGJff785ffVq5d8MVIREwvb40UL5snAKhNYZCOnJvTCAtkxIPz06bO/JbWtiv++vnmMNZkCs7SKvrbK9dKCPBaYwSAaVyqCufr9+/cM2fnlp/7+/GiONx+gWVZhZW5Ya2ViyCUpKckAa1mAIv3NmzcMt27dZli0fP0loFcdgC5+j80MmhcVAAFEcwuYGGgMWPBJlje2ma7de2RBcWyYkpaGCruYiDDjp0+f/z998fLvjgOHP7768GXzhvnTEkkOopbufq6FW/deXj2hRen58+fgVIJcTMAyGSjSb917/HP7keOzV8+alEuUBaX1rQ7mRnp7uFiZmWFFMqw0hVkCKyJgeUFQUJAht23izbNbVmrgtaC8sVXDytjwCjPDP2ZY+ifGAlBeAMm1zFp25+j6xao4I1ldVekSyHBYUQ2j8WGYGhAA1SOgZg1WC0IyivaJ8fGywlwOw8hFNzJGL0pAGOQrD2vTWKBvmFAsAAnY6WuAszhy7YVeN2CzAFYpwfSICwtwZFY0rEVJptllVYGgthIsvJFd1d7ejjMOQO0smMthGGzG/z8OKBaw8fJXw8p6GMZWiiInVZgaWP0Ai2gQVpaWYEOxYMuufQzWmspg7yK3zUAaP3/+jGIxsg9AFQtIDNYmhRXZgnw8qBbcPncG2BqLgYcvctKF1WbYLAAZCvIdrBaD0X///GVEjeSf334iJy30Vic+gJwnYOD9h48/US1gYjqKrBi5KYtewSOrQa5KkdWcOH/hA4oFVy5f6Pz69dsfmAbkqhDZImSM3BaC1WowvHbl8i8YRQWwPn4JrI/FYGkc1rmA0bAUA3MpzGBYMwXWLgI2r/8nZBapAGu4e6jFNTufycuXr+5LSkqAyyGQJuQ4gSVD5OCDWQLzAYhOSEp5Cmy738OoD0CtACZ2wTXzZ00Ih6V79DBHtgDWbULGbd19P4EOVcJbXDOz85+cMqHDDFTWw8oafKUprMnSPWHyn4tXb2sCHXqHYIXDxC28IDbEJ87V1ZURuazBZgGo17V45bqPl67e1AAa/oLoSh/YZBEEOu1AXGSgnpqaKoOIiAgDDw8PuGMOynygmu7YmfPfjp441ww0uIPkVgXQtcKg7hAQ8wO72WH/mViNgflFluHf/48M///dZPj3fef/P78vgPIVqGkLNOfHgDRbAAJ0a7UxTV1hmN5eyi0tRRs6dY5BUBhzgHRzbPxQYfsxnVtQcT9kM9EgxEyjyX44Q83QCQv6Z5nJFj/CNIuRbQxdE1m2RL5isjncxIDEiR9jgvhRUoW2t5/07r5Njzl5c86tRnHJTvKmp23uve9z7n0/nufcab/AdI8nBmCbY3fFbZe7fHxiMtN93zMnEA5K7kmPFf6zWtLcUnJKwDoj7VZGumVkts3a9UVjvfM/A7CzcW/2hb+uNw6N3V66s7rKVpCfZ4AAAYJPqgJECMxhQDaDSCLyCSgKMAYuDYUamo+78p6d3VOcn+NocHw8PG0Aduz+rKD7j/4D76948+XSRXYjCCQQbbiQ48LNqk44yVksllgE/9p73n+s/fT5skVFm5rq6y4+EQDQp3b1DRz5pHZ9Zqok6iFN0A5jozsOnvOs6kgMtB45EJn69NDRkXJ74QaihD0yAOjee/oudtauqXjFJIki6d7pBo44iRMt607QK8/qEzA7hmO9wUjkcKvzz6X2gjdYGgsXAHCa/tE7v2xZuSxdUaYE4hzWXEjNowHQJBdrAqyGiADANJ/MBUGM7j/x00TRc7Pe2ltfdy4hgO27GhdfvnPvVPXyJWmqMzraWeIo0TDx7/Rd4YkarNWm+1S6R6KAKIfbuz0vzJr5zr5djjNcANnz5ltKlq0eeq+sJMNolPTYeZZBpoHWnvXcY8kBx4PD4XigRSWyQCA49V3n2fHen0/kDV+7Osmkx1UbNx8Qgh7pYZ0nnIOkRRzIifpkulFJNCQpRZ+bYU7Jrdn8lfr1AyaA/stDhRWLX5UAMZwYN+9wIRJgdOaI7ctw0ij9CJHjaRD4N9x20z7kZGUZnWd6i7kCRVdHt39NWakY20GiVhkzcZoZwkVArcXkTSuNkk+iPLK6ZxoA+RT1gthxulPmAgjcveWX/b6oKAoP5ANW/qYH4QNaKZQHgNAA3JnTnIMGB76Bj1x5QonKk9f+GfWynlct9oTpHK9Q8TKR1jnpBbt+Y9SrRP33uQCy8xc2fNvaJidyAj+nLE7KMxZlwamUd9w3Ld/L2QuK92jVAUEwmJoqVq2sqXx3+Qycceg5yVKQBmFXglXc8MBFC1gL4b5Y2cXgWp3t95wnfzwUDfnq4BRalVgnpKQdLC9bsnbDurVmXvrEbQWW2rTkf0ahYgIgduRYi7ejo7slGvRsop3X5nyp1q05WXObHNs/MkKDFWO01F1gbeXgOa8S03IGqyKT1Yf0vGff5/6/h0d2RGX3/kfuRlXi+owuEm6z2wte+7C2Ohl0dtw24DmdfXiVmBewZA684suDzeG+voHfFTG5UiXFdx+LD8AOhfqwNr/40vzXqypXGWDzEdP9h+EEWkEOqRh204+3toUGB6+eVS9QjTWIx2ZkKhDYWF6XpEzVFBUtKCwvLTHBLojNZov18SwlkgcCeIXL5UoaGxtL6vntnO9C/+BAkk7/tfrXUdXx8FPhxCqgTBCgVXs78/m5uXMyrFZLutlgNhqTzaZUXaokxZDIgYDi9cmK1+8Peye8oZvjbvfIjZtX4KUT1X4gm1NPhROrqwuvNphUgw16Y/xVB4hyQ9zEuAlUnYnGLRK3UNxA6AQ9BqortAg+nj7zv5VV/gWE/cCHkcMbzwAAAABJRU5ErkJggg==';
var button_play_blue = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAAEgBckRAAAEyGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzcgNDYuMjgyNjk2LCBNb24gQXByIDAyIDIwMDcgMTg6MzY6NTYgICAgICAgICI+CiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICB4bWxuczp4YXBSaWdodHM9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9yaWdodHMvIgogICAgeG1sbnM6eGFwPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4YXBSaWdodHM6V2ViU3RhdGVtZW50PSJodHRwOi8vYmxvZy5hZGRpY3RlZHRvY29mZmVlLmRlIgogICB4YXA6TWV0YWRhdGFEYXRlPSIyMDA5LTAxLTIyVDEwOjA2OjE0KzAxOjAwIj4KICAgPGRjOmNyZWF0b3I+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpPk9saXZlciBUd2FyZG93c2tpPC9yZGY6bGk+CiAgICA8L3JkZjpTZXE+CiAgIDwvZGM6Y3JlYXRvcj4KICAgPGRjOmRlc2NyaXB0aW9uPgogICAgPHJkZjpBbHQ+CiAgICAgPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij7vo78gTWFkZSBvbiBhIE1hYyEmI3hBOyYjeEE7ZXhjbHVzaXZlIGZvciBTbWFzaGluZyBNYWdhemluZTwvcmRmOmxpPgogICAgPC9yZGY6QWx0PgogICA8L2RjOmRlc2NyaXB0aW9uPgogICA8ZGM6c3ViamVjdD4KICAgIDxyZGY6QmFnPgogICAgIDxyZGY6bGk+aWNvbnM8L3JkZjpsaT4KICAgICA8cmRmOmxpPmZsYXZvdXI8L3JkZjpsaT4KICAgICA8cmRmOmxpPnNtYXNoaW5nIG1hZ2F6aW5lPC9yZGY6bGk+CiAgICAgPHJkZjpsaT5hZGRpY3RlZCB0byBjb2ZmZWU8L3JkZjpsaT4KICAgIDwvcmRmOkJhZz4KICAgPC9kYzpzdWJqZWN0PgogICA8ZGM6cmlnaHRzPgogICAgPHJkZjpBbHQ+CiAgICAgPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij7CqSAyMDA5IGJ5IE9saXZlciBUd2FyZG93c2tpIDwvcmRmOmxpPgogICAgPC9yZGY6QWx0PgogICA8L2RjOnJpZ2h0cz4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9InIiPz7uBFHSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAD0VJREFUeNpi/P//PwM2wAJjuPfe/c/CzsTw5+c/hp3FyoyMIB0gQQEJdgYOHmaGH1/+Mnx48ZOBCaT69cdfDO9+/2U40R7O8PbpNTAfbBRI+49PfxjkMhaD6T9vfzAwwizXK78Kt+NSpzYjQAAx4nWVU+ft/xyczGCBDzcPfjo2NZGfKSwxcz6PABsDF8d7BmEZDgYRPSc+sI5LvImxwl9/M7xcUcjAxMjAIBo+j4FTWPoAI4eQlJJO4b67kvKcDF+BFn8C+uF0jToj0/e3T+892Tfn8eObXxjePfjGcKXfaT7IKIAAwnAVyM5ngq6hbOK63N/u7f3gKPnWrb2h+jRMHq4B5GJ2dmYGVqCrWdkZGZiADvn37z/D759A/P0vw7srm9+fnJMvBNZgU7ThK5+CHhcnHwsDFxDfmV8INIqBQTtnMsPPL38YvgFD7zsQMxxt2gQOj3uXTr8X51Lj4vjFysD15x/DqxfPGAQlpBief/gNDOrfDN9ANBDf2LN7PdxJMp4tz0QMgyRZuZgZWDiY4E768+Mfw+9vfxluznSdDwyIJAaQBhgGAg5QdLHxiy5lF5S4zcYr1A3kqyGrAQggnHGHC7CgCxgFFTzn04sS+ff757/PRzvunD+wVRtZHm6DkaPPZWGvCTrMrMAgZQanP4Z/f/8x/P39n8Ho8wrHzqaaA3AbIpKzZ4h4T9Bh5WBmYAd6mJkNouHvr38MP4GePs8YsZ8BHNAM0KSsVpDOAow0Dm4g5oXEBQiD2CAxkJx1zuKPcA3MzIwMLGyMDKxA09m5gBE3r5Dh/p65YDZIDCTHrWDJB3fSi9c/GTh+/WXgAoY7F9Di1y+fMTC+esbw7OQuBpmkhQzf3v9i+PHxDyKUwGEMVPzv73+wJ0HhEDV5E8Pxm58Zvn/8DZaDBQ7YSf9+//v/B5rIQGlHIXMxw9GrH8FskBhI7s5c99NwDfcWebL/+QlR/ANo4rf3EAxig8RAcsBkYYYSD8DsJKGctPM5ejz8+vLx9/VJVmzwmENLS7IsnLxx7ALiZ9gExPYB+aZALIysBiCASE5LpAIWXBIxaXkT7jBpx3MrOgkwMTIyMAJ9xQhOGyACEvL//zGAssz/F5uz70T5exhUlxV9QzcHwwegNCvo0a8DSixMLJDwYgKxmUFGM8LMB1kBDEMGcFSDwvLfn/8MXx+d/mwndNesvaHmBlYLrLIXfeRWsOIDRQQzCzDFsUJSHTML1DKQ4SBvAPUAkwrY0L9A/OcXEP8GZpw/kMzDfKp5y47VC33hyQIEDPxzn3PLQwxnYYNkInYuEAbmDx4WhvtLixnOL6kCshkZOPjZGDh5WMHiIHmwOnAWYGYA6f9rWutTUtPojeIDk7KTv9l4+FlAiliBtQErJxOUhmS2W5NTIPEAddB3oIslnBMZBNWswIkZWFwA6X9g+g8wW71Ym3D83sUTVvBI/vjm7S9ORm4WZqAXWf8CDf4PtAgYDqyglAB0w5cvn8FBxAi1wcAtiIHXzIHh4fPvEAtAZSOU/gu04PmTxw9QUtGTjanHlBN3ujCCCqE/wPAGli0gF4NMBHnyLzAyw7oXM1x6zcIAVMLwARj2b599B9d7f379A5dFoPgARfjvb8CiG5gQMSIZmNuOA3ObBTiSwREMKczAuY8FVJIjRTIoiUIjFWQ42JLfIMO//rm/OFAJmJUfY02mQEtUxGzLjvGpOYvCkykLNJkyIiXT/9Bk+geRTIEFyn6gwU548wGaZRWiVgUFfOqe4tgy2t8fX/7cXxp8HtQaARr8HpsZNC8qAAIQX7UhTUVh+Jy7e7ecOhmikeAHNUqioAglgyIRwqL8URQVgfTHPxEVBeWfEFMICRlECP7IyloREUWBGtGXJBUhiWZK5oRFX0vXdNNNd+/tfc85d9tNMfshbRzu3c57nveec8/7PM9Z9AQSWeSPPF9ndU19Ufuzriu2lbtyrFmr7bJjmVWLBGKx4Ofo5MiLCVdGtP12S9Phf16i+oZGu+d++7ulOy+54OVSi8R3DxVVxsbgS4ZCDHuf/lqh9V6/0Xzx6IISnD5bt7XTn3M/pWCzgzGqBamaxotOZGBUHRdOaIH2E33dTx+unTdBdU1d4bPR5W/ScovTJYNBJYNJaYKIkEmxDrAGNHHFym47PiuJ6SU/8aV3GeCMVUU1W6EpSyixAmNiY/dW3ocxvNIpydzuXoO2Zs4E5XsrH6St3OHEJYlThcJB0WsrVsGu4h7/Y30ilos5Jb6UjQfmTDCeXbaFLYdYd5nZHw7ge3mToNFS2NNL/N5GWR+LsSTG2fNLHOikTQlQHFLyShyYgOIMLJKYBWVkZxv3kp7mY8Tf38m0gYGiuFiT4iwSG4sYQwG53JSg/6O3ir1x+CXFG2UmDuUSd1EqgARf3SWv3UdIbGqMSLgsMo9hMxfjECPVVeYwFdrAwEBWdqFKLEC/imoIDTQIVmD3TIZCJBIOMcFBh9TbdIpMSOlkXVUjmZlGFROCExX3So7VlADUZ9oejhF5BqYOe1rRLDwBAKKioZpFhaIZ25TqE2S49QxxVtQCuMrlEq7o+qcnjYJJUMUXPk74Hd248maA6oKsJVkmlRc85PnQDAM1jYGvOvkz+meCRxBwgOg0UaUwE114HvZb5/AVJ2uJz76KdI7EeJ+IwxiRgYRGXoI2bDdt02sa2Fbm1NQkCohx/4xV6yrZRkrP3SH9uosE4VjFNHhGFzps+G3u9sa6W97PogpQrzegx0WsMm3cG2ExYVuVZyfD4PKpeBw9SY+Z6AurokbRhKn6p5ZyFx4//6TrPWokPCxJaTKF04AqaXHu+eANx0mPJ+BPrTFXxx2dJmYC4K8NcFMlowsY8exuNY4VqrAixs7gO0W0pP+MOBwT6Lv3FaC2zEvXsFRPwB+VxtnUkmBVE5saLCpmEhx87P/xomETPOjQXwUHklzO33/rkJLqVBaiB6Nvr/oCPZ5iAP+2YNGHJE64dBQcvLNexhPhHIoWHGj77u9yuwH4/D+7CgDLxOMQtAw4Zu8D4tlAqZQL6EFd1wa16UhHbGriHfSjH/IDTuS/2JbfAnRrdbFRVFH4zMxud7fb7c+ChS5taay0Mfw0QJEKVMWqFdA0VRLlQeBBDUYfiIlIgGglgOiDvPhD1AfRmJBQUw0JpEZEpCoJqNCUlLptAVtoKW3pbrvd7c7ujOfcuXd2tnSRBoHETW7mtzPn3HPuOd/3TW/7C+4qLJrM7/UtdTV9/YPLrwWHC4YCw3lRNeoMDo946VqmJ2MwzZ4Wyc7y9ORkerpyp3qPfrCr7ru7FoG3duwuamnr3HnW37FkysJ1Xuf0uW4pLUNJavWJhmD+NMu79GgoHultDg38vm9w9qziX+eU3rt1+7bNF26bA1vqds5pOnXmk7FpS2enz6zMlB0eZjBDCVKCmZh2S5xUm6WFtyveM8DSoajmkEOhC8eCjiu/nF1WXvbKrrqtLf+JA4RTD//UtNddttaXnr/IwyQFMk4W0oLE6rEkzktCipLAQoa47To3HMwWC5oQh4CLQACj3SeHh0/vu7zikWUbhBI2aQcIvX9//MRhNb+6zFX0UJaphchG1ZY4H5RkEQUjArLVCUkS9putmtlsiQCbfeFEnEeDnwudPxawdzeeeaKyYsVEGktKB4jTNDT+uN+3ak+RZHfJCgeTVsMFmGc4TuFb2TBYkselkzVtNJZMRhfhuIWxbU4EkhyJk7wS1i4f3HihtvrR560acUoHNr+9o7Kh8eiXM2r2zmS8SdAbAT7NLZhQWjgmW1JLWM8VgetbIDnDDTXEJs7oxbEmABmjTnp3w4aLtdXL1+5+Z9vxlA5g2tjqDx05k1O1o5SqynjjBcJmaNqW7Ajd03lgO/Rf7Ye8soehcOlTyB3SkyLAIKnGZ1hPGCgMj3NhS+f7VidikZH4tR+2tq1eWVWG6RSbsA+c6/z7fUfJKh8zXhYgIsH/aN9mQTEKGc8cMXQSJ4LBnHQFov4maMcxikbYvD4oXv4sZBWWohMSSxfgM6xJOj5TwygRFZZE8YJYjJ5LO8Z6ocs2R4biKFmZd67zr3fxyhsTOtDa5l9kf6DWpZL3ZJxOBUZnua7EDeiHsA0UzeAw+Hq8bkiEdJ+Gb9ZiUYTmxlpwUkoFuqCrYQ/40ehRpDS+hVUwYzHibcWBDhjPiIMBq4nOx/nCZqmD3hpwzoiQMmVueuuJQxUpO/H5jnbFt8Bts43EzPyWxEzbjVlWOHFmshc71pjuSfuBYAAiwaAoQAAWiEkrl17W11QPPT8fgFEEsYp3JhRWrQNnbjFn8BYeQEM1pANdoGvVbetGG1M6MBoaGYqGw5ouORUZp4eGRGHXaZY1nGWZyjabORYZvk+pQFFQVZUN4cB1zZj3A0d6Bjy+Zj3MWPgYtHaHYSCgmhKEWAcapwHMAQ6s1UhYIxtvhIVOj11tq7AVLs4RzUYSTYgomyZ0cIktNOD7FF7MA7O2G6Un+cFF88phyXMvQtAxDTp6I3AJI9DVPsKMBD1R+3XRKHTRvRNfByJX20bIxhs5sD/Y+m2tu2BxjtkxNVO4N1ICFxvNeKLO0w2yKeoYRU2HNJcbymvWwKxlq6B9MA4DmJYnByi/w4nqYxFBRSk1S6twSEv0kEBL/RXc+zqlA8gcmpFpfB70N27KLKnOpbRgEx834Q1OtMaTBxKwgBYbRsKbXwrzX94G8exC6BoYgz40qM8fTpRR3VJGLSVSOCBSR7ec03lnJnYT7m3+FG08ezOc7L2pD25cl1n65DTrYpYtY8JjeRKNTHThuHX2Jz4OtDJqtg+Nf/Om+ADdiE5cjIX6NnsXrC0AvhbAJJJGL9ApneRxxks3ASX0ZCd0LaEljo8Qwm0irLvRpo8njUbRiVzcfJFbuancc1/VPdeBOdkC5ixS7b+BOUF69aRcTwZzQf8RovGn8C/Xo/F9t8QH6AsFbj6aWvHavKz7n56eEk7Lk4DT2sRweqj1YG//bx82482vjtcgbpmRoSMk171AszKl/KXirNnP5JFKfkuEBkvXUMs3PQMnP+vAs19RxNFw9Y6QenSoADercax05c3Pd/kWZKZlFzhtnjynzZVtV5zZdvblPTKkxiMBVQ1ejkQDXZHwpT+C4Z4/u/HSIRz14uPUHeHEONP0rw1uHAQ1XfxfHRxgqLNpvDDYuG4mtDONjxgfUT5I6CQ9hmotEZZQKn3mfyur/APd6li0vAZJcAAAAABJRU5ErkJggg==';
var button_stop_blue = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAAEgBckRAAAEyGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzcgNDYuMjgyNjk2LCBNb24gQXByIDAyIDIwMDcgMTg6MzY6NTYgICAgICAgICI+CiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICB4bWxuczp4YXBSaWdodHM9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9yaWdodHMvIgogICAgeG1sbnM6eGFwPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4YXBSaWdodHM6V2ViU3RhdGVtZW50PSJodHRwOi8vYmxvZy5hZGRpY3RlZHRvY29mZmVlLmRlIgogICB4YXA6TWV0YWRhdGFEYXRlPSIyMDA5LTAxLTIyVDEwOjA2OjE0KzAxOjAwIj4KICAgPGRjOmNyZWF0b3I+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpPk9saXZlciBUd2FyZG93c2tpPC9yZGY6bGk+CiAgICA8L3JkZjpTZXE+CiAgIDwvZGM6Y3JlYXRvcj4KICAgPGRjOmRlc2NyaXB0aW9uPgogICAgPHJkZjpBbHQ+CiAgICAgPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij7vo78gTWFkZSBvbiBhIE1hYyEmI3hBOyYjeEE7ZXhjbHVzaXZlIGZvciBTbWFzaGluZyBNYWdhemluZTwvcmRmOmxpPgogICAgPC9yZGY6QWx0PgogICA8L2RjOmRlc2NyaXB0aW9uPgogICA8ZGM6c3ViamVjdD4KICAgIDxyZGY6QmFnPgogICAgIDxyZGY6bGk+aWNvbnM8L3JkZjpsaT4KICAgICA8cmRmOmxpPmZsYXZvdXI8L3JkZjpsaT4KICAgICA8cmRmOmxpPnNtYXNoaW5nIG1hZ2F6aW5lPC9yZGY6bGk+CiAgICAgPHJkZjpsaT5hZGRpY3RlZCB0byBjb2ZmZWU8L3JkZjpsaT4KICAgIDwvcmRmOkJhZz4KICAgPC9kYzpzdWJqZWN0PgogICA8ZGM6cmlnaHRzPgogICAgPHJkZjpBbHQ+CiAgICAgPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij7CqSAyMDA5IGJ5IE9saXZlciBUd2FyZG93c2tpIDwvcmRmOmxpPgogICAgPC9yZGY6QWx0PgogICA8L2RjOnJpZ2h0cz4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9InIiPz7uBFHSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAADlZJREFUeNpi/P//PwM2wAJjuPfe/c/CzsTw5+c/hp3FyoyMIB0gQQEJdgYOHmaGH1/+Mnx48ZOBCaT69cdfDO++fWE42R7O8O73XzAfLAHS/uM7K4NsxmKGH5/+gPmMMMv1yq/C7bjUqc0IEECMeF3l1Hn7PwcnM1jgw82Dn45NTeRnCkvMnM8jwMYgLMMBxiJ6TnxgHZd4E2OFv/5muD43FqxDLGIeA6ew9AFGDiEpJZ3CfXf5gP4AgU9AP5yuUWdk+v726b0n++Y8fvfgGwMIX+l3mg9SABBAGK4C2flM0DWUTVyX+9u9vR8cJd+6tTdUn4bJwzWAXMzOzszACnQ1KzsjAxMTI8O/f/8Zfv8E4u9/Gd5d2fz+5Jx8IbAGm6INX/kU9Lg4+VgYuDj/MtxdWsHAxAjUAJRTTuhn+AYMve9AzHC0aRM4PO5dOv1enEuNi+MXKwMX9x+Gl8+fwTVwvvvF8O3Db4YfQHxjz+71cCfJeLY8EzEMkmTlYmZg4WCCO+nPj38Mv7/9Zbg503U+MCCSGEAaYBgIOEDRxcYvupRdUOI2G69QN5CvhqwGIIBwxh0uwIIuYBRU8JxPL0rk3++f/z4f7bhz/sBWbWR5uA1Gjj6Xhb0m6DCzAoOUGZzMGP79/cfw9/d/BqPPKxw7m2oOwG2ISM6eIeI9QYeVg5mBHehhZjaIhr+//jH8BHr6PGPEfpDhIDFIUlYrSGcBRhoHNxDzAuOCD4JBbJAYSM46Z/FHuA3MzIwMLGyMDKxA0+8uLmJgYQYbxvDn738Gxeheht9Am7gVLPngGl68/snA8esvAxcw3F+/eMbAygLR8PsPMOKAEfbt/S+GHx//IEIJHMZAxf/+gsIa6PZ/kBABscFi/+DxBNHw7/e//39+/mcEJTL5lEVgp4FtAHr45xdQLvzPcGeu+2mGrqcQT99b5Mn+5+dfsOSPjyAnQDCIDdHwlwGYLMxQ4gGYnSSUk3Y+R4+HX18+/r4+yYoNHnNoaUmWhZM3jl1A/AybgNg+IN8UiIWR1QAEoLXqWeKIoujMm7eCLCwxuGqpwWhhQCuRFS20UVAk2AXBKmnED1KIoKCgYCPoX1CxEgRR0c5OQQtbQcWggikSgq67TnY+1nPevB2/VsHCgTtvdufde9+955y7+2YuvfWSL73o+TEwdyxqeqMVLR+oJRNVmQod3oLuZ9F9SCb7e63v+FtXW93o8M/00zjPKiBni9pmv5AsQgb9Eny2GNrMxWcK9DCAlb30wYnU2X6y+eNJ/fTE2GHeBIm+hatoeSJGICwpDBkRipGW1MkYnGXAxydnENSDuRmYA+G4gXisvcn1reX5zkcJ6rr6L+ONg2VWAWluGQVcMbSlcIwjziihE+hLJcDtc+8sEvhquGeYCIz3sNZeL3XMTI1viBCM6p7ilO0aaZDzFjxL4zS3MNvnT8eN8V9bxr5/5vc2Dsh9aj/94M84K2ubo49AvvrzN1NoRqWFEiOeMCJZjGOcMCJdI5VMhhXoDoUVJKEeKoiqya0eqri8OP8VjgteF6vfdwLQfNVXzhaWrhwAJI3TgAJ39Wca33Mf99OP/k762iERn4EMte1CbQ0KZAVwMMyU+iQn+QOQSVENau4wnsPgKfd08esnSPk8L02RpLKkaXgnVtUaD2kqNU3NBzTNapq69zTFQNlG4JZXdfAk2Ug8MTQUq24vzSc0z75xT5e6D/hvBIH/5Yvx7qPiTgDiqy4kqiAKz9yfNVddEdFIMC1FJOohQqkgKXyxv5eiKCnCl6CHoCAIIcJAQXwIISLoIfuViB6SAtcIFSOhCDOyWM1SMPrbbNvUbf/u3M6ZmXt377qYPkjKcO/emXvOnDPnfN93l92BQpb5T1tosrGppcrbP3g9o2JvkatgnVvzrHKxcCAeD36KhCYHZspzI957HVcalpyilraL7s4u7/DKPZfL4XCpqojqoeKUBRdwLgOAm+j7Vcbe3L5z9dLJRTk4e755+1N/UVdm6TYPR1QVoVrAtSwj3gcI1RZxYsMFvKdHhvoebVjQQWNTc2X/9NoX2cXVOYqFoIqFpLIHiOgD1Fq8B5i8wpjuPjXPieOQe6dyBi3j2L2a7GYXDH0FJS5gaxz83iXmcI3odEryd7avR1mT1kHdgWMPsyt25WFKbKjQhVGEbR2dZMjhEs/4nFwryJySqczNh9M6+F1YW8PTIfOucfkjDKDIRaGl890r4j6D8jm+Rk285y7Z4kEl7SjTM+cu7M5cXe9BBxQjUBUZBSVjoK1UyD+XV0lnAOdKKo62ElPX4bBRziqEqYwoBiXjAa3OEcG79xPH+YnDL8UelIs4NKzKZ1iuOMQ9EZtQZSHINWgjq7zW44jA5/MVFFYaRAX41Q1JNLBNSC0Jzc0Kg6gsElUKEUAPIF8g/kck4UTkvV7kcjgA9om65+JEi0E+IXadqcIBGEQ2U2VEyQ6wPGeBGmPAfrEwshrjV1T90RClqVDxWaRW6h3TutopJ8n9KBvZXuN4B/6N0I9IahU9NpPe4l2KMtYwk5yZ84wh0djrWMLz7OSzQKqDmwxkK1dqRhIExKX+YWIg9uCwf8fkGsPS20Lt/RzqeOtIEbARA/Z6BXxcpXDDTOIPI2tAb1ucTOV2zBQ+Fo5ENAx3QMiJdHC93wjPfVSUbI3C14ABxq26ZwY2kcmdCgdi14yrOqHomIzkQ0fdc/y2ndfJqAImO/fd4qmxdhZNVIaoFEsDJZ5Z6/CdwMiDL2CqZkG4hlT1ljX07LDRVE2gqgNNLRSVkQRHn/i/D7RthY2O/5NwwMm1kkN3j+hZefpi+GD65Y2pwOvOajD+ddGkD07y4NJTWn9/o4ZfhGkYLejr/uYfbG8Hw61LVhVgLB8/h2Dkwmf2QdDwmyhVisF60DTZKIuGe+J/ZoZhHmveD3bC/0W2/BWgW2uNiaOKwvPYJ8suFFpaEFJiFWJoJSI1RIuxkoilMQ2mJv6i/aFJjf4wJrakNIqGVlKj/eOj8ZGIxqQ/MK1pQkNjrU2rVltrIRCKCKUWedlSdpfNbnd27vWcO/fOzMIugtg2EXJyZ3dmd8+599xzvu+bueU/cEdh0WL+XtndvGXy2tTGG6Fw0XQwnB/X4p5QeCYHzwX8mVMupyuWneUfWxbwX81bnnPy3X3NX9+xFXitpbW4p39ob+/A4MO5D27L8axa55NdmWpSq5flOZ8jtt+i8YgeG++OXP+lbars3jU/rC29u+nNPY3DtyyA3c1715453/XhzZWPlGWsrg4obj9zWLQ5wUxMv2VOqs3SwpuN6Fz2poLaCQQUGT4Vck9837uhsvyFfc1NPf9JAIhTj3135qCvvKEgo3C9X+GNX9Qm5jgfZREAZ0E2MsR9p9xxqytKRIhDEheBAGSMnAuHL7aNbnpsww6hhC06AETvx0+fPaYV1pZ7ix/NMrUQxajaMueDsgk2jBVQ7EHIsvDfbNWCXpscknDnMQidrwZ/L3L5VNA50tn1RHXVplQaS9oAkNMc7vz2UMHmA8Wy06uoHEzaHRdgnuE4lY+K4bCszEone9oQasAWDhtYBycWEUgKBGk/QK3Roy8P19c+/qxdI04bQOPrLdWHO09+fteWg6sZbxL0RoBPc5RMKC0CU2ypJbwXosacFojBcEcNsYkzevGaB8CpEx05vONKfe3GhtY39pxOGwCkjaO940TXspqWUqwqs51HQUrmo8oBACUx6edPdxnpI1nQXk5RhagNgyIArHpuP3y323Rc58IW5cf2IBKxGf3GN039W+tqyiGdEin7wKWhP/a7SzYXMOcVASIs/ofHDhuKUXHWqSKt8KnmJjZBjQ3cSOY+MEbC94LLpUqE7R+kAbIoXlIC3FPQs4RxLZ52uDNVd0ld/qWh396CM6+mDKCvf2C986F6L0pNhDmHs0pZrqs6V4HhPeBHLOcBQrJZT+iapIp0sYGa2dIh7hACOSSqUEKm7Dt01C2pAad1vrFZ6sDmMOCcsUJq7rqMvrMdVWk78eXB39WCCp/DMZMw81sWM+001CiVE2cme+ExTFMkGLRm38av5mxiySqfGFAYaBGwNSNdmBGLB6BphnRABbrWfI4R8DFtAEDypuPRKKGyR1WAjqLJFGcNKw7QUvjH3CUyXxk8hn9N0/5VALjSumxzOGHtA8JpAAuAA2stFiXo43wa1MWbf/XPJKn2lFpdlN9tEJXErCoiv+fQt1RGzZIqeoBErdpPRaOgontbvsTAN/RxvgAOhfqOTEjU5hAxhXteFSSr7PGZEmWR2DRgInJZmHhtv06zZlp8p1laRUDE6iHBnvYJOPoybQoBc+gGpvFJaKBzZ6CkNk/hmxLLnKgQOqQMFXHjJnd5pWfePsL6gkNRrP4gJwM6Iu4B8HqfgA16YWCGycMiAJE6IufNe0xgyG6i490fgY+988JpuOAdCCIPwt4WKH1ypVgmIpbMaKNMskFH8Ud+6g0md+OFNDLRhXX77Kd+Hexj1KwNfDuwID4AF+6CIK4kIpONORUNRRKvxZJJJI1eQGEkJszgzssLgBI0OQhKLC2RkmQoAXAbCWsr+PTBotEoWwlJ+iyvemel/56aFXPAnGIDczap9p/AnCC9NCnXk8FcaOAE0vjz8Mnt4PzkkvgA3qGA4f3lVS/dn3XfU6vSwmllEXCapIbT031Hx6/9+F43XPzibA1iyYwMAnHCgE8nbM+tfH5NVtnT+aiSL4nQwO6e7vlq7Pq5jwfh3S9wxcFx7baQegioCIatYHXe/AcKvQUVAVd2kcfhz/c4vNlO1ZPtZHfeY9OaHgtqWmg0Fg9ejUX/vBCKjv06Aqc6wNrFzanbwolhpvHRBh9YBsbAH3XAR0Nc3BzcFFufIdwS3OLcUOhEPSaKQAAskk6f+d/KKn8DjECpSS5g1MYAAAAASUVORK5CYII=';


includeJQuery=true;
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
	$.ajax({type: "POST",
        url:theUrl,
        data: toSend,
        dataType: "json",
        crossDomain: false,
        success: function(response){
                callback(response);
		},
		error:function(err){
			console.log(err);
                        console.log(err.error());
		}
    });
}
function httpGetAsynchronous(theUrl, callback, timeout, callbackTimedOut) {
    //function used to communicate with a handler sending parameters and retrieving a json object.
   
	$.ajax({type: "GET",
        url:theUrl,
        crossDomain: false,
        success: function(response){
                callback(response);
		},
		error:function(err){
			console.log(err);
                        console.log(err.error());
		}
    });
}
function httpJsonpAsynchronous(theUrl, callback, toSend, timeout, callbackTimedOut, async, defer)
{
	console.log(theUrl);
	console.log(toSend);
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
    var url = theUrl + (theUrl.indexOf('?') >= 0 ? '&' : '?') + 'callback=Ajax.' + uniqueCallbackName +(toSend != undefined ? '&'+toSend : "");
    console.log(url);
    script.src = url;
    timer.reset();

}


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
			console.log('inside close');
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
				else
				{
					console.log('closing instnace');
					websocket.send(JSON.stringify({type:'close', name:self.name}));
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
        var pingTimer;
        send = function (jObject)
        {
            if (usingWebsocket)
            {
                pingTimer.reset();
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
            sendAsynchronous = httpPostAsynchronous;
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
            try{
            var urlDisconnect = window.thePageUrl + "ServletMySocket";
            var parameters = "t=" + new Date().getTime() + "&type=disconnect" + getSessionParameterString();
            console.log(sendAsynchronous);
                sendAsynchronous(urlDisconnect, function () {
            }, parameters);
            //try{closeAll();
            }catch(ex){console.log(ex);}
            return "are you sure";
        };
        if(usingWebsocket){
            pingTimer = new Timer(function ping(){
                websocket.send(JSON.stringify({type: 'ping'}));
        }, 20000, -1);
        }
        
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
    this.closeAll=closeAll;
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
var Tab = {flashEnabled: false, timerFlash: undefined, count: 0, flashing: false};
Tab.enableFlash = function (value)
{
    if (value)
    {
        Tab.flashEnabled = true;
    }
    else
    {
        Tab.flashEnabled = false;
    }
};
Tab.setText = function (str)
{
    document.title = str;
    Tab.text = str;
};
Tab.attention = function (str)
{
    if (!str)
    {
        str = "!";
    }
    if (Tab.timerFlash)
    {
        Tab.timerFlash.stop();
    }
    if (Tab.flashEnabled)
    {
        Tab.count = 0;
        Tab.timerFlash = new Timer(function () {
            if (Tab.count < 9)
            {
                var i = 0;
                while (i < Tab.count)
                {
                    str += '!';
                    i++;
                }
                document.title = str;
                Tab.count++;
            }
            else
            {
                Tab.setText(Tab.text);
                Tab.flashing = false;
            }
        }, 500, 10);
    }
};
function Settings(settingsName, callbackReset)
{
    this.get = function (name)
    {
        try
        {
        //return JSON.parse(getCookie(settingsName + '_' + name));
        return JSON.parse(localStorage.getItem(settingsName + '_' + name));
    }
    catch(ex)
    {
        return undefined;
    }
    };
    this.set = function (name, obj)
    {
        try
        {
        //setCookie(settingsName + '_' + name, JSON.stringify(obj));
        localStorage.setItem(settingsName + '_' + name, JSON.stringify(obj));
    }
   catch(ex)
   {
       console.log(ex);
   }
    };
    this.reset=callbackReset;
    Settings.instances.push(this);
}
Settings.getAll=function(){
    return localStorage;
};
Settings.addRange=function(obj)
{
    for(var key in obj)
    {
        localStorage.setItem(key, JSON.stringify(obj[key]));
    }
};
Settings.instances=[];
Settings.resetAll = function ()
{
    
};
console.log('settings is done');
String.prototype.insert = function (index, string) {
    if (index > 0)
        return this.substring(0, index) + string + this.substring(index, this.length);
    else
        return string + this;
};
function styleFromObject(element, style)
{
    for (var i in style)
    {
        var done = false;
        if (i.length > 2)
        {
            if (i.substring(0, 3) == '../')
            {
                var a = i.substring(3, i.length);
                element[a] = style[i];
                done = true;
            }
        }
        if (!done)
            element.style[i] = style[i];
    }
}
function removeChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
var equalValues = function (obj, obj2)
{
    return JSON.stringify(obj2) === JSON.stringify(obj);
};
function sortAlphabetically(array, property)
{
    if (property)
    {
        return array.sort(function (a, b) {
            var aString = a[property];
            var bString = b[property];
            if (aString > bString)
                return 1;
            if (aString < bString)
                return -1;
            return 0;
        });
    }
    return array.sort(function (a, b) {
        if (a > b)
            return 1;
        if (a < b)
            return -1;
        return 0;
    });
}
function setText(div, text)
{
    if (div.innerText)
    {
        div.innerText = text;
    } else
    {
        div.textContent = text;
    }
}
function verticallyCenter(element)
{
    element.style.position = 'relative';
    element.style.top = '50%';
    element.style.transform = 'translateY(-50%)';
    element.style.msTransform = 'translateY(-50%)';
    element.style.webkitTransform = 'translateY(-50%)';
    element.style.oTransform = 'translateY(-50%)';
}
function makeTextSelectable(element)
{
    setSelectable(element, "text");
}
function makeSelectable(element)
{
    setSelectable(element, "element");
}
function makeUnselectable(element) {
    setSelectable(element, "none");
}
function setSelectable(element, selectableString)
{
    if (element && element.type != 'text')//not text because this breaks internet explorer, stopping editing of text..
    {
        if (selectableString == "none")
        {
            if (element.nodeType == 1) {
                element.setAttribute("unselectable", "on");

            }
            if (element.onselectstart != undefined)// if IE
            {
                element.onselectstart = function () {
                    return false;
                };
            }
        }
        if (element.style)
        {
            var i = 0;
            while (i < makeUnselectable.strings.length)
            {
                var str = makeUnselectable.strings[i];
                if (element.style[str] != undefined)// if Firefox
                {
                    element.style[str] = selectableString;
                }
                i++;
            }
        }
        var child = element.firstChild;
        while (child) {
            setSelectable(child, selectableString);
            child = child.nextSibling;
        }
    }
}
function setWordEllipsis(e)
{
    e.style.display='inline-block';
    e.style.whiteSpace='nowrap';
    e.style.overflow='hidden';
    e.style.textOverflow='ellipsis';
}
//var div = document.createElement('div');
//div.style.height='1in';
//document.documentElement.appendChild(div);
var pxToMmRatio = document.documentElement.clientHeight / 120;
makeUnselectable.strings = ['webkitTouchCallout', 'webkitUserSelect', 'khtmlUserSelect', 'MozUserSelect', 'msUserSelect', 'userSelect', 'UserSelect'];
var isMobile = false; //initiate as false
// device detection
if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)))
 isMobile = true;

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
function Resizable(div, divInner, minWidth, minHeight, maxWidth, maxHeight, bounds, callback, callbackInstantaneous) {
    var divLeft = document.createElement('div');
    var divTop = document.createElement('div');
    var divRight = document.createElement('div');
    var divBottom = document.createElement('div');
    var divLeftTop = document.createElement('div');
    var divLeftBottom = document.createElement('div');
    var divRightTop = document.createElement('div');
    var divRightBottom = document.createElement('div');
    divLeft.style = 'position:absolute;z-index:100;width:6px;height:100%;left:0px;top:0px;cursor:e-resize;';
    divRight.style = 'position:absolute;z-index:100;width:6px;height:100%;right:0px;top:0px;cursor:e-resize;';
    divTop.style = 'position:absolute;z-index:100;width:100%;height:6px;top:0px;left:0px;cursor:n-resize;';
    divBottom.style = 'position:absolute;z-index:100;width:100%;height:6px;bottom:0px;left:0px;cursor:n-resize;';
   
    function setCornerGeneric(div)
    {
        div.style.position = 'absolute';
        div.style.width = '10px';
        div.style.height = '10px';
        div.style.zIndex = '102';
    }
    setCornerGeneric(divLeftBottom);
    setCornerGeneric(divLeftTop);
    setCornerGeneric(divRightTop);
    setCornerGeneric(divRightBottom);
    divLeftBottom.style.bottom = '0px';
    divLeftBottom.style.left = '0px';
    divLeftTop.style.top = '0px';
    divLeftTop.style.left = '0px';
    divRightBottom.style.bottom = '0px';
    divRightBottom.style.right = '0px';
    divRightTop.style.top = '0px';
    divRightTop.style.right = '0px';
    divLeftBottom.style.cursor = 'sw-resize';
    divRightTop.style.cursor = 'sw-resize';
    divLeftTop.style.cursor = 'nw-resize';
    divRightBottom.style.cursor = 'nw-resize';
    if(minWidth<maxWidth)
    {
    div.appendChild(divLeft);
    div.appendChild(divRight);
    if(minHeight<maxHeight)
    {
    div.appendChild(divLeftTop);
    div.appendChild(divLeftBottom);
    div.appendChild(divRightTop);
    div.appendChild(divRightBottom);
    }
    }
    if(minHeight<maxHeight)
    {
    div.appendChild(divTop);
    div.appendChild(divBottom);
    }
    if(minWidth<maxWidth&&minHeight<maxHeight)
    {
    div.appendChild(divLeftTop);
    div.appendChild(divLeftBottom);
    div.appendChild(divRightTop);
    div.appendChild(divRightBottom);
    }
    var state = 'up';
    var startOffset = [];
    var timer;
    var moveEvent;
    var upEvent;
    this.setDimensions = function (array) {
        div.style.width = String(array[0]) + 'px';
        div.style.height = String(array[1]) + 'px';
    };
    this.getDimensions = function () {
        var array = [];
        array[0] = div.offsetWidth;
        array[1] = div.offsetHeight;
        return array;
    };
    function onMouseDown()
    {
        if (!isMobile)
        {
            moveEvent = function (e) {
                if (!e)
                    var e = window.event;
                doResize(e);
            };
            document.documentElement.addEventListener("mousemove", moveEvent);
            upEvent = function (e)
            {
                if (!e)
                    var e = window.event;

                state = 'up';
                document.documentElement.removeEventListener("mousemove", moveEvent);
                document.documentElement.removeEventListener("mouseup", upEvent);
            };
            document.documentElement.addEventListener("mouseup", upEvent);
        }
        else
        {
            moveEvent = function (e) {
                if (!e)
                    var e = window.event;
                doResize(e);
            };
            document.documentElement.addEventListener("touchmove", moveEvent);
            upEvent = function (e)
            {
                if (!e)
                    var e = window.event;

                state = 'up';
                document.documentElement.removeEventListener("touchmove", moveEvent);
                document.documentElement.removeEventListener("touchend", upEvent);
            };
            document.documentElement.addEventListener("touchend", upEvent);
        }
        timer = new Timer(function () {
            if (callback != undefined) {
            try
            {
                callback();
            }
            catch(ex)
            {
                console.log(ex);
            }
            }
        }, 1000, 1);
    }
    if (!isMobile)
    {
        divLeft.onmousedown = function (e) {
            state = 'down-left';
            startOffset[0] = div.offsetWidth + e.pageX - (2 * Resizable.padding);
            startOffset[1] = div.offsetLeft - e.pageX;
            onMouseDown();
        };
        divRight.onmousedown = function (e) {
            state = 'down-right';
            startOffset[0] = div.offsetWidth - (e.pageX + (2 * Resizable.padding));
            onMouseDown();
        };
        divTop.onmousedown = function (e) {
            state = 'down-top';
            startOffset[0] = div.offsetHeight + e.pageY - (2 * Resizable.padding);
            startOffset[1] = div.offsetTop - e.pageY;
            onMouseDown();
        };
        divBottom.onmousedown = function (e) {
            state = 'down-bottom';
            startOffset[0] = div.offsetHeight - (e.pageY + (2 * Resizable.padding));
            onMouseDown();
        };
        divLeftTop.onmousedown = function (e) {
            state = 'down-left-top';
            startOffset[0] = div.offsetWidth + e.pageX - (2 * Resizable.padding);
            startOffset[1] = div.offsetLeft - (e.pageX);
            startOffset[2] = div.offsetHeight + e.pageY - (2 * Resizable.padding);
            startOffset[3] = div.offsetTop - e.pageY;
            onMouseDown();
        };
        divLeftBottom.onmousedown = function (e) {
            state = 'down-left-bottom';
            startOffset[0] = div.offsetWidth + e.pageX - (2 * Resizable.padding);
            startOffset[1] = div.offsetLeft - (e.pageX);
            startOffset[2] = div.offsetHeight - (e.pageY + (2 * Resizable.padding));
            onMouseDown();
        };
        divRightTop.onmousedown = function (e) {
            state = 'down-right-top';
            startOffset[0] = div.offsetWidth - (e.pageX + (2 * Resizable.padding));
            startOffset[1] = div.offsetHeight + (e.pageY - (2 * Resizable.padding));
            startOffset[2] = div.offsetTop - e.pageY;
            onMouseDown();
        };
        divRightBottom.onmousedown = function (e) {
            state = 'down-right-bottom';
            startOffset[0] = div.offsetWidth - (e.pageX + (2 * Resizable.padding));
            startOffset[1] = div.offsetHeight - (e.pageY + (2 * Resizable.padding));
            onMouseDown();
        };
    }
    else
    {
        divLeft.touchstart = function (e) {
            state = 'down-left';
            startOffset[0] = div.offsetWidth + e.touches[0].pageX - (2 * Resizable.padding);
            startOffset[1] = div.offsetLeft - e.touches[0].pageX;
            onMouseDown();
        };
        divRight.touchstart = function (e) {
            state = 'down-right';
            startOffset[0] = div.offsetWidth - (e.touches[0].pageX + (2 * Resizable.padding));
            onMouseDown();
        };
        divTop.touchstart = function (e) {
            state = 'down-top';
            startOffset[0] = div.offsetHeight + e.touches[0].pageY - (2 * Resizable.padding);
            startOffset[1] = div.offsetTop - e.touches[0].pageY;
            onMouseDown();
        };
        divBottom.touchstart = function (e) {
            state = 'down-bottom';
            startOffset[0] = div.offsetHeight - (e.touches[0].pageY + (2 * Resizable.padding));
            onMouseDown();
        };
        divLeftTop.touchstart = function (e) {
            state = 'down-left-top';
            startOffset[0] = div.offsetWidth + e.touches[0].pageX - (2 * Resizable.padding);
            startOffset[1] = div.offsetLeft - (e.touches[0].pageX);
            startOffset[2] = div.offsetHeight + e.touches[0].pageY - (2 * Resizable.padding);
            startOffset[3] = div.offsetTop - e.touches[0].pageY;
            onMouseDown();
        };
        divLeftBottom.touchstart = function (e) {
            state = 'down-left-bottom';
            startOffset[0] = div.offsetWidth + e.touches[0].pageX - (2 * Resizable.padding);
            startOffset[1] = div.offsetLeft - (e.touches[0].pageX);
            startOffset[2] = div.offsetHeight - (e.touches[0].pageY + (2 * Resizable.padding));
            onMouseDown();
        };
        divRightTop.touchstart = function (e) {
            state = 'down-right-top';
            startOffset[0] = div.offsetWidth - (e.touches[0].pageX + (2 * Resizable.padding));
            startOffset[1] = div.offsetHeight + (e.touches[0].pageY - (2 * Resizable.padding));
            startOffset[2] = div.offsetTop - e.touches[0].pageY;
            onMouseDown();
        };
        divRightBottom.touchstart = function (e) {
            state = 'down-right-bottom';
            startOffset[0] = div.offsetWidth - (e.touches[0].pageX + (2 * Resizable.padding));
            startOffset[1] = div.offsetHeight - (e.touches[0].pageY + (2 * Resizable.padding));
            onMouseDown();
        };
    }
    function resizeLeft(x, y, a, b) {
        var width = a - x;
        var left = b + x;
        var leftPercent = 100 * (left / document.documentElement.offsetWidth);
        if (leftPercent < bounds.minXPercentage || width < minWidth || width > maxWidth)
        {
            return;
        }
        div.style.width = String(width) + 'px';
        div.style.left = String(left) + 'px';
    }
    function resizeRight(x, y, a) {
        var width = a + x;
        if (width < minWidth || width > maxWidth || 100 * ((width + div.offsetLeft) / document.documentElement.offsetWidth) > bounds.maxXPercentage) {
            return;
        }
        div.style.width = String(width) + 'px';
    }
    function resizeTop(x, y, a, b) {
        var height = a - y;
        var top = b + y;
        if (top < bounds.minYPx || height < minHeight || height > maxHeight) {
            return;
        }
        div.style.height = String(height) + 'px';
        div.style.top = String(top) + 'px';
    }
    function resizeBottom(x, y, a) {
        var height = a + y;
        if (height < minHeight || height > maxHeight || div.offsetTop + height > bounds.maxYPx) {
            return;
        }
        div.style.height = String(height) + 'px';
    }
    function doResize(e) {
        var x = e.pageX;
        var y = e.pageY;
        switch (state) {
            case "up":
                return;
            case "down-left":
                resizeLeft(x, y, startOffset[0], startOffset[1]);
                break;
            case "down-right":
                resizeRight(x, y, startOffset[0]);
                break;
            case "down-top":
                resizeTop(x, y, startOffset[0], startOffset[1]);
                break;
            case "down-bottom":
                resizeBottom(x, y, startOffset[0]);
                break;
            case "down-left-top":
                resizeLeft(x, y, startOffset[0], startOffset[1]);
                resizeTop(x, y, startOffset[2], startOffset[3]);
                break;
            case "down-left-bottom":
                resizeLeft(x, y, startOffset[0], startOffset[1]);
                resizeBottom(x, y, startOffset[2]);
                break;
            case "down-right-top":
                resizeRight(x, y, startOffset[0]);
                resizeTop(x, y, startOffset[1], startOffset[2]);
                break;
            case "down-right-bottom":
                resizeRight(x, y, startOffset[0]);
                resizeBottom(x, y, startOffset[1]);
                break;
        }
        timer.reset();
        if (callbackInstantaneous)
        {
            try
            {
                callbackInstantaneous();
            }
            catch(ex)
            {
                console.log(ex);
            }
        }
    }
    this.setBounds = function (boundsIn)//work in progress.
    {
        var previousBounds = bounds;
        bounds = boundsIn;
        if (previousBounds.minYpx < bounds.minYPx)
        {

        }
        if (previousBounds.maxYPx > bounds.maxYPx)
        {

        }
        if (previousBounds.minXPercent < bounds.minXPercentage)
        {

        }
        if (previousBounds.maxXPercent > bounds.maxXPercent)
        {

        }
    };
}
Resizable.padding = 3;



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

function Drag(element, handle, minX, maxX, minY, maxY, callback, callbackStarted) {
    var minXPercent;
    var maxXPercent;
    var self = this;
    if (minY == undefined) {
        minY = 0;
    }
    if (minX== undefined) {
        minX = 0;
    }
    if (maxY== undefined) {
        maxY = 2000;
    }
    if (maxX== undefined) {
        maxX = 100;
    }
    var state = 0;
    var start;
    var timer;
    this.setPosition = function (array) {
        self.drag(array[0], array[1]);
    };
    this.getPosition = function () {
        var array = [];
        array[0] = element.offsetLeft;
        array[1] = element.offsetTop;
        return array;
    };
    var efficientMovingCycle = new EfficientMovingCycle(handle);
    
    efficientMovingCycle.onmousedown = function (e) {
        onDown(e.pageX, e.pageY, e);
    };
    efficientMovingCycle.ontouchstart = function (e) {
        onDown(e.touches[0].pageX, e.touches[0].pageY, e);
    };
    //handle.addEventListener("touchstart", function(e){
    //    onDown(e.touches[0].pageX, e.touches[0].pageY);
    //});
    function onDown(x, y, e)
    {
        if (element.style.display === "none")
        {
            return;
        }
        if(!Drag.cancel)
            if(callbackStarted)callbackStarted(e);
        start = [element.offsetLeft - x, element.offsetTop - y];
        maxXPercent = maxX - ((100 * element.offsetWidth) / document.documentElement.clientWidth);
        minXPercent = minX;
        if (maxXPercent < 0) {
            maxXPercent = 0;
        }
        else {
            if (maxXPercent > 100) {
                maxXPercent = 100;
            }
        }
        timer = new Timer(function () { if (callback != undefined) { callback(); } }, 1000, 1);
        state = 1;
    }
    efficientMovingCycle.onmousemove = function (e) {
        onMove(e.pageX, e.pageY);
    };
    efficientMovingCycle.ontouchmove = function (e) {
        onMove(e.touches[0].pageX, e.touches[0].pageY);
    };
    function onMove(x, y)
    {
        console.log()
        if(!Drag.cancel)
        if (state == 1) {
            self.drag((start[0] + x), (start[1] + y));
            timer.reset();
        }
    }
    this.drag=function(x, y)
    {
            var left = 100 * x / document.documentElement.clientWidth;
            if (left < minXPercent) {
                left = minXPercent;
            }
            else {
                if (left > maxXPercent) {
                    left = maxXPercent;
                }
            }
            element.style.left = String(left) + '%';
            if (y < minY) {
                y = minY;
            }
            else {
                if (y+element.offsetHeight > maxY) {
                    y = maxY - element.offsetHeight;
                }
            }
            element.style.top = String(y) + 'px';
    };
    
      efficientMovingCycle.onmouseup=function(){  
          
          console.log('cleared');
        Drag.cancel=false;
          state = 0;
    };
    efficientMovingCycle.ontouchend = function (e) {         
        Drag.cancel=false;
        state=0;
    };
}
var Themes={};
    Themes.themes = {
        Blue: {
            components: {
                frame: {'background-color': '#0099ff'},
                frameFlashing: {'background-color': '#ccff00'},
                frameBorder: {'border': '1px solid #66a3ff', '-webkit-box-shadow': 'none','-moz-box-shadow': 'none','box-shadow': 'none', 'border-radius': '5px'},
                text: {'color': '#000000', 'font-weight': 'bold', 'font-size': '14px', 'font-family':'Arial'},
                controls: {'background-color': '#ccb3ff'},
                feed: {'background-color': '#e6ffff'},
                body: {'background-color': '#555555'},
                background: {'background-image': 'url("images/background.png")'},
                taskbar: {'background-color': 'rgba(102,153,153, 0.5)', 'border-top': '1px solid rgba(102,153,153,0.8)'},
                taskbarMobile: {'background-color': '#0099ff', 'border-top': '0'},
                text_color: {'color': '#000000'},
                text_font: { 'font-weight': 'bold', 'font-family':'Arial'},
                frame1: {'background-color': '#e6e6ff'},
                body1: {'background-color': '#555555'},
                closeImage:{'../src':window.thePageUrl+'images/close_black.png'},
                minimizeImage:{'../src':window.thePageUrl+'images/minimize_black.png'},
                maximizeImage:{'../src':window.thePageUrl+'images/maximize_black.png'},
                frameMobile: {'background-color': '#0099ff'},
                frameBorderMobile: {'border': '0px solid #66a3ff', '-webkit-box-shadow': 'none','-moz-box-shadow': 'none','box-shadow': 'none', 'border-radius': '0px'},
                imgTaskbar:{'../src':window.thePageUrl+'images/black_menu.png'}
                
            }
        },
        'Insane pink': {
            components: {
                frame: {'background-color': '#ff0066'},
                frameFlashing: {'background-color': '#ccff00'},
                frameBorder: {'border': '1px solid #9933ff', '-webkit-box-shadow': 'none','-moz-box-shadow': 'none','box-shadow': 'none', 'border-radius': '5px'},
                text: {'color': '#000000', 'font-weight': 'bold', 'font-size': '14px', 'font-family':'Arial'},
                controls: {'background-color': '#df80ff'},
                feed: {'background-color': '#e6ccff'},
                body: {'background-color': '#800080'},
                background: {'background-image': 'url("images/star--background-neon.jpg")'},
                taskbar: {'background-color': 'rgba(0,255,188, 0.4)', 'border-top': '1px solid rgba(0,255,188, 0.6)'},
                taskbarMobile: {'background-color': '#ff0066', 'border-top': '0'},
                text_color: {'color': '#000000'},
                text_font: { 'font-weight': 'bold', 'font-family':'Arial'},
                frame1: {'background-color': '#e6e6ff'},
                body1: {'background-color': '#800080'},
                closeImage:{'../src':window.thePageUrl+'images/close_black.png'},
                minimizeImage:{'../src':window.thePageUrl+'images/minimize_black.png'},
                maximizeImage:{'../src':window.thePageUrl+'images/maximize_black.png'},
                frameMobile: {'background-color': '#ff0066'},
                frameBorderMobile: {'border': '0px solid #9933ff', '-webkit-box-shadow': 'none','-moz-box-shadow': 'none','box-shadow': 'none', 'border-radius': '0px'},
                imgTaskbar:{'../src':window.thePageUrl+'images/black_menu.png'}
               
            }
        },
        Orange: {
            components: {
                frame: {'background-color': '#F68735'},
                frameFlashing: {'background-color': '#ccff00'},
                frameBorder: {'border': '1px solid #999FAD', '-webkit-box-shadow': 'none','-moz-box-shadow': 'none','box-shadow': 'none', 'border-radius': '5px'},
                text: {'color': '#000000', 'font-weight': 'bold', 'font-size': '14px', 'font-family':'Arial'},
                controls: {'background-color': '#A8ACB8'},
                feed: {'background-color': '#DDDDDB'},
                body: {'background-color': '#3F547F'},
                background: {'background-image': 'url("images/background.png")'},
                taskbar: {'background-color': 'rgba(102,153,153, 0.5)', 'border-top': '1px solid rgba(102,153,153,0.8)'},
                taskbarMobile: {'background-color': '#F68735', 'border-top': '0'},
                text_color: {'color': '#000000', 'font-weight': 'lighter'},
                text_font: { 'font-weight': 'bold', 'font-family':'Arial'},
                frame1: {'background-color': '#e6e6ff'},
                body1: {'background-color': '#3F547F'},
                closeImage:{'../src':window.thePageUrl+'images/close_black.png'},
                minimizeImage:{'../src':window.thePageUrl+'images/minimize_black.png'},
                maximizeImage:{'../src':window.thePageUrl+'images/maximize_black.png'},
                frameMobile: {'background-color': '#F68735'},
                frameBorderMobile: {'border': '0px solid #999FAD', '-webkit-box-shadow': 'none','-moz-box-shadow': 'none','box-shadow': 'none', 'border-radius': '0px'},
                imgTaskbar:{'../src':window.thePageUrl+'images/black_menu.png'}
            }
        },
        Dark: {
            components: {
                frame: {'background-color': '#2C2B2B'},
                frameFlashing: {'background-color': '#ccff00'},
                text: {'color': '#ffffff', 'font-weight': 'lighter', 'font-size': '12px', 'font-family':'Arial'},
                frameBorder: {'border': '0px solid #8fc800', '-webkit-box-shadow': '0px 0px 6px 1px rgba(143,200,0,0.8)','-moz-box-shadow': '0px 0px 6px 1px rgba(143,200,0,0.8)','box-shadow': '0px 0px 6px 1px rgba(143,200,0,0.8)', 'border-radius': '3px'},
                controls: {'background-color': '#555555'},
                feed: {'background-color': '#aaaaaa'},
                body: {'background-color': '#201F1F'},
                background: {'background-image': 'url("images/nights-sky.jpg")'},
                taskbar: {'background-color': 'rgba(102,153,153, 0.5)','border-top': '1px solid rgba(102,153,153, 0.75)'},
                taskbarMobile: {'background-color': '#2C2B2B', 'border-top': '0'},
                text_color: {'color': '#ffffff'},
                text_font: { 'font-weight': 'lighter', 'font-family':'Arial'},
                frame1: {'background-color': '#201F1F'},
                body1: {'background-color': '#201F1F'},
                closeImage:{'../src':window.thePageUrl+'images/close_white.png'},
                minimizeImage:{'../src':window.thePageUrl+'images/minimize_white.png'},
                maximizeImage:{'../src':window.thePageUrl+'images/maximize_white.png'},
                frameMobile: {'background-color': '#2C2B2B'},
                frameBorderMobile: {'border': '0px solid #8fc800', '-webkit-box-shadow': 'none','-moz-box-shadow': 'none','box-shadow': 'none', 'border-radius': '0px'},
                imgTaskbar:{'../src':window.thePageUrl+'images/white_menu.png'}
               
        }
    },
        Nature: {
            components: {
                frame: {'background-color': '#394d00'},
                frameFlashing: {'background-color': '#ccff00'},
                text: {'color': '#ffffff', 'font-weight': 'lighter', 'font-size': '12px', 'font-family':'Arial'},
                frameBorder: {'border': '1px solid #998800', '-webkit-box-shadow': 'none','-moz-box-shadow': 'none','box-shadow': 'none', 'border-radius': '5px'},
                controls: {'background-color': '#555555'},
                feed: {'background-color': '#aaaaaa'},
                body: {'background-color': '#331200'},
                background: {'background-image': 'url("images/trees.jpg")'},
                taskbar: {'background-color': 'rgba(230,92,0, 0.55)','border-top': '1px solid rgba(230,92,0, 0.75)'},
                taskbarMobile: {'background-color': '#394d00', 'border-top': '0'},
                text_color: {'color': '#ffffff'},
                text_font: { 'font-weight': 'lighter', 'font-family':'Arial'},
                frame1: {'background-color': '#201F1F'},
                body1: {'background-color': '#201F1F'},
                closeImage:{'../src':window.thePageUrl+'images/close_white.png'},
                minimizeImage:{'../src':window.thePageUrl+'images/minimize_white.png'},
                maximizeImage:{'../src':window.thePageUrl+'images/maximize_white.png'},
                frameMobile: {'background-color': '#394d00'},
                frameBorderMobile: {'border': '0px solid #998800', '-webkit-box-shadow': 'none','-moz-box-shadow': 'none','box-shadow': 'none', 'border-radius': '0px'},
                imgTaskbar:{'../src':window.thePageUrl+'images/white_menu.png'}

        }
    }
    };
Themes.arrayObjects = [];
Themes.restyleObject = function (object, theme)
{
    if (object && theme && theme.components) {
        for (var k = 0; k < object.components.length; k++)
        {
            var component = object.components[k];
            if (component)
            {
                var style = theme.components[component.name];
                if (style)
                {
                    for (var l = 0; l < component.elements.length; l++)
                    {
                        styleFromObject(component.elements[l], style);
                    }
                }
            }
        }
        if (object.callback)
        {
            object.callback(theme);
        }
    }
};
Themes.restyle = function (name)
{
    var theme = Themes.themes[name];
    Themes.theme = theme;
    if (theme && theme.components)
    {
        for (var j = 0; j < Themes.arrayObjects.length; j++)
        {
            var object = Themes.arrayObjects[j];
            Themes.restyleObject(object, Themes.theme);
        }
    }

};
Themes.remove = function (obj)
{
    Themes.arrayObjects.splice(Themes.arrayObjects.indexOf(obj), 1);
};
Themes.register = function (obj)//obj contains a map that maps a component name ( such as frame-color) to the element. if themeName is undefined, the default will.
{
    Themes.arrayObjects.push(obj);
    Themes.restyleObject(obj, Themes.theme);
};

var Windows = new (function () {
    var self = this;
    var selfWindows=this;
    this.maxYPx = 1200;
    this.maxWidthPx = 1800;
    this.maxHeightPx = 1800;
    this.instances = [];
    this.currentBounds = {minYPx: 0, maxYPx: 1200, minXPercent: 0, maxXPercent: 100};
    this.add = function (params)
    {
        this.instances.push(params.obj);
        document.body.appendChild(params.obj.div);
        var obj = params.obj;
        var divInner = params.divInner;
        var divTab = params.divTab;
        var windowInformation = params.windowInformation;
        var callbacks = params.callbacks;
        var minimized = params.minimized;
        obj.div.addEventListener("mousedown", function () {
            if (!obj.cancelBringToFront)
            {
                self.bringToFront(obj);
            }
            obj.cancelBringToFront = false;
        });
        if (!windowInformation)
            windowInformation = new WindowInformation();
        obj.windowInformation = windowInformation;
        obj.windowMethods = {resized: function () {
        //        maximized = false;
            }};
        if (!callbacks)
            var callbacks = new WindowCallbacks();
        obj.windowMethods.callbacks = callbacks;
        obj.div.addEventListener("resize", obj.windowMethods.resized, false);
        var padding;
        if (!isMobile)
        {
            padding = 3;
        }
        else
        {
            padding = 0;
        }
        var paddingString = String(padding) + 'px';
        obj.div.style.padding = paddingString;
        divInner.style.position = 'absolute';
        divInner.style.left = paddingString;
        divInner.style.top = paddingString;
        divInner.style.right = paddingString;
        divInner.style.bottom = paddingString;
        if (!isMobile)
        {
            if (windowInformation.resizable)
            {
                obj.resizable = new Resizable(obj.div, divInner, windowInformation.minWidthPx, windowInformation.minHeightPx, windowInformation.maxWidthPx, windowInformation.maxHeightPx, self.currentBounds,
                        callbacks.resized,
                        callbacks.resizedInstantaneous);
            }
            if (windowInformation.dragable)
            {
                obj.drag = new Drag(obj.div, divTab, windowInformation.minXPercent, windowInformation.maxXPercent, windowInformation.minYPx, windowInformation.maxYPx, function ()
                {
                    try
                    {
                        if (callbacks.dragged)
                            callbacks.dragged();

                    }
                    catch (ex)
                    {
                        console.log(ex);
                    }
                }
                , function (e) {
                    if(windowInformation.maximized)
                    Window.unmaximize(obj, {left: e.screenX});
                    try
                    {
                        if (callbacks.unmaximized)
                            callbacks.unmaximized();

                    }
                    catch (ex)
                    {
                        console.log(ex);
                    }
                });
            }
        }
        if (!isMobile)
        {
            if (windowInformation.closeable||windowInformation.minimizeOnClose)
            {
            obj.buttonClose = new Window.CloseButton(function () {
                if (windowInformation.minimizeOnClose)
                {
                    if (callbacks.minimize)
                    {
                        callbacks.minimize();
                    }
                }
                else
                {
                    if (callbacks.close)
                    {
                        callbacks.close();
                    }
                }
            });
            divTab.appendChild(obj.buttonClose.button);
        }
            if (windowInformation.maximizable)
            {
                obj.buttonMaximize = new Window.MaximizeButton(function () {
                    if (callbacks.maximize)
                        callbacks.maximize();
                });
                divTab.appendChild(obj.buttonMaximize.button);
            }
            if (windowInformation.minimizable)
            {
                obj.buttonMinimize = new Window.MinimizeButton(function () {
                    if (callbacks.minimize)
                        callbacks.minimize();
                });
                divTab.appendChild(obj.buttonMinimize.button);
            }
        }
        if(!minimized&&obj.show)
        {
            obj.show();
        }
    };
    this.isWindow = function (element)
    {
        return self.instances.indexOf(element) >= 0;
    };
    this.getParentWindow = function (element)
    {
        while (true)
        {
            if (element.parentElement == document.documentElement)
            {
                return document.documentElement;
            }
            else
            {
                if (self.isWindow(element))
                {
                    return element;
                }
            }
            element = element.parentElement;
        }
    };
    this.remove = function (obj)
    {
        self.instances.splice(self.instances.indexOf(obj), 1);
        document.body.removeChild(obj.div);
        if (obj.buttonClose)
        {
            obj.buttonClose.close();
        }
        if (obj.buttonMinimize)
        {
            obj.buttonMinimize.close();
        }
        if (obj.buttonMaximize)
        {
            obj.buttonMaximize.close();
        }
    };
    this.hide = function (obj)
    {
        obj.hide();
        var spliced = self.instances.splice(self.instances.indexOf(obj), 1)[0];
        if (spliced)
        {
            self.instances.splice(0, 0, spliced);
            focusFrontWindow();
        }
    };
    this.show = function (obj)
    {
        obj.show();
    };
    this.cancelBringToFront = function (obj)
    {
        obj.cancelBringToFront = true;
    };
    this.bringToFront = function (obj)
    {
        var spliced = self.instances.splice(self.instances.indexOf(obj), 1)[0];
        if (spliced)
        {
            self.instances.push(spliced);
        }
        var zIndex = 100;
        for (var i = 0; i < self.instances.length; i++)
        {
            var obj = self.instances[i];
            obj.div.style.zIndex = String(zIndex);
            if (obj.windowMethods.callbacks.callbackZIndexChanged)
            {
                obj.windowMethods.callbacks.callbackZIndexChanged(zIndex);
            }
            zIndex++;
        }
        focusFrontWindow();
    };
    function focusFrontWindow(){
        var frontWindow = self.instances[self.instances.length-1];
        if(frontWindow.windowMethods.callbacks.focussed){
            frontWindow.windowMethods.callbacks.focussed();}
    }
    this.getActive = function ()
    {
        var i = self.instances.length - 1;
        while (i >= 0)
        {
            var active = self.instances[i];
            if (active.div.style.display != 'none')
            {
                return active;
            }
            i--;
        }
        return null;
    };
})();


var Window = new (function () {
    document.body.style.overflowY = 'auto';
    var self = this;
    this.stopEventPropogation = function (e)
    {
        if (!e)
            e = window.event;

        //IE8 and Lower
        e.cancelBubble = true;
        //IE9 & Other Browsers
        if (e.stopPropagation) {
            e.stopPropagation();
        }
    };
    this.getStartPosition = function ()
    {
        var diag;
        while (true)
        {
            diag = 100 * Math.random() | 0;
            if (!self.previousDiag)
            {
                break;
            }
            else
            {
                if (Math.abs(self.previousDiag - diag) > 19)
                {
                    break;
                }
            }
        }
        var top = 0;
        var left = 260;
        self.previousDiag = diag;
        return [left + diag, top + diag];
    };
    this.maximize = function (obj, fillElseReduce)
    {

        var windowInformation = obj.windowInformation;
        if (fillElseReduce != undefined)
        {
            if (fillElseReduce)
            {
                maximize(obj);
            }
            else
            {
                unmaximize(obj);
            }
        }
        else
        {
            if (!windowInformation.maximized || (windowInformation.maximized && !equalValues(getSizes(obj), windowInformation.maximizedSizes)))
            {
                maximize(obj);
            }
            else
            {
                unmaximize(obj);
            }
        }
    };
    this.unmaximize = function (obj, mouseDragPosition) {
        unmaximize(obj, mouseDragPosition);
    };
    this.resize = function (obj) {
        if (obj.windowInformation.maximized) {
            var p = Resizable.padding * 2;
            setWindowSizePosition(obj, document.documentElement.clientWidth, document.documentElement.clientHeight - (p + Windows.taskBar.div.offsetHeight), -Resizable.padding, -Resizable.padding);
        }
    };

    this.style = function (div, divInner, divTab)
    {
        var frameThemeObject;
        var frameBorderThemeObject;
        if (!isMobile)
        {
            frameThemeObject = {name: 'frame', elements: [divInner]};
            frameBorderThemeObject = {name: 'frameBorder', elements: [divInner]};
        }
        else
        {
            div.style.position = 'fixed';
            div.style.width = '100%';
            div.style.height = 'calc(100% - ' + String(self.divDragHeightTaskBarPx) + 'px)';
            div.style.left = '0px';
            div.style.top = '0px';
            div.style.margin = '0';
            frameThemeObject = {name: 'frameMobile', elements: [divInner]};
            frameBorderThemeObject = {name: 'frameBorderMobile', elements: [divInner]};
        }
        var themesObject = {components: [
                frameThemeObject,
                frameBorderThemeObject
            ],
            callback: function (theme) {

            }
        };
        Themes.register(themesObject, undefined);
    };
    this.CloseButton = function (callback)
    {
        var button = new self.Button(callback, 'images/close_white.png', 'images/close_red.png');
        this.button = button.button;
        var themesObject = {components: [
                {name: 'closeImage', elements: [button.img]}
            ],
            callback: function (theme) {

            }
        };
        Themes.register(themesObject, undefined);
        this.close = function ()
        {
            Themes.remove(themesObject);
        };
    };
    this.MinimizeButton = function (callback)
    {
        var button = new self.Button(callback, 'images/minimize_white.png', 'images/minimize_red.png');
        this.button = button.button;
        var themesObject = {components: [
                {name: 'minimizeImage', elements: [button.img]}
            ],
            callback: function (theme) {

            }
        };
        Themes.register(themesObject, undefined);
        this.close = function ()
        {
            Themes.remove(themesObject);
        };
    };
    this.MaximizeButton = function (callback)
    {
        var button = new self.Button(callback, 'images/maximize_white.png', 'images/maximize_red.png');
        this.button = button.button;
        var themesObject = {components: [
                {name: 'maximizeImage', elements: [button.img]}
            ],
            callback: function (theme) {

            }
        };
        Themes.register(themesObject, undefined);
        this.close = function ()
        {
            Themes.remove(themesObject);
        };
    };
    this.Button = function (callback, imageSource, imageSourceHover)
    {
        var self = this;
        this.button = document.createElement('button');
        this.button.style.float = 'right';
        this.button.style.border = '0px';
        this.button.style.backgroundColor = 'transparent';
        this.button.style.cursor = 'pointer';
        this.button.style.fontFamily = 'Arial';
        this.button.style.fontWeight = '900';
        this.button.style.fontSize = '14px';
        this.button.style.height = '12px';
        this.button.style.marginTop = '1px';
        this.img = document.createElement('img');
        this.img.src = window.thePageUrl + imageSource;
        this.button.appendChild(this.img);
        var previousImage;
        new Hover(this.button, function () {
            previousImage = self.img.src;
            self.img.src = window.thePageUrl + imageSourceHover;
        }, function () {
            self.img.src = previousImage;


        });
        this.button.addEventListener("mousedown", function ()
        {
            if (window.Drag)
                Drag.cancel = true;
        });
        this.button.addEventListener("click", function ()
        {
            callback();
        });

    };


    function getSizes(obj)
    {
        var p = Resizable.padding * 2;
        return {width: obj.div.offsetWidth - p, height: obj.div.offsetHeight - p, top: obj.div.offsetTop, left: obj.div.offsetLeft};
    }
    function maximize(obj)
    {
        var windowInformation = obj.windowInformation;
        windowInformation.previousSizes = getSizes(obj);
        var p = Resizable.padding * 2;
        setWindowSizePosition(obj, document.documentElement.clientWidth, document.documentElement.clientHeight - (p + Windows.taskBar.div.offsetHeight), -Resizable.padding, -Resizable.padding);
        windowInformation.maximizedSizes = getSizes(obj);
        windowInformation.maximized = true;
        
    }
    function unmaximize(obj, mouseDragPosition)
    {
        var windowInformation = obj.windowInformation;
        if (windowInformation.previousSizes)
        {
            if (!mouseDragPosition)
                setWindowSizePosition(obj, windowInformation.previousSizes.width, windowInformation.previousSizes.height, windowInformation.previousSizes.top, windowInformation.previousSizes.left);
            else {
                var b = mouseDragPosition.left / document.documentElement.clientWidth;
                var leftOffset = (b * windowInformation.previousSizes.width);
                var l = mouseDragPosition.left - leftOffset;
                console.log(l);
                setWindowSizePosition(obj, windowInformation.previousSizes.width, windowInformation.previousSizes.height, undefined, l);
            }
        }
        windowInformation.maximized = false;
    }
    function setWindowSizePosition(obj, width, height, top, left)
    {
        obj.div.style.height = String(height) + 'px';
        obj.div.style.width = String(width) + 'px';
        if (top)
            obj.div.style.top = String(top) + 'px';
        if (left)
            obj.div.style.left = String(left) + 'px';
    }
    window.addEventListener("resize", function () {
        for (var i = 0; i < Windows.instances.length; i++)
        {
            var obj = Windows.instances[i];
            self.resize(obj, true);
        }
    }, false);
    this.divDragHeightTaskBarPx = document.documentElement.clientHeight / 12;

})();

function WindowCallbacks(resized, dragged, minimize, maximize, close, callbackZIndexChanged, resizedInstantaneous, unmaximized, unminimized, focussed)
{
    this.resized = resized;
    this.dragged = dragged;
    this.minimize = minimize;
    this.maximize = maximize;
    this.close = close;
    this.callbackZIndexChanged = callbackZIndexChanged;
    this.resizedInstantaneous = resizedInstantaneous;
    this.unmaximized = unmaximized;
    this.unminimized = unminimized;
    this.focussed=focussed;
}
function WindowInformation(resizable, dragable, minWidthPx, minHeightPx, maxWidthPx, maxHeightPx, minXPercent, maxXPercent, minYPx, maxYPx, minimizable, maximizable, minimizeOnClose, closeable)
{
    if (!minWidthPx)
        minWidthPx = Windows.minWidthPx;
    if (!minHeightPx)
        minHeightPx = Windows.minHeightPx;
    if (!maxWidthPx)
        maxWidthPx = Windows.maxWidthPx;
    if (!maxHeightPx)
        maxHeightPx = Windows.maxHeightPx;
    if (!minXPercent)
        minXPercent = 0;
    if (!maxXPercent)
        maxXPercent = 100;
    if (!minYPx)
        minYPx = 0;
    if (!maxYPx)
        maxYPx = 1000;
    if (resizable == undefined)
        resizable = true;
    if (dragable == undefined)
        dragable = true;
    if(closeable==undefined)
        closeable=true;

    if (minimizable == undefined)
    {
        minimizable = true;
    }
    if (maximizable == undefined)
    {
        maximizable = true;
    }
    if (minimizeOnClose == undefined)
    {
        minimizeOnClose = false;
    }
    this.minWidthPx = minWidthPx;
    this.minHeightPx = minHeightPx;
    this.maxWidthPx = maxWidthPx;
    this.maxHeightPx = maxHeightPx;
    this.minXPercent = minXPercent;
    this.maxXPercent = maxXPercent;
    this.minYPx = minYPx;
    this.maxYPx = maxYPx;
    this.minimizable = minimizable;
    this.maximizable = maximizable;
    this.minimizeOnClose = minimizeOnClose;
    this.resizable = resizable;
    this.dragable = dragable;
    this.closeable = closeable;
}

function Tooltip(text)
{
    var self = this;
    if(!isMobile)
    {
    var timerTooltip;
    this.div = document.createElement('div');
    var divBody = document.createElement('div');
    var divArrow = document.createElement('div');
    this.div.style.position='fixed';
    this.div.style.width='auto';
    this.div.style.height='auto';
    this.div.style.display='none';
    this.div.style.zIndex='400000';
    divBody.style.backgroundColor='#222222';
    divBody.style.borderRadius='6px';
    divBody.style.color = '#ffffff';
    divBody.style.padding='6px';
    divBody.style.fontFamily='Arial';
    divArrow.style.width='0'; 
    divArrow.style.height='0'; 
    divArrow.style.borderLeft='10px solid transparent';
    divArrow.style.borderRight='10px solid transparent';
    divArrow.style.borderTop='10px solid #222222';
    divArrow.style.marginLeft='10px';
    setText(divBody, text);
    this.div.appendChild(divBody);
    this.div.appendChild(divArrow);
    document.body.appendChild(this.div);
    }
    this.show = function(x, y)
    {
        if(!isMobile)
        {
            self.div.style.left=String(x-10)+'px';
            self.div.style.display='block';
            self.div.style.top=String(y-(self.div.offsetHeight))+'px';
        }
    };
    this.showAfterDelay = function(x, y){
        if(!isMobile)
        {
            timerTooltip = new Timer(function(){self.show(x, y);}, 800, 1, false);
        }
    };
    this.hide=function()
    {
        if(!isMobile)
        {
            if(timerTooltip)
            {
                timerTooltip.stop();
            }
        self.div.style.display='none';
        }
    };
}

function getAbsolute(element)
{
    var offsets = {};
    offsets.left = 0;
    offsets.right = 0;
    offsets.top = 0;
    offsets.bottom = 0;
    var skip=0;
    try{
        while(true)
        {
            var rect=element.getBoundingClientRect();
            if(skip==0)
            {
            offsets.left += element.offsetLeft- element.scrollLeft;
            offsets.right += element.offsetRight- element.scrollRight;
            offsets.top +=  element.offsetTop- element.scrollTop;
            offsets.bottom += element.offsetBottom- element.scrollBottom;
        }
        else
        {
            skip--;
        }
            if(element.parentElement==document.documentElement)
            {
                return offsets;
            }
            element = element.parentElement;
        }
    }
    catch(ex)
    {

    }
}
function getZIndex (element) {      
  var z = window.document.defaultView.getComputedStyle(element).getPropertyValue('z-index');
  if (isNaN(z)) return window.getZIndex(element.parentNode);
  return z; 
};
function TaskBar()
{

    var tasks = [];
    var self = this;
    var selfTaskBar = this;
    this.div = document.createElement('div');
    this.div.style.position = 'fixed';
    this.div.style.bottom = '0px';
    this.div.style.left = '0px';
    this.div.style.width = '100%';
    this.div.style.zIndex = '200000';
    this.div.style.backgroundColor = 'rgba(104,153,153, 0.5)';
    if (isMobile)
    {
        var divDrag = document.createElement('div');
        divDrag.style.top = '0px';
        divDrag.style.left = '0px';
        divDrag.style.width = '100%';
        var img = document.createElement('img');
        self.div.appendChild(img);
        img.src = window.thePageUrl + 'images/black_menu.png';
        img.style.top = '0px';
        img.style.position = 'absolute';
        setSizes();
        var imgWidth;
        function setSizes()
        {
            divDrag.style.height = String(Window.divDragHeightTaskBarPx) + 'px';
            imgWidth = Window.divDragHeightTaskBarPx * 1.5;
            img.style.width = String(imgWidth) + 'px';
            img.style.height = String(Window.divDragHeightTaskBarPx - 2) + 'px';
            img.style.top = '1px';
            img.style.left = 'calc(50% - ' + String(imgWidth / 2) + 'px)';
        }
        Themes.register({components: [
                {name: 'imgTaskbar', elements: [img]}
            ],
            callback: function (theme) {

            }
        }, undefined);
        this.div.appendChild(divDrag);
        this.div.style.height = String(Window.divDragHeightTaskBarPx) + 'px';
        var startOffset = [];
        var timerMove;
        var showing = false;
        var step = Math.floor(Window.divDragHeightTaskBarPx / 3);
        var lowerOuterBound = Window.divDragHeightTaskBarPx + step;
        function vanish()
        {
            showing = false;
            var height = self.div.offsetHeight;

            if (timerMove)
            {
                timerMove.stop();
            }
            timerMove = new Timer(function ()
            {
                if (height > lowerOuterBound)
                {
                    height -= step;
                } else
                {
                    if (height > Window.divDragHeightTaskBarPx)
                        height = Window.divDragHeightTaskBarPx;
                    timerMove.stop();
                }
                self.div.style.height = String(height) + 'px';
                self.div.style.top = String(document.documentElement.clientHeight - height) + 'px';
            }, 5, -1);
        }
        this.vanish = vanish;
        function appear()
        {
            showing = true;
            var height = self.div.offsetHeight;
            var upperOuterBound = document.documentElement.clientHeight - step;
            if (timerMove)
            {
                timerMove.stop();
            }
            timerMove = new Timer(function ()
            {
                if (height < upperOuterBound)
                {
                    height += step;
                } else
                {
                    if (height < document.documentElement.clientHeight)
                        height = document.documentElement.clientHeight;
                    timerMove.stop();
                }
                self.div.style.height = String(height) + 'px';
                self.div.style.top = String(document.documentElement.clientHeight - height) + 'px';
            }, 5, -1);

        }
        self.div.addEventListener("resize", function ()
        {
            setSizes();
            if (showing)
            {
                self.div.style.height = String(document.documentElement.clientHeight) + 'px';
                self.div.style.top = '0px';
            } else
            {
                self.div.style.height = String(Window.divDragHeightTaskBarPx) + 'px';
                self.div.style.top = String(document.documentElement.clientHeight - Window.divDragHeightTaskBarPx) + 'px';

            }
        }, false);
        var moveEvent = function (e) {
            if (!e)
                var e = window.event;
            if (e.preventDefault)
            {
                e.preventDefault();
            }
            var height = (startOffset[0] - e.changedTouches[e.changedTouches.length - 1].pageY);
            if (height > document.documentElement.clientHeight)
                height = document.documentElement.clientHeight;
            else
            {
                if (height < Window.divDragHeightTaskBarPx)
                    height = Window.divDragHeightTaskBarPx;
            }
            self.div.style.height = String(height) + 'px';
            var top = document.documentElement.clientHeight - height;
            self.div.style.top = String(top) + 'px';
        };
        var upEvent = function (e)
        {
            if (!e)
                var e = window.event;
            if (e.preventDefault)
            {
                e.preventDefault();
            }
            if ((100 * (startOffset[0] - e.changedTouches[e.changedTouches.length - 1].pageY)) / document.documentElement.clientHeight > (showing ? 70 : 30))
                appear();
            else
                vanish();
            document.documentElement.removeEventListener("touchend", upEvent);
            divDrag.removeEventListener("touchmove", moveEvent);
            img.removeEventListener("touchmove", moveEvent);
        };
        var startEvent = function (e) {
            if (!e)
                var e = window.event;
            if (e.preventDefault)
            {
                e.preventDefault();
            }
            startOffset[0] = self.div.offsetHeight + e.changedTouches[0].pageY;
            document.documentElement.addEventListener("touchend", upEvent);
            divDrag.addEventListener("touchmove", moveEvent);
            img.addEventListener("touchmove", moveEvent);
        };
        divDrag.addEventListener("touchstart", startEvent);
        img.addEventListener("touchstart", startEvent);
    } else
    {
        this.div.style.height = 'auto';
        this.div.style.paddingLeft = '12px';
    }
    this.div.style.borderTop = '1px solid #aa00ff';
    this.add = function (obj)
    {
        if (obj.taskBarInformation)
        {
            self.div.appendChild(new Task(obj).div);
        }
    };
    function setActiveTask(task)
    {
        for (var i = 0; i < tasks.length; i++)
        {
            var t = tasks[i];
            if (t == task)
            {
                styleFromObject(t.div, t.obj.taskBarInformation.activeStyle);
            } else
            {
                styleFromObject(t.div, t.obj.taskBarInformation.style);
            }
        }
    }
    function Task(obj)
    {
        var self = this;
        this.obj = obj;
        obj.task = this;
        if (isMobile)
            var height = Window.divDragHeightTaskBarPx;
        else
            var height = 25;
        this.div = document.createElement('div');
        var img = document.createElement('img');
        this.div.style.position = 'relative';
        this.div.style.cursor = 'pointer';
        this.div.style.float = 'left';
        this.div.style.height = String(height) + 'px';
        this.div.style.width = 'auto';
        this.div.style.minWidth = String(height) + 'px';
        this.div.style.textAlign = 'center';
        this.div.style.marginRight = '6px';
        this.div.style.padding = '6px';
        img.style.height = '100%';
        img.src = window.thePageUrl + obj.taskBarInformation.icon;
        var tooltip = new Tooltip(obj.taskBarInformation.tooltip);
        styleFromObject(self.div, obj.taskBarInformation.style);
        this.div.appendChild(img);
        new HoverAndClick(this.div, function (e) {
            styleFromObject(self.div, obj.taskBarInformation.hoverStyle);
            var position = getAbsolute(self.div);
            tooltip.showAfterDelay(position.left, position.top);
        }, function () {
            tooltip.hide();
        }, function (e) {
            if (selfTaskBar.vanish)
                selfTaskBar.vanish();
            if (Windows.getActive() != self.obj)
            {
                self.unminimize();
            } else
            {
                self.minimize();
            }
        });

        this.unminimize = function ()
        {
            Windows.show(self.obj);
            Windows.bringToFront(self.obj);
            setActiveTask(self);
        };
        this.minimize = function ()
        {
            if(!self.obj.windowInformation||self.obj.windowInformation.minimizable){
            Windows.hide(self.obj);
            var active = Windows.getActive();
            if (active != null)
            {
                setActiveTask(active.task);
            } else
            {
                setActiveTask(null);
            }
        }
        };
        this.maximize = function ()
        {
            setActiveTask(self);
            Window.maximize(obj);
        };
        obj.div.addEventListener("mousedown", function ()
        {
            setActiveTask(self);
        });
        tasks.push(this);
        this.remove = function ()
        {
            self.minimize();
            selfTaskBar.div.removeChild(self.div);
        };
        var timerFlash;
        this.flash = function ()
        {
            var styleInitial = self.div.style.cssText;
            var flashing = false;
            timerFlash = new Timer(function () {
                if (flashing) {
                    self.div.style.cssText = styleInitial;
                    flashing = false;
                } else {
                    self.div.style.backgroundColor = '#ccff00';
                    flashing = true;
                }
            }, 300, 6);
        };
        this.attention = function ()
        {
            if (Windows.getActive() != self.obj)
            {
                styleFromObject(self.div, obj.taskBarInformation.attentionStyle);
            }
        };
    }
    makeUnselectable(this.div);
    var taskbarThemeObject;
    if (isMobile)
    {
        taskbarThemeObject = {name: 'taskbarMobile', elements: [divDrag]};
        self.div.style.background = '#111111';
        self.div.style.border = '0px';
    } else
    {
        taskbarThemeObject = {name: 'taskbar', elements: [self.div]};
    }
    Themes.register({components: [
            taskbarThemeObject
        ],
        callback: function (theme) {

        }}, undefined);
}
var taskBar = new TaskBar();
Windows.taskBar = taskBar;
document.body.appendChild(taskBar.div);
TaskBar.add = function (obj)
{
    taskBar.add(obj);
};

function Colors(cssName, callback)
{
    var self = this;
    var selfColors = this;
    var settings = new Settings("#colors"+cssName, function () {
        this.set("color");
        //this is a reset function for this particualr instance of this particular class.
    });
    this.taskBarInformation = {tooltip:'Pick font color',icon: ('images/' + cssName + '-icon.gif'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divMain = document.createElement('div');
    var divTitle = document.createElement('div');
    this.div.style.position = 'absolute';
    this.div.style.height = 'auto';
    this.div.style.width = '300px';
    this.div.style.display = 'none';
    divInner.style.height = '100%';
    divInner.style.border = '1px solid #66a3ff';
    divInner.style.backgroundColor = '#0099ff';
    divInner.style.padding = '0px 3px 3px 3px';
    divInner.style.borderRadius = "5px";
    divInner.style.overflow = 'hidden';
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.height = "20px";
    divTab.style.cursor = 'move';
    divTab.style.padLeft = '10px';
    divMain.style.float = 'left';
    divMain.style.height = 'auto';
    divMain.style.width = '100%';
    divMain.style.position='relative';
    divMain.style.backgroundColor = '#ffffff';
    divMain.style.overflow = 'hidden';
    divTitle.style.float = 'left';
    divTitle.style.paddingLeft = '5px';
    divTitle.style.fontFamily = 'Arial';
    verticallyCenter(divTitle);
    setText(divTitle, "Font colors");
    function verticallyCenter(element)
    {
        element.style.position = 'relative';
        element.style.top = '50%';
        element.style.transform = 'translateY(-50%)';
        element.style.msTransform = 'translateY(-50%)';
        element.style.webkitTransform = 'translateY(-50%)';
        element.style.oTransform = 'translateY(-50%)';
    }
    this.getColor = function ()
    {
        return selfColors.selected.color;
    };



    this.div.appendChild(divInner);
    divInner.appendChild(divTab);
    divTab.appendChild(divTitle);
    divInner.appendChild(divMain);

    var x = [0, 64, 128, 192, 255];
    function rgb(r, g, b) {
        return "#" + pad(r.toString(16), 2) + pad(g.toString(16), 2) + pad(b.toString(16), 2);
    }
    function pad(num, size) {
        var s = num + "";
        while (s.length < size)
            s = "0" + s;
        return s;
    }
    var n = 0;
    var j = 25;
    var divRow;
    var dark = true;
    var select=false;
    var nSelect = settings.get('color');
    for (var g in x) {
        for (var r in x) {
            for (var b in x) {
                if (j >= 25)
                {
                    divRow = document.createElement('div');
                    divRow.style.height='20%';
                    divRow.style.width='100%';
                    divMain.appendChild(divRow);
                    j = 0;
                }
                        select = false;
                    if(n==nSelect||!n)
                    {
                        select = true;
                    }
                    divRow.appendChild(new Color(rgb(x[r], x[g], x[b]), dark, callback, select, n).div);
                    n++;
                    j++;
                    if (n > 8)
                    {
                        dark = false;
                    }
            }
        }
    }
    function Color(color, dark, callback, select, n)
    {
        var self = this;
        this.color = color;
        this.div = document.createElement('div');
        this.div.style.position = 'relative';
        this.div.style.height = '12px';
        this.div.style.width = 'calc(4% - 2px)';
        this.div.style.float = 'left';
        this.div.style.border = '1px solid ' + color;
        this.div.style.backgroundColor = color;
        this.div.style.cursor = 'pointer';
        var border;
        if (dark)
        {
            border = '1px solid #ffffff';
        }
        else
        {
            border = '1px solid #000000';
        }
        new HoverAndClick(this.div, function () {
            self.div.style.border = border;
        }, undefined, function () {
            selectColor();
        });
        if (select)
        {
            selectColor();
        }
        function selectColor()
        {
            if (selfColors.selected)
            {
                selfColors.selected.div.style.border = '1px solid ' + selfColors.selected.color;
            }
            selfColors.selected = self;
            self.div.style.border = border;
            if (callback)
            {
                callback(self.color);
            }
            settings.set('color', n);
        }
    }
    this.show = function (bringToFront)
    {
        self.div.style.display = 'inline';
        if(bringToFront)
        {
            Windows.bringToFront(self);
        }
    };
    this.hide = function ()
    {
        self.div.style.display = 'none';
    };
    this.unminimize = function ()
    {
        self.task.unminimize();
    };
    Themes.register({components:[
            {name:'body', elements:[divMain]},
            {name:'text', elements:[divTitle]}
        ],
    callback:function(theme){
        
    }}, undefined);
    Window.style(self.div, divInner, divTab);
    
    var windowInformation = new WindowInformation(false, true, undefined, undefined, undefined, undefined, 0, 100, 0, Windows.maxYPx, false, false, true);
    
    var callbacks = new WindowCallbacks(
                    undefined,
            undefined,
            undefined,
            undefined,
            function(){
        self.task.minimize();}
            , function(zIndex){settings.set("zIndex", zIndex);});
    var params = {obj: this,
        minimized: true,
        divTab: divTab,
        divInner: divInner,
        windowInformation: windowInformation,
        callbacks: callbacks};
    Windows.add(params);
            if(!isMobile)
    divInner.style.position='relative';
    TaskBar.add(this);
}
Colors.getComplementary=function(hex)
{
    // Convert hex to rgb
    // Credit to Denis http://stackoverflow.com/a/36253499/4939630
    var rgb = 'rgb(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length/3 + '})', 'g')).map(function(l) { return parseInt(hex.length%2 ? l+l : l, 16); }).join(',') + ')';

    // Get array of RGB values
    rgb = rgb.replace(/[^\d,]/g, '').split(',');

    var r = rgb[0], g = rgb[1], b = rgb[2];

    // Convert RGB to HSL
    // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2.0;

    if(max == min) {
        h = s = 0;  //achromatic
    } else {
        var d = max - min;
        s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

        if(max == r && g >= b) {
            h = 1.0472 * (g - b) / d ;
        } else if(max == r && g < b) {
            h = 1.0472 * (g - b) / d + 6.2832;
        } else if(max == g) {
            h = 1.0472 * (b - r) / d + 2.0944;
        } else if(max == b) {
            h = 1.0472 * (r - g) / d + 4.1888;
        }
    }

    h = h / 6.2832 * 360.0 + 0;

    // Shift hue to opposite side of wheel and convert to [0-1] value
    h+= 180;
    if (h > 360) { h -= 360; }
    h /= 360;

    // Convert h s and l values into r g and b values
    // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
    if(s === 0){
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    r = Math.round(r * 255);
    g = Math.round(g * 255); 
    b = Math.round(b * 255);

    // Convert r b and g values to hex
    rgb = b | (g << 8) | (r << 16); 
    return "#" + (0x1000000 | rgb).toString(16).substring(1);
};
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Font()
{
    Font.mobileScale=pxToMmRatio/4;
    var settings = new Settings("#font", function () {
        this.set("font");
        //this is a reset function for this particualr instance of this particular class.
    });
    var arrayFonts = ['Andale Mono', 'Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold', 'Avant Garde', 'Baskerville', 'Big Caslon', 'Bodoni MT', 'Book Antiqua', 'Brush Script MT', 'Calibri', 'Calisto MT', 'Cambria', 'Candara', 'Century Gothic', 'Consolas', 'Copperplate', 'Courier New', 'Didot', 'Franklin Gothic Medium', 'Futura', 'Garamond', 'Geneva', 'Georgia', 'Gill Sans', 'Goudy Old Style', 'Helvetica', 'Hoefler Text', 'Impact', 'Lucida Bright', 'Lucida Console', 'Lucida Grande', 'Lucida Sans Typewriter', 'Monaco', 'Optima', 'Palatino', 'Perpetua', 'Papyrus', 'Rockwell', 'Rockwell Extra Bold', 'Segoe UI', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana'];
    this.taskBarInformation = {tooltip: 'Customize your font', icon: ('images/font-icon.gif'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    var self = this;
    this.bold = false;
    this.italic = false;
    this.underline = false;
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divTab = document.createElement('div');
    var divMain = document.createElement('div');
    var selectFamily = document.createElement('select');
    var selectSize = document.createElement('select');
    var divBold = document.createElement('div');
    var imgBold = document.createElement('img');
    var divItalic = document.createElement('div');
    var imgItalic = document.createElement('img');
    var divUnderline = document.createElement('div');
    var imgUnderline = document.createElement('img');
    var divColor = document.createElement('div');
    var imgColor = document.createElement('img');
    for (var i = 0; i < arrayFonts.length; i++)
    {
        var font = arrayFonts[i];
        addOption(selectFamily, font, font).style.fontFamily = font;
    }
    for (var i = 8; i < 17; i++)
    {
        addOption(selectSize, String(i), i);
    }
    var divTitle = document.createElement('div');
    this.div.style.position = 'absolute';
    this.div.style.display = 'none';
    if(!isMobile)
    this.div.style.width='307px';
    divInner.style.height = 'auto';
    divInner.style.border = '1px solid #66a3ff';
    divInner.style.backgroundColor = '#0099ff';
    divInner.style.padding = '0px 3px 3px 3px';
    divInner.style.borderRadius = "5px";
    divInner.style.overflow = 'hidden';
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.height = "20px";
    divTab.style.cursor = 'move';
    divMain.style.float = 'left';
    divMain.style.height = 'auto';
    divMain.style.width = '100%';
    divMain.style.backgroundColor = '#ffffff';
    divMain.style.overflow = 'hidden';
    divMain.style.padding = '1px';
    setDivGenericStyle(divBold);
    divBold.style.border = '1px solid #999999';
    divBold.style.marginRight = '2px';
    verticallyCenter(imgBold);
    imgBold.src = window.thePageUrl+'images/bold.png';
    setDivGenericStyle(divItalic);
    divItalic.style.border = '1px solid #999999';
    divItalic.style.marginRight = '2px';
    verticallyCenter(imgItalic);
    imgItalic.src = window.thePageUrl+'images/italic.png';
    setDivGenericStyle(divUnderline);
    divUnderline.style.border = '1px solid #999999';
    divUnderline.style.marginRight = '2px';
    verticallyCenter(imgUnderline);
    imgUnderline.src = window.thePageUrl+'images/underline.png';
    setDivGenericStyle(divColor);
    divColor.style.marginRight = '2px';
    divColor.style.height = '19px';
    imgColor.src = window.thePageUrl+'images/color_picker.png';
    imgColor.style.height = '100%';
    selectFamily.style.marginLeft = '2px';
    selectFamily.style.marginRight = '2px';
    selectFamily.style.cursor = 'pointer';
    selectFamily.style.float = 'left';
    selectFamily.style.height = '19px';
    selectFamily.value = 'Arial';
    selectSize.style.marginRight = '1px';
    selectSize.style.cursor = 'pointer';
    selectSize.style.float = 'left';
    selectSize.style.height = '19px';
    selectSize.value = '12';
    divTitle.style.float = 'left';
    divTitle.style.paddingLeft = '5px';
    divTitle.style.fontFamily = 'Arial';
    verticallyCenter(divTitle);
    setText(divTitle, "Font");


    this.div.appendChild(divInner);
    divInner.appendChild(divTab);
    divInner.appendChild(divMain);
    divMain.appendChild(selectFamily);
    divMain.appendChild(selectSize);
    divTab.appendChild(divTitle);
    divMain.appendChild(divBold);
    divBold.appendChild(imgBold);
    divMain.appendChild(divItalic);
    divItalic.appendChild(imgItalic);
    divMain.appendChild(divUnderline);
    divUnderline.appendChild(imgUnderline);
    divMain.appendChild(divColor);
    divColor.appendChild(imgColor);



    function addOption(select, name, value)
    {
        var option = document.createElement('option');
        setText(option, name);
        option.value = value;
        select.appendChild(option);
        return option;
    }
    function verticallyCenter(element)
    {
        element.style.position = 'relative';
        element.style.top = '50%';
        element.style.transform = 'translateY(-50%)';
        element.style.msTransform = 'translateY(-50%)';
        element.style.webkitTransform = 'translateY(-50%)';
        element.style.oTransform = 'translateY(-50%)';
    }
    function setDivGenericStyle(button)
    {
        button.style.float = isMobile?'left':'right';
        button.style.border = '0px';
        button.style.backgroundColor = '#dddddd';
        button.style.cursor = 'pointer';
        button.style.fontWeight = '900';
        button.style.fontSize = '12px';
        button.style.height = '18px';
    }
    var colors = new Colors("font-colors", function (color) {
        divColor.style.backgroundColor = color;
        textChanged();
    });
    this.setFont = function (font)
    {
        if (font)
        {
            if (font.size)
            {
                font.size=font.size;
                selectSize.value = String(font.size);
            }
            if (font.family)
            {
                selectFamily.value = font.family;
            }
            setBold(font.bold);
            setItalic(font.italic);
            setUnderline(font.underlined);
            textChanged();
        }
    };
    this.getFont = function ()
    {
        var obj = {};
        obj.size = parseInt(selectSize.value);
        obj.family = selectFamily.value;
        obj.color = colors.getColor();
        obj.bold = self.bold;
        obj.italic = self.italic;
        obj.underlined = self.underline;
        return obj;
    };

    var timerFlash;
    this.flash = function ()
    {
        var flashing = false;
        timerFlash = new Timer(function () {
            if (flashing) {
                styleFromObject(divInner, Themes.theme.components.frame);
                flashing = false;
            } else {
                styleFromObject(divInner, Themes.theme.components.frameFlashing);
                flashing = true;
            }
        }, 50, 6, false);
    };
    this.show = function (bringToFront)
    {
        self.div.style.display = 'inline';
    };
    this.hide = function ()
    {
        self.div.style.display = 'none';
    };
    this.unminimize = function ()
    {
        self.task.unminimize();
        self.flash();
    };
    function textChanged()
    {

        if (self.getFont)
        {
            Font.latest = self.getFont();
            var i = 0;
            while (i < Font.callbacks.length)
            {
                var callback = Font.callbacks[i];
                if (callback)
                {
                    callback(Font.latest);
                    i++;
                }
                else
                {
                    Font.callbacks.splice(i, 1);
                }
            }
            settings.set("font", Font.latest);
        }
    }
    selectSize.onchange = textChanged;
    selectFamily.onchange = textChanged;



    divColor.addEventListener("click", function () {
        colors.show(true);
    });
    new HoverAndClick(divBold, function () {
        divBold.style.backgroundColor = '#e6ffff';
    }, undefined, function () {
        setBold(!self.bold);
        textChanged();
    });
    function setBold(value)
    {
        if (value) {
            divBold.style.border = '1px solid #000000';
            self.bold = true;
        } else {
            divBold.style.border = '1px solid #999999';
            self.bold = false;
        }
    }
    new HoverAndClick(divItalic, function () {
        divItalic.style.backgroundColor = '#e6ffff';
    }, undefined, function () {
        setItalic(!self.italic);
        textChanged();
    });
    function setItalic(value)
    {
        if (value) {
            divItalic.style.border = '1px solid #000000';
            self.italic = true;
        } else {
            divItalic.style.border = '1px solid #999999';
            self.italic = false;
        }
    }
    new HoverAndClick(divUnderline, function () {
        divUnderline.style.backgroundColor = '#e6ffff';
    }, undefined, function () {
        setUnderline(!self.underline);
        textChanged();
    });
    function setUnderline(value)
    {
        if (value) {
            divUnderline.style.border = '1px solid #000000';
            self.underline = true;
        } else {
            divUnderline.style.border = '1px solid #999999';
            self.underline = false;
        }
    }
    new Hover(divColor, function () {
        imgColor.src = window.thePageUrl+'images/color_picker_hover.png';
    }, function () {
        imgColor.src = window.thePageUrl+'images/color_picker.png';
    });
    makeUnselectable(this.div);
    Themes.register({components:[
            {name:'body', elements:[divMain]},
            {name:'text', elements:[divTitle]}
        ],
    callback:function(theme){
        
    }}, undefined);
    Window.style(self.div, divInner, divTab);
    var windowInformation =  new WindowInformation(false, true,undefined, undefined, undefined, undefined, 0, 100, 0, Windows.maxYPx, true,false, true);
    var callbacks=new WindowCallbacks(undefined, undefined,
    function(){
        self.task.minimize(self);}, undefined, function(){
        self.task.minimize(self);}, function(zIndex){settings.set("zIndex", zIndex);});
    var params = {obj: this,
        minimized: true,
        divTab: divTab,
        divInner: divInner,
        windowInformation: windowInformation,
        callbacks: callbacks};
    Windows.add( params);
    if(!isMobile)
    divInner.style.position='relative';
    TaskBar.add(this);
    self.setFont(settings.get("font"));
}
Font.callbacks = [];
Font.addCallback = function (callback)
{
    Font.callbacks.push(callback);
};
Font.removeCallback = function (callback)
{
    var index = Font.callbacks.indexOf(callback);
    if (index > -1)
    {
        Font.callbacks.splice(index, 1);
    }
};
var objectFromXML;
objectFromXML = function( source, includeRoot ) {
      
 function clean(str) {
    return str.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, "");
}
    if( typeof source == 'string' )
    {
        try
        {
            if ( window.DOMParser )
                source = ( new DOMParser() ).parseFromString( source, "application/xml" );
            else if( window.ActiveXObject )
            {
                var xmlObject = new ActiveXObject( "Microsoft.XMLDOM" );
                xmlObject.async = false;
                xmlObject.loadXML( source );
                source = xmlObject;
                xmlObject = undefined;
            }
            else
                throw new Error( "Cannot find an XML parser!" );
        }
        catch( error )
        {
            return false;
        }
    }

    var result = {};

    if( source.nodeType == 9 )
        source = source.firstChild;
    if( !includeRoot )
        source = source.firstChild;

    while( source ) {
        if( source.childNodes.length ) {
            if( source.tagName in result ) {
                if( result[source.tagName].constructor != Array ) 
                    result[source.tagName] = [result[source.tagName]];
                result[source.tagName].push( objectFromXML( source ) );
            }
            else 
                result[source.tagName] = objectFromXML( source );
        } else if( source.tagName )
            result[source.tagName] = source.nodeValue;
        else if( !source.nextSibling ) {
            var cleaned = clean(source.nodeValue);
            if( cleaned != "" ) {
                result = cleaned;
            }
        }
        source = source.nextSibling;
    }
    return result;
};


function Emoticons(xmlString)
{
    var self = this;
    var settings = new Settings("#emoticons", function () {
        this.set("position");
        this.set("size");
        this.set("showing");
        //this is a reset function for this particualr instance of this particular class.
    });
    var minWidth=100;
    var minHeight=100;
    this.taskBarInformation = {tooltip: 'Click emoticons to insert into your current active room', icon: ('images/smiley.png'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var table = document.createElement('table');
    var trTab = document.createElement('tr');
    var tdTab = document.createElement('td');
    var divTab = document.createElement('div');
    var trMain = document.createElement('tr');
    var tdMain = document.createElement('td');
    var divMain = document.createElement('div');
    var divTitle = document.createElement('div');
    var divEmoticons = document.createElement('div');
    this.div.style.position = 'absolute';
    this.div.style.height = '280px';
    this.div.style.width = '410px';
    this.div.style.left = '0px';
    this.div.style.top = '0px';
    makeUnselectable(this.div);
    divInner.style.position='absolute';
    divInner.style.border = '1px solid #66a3ff';
    divInner.style.backgroundColor = '#0099ff';
    divInner.style.padding = '0px 3px 3px 3px';
    divInner.style.borderRadius = "5px";
    divInner.style.overflow = 'hidden';
    table.style.position = 'relative';
    table.style.float = 'left';
    table.style.display = 'table';
    table.style.width = "100%";
    table.style.height = "100%";
    table.style.overflow = 'hidden';
    setTableSkinny(table);
    trTab.style.height = 'auto';
    trMain.style.height = '100%';
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.height = "20px";
    divTab.style.cursor = 'move';
    divTab.style.padLeft = '10px';
    divMain.style.float = 'left';
    divMain.style.height = '100%';
    divMain.style.width = '100%';
    divMain.style.backgroundColor = '#ffffff';
    divMain.style.overflow = 'auto';
    divEmoticons.style.width = '100%';
    divEmoticons.style.position = 'relative';
    divEmoticons.style.float = 'left';
    divEmoticons.style.height = '100px';
    divEmoticons.style.overflow = 'visible';
    divTitle.style.float = 'left';
    divTitle.style.paddingLeft = '5px';
    divTitle.style.fontFamily = 'Arial';
    verticallyCenter(divTitle);
    setText(divTitle, "Emoticons");
    var startPosition = settings.get("position");
    if (startPosition)
    {
        this.div.style.left = String(startPosition[0]) + 'px';
        this.div.style.top = String(startPosition[1]) + 'px';
    }
    var startSize = settings.get("size");
    if (startSize)
    {
        if(startSize[0]<minWidth)
            startSize[0]=minWidth;
        if(startSize[1]<minHeight)
            startSize[1]=minHeight;
        this.div.style.width = String(startSize[0]) + 'px';
        this.div.style.height = String(startSize[1]) + 'px';
    }  var startZIndex = settings.get("zIndex");
        if (startZIndex)
        {
            self.div.style.zIndex=String(startZIndex);
        }
    
    function Emoticon(url, strings)
    {
        var self = this;
        var img = document.createElement('img');
        this.div = document.createElement('div');
        if(isMobile)
            img.style.height = String(6*pxToMmRatio)+'px';
        else
            img.style.height='30px';
        this.div.style.position = 'relative';
        this.div.style.float = 'left';
        this.div.style.height = 'auto';
        this.div.style.width = 'auto';
        this.div.style.cursor = 'pointer';
        new Hover(this.div, function () {
            self.div.style.backgroundColor = '#e6f2ff';
        });
        this.div.appendChild(img);
        this.emoticonString = strings[0].textContent;
        img.src = window.thePageUrl+url;
        img.onclick = function (e) {
            if (Windows.instances)
            {
                for (var i = Windows.instances.length - 2; i < Windows.instances.length; i++)
                {
                    var window = Windows.instances[i];
                    if (window.acceptsEmoticons)
                    {
                        window.insertEmoticon(strings[0]);
                        Windows.bringToFront(window);
                        return;
                    }
                }
            }
        };
    }
    function setTableSkinny(table)
    {
        table.cellSpacing = "0";
        table.cellPadding = "0";
    }
    function verticallyCenter(element)
    {
        element.style.position = 'relative';
        element.style.top = '50%';
        element.style.transform = 'translateY(-50%)';
        element.style.msTransform = 'translateY(-50%)';
        element.style.webkitTransform = 'translateY(-50%)';
        element.style.oTransform = 'translateY(-50%)';
    }


    this.div.appendChild(divInner);
    divInner.appendChild(table);
    table.appendChild(trTab);
    trTab.appendChild(tdTab);
    tdTab.appendChild(divTab);
    divTab.appendChild(divTitle);
    table.appendChild(trMain);
    trMain.appendChild(tdMain);
    tdMain.appendChild(divMain);
    divMain.appendChild(divEmoticons);

    var lookupTree = {};
        var xml = objectFromXML(xmlString, true);
        if (xml.messaging_emoticons)
        {
            if (xml.messaging_emoticons.folder)
            {
                doFolder(xml.messaging_emoticons.folder);
            }
            if (Configuration.allowRude&&xml.messaging_emoticons.folderXXX)
            {
                doFolder(xml.messaging_emoticons.folderXXX);
            }
        }
        var test = "<?xml version='1.0' encoding='UTF-8' ?>";
    function doFolder(folders)
    {
        if (folders.length)
        {
            for (var i = 0; i < folders.length; i++)
            {
                var pathPrefix = 'emoticons/' + folders[i].path + '/';
                doEmoticon(folders[i].emoticon, pathPrefix);
            }
        }
        else
        {
            var pathPrefix = 'emoticons/' + folders.path + '/';
            doEmoticon(folders.emoticon, pathPrefix);
        }
    }
    function doEmoticon(emoticons, pathPrefix)
    {
        if (emoticons.length)
        {
            for (var i = 0; i < emoticons.length; i++)
            {
                var url = pathPrefix + emoticons[i].path;
                doString(emoticons[i].string, url);

            }
        }
        else
        {
            var url = pathPrefix + emoticons.path;
            doString(emoticons.string, url);
        }
    }
    function doString(str, url)
    {
        if (typeof str === 'string')
        {
            mapCharacter(0, str, url, lookupTree);
            divEmoticons.appendChild(new Emoticon(url, [str]).div);
        }
        else
        {
            for (var i = 0; i < str.length; i++)
            {
                mapCharacter(0, str[i], url, lookupTree);
            }
            divEmoticons.appendChild(new Emoticon(url, str).div);

        }
    }
    function mapCharacter(index, string, url, map)
    {
        var map2 = [];
        if (index < string.length)
        {
            var indexN = index + 1;
            if (map[string.charAt(index)] != undefined && map[string.charAt(index)] != null)
            {
                map2 = map[string.charAt(index)];
            }
            else
            {
                map[string.charAt(index)] = map2;
            }
            mapCharacter(indexN, string, url, map2);
        }
        else
        {
            map.url = url;
        }
    }
    this.getLookupTree = function ()
    {
        return lookupTree;
    };
    var timerFlash;
    this.flash = function ()
    {
        var flashing = false;
        timerFlash = new Timer(function () {
            if (flashing) {
                styleFromObject(divInner, Themes.theme.components.frame);
                flashing = false;
            } else {
                styleFromObject(divInner, Themes.theme.components.frameFlashing);
                flashing = true;
            }
        }, 50, 6, false);
    };
    this.show = function ()
    {
        self.div.style.display = 'inline';
        settings.set("showing", true);
    };
    this.hide = function ()
    {
        self.div.style.display = 'none';
        settings.set("showing", false);
    };
    var showing = settings.get("showing");
    if(showing)
    {
        this.show();
    }
    this.unminimize = function ()
    {
        self.task.unminimize();
        self.flash();
    };
    Themes.register({components:[
            {name:'text', elements:[divTitle]}
        ],
    callback:function(theme){
        
    }}, undefined);
    Window.style(self.div, divInner, divTab);
    var windowInformation =  new WindowInformation(true, true,180, 100, 1200, 1200, 0, 100, 0, Windows.maxYPx, true,false, true);
    var callbacks=     new WindowCallbacks(function(){
                settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
                settings.set("size", [self.div.offsetWidth, self.div.offsetHeight]);
            }, function(){
        if(self.div.offsetLeft&&self.div.offsetTop)
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
         },
         
         function(){
        self.task.minimize();},
         undefined,
         function(){
        self.task.minimize();}, function(zIndex){settings.set("zIndex", zIndex);});
    
    var params = {obj: this,
        minimized: true,
        divTab: divTab,
        divInner: divInner,
        windowInformation: windowInformation,
        callbacks: callbacks};
    Windows.add( params);
    TaskBar.add(this);
}
function CreateRoom()
{
    var self = this;
    var timer;
    var callback;
    this.div = document.createElement('div');
    var divName = document.createElement('div');
    var textName = document.createElement('input');
    var divPassword = document.createElement('div');
    var textPassword = document.createElement('input');
    var divButtons = document.createElement('div');
    var buttonCreate = document.createElement('button');
    var buttonCancel = document.createElement('button');
    var divError = document.createElement('div');
    var textError = document.createElement('textarea');
    this.div.style.position = 'fixed';
    this.div.style.height = 'auto';
    this.div.style.width = 'auto';
    this.div.style.top = '50%';
    this.div.style.left = '50%';
    this.div.style.marginLeft = '-100px';
    this.div.style.backgroundColor = '#001f4d';
    this.div.style.border = '1px solid #66a3ff';
    this.div.style.zIndex = '2000';
    this.div.style.padding = '6px';
    this.div.style.borderRadius = '5px';
    divName.style.float='none';
    divPassword.style.float='none';
    divButtons.style.position = 'relative';
    divButtons.style.float = 'none';
    divButtons.style.width = '180px';
    divButtons.style.height = 'auto';
    textName.placeholder = 'Name';
    styleText(textName);
    textPassword.placeholder = 'Password(optional)';
    styleText(textPassword);
    function styleText(text)
    {
        text.type = 'text';
        text.style.position = 'relative';
        text.style.float = 'left';
        text.style.height = '100%';
        text.style.width = '180px';
        text.style.fontSize = '20px';
        text.style.fontFamily = 'Arial';
        text.style.height = '30px';
        text.style.boxSizing = 'border-box';
    }
    
    
    
    buttonCreate.style.height = '30px';
    buttonCreate.style.width='50%';
    buttonCreate.style.fontSize = '20px';
    buttonCreate.style.boxSizing = 'border-box';
    buttonCreate.style.float='left';
    buttonCancel.style.height = '30px';
    buttonCancel.style.width='50%';
    buttonCancel.style.fontSize = '20px';
    buttonCancel.style.boxSizing = 'border-box';
    buttonCancel.style.float='right';
    buttonCancel.style.cursor='pointer';
    buttonCreate.style.cursor='pointer';
    divError.style.position = 'relative';
    divError.style.float = 'left';
    divError.style.width = '180px';
    divError.style.boxSizing = 'border-box';
    divError.style.backgroundColor = '#eeeeee';
    divError.style.fontFamily = 'Arial';
    divError.style.fontSize = '14px';
    divError.style.display='none';
    textError.style.position = 'relative';
    textError.style.width = '100%';
    textError.style.boxSizing = 'border-box';
    textError.style.backgroundColor = 'transparent';
    textError.style.border = '0px';
    textError.style.resize='none';
    textError.style.overflowY='hidden';
    textError.readOnly=true;
    setText(buttonCreate, "Create");
    setText(buttonCancel, "Cancel");
    this.setError = function (error)
    {
        if (error)
        {
            divError.style.display = 'block';
            setText(textError, error);
        }
        else
        {
            divError.style.display = 'none';
        }
    };
    this.setCallback=function(callbackIn)
    {
        callback = callbackIn;
    };
    this.show=function(hasPassword, type)
    {
        self.type=type;
        self.div.style.display='block';
        if(hasPassword)
        {
            divPassword.style.display='block';
        }
        else
        {
            divPassword.style.display='none';
        }
    timer = new Timer(function () {
        if (flashing) {
            self.div.style.backgroundColor = initialBackgroundColor;
            flashing = false;
        } else {
            self.div.style.backgroundColor = '#ccff00';
            flashing = true;
        }
    }, 60, 6);
    };
    this.hide=function()
    {
        self.div.style.display='none';
        textName.value="";
        textPassword.value="";
        divError.style.display='none';
    };
    buttonCreate.onclick = function ()
    {
        doCallback();
    };
    buttonCancel.onclick = function ()
    {
        self.hide();
    };
    addOnKeyDown(textName);
    addOnKeyDown(textPassword);
    function doCallback()
    {
        callback(textName.value, textPassword.value, self.type);
    }
    function addOnKeyDown(text)
    {
    text.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode == 13) {
            try
            {
            doCallback();
        }
        catch(ex){
            console.log(ex);
        }
        }
    };
    }
    textName.addEventListener('click',function()
    {
      textName.focus();  
    });
    textPassword.addEventListener('click',function()
    {
      textPassword.focus();  
    });
    this.div.appendChild(divName);
    divName.appendChild(textName);
    this.div.appendChild(divPassword);
    divPassword.appendChild(textPassword);
    this.div.appendChild(divButtons);
    divButtons.appendChild(buttonCreate);
    divButtons.appendChild(buttonCancel);
    this.div.appendChild(divError);
    divError.appendChild(textError);
    var flashing = false;
    var initialBackgroundColor = self.div.style.backgroundColor;
}
CreateRoom.show = function (callback, hasPassword, type)
{
    if(!CreateRoom.instance)
    {
    CreateRoom.instance = new CreateRoom();
    document.body.appendChild(CreateRoom.instance.div);
    }
    CreateRoom.instance.setCallback(callback);
    CreateRoom.instance.show(hasPassword, type);
};
CreateRoom.hide = function ()
{
    if(CreateRoom.instance)
    {
        CreateRoom.instance.hide();
    }
};
CreateRoom.error = function (message)
{
    if (CreateRoom.instance)
    {
        CreateRoom.instance.setError(message);
    }
};
function PendingMessages(){
    var list = [];
    this.unpendIfPending = function(jObject){
        var iterator = new Iterator(list);
        while(iterator.hasNext()){
            var message = iterator.next();
            if(message.equals(jObject)){
                iterator.remove();
                message.unpend();
                return true;
            }
        }
        return false;
    };
    this.add=function(message){
        list.push(message);
    };
}
function Spinner(name) {
    var self = this;
    if(!name)
        name=2;
    var design = Spinner.designs[name];
    this.div = document.createElement('div');
    this.div.id = design.id;
    this.div.style.position = 'absolute';
    this.div.style.margin = 'auto';
    for (var i = 1; i < 9; i++)
    {
        var div = document.createElement('div');
        div.id = design.childIdPrefix + String(i);
        div.className = design.childClassName;
        this.div.appendChild(div);
    }
    this.show=function()
    {
      self.div.style.display='block';  
    };
    this.hide = function()
    {
      self.div.style.display='none';  
    };
    this.center = function()
    {
    self.div.style.top = 'calc(50% - '+String(self.div.offsetWidth/2)+'px)';
    self.div.style.left = 'calc(50% - '+String(self.div.offsetHeight/2)+'px)';  
    };
}
Spinner.designs = {1: {id: 'floatingCirclesG', childIdPrefix: 'frotateG_', nChildren: 8, childClassName: 'f_circleG'}, 2: {id: 'circularG', childIdPrefix: 'circularG_', nChildren: 8, childClassName: 'circularG'}};
    

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function Menu(menuInformation, parentMenu)
{
    var selfMenu = this;
    var self = this;
    this.parentMenu = parentMenu;
    this.div = document.createElement('div');
    this.div.style.position = 'absolute';
    this.div.style.backgroundColor = '#dddddd';
    this.div.style.border = '1px solid #bbbbbb';
    this.div.style.width = 'auto';
    this.div.style.height = 'auto';
    this.div.style.zIndex = '2500';
    this.div.style.display = 'none';
    this.div.style.verticallyAlign='center';
    var callback;
    var callbackInformation;
    var items = [];
    var children = [];
    this.show = function (x, y, callbackIn, callbackInformationIn, itemConfiguration)
    {
        callback = callbackIn;
        callbackInformation = callbackInformationIn;
        new Task(function(){
        Menu.current = [self];
        console.log('self is: ');
        console.log(self); 
        if (parentMenu)
        {
            self.div.style.zIndex = String(1 + parseInt(parentMenu.div.style.zIndex));
        }
        var parent = parentMenu;
        while (parent)
        {
            Menu.current.push(parent);
            parent = parent.parentMenu;
        }
        if (itemConfiguration)
        {
            configureItems(itemConfiguration);
        }
        self.div.style.left = String(x) + 'px';
        self.div.style.top = String(y) + 'px';
        self.div.style.display = 'block';
    }).run();
    };
    this.hideChildren = function ()
    {
        for (var i = 0; i < children.length; i++)
        {
            children[i].hide();
        }
    };
    this.hide = function ()
    {
        self.div.style.display = 'none';
        self.hideChildren();
    };
    function configureItems(configuration)
    {
        for (var i = 0; i < configuration.length; i++)
        {
            var item = items[i];
            if (configuration[i].name)
            {
                setText(item.divName, configuration[i].name);
            }
            if (configuration[i].display != undefined)
            {
                if (configuration[i].display)
                {
                    item.div.style.display = 'block';
                }
                else
                {
                    item.div.style.display = 'none';
                }
            }
            if(configuration[i].children)
            {
                children[i].configureItems(configuration[i].children);
            }
        }
    }
    this.configureItems = configureItems;
    function Item(information, associatedChildMenu)
    {
        var self = this;
        this.div = document.createElement('div');
        this.div.style.position = 'relative';
        this.div.style.float = 'none';
        this.div.style.height = 'auto';
        this.div.style.cursor = 'pointer';
        this.divName = document.createElement('div');
        this.divName.style.position = 'relative';
        this.divName.style.float = 'left';
        this.divName.style.height = 'auto';
        this.divName.style.width = 'calc(100% - 4px)';
        this.divName.style.padding = '2px';
        this.divName.style.fontFamily = 'Arial';
        setText(this.divName, information.name);
        new Hover(this.divName, function () {
            self.divName.style.backgroundColor = '#eeeeee';
        }, function () {
        });
        this.div.onclick = function (e) {
            if (information.callback)//callback for individual item parsed in when menu created.
            {
                information.callback(callbackInformation, e);
            }
            if (callback)//general callback for all buttons.
            {
                callback(callbackInformation, e);
            }
            selfMenu.hideChildren();
            if (associatedChildMenu)
            {
                var position = getAbsolute(self.divName);
                associatedChildMenu.show(position.left+self.div.offsetWidth, position.top);
            }
            else
            {
                Menu.hide();
            }
        };
        this.div.appendChild(this.divName);
        items.push(this);
    }
    function setTableSkinny(table)
    {
        table.cellSpacing = "0";
        table.cellPadding = "0";
    }
    for (var i = 0; i < menuInformation.options.length; i++)
    {
        var option = menuInformation.options[i];
        if (option.options)
        {
            var menu = new Menu(option, self);
            children.push(menu);
        }
        self.div.appendChild(new Item(option, menu).div);

    }
    document.body.appendChild(this.div);
}
Menu.hide=function()
{
        Menu.current[Menu.current.length-1].hide();
        Menu.current=undefined;
};
document.documentElement.addEventListener("mousedown", function (e) {
    if (!e)
        var e = window.event;
    if (Menu.current) {
        while(Menu.current.length>0)
        {
            var p = getAbsolute(Menu.current[0].div);
            if ((p.left < e.pageX) && (Menu.current[0].div.offsetWidth + p.left >= e.pageX) && (p.top < e.pageY) && (p.top + Menu.current[0].div.offsetHeight >= e.pageY)) {
                break;
            }
            else
            {
              Menu.current[0].hide();
              Menu.current.splice(0, 1);
            }
        }
    }
});

function MenuBar(menuInformation, menuOffsets)
{
    var self = this;
    var selfMenuBar = this;
    this.div = document.createElement('div');
    this.div.style.position = 'relative';
    this.div.style.width = '100%';
    this.div.style.height = 'auto';
    this.div.style.backgroundColor='#eeeeee';
    this.div.style.float='left';
    var items = [];
    var children = [];
    var callback;
    var callbackInformation;
    this.hideChildren = function ()
    {
        for (var i = 0; i < children.length; i++)
        {
            children[i].hide();
        }
    };
    this.hide=function()
    {
        self.hideChildren();
    };
    this.set = function (itemConfiguration, callbackIn, callbackInformationIn)
    {
        if (callbackIn)
        {
            callback = callbackIn;
        }
        if (callbackInformationIn)
        {
            callbackInformation = callbackInformationIn;
        }
        if(itemConfiguration)
        {
            configureItems(itemConfiguration);
        }
    };
    function configureItems(configuration)
    {
        for (var i = 0; i < configuration.length; i++)
        {
            var item = items[i];
            if (configuration[i].name)
            {
                setText(item.divName, configuration[i].name);
            }
            if (configuration[i].display != undefined)
            {
                if (configuration[i].display)
                {
                    item.div.style.display = 'block';
                }
                else
                {
                    item.div.style.display = 'none';
                }
            }
            if(configuration[i].children)
            {
                children[i].configureItems(configuration[i].children);
            }
        }
    }
    function Item(information, associatedChildMenu)
    {
        var self = this;
        this.div = document.createElement('div');
        this.div.style.position = 'relative';
        this.div.style.float = 'left';
        this.div.style.height = 'auto';
        this.div.style.cursor = 'pointer';
        this.div.style.margin='1px';
        this.div.style.border='1px solid #eeeeee';
        this.divName = document.createElement('div');
        this.divName.style.float='left';
        this.divName.style.position = 'relative';
        this.divName.style.height = 'auto';
        this.divName.style.width = 'auto';
        this.divName.style.margin = '1px';
        this.divName.style.fontFamily = 'Arial';
        this.divName.style.fontSize='12px';
        this.divName.style.fontWeight='bold';
        setText(this.divName, information.name);
        new Hover(this.div, function () {
            self.div.style.backgroundColor = 'rgba(26,209,255, 0.4)';
            self.div.style.border='1px solid #008fb3';
        }, function () {
        });
        this.div.onclick = function (e) {
            if (information.callback)//callback for individual item parsed in when menu created.
            {
                information.callback(callbackInformation, e);
            }
            if (callback)//general callback for all buttons.
            {
                callback(callbackInformation, e);
            }
            selfMenuBar.hideChildren();
            if (associatedChildMenu)
            {
                var position = getAbsolute(self.div);
                var left=position.left;
                var top = position.top+selfMenuBar.div.offsetHeight;
                if(menuOffsets)
                {
                    if(menuOffsets.top)
                    {
                        left+=menuOffsets.left;
                    }
                    if(menuOffsets)
                    {
                        top+=menuOffsets.top;
                    }
                }
                associatedChildMenu.show(left, top);
            }
        };
        this.div.appendChild(this.divName);
        items.push(this);
    }
    function verticallyCenter(element)
    {
        element.style.position = 'relative';
        element.style.top = '50%';
        element.style.transform = 'translateY(-50%)';
        element.style.msTransform = 'translateY(-50%)';
        element.style.webkitTransform = 'translateY(-50%)';
        element.style.oTransform = 'translateY(-50%)';
    }
    for (var i = 0; i < menuInformation.options.length; i++)
    {
        var option = menuInformation.options[i];
        var menu=undefined;
        if (option.options&&option.options.length>0)
        {
            menu = new Menu(option, self);
            children.push(menu);
        }
        this.div.appendChild(new Item(option, menu).div);

    }
}
function ThemePicker()
{
    var self = this;
    var settings = new Settings("#themes", function () {
        this.set("position");
        this.set("size");
        this.set("showing");
        this.set("theme");
        //this is a reset function for this particualr instance of this particular class.
    });
    var minWidth = 200;
    var minHeight = 100;
    var currentStyle = settings.get("theme");
    if (currentStyle)
    {
        Themes.restyle(currentStyle);
    }
    else
    {
        Themes.restyle('Dark');
    }
    this.type = 'Themes';
    this.taskBarInformation = {tooltip: 'Choose a custom style', icon: ('images/themes-icon.gif'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var divMain = document.createElement('div');
    this.div.style.position = "absolute";
    this.div.style.width = '200px';
    this.div.style.height = '400px';
    this.div.style.top = '40px';
    this.div.style.left = '450px';
    divInner.style.position = 'absolute';
    divInner.style.border = '1px solid #66a3ff';
    divInner.style.backgroundColor = '#0099ff';
    divInner.style.padding = '0px 3px 3px 3px';
    divInner.style.borderRadius = "5px";
    divInner.style.overflow = 'hidden';
    var startPosition = settings.get("position");
    if (startPosition)
    {
        this.div.style.left = String(startPosition[0]) + 'px';
        this.div.style.top = String(startPosition[1]) + 'px';
    }
    var startSize = settings.get("size");
    if (startSize)
    {
        if (startSize[0] < minWidth)
            startSize[0] = minWidth;
        if (startSize[1] < minHeight)
            startSize[1] = minHeight;
        this.div.style.width = String(startSize[0]) + 'px';
        this.div.style.height = String(startSize[1]) + 'px';
    }
    var startZIndex = settings.get("zIndex");
    if (startZIndex)
    {
        self.div.style.zIndex = String(startZIndex);
    }

    var menuBar = new MenuBar({options: [/*{name: 'Add', options: [{name: 'Text room', callback: function () {
     CreateRoom.show(createRoom, true, Room.Type.dynamic);
     }}, {name: 'Video room', callback: function () {
     CreateRoom.show(createRoom, true, Room.Type.videoDynamic);
     }}]}*/]}, {left: 0, top: -2});
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.height = "20px";
    divTab.style.cursor = 'move';
    divTab.style.padLeft = '10px';
    divName.style.float = 'left';
    divName.style.paddingLeft = '5px';
    divName.style.fontFamily = 'Arial';
    verticallyCenter(divName);
    setText(divName, "Themes");
    divMain.style.backgroundColor = '#555555';
    divMain.style.position = 'relative';
    divMain.style.float = 'left';
    divMain.style.height = 'calc(100% - 20px)';
    divMain.style.width = "100%";
    divMain.style.overflowY = 'auto';
    for (var i in Themes.themes)
    {
        var themeEntry = new ThemeEntry(i);
        divMain.appendChild(themeEntry.div);
    }
    function ThemeEntry(name)
    {
        var self = this;
        this.div = document.createElement('div');
        var divName = document.createElement('div');
        this.div.style.position = 'relative';
        this.div.style.height = '30px';
        this.div.style.width = '100%';
        this.div.style.backgroundColor = '#f0f0f0';
        this.div.style.cursor = 'pointer';
        this.div.style.float = 'left';
        this.div.style.border = '1px solid #4d0026';
        this.div.style.borderRadius = '5px';
        this.div.style.left = '-1px';
        this.div.style.marginLeft = '2px';
        this.div.style.marginTop = '1px';
        this.div.style.overflow = 'hidden';
        this.div.style.width = 'calc(100% - 6px)';
        this.div.style.paddingLeft = '2px';
        divName.style.float = 'left';
        divName.style.fontFamily = 'Arial';
        divName.style.height = '19px';
        divName.style.paddingLeft = '0px';
        divName.style.textOverflow = 'ellipsis';
        divName.style.overflow = 'hidden';
        divName.style.whiteSpace = 'nowrap';
        divName.style.width = '100%';
        divName.style.width = 'calc(100% - 28px)';
        verticallyCenter(divName);
        setText(divName, name);
        this.div.appendChild(divName);
        new Hover(this.div, function () {
            self.div.style.backgroundColor = '#fdfdfe';
        }, function () {
        });
        this.div.onmousedown = function ()
        {
            Themes.restyle(name);
            settings.set("theme", name);
        };
    }
    function verticallyCenter(element)
    {
        element.style.position = 'relative';
        element.style.top = '50%';
        element.style.transform = 'translateY(-50%)';
        element.style.msTransform = 'translateY(-50%)';
        element.style.webkitTransform = 'translateY(-50%)';
        element.style.oTransform = 'translateY(-50%)';
    }
    this.div.appendChild(divInner);
    divInner.appendChild(divTab);
    divTab.appendChild(divName);
    divInner.appendChild(menuBar.div);
    divInner.appendChild(divMain);
    this.show = function ()
    {
        self.div.style.display = 'inline';
        settings.set("showing", true);
    };
    this.hide = function ()
    {
        self.div.style.display = 'none';
        settings.set("showing", false);
    };
    var showing = settings.get("showing");
    if (showing)
    {
        this.show();
    }
    else
    {
        if (showing == false)
        {
            this.hide();
        }
    }
    makeUnselectable(this.div);
    Themes.register({components: [
            {name: 'body', elements: [divMain]},
            {name: 'text', elements: [divName]}
        ],
        callback: function (theme) {

        }}, undefined);
    Window.style(self.div, divInner, divTab);

    var windowInformation = new WindowInformation(true, true, 200, 100, 199, Windows.maxHeightPx, 0, 100, 0, Windows.maxYPx, true, false, true);
    var callbacks = new WindowCallbacks(function () {
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
        settings.set("size", [200, self.div.offsetHeight]);
    }, function () {
        if (self.div.offsetLeft && self.div.offsetTop)
            settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
    },
    function(){
        self.task.minimize();},
    undefined,
    function(){
        self.task.minimize();},
            function (zIndex) {
                settings.set("zIndex", zIndex);
            });
    var params = {obj: this,
        minimized: false,
        divTab: divTab,
        divInner: divInner,
        windowInformation: windowInformation,
        callbacks: callbacks};
    Windows.add(params);
    TaskBar.add(this);
}
function OptionPane(parent)
{
    var self = this;
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divText = document.createElement('div');
    var tableButtons = document.createElement('table');
    var tableButtonsRow = document.createElement('tr');
    var buttonClose = new Window.CloseButton(function(){
        if (self.functClose != undefined)
        {
            self.functClose();
        }
        self.hide();});
    var divTop = document.createElement('div');
    var divTop = document.createElement('div');
    this.div.style.height = 'auto';
    this.div.style.width = 'auto';
    this.div.style.top = '50%';
    this.div.style.left = '50%';
    this.div.style.backgroundColor = '#C70039';
    this.div.style.borderRadius = '6px';
    this.div.style.overflow = 'hidden';
    this.div.style.zIndex = '2400';
    this.div.style.display = 'none';
    this.div.style.border = '1px solid #900C3F';
    this.div.style.padding='0px 3px 3px 3px';
    divText.style.float = 'top';
    divText.style.backgroundColor = '#eeeeee';
    divText.style.color = '#000000';
    divText.style.fontFamily = 'Arial';
    divText.style.fontWeight = 'bold';
    divText.style.padding = '2px';
    divText.style.marginTop = '20px';
    tableButtons.style.float = 'bottom';
    tableButtons.style.position = 'relative';
    tableButtons.style.width = '100%';
    divTop.style.position = 'absolute';
    divTop.style.height = '20px';
    divTop.style.width = '100%';
    divTop.style.top = '0px';
    divTop.style.left = '0px';
    divTop.style.fontWeight = 'bold';
    this.div.appendChild(divTop);
    divTop.appendChild(buttonClose.button);
    this.div.appendChild(divText);
    this.div.appendChild(tableButtons);
    tableButtons.appendChild(tableButtonsRow);
    setTableSkinny(tableButtons);
    if (!parent)
    {
        this.div.style.position = 'fixed';
        document.body.appendChild(this.div);
    }
    else
    {
        this.div.style.position = 'absolute';
        parent.appendChild(this.div);
    }
    this.hide = function ()
    {
        self.div.style.display = 'none';
    };
    this.show = function (listButtonNameToFunction, text, functClose)
    {
        while (tableButtonsRow.firstChild) {
            tableButtonsRow.removeChild(tableButtonsRow.firstChild);
        }
        self.functClose = functClose;
        divText.textContent = text;
        for (var i in listButtonNameToFunction)
        {
            var pair = listButtonNameToFunction[i];
            var button = document.createElement('button');
            button.textContent = pair[0];
            button.style.width = '100%';
            button.style.cursor = 'pointer';
            button.style.borderRadius = '3px';
            button.style.border = '1px solid #000000';
            button.style.fontWeight = 'bold';
            button.style.margin = '0px';
            button.addEventListener('click', pair[1], false);
            button.addEventListener('click', self.hide, false);
            var tableColumn = document.createElement('td');
            tableButtonsRow.appendChild(tableColumn);
            tableColumn.appendChild(button);
        }
        self.div.style.display = 'block';
        self.div.style.left='50%';
        self.div.style.top='50%';
        self.div.style.marginLeft = '-'+String(self.div.offsetWidth/2) + 'px';
        self.div.style.marginTop ='-'+String(self.div.offsetHeight / 2) + 'px';
    };
    function setTableSkinny(table)
    {
        table.cellSpacing = "0";
        table.cellPadding = "0";
    }
}


function Contact()
{
    var self = this;
    var settings = new Settings("#Contact", function () {
        this.set("position");
        this.set("showing");
        this.set("size");
        //this is a reset function for this particualr instance of this particular class.
    });
    this.type = 'Contact';
    this.taskBarInformation = {tooltip: 'Contact the site creator', icon: ('images/email.png'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var divMain = document.createElement('div');
    var textContactEmail = document.createElement('input');
    var textContactName = document.createElement('input');
    var textContactPhone = document.createElement('input');
    var textContactSubject = document.createElement('input');
    var textareaContactMessage = document.createElement('textarea');
    var buttonSend = document.createElement('button');
    var imgSendSuccessful = document.createElement('img');
    imgSendSuccessful.src=window.thePageUrl+'images/tick.png';
    imgSendSuccessful.style.height='19px';
    imgSendSuccessful.style.float='right';
    imgSendSuccessful.style.position='relative';
    imgSendSuccessful.style.top='-1px';
    imgSendSuccessful.style.display='none';
    buttonSend.style.overflow='hidden';
    buttonSend.style.height='20px';
    
    function setLayoutStyle(element, placeholder)
    {
    element.style.width='100%';
    element.style.position='relative';
    element.style.float='left';
    element.placeholder=placeholder;
    element.style.marginTop='3px';
    }
    this.div.style.position = "absolute";
    this.div.style.width = '300px';
    this.div.style.height = '300px';
    this.div.style.top = '300px';
    this.div.style.left = '220px';
    this.div.style.overflowY='hidden';
    divInner.style.position = 'absolute';
    divInner.style.border = '1px solid #66a3ff';
    //divInner.style.border = '3px solid #0099ff';
    divInner.style.backgroundColor = '#0099ff';
    divInner.style.padding = '0px 3px 3px 3px';
    divInner.style.borderRadius = "5px";
    divInner.style.overflow = 'hidden';
    divTab.style.height = "20px";
    divMain.style.width = "100%";
    divMain.style.height = "calc(100% - 20px)";
    divMain.style.backgroundColor = '#555555';
    divMain.style.overflow='hidden';
    setLayoutStyle(textContactEmail, 'Email');
    setLayoutStyle(textContactName, 'Name');
    setLayoutStyle(textContactPhone, 'Phone');
    setLayoutStyle(textContactSubject, 'Subject');
    setLayoutStyle(textareaContactMessage, 'Message');
    setLayoutStyle(buttonSend);
    buttonSend.style.cursor='pointer';
    setText(buttonSend,'Submit');
    textareaContactMessage.style.height='calc(100% - 125px)';
    this.div.style.display = 'none';
    setText(divName, "Contact site creator/owner");
    var startPosition = settings.get("position");
    if (startPosition)
    {
        this.div.style.left = String(startPosition[0]) + 'px';
        this.div.style.top = String(startPosition[1]) + 'px';
    }
    //var startSize = settings.get("size");
    //if (startSize)
    //{
    //    this.div.style.width = String(startSize[0]) + 'px';
    //    this.div.style.height = String(startSize[1]) + 'px';
    //}
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.cursor = 'move';
    divTab.style.padLeft = '10px';
    divTab.className = 'div-room-class';
    divName.style.float = 'left';
    divName.style.paddingLeft = '5px';
    divName.style.fontFamily = 'Arial';
    divName.style.fontSize = '12px';
    verticallyCenter(divName);
    divMain.style.position = 'relative';
    divMain.style.float = 'left';
    divMain.style.overflowY='hidden';
    var spinner = new Spinner();
    spinner.div.style.bottom='40px';
    spinner.div.style.left='calc(50% - 27px)';
    spinner.hide();
    function verticallyCenter(element)
    {
        element.style.position = 'relative';
        element.style.top = '50%';
        element.style.transform = 'translateY(-50%)';
        element.style.msTransform = 'translateY(-50%)';
        element.style.webkitTransform = 'translateY(-50%)';
        element.style.oTransform = 'translateY(-50%)';
    }
    function setButtonGenericStyle(button)
    {
        button.style.float = 'right';
        button.style.border = '0px';
        button.style.backgroundColor = 'transparent';
        button.style.cursor = 'pointer';
        button.style.fontWeight = '900';
        button.style.fontSize = '14px';
    }
    this.div.appendChild(divInner);
    divInner.appendChild(divTab);
    divTab.appendChild(divName);
    divInner.appendChild(divMain);
    divMain.appendChild(textContactEmail);
    divMain.appendChild(textContactName);
    divMain.appendChild(textContactPhone);
    divMain.appendChild(textContactSubject);
    divMain.appendChild(textareaContactMessage);
    divMain.appendChild(buttonSend);
    buttonSend.appendChild(imgSendSuccessful);
    divMain.appendChild(spinner.div);
    var optionPane;
    function setErrorMessage(message)
    {
        if(!optionPane)
        {
            optionPane = new OptionPane(document.documentElement);
        }
        optionPane.show([['Ok', function () {
                    }]], message, function () {
            });
    }
    function setSent()
    {
        imgSendSuccessful.style.display='inline';
        new Timer(function(){self.task.minimize();}, 1200, 1, false);
    }
buttonSend.onclick=function()
{
    var jObject={};
    jObject.email=textContactEmail.value;
    jObject.name=textContactName.value;
    jObject.phone=textContactPhone.value;
    jObject.subject=textContactSubject.value;
    jObject.message=textareaContactMessage.value;
    var str = btoa(JSON.stringify(jObject));
    spinner.show();
    httpPostAsynchronous(window.thePageUrl+'ServletContact', function( reply ){
        spinner.hide();
        var jObjectReply = JSON.parse(atob(reply));
        if(jObjectReply.success)
        {
            setSent();
        }
        else {
            setErrorMessage(jObjectReply.message);
        }
    }, str);
};

    var timerFlash;
    this.flash = function ()
    {
        var flashing = false;
        timerFlash = new Timer(function () {
            if (flashing) {
                styleFromObject(divInner, Themes.theme.components.frame);
                flashing = false;
            } else {
                styleFromObject(divInner, Themes.theme.components.frameFlashing);
                flashing = true;
            }
        }, 50, 6);
    };
    this.show = function ()
    {
        self.div.style.display = 'inline';
        settings.set("showing", true);
        self.flash();
    };
    this.hide = function ()
    {
        self.div.style.display = 'none';
        settings.set("showing", false);
    };
    var showing = settings.get("showing");
    if (showing)
    {
        //this.show();
    } else
    {
        this.hide();
    }
    

        Themes.register({components: [
                {name: 'body', elements: [divMain]},
                {name: 'text', elements: [divName]}
            ],
            callback: function (theme) {

            }}, undefined);
    Window.style(self.div, divInner, divTab);
    
    var windowInformation = new WindowInformation(true, true,200, 150, 400, 400, 0, 100, 0, Windows.maxYPx, true,false, true);
        var callbacks= new WindowCallbacks(function(){
                    settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
                    settings.set("size", [200, self.div.offsetHeight]);
            }, function(){
            if (self.div.offsetLeft && self.div.offsetTop)
                settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
         },
    function(){
        self.task.minimize();}, undefined,
    function(){
        self.task.minimize();},
    function(zIndex){settings.set("zIndex", zIndex);});
    var params = {obj: this,
        minimized: true,
        divTab: divTab,
        divInner: divInner,
        windowInformation: windowInformation,
        callbacks: callbacks};
    Windows.add( params);
        TaskBar.add(this);
    makeUnselectable(this.div);
}

function VolumeSlider(callback) {
    var self = this;
    this.div = document.createElement('div');
    var divInternal = document.createElement('div');
    var divSlider = document.createElement('div');
    var divInner = document.createElement('div');
    this.div.style.position = 'relative';
    this.div.style.width = '130px';
    this.div.style.height = '37px';
    this.div.style.paddingRight = '18px';
    divInner.style.position = 'absolute';
    divInner.style.width = '131px';
    divInner.style.height = '2px';
    divInner.style.borderRadius = '13px';
    divInner.style.border = '2px solid #aaaaaa';
    divInner.style.marginLeft = '6px';
    divInner.style.bottom = '6px';
    divInner.style.left = '4px';
    divInternal.style.position = 'relative';
    divInternal.style.left = '-8px';
    divInternal.style.width = '100%';
    divInternal.style.height = '2px';
    makeUnselectable(divInternal);
    divSlider.style.position = 'absolute';
    divSlider.style.height = '18px';
    divSlider.style.width = '18px';
    divSlider.style.borderRadius = '9px';
    divSlider.style.right = '0px';
    divSlider.style.bottom = '-7px';
    divSlider.style.zIndex = '25';
    divSlider.style.backgroundColor = '#ffffff';
    divSlider.style.cursor = 'pointer';
    divSlider.style.zIndex = '10';
    this.div.appendChild(divInner);
    divInner.appendChild(divInternal);
    divInternal.appendChild(divSlider);
    var height = 6;
    var left = 8;
    var arrayDivs = [];
    for (var i = 0; i < 20; i++)
    {
        var div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.marginRight = '3px';
        div.style.backgroundColor = '#cccccc';
        div.style.height = String(height) + 'px';
        height++;
        div.style.width = '5px';
        div.style.left = String(left) + 'px';
        left = left + 7;
        div.style.bottom = '14px';
        self.div.appendChild(div);
        arrayDivs.push(div);
    }
    function setText(div, text)
    {
        if (div.innerText)
        {
            div.innerText = text;
        }
        else
        {
            div.textContent = text;
        }
    }
    function makeUnselectable(node) {
        if (node.nodeType == 1) {
            node.setAttribute("unselectable", "on");
        }
        var child = node.firstChild;
        while (child) {
            makeUnselectable(child);
            child = child.nextSibling;
        }
    }
    function verticallyCenter(element)
    {
        element.style.position = 'relative';
        element.style.top = '50%';
        element.style.transform = 'translateY(-50%)';
        element.style.msTransform = 'translateY(-50%)';
        element.style.webkitTransform = 'translateY(-50%)';
        element.style.oTransform = 'translateY(-50%)';
    }
    var state=0;
    var start;
    var efficientMovingCycle = new EfficientMovingCycle(divSlider);
    function onmousedown(pageX, pageY) {
        if (divSlider.style.display === "none")
        {
            return;
        }
        if (!e)
            var e = window.event;
        start = [divSlider.offsetLeft - pageX, divSlider.offsetTop - pageY];
        state = 1;
    };
    function onmousemove(pageX, pageY) {
        if (state == 1) {
            drag((start[0] + pageX), (start[1] + pageY));
        }
    };
    if(!isMobile)
    {
    efficientMovingCycle.onmousedown = function(e){ onmousedown(e.pageX, e.pageY);};
    efficientMovingCycle.onmousemove=function(e){onmousemove(e.pageX, e.pageY);};
    efficientMovingCycle.onmouseup=function(){
        state = 0;
    };
    }
    else
    {
    efficientMovingCycle.ontouchstart = function(e){ onmousedown(e.changedTouches[0].pageX, e.changedTouches[0].pageY);};
    efficientMovingCycle.ontouchmove = function(e){ onmousemove(e.changedTouches[0].pageX, e.changedTouches[0].pageY);};
    efficientMovingCycle.ontouchend=function(){
        state = 0;
    };
    }
    var left;
    var percent;
    this.getPercentage = function ()
    {
        return((left * 100) / divInternal.clientWidth) | 0;
    };
    var timerCallback;
    var drag = function (x, y)
    {
        var maxLeft = divInternal.clientWidth;
        left = x;
        if (left > maxLeft)
        {
            left = maxLeft;
        }
        else
        {
            if (left < 0)
            {
                left = 0;
            }
        }
        divSlider.style.left = String(left) + 'px';
        percent = self.getPercentage();
        var i = 0;
        while (i < (percent / 5) | 0)
        {
            arrayDivs[i].style.backgroundColor = '#cccccc';
            i++;
        }
        while (i < arrayDivs.length)
        {
            arrayDivs[i].style.backgroundColor = '#999999';
            i++;
        }
        if (!timerCallback)
        {
            timerCallback = new Timer(function () {

                if (callback)
                {
                    try
                    {
                        callback(percent);
                    }
                    catch (ex)
                    {
                        console.log(ex);
                    }
                }
            }, 300, 1);
        }
        else
        {
            timerCallback.reset();
        }
    };
    this.setVolume=function(percentage)
    {
        left=(percentage*divInternal.clientWidth)/100;
        drag(left , 0);
    };
}
function Radio(xmlString)
{
    var self = this;
    var playing = true;
    var settings = new Settings("#radio", function () {
        this.set("position");
        this.set("showing");
        this.set("channel");
        this.set("volume");
        this.set("play");
        //this is a reset function for this particualr instance of this particular class.
    });
    var minWidth=390;
    var minHeight=80;
    this.type = 'Radio';
    this.taskBarInformation = {tooltip:'Radio', icon: ('images/Red-Radio-icon.png'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var divMain = document.createElement('div');
    var divControls = document.createElement('div');
    var divRun = document.createElement('div');
    var imgRun = document.createElement('img');
    var volumeSlider = new VolumeSlider(function (percent) {
        audio.volume=(percent/100);
        settings.set("volume", percent);
    });
    var selectChannel = document.createElement('select');
    this.div.style.position = "absolute";
    this.div.style.width = '390px';
    this.div.style.height = '80px';
    this.div.style.top = '300px';
    this.div.style.left = '360px';
    this.div.style.overflow='hidden';
    divInner.style.position='absolute';
    divInner.style.border = '1px solid #66a3ff';
    divInner.style.backgroundColor = '#0099ff';
    divInner.style.padding = '0px 3px 3px 3px';
    divInner.style.borderRadius = "5px";
    divInner.style.overflow = 'hidden';
    var startPosition = settings.get("position");
    if (startPosition)
    {
        this.div.style.left = String(startPosition[0]) + 'px';
        this.div.style.top = String(startPosition[1]) + 'px';
    }
    var startSize = settings.get("size");
    if (startSize)
    {
        if(startSize[0]<minWidth)
            startSize[0]=minWidth;
        if(startSize[1]<minHeight)
            startSize[1]=minHeight;
        this.div.style.width = String(startSize[0]) + 'px';
        this.div.style.height = '80px';
    }  var startZIndex = settings.get("zIndex");
        if (startZIndex)
        {
            self.div.style.zIndex=String(startZIndex);
        }
    
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.height = "20px";
    divTab.style.cursor = 'move';
    divTab.style.padLeft = '10px';
    divName.style.float = 'left';
    divName.style.paddingLeft = '5px';
    divName.style.fontFamily = 'Arial';
    verticallyCenter(divName);
    setText(divName, "Radio");
    divMain.style.backgroundColor = '#555555';
    divMain.style.position = 'relative';
    divMain.style.float = 'left';
    divMain.style.height = 'calc(100% - 20px)';
    divMain.style.width = "100%";
    divMain.style.overflow = 'hidden';
    divControls.style.height = '44px';
    divControls.style.width = '100%';
    divControls.style.marginTop = '6px';
    divRun.style.cursor = 'pointer';
    divRun.style.height = '40px';
    divRun.style.float = 'left';
    volumeSlider.div.style.float = 'left';
    selectChannel.style.float = 'lect';
    selectChannel.style.margin = '2px';
    selectChannel.style.marginLeft = '20px';
    verticallyCenter(divRun);
    verticallyCenter(imgRun);
    verticallyCenter(volumeSlider.div);
    verticallyCenter(selectChannel);
    new HoverAndClick(divRun, function () {
        if (playing)
        {
            imgRun.src = window.thePageUrl+'images/button_stop_blue.png';
        }
        else
        {
            imgRun.src = window.thePageUrl+'images/button_play_blue.png';
        }
    }, function () {
        setButtonPlaying();
    }, function () {
        playing = !playing;
        setButtonPlaying();
        setPlaying();
    });
    var audio = document.createElement("audio");
    audio.preload = "auto";
    var source = document.createElement('source');
    audio.appendChild(source);
    function load()
    {
        source.src = selectChannel.value;
        audio.load();
        if(playing)
        {
            play();
        }
    }
    function play()
    {
        audio.play();
    }
    function stop()
    {
        audio.pause();
    }
    function setPlaying()
    {
        if (playing)
        {
            settings.set("playing", true);
            play();
        }
        else
        {
            settings.set("playing", false);
            stop();
        }
    }
    function setButtonPlaying()
    {
        if (playing)
        {
            imgRun.src = window.thePageUrl+'images/button_grey_stop.png';
        }
        else
        {
            imgRun.src = window.thePageUrl+'images/button_grey_play.png';
        }
    }
    selectChannel.onchange = function()
    {
        load();
        settings.set("channel", selectChannel.value);
    };
        var xml = objectFromXML(xmlString, true);
        if (xml.channels)
        {
            if (xml.channels.channel)
            {
                doChannel(xml.channels.channel);
                var channel = settings.get("channel");
                if(channel)
                {
                    selectChannel.value=channel;
                }
                var _playing=settings.get("playing");
                if(_playing!=undefined)
                {
                    if(!_playing)
                    {
                        playing=false;
                    }
                }
                setButtonPlaying();
                load();
                setPlaying();
            }
        }
    function doChannel(channel)
    {
        if (channel.length)
        {
            for (var i = 0; i < channel.length; i++)
            {
                var url = channel[i].url;
                var name = channel[i].name;
                var option = document.createElement('option');
                option.value = url;
                setText(option, name);
                selectChannel.appendChild(option);
            }
        }
        else
        {
            var url = channel.url;
            var name = channel.name;
            var option = document.createElement('option');
            option.value = url;
            setText(option, name);
            selectChannel.appendChild(option);
        }
    }
    function verticallyCenter(element)
    {
        element.style.position = 'relative';
        element.style.top = '50%';
        element.style.transform = 'translateY(-50%)';
        element.style.msTransform = 'translateY(-50%)';
        element.style.webkitTransform = 'translateY(-50%)';
        element.style.oTransform = 'translateY(-50%)';
    }
    function setTableSkinny(table)
    {
        table.cellSpacing = "0";
        table.cellPadding = "0";
    }
    this.div.appendChild(divInner);
    divInner.appendChild(divTab);
    divTab.appendChild(divName);
    divInner.appendChild(divMain);
    divMain.appendChild(divControls);
    divControls.appendChild(divRun);
    divRun.appendChild(imgRun);
    divControls.appendChild(volumeSlider.div);
    divControls.appendChild(selectChannel);
    this.show = function ()
    {
        self.div.style.display = 'inline';
        settings.set("showing", true);
    };
    var showing = settings.get("showing");
    if(showing)
    {
        this.show();
    }
    this.hide = function ()
    {
        self.div.style.display = 'none';
        settings.set("showing", false);
    };
    makeUnselectable(this.div);
    Themes.register({components:[
            {name:'body', elements:[divMain]},
            {name:'text', elements:[divName]}
        ],
    callback:function(theme){
        
    }}, undefined);
    Window.style(self.div, divInner, divTab);
    var windowInformation =new WindowInformation(false, true, 390, 80, 390, 80, 0, 100, 0, Windows.maxYPx, true, false, true);
         var windowCallbacks = new WindowCallbacks(function(){
                settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
                settings.set("size", [390, self.div.offsetHeight]);
            }, function(){
        if(self.div.offsetLeft&&self.div.offsetTop)
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
         },
         function(){
        self.task.minimize();}, undefined, function(){
        self.task.minimize();}, function(zIndex){settings.set("zIndex", zIndex);});
    var  params = {obj: this,
        minimized: false,
        divTab: divTab,
        divInner: divInner,
        windowInformation: windowInformation,
        callbacks: windowCallbacks};
    Windows.add( params);
    TaskBar.add(this);
    var volume =settings.get("volume");
    if(volume)
    {
        volumeSlider.setVolume(volume);
    }
}
function Activity(callbackBeenActive, callbackGetReference)
{
    var beenActive = true;
    var timerStopped = false;
    var timeOffset;
    var timer;
    timer = new Timer(function () {
        if (beenActive)
        {
            timer.reset();
            beenActive = false;
            sendBeenActive();
        } else
        {
            timerStopped = true;
        }
    }, 30000, 1);
    document.documentElement.addEventListener("mousedown", function () {
        beenActive = true;
        if (timerStopped)
        {
            timer.reset();
            sendBeenActive();
        }
    });
    this.setTimeReference = function (reference)
    {
        Activity.reference=reference;
        timeOffset = new Date().getMilliseconds() - reference;
        Activity.timeOffset = timeOffset;
        sendBeenActive();
    };
    function sendBeenActive()
    {
        callbackBeenActive();
    }
    new Task(function () {
        callbackGetReference();
    }).run();
    //on get a database last value.
    //add to it timeOffset then subtract from Date.getMilliseconds() to get milli gone by since.
    Activity.instance = this;
}
Activity.waitingForOffset = [];
Activity.getLastOnline = function (serverMillisLastBeenActive, now)
{
    var millisecondsAgo;
    if (!now)
    {
        now = (new Date().getMilliseconds());
    }
    millisecondsAgo = now - (serverMillisLastBeenActive + Activity.timeOffset);
    return Activity.getTimeInfoFromMilliseconds(millisecondsAgo);
};
Activity.getAge=function(javaMillis)
{
  return Math.floor((Activity.reference-javaMillis)/31556952000);
};
Activity.getJoined = function (serverMillisJoined)
{

    var now = (new Date().getMilliseconds());
    var millisecondsAgo = now - (serverMillisJoined + Activity.timeOffset);
    return Activity.getTimeInfoFromMilliseconds(millisecondsAgo);
};
Activity.liveLastOnlineInstances = [];
Activity.mapUserIdToLiveLastActives = {};
Activity.mapUserIdToServerMillisLastBeenActive={};
Activity.update = function (userId, serverMillisLastBeenActive, now)
{
    Activity.mapUserIdToServerMillisLastBeenActive[userId]=serverMillisLastBeenActive;
    var liveLastActiveArray = Activity.mapUserIdToLiveLastActives[userId];
    if (liveLastActiveArray)
    {
        if (liveLastActiveArray.length > 0)
        {
            var lastOnline = Activity.getLastOnline(serverMillisLastBeenActive, now);
            for (var i = 0; i < liveLastActiveArray.length; i++)
            {
                liveLastActiveArray[i].updateWithLastOnline(lastOnline);
            }
        }
    }
};
Activity.LiveLastActive = function (userId, serverMillisLastBeenActive, callback) {
    var self = this;
    Activity.update(userId, serverMillisLastBeenActive);
    
    
    
    if (!Activity.timerLiveLastOnlines)
    {
        Activity.timerLiveLastOnlines = new Timer(function () {
            if (Activity.liveLastOnlineInstances.length < 1)
            {
                Activity.timerLiveLastOnlines.stop();
            }
            var now = (new Date().getMilliseconds());
            for(var userId in Activity.mapUserIdToLiveLastActives)
                Activity.update(userId, Activity.mapUserIdToServerMillisLastBeenActive[userId], now);
            
        }, 30000, -1);
    } else {
        if (Activity.liveLastOnlineInstances.length < 1)
            Activity.timerLiveLastOnlines.reset();
    }

    this.updateWithLastOnline = function (lastOnline) {
        callback(lastOnline);
    };
    this.update = function (now) {
        var lastOnline = Activity.getLastOnline(Activity.mapUserIdToServerMillisLastBeenActive[userId], now);
        callback(lastOnline);
    };
    this.update();
    this.close = function ()
    {
        Activity.liveLastOnlineInstances.splice(Activity.liveLastOnlineInstances.indexOf(self));
        Activity.mapUserIdToLiveLastActives[userId].splice(Activity.mapUserIdToLiveLastActives[userId].indexOf(self), 1);
        if (Activity.mapUserIdToLiveLastActives[userId].length < 1)
        {
            delete Activity.mapUserIdToLiveLastActives[userId];
        }
    };
    if (!Activity.mapUserIdToLiveLastActives[userId])
    {
        Activity.mapUserIdToLiveLastActives[userId] = [];
    }
    Activity.mapUserIdToLiveLastActives[userId].push(this);
};
Activity.getTimeInfoFromMilliseconds = function (millisecondsAgo) {
    if (millisecondsAgo < 65000)
    {
        return {type: 'now', mins: 0, str: 'Now'};
    } else
    {
        if (millisecondsAgo < 3600000)
        {
            var minutes = Math.floor(millisecondsAgo / 60000);
            return {type: 'mins', mins: minutes, str: String(minutes) + ' minutes ago'};
        } else
        {
            if (millisecondsAgo < 861641000)
            {
                var hours = Math.floor(millisecondsAgo / 3600000);
                return {type: 'hours', hours: minutes, str: String(hours) + ' hours ago'};
            } else
            {
                if (millisecondsAgo < 604800000)
                {
                    var days = Math.floor(millisecondsAgo / 861641000);
                    return {type: 'days', days: days, str: String(days) + ' days ago'};
                } else
                {
                    if (millisecondsAgo < 2419200000)
                    {
                        var weeks = Math.floor(millisecondsAgo / 604800000);
                        return {type: 'weeks', weeks: weeks, str: String(weeks) + ' weeks ago'};
                    } else
                    {
                        if (millisecondsAgo < 31536000000)
                        {
                            var days = Math.floor(millisecondsAgo / 2419200000);
                            return {type: 'months', months: minutes, str: String(days) + ' months ago'};
                        } else
                        {
                            var years = Math.floor(millisecondsAgo / 31536000000);
                            return {type: 'years', years: years, str: String(years) + ' years ago'};
                        }
                    }
                }
            }
        }
    }
};
function Birthday()
{
    this.div = document.createElement('div');
    var selectDay = document.createElement('select');
    var selectMonth = document.createElement('select');
    var selectYear = document.createElement('select');
    this.div.style.height = '25px';
    this.div.style.float = 'left';
    this.div.style.width = '100%';
    function style(select)
    {
        select.style.width = 'calc(33.33% - 1.33px)';
        select.style.height = '100%';
        select.style.position = 'relative';
        select.style.float = 'left';
    }
    style(selectDay);
    style(selectMonth);
    style(selectYear);
    selectMonth.style.marginLeft = '2px';
    selectYear.style.marginLeft = '2px';
    var now = new Date();
    var year = 1900 + now.getYear();
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    selectDay.appendChild(createOption(undefined, 'Day'));
    selectMonth.appendChild(createOption(undefined, 'Month'));
    selectYear.appendChild(createOption(undefined, 'Year'));
    for (var i = 1; i < 32; i++)
    {
        var option = createOption(i, String(i));
        selectDay.appendChild(option);
    }
    for (var i = 0; i < 12; i++)
    {
        var option = createOption(i, months[i]);
        selectMonth.appendChild(option);
    }
    var maxYear = year - 17;
    for (var i = maxYear - 100; i < maxYear; i++)
    {
        var option = createOption(i, String(i));
        selectYear.appendChild(option);
    }
    function createOption(value, txt)
    {
        var option = document.createElement('option');
        option.value = value;
        setText(option, txt);
        return option;
    }
    this.div.appendChild(selectDay);
    this.div.appendChild(selectMonth);
    this.div.appendChild(selectYear);
    this.getValue = function()
    {
        var day =selectDay.options[selectDay.selectedIndex].value;
        var month =selectMonth.options[selectMonth.selectedIndex].value;
        var year = selectYear.options[selectYear.selectedIndex].value;
        return{day:(day=='undefined'? undefined:parseInt(day)),month:(month=='undefined'?undefined:parseInt(month)), year:(year=='undefined'?undefined:parseInt(year))};
    };

}
function Genders(){
    
}
function GenderPicker()
{
    this.div = document.createElement('div');
    this.div.style.width='100%';
    this.div.style.height='25px';
    this.div.style.float='left';
    this.div.style.position='relative';
    var select = document.createElement('select');
    select.style.height='100%';
    select.style.width='100%';
    for(var i=0; i<Genders.values.length; i++)
    {
        var values = Genders.values[i];
        var option = document.createElement('option');
        setText(option, values.txt);
        option.value=values.value;
        select.appendChild(option);
    }
    this.div.appendChild(select);
    this.getValue=function(){
        return select.options[select.selectedIndex].value;
    };
}
Genders.values =[{value: 0, txt: 'a man'},
        {value: 1, txt: 'a woman'},
        {value: 2, txt: 'a couple(man + woman)'},
        {value: 3, txt: 'a couple of men'},
        {value: 4, txt: 'a couple of women'},
        {value: 5, txt: 'a transexual man'},
        {value: 6, txt: 'a transexual women'}
    ];
function TabPanel(tabNames, autoHeight, styleNames)
{
    styleNames=!styleNames?{}:styleNames;
    var self = this;
    this.panels = [];
    this.tabs = [];
    var nPanels = tabNames.length;
    this.div = document.createElement('div');
    var divPanelHousing = document.createElement('div');
    var divTabs = document.createElement('div');
    this.div.style.height =  autoHeight?'auto':'100%';
    this.div.style.width = '100%';
    this.div.style.float='left';
    divTabs.style.width = '100%';
    divTabs.style.height = '20px';
    var tabPercent = 100 / nPanels;
    divPanelHousing.style.height = autoHeight?'auto':'calc(100% - 20px)';
    divPanelHousing.style.width = '100%';
    if(!autoHeight)
    divPanelHousing.style.top = '20px';
    divPanelHousing.style.float='left';
    divPanelHousing.style.position = autoHeight?'relative':'absolute';
    this.div.appendChild(divTabs);
    this.div.appendChild(divPanelHousing);
    function Tab(name, panel, iTab)
    {
        var self = this;
        this.div = document.createElement('div');
        var divName = document.createElement('div');
        this.div.style.height = '18px';
        this.div.style.width = String(tabPercent) + '%';
        this.div.style.left = String(iTab * tabPercent) + '%';
        this.div.style.top = '2px';
        this.div.style.float='left';
        this.div.style.position='absolute';
        this.div.style.borderTopRightRadius = '10px';
        this.div.style.cursor = 'pointer';
        divName.style.paddingLeft = '5px';
        divName.style.height = '100%';
        divName.style.width = 'calc(100% - 5px)';
        divName.style.whiteSpace = 'nowrap';
        divName.style.overflow = 'hidden';
        divName.style.textOverflow = 'ellipsis';
        divName.style.display = 'inline-block;';
        this.div.appendChild(divName);
        var themesObject = {components: [
                {name:  (styleNames.frameStyleName?styleNames.frameStyleName:'frame'), elements: [self.div]},
                {name: (styleNames.textStyleName?styleNames.textStyleName:'text'), elements: [divName]}
            ],
            callback: function (theme) {

            }};
        Themes.register(themesObject);
        setText(divName, name);
        this.div.addEventListener("mousedown", function () {
            setActivePanel(panel);
        });
        this.close = function () {
            Themes.remove(themesObject);
        };
        this.setActive = function () {
            this.div.style.height = '18px';
        };
        this.setInactive = function () {
            this.div.style.height = '17px';
        };
    }
    function Panel()
    {
        var self = this;
        this.div = document.createElement('div');
        this.div.style.height =autoHeight?'auto':'calc(100% - 3px)';
        this.div.style.width = '100%';
        this.div.style.top = '3px';
        this.div.style.float='left';
        this.div.style.left = '0px';
        this.div.style.position = autoHeight?'relative':'absolute';

        this.show = function () {
            self.div.style.display = 'inline';
        };
        this.hide = function () {
            self.div.style.display = 'none';
        };
        var themesObject = {components: [
                {name: (styleNames.bodyStyleName?styleNames.bodyStyleName:'body'), elements: [self.div]}
            ],
            callback: function (theme) {

            }};
        Themes.register(themesObject);
        this.close = function () {
            Themes.remove(themesObject);
        };
    }
    function setActivePanel(panel)
    {
        for (var i = 0; i < self.panels.length; i++)
        {
            var p = self.panels[i];
            p.hide();
            if (panel != p)
                self.tabs[i].setInactive();
            else
            {
                self.tabs[i].setActive();
                if(self.onChangeTab)self.onChangeTab(i);
            }
        }
        panel.show();
    }
    for (var i = 0; i < nPanels; i++)
    {
        var panel = new Panel();
        var tab = new Tab(tabNames[i], panel, i);
        self.panels.push(panel);
        self.tabs.push(tab);
        divPanelHousing.appendChild(panel.div);
        divTabs.appendChild(tab.div);
    }
    setActivePanel(self.panels[0]);
    var themesObject = {components: [
            // {name: 'body', elements: [self.div]},
            {name: (styleNames.frameStyleName?styleNames.frameStyleName:'frame'), elements: [divPanelHousing]}
        ],
        callback: function (theme) {

        }};
    Themes.register(themesObject);
    this.close = function () {
        for (var i = 0; i < self.panels.length; i++)
        {
            self.panels[i].close();
            self.tabs[i].close();
        }
        Themes.remove(themesObject);
    };
}
function Authenticate(callbackSignIn, callbackRegister, enableAge)
{
    var enablePassword = (callbackRegister != undefined);
    var self = this;
    var settings = new Settings("#username", function () {
        this.set("username");
        //this is a reset function for this particualr instance of this particular class.
    });
    var timer;
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divInputsSignIn = document.createElement('div');
    var divInputsRegister;
    //var divTextInputs = document.createElement('div');
    var textUsername = document.createElement('input');
    var textPasswordSignIn;
    var button = document.createElement('button');
    var divError = document.createElement('div');
    var textError = document.createElement('textarea');
    var spinner = new Spinner(1);
    spinner.hide();
    this.div.style.position = 'fixed';
    this.div.style.height = 'auto';
    this.div.style.width = '244px';
    this.div.style.top = 'calc(50% - 100px)';
    this.div.style.left = 'calc(50% - 128px)';
    this.div.style.backgroundColor = '#001f4d';
    this.div.style.border = '1px solid #66a3ff';
    this.div.style.zIndex = '3000000';
    this.div.style.borderRadius = '5px';
    this.div.style.padding = '6px';
    divInner.style.height = 'auto';
    divInner.style.width = 'calc(100% - 8px)';
    divInner.style.position = 'relative';
    divInner.style.float='left';
    divInputsSignIn.style.position = 'relative';
    divInputsSignIn.style.width = '244px';
    divInputsSignIn.style.height = 'auto';
    divInputsSignIn.style.float = 'left';


    //divTextInputs.style.position = 'relative';
    //divTextInputs.style.height = 'auto';
    //divTextInputs.style.width = '180px';
    //divTextInputs.style.float='left';
    
    
    
    if (enablePassword) {
        divInputsRegister = document.createElement('div');
        textPasswordSignIn = document.createElement('input');
        var textPasswordRegister = document.createElement('input');
        var textPasswordReenterRegister = document.createElement('input');
        var textEmailRegister = document.createElement('input');
        var textUsernameRegister = document.createElement('input');
        textUsernameRegister.className='form-control';
        textEmailRegister.className='form-control';
        textPasswordReenterRegister.className='form-control';
        textPasswordRegister.className='form-control';
        textPasswordSignIn.className='form-control';
        textUsername.className='form-control';
        var birthday = new Birthday();
        var genderPicker = new GenderPicker();
        setLayoutStyle(genderPicker.div);
        setLayoutStyle(birthday.div);
        var buttonRegister = document.createElement('button');
        buttonRegister.style.marginBottom='3px';
        styleTextInputRegister(textEmailRegister, 'Email');
        styleTextInputRegister(textUsernameRegister, 'Username');
        styleTextInputRegister(textPasswordRegister, 'Password');
        styleTextInputRegister(textPasswordReenterRegister, 'Re-enter Password');
        textPasswordSignIn.onkeydown = detectEnterKey;
        textEmailRegister.onkeydown = detectEnterKey;
        textUsernameRegister.onkeydown = detectEnterKey;
        textPasswordRegister.onkeydown = detectEnterKey;
        textPasswordReenterRegister.onkeydown = detectEnterKey;
        textPasswordRegister.type = 'password';
        textPasswordReenterRegister.type = 'password';
        buttonRegister.style.width = '100%';
        buttonRegister.style.marginTop = '4px';
        buttonRegister.style.boxSizing = 'border-box';
        buttonRegister.className='btn btn-primary';
        setText(buttonRegister, 'Done');
        divInputsRegister.appendChild(genderPicker.div);
        divInputsRegister.appendChild(birthday.div);
        divInputsRegister.appendChild(buttonRegister);
        divInputsRegister.style.position = 'relative';
        divInputsRegister.style.width = '244px';
        divInputsRegister.style.height='auto';
        divInputsRegister.style.float = 'left';
        buttonRegister.onclick = sendRegister;
                function    sendRegister() {this.blur();
            if (textEmailRegister.value.length < 1)
            {
                setError("You must enter an email address!");
                return;
            }
            if (textUsernameRegister.value.length < 1)
            {
                setError("You must enter a username!");
                return;
            }
            if (textPasswordRegister.value.length < 1)
            {
                setError("You must enter a password!");
                return;
            }
            if (textPasswordReenterRegister.value.length < 1)
            {
                setError("You must re-enter your password!");
                return;
            }
            if (textPasswordRegister.value != textPasswordReenterRegister.value)
            {
                setError("The passwords entered do not match!");
                return;
            }
            showSpinner();
            var bd= birthday.getValue();
            if( !bd.year)
            {
                setError("You must enter a birth year!");
                return;
            }
            if(bd.month==undefined)
            {
                setError("You must enter a birth month!");
                return;
            }
            if(!bd.day)
            {
                setError("You must enter a birth day!");
                return;
            }
            var jObject = {email: textEmailRegister.value, username: textUsernameRegister.value, password: textPasswordRegister.value, gender:genderPicker.getValue(), birthday:bd};
            console.log('registering');
            callbackRegister(jObject);
        };
    }

    function styleTextInputSignIn(txt, placeholder)
    {
        setLayoutStyle(txt);
        txt.type = 'text';
        txt.placeholder = placeholder;
        divInputsSignIn.appendChild(txt);
    }
    function styleTextInputRegister(txt, placeholder)
    {
        setLayoutStyle(txt);
        txt.type = 'text';
        txt.placeholder=placeholder;
        divInputsRegister.appendChild(txt);
    }
    styleTextInputSignIn(textUsername, 'Username');
    if (enablePassword)
    {
        styleTextInputSignIn(textPasswordSignIn, 'Password');
        textPasswordSignIn.type = 'password';
    }
    button.style.height = '100%';
    button.style.position = 'relative';
    button.style.float = 'none';
    button.style.width='100%';
    button.style.marginTop='4px';
    button.style.marginBottom='3px';
    button.className='btn btn-primary';
    divError.style.position = 'relative';
    divError.style.float = 'left';
    divError.style.width = '100%';
    divError.style.backgroundColor = '#eeeeee';
    divError.style.fontFamily = 'Arial';
    divError.style.fontSize = '14px';
    divError.style.display = 'none';
    divError.style.marginTop = '3px';
    divError.style.boxSizing = 'border-box';
    textError.style.position = 'relative';
    textError.style.width = '100%';
    textError.style.boxSizing = 'border-box';
    textError.style.backgroundColor = 'transparent';
    textError.style.border = '0px';
    textError.style.resize = 'none';
    textError.style.overflowY = 'hidden';
    textError.style.float='left';
    textError.style.color='#ff3344';
    textError.readOnly = true;
    setText(button, "Enter");
    function setError(error)
    {
        if (error)
        {
            hideSpinner();
            divError.style.display = 'inline';
            setText(textError, error);
        } else
        {
            divError.style.display = 'none';
        }
    }
    this.setError = setError;
    function showSpinner()
    {
        spinner.show();
        spinner.center();
        textUsername.disabled = true;
    }
    function hideSpinner()
    {
        spinner.hide();
        textUsername.disabled = false;
    }
    function sendSignIn() {
        this.blur();
        showSpinner();
        var jObject = {};
        if (enablePassword)
            jObject.password = textPasswordSignIn.value;
        jObject.username = textUsername.value;
        callbackSignIn(jObject);
    }
    button.onclick = sendSignIn;
    function detectEnterKey(evt) {
        evt = evt || window.event;
        if (evt.keyCode == 13)
        {
            (showingRegister?sendRegister:sendSignIn)();
        }
    };
    textUsername.onkeydown = detectEnterKey;
    textUsername.addEventListener('click', function ()
    {
        textUsername.focus();
    });var showingRegister=false;

    var tabPanel;
    if (enablePassword)
    {
        tabPanel = new TabPanel(['Sign In', 'Register'], true);
        tabPanel.onChangeTab = function (i) {
            setError('');
            switch (i)
            {
                case 1:
                    showingRegister=true;
                    tabPanel.div.style.height = 'auto';
                    break;
                default:
                    showingRegister=false;
                    tabPanel.div.style.height = 'auto';
                    break;
            }
        };
        this.div.appendChild(tabPanel.div);
        tabPanel.panels[0].div.appendChild(divInputsSignIn);
        tabPanel.panels[1].div.appendChild(divInputsRegister);
        tabPanel.panels[1].div.className='dsfdsfdsf';

        
        tabPanel.div.style.height = 'auto';
        tabPanel.div.style.position = 'relative';
    } else
    {
        this.div.appendChild(divInputsSignIn);
    }
    //divInputsSignIn.appendChild(divTextInputs);
    divInputsSignIn.appendChild(button);
    this.div.appendChild(divError);
    divError.appendChild(textError);
    this.div.appendChild(spinner.div);
    var flashing = false;
    var flashingCount = 0;
    var initialBackgroundColor = self.div.style.backgroundColor;
    timer = new Timer(function () {
        flashingCount++;
        if (flashing) {
            self.div.style.backgroundColor = initialBackgroundColor;
            flashing = false;
            if (flashingCount > 6)
            {
                timer.stop();
            }
        } else {
            self.div.style.backgroundColor = '#ccff00';
            flashing = true;
        }
    }, 60, -1);
    this.hide = function ()
    {
        self.div.style.display = 'none';
        settings.set("username", textUsername.value);
    };
    var username = settings.get("username");
    if (username)
    {
        textUsername.value = username;
    }
    Themes.register({components: [
            {name: 'body', elements: enablePassword?[tabPanel.div, divInner]:[divInner]}
        ],
        callback: function (theme) {

        }}, undefined);
    function setLayoutStyle(element)
    {
    element.style.width='100%';
    element.style.position='relative';
    element.style.float='left';
    element.style.marginTop='3px';
    element.style.boxSizing='border-box';
    element.style.height='25px';
    }
}
var authenticate;
Authenticate.acquire = function (callback, enablePassword)
{
    if (!authenticate)
        authenticate = new Authenticate(callback, enablePassword);
    document.body.appendChild(authenticate.div);
};
Authenticate.hide = function ()
{
    if (authenticate)
    {
        authenticate.hide();
    }
};
Authenticate.error = function (message)
{
    if (authenticate)
    {
        authenticate.setError(message);
    }
};
function foreach(list, callback){
    for(var i=0; i<list.length; i++){callback(list[i]);}
}
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function Lobby()
{
    var optionPane;
    var lobbies = [];
    var themePicker = new ThemePicker();
    var contact = new Contact();
    var radio = new Radio(Configuration.radioChannelsXmlString);
    if (!window.isCors)
        Themes.register({components: [
                {name: 'background', elements: [document.body]}
            ],
            callback: function(theme) {

            }}, undefined);
    var spinnerLoading = new Spinner(1);
    spinnerLoading.show();
    document.documentElement.appendChild(spinnerLoading.div);
    spinnerLoading.center();
    spinnerLoading.div.style.zIndex = '100000';
    spinnerLoading.div.style.position = 'fixed';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    MySocket.timeoutMs = Configuration.ajaxTimeout;
    var mySocketProfiles = new MySocket('profiles');
    mySocketProfiles.addEventListener('open', function() {
        window.activity = new Activity(function() {
            var jObject = {type: 'set_user_active'};
            mySocketProfiles.send(jObject);
        }, function() {
            var jObject = {type: 'time_reference'};
            mySocketProfiles.send(jObject);
        });
    });
    mySocketProfiles.addEventListener('message', function(e)
    {
        var message = e.message;
        switch (message.type)
        {
            case "authenticate":
                if (message.successful){
                    Authenticate.hide();
                    authenticateLobbies(message);
                }
                else
                    Authenticate.error(message.reason);
                break;
            case "register":
                if (message.successful){
                    Authenticate.hide();
                    authenticateLobbies(message);
                }
                else
                    Authenticate.error(message.reason);
                break;
            case "time_reference":
                window.activity.setTimeReference(message.reference);
        }
    });
    function authenticateLobbies(jObject){
        foreach(lobbies, function(lobby){
            if(lobby.authenticate)
                lobby.authenticate(jObject);
        });
    }
    mySocketProfiles.addEventListener('close', function()
    {
        optionPane = new OptionPane(document.documentElement);
        if (Lobby.closedReason != 'spam')
        {
            optionPane.show([['Ok', function() {
                    }]], "Server was just restarted, please wait a minute then reload page!", function() {
            });
            optionPane.div.style.zIndex = '30000';
            optionPane.div.style.top = '30%';
            optionPane.div.style.position = 'fixed';
            reloadPage();
        }
    });
    var loadCount = 0;
    function finishedLoading()
    {
        loadCount--;
        if (loadCount <= 0)
        {
            getCredentials();
            spinnerLoading.hide();
            taskPreloadImages.run();
        }
    }
    function getCredentials() {
        Authenticate.acquire(function(jObject) {
            jObject.type = 'authenticate';
            mySocketProfiles.send(jObject);
        }, (Configuration.authenticationType == 'full' ? function(jObject) {
            jObject.type = 'register';
            mySocketProfiles.send(jObject);
        } : undefined));
        console.log(Configuration.authenticationType == 'full');
    }
    function getMySocketProfiles()
    {
        return mySocketProfiles;
    }
    (function initializeLobbies()
    {
        loadCount = window.lobbiesToLoad.length;
        var callbacks = {getMySocketProfiles: getMySocketProfiles};
        for (var i = 0; i < window.lobbiesToLoad.length; i++)
        {
            var LobbyFunction = lobbiesToLoad[i];
            lobbies.push(new LobbyFunction(finishedLoading, callbacks));
        }
    })();
    function reloadPage()
    {
        return;
        new Timer(function() {
            window.location.reload();
        }, 120000, 1);
    }
}
function Ignore()
{
    
}
Ignore.ignore=function(userId)
{
    var index = Ignore.users.indexOf(userId);
    if(index<0)
    {
        Ignore.users.push(userId);
    }
};
Ignore.unignore=function(userId)
{
    var index = Ignore.users.indexOf(userId);
    if (index >= 0)
    {
        Ignore.users.splice(index, 1);
    }
};
Ignore.users = [];
Ignore.isIgnored = function (userId)
{
    if (Ignore.users.indexOf(userId) >= 0)
    {
        return true;
    }
    return false;
};

//This is very fucking useful. It gets rid of those stupid api differences between browsers.
var RTCPeerConnection = null;
var getUserMedia = null;
var attachMediaStream = null;
var reattachMediaStream = null;
var webrtcDetectedBrowser = null;
function trace(text) {
    if (text[text.length - 1] == '\\') {
        text = text.substring(0, text.length - 1);
    }
    console.log((performance.now() / 1000).toFixed(3) + ": " + text);
}

if (navigator.mozGetUserMedia) {
    console.log("This appears to be Firefox");
    webrtcDetectedBrowser = "firefox";

    RTCPeerConnection = mozRTCPeerConnection;
    RTCSessionDescription = mozRTCSessionDescription;
    RTCIceCandidate = mozRTCIceCandidate;
    getUserMedia = navigator.mozGetUserMedia.bind(navigator);
    attachMediaStream = function (element, stream) {
        console.log("Attaching media stream");
        element.mozSrcObject = stream;
        element.play();
    };
    reattachMediaStream = function (to, from) {
        console.log("Reattaching media stream");
        to.mozSrcObject = from.mozSrcObject;
        to.play();
    };
    MediaStream.prototype.getVideoTracks = function () {
        return [];
    };
    MediaStream.prototype.getAudioTracks = function () {
        return [];
    };
} else if (navigator.webkitGetUserMedia) {
    console.log("This appears to be Chrome");
    webrtcDetectedBrowser = "chrome";
    RTCPeerConnection = webkitRTCPeerConnection;
    getUserMedia = navigator.webkitGetUserMedia.bind(navigator);

    attachMediaStream = function (element, stream) {
        if (typeof element.srcObject !== 'undefined') {
            element.srcObject = stream;
        } else
        {
            if (typeof element.mozSrcObject !== 'undefined') {
                element.mozSrcObject = stream;
            } else
            {
                if (typeof element.src !== 'undefined') {
                    element.src = URL.createObjectURL(stream);
                } else {
                    console.log('Error attaching stream to element.');
                }
            }
        }
    };
    reattachMediaStream = function (to, from) {
        to.src = from.src;
    };
    if (!webkitMediaStream.prototype.getVideoTracks) {
        webkitMediaStream.prototype.getVideoTracks = function () {
            return this.videoTracks;
        };
        webkitMediaStream.prototype.getAudioTracks = function () {
            return this.audioTracks;
        };
    }
    if (!webkitRTCPeerConnection.prototype.getLocalStreams) {
        webkitRTCPeerConnection.prototype.getLocalStreams = function () {
            return this.localStreams;
        };
        webkitRTCPeerConnection.prototype.getRemoteStreams = function () {
            return this.remoteStreams;
        };
    }
} else {
    console.log("Browser does not appear to be WebRTC-capable");
}

navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

function Video(callbacks, type)
{
    var self = this;
    this.div = document.createElement('div');
    this.div.style.width = '100%';
    this.div.style.height = '100%';
    this.div.style.backgroundColor = '#aaaaaa';
    var remoteVideo = document.createElement('video');
    remoteVideo.style.width = '100%';
    remoteVideo.style.height = '100%';
    this.div.appendChild(remoteVideo);
    if (!navigator.getUserMedia) {
        return alert('getUserMedia not supported in this browser.');
    }
    var pc;
    var remoteStream;
    this.connected = false;
    function createNewPC() {
        pc = new RTCPeerConnection(null);
        self.connected = true;//moved from inside onaddstream.
        pc.onaddstream = function (event) {
            //put in function to set div visible and size.
            attachMediaStream(remoteVideo, event.stream);
            remoteStream = event.stream;
            if(callbacks&&callbacks.addedStream)
            {
            callbacks.addedStream();
            }
        };
        pc.onremovestream = function (event) {
            if (callbacks&&callbacks.removedStream)
            {
                callbacks.removedStream();
            }
        };
        pc.oniceconnectionstatechange = function () {
            if (pc.iceConnectionState == 'disconnected') {
                self.disconnect();
            }
        };
        pc.onicecandidate = function gotIceCandidate(event) {
            if (event.candidate != null) {
                callbacks.send({webcam_type: 'ice', ice: event.candidate});
            }
        };
    }
    self.recievedIce = function (jObject) {
        if (jObject.ice != undefined) {
            pc.addIceCandidate(new RTCIceCandidate(jObject.ice));
        }
    };
    this.disconnect = function ()
    {
        console.log('closed');
        if (pc)
        {
            pc.close();
        }
        self.connected = false;
        if (callbacks.disconnected) {
            callbacks.disconnected();
        }
    };
    this.connect = function ()
    {
        pc = undefined;
        createNewPC();
        Video.getWebcamPermission(function () {
            pc.addStream(Video.localStream);
            console.log('ADDED STREEM');
            pc.createOffer(function (offer)
            {
                pc.setLocalDescription(new RTCSessionDescription(offer), function ()
                {
                    callbacks.send({webcam_type: 'request', offer: offer});
                }, err.bind(null, 'connect 2'));
            }, err.bind(null, 'connect 1'));
        });
    };
    this.recievedOffer = function (jObject)
    {
        if (jObject.offer)
        {
            createNewPC();
            pc.setRemoteDescription(new RTCSessionDescription(jObject.offer), function ()
            {
                callbacks.ask(jObject.offer);
            }, err.bind(null, 'recievedOffer'));
        }
    };
    this.accept = function ()
    {
        Video.getWebcamPermission(function () {
            pc.addStream(Video.localStream);
            pc.createAnswer(function (answer)
            {
                    var rtcSessionDescription = new RTCSessionDescription(answer);
                    //This is where the problem occurs, around here. If there is a delay, its fine.
                    pc.setLocalDescription(rtcSessionDescription, function () {
                        callbacks.send({webcam_type: 'reply', accepted: true, answer: answer});
                        callbacks.connected();
                    }, err.bind(null, 'accept 2'));
            }, err.bind(null, 'accept 1'));
        });
    };
    this.decline = function ()
    {
        callbacks.send({webcam_type: 'reply', accepted: false});
    };
    this.accepted = function (jObject)
    {
        pc.setRemoteDescription(new RTCSessionDescription(jObject.answer), function () {
            callbacks.connected();
        }, err.bind(null, 'accepted'));
    };
    this.showMe = function (bool)
    {
        if (bool)
        {
            pc.addStream(Video.localStream);
        }
        else
        {
            pc.removeStream(Video.localStream);
        }
    };
}
Video.Type = {both: 'both', recieving: 'recieving', sending: 'sending'};
Video.mediaOptions = {audio: false, video: true};
Video.getWebcamPermission = function (funct) {
    if (Video.localStream)
    {
        if (funct)
        {
            funct();
        }
    }
    else
    {
        if (navigator.getUserMedia)
        {
            navigator.getUserMedia(Video.mediaOptions, function (stream)
            {
                Video.localStream = stream;
                if (funct)
                {
                    funct();
                }
            }, err.bind(null, 'getWebcamPermission'));
        }
    }
};
function err(source, message)
{
    console.log(source);
    console.log(message);
}
function Volume(parent, callback, percent)
{
    var self = this;
    var timer;
    this.div = document.createElement('div');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var buttonClose = document.createElement('button');
    var divInner = document.createElement('div');
    var volumeSlider = new VolumeSlider(function(p){setPercentageText(p);
        percent=p;
        callback(p);});
    this.div.style.position = 'absolute';
    this.div.style.height = 'auto';
    this.div.style.width = 'auto';
    this.div.style.top = '50%';
    this.div.style.left = '50%';
    this.div.style.marginLeft = '-86px';
    this.div.style.backgroundColor = '#001f4d';
    this.div.style.border = '1px solid #66a3ff';
    this.div.style.zIndex = '2000';
    this.div.style.padding = '6px';
    this.div.style.borderRadius = '5px';
    this.div.style.padding='0px 3px 3px 3px';
    this.div.style.border = '1px solid #66a3ff';
    this.div.style.display='none';
    //divInner.style.border = '3px solid #0099ff';
    this.div.style.backgroundColor = '#0099ff';
    divTab.style.width='auto';
    divTab.style.float='none';
    divTab.style.height='18px';
    divName.style.height = '100%';
    divName.style.float = 'left';
    divName.style.paddingLeft = '5px';
    divName.style.fontFamily = 'Arial';
    divName.style.fontSize = '14px';
    divInner.style.float='none';
    divInner.style.backgroundColor = '#555555';
    divInner.style.height='100%';
    divInner.style.width='auto';
    divInner.style.padding='6px';
    setButtonGenericStyle(buttonClose);
    setText(buttonClose, String.fromCharCode(10006));
    function setButtonGenericStyle(button)
    {
        button.style.float = 'right';
        button.style.border = '0px';
        button.style.backgroundColor = 'transparent';
        button.style.cursor = 'pointer';
        button.style.fontWeight = '900';
        button.style.fontSize = '14px';
        button.style.marginTop='-3px';
    }
    function setPercentageText(percent)
    {
        setText(divName, 'Volume: '+String(percent)+'%');
    }
    this.show=function()
    {
        self.div.style.display='block';
    timer = new Timer(function () {
            if (flashing) {
                styleFromObject(self.div, Themes.theme.components.frame);
                flashing = false;
            } else {
                styleFromObject(self.div, Themes.theme.components.frameFlashing);
                flashing = true;
            }
        }, 50, 6);
        volumeSlider.setVolume(percent);
        setPercentageText(percent);
    };
    this.hide=function()
    {
        self.div.style.display='none';
    };
    function addOnKeyDown(text)
    {
    text.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode == 13) {
            try
            {
            doCallback();
        }
        catch(ex){
            console.log(ex);
        }
        }
    };
    }
    new Hover(buttonClose, function () {
        buttonClose.style.color = '#ff0000';
    });
    buttonClose.onclick=function()
    {
        self.hide();
    };
    this.div.appendChild(divTab);
    divTab.appendChild(divName);
    divTab.appendChild(buttonClose);
    this.div.appendChild(divInner);
    var flashing = false;
    Themes.register({components:[
            {name:'body', elements:[divInner]},
            {name: 'frame', elements: [self.div]},
            {name: 'frameBorder', elements: [self.div]},
            {name:'text', elements:[divName, buttonClose]}
        ],
    callback:function(theme){
        
    }}, undefined);
    //var initialBackgroundColor = self.div.style.backgroundColor;
    parent.appendChild(self.div);
    divInner.appendChild(volumeSlider.div);
}
function SoundEffects(userInformation)
{
    var self = this;
    var settings = new Settings("#sound_effects", function () {
        this.set("position");
        this.set("size");
        this.set("showing");
        this.set("volume_user");
        this.set("volume_notifications");
        //this is a reset function for this particualr instance of this particular class.
    });
    var minWidth=200;
    var minHeight=100;
    this.type = 'SoundEffects';
    this.taskBarInformation = {tooltip: 'Send sound effects to the active chat window!', icon: ('images/sound-effects-icon.gif'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var divMain = document.createElement('div');

    var audioUserSoundEffects = document.createElement("audio");
    audioUserSoundEffects.preload = "auto";
    var sourceUserSoundEffects = document.createElement('source');
    audioUserSoundEffects.appendChild(sourceUserSoundEffects);
    var audioNotifications = document.createElement("audio");
    audioNotifications.preload = "auto";
    var sourceNotifications = document.createElement('source');
    audioNotifications.appendChild(sourceNotifications);
    function playUserSoundEffect(url)
    {
        sourceUserSoundEffects.src = url;
        audioUserSoundEffects.load();
        audioUserSoundEffects.play();
    }
    var v = settings.get("volume_user");
    if (v==undefined||v==null)
    {
        v = 100;
    }
    var volumeUserSoundEffects = new Volume(divInner, function (percent) {
        audioUserSoundEffects.volume = (percent / 100);
        settings.set("volume_user", percent);
    }, v);
    audioUserSoundEffects.volume = (v / 100);
    v = settings.get("volume_notifications");
    if (v==undefined||v==null)
    {
        v = 100;
    }
    var volumeNotifications = new Volume(divInner, function (percent) {
        audioNotifications.volume = (percent / 100);
        settings.set("volume_notifications", percent);
    }, v);
    audioNotifications.volume = (v / 100);
    this.div.style.position = "absolute";
    this.div.style.width = '200px';
    this.div.style.height = '500px';
    this.div.style.top = '50px';
    this.div.style.left = '550px';
    divInner.style.position = 'absolute';
    divInner.style.border = '1px solid #66a3ff';
    //divInner.style.border = '3px solid #0099ff';
    divInner.style.backgroundColor = '#0099ff';
    divInner.style.padding = '0px 3px 3px 3px';
    divInner.style.borderRadius = "5px";
    divInner.style.overflow = 'hidden';
    var menuBar = new MenuBar({options: [{name: 'Volume', options: [{name: "notifications", callback: function () {
                            volumeNotifications.show();
                        }}, {name: "user sound effects", callback: function () {
                            volumeUserSoundEffects.show();
                        }}]}]}, {left: 0, top: -2});
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.height = "20px";
    divTab.style.cursor = 'move';
    divTab.style.padLeft = '10px';
    divName.style.float = 'left';
    divName.style.paddingLeft = '5px';
    divName.style.fontFamily = 'Arial';
    verticallyCenter(divName);
    setText(divName, "Sound effects");
    divMain.style.backgroundColor = '#555555';
    divMain.style.position = 'relative';
    divMain.style.float = 'left';
    divMain.style.height = 'calc(100% - 41px)';
    divMain.style.width = "100%";
    divMain.style.overflowY = 'auto';
    divMain.style.paddingBottom = '1px';
    var startPosition = settings.get("position");
    if (startPosition)
    {
        this.div.style.left = String(startPosition[0]) + 'px';
        this.div.style.top = String(startPosition[1]) + 'px';
    }
    var startSize = settings.get("size");
    if (startSize)
    {
        if(startSize[0]<minWidth)
            startSize[0]=minWidth;
        if(startSize[1]<minHeight)
            startSize[1]=minHeight;
        this.div.style.width = String(startSize[0]) + 'px';
        this.div.style.height = String(startSize[1]) + 'px';
    }  var startZIndex = settings.get("zIndex");
        if (startZIndex)
        {
            self.div.style.zIndex=String(startZIndex);
        }
    
    
    SoundEffects.playUserSoundEffect = playUserSoundEffect;
    function playNotifications(url)
    {
        sourceNotifications.src = url;
        audioNotifications.load();
        audioNotifications.play();
    }
    SoundEffects.playNotifications = playNotifications;
    function SoundEffectEntry(url, name)
    {
        var self = this;
        this.div = document.createElement('div');
        var divName = document.createElement('div');
        this.div.style.position = 'relative';
        this.div.style.height = '30px';
        this.div.style.width = '100%';
        this.div.style.backgroundColor = '#f0f0f0';
        this.div.style.cursor = 'pointer';
        this.div.style.float = 'left';
        this.div.style.border = '1px solid #4d0026';
        this.div.style.borderRadius = '5px';
        this.div.style.left = '-1px';
        this.div.style.marginLeft = '2px';
        this.div.style.marginTop = '1px';
        this.div.style.overflow = 'hidden';
        this.div.style.width = 'calc(100% - 6px)';
        this.div.style.paddingLeft = '2px';
        divName.style.float = 'left';
        divName.style.fontFamily = 'Arial';
        divName.style.height = '19px';
        divName.style.paddingLeft = '0px';
        divName.style.textOverflow = 'ellipsis';
        divName.style.overflow = 'hidden';
        divName.style.whiteSpace = 'nowrap';
        divName.style.width = '100%';
        divName.style.width = 'calc(100% - 28px)';

        verticallyCenter(divName);
        setText(divName, name);
        this.div.appendChild(divName);
        new Hover(this.div, function () {
            self.div.style.backgroundColor = '#fdfdfe';
        }, function () {
        });
        this.div.onclick = function ()
        {
            if (Windows.instances)
            {
                for (var i = Windows.instances.length - 2; i < Windows.instances.length; i++)
                {
                    var window = Windows.instances[i];
                    if (window.acceptsEmoticons)
                    {
                        window.sendSoundEffect(url, name);
                        Windows.bringToFront(window);
                        break;
                    }
                }
            }
            playUserSoundEffect(url);
        };
    }
    httpGetAsynchronous("sounds/sound_effects.xml", function (r) {

        var xml = objectFromXML(r, true);
        if (xml.messaging_sound_effects)
        {
            if (xml.messaging_sound_effects.folder)
            {
                doFolder(xml.messaging_sound_effects.folder);
            }
        }
    });
    function doFolder(folders)
    {
        if (folders.length)
        {
            for (var i = 0; i < folders.length; i++)
            {
                var pathPrefix = 'sounds/' + folders[i].path + '/';
                doSoundEffect(folders[i].sound, pathPrefix);
            }
        }
        else
        {
            var pathPrefix = 'sounds/' + folders.path + '/';
            doSoundEffect(folders.sound, pathPrefix);
        }
    }
    function doSoundEffect(sounds, pathPrefix)
    {
        if (sounds.length)
        {
            for (var i = 0; i < sounds.length; i++)
            {
                var url = pathPrefix + sounds[i].path;
                divMain.appendChild(new SoundEffectEntry(url, sounds[i].name).div);

            }
        }
        else
        {
            var url = pathPrefix + sounds.path;
            divMain.appendChild(new SoundEffectEntry(url, sounds.name).div);
        }
    }
    function verticallyCenter(element)
    {
        element.style.position = 'relative';
        element.style.top = '50%';
        element.style.transform = 'translateY(-50%)';
        element.style.msTransform = 'translateY(-50%)';
        element.style.webkitTransform = 'translateY(-50%)';
        element.style.oTransform = 'translateY(-50%)';
    }
    function setTableSkinny(table)
    {
        table.cellSpacing = "0";
        table.cellPadding = "0";
    }
    this.div.appendChild(divInner);
    divInner.appendChild(divTab);
    divTab.appendChild(divName);
    divInner.appendChild(menuBar.div);
    divInner.appendChild(divMain);
    var timerFlash;
    this.flash = function ()
    {
        var flashing = false;
        timerFlash = new Timer(function () {
            if (flashing) {
                styleFromObject(divInner, Themes.theme.components.frame);
                flashing = false;
            } else {
                styleFromObject(divInner, Themes.theme.components.frameFlashing);
                flashing = true;
            }
        }, 50, 6);
    };
    this.show = function ()
    {
        self.div.style.display = 'inline';
        settings.set("showing", true);
    };
    this.hide = function ()
    {
        self.div.style.display = 'none';
        settings.set("showing", false);
    };
    var showing = settings.get("showing");
    if (showing)
    {
        this.show();
    }
    else
    {
        if(showing==false)
        {
            this.hide();
        }
    }
    this.unminimize = function ()
    {
        self.task.unminimize();
        self.flash();
    };
    makeUnselectable(this.div);
    Themes.register({components: [
            {name: 'body', elements: [divMain]},
            {name: 'text', elements: [divName]}
        ],
        callback: function (theme) {

        }}, undefined);
    Window.style(self.div, divInner, divTab);
    
    var windowInformation = new WindowInformation(true, true, 200, 100, 199, Windows.maxHeightPx, 0, 100, 0, Windows.maxYPx, true, false, true);
var windowCallbacks=         new WindowCallbacks(function(){
                settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
                settings.set("size", [200, self.div.offsetHeight]);
            }, function(){
        if(self.div.offsetLeft&&self.div.offsetTop)
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
         },
         function(){
        self.task.minimize();}, undefined, function(){
        self.task.minimize();}, function(zIndex){settings.set("zIndex", zIndex);});
    var  params = {obj: this,
        minimized: false,
        divTab: divTab,
        divInner: divInner,
        windowInformation: windowInformation,
        callbacks: windowCallbacks};
    Windows.add( params);TaskBar.add(this);
}
SoundEffects.entered = function ()
{
    if (SoundEffects.playNotifications)
    {
        SoundEffects.playNotifications('sounds/notification/sounds-1068-the-calling.mp3');
    }
};
SoundEffects.message = function ()
{
    if (SoundEffects.playNotifications)
    {
        SoundEffects.playNotifications('sounds/notification/sounds-1036-put-down.mp3');
    }
};
SoundEffects.pm = function ()
{
    if (SoundEffects.playNotifications)
    {
        SoundEffects.playNotifications('sounds/notification/sounds-913-served.mp3');
    }
};
function ProfilePicture(usersName)
{
    var self = this;
    this.usersName = usersName;
    this.div = document.createElement('div');
    this.div.classList.add('profile-picture');
    var img = document.createElement('img');
    this.div.style.height = '100%';
    this.div.style.width = '100%';
    img.src = window.thePageUrl+'images/user.png';
    img.style.height = '100%';
    img.style.width = '100%';
    img.onerror = function () {
        img.src = window.thePageUrl+'images/user.png';
    };
    this.set = function (url)
    {
        img.src = window.thePageUrl+url;
    };
    this.div.appendChild(img);
    var instances = ProfilePicture.mapNameToInstances[usersName];
    if (!instances)
    {
        instances = [];
        ProfilePicture.mapNameToInstances[usersName] = instances;
    }
    var url = ProfilePicture.mapNameToUrl[usersName];
    if (url)
    {
        img.src = window.thePageUrl+url;
    }
    instances.push(this);
    this.dispose = function(){
        ProfilePicture.remove(self);
    };
}
ProfilePicture.mapNameToUrl = {};
ProfilePicture.mapNameToInstances = {};
ProfilePicture.update = function (usersName, url)
{
    console.log('updating');
    ProfilePicture.mapNameToUrl[usersName] = url;
    var instances = ProfilePicture.mapNameToInstances[usersName];
    if (instances)
    {
        for (var i = 0; i < instances.length; i++)
        {
            var instance = instances[i];
            instance.set(url);
        }
    }
};
ProfilePicture.remove = function (instance)
{
    var instances = ProfilePicture.mapNameToInstances[instance.usersName];
    if (instances)
    {
        instances.splice(instances.indexOf(instance), 1);
        if (instances.length < 1)
        {

            //if (ProfilePicture.mapNameToUrl[instance.usersName])
            //{
            //    delete ProfilePicture.mapNameToUrl[instance.usersName];
            //}
            delete ProfilePicture.mapNameToInstances[instance.usersName];
        }
    }
};
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Users(independant, cssName, userInformation, callbackEntered, callbackLeft, callbackProfilePicture)
{
    var self = this;
    var initialized = false;
    var settings = new Settings("#users", function () {
        this.set("position");
        this.set("showing");
        this.set("size");
        //this is a reset function for this particualr instance of this particular class.
    });
    var minWidth = 200;
    var minHeight = 100;
    this.type = 'Users';
    if (independant)
    {
        this.taskBarInformation = {tooltip: 'Lists all users on site', icon: ('images/users.gif'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    }
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var divMain = document.createElement('div');
    if (independant)
    {

        this.div.style.position = "absolute";
        this.div.style.width = '200px';
        this.div.style.height = '450px';
        this.div.style.top = '300px';
        this.div.style.left = '220px';
        this.div.style.position = 'absolute';
        divInner.style.border = '1px solid #66a3ff';
        //divInner.style.border = '3px solid #0099ff';
        divInner.style.backgroundColor = '#0099ff';
        divInner.style.padding = '0px 3px 3px 3px';
        divInner.style.borderRadius = "5px";
        divInner.style.overflow = 'hidden';
        divTab.style.height = "20px";
        divMain.style.width = "100%";
        divMain.style.height = "calc(100% - 20px)";
        divMain.style.backgroundColor = '#555555';
        this.div.style.display = 'none';
        setText(divName, "All Users");
        var startPosition = settings.get("position");
        if (startPosition)
        {
            this.div.style.left = String(startPosition[0]) + 'px';
            this.div.style.top = String(startPosition[1]) + 'px';
        }
        var startSize = settings.get("size");
        if (startSize)
        {
            if (startSize[0] < minWidth)
                startSize[0] = minWidth;
            if (startSize[1] < minHeight)
                startSize[1] = minHeight;
            this.div.style.width = String(startSize[0]) + 'px';
            this.div.style.height = String(startSize[1]) + 'px';
        }  var startZIndex = settings.get("zIndex");
        if (startZIndex)
        {
            self.div.style.zIndex=String(startZIndex);
        }
    
    } else
    {
        this.div.style.position = "relative";
        this.div.style.width = '150px';
        this.div.style.height = '100%';
        this.div.style.backgroundColor = '#555555';
        divInner.style.borderBottomRightRadius = "5px";
        divTab.style.backgroundColor = "#e6e6ff";
        divTab.style.height = "14px";
        divMain.style.backgroundColor = '#d9d9d9';
        divMain.style.width = "100%";
        divMain.style.height = "calc(100% - 14px)";
        divMain.style.borderBottomRightRadius = '5px';
        divName.style.height = '100%';
        setText(divName, "Users");
        divInner.style.width = "100%";
        divInner.style.height = "100%";
    }
    this.div.className = 'div-room';
    //ff0066
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.cursor = 'move';
    divTab.style.padLeft = '10px';
    divTab.className = 'div-room-class';
    divName.style.float = 'left';
    divName.style.paddingLeft = '5px';
    divName.style.fontFamily = 'Arial';
    divName.style.fontSize = '12px';
    verticallyCenter(divName);
    divMain.style.position = 'relative';
    divMain.style.float = 'left';
    divMain.style.overflowY = 'auto';
    var currentUsers = [];
    var currentUsernames = [];
    var menuOptions = [{name: 'PM', callback: function (r) {
                Lobby.getPm(r.userId);
            }}, {name: 'Ignore', callback: function (r) {
                if (Ignore.isIgnored(r.userId))
                {
                    Ignore.unignore(r.userId);
                } else
                {
                    Ignore.ignore(r.userId);
                }
            }}];
    if (Configuration.videoEnabled)
    {
        menuOptions.push({name: 'Video PM', callback: function (r) {
                Video.getWebcamPermission(function () {
                    Lobby.getVideoPm(r.userId);
                });
            }});
    }
    var menu = new Menu({options: menuOptions});
    this.mapUniqueIdToUser={};
    this.listUsers = function (users)
    {
        var alreadyPresent = [];
        var i = 0;
        var addedAtLeastOne = false;
        for (var i = users.length - 1; i >= 0; i--)
        {
            var r = users[i];
            if (currentUsernames.indexOf(r.name) < 0)
            {
                addedAtLeastOne = r.name;
                var user = new UserEntry(r);
                var inserted = false;
                for (var j = 0; j < currentUsernames.length; j++)
                {
                    if (currentUsernames[j] > user.name)
                    {
                        divMain.insertBefore(user.div, divMain.children[j]);
                        currentUsers.splice(j, 0, user);
                        self.mapUniqueIdToUser[user.userId]=user;
                        currentUsernames.splice(j, 0, user.name);
                        inserted = true;
                        break;
                    }
                }
                if (!inserted)
                {
                    divMain.appendChild(user.div);
                    self.mapUniqueIdToUser[user.userId]=user;
                    currentUsers.push(user);
                    currentUsernames.push(user.name);
                }
            }
            alreadyPresent.push(r.name);
        }
        i = 0;
        while (i < currentUsers.length)
        {
            if (alreadyPresent.indexOf(currentUsers[i].name) < 0)
            {
                if (callbackLeft)
                {
                    callbackLeft(currentUsers[i].name);
                }
                divMain.removeChild(currentUsers[i].div);
                delete self.mapUniqueIdToUser[currentUsers[i].userId];
                currentUsers.splice(i, 1);
                currentUsernames.splice(i, 1);
            } else
            {
                i++;
            }
        }
        initialized = true;
        if (addedAtLeastOne && independant)
        {
            Tab.attention(r.name + " Entered!");
            SoundEffects.entered();
        }
    };
    function UserEntry(r)
    {
        var self = this;
        this.name = r.name;
        this.userId = r.userId;
        this.div = document.createElement('div');
        this.div.style.position = 'relative';
        this.div.style.height = '32px';
        this.div.style.width = '100%';
        this.div.style.backgroundColor = '#f0f0f0';
        this.div.style.cursor = 'pointer';
        this.div.style.float = 'left';
        this.div.style.border = '1px solid #00264d';
        this.div.style.borderRadius = '3px';
        this.div.style.left = '-1px';
        this.div.style.marginLeft = '2px';
        this.div.style.marginTop = '1px';
        this.div.style.overflow = 'hidden';
        this.div.style.width = 'calc(100% - 6px)';
        this.div.style.paddingLeft = '2px';
        var divName = document.createElement('div');
        var divPicture = document.createElement('div');
        divName.style.float = 'left';
        divName.style.fontFamily = 'Arial';
        divName.style.fontSize = '14px';
        divName.style.height = '18px';
        divName.style.paddingLeft = '0px';
        divName.style.textOverflow = 'ellipsis';
        divName.style.overflow = 'hidden';
        divName.style.whiteSpace = 'nowrap';
        divName.style.width = 'calc(100% - 32px)';
        verticallyCenter(divName);
        divPicture.style.marginRight = '1px';
        divPicture.style.height = '30px';
        divPicture.style.width = '30px';
        divPicture.style.float = 'left';
        verticallyCenter(divPicture);
        setText(divName, r.name);
        var profilePicture = new ProfilePicture(r.name);
        divPicture.appendChild(profilePicture.div);
        if (r.relativePathImage)
        {
            ProfilePicture.update(r.name, 'images/profile/' + r.relativePathImage);
        }
        this.div.appendChild(divPicture);
        this.div.appendChild(divName);
        new Hover(this.div, function () {
            self.div.style.backgroundColor = '#fdfdfe';
        }, function () {
        });
        this.div.onclick = function (e)
        {

            if (!e)
                var e = window.event;
            console.log(r.userId);
            console.log(userInformation)
            if (r.userId != userInformation.userId)
            {
                var ignoreStr = 'Ignore';
                if (Ignore.isIgnored(r.userId))
                {
                    ignoreStr = 'Unignore';

                }
                menu.show(e.pageX, e.pageY, function () {
                }, r, [{}, {name: ignoreStr}, {}]);
            } else
            {
                divPicture.onclick = function () {
                    if (callbackProfilePicture)
                    {
                        try
                        {
                            callbackProfilePicture();
                        } catch (ex)
                        {
                            console.log(ex);
                        }
                    }
                };
            }
        };
        if (callbackEntered && initialized)
        {
            callbackEntered(r.name);
        }

        this.dispose = function ()
        {
            ProfilePicture.remove(profilePicture);
        };
    }
    function verticallyCenter(element)
    {
        element.style.position = 'relative';
        element.style.top = '50%';
        element.style.transform = 'translateY(-50%)';
        element.style.msTransform = 'translateY(-50%)';
        element.style.webkitTransform = 'translateY(-50%)';
        element.style.oTransform = 'translateY(-50%)';
    }

    this.div.appendChild(divInner);
    divInner.appendChild(divTab);

    divTab.appendChild(divName);
    divInner.appendChild(divMain);
    this.show = function ()
    {
        self.div.style.display = 'inline';
        settings.set("showing", true);
    };
    this.hide = function ()
    {
        self.div.style.display = 'none';
        settings.set("showing", false);
    };
    var showing = settings.get("showing");
    if (showing || showing == undefined)
    {
        this.show();
    } else
    {
        if (showing == false)
        {
            this.hide();
        }
    }
    if (independant)
    {

        Themes.register({components: [
                {name: 'body', elements: [divMain]},
                {name: 'text', elements: [divName]}
            ],
            callback: function (theme) {

            }}, undefined);
        Window.style(self.div, divInner, divTab);
        
    var windowInformation = new WindowInformation(true, true, 200, 100, 199, Windows.maxHeightPx, 0, 100, 0, Windows.maxYPx, true, false, true);
var windowCallbacks=         new WindowCallbacks(function(){
                settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
                settings.set("size", [200, self.div.offsetHeight]);
            }, function(){
        if(self.div.offsetLeft&&self.div.offsetTop)
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
         },
         function(){
        self.task.minimize();}, undefined, function(){
        self.task.minimize();}, function(zIndex){settings.set("zIndex", zIndex);});
    var  params = {obj: this,
        minimized: false,
        divTab: divTab,
        divInner: divInner,
        windowInformation: windowInformation,
        callbacks: windowCallbacks};
    Windows.add( params);TaskBar.add(this);
    } else
    {

        Themes.register({components: [
                {name: 'text', elements: [divTab]},
                {name: 'body1', elements: [divMain]},
                {name: 'frame1', elements: [divTab, self.div]},
                {name: 'text_color', elements: [divName]}
            ],
            callback: function (theme) {

            }}, undefined);
        Themes.register({components: [
            ],
            callback: function (theme) {

            }}, undefined);
    }
    makeUnselectable(this.div);
    this.dispose = function ()
    {
        while (currentUsers.length > 0)
        {
            var currentUser = currentUsers[0];
            currentUser.dispose();
            currentUsers.splice(currentUsers.indexOf(currentUser), 1);
        }
    };
}

function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}
function Message(params)
{
    var self = this;
    var profilePicture;
    var fontScale = isMobile?Font.mobileScale: 1;
    if (params.str == undefined)
    {
        return;
    }
    this.div = document.createElement('div');
    this.div.style.backgroundColor = params.backgroundColor;
    this.div.style.padding = '0px 1px 0px 1px';
    this.div.style.minHeight='28px';
    this.div.style.float='left';
    this.div.style.width='100%';
    this.div.style.position='relative';
    var cover;
    var lookupTree = params.callbackEmoticons.getLookupTree();
    var fontObj = params.fontObj;
    var font = fontObj.font;
    if(params.pending)
        { 
            cover = document.createElement('div');
            cover.style.width='100%';
            cover.style.height='100%';
            cover.style.backgroundColor='rgba(0, 0, 0, 0.3)';
            cover.style.zIndex='10';
            cover.style.position='absolute';
            self.div.appendChild(cover);
        }
    
    if (font == undefined)
    {
        font = 'Arial';
    }
    var color = fontObj.color;
    if (color == undefined)
    {
        color = '#000000';
    }
    var size = fontObj.size;
    if (!size)
    {
        size = 12;
    }
    var div = document.createElement("div");
    div.style.padding='0px';
    div.style.margin='0px';
    var bold = fontObj.bold;
    if(bold){
    div.style.fontWeight = 'bold';
    }
    var italic = fontObj.italic;
    if(italic)
    {
        div.style.fontStyle='italic';
    }
    div.style.color=color;
    div.style.fontFamily=font?font:'verdana, geneva, sans-serif';
    div.style.fontSize=String(size*fontScale)+'px';
    if(params.userUuid){
    var divImg = document.createElement('div');
    divImg.style="width:26px; height:26px; max-height:100%; float:left; margin:1px;overflow:hidden;";
    this.div.appendChild(divImg);
    profilePicture = new ProfilePicture(params.username);
	divImg.appendChild(profilePicture.div);
    
    }
    if (params.username != undefined)
    {
        this.div.appendChild(getDivUsername(params.username));
    }
    var indexChar = 0;
    var indexChar2 = 0;
    while (indexChar < params.str.length) {
        var res = checkForEmoticon(indexChar, params.str);
        if (res != null)
        {
            if (indexChar > indexChar2)
            {
                createText(params.str, font, color, italic, bold, size, indexChar2, indexChar);
                
            }
            indexChar = res[1] + 1;
            indexChar2 = indexChar;   
            div.innerHTML+='<img style="height:'+String(16*fontScale)+'px" src="'+window.thePageUrl+res[0]+'"></img>';
        } else
        {
            indexChar++;
        }
    }
    
    createText(params.str, font, color, italic, bold, size, indexChar2, indexChar);
    
    this.div.appendChild(div);
    this.unpend = function(){
        if(params.pending){
            self.div.removeChild(cover);
            if(profilePicture)
                profilePicture.dispose();
        };
    };
    this.equals = function(jObject){
        var font = jObject.font;
        return params.str==jObject.content&&isEquivalent(jObject.font, fontObj);
    };
    function createText(strAll, font, color, italic, bold, size, indexFrom, indexTo)
    {
            var str = (indexFrom != undefined && indexTo != undefined)?strAll.substring(indexFrom, indexTo):strAll;
            var words = str.split(" ");
            var iteratorWords = new Iterator(words);
            while(iteratorWords.hasNext())
            {
                var word = iteratorWords.next();
                if (isUrl(word))
                {
                    var fullLink=(!/^(?:f|ht)tps?\:\/\//.test(word)?"http://":"")+word;
                    div.innerHTML+='<a target="_blank" style="font-size:'+String(size * fontScale)+'px" href="'+fullLink+'">'+fullLink+'</a> ';
                }
                else
                {
                    div.innerHTML += word + " ";
                }
            }
    }

    function isUrl(s)
    {
        var regexp = /(\.com|\.co.uk|\.net|\.org|\.info|\www\.|((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:wwâ€Œâ€‹w.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?â€Œâ€‹(?:[\w]*))?))/;
        return regexp.test(s);
    }
    function checkForEmoticon(index, message)
    {
        var theChar = message.charAt(index);
        if (lookupTree == undefined)
        {
            return null;
        }
        var lTree = lookupTree;
        while (true)
        {
            var map2 = lTree[theChar];
            if (map2 == undefined)
            {
                if (lTree['url'] != undefined)
                {
                    var r = [];
                    r[0] = lTree['url'];
                    r[1] = index - 1;
                    return r;
                }
                break;
            }
            lTree = map2;
            index++;
            if (index < message.length)
            {
                theChar = message.charAt(index);
            }
        }
        return null;
    }
    function getDivUsername(user){
        var div = document.createElement('div');
        div.textContent=user;
        div.style.padding='0px !important';
        div.style.margin='0px !important';
        div.style.cursor='pointer';
        div.style.color='rgb(59, 89, 152)';
        div.style.fontWeight = "bold";
        div.style.float = "top";
        div.style.fontSize = String(11*fontScale) + 'px';
        new HoverAndClick(div, function(){div.style.textDecoration = 'underline';}, function(){}, function(e){
            params.menuMessages.show(e.pageX, e.pageY, function () {
                }, {}, [{userUiud:params.userUuid},{}, {}]);
        });
        return div;
    }
    function getImage(user){
        
    }
}
function ImageMessage(name, path, backgroundColor)
{
    this.div = document.createElement('div');
    var divImage = document.createElement('div');
    var img = document.createElement('img');
    this.div.style.backgroundColor=backgroundColor;
    img.style.maxHeight='350px';
    img.src=window.thePageUrl+'ServletImages?path='+path;
    this.div.appendChild(divImage);
    divImage.appendChild(img);
    return this.div;
}
function EnterPassword(parent, callbackSubmit, callbackClose)
{
    var self = this;
    var timer;
    var callback;
    this.div = document.createElement('div');
    var divTab = document.createElement('div');
    var buttonClose = new Window.CloseButton(function(){
        callbackClose();});
    var divInner = document.createElement('div');
    var divPassword = document.createElement('div');
    var textPassword = document.createElement('input');
    var buttonEnter = document.createElement('button');
    var divError = document.createElement('div');
    var textError = document.createElement('textarea');
    this.div.style.position = 'absolute';
    this.div.style.height = 'auto';
    this.div.style.width = 'auto';
    this.div.style.top = '50%';
    this.div.style.left = '50%';
    this.div.style.marginLeft = '-100px';
    this.div.style.backgroundColor = '#001f4d';
    this.div.style.border = '1px solid #66a3ff';
    this.div.style.zIndex = '2000';
    this.div.style.padding = '6px';
    this.div.style.borderRadius = '5px';
    this.div.style.padding='0px 3px 3px 3px';
    this.div.style.border = '1px solid #66a3ff';
    //divInner.style.border = '3px solid #0099ff';
    this.div.style.backgroundColor = '#0099ff';
    divTab.style.width='auto';
    divTab.style.float='none';
    divTab.style.height='20px';
    divInner.style.float='none';
    divInner.style.backgroundColor = '#555555';
    divInner.style.height='100%';
    divInner.style.width='auto';
    divInner.style.padding='1px';
    divPassword.style.float='none';
    textPassword.placeholder = 'Password';
    function styleText(text)
    {
        text.type = 'text';
        text.style.position = 'relative';
        text.style.float = 'left';
        text.style.height = '100%';
        text.style.width = '180px';
        text.style.fontSize = '20px';
        text.style.fontFamily = 'Arial';
        text.style.height = '30px';
        text.style.boxSizing = 'border-box';
    }
    buttonEnter.style.height = '30px';
    buttonEnter.style.fontSize = '20px';
    buttonEnter.style.boxSizing = 'border-box';
    buttonEnter.style.float='none';
    buttonEnter.style.width='100%';
    buttonEnter.style.cursor='pointer';
    buttonEnter.style.cursor='pointer';
    divError.style.position = 'relative';
    divError.style.float = 'none';
    divError.style.width = '180px';
    divError.style.boxSizing = 'border-box';
    divError.style.backgroundColor = '#eeeeee';
    divError.style.fontFamily = 'Arial';
    divError.style.fontSize = '14px';
    divError.style.display='none';
    textError.style.position = 'relative';
    textError.style.width = '100%';
    textError.style.boxSizing = 'border-box';
    textError.style.backgroundColor = 'transparent';
    textError.style.border = '0px';
    textError.style.resize='none';
    textError.style.overflowY='hidden';
    textError.readOnly=true;
    setText(buttonEnter, "Enter");
    this.setError = function (error)
    {
        if (error)
        {
            divError.style.display = 'block';
            setText(textError, error);
        }
        else
        {
            divError.style.display = 'none';
        }
    };
    this.setCallback=function(callbackIn)
    {
        callback = callbackIn;
    };
    this.show=function(hasPassword, type)
    {
        self.type=type;
        self.div.style.display='block';
    timer = new Timer(function () {
        if (flashing) {
            self.div.style.backgroundColor = initialBackgroundColor;
            flashing = false;
        } else {
            self.div.style.backgroundColor = '#ccff00';
            flashing = true;
        }
    }, 60, 6);
    };
    this.hide=function()
    {
        self.div.style.display='none';
        textPassword.value="";
        divError.style.display='none';
    };
    buttonEnter.onclick = function ()
    {
        doCallback();
    };
    addOnKeyDown(textPassword);
    function doCallback()
    {
        callbackSubmit(textPassword.value);
    }
    function addOnKeyDown(text)
    {
    text.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode == 13) {
            try
            {
            doCallback();
        }
        catch(ex){
            console.log(ex);
        }
        }
    };
    }
    this.div.appendChild(divTab);
    divTab.appendChild(buttonClose.button);
    this.div.appendChild(divInner);
    divInner.appendChild(divPassword);
    divPassword.appendChild(textPassword);
    divInner.appendChild(buttonEnter);
    divInner.appendChild(divError);
    divError.appendChild(textError);
    var flashing = false;
    var initialBackgroundColor = self.div.style.backgroundColor;
    parent.appendChild(self.div);
}
function Room(userInformation, roomInformation, callbackClosed, cssName, endpoint, callbacksFont, callbacksEmoticons, callbacksSoundEffects, callbacksImageUploader, callbacksProfileEditor)
{
    var self = this;
    var settings = new Settings(roomInformation.name, function () {
        this.set("position");
        this.set("size");
        //this is a reset function for this particualr instance of this particular class.
    });
    this.isRoom = true;
    var minWidth = 292;
    var minHeight = 240;
    this.acceptsEmoticons = true;
    this.type = roomInformation.type;
    var useCalc = true;
    this.taskBarInformation = {tooltip: 'A room you have open', icon: ('images/' + cssName + '-icon.gif'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}, attentionStyle: {backgroundColor: 'rgba(255,80,80,0.5)'}};
    this.div = document.createElement('div');
    var enterPassword;
    var pendingMessages = new PendingMessages();
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var divMain = document.createElement('div');

    var divInputText = document.createElement('div');
    var text = document.createElement('input');
    var divUploadImage;
    var imgUploadImage;
    var divProfilePicture;
    var imgProfilePicture;
    var divEmoticons;
    var imgEmoticons;
    var divFont;
    var divVideoStart;
    var imgVideoStart;
    var divVideoStop;
    var imgVideoStop;
    var divTyping;
    var divTypingHelper;
    var divTypingInner;
    var divControls = document.createElement('div');
    var divControlsInner = document.createElement('div');
    var divControls = document.createElement('div');
    var themesObject;
    var themesObjectWindow;
    var divSoundEffects = document.createElement('div');
    var imgSoundEffects = document.createElement('img');
    var divUsers = document.createElement('div');
    var imgUsers = document.createElement('img');
    var divFeed = document.createElement('div');
    if (roomInformation.type != Room.Type.videoStatic && roomInformation.type != Room.Type.videoDynamic && roomInformation.type != Room.Type.videoPm)
    {
        divProfilePicture = document.createElement('div');
        imgProfilePicture = document.createElement('img');
        divUploadImage = document.createElement('div');
        imgUploadImage = document.createElement('img');
        divEmoticons = document.createElement('div');
        imgEmoticons = document.createElement('img');
        divFont = document.createElement('div');
        divTyping = document.createElement('div');
        divTypingHelper = document.createElement('div');
        divTypingInner = document.createElement('div');
    } else
    {
        if (roomInformation.type == Room.Type.videoPm)
        {
            divVideoStart = document.createElement('div');
            imgVideoStart = document.createElement('img');
            divVideoStop = document.createElement('div');
            imgVideoStop = document.createElement('img');
        }
    }
    //SPINNER----------------------
    var spinner = new Spinner(1);
    spinner.div.style.position = 'absolute';
    spinner.div.style.width = '109px';
    spinner.div.style.height = '109px';
    spinner.div.style.left = 'calc(50% - 55px)';
    spinner.div.style.top = 'calc(50% - 55px)';
    divMain.appendChild(spinner.div);
    //!SPINNER-------------------------------

    //Users panel----------------------------------------------------------------------
    var users = new Users(false, "users", userInformation, function (username) {
        if (roomInformation.type == Room.Type.dynamic || roomInformation.type == Room.Type.static)
        {
            addAdminMessage(username + " has joined the chat!");
        }
    }, function (username) {
        if (roomInformation.type == Room.Type.dynamic || roomInformation.type == Room.Type.static)
        {
            addAdminMessage(username + " has left the chat!");
        }
    }, showProfileEditor);
    //Users panel---------------------------------------------------------------------------
    this.div.style.position = "absolute";
    this.div.style.width = '700px';
    this.div.style.height = '500px';
    this.div.style.left = '430px';
    this.div.style.top = '80px';
    var startPosition = settings.get("position");
    if (!startPosition)
    {
        startPosition = Window.getStartPosition();
    }
    this.div.style.left = String(startPosition[0]) + 'px';
    this.div.style.top = String(startPosition[1]) + 'px';
    var startSize = settings.get("size");
    if (startSize)
    {
        if (startSize[0] < minWidth)
            startSize[0] = minWidth;
        if (startSize[1] < minHeight)
            startSize[1] = minHeight;
        this.div.style.width = String(startSize[0]) + 'px';
        this.div.style.height = String(startSize[1]) + 'px';
    }
    var startZIndex = settings.get("zIndex");
    if (startZIndex)
    {
        self.div.style.zIndex = String(startZIndex);
    }
    divInner.style.position = 'absolute';
    divInner.style.border = '1px solid #66a3ff';
    divInner.style.backgroundColor = '#0099ff';
    divInner.style.padding = '0px 3px 3px 3px';
    divInner.style.borderRadius = "5px";
    divInner.style.overflow = 'hidden';
    divMain.style.width = 'calc(100% - 150px)';
    divMain.style.height = 'calc(100% - 24px)';
    divMain.style.padding = '2px';
    divMain.style.paddingBottom = '0px';
    divMain.style.position = 'relative';
    divMain.style.marginRight = '2px';
    users.div.style.float = 'left';
    users.div.style.width = '150px';
    users.div.style.height = 'calc(100% - 20px)';
    //if(!isMobile)
    //{
    if (roomInformation.type != Room.Type.videoStatic && roomInformation.type != Room.Type.videoDynamic && roomInformation.type != Room.Type.videoPm)
    {
        divFeed.style.height = 'calc(100% - 50px)';
    } else
    {
        divFeed.style.height = 'calc(100% - 22px)';
    }
    divFeed.style.marginBottom = '2px';
    divFeed.style.overflowX = 'hidden';
    divFeed.style.float = 'left';
    divInputText.style.height = '26px';
    divInputText.style.position = 'relative';
    divInputText.style.bottom = '0px';
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.height = "20px";
    divTab.style.cursor = 'move';
    divMain.style.backgroundColor = '#555555';
    divMain.style.float = 'left';
    divName.style.float = 'left';
    divName.style.paddingLeft = '5px';
    divName.style.fontFamily = 'Arial';
    verticallyCenter(divName);
    var menuOptions = [{name: 'PM', callback: function (r) {
                Lobby.getPm(r.userId);
            }}, {name: 'Ignore', callback: function (r) {
                if (!Ignore.isIgnored(r.userId))
                {
                    Ignore.ignore(r.userId);
                }
            }}];
    if (Configuration.videoEnabled)
    {
        menuOptions.push({name: 'Video PM', callback: function (r) {
                Video.getWebcamPermission(function () {
                    Lobby.getVideoPm(r.userId);
                });
            }});
    }
    var menuMessages = new Menu({options: menuOptions});
    var video;
    var optionPane;
    var videos;

    if (roomInformation.type == Room.Type.videoPm)
    {

        if (roomInformation.otherUserId == userInformation.userId)
        {
            setText(divName, "Private Video with " + roomInformation.username);
        } else
        {
            setText(divName, "Private Video with " + roomInformation.other_username);
        }
        optionPane = new OptionPane(divFeed);
        video = new Video({
            send: function (obj)
            {
                obj.type = 'video';
                websocket.send(obj);
            },
            ask: function (offer)
            {
                optionPane.show([['Yes', function () {
                            video.accept();
                        }], ['No', function () {
                            video.decline();
                        }]], "Accept Video chat request from " + userInformation.name + "?", function () {
                    video.decline();
                });
            },
            connected: function ()
            {
                divVideoStart.style.display = 'none';
                divVideoStop.style.display = 'inline';
            },
            disconnected: function ()
            {
                roomInformation.accepted = false;
                divVideoStart.style.display = 'inline';
                divVideoStop.style.display = 'none';
            }
        });
        divFeed.appendChild(video.div);
    } else
    {
        //if (roomInformation.type == Room.Type.videoStatic || roomInformation.type == Room.Type.videoDynamic)
        //{
        //    videos = new Videos(userInformation, {send: function (jObject) {
        //           websocket.send(jObject);
        //       }});
        //    divFeed.appendChild(videos.div);
        // }
        var name = roomInformation.name;
        if (roomInformation.type == Room.Type.pm) {
            if (roomInformation.usernames.length > 1)
                name = "PM with: " + (roomInformation.usernames[0] == userInformation.name ? roomInformation.usernames[1] : roomInformation.usernames[0]);
        }
        setText(divName, name);
    }

    divInputText.style.border = ' 0x solid #333333';
    divInputText.style.borderTop = '0px';
    divInputText.style.overflow = 'hidden';
    divInputText.style.borderBottomLeftRadius = '4px';
    divInputText.style.borderBottomRightRadius = '4px';
    text.type = 'text';
    text.style.width = '100%';
    text.style.border = '0px';
    text.style.margin = '0px';
    text.addEventListener('click', function ()
    {
        focusText();
    });
    text.style.boxSizing = 'border-box';
    divControls.style.backgroundColor = '#ccb3ff';
    divControls.style.border = '0px';
    divControls.style.width = '100%';
    divControls.style.position = 'relative';
    divControls.style.float = 'left';
    divFeed.style.width = '100%';
    divInputText.style.width = '100%';
    divControls.style.height = '20px';
    divControlsInner.style.float = 'right';
    divControlsInner.style.height = '16px';
    divControlsInner.style.marginTop = '2px';
    divControlsInner.style.overflow = 'hidden';
    divControlsInner.style.position = 'relative';
    text.style.height = '100%';

    setupControlButton(divUsers, imgUsers, 'images/users.gif', 'images/users_highlighted.gif', function () {
        if (showingUsers) {
            hideUsers();
        } else {
            showUsers();
        }
        if (videos)
        {
            videos.resize();
        }
    });
    setupControlButton(divSoundEffects, imgSoundEffects, 'images/sound-effects-icon.gif', 'images/sound-effects-icon-blue.gif', showSoundEffects);
    if (roomInformation.type != Room.Type.videoStatic && roomInformation.type != Room.Type.videoDynamic && roomInformation.type != Room.Type.videoPm)
    {
        divFeed.style.backgroundColor = '#e6ffff';
        divFeed.style.overflowY = 'scroll';
        setupControlButton(divProfilePicture, imgProfilePicture, 'images/profile-picture-icon.gif', 'images/profile-picture-icon-blue.gif', showProfileEditor);
        setupControlButton(divUploadImage, imgUploadImage, 'images/upload-image-icon.gif', 'images/upload-image-icon-blue.gif', showImageUploader);
        setupControlButton(divEmoticons, imgEmoticons, 'images/emoticons-icon.gif', 'images/emoticons-icon-blue.gif', showEmoticons);
        divFont.className = 'div-' + cssName + '-font';
        divFont.style.position = 'relative';
        divFont.style.float = 'right';
        divFont.style.border = '1px solid #999999';
        divFont.style.height = '16px';
        divFont.style.width = '16px';
        divFont.style.textAlign = 'center';
        divFont.style.marginRight = '6px';
        divFont.style.cursor = 'pointer';
        divFont.style.backgroundColor = '#aaaaaa';
        setText(divFont, "T");
        divFont.addEventListener("click", showFont);
        verticallyCenter(divFont);
        new Hover(divFont, function () {
            divFont.style.backgroundColor = '#000000';
            divFont.style.color = '#ffffff';
        });
        verticallyCenter(divTyping);
        divTyping.style.position = 'relative';
        divTyping.style.float = 'left';
        divTyping.style.height = '16px';
        divTyping.style.width = 'calc(100% - 140px)';
        divTyping.style.overflow = 'hidden';
        divTypingHelper.style.height = '100%';
        divTypingHelper.style.float = 'left';
        divTypingHelper.style.width = '1px';
        divTypingInner.style.fontFamily = 'Arial';
        divTypingInner.style.fontSize = '12px';
        divTypingInner.style.float = 'left';
        divTypingInner.style.paddingLeft = '5px';
        divTypingInner.style.textAlign = 'center';

    } else
    {
        if (roomInformation.type == Room.Type.videoPm)
        {


            setupControlButton(divVideoStart, imgVideoStart, 'images/video-start-icon.gif', 'images/video-start-icon-blue.gif', function () {
                video.connect();
            });
            setupControlButton(divVideoStop, imgVideoStop, 'images/video-stop-icon.gif', 'images/video-stop-icon-blue.gif', function () {
                sendDisconnect();
                video.disconnect();
            });
            divFeed.style.overflow = 'hidden';
        } else
        {

        }
        divFeed.style.backgroundColor = '#AAAAAC';

    }

    function close()
    {
        if (video)
        {
            try
            {
                video.disconnect();
            } catch (ex)
            {
                console.log(ex);
            }
        } else
        {
            if (videos)
            {
                videos.dispose();
            } else
            {
                if (callbackFontChanged)
                {
                    Font.removeCallback(callbackFontChanged);
                }
            }
        }
		console.log('close');
        websocket.close();
        self.task.remove(self);
        Windows.remove(self);
        callbackClosed(roomInformation.roomUuid);
        Themes.remove(themesObject);
        Themes.remove(themesObjectWindow);
        users.dispose();
    }
    function setupControlButton(div, img, srcImg, srcImgHover, clickCallback)
    {
        div.style.position = 'relative';
        div.style.height = '16px';
        div.style.minWidth = '16px';
        div.style.float = 'right';
        div.style.marginRight = '5px';
        div.style.cursor = 'pointer';
        div.style.zIndex = '10';
        verticallyCenter(div);
        img.style.height = '100%';
        img.src = window.thePageUrl + srcImg;
        new Hover(img, function () {
            img.src = window.thePageUrl + srcImgHover;
        }, function () {
            img.src = window.thePageUrl + srcImg;
        });
        div.addEventListener("click", clickCallback);

    }
    var timerIsTyping;
    var sendTyping = true;
    function isTyping()
    {
        if (!timerIsTyping)
        {
            timerIsTyping = new Timer(function () {
                sendTyping = true;
            }, 1000, 1);
        }
        if (sendTyping)
        {
            var jObject = {};
            jObject.type = 'typing';
            websocket.send(jObject);
            sendTyping = false;
            timerIsTyping.reset();
        }
    }
    var badCount = 0;
    var lastMessage;
    var lastSentMessage = new Date().getTime();
    function isGoodMessage(str)
    {
        var newTime = new Date().getTime();
        if (newTime - lastSentMessage > 1300)
        {
            if (str.length < 8 || str != lastMessage)
            {
                lastSentMessage = newTime;
                lastMessage = str;
                return true;
                //{
                //  badCount++;
                //}
            } else
            {
                if (!this.optionPaneDisconnected)
                    this.optionPaneDisconnected = new OptionPane(document.body);
                this.optionPaneDisconnected.show([['Ok', function () {
                        }]], "Please don't spam the same message!", function () {
                });
            }
        } //else
        //lastSentMessage = newTime;
        //if (badCount > 2)
        //{
        //  Lobby.closedReason = 'spam';
        //MySocket.closeAll();
        //}
        return false;
    }
    text.onkeydown = function (evt) {
        evt = evt || window.event;
        if (!evt.ctrlKey && evt.keyCode == 13) {
            var str = text.value;
            var wasTruncated = false;
            if (str.length > 500)
            {

                str = str.substring(0, 499);
                wasTruncated = true;

            }
            if (userInformation.name)
            {
                if (isGoodMessage(str))
                {
                    sendMessage(str);
                    addMyMessage(str);
                    if (wasTruncated)
                    {
                        addAdminMessage("The message was truncated to the maximum length of 500 characters.");
                    }
                    text.value = "";
                }
            } else
            {
                addAdminMessage("You must enter a username before you can message!");
            }
        }
        isTyping();
    };

    var showingUsers = true;
    function showUsers()
    {
        users.div.style.display = 'block';
        divInputText.style.borderBottomRightRadius = '0px';
        if (useCalc)
        {
            divMain.style.marginRight = '2px';
            divMain.style.width = 'calc(100% - 156px)';
        }
        showingUsers = true;
    }
    function hideUsers()
    {
        users.div.style.display = 'none';
        divInputText.style.borderBottomRightRadius = '4px';
        if (useCalc)
        {
            divMain.style.marginRight = '0px';
            divMain.style.width = 'calc(100% - 4px)';
        }
        showingUsers = false;
    }
    if (roomInformation.type == Room.Type.pm)
    {
        hideUsers();
    } else
    {

        if (!isMobile)
            showUsers();
        else
            hideUsers();
    }
    function verticallyCenter(element)
    {
        element.style.position = 'relative';
        element.style.top = '50%';
        element.style.transform = 'translateY(-50%)';
        element.style.msTransform = 'translateY(-50%)';
        element.style.webkitTransform = 'translateY(-50%)';
        element.style.oTransform = 'translateY(-50%)';
    }
    function showFont()
    {
        if (callbacksFont)
        {
            if (callbacksFont.unminimize)
            {
                callbacksFont.unminimize();
            }
        }
    }
    function showEmoticons()
    {
        if (callbacksEmoticons)
        {
            if (callbacksEmoticons.unminimize)
            {
                callbacksEmoticons.unminimize();
            }
        }
    }
    function showProfileEditor()
    {
        if (callbacksProfileEditor)
        {
            if (callbacksProfileEditor.show)
            {
                console.log('doing it');
                callbacksProfileEditor.show();
            }
        }
    }
    function showImageUploader()
    {
        if (callbacksImageUploader)
        {
            if (callbacksImageUploader.show)
            {
                callbacksImageUploader.show(true, undefined, {}, {send: function (jObject) {
                        websocket.send(jObject);
                    }}, roomInformation.name);
            }
        }
    }
    function showSoundEffects()
    {
        if (callbacksSoundEffects)
        {
            if (callbacksSoundEffects.unminimize)
            {
                callbacksSoundEffects.unminimize();
            }
        }
    }
    this.div.appendChild(divInner);
    divInner.appendChild(divTab);
    divInner.appendChild(divMain);
    divInner.appendChild(users.div);
    divMain.appendChild(divFeed);
    divMain.appendChild(divControls);
    divControls.appendChild(divControlsInner);
    divMain.appendChild(divInputText);
    divTab.appendChild(divName);
    divControlsInner.appendChild(divUsers);
    divUsers.appendChild(imgUsers);
    if (roomInformation.type != Room.Type.videoStatic && roomInformation.type != Room.Type.videoDynamic && roomInformation.type != Room.Type.videoPm)
    {
        divControlsInner.appendChild(divFont);
        divControlsInner.appendChild(divUploadImage);
        divUploadImage.appendChild(imgUploadImage);
        divControlsInner.appendChild(divEmoticons);
        divEmoticons.appendChild(imgEmoticons);
        divInputText.appendChild(text);
        divControlsInner.appendChild(divSoundEffects);
        divSoundEffects.appendChild(imgSoundEffects);
        divControls.appendChild(divTyping);
        divTyping.appendChild(divTypingHelper);
        divTyping.appendChild(divTypingInner);
        divControlsInner.appendChild(divProfilePicture);
        divProfilePicture.appendChild(imgProfilePicture);
    } else
    {
        if (roomInformation.type == Room.Type.videoPm)
        {
            divControlsInner.appendChild(divVideoStop);
            divVideoStop.appendChild(imgVideoStop);
            divControlsInner.appendChild(divVideoStart);
            divVideoStart.appendChild(imgVideoStart);
            divControlsInner.appendChild(divSoundEffects);
            divSoundEffects.appendChild(imgSoundEffects);
        }
    }

    this.show = function ()
    {
        self.div.style.display = 'inline';

    };
    this.hide = function ()
    {
        self.div.style.display = 'none';
    };
    this.newRoomInformation = function (jObject)
    {
        if (roomInformation.type == Room.Type.videoPm)
        {
            if (jObject.accepted)
            {
                roomInformation.accepted = true;
            }
        }
    };
    var callbackFontChanged = function (font) {
        text.style.fontSize = String(font.size * (function () {
            if (isMobile)
                return Font.mobileScale;
            return 1;
        })()) + 'px';
        text.style.fontFamily = font.family;
        text.style.color = font.color;
        if (font.bold)
        {
            text.style.fontWeight = 'Bold';
        } else
        {
            text.style.fontWeight = '';
        }
        if (font.italic)
        {
            text.style.fontStyle = 'italic';
        } else
        {
            text.style.fontStyle = 'normal';
        }
        if (font.underlined)
        {
            text.style.textDecoration = 'underline';
        } else
        {
            text.style.textDecoratino = 'none';
        }
    };
    var updateFont = function () {
        if (Font.latest) {
            callbackFontChanged(Font.latest);
        }
    };
    updateFont();
    Font.addCallback(callbackFontChanged);
    function addMessage(jObject)
    {
        if (pendingMessages.unpendIfPending(jObject))
            return;
        if (addMessage.color1)
        {
            addMessage.color1 = false;
            addMessage.backgroundColor = '#e6f2ff';
        } else
        {
            addMessage.color1 = true;
            addMessage.backgroundColor = '#e6e6ff';
        }

        var div = new Message({str: jObject.content,
            callbackEmoticons: callbacksEmoticons,
            fontObj: jObject.font,
            userUuid: jObject.userId,
            username: jObject.name,
            backgroundColor: addMessage.backgroundColor,
            pending: false,
            menuMessages: menuMessages}).div;
        if (div)
        {
            divFeed.appendChild(div);
        }
        scrollFeed();
        overflowFeed();
    }
    function addMyMessage(str)
    {
        var font = callbacksFont.getFont();
        if (addMessage.color1)
        {
            addMessage.color1 = false;
            addMessage.backgroundColor = '#e6f2ff';
        } else
        {
            addMessage.color1 = true;
            addMessage.backgroundColor = '#e6e6ff';
        }

        var message = new Message({str: str,
            callbackEmoticons: callbacksEmoticons,
            fontObj: font, userUuid: userInformation.userId,
            username: userInformation.name,
            backgroundColor: addMessage.backgroundColor,
            pending: true,
            menuMessages: menuMessages});
        if (message.div)
        {
            divFeed.appendChild(message.div);
            pendingMessages.add(message);
        }
        scrollFeed();
        overflowFeed();
    }
    function addAdminMessage(str)
    {
        var div = new Message({str: str,
            callbackEmoticons: callbacksEmoticons,
            fontObj: {color: "#4e0000", font: "Arial", bold: true, italic: false, size: 10},
            username: "Admin",
            backgroundColor: addMessage.backgroundColor,
            pending: false,
            menuMessages: menuMessages});
        if (div)
        {
            divFeed.appendChild(div);
        }
        scrollFeed();
        overflowFeed();
    }
    function addImageMessage(name, path)
    {
        if (name == userInformation.name)
        {
            name = 'You';
        }
        addAdminMessage(name + " sent image:");
        var div = new ImageMessage(name, path, addMessage.backgroundColor);
        if (div)
        {
            divFeed.appendChild(div);
        }
        scrollFeed();
        overflowFeed();
    }
    function sendMessage(str)
    {
        var jObject = {};
        jObject.type = 'message';
        jObject.content = str;
        jObject.font = callbacksFont.getFont();
        jObject.name = userInformation.name;
        if (roomInformation.type == Room.Type.pm)
        {
            console.log("notify");
            jObject.notify = true;
        }
        if (websocket)
        {
            websocket.send(jObject);
        }
    }
    function overflowFeed()
    {
        while (divFeed.children.length > 600) {
            divFeed.removeChild(divFeed.firstChild);
        }
    }
    function scrollFeed()
    {

        divFeed.scrollTop = divFeed.scrollHeight;
    }
    this.insertEmoticon = function (string)
    {
        var index = text.selectionStart;
        if (!index)
        {
            index = text.value.length;
        }
        var str = text.value;
        str = str.insert(index, string);
        text.value = str;
        focusText();
        index += string.length;
        text.setSelectionRange(index, index);
    };
    this.sendSoundEffect = function (url, name)
    {
        var jObject = {};
        jObject.type = 'sound';
        jObject.url = url;
        jObject.sound_name = name;
        jObject.name = userInformation.name;
        websocket.send(jObject);
        if (roomInformation.type == Room.Type.dynamic || roomInformation.type == Room.Type.static || roomInformation.type == Room.Type.pm)
        {
            addAdminMessage("you sent sound: " + jObject.sound_name);
        }
    };
    var websocket;
    var onConnect = function (jObject)
    {
        if (enterPassword)
        {
            enterPassword.hide();
        }
        if (jObject.successful)
        {
            if (roomInformation.message)
            {
                interpret(roomInformation.message);
                self.task.attention();
            }
        } else
        {
            if (jObject.reason && enterPassword)
            {
                enterPassword.setError(jObject.reason);
            }
        }
    };
    function gotVideo(jObject)
    {
        switch (jObject.webcam_type)
        {
            case "request":
                video.recievedOffer(jObject);
                break;
            case "ice":
                video.recievedIce(jObject);
                break;
            case "reply":
                if (jObject.accepted)
                {
                    video.accepted(jObject);
                } else

                {

                }
                break;
            case "video_connect":
                if (roomInformation.accepted)
                {
                    video.connect();
                }
                break;
            case "video_disconnect":
                if (video.connected)
                {
                    video.disconnect();
                }
                break;
        }

    }
    function sendDisconnect()
    {
        var jObject = {};
        jObject.type = 'video';
        jObject.webcam_type = 'video_disconnect';
        websocket.send(jObject);
    }
    function getUsers()
    {
        var jObject = {};
        jObject.type = 'users';
        jObject.roomUuid = roomInformation.roomUuid;
        websocket.send(jObject);
    }
    function gotMessage(jObject)
    {
        if (!Ignore.isIgnored(jObject.userId))
        {
            if (roomInformation.type == Room.Type.pm)
            {
                self.task.attention();
                SoundEffects.pm();
            } else
            {
                SoundEffects.message();
            }
            addMessage(jObject);
        }
    }
    var timerGotTyping;
    function gotTyping(jObject)
    {
        if (!Ignore.isIgnored(jObject.userId))
        {
            if (!timerGotTyping)
            {
                timerGotTyping = new Timer(function () {
                    setText(divTypingInner, "");
                }, 3000, 1);
            } else
            {
                timerGotTyping.reset();
            }
            setText(divTypingInner, jObject.from + " is typing..");
        }
    }
    function gotUsers(jObject)
    {
        if (roomInformation.type == Room.Type.videoPm)
        {
            if ((jObject.users.indexOf(roomInformation.otherUserId) < 0) && video && video.connected)
            {
                video.disconnect();
            }
        } else
        {
            if (videos)
            {
                videos.updateUsers(jObject);
            }
        }
        users.listUsers(jObject.users);
    }
    function gotSound(jObject)
    {
        if (!Ignore.isIgnored(jObject.userId))
        {
            SoundEffects.playUserSoundEffect(jObject.url);
            if (roomInformation.type == Room.Type.dynamic || roomInformation.type == Room.Type.static || roomInformation.type == Room.Type.pm)
            {
                addAdminMessage(jObject.name + " sent sound: " + jObject.sound_name);
            }
        }
    }
    function gotImage(jObject)
    {
        if (!Ignore.isIgnored(jObject.userId))
        {
            addImageMessage(jObject.name, jObject.path);
        }
    }
    function initializeWebsocket()
    {
        websocket = new MySocket("chat_room");
        websocket.onopen = function () {
            if (roomInformation.has_password)
            {
                enterPassword = new EnterPassword(divFeed, function (password) {
                    connect(password);
                }, close);
            } else
            {
                connect();
            }
        };

        websocket.onmessage = function (jObject)
        {
            interpret(jObject);
        };
    }
    function connect(password)
    {
        console.log("connecting");
        spinner.show();
        var jObject = {};
        jObject.type = "connect";
        if (password && password.length > 0)
        {
            jObject.password = password;
        }
        jObject.user_id = userInformation.id;
        jObject.roomUuid = roomInformation.roomUuid;
        websocket.send(jObject);
    }
    function interpret(jObject)
    {
        switch (jObject.type)
        {
            case "message":
                gotMessage(jObject);
                break;
            case "typing":
                gotTyping(jObject);
                break;
            case "connect":
                onConnect(jObject);
                break;
            case "users":
                gotUsers(jObject);
                break;
            case "video":
                if (videos)
                {
                    videos.recieved(jObject);
                } else
                {
                    gotVideo(jObject);
                }
                break;
            case "sound":
                gotSound(jObject);
                break;
            case "image":
                gotImage(jObject);
                break;
            case "upload_image":
                callbacksImageUploader.interpret(jObject);
                break;
            case "finished_loading":
                spinner.hide();
                break;
        }

    }
    makeUnselectable(this.div);
    makeTextSelectable(divFeed);
    themesObject = {components: [
            {name: 'controls', elements: [divControls]},
            {name: 'feed', elements: [divFeed]},
            {name: 'body', elements: [divMain]},
            {name: 'text', elements: [divName]}
        ],
        callback: function (theme) {

        }
    };
    Themes.register(themesObject, undefined);
    initializeWebsocket();
    themesObjectWindow = Window.style(self.div, divInner, divTab);
    var windowInformation = new WindowInformation(true, true, minWidth, minHeight, Windows.maxWidthPx, Windows.maxHeightPx, 0, 100, 0, Windows.maxYPx, true, true, false);
    var windowCallbacks = new WindowCallbacks(function () {
        if (videos)
        {
            videos.resize();
        }
        else {
            scrollFeed();
        }
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
        settings.set("size", [self.div.offsetWidth, self.div.offsetHeight]);
    }, function () {
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
    }
    ,
            function () {
                self.task.minimize();
            },
            function () {
                self.task.maximize();
                if (videos)
                {
                    videos.resize();
                }
                focusText();
            },
            function () {
                close();
            }, function (zIndex) {
        settings.set("zIndex", zIndex);
    },
            function () {
            },
            function () {
            },
            function () {
            },
            function () {
                focusText();
            });
    var params = {obj: this,
        minimized: false,
        divTab: divTab,
        divInner: divInner,
        windowInformation: windowInformation,
        callbacks: windowCallbacks};
    Windows.add(params);
    TaskBar.add(this);
    if (roomInformation.type == Room.Type.pm && roomInformation.username != userInformation.name)
    {
        self.hide();
        if (roomInformation.message)
        {
            self.task.attention();
        }
        self.task.flash();
    }
    if (roomInformation.show)
        self.task.unminimize();
    function focusText() {
        console.log('focus');
        new Task(function () {
            text.focus();
        }).run();
    }
}
Room.Type = {static: 'static', dynamic: 'dynamic', pm: 'pm', videoStatic: 'video_static', videoDynamic: 'video_dynamic', videoPm: 'video_pm'};
function Rooms(mapIdToRoom, callbacks, userInformation)
{
    var self = this;
    var selfRooms = this;
    var settings = new Settings("#rooms", function () {
        this.set("position");
        this.set("showing");
        this.set("size");
        //this is a reset function for this particualr instance of this particular class.
    });
    var minWidth=200;
    var minHeight=100;
    this.type = 'Rooms';
    this.taskBarInformation = {tooltip: 'Lists all rooms', icon: ('images/rooms-icon.gif'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var divMain = document.createElement('div');
    this.div.style.position = "absolute";
    this.div.style.width = '200px';
    this.div.style.height = '300px';
    this.div.style.top = '80px';
    this.div.style.left = '10px';
    divInner.style.position='absolute';
    divInner.style.border = '1px solid #66a3ff';
    //divInner.style.border = '3px solid #0099ff';
    divInner.style.backgroundColor = '#0099ff';
    divInner.style.padding = '0px 3px 3px 3px';
    divInner.style.borderRadius = "5px";
    divInner.style.overflow = 'hidden';
    var startPosition = settings.get("position");
    if (startPosition)
    {
        this.div.style.left = String(startPosition[0]) + 'px';
        this.div.style.top = String(startPosition[1]) + 'px';
    }
    var startSize = settings.get("size");
    if (startSize)
    {
        if(startSize[0]<minWidth)
            startSize[0]=minWidth;
        if(startSize[1]<minHeight)
            startSize[1]=minHeight;
        this.div.style.width = String(startSize[0]) + 'px';
        this.div.style.height = String(startSize[1]) + 'px';
    }  var startZIndex = settings.get("zIndex");
        if (startZIndex)
        {
            self.div.style.zIndex=String(startZIndex);
        }
    
    var menuBarOptions=[{name: 'Text room', callback: function () {
                            CreateRoom.show(createRoom, true, Room.Type.dynamic);
                        }}];
        if(Configuration.videoEnabled)
    menuBarOptions.push({name: 'Video room', callback: function () {
                            CreateRoom.show(createRoom, true, Room.Type.videoDynamic);
                        }});
    var menuBar = new MenuBar({options: [{name: 'Add', options: menuBarOptions}]}, {left: 0, top: -2});
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.height = "20px";
    divTab.style.cursor = 'move';
    divTab.style.padLeft = '10px';
    divName.style.float = 'left';
    divName.style.paddingLeft = '5px';
    divName.style.fontFamily = 'Arial';
    verticallyCenter(divName);
    setText(divName, "Rooms");
    divMain.style.backgroundColor = '#555555';
    divMain.style.position = 'relative';
    divMain.style.float = 'left';
    divMain.style.height = 'calc(100% - 41px)';
    divMain.style.width = "100%";
    divMain.style.overflowY = 'auto';
    divMain.style.paddingBottom = '1px';
    var mapIdToRoomEntry = {};
    var arrayRoomEntries = [];
    var openEnabled=false;
    this.enableOpen=function(){openEnabled=true;};
    this.listRooms = function (rooms)
    {
        var alreadyPresent = [];
        var i = 0;
        for (var i = rooms.length - 1; i >= 0; i--)
        {
            var r = rooms[i];
            if (r.roomUuid)
            {
                if (!mapIdToRoomEntry[r.roomUuid]&&((!isMobile)||(r.type!=Room.Type.videoDynamic&&r.type!=Room.Type.videoStatic&&r.type!=Room.Type.videoPm)))
                {
                    var roomEntry = new RoomEntry(r);
                    var j = 0;
                    var inserted = false;
                    var lowerCaseName = roomEntry.info.name.toLowerCase();
                    while (j < arrayRoomEntries.length)
                    {
                        var rEntry = arrayRoomEntries[j];
                        if (rEntry.info.name.toLowerCase() > lowerCaseName)
                        {
                            mapIdToRoomEntry[r.roomUuid] = roomEntry;
                            arrayRoomEntries.splice(j, 0, roomEntry);
                            divMain.insertBefore(roomEntry.div, divMain.children[j]);
                            inserted = true;
                            break;
                        }
                        j++;
                    }
                    if (!inserted)
                    {
                        mapIdToRoomEntry[r.roomUuid] = roomEntry;
                        arrayRoomEntries.push(roomEntry);
                        divMain.appendChild(roomEntry.div);
                    }
                }
                alreadyPresent.push(r.roomUuid);
            }
        }
        i = 0;
        while (i < arrayRoomEntries.length)
        {
            var roomInfo = arrayRoomEntries[i].info;
            if (alreadyPresent.indexOf(roomInfo.roomUuid) < 0)
            {
                divMain.removeChild(mapIdToRoomEntry[roomInfo.roomUuid].div);
                arrayRoomEntries.splice(i, 1);
                delete mapIdToRoomEntry[roomInfo.roomUuid];
            }
            i++;
        }
    };
    function createRoom(name, password, type)
    {
        var jObject = {};
        jObject.type = 'create_room';
        jObject.name = name;
        jObject.room_type = type;
        if (password && password.length > 0)
        {
            jObject.has_password = true;
            jObject.password = password;
        }
        else
        {
            jObject.has_password = false;
        }
        callbacks.send(jObject);
    }
    function RoomEntry(r)
    {
        var self = this;
        this.info = r;
        this.div = document.createElement('div');
        var divName = document.createElement('div');
        var divImg = document.createElement('div');
        var img = document.createElement('img');
        this.div.style.position = 'relative';
        this.div.style.height = '30px';
        this.div.style.width = '100%';
        this.div.style.backgroundColor = '#f0f0f0';
        this.div.style.cursor = 'pointer';
        this.div.style.float = 'left';
        this.div.style.border = '1px solid #4d0026';
        this.div.style.borderRadius = '5px';
        this.div.style.left = '-1px';
        this.div.style.marginLeft = '2px';
        this.div.style.marginTop = '1px';
        this.div.style.overflow = 'hidden';
        this.div.style.width = 'calc(100% - 6px)';
        this.div.style.paddingLeft = '2px';
        divName.style.float = 'left';
        divName.style.fontFamily = 'Arial';
        divName.style.height = '19px';
        divName.style.paddingLeft = '0px';
        divName.style.textOverflow = 'ellipsis';
        divName.style.overflow = 'hidden';
        divName.style.whiteSpace = 'nowrap';
        divName.style.width = '100%';
        divName.style.width = 'calc(100% - 28px)';
        divImg.style.float = 'left';
        divImg.style.height = '28px';
        divImg.style.width = '28px';
        img.style.width = '100%';
        verticallyCenter(divName);
        verticallyCenter(divImg);
        verticallyCenter(img);
        setText(divName, r.name);
        this.div.appendChild(divName);
        this.div.appendChild(divImg);
        switch (r.type)
        {
            case Room.Type.static:
                img.src = window.thePageUrl+'images/keyboard.png';
                break;
            case Room.Type.videoStatic:
                img.src = window.thePageUrl+'images/webcam.png';
                break;
            case Room.Type.videoDynamic:
                img.src = window.thePageUrl+'images/webcam.png';
                break;
            default:
                img.src = window.thePageUrl+'images/keyboard.png';
                break;
        }

        divImg.appendChild(img);
        new Hover(this.div, function () {
            self.div.style.backgroundColor = '#fdfdfe';
        }, function () {
        });
        this.div.onmousedown = function ()
        {
            Windows.cancelBringToFront(selfRooms);
           // if (r.type == Room.Type.videoDynamic || r.type == Room.Type.videoStatic)
            //{
                    //Video.getWebcamPermission(function () {
                    showRoom();
                    //});
            //}
          //  else
          //  {
      //          showRoom();
           // }
            function showRoom()
            {
                if(!openEnabled){
                    var optionPaneSignIn = new OptionPane(divMain);
                    optionPaneSignIn.show([['Ok', function () {
                            }]], "You must enter a username to access chatrooms!", function () {
                    });
                    optionPaneSignIn.div.style.left = '6px';
                    optionPaneSignIn.div.style.width = '180px';
                    optionPaneSignIn.div.style.marginLeft = '0px';
                    return;
                }
                var room = mapIdToRoom[r.roomUuid];
                if (room)
                {
                    room.task.unminimize();
                }
                else
                {
                    Lobby.openRoom(r);
                }
            }
        };
    }
    function verticallyCenter(element)
    {
        element.style.position = 'relative';
        element.style.top = '50%';
        element.style.transform = 'translateY(-50%)';
        element.style.msTransform = 'translateY(-50%)';
        element.style.webkitTransform = 'translateY(-50%)';
        element.style.oTransform = 'translateY(-50%)';
    }
    this.div.appendChild(divInner);
    divInner.appendChild(divTab);
    divTab.appendChild(divName);
    divInner.appendChild(menuBar.div);
    divInner.appendChild(divMain);
    this.show = function ()
    {
        self.div.style.display = 'inline';
        settings.set("showing", true);
    };
    this.hide = function ()
    {
        self.div.style.display = 'none';
        settings.set("showing", false);
    };
    var showing = settings.get("showing");
    if(showing)
    {
        this.show();
    }
    else
    {
        if(showing==false)
        {
            this.hide();
        }
    }
    makeUnselectable(this.div);
    Themes.register({components:[
            {name:'body', elements:[divMain]},
            {name:'text', elements:[divName]}
        ],
    callback:function(theme){
        
    }});
    Window.style(self.div, divInner, divTab);
    var windowInformation = new WindowInformation(true, true, 200, 100, 199, Windows.maxHeightPx, 0, 100, 0, Windows.maxYPx, true, false, true);
var windowCallbacks=         new WindowCallbacks(function(){
                settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
                settings.set("size", [200, self.div.offsetHeight]);
            }, function(){
        if(self.div.offsetLeft&&self.div.offsetTop)
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
         },
         function(){
        self.task.minimize();}, undefined, function(){
        self.task.minimize();}, function(zIndex){settings.set("zIndex", zIndex);});
    var  params = {obj: this,
        minimized: false,
        divTab: divTab,
        divInner: divInner,
        windowInformation: windowInformation,
        callbacks: windowCallbacks};
    Windows.add( params);
    TaskBar.add(this);
}
function CreateWall()
{
    var self = this;
    var timer;
    var callback;
    this.div = document.createElement('div');
    var divName = document.createElement('div');
    var textName = document.createElement('input');
    var divPassword = document.createElement('div');
    var textPassword = document.createElement('input');
    var divButtons = document.createElement('div');
    var buttonCreate = document.createElement('button');
    var buttonCancel = document.createElement('button');
    var divError = document.createElement('div');
    var textError = document.createElement('textarea');
    this.div.style.position = 'fixed';
    this.div.style.height = 'auto';
    this.div.style.width = 'auto';
    this.div.style.top = '50%';
    this.div.style.left = '50%';
    this.div.style.marginLeft = '-100px';
    this.div.style.backgroundColor = '#001f4d';
    this.div.style.border = '1px solid #66a3ff';
    this.div.style.zIndex = '2000';
    this.div.style.padding = '6px';
    this.div.style.borderRadius = '5px';
    divName.style.float='none';
    divPassword.style.float='none';
    divButtons.style.position = 'relative';
    divButtons.style.float = 'none';
    divButtons.style.width = '180px';
    divButtons.style.height = 'auto';
    textName.placeholder = 'Name';
    styleText(textName);
    textPassword.placeholder = 'Password(optional)';
    styleText(textPassword);
    function styleText(text)
    {
        text.type = 'text';
        text.style.position = 'relative';
        text.style.float = 'left';
        text.style.height = '100%';
        text.style.width = '180px';
        text.style.fontSize = '20px';
        text.style.fontFamily = 'Arial';
        text.style.height = '30px';
        text.style.boxSizing = 'border-box';
    }
    
    
    
    buttonCreate.style.height = '30px';
    buttonCreate.style.width='50%';
    buttonCreate.style.fontSize = '20px';
    buttonCreate.style.boxSizing = 'border-box';
    buttonCreate.style.float='left';
    buttonCancel.style.height = '30px';
    buttonCancel.style.width='50%';
    buttonCancel.style.fontSize = '20px';
    buttonCancel.style.boxSizing = 'border-box';
    buttonCancel.style.float='right';
    buttonCancel.style.cursor='pointer';
    buttonCreate.style.cursor='pointer';
    divError.style.position = 'relative';
    divError.style.float = 'left';
    divError.style.width = '180px';
    divError.style.boxSizing = 'border-box';
    divError.style.backgroundColor = '#eeeeee';
    divError.style.fontFamily = 'Arial';
    divError.style.fontSize = '14px';
    divError.style.display='none';
    textError.style.position = 'relative';
    textError.style.width = '100%';
    textError.style.boxSizing = 'border-box';
    textError.style.backgroundColor = 'transparent';
    textError.style.border = '0px';
    textError.style.resize='none';
    textError.style.overflowY='hidden';
    textError.readOnly=true;
    setText(buttonCreate, "Create");
    setText(buttonCancel, "Cancel");
    this.setError = function (error)
    {
        if (error)
        {
            divError.style.display = 'block';
            setText(textError, error);
        }
        else
        {
            divError.style.display = 'none';
        }
    };
    this.setCallback=function(callbackIn)
    {
        callback = callbackIn;
    };
    this.show=function(hasPassword, type)
    {
        self.type=type;
        self.div.style.display='block';
        if(hasPassword)
        {
            divPassword.style.display='block';
        }
        else
        {
            divPassword.style.display='none';
        }
    timer = new Timer(function () {
        if (flashing) {
            self.div.style.backgroundColor = initialBackgroundColor;
            flashing = false;
        } else {
            self.div.style.backgroundColor = '#ccff00';
            flashing = true;
        }
    }, 60, 6);
    };
    this.hide=function()
    {
        self.div.style.display='none';
        textName.value="";
        textPassword.value="";
        divError.style.display='none';
    };
    buttonCreate.onclick = function ()
    {
        doCallback();
    };
    buttonCancel.onclick = function ()
    {
        self.hide();
    };
    addOnKeyDown(textName);
    addOnKeyDown(textPassword);
    function doCallback()
    {
        callback(textName.value, textPassword.value, self.type);
    }
    function addOnKeyDown(text)
    {
    text.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode == 13) {
            try
            {
            doCallback();
        }
        catch(ex){
            console.log(ex);
        }
        }
    };
    }
    textName.addEventListener('click',function()
    {
      textName.focus();  
    });
    textPassword.addEventListener('click',function()
    {
      textPassword.focus();  
    });
    this.div.appendChild(divName);
    divName.appendChild(textName);
    this.div.appendChild(divPassword);
    divPassword.appendChild(textPassword);
    this.div.appendChild(divButtons);
    divButtons.appendChild(buttonCreate);
    divButtons.appendChild(buttonCancel);
    this.div.appendChild(divError);
    divError.appendChild(textError);
    var flashing = false;
    var initialBackgroundColor = self.div.style.backgroundColor;
}
CreateRoom.show = function (callback, hasPassword, type)
{
    if(!CreateRoom.instance)
    {
    CreateRoom.instance = new CreateRoom();
    document.body.appendChild(CreateRoom.instance.div);
    }
    CreateRoom.instance.setCallback(callback);
    CreateRoom.instance.show(hasPassword, type);
};
CreateRoom.hide = function ()
{
    if(CreateRoom.instance)
    {
        CreateRoom.instance.hide();
    }
};
CreateRoom.error = function (message)
{
    if (CreateRoom.instance)
    {
        CreateRoom.instance.setError(message);
    }
};

//This is very fucking useful. It gets rid of those stupid api differences between browsers.
var RTCPeerConnection = null;
var getUserMedia = null;
var attachMediaStream = null;
var reattachMediaStream = null;
var webrtcDetectedBrowser = null;
function trace(text) {
    if (text[text.length - 1] == '\\') {
        text = text.substring(0, text.length - 1);
    }
    console.log((performance.now() / 1000).toFixed(3) + ": " + text);
}

if (navigator.mozGetUserMedia) {
    console.log("This appears to be Firefox");
    webrtcDetectedBrowser = "firefox";

    RTCPeerConnection = mozRTCPeerConnection;
    RTCSessionDescription = mozRTCSessionDescription;
    RTCIceCandidate = mozRTCIceCandidate;
    getUserMedia = navigator.mozGetUserMedia.bind(navigator);
    attachMediaStream = function (element, stream) {
        console.log("Attaching media stream");
        element.mozSrcObject = stream;
        element.play();
    };
    reattachMediaStream = function (to, from) {
        console.log("Reattaching media stream");
        to.mozSrcObject = from.mozSrcObject;
        to.play();
    };
    MediaStream.prototype.getVideoTracks = function () {
        return [];
    };
    MediaStream.prototype.getAudioTracks = function () {
        return [];
    };
} else if (navigator.webkitGetUserMedia) {
    console.log("This appears to be Chrome");
    webrtcDetectedBrowser = "chrome";
    RTCPeerConnection = webkitRTCPeerConnection;
    getUserMedia = navigator.webkitGetUserMedia.bind(navigator);

    attachMediaStream = function (element, stream) {
        if (typeof element.srcObject !== 'undefined') {
            element.srcObject = stream;
        } else
        {
            if (typeof element.mozSrcObject !== 'undefined') {
                element.mozSrcObject = stream;
            } else
            {
                if (typeof element.src !== 'undefined') {
                    element.src = URL.createObjectURL(stream);
                } else {
                    console.log('Error attaching stream to element.');
                }
            }
        }
    };
    reattachMediaStream = function (to, from) {
        to.src = from.src;
    };
    if (!webkitMediaStream.prototype.getVideoTracks) {
        webkitMediaStream.prototype.getVideoTracks = function () {
            return this.videoTracks;
        };
        webkitMediaStream.prototype.getAudioTracks = function () {
            return this.audioTracks;
        };
    }
    if (!webkitRTCPeerConnection.prototype.getLocalStreams) {
        webkitRTCPeerConnection.prototype.getLocalStreams = function () {
            return this.localStreams;
        };
        webkitRTCPeerConnection.prototype.getRemoteStreams = function () {
            return this.remoteStreams;
        };
    }
} else {
    console.log("Browser does not appear to be WebRTC-capable");
}

navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;









function Data(callbacks)
{
    var self = this;
    var pc;   
    var channel;
    this.connected = false;
    
    if (!navigator.getUserMedia) {
        return alert('getUserMedia not supported in this browser.');
    }
    self.connected = true;//moved from inside onaddstream.
    function onopenHandler()
    {
        if(self.onopen){self.onopen();};
    }
    function oncloseHandler()
    {
        if(self.onclose){self.onclose();};
    }
    function onmessageHandler(msg)
    {
        if(self.onmessage){self.onmessage(msg);};
    }
    function createNewPC() {
        pc = new RTCPeerConnection(null);
        pc.oniceconnectionstatechange = function () {
            if (pc.iceConnectionState == 'disconnected') {
                self.disconnect();
            }
        };
        pc.onicecandidate = function gotIceCandidate(event) {
            if (event.candidate != null) {
                callbacks.send({data_type: 'ice', ice: event.candidate});
            }
        };
        pc.ondatachannel = function(event){
            channel = event.channel;
            channel.onmessage = onmessageHandler;
            channel.onopen =onopenHandler;
            channel.onclose = oncloseHandler;
        };
    }
    this.recievedIce = function (jObject) {
        if (jObject.ice != undefined) {
            pc.addIceCandidate(new RTCIceCandidate(jObject.ice));
        }
    };
    this.disconnect = function ()
    {
        console.log('closed');
        if (pc)
        {
            pc.close();
        }
        self.connected = false;
        if (callbacks.disconnected) {
            callbacks.disconnected();
        }
    };
    this.connect = function ()
    {
        pc = undefined;
        createNewPC();
            pc.createOffer(function (offer)
            {
                pc.setLocalDescription(new RTCSessionDescription(offer), function ()
                {
                    callbacks.send({data_type: 'request', offer: offer});
                }, err.bind(null, 'connect 2'));
            }, err.bind(null, 'connect 1'));
    };
    this.recievedOffer = function (jObject)
    {
        if (jObject.offer)
        {
            createNewPC();
            pc.setRemoteDescription(new RTCSessionDescription(jObject.offer), function ()
            {
                callbacks.ask(jObject.offer);
            }, err.bind(null, 'recievedOffer'));
        }
    };
    this.accept = function ()
    {
        Video.getWebcamPermission(function () {
        channel = pc.createDataChannel("sendChannel");
        channel.onmessage = onmessageHandler;
        channel.onopen = onopenHandler;
        channel.onclose = oncloseHandler;
            pc.createAnswer(function (answer)
            {
                    var rtcSessionDescription = new RTCSessionDescription(answer);
                    //This is where the problem occurs, around here. If there is a delay, its fine.
                    pc.setLocalDescription(rtcSessionDescription, function () {
                        callbacks.send({data_type: 'reply', accepted: true, answer: answer});
                        callbacks.connected();
                    }, err.bind(null, 'accept 2'));
            }, err.bind(null, 'accept 1'));
        });
    };
    this.decline = function ()
    {
        callbacks.send({data_type: 'reply', accepted: false});
    };
    this.accepted = function (jObject)
    {
        pc.setRemoteDescription(new RTCSessionDescription(jObject.answer), function () {
            callbacks.connected();
        }, err.bind(null, 'accepted'));
    };
function err(source, message)
{
    console.log(source);
    console.log(message);
}
}

function Datas(userInformation, callbacks)
{
    var self = this;
    var mapUserToData = {};
    var arrayUsers = [];
    this.updateUsers = function (jObject)
    {
        var users = jObject.users;
        var usernames = [];
        for (var i = 0; i < users.length; i++)
        {
            var user = users[i];
            if (user.name != userInformation.name)
            {
                var video = mapUserToData[user.name];
                if (video)
                {

                }
                else
                {
                    addUser(user);
                }
                usernames.push(user.name);
            }

        }
        var i = 0;
        while (i < arrayUsers.length)
        {
            if (usernames.indexOf(arrayUsers[i]) < 0)
            {
                //remove user
                remove(i);
            }
            else
            {
                i++;
            }
        }
        doPresentation();
    };
    function remove(user)
    {
        mapUserToData[arrayUsers[user]].disconnect();
        var video = mapUserToData[arrayUsers[user]];
        self.div.removeChild(video.div);
        delete video;
        arrayUsers.splice(user, 1);
    }
    function addUser(toUser)
    {

        var data = new Data({
            send: function (obj)
            {
                obj.type = 'data';
                obj.from = userInformation.name;
                obj.to = toUser.name;
                callbacks.send(obj);
            },
            ask: function (offer)
            {
                data.accept();
            },
            connected: function ()
            {

            },
            disconnected: function ()
            {

            },
            addedStream: function ()
            {
                data.div.style.display='block';
                doPresentation();
            },
            removedStream: function ()
            {
                data.div.style.display='none';
                doPresentation();
            }
        });
        mapUserToData[toUser.name] = data;
        arrayUsers.push(toUser.name);
        sendReady(toUser);
    }
    function sendReady(toUser)
    {
        var jObject = {};
        jObject.type = 'data';
        jObject.data_type = 'ready';
        jObject.to = toUser.name;
        jObject.from = userInformation.name;
        callbacks.send(jObject);
    }
    this.recieved = function (jObject)
    {
        var video = mapUserToData[jObject.from];
        if (video)
        {
            console.log(jObject.webcam_type);
            switch (jObject.webcam_type)
            {
                case "do_connect":
                    video.connect();
                    break;
                case "ice":
                    video.recievedIce(jObject);
                    break;
                case "data_connect":
                    video.connect(jObject);
                    break;
                case "data_disconnect":
                    video.disconnect(jObject);
                    break;
                case "request":
                    video.recievedOffer(jObject);
                    break;
                case "reply":
                    video.accepted(jObject);
                    break;

            }
        }
    };
    this.dispose = function ()
    {
        for(var i=0; i<arrayUsers.length; i++)
        {
            remove(i);
        }
        Datas.instances.splice(Datas.instances.indexOf(self), 1);
    };
    Datas.instances.push(self);
}
Datas.instances = [];
Datas.showMe = function (bool)
{
    for (var i = 0; i < Datas.instances.length; i++)
    {
        var videos = Datas.instances[i];
        videos.showMe(bool);
    }
};
function DataConnectionsHandler(wallInfo, userInfo, callbacks)//does the clever rtc stuff to establish connections through other connections.
{
    var datas = new Datas(userInfo,
    {
        send:function(obj){}
    });
    function getUsers()
    {
        var jObject = {type:'users','wall_id':wallInfo.id};
        callbacks.send(jObject);
    }
    this.interpret=function(msg)
    {
      switch(msg.type)
      {
          case 'users':
              break;
      }
    };
}
function CreateWallItem()
{
    var self = this;
    this.div = document.createElement('div');
    var divName = document.createElement('div');
    var textName = document.createElement('input');
    var divPassword = document.createElement('div');
    var textPassword = document.createElement('input');
    var divButtons = document.createElement('div');
    var buttonCreate = document.createElement('button');
    var buttonCancel = document.createElement('button');
    var divError = document.createElement('div');
    var textError = document.createElement('textarea');
    this.div.style.position = 'fixed';
    this.div.style.height = 'auto';
    this.div.style.width = 'auto';
    this.div.style.top = '50%';
    this.div.style.left = '50%';
    this.div.style.marginLeft = '-100px';
    this.div.style.backgroundColor = '#001f4d';
    this.div.style.border = '1px solid #66a3ff';
    this.div.style.zIndex = '2000';
    this.div.style.padding = '6px';
    this.div.style.borderRadius = '5px';
    divName.style.float='none';
    divPassword.style.float='none';
    divButtons.style.position = 'relative';
    divButtons.style.float = 'none';
    divButtons.style.width = '180px';
    divButtons.style.height = 'auto';
    textName.placeholder = 'Name';
    styleText(textName);
    textPassword.placeholder = 'Password(optional)';
    styleText(textPassword);
    function styleText(text)
    {
        text.type = 'text';
        text.style.position = 'relative';
        text.style.float = 'left';
        text.style.height = '100%';
        text.style.width = '180px';
        text.style.fontSize = '20px';
        text.style.fontFamily = 'Arial';
        text.style.height = '30px';
        text.style.boxSizing = 'border-box';
    }
    
    
    
    buttonCreate.style.height = '30px';
    buttonCreate.style.width='50%';
    buttonCreate.style.fontSize = '20px';
    buttonCreate.style.boxSizing = 'border-box';
    buttonCreate.style.float='left';
    buttonCancel.style.height = '30px';
    buttonCancel.style.width='50%';
    buttonCancel.style.fontSize = '20px';
    buttonCancel.style.boxSizing = 'border-box';
    buttonCancel.style.float='right';
    buttonCancel.style.cursor='pointer';
    buttonCreate.style.cursor='pointer';
    divError.style.position = 'relative';
    divError.style.float = 'left';
    divError.style.width = '180px';
    divError.style.boxSizing = 'border-box';
    divError.style.backgroundColor = '#eeeeee';
    divError.style.fontFamily = 'Arial';
    divError.style.fontSize = '14px';
    divError.style.display='none';
    textError.style.position = 'relative';
    textError.style.width = '100%';
    textError.style.boxSizing = 'border-box';
    textError.style.backgroundColor = 'transparent';
    textError.style.border = '0px';
    textError.style.resize='none';
    textError.style.overflowY='hidden';
    textError.readOnly=true;
    setText(buttonCreate, "Create");
    setText(buttonCancel, "Cancel");
    this.setError = function (error)
    {
        if (error)
        {
            divError.style.display = 'block';
            setText(textError, error);
        }
        else
        {
            divError.style.display = 'none';
        }
    };
    this.setCallback=function(callbackIn)
    {
        callback = callbackIn;
    };
    this.show=function( type)
    {
        self.div.style.display='block';
            divPassword.style.display='block';
    timer = new Timer(function () {
        if (flashing) {
            self.div.style.backgroundColor = initialBackgroundColor;
            flashing = false;
        } else {
            self.div.style.backgroundColor = '#ccff00';
            flashing = true;
        }
    }, 60, 6);
    };
    this.hide=function()
    {
        self.div.style.display='none';
        textName.value="";
        textPassword.value="";
        divError.style.display='none';
    };
    buttonCreate.onclick = function ()
    {
        doCallback();
    };
    buttonCancel.onclick = function ()
    {
        self.hide();
    };
    addOnKeyDown(textName);
    addOnKeyDown(textPassword);
    function doCallback()
    {
        callback(textName.value, textPassword.value, self.type);
    }
    function addOnKeyDown(text)
    {
    text.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode == 13) {
            try
            {
            doCallback();
        }
        catch(ex){
            console.log(ex);
        }
        }
    };
    }
    textName.addEventListener('click',function()
    {
      textName.focus();  
    });
    textPassword.addEventListener('click',function()
    {
      textPassword.focus();  
    });
    this.div.appendChild(divName);
    divName.appendChild(textName);
    this.div.appendChild(divPassword);
    divPassword.appendChild(textPassword);
    this.div.appendChild(divButtons);
    divButtons.appendChild(buttonCreate);
    divButtons.appendChild(buttonCancel);
    this.div.appendChild(divError);
    divError.appendChild(textError);
    var flashing = false;
    var initialBackgroundColor = self.div.style.backgroundColor;
}
function Wall(userInformation, wallInfo, endpoint, callbacksImageUploader, callbacksImageUploaderProfilePicture)
{
    var dataConnectionsHandler= new DataConnectionsHandler(wallInfo, userInformation, {
        send:function(jObject){websocket.send(jObject);}
        //,addWallItem:function(wallItem){}
    });
    var self = this;
    var settings = new Settings(wallInfo.name, function () {
        this.set("position");
        this.set("size");
        //this is a reset function for this particualr instance of this particular class.
    });
    var minWidth=292;
    var minHeight=240;
    var createWallItem = new CreateWallItem();
    this.acceptsEmoticons = true;
    this.type = wallInfo.type;
    this.taskBarInformation = {tooltip: 'A wall you have open!', icon: ('images/wall-icon.gif'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}, attentionStyle: {backgroundColor: 'rgba(255,80,80,0.5)'}};
    this.div = document.createElement('div');
    var enterPassword;
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var divMain = document.createElement('div');
    var buttonClose = document.createElement('button');
    var buttonMinimize = document.createElement('button');
    var buttonMaximize = document.createElement('button');
    var divProfilePicture= document.createElement('div');
    var imgProfilePicture= document.createElement('img');
    var divUploadImage= document.createElement('div');
    var imgUploadImage= document.createElement('img');
    var divUploadFile = document.createElement('div');
    var imgUploadFile = document.createElement('img');
    var divControls = document.createElement('div');
    var themesObject;
    var divUsers = document.createElement('div');
    var imgUsers = document.createElement('img');
    var divFeed = document.createElement('div');
    var users = new Users(false, "users", userInformation, function (username) {}, showImageUploaderProfilePicture);
    setText(buttonMinimize, String.fromCharCode(10134));
    setText(buttonMaximize, String.fromCharCode(10064));
    setText(buttonClose, String.fromCharCode(10006));
    this.div.style.position = "absolute";
    this.div.style.width = '700px';
    this.div.style.height = '500px';
    this.div.style.left='430px';
    this.div.style.top='80px';
    if(wallInfo.name!='Main')
    {
        var startPosition = settings.get("position");
        if (!startPosition)
        {
            startPosition = Window.getStartPosition();
        }
        this.div.style.left = String(startPosition[0]) + 'px';
        this.div.style.top = String(startPosition[1]) + 'px';
    }
    var startSize = settings.get("size");
    if (startSize)
    {
        if(startSize[0]<minWidth)
            startSize[0]=minWidth;
        if(startSize[1]<minHeight)
            startSize[1]=minHeight;
        this.div.style.width = String(startSize[0]) + 'px';
        this.div.style.height = String(startSize[1]) + 'px';
    }
    divInner.style.position = 'absolute';
    divInner.style.border = '1px solid #66a3ff';
    divInner.style.backgroundColor = '#0099ff';
    divInner.style.padding = '0px 3px 3px 3px';
    divInner.style.borderRadius = "5px";
    divInner.style.overflow = 'hidden';
    divMain.style.width = 'calc(100% - 150px)';
    divMain.style.height = 'calc(100% - 24px)';
    divMain.style.padding = '2px';
    divMain.style.marginRight = '2px';
    users.div.style.float = 'left';
    users.div.style.width = '150px';
    users.div.style.height = 'calc(100% - 20px)';
    divFeed.style.height = 'calc(100% - 20px)';
    divFeed.style.marginBottom = '2px';
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.height = "20px";
    divTab.style.cursor = 'move';
    divMain.style.backgroundColor = '#555555';
    divMain.style.float = 'left';
    divName.style.float = 'left';
    divName.style.paddingLeft = '5px';
    divName.style.fontFamily = 'Arial';
    verticallyCenter(divName);
    setText(divName, wallInfo.name+" Wall");
    buttonClose.className = 'button-wall-close';
    new Hover(buttonClose, function () {
        buttonClose.style.color = '#ff0000';
    });
    buttonMinimize.className = 'button-wall-minimize';
    new Hover(buttonMinimize, function () {
        buttonMinimize.style.color = '#ff0000';
    });
    buttonMaximize.className = 'button-wall-maximize';
    new Hover(buttonMaximize, function () {
        buttonMaximize.style.color = '#ff0000';
    });
    buttonClose.onclick = function ()
    {
        close();
    };
    function close()
    {
        websocket.close();
        self.task.remove(self);
        Windows.remove(self);
        delete Lobby.mapIdToWall[wallInfo.id];
        Themes.remove(themesObject);
        users.dispose();
    }
    buttonMinimize.onclick = function ()
    {
        self.task.minimize();
    };
    buttonMaximize.onclick = function ()
    {
        self.task.maximize();
    };
    
    divControls.style.height = '20px';
    divControls.style.width = '100%';
    divControls.style.backgroundColor = '#ccb3ff';
    divControls.style.border = '0px solid #333333';
    divControls.style.borderBottom = '0px';
    divFeed.style.width = '100%';
    divFeed.style.backgroundColor = '#e6ffff';
    divFeed.style.overflowY = 'scroll';
    divFeed.style.backgroundColor = '#AAAAAC';
    setupControlButton(divUsers, imgUsers, 'images/users.gif', 'images/users_highlighted.gif', function () {
        if (showingUsers) {
            hideUsers();
        } else {
            showUsers();
        }
    });
        setupControlButton(divProfilePicture, imgProfilePicture, 'images/profile-picture-icon.gif', 'images/profile-picture-icon-blue.gif', showImageUploaderProfilePicture);
        setupControlButton(divUploadImage, imgUploadImage, 'images/upload-image-icon.gif', 'images/upload-image-icon-blue.gif', showImageUploader);
        setupControlButton(divUploadFile, imgUploadFile, 'images/upload-file-icon.gif', 'images/upload-file-icon-blue.gif', function(){createWallItem.show();});
        
        
        function setupControlButton(div, img, srcImg, srcImgHover, clickCallback)
        {
            div.style.position = 'relative';
            div.style.height = '16px';
            div.style.float = 'right';
            div.style.marginRight = '5px';
            div.style.cursor = 'pointer';
            verticallyCenter(div);
            img.style.height = '100%';
            img.src = window.thePageUrl+srcImg;
            new Hover(img, function () {
                img.src = window.thePageUrl+srcImgHover;
            }, function () {
                img.src = window.thePageUrl+srcImg;
            });
            div.addEventListener("click", clickCallback);
        }
    var showingUsers = true;
    function showUsers()
    {
        users.div.style.display = 'block';
            divMain.style.marginRight = '2px';
            divMain.style.width = 'calc(100% - 156px)';
        showingUsers = true;
    }
    function hideUsers()
    {
        users.div.style.display = 'none';
        divMain.style.marginRight = '0px';
        divMain.style.width = 'calc(100% - 4px)';
        showingUsers = false;
    }
    hideUsers();
    function verticallyCenter(element)
    {
        element.style.position = 'relative';
        element.style.top = '50%';
        element.style.transform = 'translateY(-50%)';
        element.style.msTransform = 'translateY(-50%)';
        element.style.webkitTransform = 'translateY(-50%)';
        element.style.oTransform = 'translateY(-50%)';
    }
    function setButtonGenericStyle(button)
    {
        button.style.float = 'right';
        button.style.border = '0px';
        button.style.backgroundColor = 'transparent';
        button.style.cursor = 'pointer';
        button.style.fontWeight = '900';
        button.style.fontSize = '14px';
    }
    setButtonGenericStyle(buttonClose);
    setButtonGenericStyle(buttonMinimize);
    setButtonGenericStyle(buttonMaximize);
    this.div.appendChild(divInner);
    divInner.appendChild(divTab);
    divInner.appendChild(divMain);
    divInner.appendChild(users.div);
    divMain.appendChild(divFeed);
    divMain.appendChild(divControls);
    divTab.appendChild(buttonClose);
    divTab.appendChild(buttonMaximize);
    divTab.appendChild(buttonMinimize);
    divTab.appendChild(divName);
    divControls.appendChild(divUsers);
    divUsers.appendChild(imgUsers);
        divControls.appendChild(divProfilePicture);
        divProfilePicture.appendChild(imgProfilePicture);
        divControls.appendChild(divUploadImage);
        divUploadImage.appendChild(imgUploadImage);
    this.show = function ()
    {
        self.div.style.display = 'inline';
        Windows.bringToFront(self);
    };
    this.hide = function ()
    {
        self.div.style.display = 'none';
    };
    var websocket;
    var onConnect = function (jObject)
    {
        if (enterPassword)
        {
            enterPassword.hide();
        }
        if (jObject.successful)
        {
            if (wallInfo.message)
            {
                interpret(wallInfo.message);
                self.task.attention();
            }
        }
        else
        {
            if (jObject.reason && enterPassword)
            {
                enterPassword.setError(jObject.reason);
            }
        }
    };
    function gotUsers(jObject)
    {
        users.listUsers(jObject.users);
    }function showImageUploaderProfilePicture()
    {
        if (callbacksImageUploaderProfilePicture)
        {
            if (callbacksImageUploaderProfilePicture.show)
            {
                callbacksImageUploaderProfilePicture.show();
            }
        }
    }
    function showImageUploader()
    {
        if (callbacksImageUploader)
        {
            if (callbacksImageUploader.show)
            {
                callbacksImageUploader.show(true, undefined, {}, {send: function (jObject) {
                        websocket.send(jObject);
                    }}, wallInfo.name);
            }
        }
    }
    function initializeWebsocket()
    {
        websocket = new MySocket("wall");
        websocket.onopen = function () {
            if (wallInfo.has_password)
            {
                enterPassword = new EnterPassword(divFeed, function (password) {
                    connect(password);
                }, close);
            }
            else
            {
                connect();
            }
        };
        websocket.onmessage = function (jObject)
        {
            interpret(jObject);
        };
    }
    function connect(password)
    {
        var jObject = {};
        jObject.type = "connect";
        if (password && password.length > 0)
        {
            jObject.password = password;
        }
        jObject.user_id = userInformation.id;
        jObject.wall_id = wallInfo.id;
        websocket.send(jObject);
    }
    function data(jObject)
    {
        
    }
    function interpret(jObject)
    {
        dataConnectionsHandler.interpret(jObject);
        switch (jObject.type)
        {
            case "connect":
                onConnect(jObject);
                break;
            case "users":
                gotUsers(jObject);
                break;
            case "data":
                data(jObject);
                break;
        }
    }
    makeUnselectable(this.div);
    makeTextSelectable(divFeed);
    themesObject = {components: [
            {name: 'controls', elements: [divControls]},
            {name: 'feed', elements: [divFeed]},
            {name: 'body', elements: [divMain]},
            {name: 'text', elements: [divName, buttonClose, buttonMinimize, buttonMaximize]}
        ],
        callback: function (theme) {

        }
    };
    Window.style(self.div, divInner, divTab);
    Themes.register(themesObject, undefined);
    initializeWebsocket();
    Windows.add(this, false, divTab, divInner, new WindowInformation(true, true, 292, 240, Windows.maxWidthPx,  Windows.maxHeightPx, 0, 100, 0, Windows.maxYPx, true, true, true), 
         new WindowCallbacks(function(){
                settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
                settings.set("size", [self.div.offsetWidth, self.div.offsetHeight]);
            }, function(){
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
         }));

        TaskBar.add(this);
}
function Walls(callbacks, userInformation)
{
    var self = this;
    var selfWalls = this;
    var settings = new Settings("#walls", function () {
        this.set("position");
        this.set("showing");
        this.set("size");
        //this is a reset function for this particualr instance of this particular class.
    });
    var minWidth=200;
    var minHeight=100;
    this.type = 'Walls';
    this.taskBarInformation = {tooltip: 'Lists all walls', icon: ('images/walls-icon.gif'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var divMain = document.createElement('div');
    this.div.style.position = "absolute";
    this.div.style.width = '200px';
    this.div.style.height = '300px';
    this.div.style.top = '300px';
    this.div.style.left = '10px';
    divInner.style.position='absolute';
    divInner.style.border = '1px solid #66a3ff';
    //divInner.style.border = '3px solid #0099ff';
    divInner.style.backgroundColor = '#0099ff';
    divInner.style.padding = '0px 3px 3px 3px';
    divInner.style.borderRadius = "5px";
    divInner.style.overflow = 'hidden';
    var startPosition = settings.get("position");
    if (startPosition)
    {
        this.div.style.left = String(startPosition[0]) + 'px';
        this.div.style.top = String(startPosition[1]) + 'px';
    }
    var startSize = settings.get("size");
    if (startSize)
    {
        if(startSize[0]<minWidth)
            startSize[0]=minWidth;
        if(startSize[1]<minHeight)
            startSize[1]=minHeight;
        this.div.style.width = String(startSize[0]) + 'px';
        this.div.style.height = String(startSize[1]) + 'px';
    }
    var menuBar = new MenuBar({options: [{name: 'Add', options: [{name: 'Wall', callback: function () {
                            CreateWall.show(createWall, true, Wall.Type.dynamic);
                        }}]}]}, {left: 0, top: -2});
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.height = "20px";
    divTab.style.cursor = 'move';
    divTab.style.padLeft = '10px';
    divName.style.float = 'left';
    divName.style.paddingLeft = '5px';
    divName.style.fontFamily = 'Arial';
    verticallyCenter(divName);
    setText(divName, "Walls");
    divMain.style.backgroundColor = '#555555';
    divMain.style.position = 'relative';
    divMain.style.float = 'left';
    divMain.style.height = 'calc(100% - 41px)';
    divMain.style.width = "100%";
    divMain.style.overflowY = 'auto';
    divMain.style.paddingBottom = '1px';
    var mapIdToWallEntry = {};
    var arrayWallEntries = [];
    this.listWalls = function (walls)
    {
        var alreadyPresent = [];
        var i = 0;
        for (var i = walls.length - 1; i >= 0; i--)
        {
            var r = walls[i];
            if (r.id)
            {
                if (!walls[r.id])
                {
                    var wallEntry = new WallEntry(r);
                    var j = 0;
                    var inserted = false;
                    var lowerCaseName = wallEntry.info.name.toLowerCase();
                    while (j < arrayWallEntries.length)
                    {
                        var rEntry = arrayWallEntries[j];
                        if (rEntry.info.name.toLowerCase() > lowerCaseName)
                        {
                            mapIdToWallEntry[r.id] = wallEntry;
                            arrayWallEntries.splice(j, 0, wallEntry);
                            divMain.insertBefore(wallEntry.div, divMain.children[j]);
                            inserted = true;
                            break;
                        }
                        j++;
                    }
                    if (!inserted)
                    {
                        mapIdToWallEntry[r.id] = wallEntry;
                        arrayWallEntries.push(wallEntry);
                        divMain.appendChild(wallEntry.div);
                    }
                }
                alreadyPresent.push(r.id);
            }
        }
        i = 0;
        while (i < arrayWallEntries.length)
        {
            var wallInfo = arrayWallEntries[i].info;
            if (alreadyPresent.indexOf(wallInfo.id) < 0)
            {
                divMain.removeChild(mapIdToWallEntry[wallInfo.id].div);
                arrayWallEntries.splice(i, 1);
                delete mapIdToWallEntry[wallInfo.id];
            }
            i++;
        }
    };
    function createWall(name, password, type)
    {
        var jObject = {};
        jObject.type = 'create_wall';
        jObject.name = name;
        jObject.wall_type = type;
        if (password && password.length > 0)
        {
            jObject.has_password = true;
            jObject.password = password;
        }
        else
        {
            jObject.has_password = false;
        }
        callbacks.send(jObject);
    }
    function WallEntry(r)
    {
        var self = this;
        this.info = r;
        this.div = document.createElement('div');
        var divName = document.createElement('div');
        var divImg = document.createElement('div');
        var img = document.createElement('img');
        this.div.style.position = 'relative';
        this.div.style.height = '30px';
        this.div.style.width = '100%';
        this.div.style.backgroundColor = '#f0f0f0';
        this.div.style.cursor = 'pointer';
        this.div.style.float = 'left';
        this.div.style.border = '1px solid #4d0026';
        this.div.style.borderRadius = '5px';
        this.div.style.left = '-1px';
        this.div.style.marginLeft = '2px';
        this.div.style.marginTop = '1px';
        this.div.style.overflow = 'hidden';
        this.div.style.width = 'calc(100% - 6px)';
        this.div.style.paddingLeft = '2px';
        divName.style.float = 'left';
        divName.style.fontFamily = 'Arial';
        divName.style.height = '19px';
        divName.style.paddingLeft = '0px';
        divName.style.textOverflow = 'ellipsis';
        divName.style.overflow = 'hidden';
        divName.style.whiteSpace = 'nowrap';
        divName.style.width = '100%';
        divName.style.width = 'calc(100% - 28px)';
        divImg.style.float = 'left';
        divImg.style.height = '28px';
        divImg.style.width = '28px';
        img.style.width = '100%';
        verticallyCenter(divName);
        verticallyCenter(divImg);
        verticallyCenter(img);
        setText(divName, r.name);
        this.div.appendChild(divName);
        this.div.appendChild(divImg);
        img.src = window.thePageUrl+'images/wall.png';
        divImg.appendChild(img);
        new Hover(this.div, function () {
            self.div.style.backgroundColor = '#fdfdfe';
        }, function () {
        });
        this.div.onmousedown = function ()
        {
            Windows.cancelBringToFront(selfWalls);
                showWall();
            function showWall()
            {
                var wall = Lobby.mapIdToWall[r.id];
                if (wall)
                {
                    wall.task.unminimize();
                }
                else
                {
                    Lobby.openWall(r);
                }
            }
        };
    }
    function verticallyCenter(element)
    {
        element.style.position = 'relative';
        element.style.top = '50%';
        element.style.transform = 'translateY(-50%)';
        element.style.msTransform = 'translateY(-50%)';
        element.style.webkitTransform = 'translateY(-50%)';
        element.style.oTransform = 'translateY(-50%)';
    }
    this.div.appendChild(divInner);
    divInner.appendChild(divTab);
    divTab.appendChild(divName);
    divInner.appendChild(menuBar.div);
    divInner.appendChild(divMain);
    this.show = function ()
    {
        self.div.style.display = 'inline';
        Windows.bringToFront(self);
        settings.set("showing", true);
    };
    this.hide = function ()
    {
        self.div.style.display = 'none';
        settings.set("showing", false);
    };
    var showing = settings.get("showing");
    if(showing)
    {
        this.show();
    }
    else
    {
        if(showing==false)
        {
            this.hide();
        }
    }
    makeUnselectable(this.div);
    Themes.register({components:[
            {name:'body', elements:[divMain]},
            {name:'text', elements:[divName]}
        ],
    callback:function(theme){
        
    }}, undefined);
    Window.style(self.div, divInner, divTab);
    Windows.add(this, false, divTab, divInner, new WindowInformation(true, true, 200, 100, 199, Windows.maxHeightPx, 0, 100, 0, Windows.maxYPx, true, false, true), 
         new WindowCallbacks(function(){
                settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
                settings.set("size", [200, self.div.offsetHeight]);
            }, function(){
        if(self.div.offsetLeft&&self.div.offsetTop)
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
         },
         function(){
        self.task.minimize();}, undefined, function(){
        self.task.minimize();}));
    TaskBar.add(this);
}
function SliderSwitch(callback) {
    var maxLeft = 43;
    var self = this;
    this.div = document.createElement('div');
    var divOff = document.createElement('div');
    var divOffText = document.createElement('div');
    var divOn = document.createElement('div');
    var divOnText = document.createElement('div');
    var divSlider = document.createElement('div');
    var imgSlider = document.createElement('img');
    this.div.style.position = 'relative';
    this.div.style.height = '16px';
    this.div.style.width = '60px';
    this.div.style.borderRadius = '13px';
    this.div.style.border = '2px solid #aaaaaa';
    divOff.style.right = '0px';
    divOff.style.backgroundColor = '#660022';
    setStyleState(divOff);
    divOffText.style.width = '100%';
    divOffText.style.height = '14px';
    makeUnselectable(divOffText);
    verticallyCenter(divOffText);
    divOn.style.left = '0px';
    divOn.style.backgroundColor = '#00e600';
    setStyleState(divOn);
    divOnText.style.width = '100%';
    divOnText.style.height = '14px';
    makeUnselectable(divOnText);
    verticallyCenter(divOnText);
    divSlider.style.position = 'absolute';
    divSlider.style.height = '18px';
    divSlider.style.width = '18px';
    divSlider.style.borderRadius = '9px';
    divSlider.style.right = '0px';
    divSlider.style.top = '-1px';
    divSlider.style.zIndex = '25';
    divSlider.style.backgroundColor = '#ffffff';
    divSlider.style.cursor = 'pointer';
    divSlider.zIndex = '10';
    this.div.appendChild(divOff);
    divOff.appendChild(divOffText);
    this.div.appendChild(divOn);
    divOn.appendChild(divOnText);
    this.div.appendChild(divSlider);
    divSlider.appendChild(imgSlider);
    setText(divOffText, "Off");
    setText(divOnText, "On");
    function setStyleState(div)
    {
        div.style.position = 'absolute';
        div.style.height = '100%';
        div.style.width = '100%';
        div.style.textAlign = 'center';
        div.style.fontFamily = 'Arial';
        div.style.fontSize = '12px';
        div.style.borderRadius = '11px';
    }
    function makeUnselectable(node) {
        if (node.nodeType == 1) {
            node.setAttribute("unselectable", "on");
        }
        var child = node.firstChild;
        while (child) {
            makeUnselectable(child);
            child = child.nextSibling;
        }
    }
    function verticallyCenter(element)
    {
        element.style.position = 'relative';
        element.style.top = '50%';
        element.style.transform = 'translateY(-50%)';
        element.style.msTransform = 'translateY(-50%)';
        element.style.webkitTransform = 'translateY(-50%)';
        element.style.oTransform = 'translateY(-50%)';
    }
    var state;
    var start;
    divSlider.onmousedown = function (e) {
        if (divSlider.style.display === "none")
        {
            return;
        }
        if (!e)
            var e = window.event;
        start = [divSlider.offsetLeft - e.pageX, divSlider.offsetTop - e.pageY];
        state = 1;
    };
    document.documentElement.addEventListener("mousemove", function (e) {
        if (state == 1) {
            drag((start[0] + e.pageX), (start[1] + e.pageY));
        }
    }
    );
    drag = function (x, y)
    {

        var left = x;
        if (left > maxLeft)
        {
            left = maxLeft;
        }
        else
        {
            if (left < 0)
            {
                left = 0;
            }
        }
        divSlider.style.left = String(left) + 'px';
        if (divSlider.offsetLeft > (maxLeft / 2))
        {
            showOn(true);
        }
        else
        {
            showOn(false);
        }
    };
    document.documentElement.addEventListener("mouseup", function () {
        if (state == 1)
        {
            try
            {
            if (divSlider.offsetLeft > (maxLeft / 2))
            {
                on();
            }
            else
            {
                off();
            }}
        catch(ex)
        {
            console.log(ex);
        }
        }
        state = 0;
    });
    function showOn(bool)
    {
        if (bool)
        {
            divOn.style.display = 'inline';
            divOff.style.display = 'none';
        }
        else
        {
            divOn.style.display = 'none';
            divOff.style.display = 'inline';
        }
    }
    function on()
    {
        divSlider.style.left = maxLeft + 'px';
        showOn(true);
        callback(true);
    }
    function off()
    {
        divSlider.style.left = '0px';
        showOn(false);
        callback(false);
    }
}

function Videos(userInformation, callbacks)
{
    var aspectRatio = 1;
    var self = this;
    var mapUserToVideo = {};
    var arrayUsers = [];
    this.div = document.createElement('div');
    this.div.style.width = '100%';
    this.div.style.height = '100%';
    this.div.style.position = 'relative';
    this.div.style.overflow = 'hidden';
    this.showMe = function (bool)
    {
        for (var i = 0; i < arrayUsers.length; i++)
        {
            var video = mapUserToVideo[arrayUsers[i]];
            video.showMe(bool);
        }
    };
    this.updateUsers = function (jObject)
    {
        var users = jObject.users;
        var uniqueIds = [];
        for (var i = 0; i < users.length; i++)
        {
            var user = users[i];
            if (user.userId != userInformation.userId)
            {
                var video = mapUserToVideo[user.userId];
                if (video)
                {

                }
                else
                {
                    addUser(user);
                }
                uniqueIds.push(user.userId);
            }

        }
        var i = 0;
        while (i < arrayUsers.length)
        {
            if (uniqueIds.indexOf(arrayUsers[i]) < 0)
            {
                //remove user
                remove(i);
            }
            else
            {
                i++;
            }
        }
        doPresentation();
    };
    function remove(i)
    {
        mapUserToVideo[arrayUsers[i]].disconnect();
        var video = mapUserToVideo[arrayUsers[i]];
        self.div.removeChild(video.div);
        delete video;
        arrayUsers.splice(i, 1);
    }
    function doPresentation()
    {
        var a = 1;
        var bestPair;
        var bestCount;
        var currentMaxWidth;
        var arrayVideosVisible =[];
        for(var i=0; i<arrayUsers.length; i++)
        {
            var video = mapUserToVideo[arrayUsers[i]];
            if(video.div.style.display!='none')
            {
                arrayVideosVisible.push(video);
            }
        }
        var n = arrayVideosVisible.length;
        var minMarginTop = 10;
        var minMarginLeft = 10;
        while (true)
        {
            var b = Math.ceil(n / a);
            var maxHeightIgnoringWidth = (self.div.offsetHeight / a) - minMarginTop;
            var maxWidthIgnoringHeight = (self.div.offsetWidth / b) - minMarginLeft;
            var maxWidth;
            var maxHeight;
            if (maxHeightIgnoringWidth * aspectRatio > maxWidthIgnoringHeight)
            {
                maxWidth = maxWidthIgnoringHeight;
                maxHeight = maxWidth / aspectRatio;
            }
            else
            {
                maxHeight = maxHeightIgnoringWidth;
                maxWidth = maxHeight * aspectRatio;
            }
            if (!bestPair || !currentMaxWidth || currentMaxWidth < maxWidth)
            {
                bestPair = [maxWidth, maxHeight];
                bestCount = [b, a];
                currentMaxWidth = maxWidth;
            }
            a++;
            if (a > n)
            {
                break;
            }
        }
        var width = String(bestPair[0]) + 'px';
        var height = String(bestPair[1]) + 'px';
        var marginLeft = String((self.div.offsetWidth - (bestCount[0] * bestPair[0])) / (bestCount[0] + 1)) + 'px';
        var marginTop = String((self.div.offsetHeight - (bestCount[1] * bestPair[1])) / (bestCount[1] + 1)) + 'px';
        for (var i = 0; i < arrayVideosVisible.length; i++)
        {
            var video =  arrayVideosVisible[i];
            video.div.style.width = width;
            video.div.style.height = height;
            video.div.style.marginTop = marginTop;
            video.div.style.marginLeft = marginLeft;
        }
    }
    this.resize = function ()
    {
        doPresentation();
    };
    function addUser(toUser)
    {

        var video = new Video({
            send: function (obj)
            {
                obj.type = 'video';
                obj.from = userInformation.userId;
                obj.to = toUser.userId;
                callbacks.send(obj);
            },
            ask: function (offer)
            {
                video.accept();
            },
            connected: function ()
            {

            },
            disconnected: function ()
            {

            },
            addedStream: function ()
            {
                video.div.style.display='block';
                doPresentation();
            },
            removedStream: function ()
            {
                video.div.style.display='none';
                doPresentation();
            }
        });
        video.div.style.width = '100px';
        video.div.style.height = '100px';
        video.div.style.position = 'relative';
        video.div.style.float = 'left';
        video.div.style.backgroundColor = '#222222';
        video.div.style.display='none';
        self.div.appendChild(video.div);
        mapUserToVideo[toUser.userId] = video;
        arrayUsers.push(toUser.userId);
        sendReady(toUser);
    }
    function sendReady(toUser)
    {
        var jObject = {};
        jObject.type = 'video';
        jObject.webcam_type = 'ready';
        jObject.to = toUser.userId;
        jObject.from = userInformation.userId;
        callbacks.send(jObject);
    }
    this.recieved = function (jObject)
    {
        var video = mapUserToVideo[jObject.from];
        if (video)
        {
            console.log(jObject.webcam_type);
            switch (jObject.webcam_type)
            {
                case "do_connect":
                    video.connect();
                    break;
                case "ice":
                    video.recievedIce(jObject);
                    break;
                case "video_connect":
                    video.connect(jObject);
                    break;
                case "video_disconnect":
                    video.disconnect(jObject);
                    break;
                case "request":
                    video.recievedOffer(jObject);
                    break;
                case "reply":
                    video.accepted(jObject);
                    break;

            }
        }
    };
    this.dispose = function ()
    {
        for(var i=0; i<arrayUsers.length; i++)
        {
            remove(i);
        }
        Videos.instances.splice(Videos.instances.indexOf(self), 1);
    };
    Videos.instances.push(self);
}
Videos.instances = [];
Videos.showMe = function (bool)
{
    for (var i = 0; i < Videos.instances.length; i++)
    {
        var videos = Videos.instances[i];
        videos.showMe(bool);
    }
};
function WebcamSettings(userInformation)
{
    var self = this;
    this.type = 'Rooms';
    var settings = new Settings("#webcam_settings", function () {
        this.set("position");
        this.set("showing");
        //this is a reset function for this particualr instance of this particular class.
    });
    this.taskBarInformation = {tooltip:'Webcam settings',icon: ('images/webcam-settings-icon.gif'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var table = document.createElement('table');
    var trTab = document.createElement('tr');
    var tdTab = document.createElement('td');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var trMain = document.createElement('tr');
    var tdMain = document.createElement('td');
    var divMain = document.createElement('div');
    var divPublicName = document.createElement('div');
    this.div.style.position = "absolute";
    this.div.style.width = '200px';
    this.div.style.height = '50px';
    this.div.style.top = String(250) + 'px';
    this.div.style.left = '1000px';
    this.div.style.display='none';
    divInner.style.position='relative';
    divInner.style.border = '1px solid #66a3ff';
    //divInner.style.border = '3px solid #0099ff';
    divInner.style.backgroundColor='#0099ff';
    divInner.style.padding='0px 3px 3px 3px';
    divInner.style.borderRadius = "5px";
    divInner.style.overflow = 'hidden';
    table.style.overflow = 'hidden';
    table.style.width='100%';
    table.style.height='100%';
    setTableSkinny(table);
    trTab.style.height = 'auto';
    trMain.style.height = "100%";
    tdMain.style.width = '100%';
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.height = "20px";
    divTab.style.cursor = 'move';
    divTab.style.padLeft = '10px';
    divName.style.float = 'left';
    divName.style.paddingLeft = '5px';
    divName.style.fontFamily = 'Arial';
    verticallyCenter(divName);
    setText(divName, "Webcam Settings");
    divMain.style.backgroundColor = '#555555';
    divMain.style.position = 'relative';
    divMain.style.float = 'left';
    divMain.style.height = '100%';
    divMain.style.width = "100%";
    divMain.style.overflow = 'hidden';
    divPublicName.style.float='left';
    divPublicName.style.margin='3px';
    divPublicName.style.fontFamily='Arial';
    setText(divPublicName, "Public Feed:");
    function verticallyCenter(element)
    {
        element.style.position = 'relative';
        element.style.top = '50%';
        element.style.transform = 'translateY(-50%)';
        element.style.msTransform = 'translateY(-50%)';
        element.style.webkitTransform = 'translateY(-50%)';
        element.style.oTransform = 'translateY(-50%)';
    }
    function setTableSkinny(table)
    {
        table.cellSpacing = "0";
        table.cellPadding = "0";
    }
    var sliderSwitchPublic = new SliderSwitch(function(bool){ Videos.showMe(bool);});
    sliderSwitchPublic.div.style.float='right';
    sliderSwitchPublic.div.style.margin='3px';
    this.div.appendChild(divInner);
    divInner.appendChild(table);
    table.appendChild(trTab);
    trTab.appendChild(tdTab);
    tdTab.appendChild(divTab);
    divTab.appendChild(divName);
    table.appendChild(trMain);
    trMain.appendChild(tdMain);
    tdMain.appendChild(divMain);
    divMain.appendChild(divPublicName);
    divMain.appendChild(sliderSwitchPublic.div);
    var windowInformation = new WindowInformation(true, true, 200, 50, 250, 50, 0, 100, 0, Windows.maxYPx, true, false, true);
    var windowCallbacks=         new WindowCallbacks(function(){ 
            }, function(){
        if(self.div.offsetLeft&&self.div.offsetTop)
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
         },
            function(){
        self.task.minimize();}, undefined,
            function(){
        self.task.minimize();}, function(zIndex){settings.set("zIndex", zIndex);});
    var  params = {obj: this,
        minimized: false,
        divTab: divTab,
        divInner: divInner,
        windowInformation: windowInformation,
        callbacks: windowCallbacks};
    Windows.add( params);
    
    
    var timerFlash;
    this.flash = function ()
    {
        var flashing = false;
        timerFlash = new Timer(function () {
            if (flashing) {
                styleFromObject(divInner, Themes.theme.components.frame);
                flashing = false;
            } else {
                styleFromObject(divInner, Themes.theme.components.frameFlashing);
                flashing = true;
            }
        }, 50, 6);
    };
    this.show = function ()
    {
        self.div.style.display = 'inline';
        self.flash();
        Windows.bringToFront(self);
        settings.set("showing", true);
    };
    var showing = settings.get("showing");
    if(showing)
    {
        //this.show();
    }
    this.hide = function ()
    {
        self.div.style.display = 'none';
        settings.set("showing", false);
    };
    makeUnselectable(this.div);
    Themes.register({components:[
            {name:'body', elements:[divMain]},
            {name:'text', elements:[divName]},
            {name:'text_color', elements:[divPublicName]}
        ],
    callback:function(theme){
        
    }}, undefined);
    Window.style(self.div, divInner, divTab);
    TaskBar.add(this);
}
function clearNotification(send, roomUuid){
        send({type:"clear_notification", roomUuid:roomUuid});
}
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function UserInformation(id)
{
    this.userId=id;
    this.id=id;
}
function GenericWindow(params)
{
    var name = params.name;
    var tooltipMessage=params.tooltipMessage;
    var iconPath = params.iconPath;
    var minWidth = params.minWidth;
    var maxWidth = params.maxWidth;
    var minHeight = params.minHeight;
    var maxHeight =params.maxHeight;
    var defaultWidth = params.defaultWidth;
    var defaultHeight = params.defaultHeight;
    var defaultX = params.defaultX;
    var defaultY = params.defaultY;
    var minimized = params.minimized;
    var minimizable= params.minimizable; 
    var maximizable = params.maximizable;
    var closeable = params.closeable;
    var minimizeOnClose = params.minimizeOnClose;
    var bringToFront = params.bringToFront;
    
   

    var self = this;
    EventEnabledBuilder(this);
    var settings = new Settings(name, function () {
        this.set("position");
        this.set("size");
        this.set("zIndex");
    });
    this.taskBarInformation = {tooltip: tooltipMessage, icon: (iconPath), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}, attentionStyle: {backgroundColor: 'rgba(255,80,80,0.5)'}};
    this.div = document.createElement('div');
    self.divInner = document.createElement('div');
    self.divTab = document.createElement('div');
    self.divMain = document.createElement('div');
    var divName = document.createElement('div');
    this.div.style.position = "absolute";
    self.divInner.style.position = 'absolute';
    self.divInner.style.border = '1px solid #66a3ff';
    self.divInner.style.backgroundColor = '#0099ff';
    self.divInner.style.padding = '0px 3px 3px 3px';
    self.divInner.style.borderRadius = "5px";
    self.divInner.style.overflow = 'hidden';
    self.divTab.style.float = 'left';
    self.divTab.style.width = "100%";
    self.divTab.style.height = "20px";
    self.divTab.style.cursor = 'move';
    divName.style.float = 'left';
    divName.style.paddingLeft = '5px';
    divName.style.fontFamily = 'Arial';
    divName.style.textOverflow='ellipsis';
    divName.style.overflow='hidden';
    verticallyCenter(divName);
    setText(divName, name);
    self.divMain.style.height = 'calc(100% - 20px)';
    self.divMain.style.width = '100%';
    self.divMain.style.bottom = '0px';
    self.divMain.style.float = 'left';
    self.divMain.style.position = 'relative';
    this.div.appendChild(self.divInner);
    self.divInner.appendChild(self.divTab);
    self.divTab.appendChild(divName);
    self.divInner.appendChild(self.divMain);
    document.documentElement.appendChild(this.div);

    var startPosition = settings.get("position");
    if (startPosition)
    {
        this.div.style.left = String(startPosition[0]) + 'px';
        this.div.style.top = String(startPosition[1]) + 'px';
    } else
    {
        this.div.style.left = String(defaultX) + 'px';
        this.div.style.top = String(defaultY) + 'px';
    }

    var startSize = settings.get("size");
    if (startSize)
    {
        if (startSize[0] < minWidth)
            startSize[0] = minWidth;
        if (startSize[1] < minHeight)
            startSize[1] = minHeight;
        this.div.style.width = String(startSize[0]) + 'px';
        this.div.style.height = String(startSize[1]) + 'px';
    } else
    {
        this.div.style.width = String(defaultWidth) + 'px';
        this.div.style.height = String(defaultHeight) + 'px';
    }

    var startZIndex = settings.get("zIndex");
    if (startZIndex)
    {
        self.div.style.zIndex = String(startZIndex);
    }
    this.div.appendChild(self.divInner);

    this.show = function (bringToFront)
    {
        self.div.style.display = 'inline';
        if (bringToFront)
        {
            Windows.bringToFront(self);
        }
        dispatchFocusedEvent();
    };
    this.hide = function ()
    {
        self.div.style.display = 'none';
    };
    makeUnselectable(this.div);
    var themesObject = {components: [
            {name: 'body', elements: [self.divMain]},
            {name: 'text', elements: [divName]}
        ],
        callback: function (theme) {

        }
    };
    var callbackMinimize = minimizable ? function () {
        self.task.minimize();dispatchMinimizedEvent();
    } : function () {
    };
    var callbackMaximize = maximizable ? function () {
        self.task.maximize(); console.log('maximized'); dispatchMaximizedEvent();
    } : function () {
    };
    var callbackClose = minimizeOnClose ? function () {
        self.task.minimize();
    } : function () {
        close();
    };
    Themes.register(themesObject, undefined);
    var themesObjectWindow = Window.style(self.div, self.divInner, self.divTab);
    var windowInformation = new WindowInformation(true, true, minWidth, minHeight, maxWidth, maxHeight, 0, 100, 0, Windows.maxYPx, minimizable, maximizable, minimizeOnClose, closeable);
    var callbacks = new WindowCallbacks(function () {
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
        settings.set("size", [self.div.offsetWidth, self.div.offsetHeight]);
    }, function () {
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
        dispatchMovedEvent();
    }
    ,
            callbackMinimize,
            callbackMaximize,
            callbackClose, function (zIndex) {
                settings.set("zIndex", zIndex);
            }, function () {
                dispatchResizedEvent();
    },
 dispatchUnmaximizedEvent, dispatchUnminimizedEvent);
    var timerFlash;
    var flashing = false;
    this.flash = function ()
    {
        var flashing = false;
        timerFlash = new Timer(function () {
            if (flashing) {
                styleFromObject(self.divInner, Themes.theme.components.frame);
                flashing = false;
            } else {
                styleFromObject(self.divInner, Themes.theme.components.frameFlashing);
                flashing = true;
            }
        }, 50, 6);
    };
    
    this.bringToFront = function(){
        Windows.bringToFront(self);
    };
    this.setName = function(name){
        console.log(name);
        setText(divName, name);
    };
    var params = {obj: this,
        minimized: minimized,
        divTab: self.divTab,
        divInner: self.divInner,
        windowInformation: windowInformation,
        callbacks: callbacks};
    Windows.add(params);
    function close()
    {
        self.task.remove(self);
        Windows.remove(self);
        Themes.remove(themesObject);
        Themes.remove(themesObjectWindow);
        dispatchCloseEvent();
    }
    TaskBar.add(this);
    if (bringToFront != false)
        Windows.bringToFront(self);
    function dispatchResizedEvent(){
        self.dispatchEvent({type:'resized'});
    }
    function dispatchMaximizedEvent(){
        self.dispatchEvent({type:'maximized'});
    }
    function dispatchMinimizedEvent(){
        self.dispatchEvent({type:'minimized'});
    }
    function dispatchFocusedEvent(){
        self.dispatchEvent({type:'focus'});
    }
    function dispatchUnminimizedEvent(){
        self.dispatchEvent({type:'unminimized'});
    }
    function dispatchUnmaximizedEvent(){
        self.dispatchEvent({type:'unmaximized'});
    }
    function dispatchMovedEvent(){
        self.dispatchEvent({type:'moved'});
    }
    function dispatchCloseEvent(){
        self.dispatchEvent({type:'close'});
    }
}
function ImageUploader(crop, aspectRatio, jObjectExtra, callbacks, forName)
{


    var self = this;
    //var settings = new Settings("#image_uploader", function () {
      //  this.set("position");
       // this.set("size");
        //this is a reset function for this particualr instance of this particular class.
    //});
    var genericWindow = new GenericWindow({
        name:'Image Uploader',
        tooltipMessage:'Used to pick location',
        iconPath:'images/upload-image-icon.gif',
        minWidth:250,
        maxWidth:1000,
        minHeight:250,
        maxHeight:1000,
        defaultWidth:250,
        defaultHeight:250,
        defaultX:250,
        defaultY:250,
        minimized:true,
        minimizable:true,
        maximizable:false,
        minimizeOnClose:true});
    this.type = 'ImageUploader';
    var buttonChooseCover = document.createElement('input');
    var buttonChoose = document.createElement('input');
    var textPath = document.createElement('input');
    var divProcessText = document.createElement('div');
    var imgPreview = document.createElement('img');
    var divCroppingFrame = document.createElement('div');
    var imgCroppingFrame = document.createElement('img');
    var buttonUpload = document.createElement('input');
    var divCroppingTool = document.createElement('div');
    var imgMove = document.createElement('img');
    var imgCroppingToolTab = document.createElement('img');
    var divSpinner = document.createElement('div');
    var colorProcessText='#ffffff';
    genericWindow.setName("Image uploader for: "+ forName);
    
    this.setup = function (cropIn, aspectRatioIn, jObjectExtraIn, callbacksIn, forNameIn)
    {
        crop = cropIn;
        forName=forNameIn;
        aspectRatio = aspectRatioIn;
        jObjectExtra = jObjectExtraIn;
        callbacks = callbacksIn;
        genericWindow.setName("Image uploader for: "+ forNameIn);
        setProcessingText("");
        move(); resize();
    };
    var imageUploader = {};
    var mouseStateResize = 'up';
    var mouseStateMove = 'up';
    var mouseStartOffsets = [];
    var mouseStartOffsetsResize = [];
    var set = false;
    var file;
    imageUploader.jObjectExtra = jObjectExtra;

    buttonChooseCover.type = 'button';
    buttonChooseCover.value = 'Choose Image';
    buttonChooseCover.style.width = '125px';
    buttonChooseCover.style.left = '0px';
    buttonChooseCover.style.top = '5px';
    buttonChooseCover.style.position = 'absolute';
    buttonChooseCover.style.color = '#000000';
    buttonChooseCover.style.fontSize = '14px';
    buttonChooseCover.style.fontFamily = 'Arial';
    buttonChooseCover.style.cursor = 'pointer';

    buttonChoose.type = 'file';
    buttonChoose.accept = '.gif, .jpeg, .jpg, .bmp, .png';
    buttonChoose.style.width = '74px';
    buttonChoose.style.height = '22px';
    buttonChoose.style.left = '0px';
    buttonChoose.style.top = '0px';
    buttonChoose.style.position = 'absolute';
    buttonChoose.style.border = '0px';
    buttonChoose.style.color = 'transparent';
    buttonChoose.style.backgroundColor = 'transparent';
    buttonChoose.style.display = 'none';
    buttonChoose.style.cursor = 'pointer';
    textPath.style.type = 'text';
    textPath.style.position = 'absolute';
    textPath.style.width = 'calc(100% - 160px)';
    textPath.style.height = '20px';
    textPath.style.right = '10px';
    textPath.style.top = '10px';
    textPath.style.fontSize = '14px';
    textPath.style.border = '0px';
    textPath.style.backgroundColor = 'transparent';
    textPath.readOnly = true;
    divProcessText.style.width = '100%';
    divProcessText.style.height = '20px';
    divProcessText.style.bottom = '35px';
    divProcessText.style.position = 'absolute';
    divProcessText.style.backgroundColor = 'transparent';
    divProcessText.style.textAlign = ' center';
    divProcessText.style.verticalAlign = ' middle';
    divProcessText.style.fontSize='14PX';
    divProcessText.style.fontFamily='Arial';
    divProcessText.style.whiteSpace='nowrap';
    divProcessText.style.overflow='hidden';
    divProcessText.style.textOverflow='ellipsis';
    imgPreview.style.objectFit = ' contain';
    imgPreview.style.position = 'absolute';
    divCroppingFrame.style.width = '100%';
    divCroppingFrame.style.height = 'calc(100% - 70px)';
    divCroppingFrame.style.top = '35px';
    divCroppingFrame.style.left = '0px';
    divCroppingFrame.style.position = 'absolute';
    divCroppingFrame.style.overflowY = 'scroll';
    divCroppingFrame.style.backgroundColor = '#ffffff';
    imgCroppingFrame.style.width = 'calc(100% - 4px)';
    imgCroppingFrame.style.top = '1px';
    imgCroppingFrame.style.left = '1px';
    imgCroppingFrame.style.position = 'absolute';
    buttonUpload.type = 'button';
    buttonUpload.value = 'Done';
    buttonUpload.style.position = 'absolute';
    buttonUpload.style.width = '70px';
    buttonUpload.style.left = 'calc(50% - 35px)';
    buttonUpload.style.bottom = '5px';
    buttonUpload.style.color = '#000000';
    buttonUpload.style.fontSize = '14px';
    buttonUpload.style.fontFamily='Arial';
    buttonUpload.style.cursor = 'pointer';
    divCroppingTool.style.cursor = 'move';
    divCroppingTool.style.width = '10px';
    divCroppingTool.style.height = '10px';
    divCroppingTool.style.top = '0px';
    divCroppingTool.style.left = '0px';
    divCroppingTool.style.position = 'absolute';
    divCroppingTool.style.border = '1px dashed #000000';
    divCroppingTool.style.display = 'none';
    divCroppingTool.className = 'divCroppingTool';
    imgMove.style.position = 'absolute';
    imgMove.style.right = 'calc(50% - 24px)';
    imgMove.style.top = 'calc(50% - 24px)';
    imgMove.style.width = '48px   ';
    imgMove.style.height = '48px';
    imgMove.style.display = 'none';
    imgMove.src = window.thePageUrl+'images/move.png';
    imgMove.style.cursor='move';
    imgCroppingToolTab.style.width = '48px';
    imgCroppingToolTab.style.height = '48px';
    imgCroppingToolTab.style.bottom = '-1px';
    imgCroppingToolTab.style.right = '-1px';
    imgCroppingToolTab.style.position = 'absolute';
    imgCroppingToolTab.style.cursor = 'se-resize';
    imgCroppingToolTab.src = window.thePageUrl+'images/se-resize.png';
    divSpinner.style.width = '188px';
    divSpinner.style.height = '188px';
    divSpinner.style.bottom = '60px';
    divSpinner.style.left = 'calc(50% - 94px)';
    divSpinner.style.position = 'absolute';
    divSpinner.style.display = 'none';
    var spinner = new Spinner(1);
    spinner.div.style = 'top:calc(50% - ' + String(spinner.div.style.height) + ')';
    divSpinner.appendChild(spinner.div);
    genericWindow.divMain.appendChild(buttonChooseCover);
    genericWindow.divMain.appendChild(buttonChoose);
    genericWindow.divMain.appendChild(textPath);
    genericWindow.divMain.appendChild(divProcessText);
    genericWindow.divMain.appendChild(imgPreview);
    genericWindow.divMain.appendChild(divCroppingFrame);
    divCroppingFrame.appendChild(imgCroppingFrame);
    genericWindow.divMain.appendChild(buttonUpload);
    divCroppingFrame.appendChild(divCroppingTool);
    divCroppingTool.appendChild(imgCroppingToolTab);
    imgMove.style.display = 'inline';
    divCroppingTool.appendChild(imgMove);
    genericWindow.divMain.appendChild(divSpinner);
    buttonUpload.onclick = function () {
        if (set) {
            uploadImage(file);
        }
        else
        {
            setProcessingText('You must select an image first!');
        }
    };
    imgCroppingToolTab.addEventListener('mousedown', onMouseDownResize, false);
    document.documentElement.addEventListener("mouseup", function () {
        onMouseUp();
    });
    document.documentElement.addEventListener("mouseleave", function () {
        onMouseUp();
    });
    divCroppingFrame.addEventListener('mousemove', onMouseMove, false);
    buttonChooseCover.onclick = function () {
        buttonChoose.click();
    };
    buttonChoose.onclick = function () {
        this.value = null;
    };
    buttonChoose.addEventListener('change', handleFileSelected, false);
    imgPreview.style.display = 'none';
    function onMouseDownMove(e)
    {
        mouseStartOffsets[0] = divCroppingTool.offsetLeft - e.pageX;
        mouseStartOffsets[1] = divCroppingTool.offsetTop - e.pageY;
        mouseStateMove = 'down';
        if (e.preventDefault)
        {
            e.preventDefault();
        }
    }
    function onMouseDownResize(e)
    {
        mouseStartOffsetsResize[0] = divCroppingTool.offsetWidth - e.pageX;
        mouseStartOffsetsResize[1] = divCroppingTool.offsetHeight - e.pageY;
        mouseStartOffsetsResize[2] = divCroppingTool.offsetWidth;
        mouseStartOffsetsResize[3] = e.pageX;
        mouseStateResize = 'down';
        if (e.preventDefault)
        {
            e.preventDefault();
        }
    }
    function onMouseUp()
    {
        mouseStateMove = 'up';
        mouseStateResize = 'up';
    }
    function resize(a, height)
    {

        var mY = imgCroppingFrame.offsetHeight - divCroppingTool.offsetTop;
        var mX = imgCroppingFrame.offsetWidth - divCroppingTool.offsetLeft;
        if (a)
        {
            if (height)
            {
                var width = a;
                if (width > mX)
                {
                    width = mX;
                }
                else
                {
                    if (width < 100)
                    {
                        width = 100;
                    }
                }
                if (height > mY)
                {
                    height = mY;
                }
                else
                {
                    if (height < 100)
                    {
                        height = 100;
                    }
                }
            }
            else
            {
                if (a > mX)
                {
                    a = mX;
                }
                if (a > mY)
                {
                    a = mY;
                }
                if (a < 100)
                {
                    a = 100;
                }
                width = a;
                height = a;
            }
            divCroppingTool.style.width = String(width) + 'px';
            divCroppingTool.style.height = String(height) + 'px';
        }
        else
        {
            if (mX > divCroppingTool.offsetWidth)
            {
                mX = divCroppingTool.offsetWidth;
            }
            if (mY > divCroppingTool.offsetHeight)
            {
                mY = divCroppingTool.offsetHeight;
            }
            if (aspectRatio)
            {
                if (mX > mY * aspectRatio)
                {
                    mX = mY * aspectRatio;
                }
                else
                {
                    mY = mX / aspectRatio;
                }
            }
            divCroppingTool.style.width = String(mX) + 'px';
            divCroppingTool.style.height = String(mY) + 'px';

        }

    }
    function move(x, y)
    {

        var mX = imgCroppingFrame.offsetWidth - divCroppingTool.offsetWidth;
        var mY = imgCroppingFrame.offsetHeight - divCroppingTool.offsetHeight;
        if (x && y)
        {
            if (x > mX)
            {
                x = mX;
            }
            if (y > mY)
            {
                y = mY;
            }
            if (x < 0)
            {
                x = 0;
            }
            if (y < 0)
            {
                y = 0;
            }
        }
        else
        {
            if (divCroppingTool.offsetLeft > mX)
            {
                if (mX < 0)
                {
                    mX = 0;
                }
            }
            else
            {
                mX = divCroppingTool.offsetLeft;
            }
            if (divCroppingTool.offsetTop > mY)
            {
                if (mY < 0)
                {
                    mY = 0;
                }
            }
            else
            {
                mY = divCroppingTool.offsetTop;
            }
            x = mX;
            y = mY;

        }
        divCroppingTool.style.left = String(x) + 'px';
        divCroppingTool.style.top = String(y) + 'px';
    }
    function onMouseMove(e)
    {
        reposition(e.pageX, e.pageY);
    }
    var first = false;

    function reposition(x, y)
    {

        if (mouseStateResize == 'down')
        {
            if (!aspectRatio)
            {
                resize(mouseStartOffsetsResize[0] + x, mouseStartOffsetsResize[1] + y);
            } else
            {
                x = mouseStartOffsetsResize[2] + (x - mouseStartOffsetsResize[3]) / aspectRatio;
                y = mouseStartOffsetsResize[1] + y;
                var z = (x + y) / 2;
                resize(z);
            }
        } else
        {
            if (mouseStateMove == 'down')
            {
                x = mouseStartOffsets[0] + x;
                y = mouseStartOffsets[1] + y;
                move(x, y);
            }
        }
    }
    if (!isMobile)
    {
        divCroppingTool.addEventListener('mousedown', onMouseDownMove, false);
        imgMove.addEventListener('mousedown', onMouseDownMove, false);
    } else
    {
        imgCroppingToolTab.addEventListener('touchmove', function (e)
        {
            e.preventDefault();
            if (first) {
                first = false;
            }
            reposition(e.touches[0].pageX, e.touches[0].pageY);
        }, false);
        imgMove.addEventListener('touchmove', function (e)
        {
            e.preventDefault();
            if (first) {
                first = false;
            }
            reposition(e.touches[0].pageX, e.touches[0].pageY);
        }, false);
        imgCroppingToolTab.addEventListener('touchstart', function (e)
        {
            first = true;
            mouseStartOffsetsResize[0] = divCroppingTool.offsetWidth - e.touches[0].pageX;
            mouseStartOffsetsResize[1] = divCroppingTool.offsetHeight - e.touches[0].pageY;
            mouseStartOffsetsResize[2] = divCroppingTool.offsetWidth;
            mouseStartOffsetsResize[3] = e.touches[0].pageX;
            mouseStateResize = 'down';
        }, false);
        imgMove.addEventListener('touchstart', function (e)
        {
            first = true;
            mouseStartOffsets[0] = divCroppingTool.offsetLeft - e.touches[0].pageX;
            mouseStartOffsets[1] = divCroppingTool.offsetTop - e.touches[0].pageY;
            mouseStateMove = 'down';
        }, false);
        imgCroppingToolTab.addEventListener('touchend', function (e)
        {
            mouseStateResize = 'up';
        }, false);
        imgMove.addEventListener('touchend', function (e)
        {
            mouseStateMove = 'up';
        }, false);
    }
    function handleFileSelected(evt) {
        textPath.value = this.value;
        var files = evt.target.files;
        if (files) {
            file = files[0];
            setImage(file);
        }
    }
    function setProcessingText(value, red)
    {
        divProcessText.textContent = value;
        if(value&&value.length>0)
        {
            divProcessText.style.display='inline';
            divCroppingFrame.style.height = 'calc(100% - 95px)';
        }
        else
        {
            divProcessText.style.display='none';
            divCroppingFrame.style.height = 'calc(100% - 70px)';
        }
        if(red)
        {
            divProcessText.style.color='#ff0000';
        }
        else
        {
            divProcessText.style.color=colorProcessText;
        }
    }
    function setImage(image)
    {
        var reader = new FileReader();
        reader.onload = function (evt) {
            var data = evt.target.result;
            imgPreview.src = data;
            imgCroppingFrame.src = data;
            imgCroppingFrame.onload = function () {
                imageUploader.height = imgCroppingFrame.naturalHeight;
                imageUploader.width = imgCroppingFrame.naturalWidth;
                if (crop)
                {
                    initializeCroppingTool();
                }
                set = true;
            };
        };
        reader.readAsDataURL(image);
    }
    function initializeCroppingTool()
    {
        var width = imgCroppingFrame.offsetWidth;
        var height = imgCroppingFrame.offsetHeight;
        if(aspectRatio)
        {
            if (width / height > aspectRatio)
            {
                width = height * aspectRatio;
            } else
            {
                height = width / aspectRatio;
            }
        }
        divCroppingTool.style.width = String(width) + 'px';
        divCroppingTool.style.height = String(height) + 'px';
        divCroppingTool.style.left = '0px';
        divCroppingTool.style.top = '0px';
        divCroppingTool.style.display = 'inline';
    }
    var timerFailed;
    function uploadImage(file)
    {
        if (file)
        {
            timerFailed = new Timer(function () {
                setProcessingText('uploading image failed', true);
                divSpinner.style.display = 'none';
            }, 15000, 1);
            divSpinner.style.display = 'inline';
            setProcessingText('reading the file');
            var reader = new FileReader();
            setProcessingText('reading the file...');
            reader.onload = function (evt) {
                setProcessingText('encoding the file...');
                var data = btoa(evt.target.result);
                setProcessingText('sending the file');
                var jObject={};
                jObject.type = "upload_image";
                jObject.data = data;
                jObject.crop = crop;
                jObject.extra = jObjectExtra;
                if (crop)
                {
                    var hf = imageUploader.height / imgCroppingFrame.offsetHeight;
                    var wf = imageUploader.width / imgCroppingFrame.offsetWidth;
                    jObject.w = String(Math.round(divCroppingTool.offsetWidth * wf));
                    jObject.h = String(Math.round(divCroppingTool.offsetHeight * hf));
                    jObject.x = String(Math.round(divCroppingTool.offsetLeft * wf));
                    jObject.y = String(Math.round(divCroppingTool.offsetTop * hf));
                } else
                {
                }
                callbacks.send(jObject);
            };
            reader.readAsBinaryString(file);
        }
    }
    this.interpret = function (jObject)
    {
        divSpinner.style.display = 'none';
        timerFailed.stop();
        if (jObject.successful == true)
        {
            setProcessingText('successfully uploaded image');
            if (Windows.instances)
            {
                for (var i = Windows.instances.length - 2; i < Windows.instances.length; i++)
                {
                    var window = Windows.instances[i];
                    if (window.isRoom)
                    {
                        Windows.bringToFront(window);
                        return;
                    }
                }
            }
        } else
        {
            if (jObject.reason != undefined)
            {
             setProcessingText(jObject.reason, true);   
            }
        }
    };
    //divInner.appendChild(menuBar.div);

    this.show = function ()
    {
        genericWindow.show();
        genericWindow.flash();
        genericWindow.bringToFront(self);
    };
    this.hide = function ()
    {
        genericWindow.hide();
    };
    makeUnselectable(this.div);
    //var windowInformation = new WindowInformation(true, true, 250, 250, 600, 600, 0, 100, 0, Windows.maxYPx, true,false, true);
    //var windowCallbacks = new WindowCallbacks(
    //        
     //       function()
    //{
      //          settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
        //        settings.set("size", [self.div.offsetWidth, self.div.offsetHeight]);
    //},
    //function(){
      //  if(self.div.offsetLeft&&self.div.offsetTop)
        //settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
    //},
    //function(){
      //  self.task.minimize();}
    //, undefined, function(){
      //  self.task.minimize();}
        //    , function(zIndex){settings.set("zIndex", zIndex);}
          //  ,function(){
            //    move(); resize();
            //});
            //var params = {obj: this,
        //minimized: true,
        //divTab: self.divTab,
        //divInner: self.divInner,
        //windowInformation: windowInformation,
        //callbacks: windowCallbacks};
    //Windows.add( params);
    //TaskBar.add(this);
}
ImageUploader.show = function (crop, aspectRatio, jObjectExtra, callbacks, forName)
{
    if (!ImageUploader.instance)
    {
        ImageUploader.instance = new ImageUploader(crop, aspectRatio, jObjectExtra, callbacks, forName);
    }
    else
    {
        ImageUploader.instance.setup (crop, aspectRatio, jObjectExtra, callbacks, forName);
    }
    ImageUploader.instance.show();
};
ImageUploader.interpret=function(jObject)
{
  if(ImageUploader.instance)
  {
      ImageUploader.instance.interpret(jObject);
  }
};
function CompositeImage(parentElement, sources) {
    var self = this;
    var img = document.createElement('img');
    img.style.width = '100%';
    parentElement.appendChild(img);
    var index=0;
    this.set = function (sourcesIn) {
        if (sources.length > 0)
            sources = sourcesIn;
    };
    this.dispose = function () {
        parentElement.removeChild(img);
    };
    this.activate = function () {
        if(!contains(CompositeImage.actives, self)) {
            if (sources.length > 0) {
                CompositeImage.actives.push(self);
                if (CompositeImage.actives.length < 2)
                    CompositeImage.timer.reset();
            }
        }
    };
    this.deactivate = function () {
        var index = CompositeImage.actives.indexOf(self);
        if (index >= 0)
            CompositeImage.actives.splice(index, 1);
    };
    if (!CompositeImage.timer) {
        CompositeImage.timer = new Timer(function () {
            foreach(CompositeImage.actives, function (active) {
                active.switch();
            });
        }, 3000, -1);
    }
    this.activate();
    function contains(array, element) {
        return array.indexOf(element) < 0;
    }
    this.switch = function () {
        if (index >= sources.length)
            index = 0;
        img.src = sources[index];
        index++;
    };
}
CompositeImage.actives = [];


 function Notifications(mapIdToRoom, send)
{
    var self = this;
    var selfNotifications = self;
    var settings = new Settings("#rooms", function () {
        this.set("position");
        this.set("showing");
        this.set("size");
        //this is a reset function for this particualr instance of this particular class.
    });
    var minWidth = 200;
    var minHeight = 100;
    this.type = 'Notifications';
    this.taskBarInformation = {tooltip: 'Notifications', icon: ('images/notifications-icon.png'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var divMain = document.createElement('div');
    this.div.style.position = "absolute";
    this.div.style.width = '200px';
    this.div.style.height = '300px';
    this.div.style.top = '300px';
    this.div.style.left = '10px';
    divInner.style.position = 'absolute';
    divInner.style.border = '1px solid #66a3ff';
    //divInner.style.border = '3px solid #0099ff';
    divInner.style.backgroundColor = '#0099ff';
    divInner.style.padding = '0px 3px 3px 3px';
    divInner.style.borderRadius = "5px";
    divInner.style.overflow = 'hidden';
    var startPosition = settings.get("position");
    if (startPosition)
    {
        this.div.style.left = String(startPosition[0]) + 'px';
        this.div.style.top = String(startPosition[1]) + 'px';
    }
    var startSize = settings.get("size");
    if (startSize)
    {
        if (startSize[0] < minWidth)
            startSize[0] = minWidth;
        if (startSize[1] < minHeight)
            startSize[1] = minHeight;
        this.div.style.width = String(startSize[0]) + 'px';
        this.div.style.height = String(startSize[1]) + 'px';
    }
    var startZIndex = settings.get("zIndex");
    if (startZIndex)
    {
        self.div.style.zIndex = String(startZIndex);
    }
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.height = "20px";
    divTab.style.cursor = 'move';
    divTab.style.padLeft = '10px';
    divName.style.float = 'left';
    divName.style.paddingLeft = '5px';
    divName.style.fontFamily = 'Arial';
    verticallyCenter(divName);
    setText(divName, "Notifications");
    divMain.style.backgroundColor = '#555555';
    divMain.style.position = 'relative';
    divMain.style.float = 'left';
    divMain.style.height = 'calc(100% - 41px)';
    divMain.style.width = "100%";
    divMain.style.overflowY = 'auto';
    divMain.style.paddingBottom = '1px';
    var mapIdToNotificationEntry = {};
    var arrayNotificationEntries = [];
    this.listNotifications = function (notifications)
    {
        console.log('listing notifications.');
        var alreadyPresent = [];
        var i = 0;
        for (var i = notifications.length - 1; i >= 0; i--)
        {
            var r = notifications[i];
            if (r.roomUuid)
            {
                if (!mapIdToNotificationEntry[r.roomUuid])
                {
                    var notificationEntry = new NotificationEntry(r);
                    var j = 0;
                    var inserted = false;
                    var lowerCaseName = notificationEntry.info.roomName.toLowerCase();
                    while (j < arrayNotificationEntries.length)
                    {
                        var rEntry = arrayNotificationEntries[j];
                        if (rEntry.info.roomName.toLowerCase() > lowerCaseName)
                        {
                            mapIdToNotificationEntry[r.roomUuid] = notificationEntry;
                            arrayNotificationEntries.splice(j, 0, notificationEntry);
                            divMain.insertBefore(notificationEntry.div, divMain.children[j]);
                            inserted = true;
                            break;
                        }
                        j++;
                    }
                    if (!inserted)
                    {
                        mapIdToNotificationEntry[r.roomUuid] = notificationEntry;
                        arrayNotificationEntries.push(notificationEntry);
                        divMain.appendChild(notificationEntry.div);
                    }
                }
                alreadyPresent.push(r.roomUuid);
            }
        }
        i = 0;
        while (i < arrayNotificationEntries.length)
        {
            var roomInfo = arrayNotificationEntries[i].info;
            if (alreadyPresent.indexOf(roomInfo.roomUuid) < 0)
            {
                removeNotification(roomInfo.roomUuid);
            }
            i++;
        }
    };
    function removeNotification(roomUuid) {
        var notificationEntry = mapIdToNotificationEntry[roomUuid];
        notificationEntry.dispose();
        divMain.removeChild(notificationEntry.div);
        arrayNotificationEntries.splice(arrayNotificationEntries.indexOf(notificationEntry), 1);
        delete mapIdToNotificationEntry[roomUuid];
    }
    this.clearNotification = function (roomUuid) {
        var notificationEntry = mapIdToNotificationEntry[roomUuid];
        if (!notificationEntry)
            return;
        removeNotification(roomUuid);
        clearNotification(send, roomUuid);
    };
    function NotificationEntry(r)
    {
        console.log('notififcation');
        console.log(r);
        var self = this;
        this.info = r;
        this.div = document.createElement('div');
        var divName = document.createElement('div');
        var divImg = document.createElement('div');
        var compositeImage = new CompositeImage(divImg, concateUsersImages(r.users));
        this.div.style.position = 'relative';
        this.div.style.height = '30px';
        this.div.style.width = '100%';
        this.div.style.backgroundColor = '#f0f0f0';
        this.div.style.cursor = 'pointer';
        this.div.style.float = 'left';
        this.div.style.border = '1px solid #4d0026';
        this.div.style.borderRadius = '5px';
        this.div.style.left = '-1px';
        this.div.style.marginLeft = '2px';
        this.div.style.marginTop = '1px';
        this.div.style.overflow = 'hidden';
        this.div.style.width = 'calc(100% - 6px)';
        this.div.style.paddingLeft = '2px';
        divName.style.float = 'left';
        divName.style.fontFamily = 'Arial';
        divName.style.height = '19px';
        divName.style.paddingLeft = '0px';
        divName.style.textOverflow = 'ellipsis';
        divName.style.overflow = 'hidden';
        divName.style.whiteSpace = 'nowrap';
        divName.style.width = '100%';
        divName.style.width = 'calc(100% - 28px)';
        divImg.style.float = 'left';
        divImg.style.height = '28px';
        divImg.style.width = '28px';
        verticallyCenter(divName);
        verticallyCenter(divImg);
        setText(divName, r.roomName);
        this.div.appendChild(divName);
        this.div.appendChild(divImg);
        new Hover(this.div, function () {
            self.div.style.backgroundColor = '#fdfdfe';
        }, function () {
        });
        this.div.onmousedown = function ()
        {
            Windows.cancelBringToFront(selfNotifications);
            var room = mapIdToRoom[r.roomUuid];
            if (room)
            {
                room.task.unminimize();
            }
            else
            {
                console.log('room type in pm is: ');console.log(r.roomType);console.log(r);
                var usernames = [];
                foreach(r.users,function(user){usernames.push(user.username);});
                Lobby.openRoom({roomUuid:r.roomUuid, name:r.roomName, type:r.type, usernames:usernames, show:true});
            }
        };
        this.dispose = function(){
            compositeImage.dispose();
        };
        function concateUsersImages(users){
            var list =[];
            foreach(users, function(user){
                if(user.relativePathImage){
                    list.push(user.relativePathImage);
                }
            });
            return list;
        }
    }
    function verticallyCenter(element)
    {
        element.style.position = 'relative';
        element.style.top = '50%';
        element.style.transform = 'translateY(-50%)';
        element.style.msTransform = 'translateY(-50%)';
        element.style.webkitTransform = 'translateY(-50%)';
        element.style.oTransform = 'translateY(-50%)';
    }
    this.div.appendChild(divInner);
    divInner.appendChild(divTab);
    divTab.appendChild(divName);
    divInner.appendChild(divMain);
    this.show = function ()
    {
        self.div.style.display = 'inline';
        settings.set("showing", true);
    };
    this.hide = function ()
    {
        self.div.style.display = 'none';
        settings.set("showing", false);
    };
    var showing = settings.get("showing");
    if (showing)
    {
        this.show();
    }
    else
    {
        if (showing == false)
        {
            this.hide();
        }
    }
    makeUnselectable(this.div);
    Themes.register({components: [
            {name: 'body', elements: [divMain]},
            {name: 'text', elements: [divName]}
        ],
        callback: function (theme) {

        }});
    Window.style(self.div, divInner, divTab);
    var windowInformation =new WindowInformation(true, true, 200, 100, 199, Windows.maxHeightPx, 0, 100, 0, Windows.maxYPx, true, false, true);
            var windowCallbacks = new WindowCallbacks(function () {
                settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
                settings.set("size", [200, self.div.offsetHeight]);
            }, function () {
                if (self.div.offsetLeft && self.div.offsetTop)
                    settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
            },
                    function () {
                        self.task.minimize();
                    }, undefined, function () {
                self.task.minimize();
            }, function (zIndex) {
                settings.set("zIndex", zIndex);
            });var  params = {obj: this,
        minimized: false,
        divTab: divTab,
        divInner: divInner,
        windowInformation: windowInformation,
        callbacks: windowCallbacks};
    Windows.add( params);
    TaskBar.add(this);
    getNotifications();
    function getNotifications() {
        send({type: "get_notifications"});
    }
}
function Messenger()
{
    var listTerminals = [];
    var mapTerminalIdToInterpreter = {};
    function send(terminal, jObject)
    {
        for (var i = 0; i < listTerminals.length; i++)
        {
            var t = listTerminals[i];
            if (t != terminal)
                mapTerminalIdToInterpreter[t.id](jObject);
        }
    }
    function close(terminal)
    {
        listTerminals.splice(listTerminals.indexOf(terminal), 1);
        delete mapTerminalIdToInterpreter[terminal.id];
    }
    this.getTerminal = function(interpreter)
    {
        return new Terminal(interpreter);
    };
    var idCount = 0;

    function Terminal(interpreter)
    {
        this.id = idCount;
        idCount++;
        var self = this;
        this.send = function(jObject)
        {
            send(self, jObject);
        };
        this.close = function()
        {
            close(self);
        };
        listTerminals.push(this);
        mapTerminalIdToInterpreter[self.id] = interpreter;
    }
}
function EditButton(callback, dontFlipFlop)
    {
        var locked=true;
        this.div = document.createElement('div');
        this.div.style.height = '20px';
        this.div.style.maxHeight = '100%';
        this.div.style.width = 'auto';
        this.div.style.position = 'absolute';
        this.div.style.right = '0px';
        this.div.style.cursor = 'pointer';
        var img = document.createElement('img');
        img.style.height = '100%';
        this.div.style.top = '0px';
        img.style.position = 'relative';
        img.style.float = 'left';
        var hovering = false;
        function setIcon()
        {
            if (hovering)
                img.src = window.thePageUrl + (locked ? 'images/writing_hover.png' : 'images/writing_lock_hover.png');
            else
                img.src = window.thePageUrl + (locked ? 'images/writing.png' : 'images/writing_lock.png');
        }
        this.setIcon=setIcon;
        img.src = window.thePageUrl + (locked ? 'images/writing.png' : 'images/writing_lock.png');
        this.div.appendChild(img);
        setIcon();
        new Hover(this.div, function () {
            hovering = true;
            setIcon();
        }, function () {
            hovering = false;
            setIcon();
        });
        this.div.addEventListener(dontFlipFlop?'click':'mousedown', dontFlipFlop?function(e){callback();
}:function(){
        locked = !locked;
        setIcon();
        callback(locked);
    });
}
var Cursors={grab:'url('+window.thePageUrl+'cursors/hand_move_grab.png)11 0, auto', hand:'url('+window.thePageUrl+'cursors/hand_move_no_grab.png)14 0, auto'};
function ImagesDisplay(path, pictures, callbackUpload, callbackOperations)
{
    var self = this;
    var imageDisplays = [];
    var clickingButton = false;
    this.div = document.createElement('div');
    this.div.style.backgroundColor = "rgba(10,10,10,0.1)";
    this.div.style.overflowY = 'hidden';
    this.div.style.overflowX = 'hidden';
    var divImageDisplayHousing = document.createElement('div');
    divImageDisplayHousing.style.height = '100%';
    divImageDisplayHousing.style.width = 'auto';
    divImageDisplayHousing.style.position = 'absolute';
    divImageDisplayHousing.style.top = '0px';
    divImageDisplayHousing.style.left = '0px';
    divImageDisplayHousing.style.overflowY = 'hidden';
    divImageDisplayHousing.style.overflowX = 'visible';
    divImageDisplayHousing.style.minWidth = '10000px';
    divImageDisplayHousing.style.cursor = Cursors.hand;

    var divImageDisplayHousingMeasurer = document.createElement('div');
    divImageDisplayHousingMeasurer.style.height = '100%';
    divImageDisplayHousingMeasurer.style.width = 'auto';
    divImageDisplayHousingMeasurer.style.position = 'relative';
    divImageDisplayHousingMeasurer.style.float = 'left';
    this.div.appendChild(divImageDisplayHousing);
    divImageDisplayHousing.appendChild(divImageDisplayHousingMeasurer);

    var efficientMovingCycle = new EfficientMovingCycle(divImageDisplayHousing);
    var startOffsets;
    efficientMovingCycle.onmousedown = function(e) {
        e.preventDefault && e.preventDefault();
        return mouseDown(e.pageX, e.pageY);
    };
    efficientMovingCycle.onmouseup = mouseUp;
    efficientMovingCycle.onmousemove = function(e) {
        e.preventDefault && e.preventDefault();
        mouseMove(e.pageX, e.pageY);
    };
    efficientMovingCycle.ontouchstart = function(e) {
        e.preventDefault && e.preventDefault();
        return mouseDown(e.changedTouches[e.changedTouches.length - 1].pageX, e.changedTouches[e.changedTouches.length - 1].pageY);
    };
    efficientMovingCycle.ontouchmove = function(e) {
        e.preventDefault && e.preventDefault();
        mouseMove(e.changedTouches[e.changedTouches.length - 1].pageX, e.changedTouches[e.changedTouches.length - 1].pageY);
    };
    efficientMovingCycle.ontouchend = mouseUp;
    if (callbackUpload)
        divImageDisplayHousingMeasurer.appendChild(new ImageAdd().div);
    this.addImage = function(picture)
    {
        var imageDisplay = new ImageDisplay(picture.relativePath, picture.isProfile);
        divImageDisplayHousingMeasurer.appendChild(imageDisplay.div);
        imageDisplays.push(imageDisplay);
        if(callbackUpload)
            updateButtons();
    };
    this.addImages = function(pictures)
    {
        for (var i = 0; i < pictures.length; i++)
        {
            var picture = pictures[i];
            console.log('picture');
            console.log(picture);
            var imageDisplay = new ImageDisplay(picture.relativePath, picture.isProfile);
            divImageDisplayHousingMeasurer.appendChild(imageDisplay.div);
            imageDisplays.push(imageDisplay);
        }
        if(callbackUpload)
            updateButtons();
    };
    function updateButtons()
    {
        if (imageDisplays.length > 0)
        {
            imageDisplays[0].showRight();
            imageDisplays[imageDisplays.length - 1].showLeft();
            imageDisplays[0].hideLeft();
            imageDisplays[imageDisplays.length - 1].hideRight();
            if (imageDisplays.length > 1)
            {
                for (var i = 1; i < imageDisplays.length - 1; i++)
                {
                    imageDisplays[i].showLeft();
                    imageDisplays[i].showRight();
                }
            }
        }
    }
    function shiftLeft(imageDisplay)
    {
        var index = imageDisplays.indexOf(imageDisplay);
        if (index > 0)
        {
            divImageDisplayHousingMeasurer.removeChild(imageDisplay.div);
            divImageDisplayHousingMeasurer.insertBefore(imageDisplay.div, imageDisplays[index - 1].div);
            imageDisplays.splice(index, 1);
            index--;
            imageDisplays.splice(index, 0, imageDisplay);
            updateButtons();

        }
    }
    function shiftRight(imageDisplay)
    {
        var index = imageDisplays.indexOf(imageDisplay);
        if (index < imageDisplays.length)
        {
            divImageDisplayHousingMeasurer.removeChild(imageDisplay.div);
            if (index < imageDisplays.length - 2)
                divImageDisplayHousingMeasurer.insertBefore(imageDisplay.div, imageDisplays[index + 2].div);
            else
                divImageDisplayHousingMeasurer.appendChild(imageDisplay.div);
            imageDisplays.splice(index, 1);
            index++;
            imageDisplays.splice(index, 0, imageDisplay);
            updateButtons();
        }
    }
    function removeImage(imageDisplay)
    {

        var index = imageDisplays.indexOf(imageDisplay);
        imageDisplays.splice(index, 1);
        divImageDisplayHousingMeasurer.removeChild(imageDisplay.div);
        updateButtons();
    }
    function canUnprofile(imageDisplay){
        var nProfile = 0;
        foreach(imageDisplays, function(imageDisplay){
            if(imageDisplay.isProfile())
            {
                nProfile++;
            }
        });
        return nProfile>1;
    }
    function canDelete(i){
        var nOtherProfile = 0;
        foreach(imageDisplays, function(imageDisplay){
            if(i!=imageDisplay)
            if(imageDisplay.isProfile())
            {
                nOtherProfile++;
            }
        });
        return nOtherProfile>0;
    }
    this.addImages(pictures);
    function mouseDown(x, y)
    {
        if (clickingButton) {
            console.log('dsfdsffds');
            return false;
        }
        divImageDisplayHousing.style.cursor = Cursors.grab;
        startOffsets = {x: x - divImageDisplayHousing.offsetLeft, maxLeft: (self.div.offsetWidth > divImageDisplayHousingMeasurer.offsetWidth) ? 0 : maxLeft = self.div.offsetWidth - divImageDisplayHousingMeasurer.offsetWidth};
    }
    var previousLeft = 0;
    function mouseMove(x, y)
    {
        var left = x - startOffsets.x;
        if (left > 0)
        {
            left = 0;
        } else
        {
            if (left < startOffsets.maxLeft)
            {
                left = startOffsets.maxLeft;
            }
        }

        previousLeft = left;

        divImageDisplayHousing.style.left = String(left) + 'px';
    }
    function mouseUp() {
        divImageDisplayHousing.style.cursor = Cursors.hand;
    }
    var optionPaneError = new OptionPane(this.div);
    function showError(message){
        
                    optionPaneError.show([['Ok', function () {
                            }]], message, function () {
                    });
                    optionPaneError.div.style.left = 'calc(50% - 100px)';
                    optionPaneError.div.style.width = '200px';
                    optionPaneError.div.style.marginLeft = '0px';
    };
    this.resized = function()
    {
        var m = (self.div.offsetWidth > divImageDisplayHousingMeasurer.offsetWidth) ? 0 : self.div.offsetWidth - divImageDisplayHousingMeasurer.offsetWidth;
        if (previousLeft != undefined)
        {

            if (m < previousLeft)
            {
                m = previousLeft;
            } else
            {
                previousLeft = m;
            }
        }
        divImageDisplayHousing.style.left = String(m) + 'px';
    };
    function ImageDisplay(relativePath, isProfile)
    {
        var self = this;
        this.div = document.createElement('div');
        this.div.style.height = '100%';
        this.div.style.width = 'auto';
        this.div.style.position = 'relative';
        this.div.style.float = 'left';
        var img = document.createElement('img');
        img.style.height = '100%';
        img.src = path + relativePath;
        this.div.appendChild(img);
        var top = 10;
        if (callbackUpload)
        {
            function createControlButton(src, srcHover, callback)
            {
                var controlButton = new ControlButton(src, srcHover, top, callback);
                top += 20;
                self.div.appendChild(controlButton.div);
                return controlButton;
            }
            var showRight = true;
            var showLeft = true;
            if (!isMobile)
                new Hover(this.div, function() {
                    if (showLeft)
                        buttonLeft.div.style.display = 'inline';
                    if (showRight)
                        buttonRight.div.style.display = 'inline';
                    buttonDelete.div.style.display = 'inline';
                    buttonProfile.div.style.display = 'inline';
                }, function() {
                    buttonLeft.div.style.display = 'none';
                    buttonRight.div.style.display = 'none';
                    buttonDelete.div.style.display = 'none';
                    buttonProfile.div.style.display = 'none';
                });
            var buttonRight = createControlButton('images/arrow_right.png', 'images/arrow_right_hover.png', function() {
                callbackOperations({type: 'shift_right', relativePath: relativePath});
                shiftRight(self);
            });
            var buttonLeft = createControlButton('images/arrow_left.png', 'images/arrow_left_hover.png', function() {
                callbackOperations({type: 'shift_left', relativePath: relativePath});
                shiftLeft(self);
            });
            var buttonProfile;
                    buttonProfile= createControlButton(isProfile?'images/set_not_profile.png':'images/set_profile.png', isProfile?'images/set_not_profile_hover.png':'images/set_profile_hover.png', function() {
                        console.log(canUnprofile(self));
                        if((!isProfile)||canUnprofile(self))
                        {
                            isProfile?callbackOperations({type: 'set_not_profile', relativePath: relativePath}):callbackOperations({type: 'set_profile', relativePath: relativePath});
                            isProfile=!isProfile;
                            buttonProfile.setSrcs(isProfile?'images/set_not_profile.png':'images/set_profile.png', isProfile?'images/set_not_profile_hover.png':'images/set_profile_hover.png');
                        }
                        else{
                            showError("You can't unprofile your only profile picture!");
                        }
            });
            var buttonDelete = createControlButton('images/delete.png', 'images/delete_hover.png', function() {
                if(canDelete(self)){callbackOperations({type: 'delete', relativePath: relativePath});
                removeImage(self);}else showError("You can't delete your only profile picture!");
            });
            this.showRight = function()
            {
                showRight = true;
            };
            this.hideLeft = function()
            {
                showLeft = false;
                buttonLeft.div.style.display = 'none';
            };
            this.showLeft = function()
            {
                showLeft = true;
            };
            this.hideRight = function()
            {
                showRight = false;
                buttonRight.div.style.display = 'none';
            };
            this.isProfile=function(){
                return isProfile;
            };
        }

    }
    function ControlButton(src, srcHover, top, callback)
    {
        this.div = document.createElement('div');
        this.div.style.cursor = 'pointer';
        this.div.style.height = '20px';
        this.div.style.width = '20px';
        this.div.style.top = String(top) + 'px';
        this.div.style.right = '2px';
        this.div.style.position = 'absolute';
        this.div.style.display = isMobile ? 'inline' : 'none';
        var img = document.createElement('img');
        img.style.width = '100%';
        img.style.height = '100%';
        img.src = src;
        img.style.opacity = "0.75";
        var hovering=false;
        new Hover(this.div, function() {
            hovering=true;
            img.src = srcHover;
        }, function() {
            hovering=false;
            img.src = src;
            clickingButton = false;
        });
        this.div.appendChild(img);
        this.div.addEventListener('mousedown', function() {
            clickingButton = true;
        });
        this.div.addEventListener('mouseup', function() {
            clickingButton = false;
            callback();
        });
        this.setSrcs=function(srcIn, srcHoverIn)
        {
            src=srcIn;
            srcHover=srcHoverIn;
            img.src=hovering?srcHover:src;
        };
    }
    function ImageAdd()
    {
        this.div = document.createElement('div');
        this.div.style.height = '100%';
        this.div.style.width = 'auto';
        this.div.style.position = 'relative';
        this.div.style.float = 'left';
        this.div.style.cursor = 'pointer';
        this.div.onclick = callbackUpload;
        function styleImg(img)
        {
            img.style.maxHeight = '100%';
            img.style.verticalAlign = 'middle';
        }
        var img = document.createElement('img');
        img.src = window.thePageUrl + 'images/add_image.png';
        img.style.position = 'absolute';
        styleImg(img);
        var imgButton = document.createElement('img');
        imgButton.src = window.thePageUrl + 'images/add_image_button.png';
        styleImg(imgButton);
        this.div.appendChild(img);
        this.div.appendChild(imgButton);
        new Hover(this.div, function() {
            imgButton.src = window.thePageUrl + 'images/add_image_button_blue.png';
        }, function() {
            imgButton.src = window.thePageUrl + 'images/add_image_button.png';
        });
    }
}

function Popup(parent, placement, forceToFront, offsets, callbackClosing)
{
    var self = this;
    this.div = document.createElement('div');
    this.div.style.display='none';
    function extractNumber(str)
    {
        var index = str.indexOf('%');
        if (index > -1)
            return parseInt(str.substring(0, index));
        index = str.indexOf('px');
        return parseInt(str.substring(0, index));
    }
    var offsetNumbers;
    function getOffsetNumbers()
    {
        offsetNumbers = {};
        if (offsets.width)
            offsetNumbers.width = extractNumber(offsets.width);
        if (offsets.height)
            offsetNumbers.height = extractNumber(offsets.height);
        if (offsets.left)
            offsetNumbers.left = extractNumber(offsets.left);
        if (offsets.top)
            offsetNumbers.top = extractNumber(offsets.top);
    }
    getOffsetNumbers(offsets);
    var self = this;
    if (!placement)
        placement = Popup.Placement.Relative;
    if (forceToFront == undefined)
        forceToFront = false;
    var showing = false;
    var parentWindow = Windows.getParentWindow(parent);
    var mousedown = function (e) {
        if (!e)
            var e = window.event;
        if (!pointIsOver(e.pageX, e.pageY))
            self.hide();
    };
    this.show = function ()
    {
        if (!showing)
        {
            self.div.style.display = 'inline';
            showing = true;
            document.documentElement.addEventListener("mousedown", mousedown);
            bringInFront();
            position();
                if(self.onshow)
                    try
                {
                    self.onshow();
                }
                catch(ex)
                {
                    console.log(ex);
                }
        }
    };
    this.hide = function ()
    {
        if (showing)
        {
            showing = false;
            self.div.style.display='none';
            document.documentElement.removeEventListener("mousedown", mousedown);
            if(callbackClosing)
                callbackClosing();
        }
    };
    function pointIsOver(x, y)
    {
        var offsets = getAbsolute(self.div);
        return (x >= offsets.left && x < offsets.left + self.div.offsetWidth && y >= offsets.top && y < offsets.top + self.div.offsetHeight);
    }
    function bringInFront()
    {
        var zIndex;
        if (forceToFront)
            zIndex = getZIndex(parentWindow);
        else
            zIndex = 200000;
        self.div.style.zIndex = String(zIndex + 1);
    }
    function position()
    {
        var left;
        var top;
        switch (placement)
        {
            case Popup.Placement.Absolute:
                self.div.style.position = 'absolute';
                var abs = getAbsolute(parent);
                if (offsets)
                {
                    if (offsets.width)
                    {
                        if (offsets.width.indexOf('%') > 0)
                            self.div.style.width = String((offsetNumbers.width * parent.offsetWidth) / 100) + 'px';
                        else
                        {
                        if (offsets.width.indexOf('px') > 0)
                            self.div.style.width = offsets.width;
                        else
                            self.div.style.width='auto';
                        }
                    }
                    if (offsets.height)
                    {
                        if (offsets.height.indexOf('%') > 0)
                            self.div.style.height = String((offsetNumbers.height * parent.offsetHeight) / 100) + 'px';
                        else
                        {
                        if (offsets.height.indexOf('px') > 0)
                            self.div.style.height = offsets.height;
                        else
                            self.div.style.height='auto';
                        }
                    }
                }
                left = abs.left + offsetNumbers.left;
                top = abs.top + offsetNumbers.top;
                break;
            case Popup.Placement.Fixed:
                self.div.style.position = 'fixed';
                left = self.x;
                top = self.y;
        }
        self.div.style.left = String(left) + 'px';
        self.div.style.top = String(top) + 'px';
    }
    document.documentElement.appendChild(this.div);
}
Popup.Placement = {Absolute: 'absolute', Relative: 'relative', Fixed: 'fixed'};
function TickBox(callback, name, width, doubleBox)
{
    var self = this;
    this.div = document.createElement('div');
    this.div.style.width = width;
    this.div.style.height = '20px';
    this.div.style.position = 'relative';
    this.div.style.float = 'left';
    var divName = document.createElement('div');

    var checkbox = document.createElement('input');
    var checkbox2;
    checkbox.type = 'checkbox';
    checkbox.style.width = '10px';
    checkbox.style.height = '10px';
    checkbox.style.position = 'absolute';
    this.div.appendChild(checkbox);
    if (doubleBox)
    {
        checkbox2 = document.createElement('input');
        checkbox2.type = 'checkbox';
        checkbox2.style.width = '10px';
        checkbox2.style.height = '10px';
        checkbox2.style.left = '30px';
        checkbox2.style.position = 'absolute';
        this.div.appendChild(checkbox2);
    }
    divName.style.width = 'calc(100% - ' + (doubleBox ? '50' : '20') + 'px)';
    divName.style.left = doubleBox ? '50px' : '20px';
    divName.style.height = '100%';
    divName.style.position = 'absolute';
    divName.style.fontSize = '12px';
    setWordEllipsis(divName);
    setText(divName, name);
    this.div.appendChild(divName);
    self.ticked = doubleBox?undefined:false;
    var click = doubleBox ? function (n) {
        console.log(self.ticked);
        var check = (n > 0 ? checkbox2 : checkbox);
        var other = (n > 0 ? checkbox : checkbox2);
       /* try
        {
            callback[n](check.checked, self);
        } catch (ex)
        {
            console.log(ex);
        }*/
        if (other.checked)
        {
            other.checked = false;
           /* try
            {
                callback[(n + 1) % 1](other.checked, self);
            } catch (ex)
            {
                console.log(ex);
            }*/
        }
        self.ticked = checkbox.checked ?checkbox.checked:(checkbox2.checked?false:undefined);
    } : function () {
        self.ticked = checkbox.checked;
        try
        {
            callback(checkbox.checked, self);
        } catch (ex)
        {
            console.log(ex);
        }
    };

    checkbox.addEventListener('click', function () {
        click(0);
    });
    if (doubleBox)
        checkbox2.addEventListener('click', function () {
            click(1);
        });
    this.setTicked = function (value) {
        
        if (doubleBox)
        {
            if (value == undefined)
                return;
            checkbox2.checked = !value;
        }
        checkbox.checked = value;
        self.ticked=value;
    };
    var themesObject = {components: [
            {name: 'text', elements: [divName]}
        ],
        callback: function (theme) {
        }
    };
    Themes.register(themesObject);
    this.close = function () {
        Themes.remove(themesObject);
    };
}
function TickBoxes(entries, type, width, tickBoxWidth, titl, doubleBox)
{
    var self = this;
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    this.div.style.width = width;
    this.div.style.position = 'relative';
    this.div.style.float = 'left';
    this.div.style.height = 'auto';
    var divIntermediate = document.createElement('div');
    divIntermediate.style.position = 'relative';
    divIntermediate.style.float = 'left';
    divIntermediate.style.height = 'auto';
    if (width.indexOf('auto') > -1)
    {
        divIntermediate.style.margin = '3px';
        divIntermediate.style.width = 'auto';
        divInner.style.margin = '2px';
        divInner.style.width = 'auto';
    } else
    {
        divIntermediate.style.width = 'calc(100% - 6px)';
        divIntermediate.style.marginTop = '2px';
        divIntermediate.style.marginBottom = '2px';
        divIntermediate.style.left = '3px';
        divInner.style.marginTop = '2px';
        divInner.style.marginBottom = '2px';
        divInner.style.width = 'calc(100% - 4px)';
        divInner.style.left = '2px';
    }
    divInner.style.height = 'auto';
    divInner.style.position = 'relative';
    divInner.style.float = 'left';
    this.div.appendChild(divIntermediate);
    if (titl)
    {
        var divTitle = document.createElement('div');
        divTitle.style.width = '100%';
        divTitle.style.position = 'relative';
        divTitle.style.height = '18px';
        divTitle.style.left = '10px';
        divTitle.style.float = 'left';
        divTitle.style.fontSize = '12px';
        setWordEllipsis(divTitle);
        setText(divTitle, titl);
        divInner.appendChild(divTitle);
    }
    divIntermediate.appendChild(divInner);
    if (doubleBox)
    {
        var divLikeDislike = document.createElement('div');
        divLikeDislike.style.width = '100%';
        divLikeDislike.style.position = 'relative';
        divLikeDislike.style.height = '18px';
        divLikeDislike.style.left = '2px';
        divLikeDislike.style.float = 'left';
        divLikeDislike.style.fontSize = '8px';
        divLikeDislike.style.fontWeight = 'bold';
        setWordEllipsis(divLikeDislike);
        setText(divLikeDislike, "Like  Dislike");
        divInner.appendChild(divLikeDislike);
    }
    var tickBoxes = [];
    if (type == 'combination' && !doubleBox) {
        var tickBoxAll;
        tickBoxAll = new TickBox(function () {
            for (var i = 0; i < tickBoxes.length; i++)
            {
                tickBoxes[i].setTicked(tickBoxAll.ticked);
            }
        }, 'All', tickBoxWidth);
        tickBoxAll.value = -1;
        divInner.appendChild(tickBoxAll.div);
    }
    var callback = (type == 'single') && !doubleBox ? function (ticked, tickBoxChanged)
    {

        if (ticked)
        {
            for (var j = 0; j < tickBoxes.length; j++)
            {
                var tickBox = tickBoxes[j];
                if (tickBox != tickBoxChanged)
                {
                    tickBox.setTicked(false);
                }
            }
        } else
            tickBoxChanged.setTicked(true);
    } : (doubleBox ? [function () {}, function () {}] : function () {});
    for (var i = 0; i < entries.length; i++)
    {
        var entry = entries[i];
        var tickBox = new TickBox(callback, entry.txt, tickBoxWidth, doubleBox);
        tickBox.value = entry.value;
        tickBoxes.push(tickBox);
        divInner.appendChild(tickBox.div);
    }
    this.getValues = doubleBox ? function () {
        var jObjectLeft = [];
        var jObjectRight = [];
        for (var j = 0; j < tickBoxes.length; j++)
        {
            var tickBox = tickBoxes[j];
            if (tickBox.ticked)
                jObjectLeft.push(tickBox.value);
            else {
                if (tickBox.ticked != undefined)
                    jObjectRight.push(tickBox.value);
            }
        }
        return {left: jObjectLeft, right: jObjectRight};
    } : function ()
    {
        var jObject = [];
        for (var j = 0; j < tickBoxes.length; j++)
        {
            var tickBox = tickBoxes[j];
            if (tickBox.ticked)
                jObject.push(tickBox.value);
        }
        return jObject;
    };
    this.setValues = doubleBox ? function (jObject)
    {
        if (jObject)
            if (jObject.left&& jObject.right)
        {
                for (var j = 0; j < tickBoxes.length; j++)
                {
                    var tickBox = tickBoxes[j];
                    if (jObject.left.indexOf(tickBox.value) > -1)
                        tickBox.setTicked(true);
                    else
                    {
                        if (jObject.right.indexOf(tickBox.value) > -1)
                        {
                            tickBox.setTicked(false);
                        }
                    }
                }
        }
    } : function (jObject)
    {
        if (jObject)
        for (var j = 0; j < tickBoxes.length; j++)
        {
            var tickBox = tickBoxes[j];
            tickBox.setTicked(jObject.indexOf(tickBox.value) > -1);
        }
    };
    var themesObject = {components: [{name: 'body', elements: [divInner]}, {name: 'frame', elements: [divIntermediate]}
        ],
        callback: function (theme) {
        }
    };
    if (titl)
    {
        themesObject.components.push({name: 'text', elements: [divTitle]});
    }
    if (doubleBox)
    {
        themesObject.components.push({name: 'text', elements: [divLikeDislike]});
    }
    Themes.register(themesObject);
    this.close = function () {
        for (var i = 0; i < entries.length; i++)
        {
            var tickBox = tickBoxes[i];
            tickBox.close();
        }
        Themes.remove(themesObject);
    };
}
TickBoxes.Type = {Single: 'single', Combination: 'combination'};
function Interests() {

}

Interests.values = [
    {value: 1, txt: 'Adult Parties'},
    {value: 2, txt: 'Adult Baby Minding'},
    {value: 3, txt: 'Anal'},
    {value: 4, txt: 'Anal Play'},
    {value: 5, txt: 'Bareback'},
    {value: 6, txt: 'BDSM (giving)'},
    {value: 7, txt: 'BDSM (receiving)'},
    {value: 8, txt: 'Being Filmed'},
    {value: 9, txt: 'Blindfolds'},
    {value: 10, txt: 'Bukkake'},
    {value: 11, txt: 'Car Meets'},
    {value: 12, txt: 'CIM'},
    {value: 13, txt: 'Cross Dressing'},
    {value: 14, txt: 'Cuckolding'},
    {value: 15, txt: 'Cybersex'},
    {value: 16, txt: 'Deep Throat'},
    {value: 17, txt: 'Depilation'},
    {value: 18, txt: 'Dogging'},
    {value: 19, txt: 'Domination(giving)'},
    {value: 20, txt: 'Domination(receiving)'},
    {value: 21, txt: 'Double Penetration'},
    {value: 22, txt: 'Enema'},
    {value: 23, txt: 'Exhibitionism'},
    {value: 24, txt: 'Face Sitting'},
    {value: 25, txt: 'Facials'},
    {value: 26, txt: 'Female Ejaculation'},
    {value: 27, txt: 'Fisting(giving)'},
    {value: 28, txt: 'Fisting(receiving)'},
    {value: 29, txt: 'Food Sex/Sploshing'},
    {value: 30, txt: 'Foot Worship'},
    {value: 31, txt: 'French Kissing'},
    {value: 32, txt: 'Gang Bangs'},
    {value: 33, txt: 'Group Sex'},
    {value: 34, txt: 'Hand Relief'},
    {value: 35, txt: 'Hardsports(giving)'},
    {value: 36, txt: 'Hardsports(receiving)'},
    {value: 37, txt: 'Humiliation(giving)'},
    {value: 38, txt: 'Humiliation(receiving)'},
    {value: 39, txt: 'Lapdancing'},
    {value: 40, txt: 'Massage'},
    {value: 41, txt: 'Milking/Lactating'},
    {value: 42, txt: 'Modeling'},
    {value: 43, txt: 'Moresomes'},
    {value: 44, txt: 'Naturism/Nudism'},
    {value: 45, txt: 'Making Videos'},
    {value: 46, txt: 'Oral'},
    {value: 47, txt: 'Parties'},
    {value: 48, txt: 'Period Play'},
    {value: 49, txt: 'Pole Dancing'},
    {value: 50, txt: 'Pregnant'},
    {value: 51, txt: 'Prostate Massage'},
    {value: 52, txt: 'Pussy Pumping'},
    {value: 53, txt: 'Phone Sex'},
    {value: 54, txt: 'Receiving Oral'},
    {value: 55, txt: 'Rimming(giving)'},
    {value: 56, txt: 'Rimming(receiving)'},
    {value: 57, txt: 'Role Play/Fantasy'},
    {value: 58, txt: 'Safe Sex'},
    {value: 59, txt: 'Same Room Swap'},
    {value: 60, txt: 'Sauna'},
    {value: 61, txt: 'SM'},
    {value: 62, txt: 'Smoking(Fetish)'},
    {value: 63, txt: 'Snowballing'},
    {value: 64, txt: 'Soft Swing'},
    {value: 65, txt: 'Spanking(giving)'},
    {value: 66, txt: 'Spanking(receiving)'},
    {value: 67, txt: 'Strap On'},
    {value: 68, txt: 'Striptease'},
    {value: 69, txt: 'Sub games'},
    {value: 70, txt: 'Swallow'},
    {value: 71, txt: 'Swingers Clubs'},
    {value: 72, txt: 'Taking Photos'},
    {value: 73, txt: 'Tantric'},
    {value: 74, txt: 'Threesomes'},
    {value: 75, txt: 'Tie & Tease'},
    {value: 76, txt: 'Toys'},
    {value: 77, txt: 'Uniforms'},
    {value: 78, txt: 'Unprotected Sex'},
    {value: 79, txt: 'Voyeurism'},
    {value: 80, txt: 'Watersports(giving)'},
    {value: 81, txt: 'Watersports(receiving)'}
];
Interests.mapValueToTxt={};(function(){
    for(var i=0;  i<Interests.values.length; i++)
    {
        var pair = Interests.values[i];
        Interests.mapValueToTxt[pair.value]=pair.txt;
    }
})();
Interests.txtFromValue=function(value)
{
    return Interests.mapValueToTxt[value];
};
function PopupInterests(parentDiv, callback)
{
    var self=this;
    var popupInterests = new Popup(parentDiv, 'absolute', false, {width: '100%', height: 'auto', left: '0px', top: '24px'}            , function(){
        callback(self.getValues());
    });
    popupInterests.div.style.minHeight = '10px';
    var divInterests = document.createElement('div');
    function stylePopupFrame(div)
    {
        div.style.height = 'auto';
        div.style.minHeight = '10px';
        div.style.width = '100%';
        div.style.marginTop = '2px';
        div.style.marginBottom = '2px';
        div.style.position = 'relative';
        div.style.float = 'left';
    }
    stylePopupFrame(divInterests);
    var tickBoxesInterests = new TickBoxes(Interests.values, 'combination', '100%', '190px', "Interested in:", true);
    divInterests.appendChild(tickBoxesInterests.div);
    popupInterests.div.appendChild(divInterests);
    this.setValues = function (interests) {
        var o={left:interests['like'], right:interests.dislike};
        tickBoxesInterests.setValues(o);
    };
    this.getValues=function(){
        var o= tickBoxesInterests.getValues();
        return{like:o.left, dislike:o.right};
    };
    this.show=function(){
        popupInterests.show();
    };
}

function ExpandingTextarea(minHeight, callbackResized)
{
    var self = this;
    self.textarea = document.createElement('textarea');
    self.textarea.style.resize='none';
    self.textarea.style.overflow='hidden';
    var observe;
    if (window.attachEvent) {
        observe = function (element, event, handler) {
            element.attachEvent('on' + event, handler);
        };
    } else {
        observe = function (element, event, handler) {
            element.addEventListener(event, handler, false);
        };
    }

    function resize() {
        self.textarea.style.height = 'auto';
        var heightString=(self.textarea.scrollHeight<minHeight?minHeight:self.textarea.scrollHeight)+ 'px';
        self.textarea.style.height = heightString;
        if(callbackResized)
            callbackResized(self.textarea.scrollHeight, heightString);
    }
    this.resize=resize;
    /* 0-timeout to get the already changed text */
    function delayedResize() {
        window.setTimeout(resize, 0);
    }
    observe(self.textarea, 'change', resize);
    observe(self.textarea, 'cut', delayedResize);
    observe(self.textarea, 'paste', delayedResize);
    observe(self.textarea, 'drop', delayedResize);
    observe(self.textarea, 'keydown', delayedResize);
    self.textarea.focus();
    self.textarea.select();
    resize();

}
function TextBox(callbackEdit, multiline, autoSize, fontSize, isLocked, initialText, maxLength, styleNames, minHeight)
{
    var self = this;
    styleNames = !styleNames ? {} : styleNames;
    if (!minHeight)
        minHeight = 20;
    if (isLocked == undefined) 
        isLocked = true;
    this.div = document.createElement('div');
    var preText = document.createElement((!multiline && autoSize) ? 'span' : 'pre');
    this.div.style.float = 'left';
    preText.style.margin = '0px';
    var text;
    var expandingTextarea;
    if (!multiline)
    {
        preText.style.whiteSpace = 'nowrap';
        text = document.createElement('input');
        text.type = 'text';
        text.style.position = 'absolute';
        text.style.height = '100%';
        if (autoSize)
        {
            this.div.style.maxWidth = '100%';
        } else
        {
            verticallyCenter(preText);
        }
    } else
    {
        preText.style.whiteSpace = 'pre-wrap';
        if (autoSize)
        {
            expandingTextarea = new ExpandingTextarea(minHeight, function (height, heightString) {
                preText.style.height = heightString;
            });
            text = expandingTextarea.textarea;
            text.style.position = 'absolute';
            this.resize = expandingTextarea.resize;
            text.style.height = '100%';
        } else
        {
            text = document.createElement('textarea');
            text.style.resize = 'none';
            text.style.overflow = 'hidden';
            text.style.position = 'absolute';
        }
    }
    if (maxLength)
        text.maxLength = maxLength;
    function styleElement(text)
    {
        text.style.fontSize = String(fontSize) + 'px';
        text.style.fontFamily = 'Arial';
        text.style.boxSizing = 'border-box';
        text.style.width = '100%';
    }
    styleElement(text);
    styleElement(preText);
    if (initialText)
    {
        text.value = initialText;
        setText(preText, initialText);
    }
    preText.style.paddingLeft = '1px';
    preText.style.overflow = 'hidden';
    preText.style.textOverflow = 'ellipsis';
    if (multiline)
        preText.style.position = 'relative';
    preText.style.float = 'left';
    (!isLocked && callbackEdit ? text : preText).style.visibility = 'visible';
    (!isLocked && callbackEdit ? preText : text).style.visibility = 'hidden';
    this.div.appendChild(text);
    this.div.appendChild(preText);
    function switchLocked(locked)
    {
        console.log(locked);
        if (locked)
        {
            setText(preText, text.value);
            callbackEdit(text.value);
        }
        (locked ? text : preText).style.visibility = 'hidden';
        (locked ? preText : text).style.visibility = 'visible';
    }
    var editButton;
    if (callbackEdit)
    {
        editButton = new EditButton(switchLocked);
        this.div.appendChild(editButton.div);
    }
    this.setValue = function (str)
    {
        text.value = str;
        setText(preText, str);
        if (expandingTextarea)
            expandingTextarea.resize();
    };
    var themesObject = {components: [
            {name: (styleNames.textStyleName ? styleNames.textStyleName : 'text_color'), elements: [preText]},
            {name: (styleNames.textStyleName ? styleNames.textStyleName : 'text_font'), elements: [preText, text]}
        ],
        callback: function (theme) {

        }};
    Themes.register(themesObject);
    this.close = function () {
        Themes.remove(themesObject);
    };
}

function Profile(userId, messenger, editor, mySocketProfiles, callbacks)
{
    EventEnabledBuilder(this);
    var closeEvent = new CustomEvent("close");
    var self = this;
    var settings = new Settings('#ProfileEditor');
    var terminal = messenger.getTerminal(interpret);
    var genericWindow = new GenericWindow({
        name:'Profile Editor',
        tooltipMessage:'Used to pick location',
        iconPath:'images/profile-picture-icon.gif',
        minWidth:150,
        maxWidth:1000,
        minHeight:200,
        maxHeight:1000,
        defaultWidth:500,
        defaultHeight:500,
        defaultX:200,
        defaultY:200,
        minimized:false,
        minimizable:true,
        maximizable:true,
        minimizeOnClose:editor});
    var divMainInner = document.createElement('div');
    var divCrossingColor = document.createElement('div');
    var spinner = new Spinner(1);
    spinner.div.style.position = 'absolute';
    spinner.div.style.width = '109px';
    spinner.div.style.height = '109px';
    spinner.div.style.left = 'calc(50% - 55px)';
    spinner.div.style.top = 'calc(50% - 55px)';
    genericWindow.divMain.appendChild(spinner.div);
    genericWindow.divMain.style.overflowY = 'auto';
    divMainInner.style.width = '100%';
    divMainInner.style.height = '100%';
    divMainInner.style.position = 'absolute';
    divMainInner.style.display = 'none';
    divCrossingColor.style.height = 'auto';
    divCrossingColor.style.width = '100%';
    divCrossingColor.style.paddingBottom = '0px';
    divCrossingColor.style.position = 'relative';
    divCrossingColor.style.float = 'left';
    var textBoxes = [];
    var textBoxesAutoHeight = [];
    var textBoxStatus = setupTextBox(function(text) {
        updateProfile({values: {status: text}});
    }, 255, 18, 'calc(100% - 56px)', '53px', 14, undefined);
    var textBoxStatusHeading = setupTextBox(undefined, undefined, 18, '50px', '3px', 14, 'Status:');
    textBoxStatus.div.style.backgroundColor = 'rgba(255,255,255,0.30)';
    textBoxStatusHeading.div.style.backgroundColor = 'rgba(255,255,255,0.30)';
    var divStatus = getSurroundDiv();
    textBoxStatusHeading.div.style.position = 'absolute';
    textBoxStatus.div.style.position = 'absolute';
    divStatus.appendChild(textBoxStatusHeading.div);
    divStatus.appendChild(textBoxStatus.div);
    divStatus.style.position = 'relative';
    divStatus.style.minHeight = '23px';
    var divInfo = getSurroundDiv();
    var textBoxUsername = setupTextBox(undefined, undefined, 14, 'calc(100% - 6px)', '3px', 12, undefined, undefined);
    var textBoxJoined = setupTextBox(undefined, undefined, 14, 'calc(100% - 6px)', '3px', 12, undefined, undefined);
    var textBoxLocation = setupTextBox(undefined, undefined, 14, 'auto', '3px', 12, 'Location: please select', undefined);
    var textBoxAge = setupTextBox(undefined, undefined, 14, 'calc(100% - 6px)', '3px', 12, undefined, undefined);
    textBoxLocation.div.style.marginTop = '0px';

    var textBoxLastOnline = setupTextBox(undefined, undefined, 14, 'calc(100% - 6px)', '3px', 12, editor ? 'Last active: Now' : undefined, undefined);
    var divLocation = getSurroundChildDiv('14px');
    divLocation.style.marginBottom = '0px';
    divLocation.appendChild(textBoxLocation.div);
    if (editor)
    {
        var editButtonLocation = new EditButton(function() {
            if (callbacks.showLocationPicker)
                callbacks.showLocationPicker();
        }, true);
        editButtonLocation.div.style.right = '-4px';
        editButtonLocation.div.style.position = 'relative';
        editButtonLocation.div.style.float = 'left';
        editButtonLocation.div.style.top = '-2px';
        editButtonLocation.div.style.minHeight = '18px';
        divLocation.appendChild(editButtonLocation.div);
    }
    textBoxJoined.div.style.marginBottom = '2px';
    var divImagesDisplay = getSurroundDiv();
    var imagesDisplay = new ImagesDisplay(window.thePageUrl + 'images/profile/', [], editor ? callbacks.showImageUploader : undefined,
            function(operation) {
                var jObject = {type: 'profile_picture_operation', operation: operation};
                mySocketProfiles.send(jObject);
            });
    imagesDisplay.div.style.width = 'calc(100%)';
    imagesDisplay.div.style.height = '140px';
    imagesDisplay.div.style.position = 'relative';
    imagesDisplay.div.style.float = 'top';
    genericWindow.onresize = resized;
    var divAbout = getSurroundDiv();
    var textBoxAboutHeading = setupTextBox(undefined, undefined, 14, '150px', '3px', 12, 'About: ');
    var textBoxAbout = setupTextBox(function(text) {
        updateProfile({values: {about: text}});
    }, 10000, 14, 'calc(100% - 6px)', '3px', 12, undefined, true, true, 20);
    var divParameters = getSurroundDiv();
    var divInterestsLike = getSurroundDiv();
    var divInterestsDislike = getSurroundDiv();
    var textBoxInterestsLike = setupTextBox(undefined, undefined, 14, 'calc(100% - 6px)', '3px', 12, 'Likes: None', true);
    var textBoxInterestsDislike = setupTextBox(undefined, undefined, 14, 'calc(100% - 6px)', '3px', 12, 'Dislikes: None', true);
    genericWindow.divMain.appendChild(divMainInner);
    divMainInner.appendChild(divCrossingColor);
    divCrossingColor.appendChild(divStatus);
    divCrossingColor.appendChild(divInfo);
    divInfo.appendChild(textBoxUsername.div);
    divInfo.appendChild(textBoxLastOnline.div);
    divInfo.appendChild(divLocation);
    divInfo.appendChild(textBoxJoined.div);
    divInfo.appendChild(textBoxAge.div);
    divCrossingColor.appendChild(divImagesDisplay);
    divImagesDisplay.appendChild(imagesDisplay.div);
    divCrossingColor.appendChild(divAbout);
    divAbout.appendChild(textBoxAboutHeading.div);
    divAbout.appendChild(textBoxAbout.div);
    divCrossingColor.appendChild(divInterestsLike);
    divInterestsLike.appendChild(textBoxInterestsLike.div);
    divCrossingColor.appendChild(divInterestsDislike);
    divInterestsDislike.appendChild(textBoxInterestsDislike.div);
    if (editor)
    {
        var editButtonInterestsLike = new EditButton(showPopupInterests, true);
        var editButtonInterestsDislike = new EditButton(showPopupInterests, true);
        divInterestsLike.appendChild(editButtonInterestsLike.div);
        divInterestsDislike.appendChild(editButtonInterestsDislike.div);
    }
    var popupInterests = new PopupInterests(divCrossingColor, function(interests) {
        setInterestsText(interests);
        updateProfile({values: {interests: interests}});
    });
    var liveLastActive;
    mySocketProfiles.addEventListener('message', _interpret);
    spinner.center();
    spinner.show();
    function _interpret(e)
    {
        var message = e.message;
        interpret(message);
    }
    this.show =genericWindow.show;
    function interpret(message)
    {
        switch (message.type)
        {
            case 'get_profile':
                if (message.userId == userId)
                {
                    setProfile(message);
                }
                break;
            case 'profile_picture_add':
                imagesDisplay.addImage(message.picture);
                break;
            case 'set_location':
                if (editor)
                    textBoxLocation.setValue('Location: ' + message.formattedAddress);
                break;
        }
    }
    function updateProfile(jObject)
    {
        jObject.type = 'update_profile';
        mySocketProfiles.send(jObject);
    }
    var themesObject = {components: [
            {name: 'frame', elements: [divCrossingColor]},
            {name: 'body', elements: [divStatus, divInfo, divImagesDisplay, divAbout, divInterestsLike, divInterestsDislike]}
            //{name: 'body', elements: [divTheirProfile]},
            //{name: 'body', elements: [divGender]},
            //{name: 'text', elements: [sliderUnitDistance.divValue]},
            //{name: 'text', elements: [sliderUnitAge.divValue]}
        ],
        callback: function(theme) {

        }
    };
    genericWindow.onclose = function() {
        mySocketProfiles.removeEventListener('message', interpret);
        Themes.remove(themesObject);
        terminal.close();
        for (var i = 0; i < textBoxes.length; i++)
        {
            textBoxes[i].close();
        }
        liveLastActive.close();
        self.dispatchEvent(closeEvent);
    };
    this.bringToFront = function()
    {
        Windows.bringToFront(genericWindow);
    };
    Themes.register(themesObject);
    (function loadProfile() {
        mySocketProfiles.send({type: 'get_profile', userId: userId});
    })();

    function getSurroundDiv()
    {
        var div = document.createElement('div');
        div.style.position = 'relative';
        div.style.height = 'auto';
        div.style.width = '100%';
        div.style.float = 'left';
        div.style.marginBottom = '2px';
        return div;
    }
    function getSurroundChildDiv(heightString)
    {
        var div = document.createElement('div');
        div.style.position = 'relative';
        div.style.height = heightString ? heightString : 'auto';
        div.style.width = '100%';
        div.style.float = 'left';
        div.style.marginTop = '3px';
        return div;
    }
    function setupTextBox(callback, maxLength, height, widthString, leftString, fontSize, initialText, multiline, minHeight)
    {
        var autoSize = (multiline ? true : (widthString.indexOf('auto') >= 0 ? true : false));
        var textBox = new TextBox(editor ? callback : undefined, multiline, autoSize, fontSize, true, initialText, maxLength, minHeight);
        textBox.div.style.height = autoSize && multiline ? 'auto' : String(height) + 'px';
        if (minHeight)
        {
            textBox.div.style.minHeight = String(minHeight) + 'px';
        }
        textBox.div.style.width = widthString;
        textBox.div.style.left = leftString;
        textBox.div.style.position = 'relative';
        textBox.div.style.marginTop = '3px';
        textBoxes.push(textBox);
        if (autoSize && multiline)
            textBoxesAutoHeight.push(textBox);
        return textBox;
    }
    function resized()
    {

        imagesDisplay.resized;
        for (var i = 0; i < textBoxesAutoHeight.length; i++)
        {
            textBoxesAutoHeight[i].resize();
        }
    }
    function setProfile(jObject)
    {
        var values = jObject.values;
        for (var i in values)
        {
            switch (i)
            {
                case 'username':
                    textBoxUsername.setValue('Username: ' + values[i]);
                    break;
                case 'about':
                    textBoxAbout.setValue(values[i]);
                    break;
                case 'status':
                    textBoxStatus.setValue(values[i]);
                    break;
                case 'joined':
                    textBoxJoined.setValue('Joined: ' + Activity.getJoined(values[i]).str);
                    break;
                case 'formattedAddress':
                    textBoxLocation.setValue('Location: ' + values[i]);
                    break;
                case 'lastActive':
                    if (!editor)
                    {
                        if (!liveLastActive)
                            liveLastActive = new Activity.LiveLastActive(userId, values[i], function(lastOnline) {
                                textBoxLastOnline.setValue('Last active: ' + lastOnline.str);
                            });
                    }
                    break;
                case 'interests':
                    popupInterests.setValues(values[i]);
                    setInterestsText(values[i]);
                    break;
                case 'pictures':
                    imagesDisplay.addImages(values[i]);
                    break;
                case 'birthday':
                    textBoxAge.setValue('Age: ' + Activity.getAge(values[i]));
                    break;
            }
        }
        divMainInner.style.display = 'inline';
        spinner.hide();
        resized();
    }
    function showPopupInterests()
    {
        popupInterests.show();
    }
    function setInterestsText(interests)
    {
        for (var setKey in interests)
        {
            var set = interests[setKey];
            var first = true;
            var str = '';
            for (var i = 0; i < set.length; i++)
            {
                if (first)
                    first = false;
                else
                    str += ',  ';
                str += Interests.txtFromValue(set[i]);
            }
            if (setKey == 'like')
                textBoxInterestsLike.setValue('Likes: ' + str);
            else
                textBoxInterestsDislike.setValue('Dislikes: ' + str);
        }
    }
}
Profile.Callbacks = function(showLocationPicker, showImageUploader)
{
    this.showLocationPicker = showLocationPicker;
    this.showImageUploader = showImageUploader;
};
var GoogleMaps =new (function () {
    var initialized = false;
    this.get = function (callback) {
        if (!initialized)
        {
            var runObject = httpJsonpAsynchronous(undefined, callback, undefined, 10000, undefined, true, true);
            runObject.run("https://maps.googleapis.com/maps/api/js?key=AIzaSyA8YK1QPEwKxSWLT1Mjh45xz_3R4Crxo9g&libraries=places&callback=" + runObject.callbackName);
        } else
            callback();
    };
})();
var QuadTree;
(function() {
    var mapQuadrantToDistance={};
    function getDistanceFromLatLngs(latLng1, latLng2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(latLng2.lat - latLng1.lat);  // deg2rad below
        var dLon = deg2rad(latLng2.lng - latLng1.lng);
        var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(latLng1.lat)) * Math.cos(deg2rad(latLng2.lat)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }
    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    function middlePoint(a)
    {
        return {lat: (a.latFrom + a.latTo) / 2, lng: (a.lngFrom + a.lngTo) / 2};
    }
    QuadTree = new (function() {
        var nLevels = 19;
        this.getMyQuadrants = function(latLng)
        {
            var levelQuadNs = {};
            var latFrom = 90;
            var latTo = -90;
            var lngFrom = -180;
            var lngTo = 180;
            var lastQuadN = 0;
            var level = 0;
            while (level < nLevels)
            {
                var midLat = (latTo + latFrom) / 2;
                var midLng = (lngTo + lngFrom) / 2;
                var bit0;
                var bit1;
                if (latLng.lng < midLng)
                {
                    bit1 = 1;
                    lngTo = midLng;
                } else
                {
                    bit1 = 0;
                    lngFrom = midLng;
                }
                if (latLng.lat > midLat)
                {
                    bit0 = 1;
                    latTo = midLat;
                } else
                {
                    bit0 = 0;
                    latFrom = midLat;
                }
                lastQuadN = (lastQuadN * 4) + (2 * bit0) + bit1;
                levelQuadNs[level] = lastQuadN;
                level++;
            }
            console.log(levelQuadNs);
            return levelQuadNs;
        };
        function getStartLevel(radiusKm, lat)
        {
            var diameter = radiusKm * 2;
            var level = 0;
            var step = 6371 * Math.cos((Math.PI * lat) / 180);
            while (diameter < step)
            {
                level++;
                step = step / 2;
            }
            return level;
        }
        this.getQuadsForRadius = function(latLng, radiusKm)
        {//at 84 degrees radius  radius about one tenth at equater. equator.

            function withinRange(distance)
            {
                return (distance < 0 ? -distance : distance) < radiusKm;
            }
            var getAllChildQuadrants;
            getAllChildQuadrants = function(lastQuadN, latFrom, latTo, lngFrom, lngTo, level, minLevelPickFrom, maxLevel)
            {
                var middleLat = (latTo + latFrom) / 2;
                var middleLng = (lngTo + lngFrom) / 2;
                //01
                //23
                var newQuadrants = [
                    {latFrom: middleLat, latTo: latTo, lngFrom: middleLng, lngTo: lngTo},
                    {latFrom: middleLat, latTo: latTo, lngFrom: lngFrom, lngTo: middleLng},
                    {latFrom: latFrom, latTo: middleLat, lngFrom: middleLng, lngTo: lngTo},
                    {latFrom: latFrom, latTo: middleLat, lngFrom: lngFrom, lngTo: middleLng}];
                var children = [];
                var lastQuadNTimes4 = (lastQuadN * 4);
                latTo = midLat;
                lngFrom = midLng;
                var newLevel = level + 1;
                for (var i = 0; i < 4; i++)
                {
                    var newQuadrant = newQuadrants[i];
                    var newQuadN = lastQuadNTimes4 + i;
                    var toPush = level >= minLevelPickFrom;
                    var distance;
                    if (toPush)
                    {
                                distance=getDistanceFromLatLngs(middlePoint(newQuadrant), latLng);
                        toPush = withinRange(distance);
                    }
                    if (toPush)
                    {
                        mapQuadrantToDistance[newQuadN]=distance;
                        children.push({l: level, i: newQuadN});
                    } else {
                        if (level < maxLevel && level < nLevels)
                        {
                            var childChildren = getAllChildQuadrants(newQuadN, newQuadrant.latFrom, newQuadrant.latTo, newQuadrant.lngFrom, newQuadrant.lngTo, newLevel, minLevelPickFrom, maxLevel);
                            for (var j = 0; j < childChildren.length; j++)
                            {
                                children.push(childChildren[j]);
                            }
                        }
                    }
                }
                return children;
            };
            var startLevel = getStartLevel(radiusKm, latLng.lat);
            var latFrom = 90;
            var latTo = -90;
            var lngFrom = -180;
            var lngTo = 180;
            var lastQuadN = 0;
            var level = 0;
            while (level < nLevels)
            {
                if (level >= startLevel)
                {
                    return getAllChildQuadrants(lastQuadN, latFrom, latTo, lngFrom, lngTo, level, level + 3, level + 6);
                }
                var midLat = (latTo + latFrom) / 2;
                var midLng = (lngTo + lngFrom) / 2;
                var bit0;
                var bit1;
                if (latLng.lng < midLng)
                {
                    bit1 = 1;
                    lngTo = midLng;
                } else
                {
                    bit1 = 0;
                    lngFrom = midLng;
                }
                if (latLng.lat > midLat)
                {
                    bit0 = 1;
                    latTo = midLat;
                } else
                {
                    bit0 = 0;
                    latFrom = midLat;
                }
                lastQuadN = (lastQuadN * 4) + (2 * bit0) + bit1;
                level++;

            }
        };
        this.getDistanceFromQuad=function(quadrant)
        {var distance = mapQuadrantToDistance[quadrant];
            if(!distance)
                return;
            return distance.toFixed(1);
        };
    })();
})();
function LocationPicker(messenger) {
    var settings = new Settings('#LocationPicker');
    var terminal = messenger.getTerminal(interpret);
    var map;
    var selectedGeolocation;
    var autocomplete;
    var genericWindow = new GenericWindow(
            {name:'Location picker',
        tooltipMessage:'Used to pick location', 
        iconPath:'images/location_picker_icon.png', 
        minWidth:250,
        maxWidth:1000,
        minHeight:250, maxHeight : 1000,
        defaultWidth:500,
        defaultHeight:500,
        defaultX:200,
        defaultY:200,
        minimized:false,
        minimizable:true,
        maximizable:true,
        minimizeOnClose:true}
            );
    genericWindow.onshow = function() {
        //resizeMap();
    };
    genericWindow.addEventListener('resized', resizeMap);
    genericWindow.addEventListener('maximized', resizeMap);
    genericWindow.addEventListener('unmaximized', resizeMap);
    //var buttonFinished = document.createElement('button');
    var autocompleteInput = document.createElement('input');
    var divMap = document.createElement('div');
    var divMapPicker = document.createElement('div');
    autocompleteInput.placeholder = 'Enter your address';
    autocompleteInput.type = 'text';
    autocompleteInput.style.width='50%';
    autocompleteInput.style.minWidth = '190px';
    autocompleteInput.style.top = '45px';
    autocompleteInput.style.left = '10px';
    autocompleteInput.style.position = 'absolute';
    autocompleteInput.style.padding = '0';
    autocompleteInput.style.paddingLeft = '2px';
    autocompleteInput.style.margin = '0';
    autocompleteInput.style.zIndex = '1000';
    autocompleteInput.style.height = "30px";
    autocompleteInput.style.borderRadius = "2px";
    autocompleteInput.style.border = "0";
    autocompleteInput.style.backgroundColor = "#ffffff";
    autocompleteInput.style.fontWeight='bold';      
    autocompleteInput.disabled = false;
    //divMapPicker.style.height = 'calc(100% - 30px)';
    divMapPicker.style.height = '100%';
    divMapPicker.style.top = '0px';
    divMapPicker.style.width = '100%';
    divMapPicker.style.position = 'absolute';
    //setText(buttonFinished, 'Finished');
    //buttonFinished.style.width = '70px';
    //buttonFinished.style.left = 'calc(50% - 35px)';
    //buttonFinished.style.bottom = '5px';
    //buttonFinished.style.position = 'absolute';
    //buttonFinished.style.color = '#000000';
    //buttonFinished.style.fontSize = '14px';
    //buttonFinished.style.fontFamily = 'Arial';
    //buttonFinished.style.cursor = 'pointer';
    //buttonFinished.disabled = true;
    divMap.style.width = '100%';
    divMap.style.height = '100%';
    genericWindow.divMain.appendChild(divMapPicker);
    //genericWindow.divMain.appendChild(buttonFinished);
    divMapPicker.appendChild(divMap);
    divMapPicker.appendChild(autocompleteInput);



    function fillInAddress() {
        var place = autocomplete.getPlace();
        var geolocation = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};
        setGeolocation(geolocation, false);
    }


    function geolocate() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var geolocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setGeolocation(geolocation);
            });
        }
    }
    var timerResize;
    function resizeMap() {
        marker.hide();
        if(!timerResize)
        timerResize = new Timer(function(){
        if (map)
        {
            google.maps.event.trigger(map, 'resize');
            if(selectedGeolocation){
                //map.setCenter(selectedGeolocation);
                marker.center();
            }

        }
    }, 200, 1);
    else
        timerResize.reset();
    }
    function movedMap(){
        resetMarker();
    }
    function draggingMap(){
        clearInput();
    }
    function draggedMarker(){
        clearInput();
    }
    function clearInput(){
        autocompleteInput.value = '';
    }
    function resetMarker(){
        setHousingShowing(true);
        marker.reset();
    }
    var markerWidth = 40;
    var markerHeight = 62;
    var divMarkerHousing = document.createElement("div");
    divMarkerHousing.style.position = "absolute";
    divMarkerHousing.style.height = String(markerHeight) + "px";
    divMarkerHousing.style.width = String(66 + markerWidth) + "px";
    divMarkerHousing.style.top = "4px";
    divMarkerHousing.style.right = "6px";
    setText(divMarkerHousing, 'Drag into position:');
    divMarkerHousing.style.borderRadius = '4px';
    divMarkerHousing.style.backgroundColor = '#ffffff';
    divMarkerHousing.style.padding = '2px';
    divMarkerHousing.style.fontFamily = 'Arial';
    divMarkerHousing.style.fontSize = '14px';
    divMarkerHousing.style.fontWeight = 'Bold';
    divMapPicker.appendChild(divMarkerHousing);

    function setHousingShowing(value)
    {
        if (!value)
            divMarkerHousing.style.display = 'none';
        else
            divMarkerHousing.style.display = 'inline';
    }
    var marker = new (function Marker() {
        var self = this;
        this.div = document.createElement("div");
        EventEnabledBuilder(this);
        var img = document.createElement("img");
        this.div.style.position = "absolute";
        this.div.style.height = String(markerHeight) + "px";
        this.div.style.width = String(markerWidth) + "px";
        this.div.style.top = "6px";
        this.div.style.right = "10px";
        this.div.style.cursor = "pointer";
        this.div.style.zIndex = "2";
        img.src = window.thePageUrl + "images/google-maps-marker.png";
        img.style.height = "100%";
        img.style.width = "100%";
        this.div.appendChild(img);
        var boundaries;
        var startOffsets;
        var position;
        this.reset = function() {
            self.div.style.top = "6px";
            self.div.style.left = String(divMap.offsetWidth - (10 + markerWidth)) + "px";
            show();
        };
        this.hide=function(){
            self.div.style.display='none';
        };
        this.center = function()
        {
            setPosition((divMap.offsetWidth / 2) - (markerWidth / 2), (divMap.offsetHeight / 2) - markerHeight);
            show();
        };
        function show(){
            self.div.style.display='inline';
        }
        function setPosition(x, y)
        {
            self.div.style.left = String(x) + 'px';
            self.div.style.top = String(y) + 'px';
        }
        function pixelOffsetToLatLng(x, y) {
            var offsetx = divMap.offsetWidth / 2 - x;
            var offsety = y - divMap.offsetHeight / 2;
            var latlng = map.getCenter();
            var scale = Math.pow(2, map.getZoom());

            var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(latlng);
            var pixelOffset = new google.maps.Point((offsetx / scale) || 0, (offsety / scale) || 0);

            var worldCoordinateNewCenter = new google.maps.Point(
                    worldCoordinateCenter.x - pixelOffset.x,
                    worldCoordinateCenter.y + pixelOffset.y
                    );

            var latLngPosition = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
            var latLng = {lat: latLngPosition.lat(), lng: latLngPosition.lng()};
            return latLng
        }
        function mouseDown(x, y)
        {
            setHousingShowing(false);
            startOffsets = {x: self.div.offsetLeft - x, y: self.div.offsetTop - y};
            var halfWidth = markerWidth / 2;
            boundaries = {xFrom: -halfWidth, yFrom: -markerHeight, xTo: divMapPicker.offsetWidth - halfWidth, yTo: divMapPicker.offsetHeight - markerHeight};
        }
        function mouseMove(x, y)
        {
            x = startOffsets.x + x;
            y = startOffsets.y + y;
            if (x < boundaries.xFrom)
                x = boundaries.xFrom;
            else
            {
                if (x > boundaries.xTo)
                    x = boundaries.xTo;
            }
            if (y < boundaries.yFrom)
                y = boundaries.yFrom;
            else
            {
                if (y > boundaries.yTo)
                    y = boundaries.yTo;
            }
            position = {x: x, y: y};
            setPosition(x, y);
        }
        function mouseUp() {
            self.div.style.cursor = "pointer";
            var latlng = pixelOffsetToLatLng((markerWidth / 2) + position.x, markerHeight + position.y);
            setGeolocation(latlng);
            settings.set('location', latlng);
            self.dispatchEvent({type:'moved'});
        }
        var efficientMovingCycle = new EfficientMovingCycle(self.div);
        efficientMovingCycle.onmousedown = function(e) {
            e.preventDefault && e.preventDefault();
            mouseDown(e.pageX, e.pageY);
        };
        efficientMovingCycle.onmouseup = mouseUp;
        efficientMovingCycle.onmousemove = function(e) {
            e.preventDefault && e.preventDefault();
            mouseMove(e.pageX, e.pageY);
        };
        efficientMovingCycle.ontouchstart = function(e) {
            e.preventDefault && e.preventDefault();
            mouseDown(e.changedTouches[e.changedTouches.length - 1].pageX, e.changedTouches[e.changedTouches.length - 1].pageY);
        };
        efficientMovingCycle.ontouchmove = function(e) {
            e.preventDefault && e.preventDefault();
            mouseMove(e.changedTouches[e.changedTouches.length - 1].pageX, e.changedTouches[e.changedTouches.length - 1].pageY);
        };
        efficientMovingCycle.ontouchend = mouseUp;
        makeUnselectable(this.div);
        divMapPicker.appendChild(this.div);
    })();
    marker.addEventListener('moved', draggedMarker);
    this.show = function(bringToFront)
    {
        genericWindow.show();
        if (bringToFront)
        {
            Windows.bringToFront(genericWindow);
        }
    };
    genericWindow.addEventListener('close', terminal.close);
    function setGeolocation(geo, store)
    {
        map.setZoom(16);      // This will trigger a zoom_changed on the map
        map.setCenter(geo);
            if(store==undefined||store){
            marker.center();
            selectedGeolocation = geo;
            setHousingShowing(false);
            picked();
        }
    }
    function initMap() {
        var uluru = {lat: -25.363, lng: 131.044};
        map = new google.maps.Map(divMap, {
            zoom: 4,
            center: uluru
        });
        map.addListener('center_changed',
                movedMap
                );
        map.addListener('dragstart', draggingMap);
    }

    function initAutocomplete() {
        autocomplete = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */autocompleteInput,
                {types: ['geocode']});
        autocomplete.addListener('place_changed', fillInAddress);
    }
    GoogleMaps.get(function() {
        initAutocomplete();
        initMap();
        var location = settings.get('location');
        if (!location)
            geolocate();
        else
            setGeolocation(location);
    });
    function getFormattedAddress(result)
    {
        var addressComponents = result.address_components;
        var locality;
        var administrativeAreaLevel1;
        var country;
        for (var i = 0; i < addressComponents.length; i++)
        {
            var addressComponent = addressComponents[i];
            for (var j = 0; j < addressComponent.types.length; j++) {
                var type = addressComponent.types[j];
                switch (type)
                {
                    case 'locality':
                        locality=addressComponent.short_name;
                        break;
                    case 'administrative_area_level_1':
                        administrativeAreaLevel1=addressComponent.short_name;
                        break;
                    case 'country':
                        country=addressComponent.short_name;
                        break;
                }
            }
        }
        var str='';
        var first=true;
        if(locality){
             if(first)first=false;else str+=',';str+=locality;}
        if(administrativeAreaLevel1){
             if(first)first=false;else str+=',';str+=administrativeAreaLevel1;}
        if(country){
             if(first)first=false;else str+=',';str+=country;}
        return str;
            
    }
        function getLocationStringFromLatLng(latLng, callback)
        {
            var geocoder = geocoder = new google.maps.Geocoder();
            geocoder.geocode({'latLng': latLng}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        callback(getFormattedAddress(results[0]));
                    }
                }
            });
        }
        //buttonFinished.onclick=function(){
        //     getLocationStringFromLatLng(selectedGeolocation, function(formattedAddress){
        //         callbackLocationPicked(selectedGeolocation, formattedAddress);
        //    });
        //   };
        function interpret(message)
        {

        }
        function picked()
        {
            getLocationStringFromLatLng(selectedGeolocation, function(formattedAddress) {
                var jObject = {type: 'set_location', latLng:selectedGeolocation, formattedAddress: formattedAddress};
                jObject.levelQuadNs = QuadTree.getMyQuadrants(selectedGeolocation);
                terminal.send(jObject);
            });
        }
        makeUnselectable(this.div);
        divMap.addEventListener('touchstart', resizeMap);
}
function Dimension(sizes, sizeType, maxSizeType, minSizeType)
{
    var self = this;
    EventEnabledBuilder(this);
    var modifiedEvent = new CustomEvent("modified");
    function dispatchModifiedEvent() {
        self.dispatchEvent (modifiedEvent);
    }
    this.set = function (sizes, sizeType, maxSizeType, minSizeType)
    {
        _set(sizes, sizeType, maxSizeType, minSizeType);
        dispatchModifiedEvent();
    };
    function _set(sizes, sizeType, maxSizeType, minSizeType) {
        var sizeCount = 0;
        function setThisSizes(name, sizeType)
        {
            if (sizeType && (sizeCount < sizes.length || sizeType == Dimension.Type.Auto))
            {
                var sizeX = sizes[sizeCount];
                switch (sizeType)
                {
                    case Dimension.Type.Percent:
                        self[name] = sizeX;
                        self[name + 'String'] = String(sizeX) + '%';
                        sizeCount++;
                        break;
                    case Dimension.Type.Fixed:
                        self[name] = sizeX;
                        self[name + 'String'] = String(sizeX) + 'px';
                        sizeCount++;
                        break;
                    case Dimension.Type.Calc:
                        self[name] = sizeX;
                        self[name + 'String'] = 'calc(' + sizeX + ')';
                        sizeCount++;
                        break;
                    default:
                        self[name + 'String'] = 'auto';
                        self.isAuto = true;
                        break;
                }
            }
        }
        self.sizeType = sizeType;
        self.maxSizeType = maxSizeType;
        self.minSizeType = minSizeType;
        setThisSizes('size', sizeType);
        setThisSizes('maxSize', maxSizeType);
        setThisSizes('minSize', minSizeType);
    };
    _set(sizes, sizeType, maxSizeType, minSizeType);
    this.getSizeString = function () {
        return self.sizeString;
    };
    this.getMaxSizeString = function () {
        return self.minSizeString;
    };
    this.getMinSizeString = function () {
        return self.maxSizeString;
    };
}
Dimension.Type = {Auto: 'auto', Fixed: 'fixed', Percent: 'percent', Calc: 'calc'};
Dimension.Default = new Dimension([100], Dimension.Type.Fixed);
function Rectangle(dimensionWidth, dimensionHeight)
{

    var self = this;
    EventEnabledBuilder(this);
    var modifiedEvent = new CustomEvent("modified");
    function dispatchModifiedEvent() {
        self.dispatchEvent (modifiedEvent);
    }
    this.setWidth=function(width)
    {
        dimensionWidth= width;
        evaulateWidth();
        dispatchModifiedEvent();
    };
    this.setHeight=function(height)
    {
        dimensionHeight= height;
        evaulateHeight();
        dispatchModifiedEvent();
    };
    this.set=function(width, height)
    {
        dimensionWidth= width;
        evaulateWidth();
        dimensionHeight= height;
        evaulateHeight();
        dispatchModifiedEvent();
    };
    function evaulateWidth() {
        if (dimensionWidth)
        {
            self.width = dimensionWidth;
            self.isDefaultWidth = false;
        } else
        {
            self.width = Dimension.Default;
            self.isDefaultWidth = true;
        }
        dimensionWidth.addEventListener('modified', dispatchModifiedEvent);
    }
    function evaluateHeight(){
        if (dimensionHeight)
        {
            self.height = dimensionHeight;
            self.isDefaultHeight = false;
        } else {
            self.height = Dimension.Default;
            self.isDefaultHeight = true;
        }
        dimensionHeight.addEventListener('modified', dispatchModifiedEvent);
    }
    evaulateWidth();
    evaluateHeight();
}
function EntriesDisplay(callbackGetIdentifier, callbackGetNewEntry, sortPropertyName)
{
    var self = this;
    this.div = document.createElement('div');
    this.div.style.height = 'calc(100% - 4px)';
    this.div.style.width = 'calc(100% - 2px)';
    this.div.style.overflowY = 'auto';
    var currentPropertyStrings = [];
    var currentEntries = [];
    var mapIdentToEntry = {};
    this.update = function (newEntries) {
        sort(mapIdentToEntry, newEntries, currentPropertyStrings, currentEntries, function (entry, j) {
            self.div.insertBefore(entry.div, self.div.children[j]);
        }, function (entry) {
            self.div.appendChild(entry.div);
        },
                function (entry) {
                    delete mapIdentToEntry[callbackGetIdentifier(entry)];
                    self.div.removeChild(entry.div);
                },
                function (r, identifier) {
                    callbackGetNewEntry(r);
                    mapIdentToEntry[identifier] = r;
                    return r;
                }, true);
    };
    function sort(mapIdentityToInfo, newEntries, currentPropertyStrings, currentEntries, callbackInsert, callbackPush, callbackRemove, callbackGetNewEntryFromInfo, doUpdate) {
        var wanted = [];
        var i = 0;
        var oldCurrentEntries = [];
        for (var i = 0; i < currentEntries.length; i++)
            oldCurrentEntries.push(currentEntries[i]);
        for (var i = newEntries.length - 1; i >= 0; i--)
        {
            var r = newEntries[i];
            var sortProperty = r[sortPropertyName];
            var identifier = callbackGetIdentifier(r);
            var entry = mapIdentToEntry[identifier];
            if (!entry)
            {
                var entry = callbackGetNewEntryFromInfo(r, identifier);
                var inserted = false;
                var entryProperty = entry[sortPropertyName];
                oldCurrentEntries.splice(oldCurrentEntries.indexOf(entry), 1);
                for (var j = 0; j < currentPropertyStrings.length; j++)
                {
                    if (currentPropertyStrings[j] > entryProperty)
                    {
                        callbackInsert(entry, j);
                        currentEntries.splice(j, 0, entry);
                        currentPropertyStrings.splice(j, 0, entryProperty);
                        inserted = true;
                        break;
                    }
                }
                if (!inserted)
                {
                    callbackPush(entry);
                    currentEntries.push(entry);
                    currentPropertyStrings.push(entryProperty);
                }
            } else
            {
                if (doUpdate)
                {
                    if (entry.update)
                    {
                        entry.update(r);
                    }
                }
            }
            wanted.push(entry);
        }
        i = 0;
        while (i < currentEntries.length)
        {
            var entry = currentEntries[i];
            if (wanted.indexOf(entry) < 0)
            {
                if (entry.close)
                {
                    try
                    {
                        entry.close();
                    } catch (ex)
                    {
                        console.log(ex);
                    }
                }
                callbackRemove(currentEntries[i]);
                currentEntries.splice(i, 1);
                currentPropertyStrings.splice(i, 1);
            } else
            {
                i++;
            }
        }
    }
    this.setSortPropertyName = function (newN) {
        sortPropertyName = newN;
    };
    this.sort = function ()
    {
        var newCurrentPropertyStrings = [];
        var newCurrentEntries = [];
        sort({}, currentEntries, newCurrentPropertyStrings, newCurrentEntries, function () {

        }, function () {
        },
                function () {
                },
                function (r) {
                    return r;
                });
        for (var i = 0; i < newCurrentEntries.length; i++)
        {
            var entry = newCurrentEntries[i];
            self.div.removeChild(entry.div);
            if (i < newCurrentEntries.length)
                self.div.insertBefore(entry.div, self.div.children[i]);
            else
                self.div.appendChild(entry.div);
        }
        currentPropertyStrings = newCurrentPropertyStrings;
        currentEntries = newCurrentEntries;
    };

}


function EntryBuilder(obj, rect)
{
    obj.div = document.createElement('div');
    obj.divMain = document.createElement('div');
    obj.divInner = document.createElement('div');
    obj.div.style.position = 'relative';
    obj.div.style.float = 'left';
    obj.div.style.boxSizing = 'border-box';
    obj.divInner.style.position = 'relative';
    obj.divInner.style.float = 'left';
    obj.divInner.style.boxSizing = 'border-box';
    obj.divMain.style.position = 'relative';
    obj.divMain.style.float = 'left';
    obj.div.appendChild(obj.divInner);
    obj.divInner.appendChild(obj.divMain);
    EventEnabledBuilder(obj);
    obj.closeEvent = new CustomEvent("close");
    obj.updateEvent = new CustomEvent("update");
    obj.setRect=function()
    {
        console.log('setting rect');
        obj.div.style.width = rect.width.getSizeString();
        obj.div.style.maxWidth = rect.width.getMaxSizeString();
        if (rect.isDefaultHeight)
        {
            obj.div.style.minHeight = '100px';
            obj.div.style.height = '100px';
            obj.div.style.maxHeight = 'auto';
        } else
        {
            obj.div.style.height = rect.height.getSizeString();
            obj.div.style.maxHeight = rect.height.getMaxSizeString();
            obj.div.style.minHeight = rect.height.getMinSizeString();
        }
        if (rect.width.isAuto)
        {
            obj.divInner.style.marginLeft = '2px';
            obj.divInner.style.width = 'auto';
            obj.divMain.style.width = 'auto';
            obj.divMain.style.marginLeft = '2px';
            obj.divMain.style.marginRight = '2px';
        } else
        {
            obj.divInner.style.left = '2px';
            obj.divInner.style.width = 'calc(100% - 2px)';
            obj.divMain.style.left = '2px';
            obj.divMain.style.width = 'calc(100% - 4px)';
        }
        if (rect.height.isAuto)
        {
            obj.divInner.style.marginTop = '2px';
            obj.divInner.style.height = 'auto';
            obj.divMain.style.height = 'auto';
            obj.divMain.style.marginTop = '2px';
            obj.divMain.style.marginBottom = '2px';
        } else
        {

            obj.divInner.style.top = '2px';
            obj.divInner.style.height = 'calc(100% - 4px)';
            obj.divMain.style.top = '2px';
            obj.divMain.style.height = 'calc(100% - 4px)';
        }
    };
    
    
        rect.addEventListener("modified", obj.setRect);
    obj.setRect();
    obj.update=function(r)
    {
       this.updateEvent.r=r; this.dispatchEvent (this.updateEvent);
    };
    obj.themesObjectEntry = {components: [
            {name: 'frame', elements: [obj.divInner]},
            {name: 'body', elements: [obj.divMain]},
            {name: 'text', elements: []}
        ]
    };
    Themes.register(obj.themesObjectEntry);
    obj.close = function   (){
        rect.removeEventListener("resize", this.setRect);
        this.dispatchEvent(this.closeEvent);
        Themes.remove(this.themesObjectEntry);
    };
}

function ProfileEntryBuilder(r)
{
    EntryBuilder(r);
}

function Ethnicities() {

}

Ethnicities.values = [
    {value: 1, txt: 'Asian'},
    {value: 2, txt: 'Black'},
    {value: 3, txt: 'East Indian'},
    {value: 4, txt: 'Islander'},
    {value: 5, txt: 'Hispanic'},
    {value: 6, txt: ' Middle Eastern'},
    {value: 7, txt: 'Native American'},
    {value: 8, txt: 'White'},
    {value: 9, txt: 'Other'}
];
function GenericSlider(callbacks, min, max, nInstances, width, allowSlidersToOvertake, callbackWhenDone) {
    if(allowSlidersToOvertake==undefined)
        allowSlidersToOvertake = false ;
    var self = this;
    var selfGenericSlider = this;
    if (min == undefined)
        min = 0;
    if (max == undefined)
        max = 100;
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    this.div.style.position = 'relative';
    if (width)
        this.div.style.width = width;
    else
        this.div.style.width = '100%';
    this.div.style.height = '20px';
    this.div.style.position = "absolute";
    divInner.style.position = 'absolute';
    divInner.style.width = 'calc(100% - 18px)';
    divInner.style.height = '2px';
    divInner.style.borderRadius = '13px';
    divInner.style.border = '2px solid #aaaaaa';
    divInner.style.left = '7px';
    divInner.style.bottom = '6px';
    this.div.appendChild(divInner);
    function SliderInstance(callback, index) {
        var self = this;
        var divInternal = document.createElement('div');
        var divSlider = document.createElement('div');
        divInternal.style.position = 'absolute';
        divInternal.style.left = '-9px';
        divInternal.style.width = '100%';
        divInternal.style.height = '2px';
        makeUnselectable(divInternal);
        divSlider.style.position = 'absolute';
        divSlider.style.height = '18px';
        divSlider.style.width = '18px';
        divSlider.style.borderRadius = '9px';
        divSlider.style.right = '0px';
        divSlider.style.bottom = '-7px';
        divSlider.style.zIndex = '25';
        divSlider.style.backgroundColor = '#ffffff';
        divSlider.style.cursor = 'pointer';
        divSlider.style.zIndex = String(1+index);
        divInner.appendChild(divInternal);
        divInternal.appendChild(divSlider);
        var left = 8;
        function leftFromValue(value)
        {
            return (((value - min) * divInternal.clientWidth) / (max - min));
        }
        function makeUnselectable(node) {
            if (node.nodeType == 1) {
                node.setAttribute("unselectable", "on");
            }
            var child = node.firstChild;
            while (child) {
                makeUnselectable(child);
                child = child.nextSibling;
            }
        }
        var state = 0;
        var start;
        var efficientMovingCycle = new EfficientMovingCycle(divSlider);
        var getLeftSliderValue;
        var getRightSliderValue;
        this.setupOvertakeLimits = function (leftSlider, rightSlider) {
            if (!allowSlidersToOvertake) {
                if (leftSlider)
                    getLeftSliderValue = leftSlider.getValue;
                else
                    getLeftSliderValue = function () {
                        return min;
                    };
                if (rightSlider)
                    getRightSliderValue = rightSlider.getValue;
                else
                    getRightSliderValue = function () {
                        return max;
                    };
            }
        };
        var leftSliderLeft;
        var rightSliderLeft;
        function onmousedown(pageX, pageY) {
            if (divSlider.style.display === "none")
            {
                return;
            }
            if (!e)
                var e = window.event;
            start = [divSlider.offsetLeft - pageX, divSlider.offsetTop - pageY];
            state = 1;
            if (!allowSlidersToOvertake&&nInstances>1)
            {
                leftSliderLeft = leftFromValue(getLeftSliderValue());
                rightSliderLeft = leftFromValue(getRightSliderValue());
            }
        }
        ;
        function onmousemove(pageX, pageY) {
            if (state == 1) {
                drag((start[0] + pageX), (start[1] + pageY));
            }
        }
        ;
        if (!isMobile)
        {
            efficientMovingCycle.onmousedown = function (e) {
                onmousedown(e.pageX, e.pageY);
            };
            efficientMovingCycle.onmousemove = function (e) {
                onmousemove(e.pageX, e.pageY);
            };
            efficientMovingCycle.onmouseup = function () {
                state = 0;
            };
        } else
        {
            efficientMovingCycle.ontouchstart = function (e) {
                onmousedown(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
            };
            efficientMovingCycle.ontouchmove = function (e) {
                onmousemove(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
            };
            efficientMovingCycle.ontouchend = function () {
                state = 0;
            };
        }
        var left;
        var value = max;
        this.getValue = function ()
        {
            return(((left * (max - min)) / divInternal.clientWidth) + min) | 0;
        };
        var timerCallback;
        var theCallback = callback ? (callbackWhenDone ? function () {
            if (!timerCallback)
            {
                timerCallback = new Timer(function () {

                    try
                    {
                        callback(value);
                    } catch (ex)
                    {
                        console.log(ex);
                    }
                }, 300, 1);
            } else
            {
                timerCallback.reset();
            }
        }
        : function () {
            try
            {
                callback(value);
            } catch (ex)
            {
                console.log(ex);
            }
        }) : function () {};
        var drag = allowSlidersToOvertake||nInstances<2 ? function (x)
        {
            var maxLeft = divInternal.clientWidth;
            left = x;
            if (left > maxLeft)
            {
                left = maxLeft;
            } else
            {
                if (left < 0)
                {
                    left = 0;
                }
            }
            divSlider.style.left = String(left) + 'px';
            value = self.getValue();
            theCallback();
        } : function (x) {
            console.log('correct');
            console.log(leftSliderLeft);
            console.log(rightSliderLeft);
            var maxLeft = divInternal.clientWidth;
            left = x;
            if (left > maxLeft)
            {
                left = maxLeft;
            } else
            {
                if (left < 0)
                {
                    left = 0;
                }
            }
                    if(left<leftSliderLeft)
                    {
                        left=leftSliderLeft;
                    }
                    else
                    {
                        if(left>rightSliderLeft)
                        {
                            left=rightSliderLeft;
                        }
                    }
            divSlider.style.left = String(left) + 'px';
            value = self.getValue();
            theCallback();
        };
        this.setValue = function (value)
        {
            left = leftFromValue(value);
            drag(left, 0);
        };
    }
    var sliderInstances = [];
    if (nInstances > 1)
    {
        for (var i = 0; i < nInstances; i++)
        {
            var sliderInstance = new SliderInstance(callbacks[i],i);
            sliderInstances.push(sliderInstance);
        }
        for (var i = 0; i < nInstances; i++)
        {
            var sliderInstance = sliderInstances[i];
            sliderInstance.setupOvertakeLimits((i > 0) ? sliderInstances[i - 1] : undefined, (i < sliderInstances.length - 1) ? sliderInstances[i + 1] : undefined);
        }
    } else {
        var sliderInstance = new SliderInstance(callbacks);
        sliderInstances.push(sliderInstance);
    }

    this.getValue = function (nInstance)
    {
        if (!nInstance)
            nInstance = 0;
        var sliderInstance = sliderInstances[nInstance];
        return sliderInstance.getValue();
    };
    this.setValue = function (value, nInstance)
    {
        if (!nInstance)
            nInstance = 0;
        var sliderInstance = sliderInstances[nInstance];
        sliderInstance.setValue(value);
    };
}
function ProfilesDisplay(mySocketProfiles, messenger, callbacks)
{
    var self = this;
    var currentLatLng;
    var terminal = messenger.getTerminal(interpret);
    var settings = new Settings('#ProfilesDisplay');
    var rectangle = new Rectangle(new Dimension([100], Dimension.Type.Percent), new Dimension([], Dimension.Type.Auto));
    var genericWindow = new GenericWindow({
        name:'Profile search',
        tooltipMessage:'Used to pick location',
        iconPath:'images/profiles_logo.png',
        minWidth:150,
        maxWidth:1000,
        minHeight:200, 
        maxHeight:1000,
        defaultWidth:500,
        defaultHeight:500,
        defaultX:200,
        defaultY:200,
        minimized:false,
        minimizable:true, 
        maximizable:true,
        minimizeOnClose:true});
    var entriesDisplay = new EntriesDisplay(function(r) {
        return r.userId;
    },
            function(r) {
                ProfileEntryBuilder(r, rectangle, callbacks.openProfile);
            },
            'userId');
    var divSearch = document.createElement('div');
    var divSearchWrapper = document.createElement('div');
    var divEntries = document.createElement('div');
    var settingsHeight = 24;
    divSearchWrapper.style.height = String(settingsHeight+2) + 'px';
    divSearch.style.width = '100%';
    divSearch.style.height = 'calc(100% - 2px)';
    divSearchWrapper.style.width = '100%';
    divEntries.style.height = 'calc(100% - ' + String(settingsHeight+4) + 'px)';
    divEntries.style.width = '100%';
    divEntries.style.top =String(settingsHeight+4) +'px';
    var buttonUpdate = createSettingsButton('images/reload.png', 'images/reload_hover.png', updateProfiles);
    var buttonLocation = createSettingsButton('images/location_picker_icon.png', 'images/location_picker_icon_blue.png', showLocationPicker);
    var buttonTheirProfile = createSettingsButton('images/user_info.png', 'images/user_info_blue.png', showTheirProfile);
    var buttonGender = createSettingsButton('images/gender.png', 'images/gender_hover.png', showGender);
    var buttonInterests = createSettingsButton('images/interests.png', 'images/interests_hover.png', showInterests);
    var searchObject;
    var previousPercent = 100;
    genericWindow.onresize = function()
    {
        resizeEntryWidth();
    };
    new Task(resizeEntryWidth).run();
    function resizeEntryWidth()
    {
        var nWide = Math.floor(divSearch.offsetWidth / ProfileEntryBuilder.minWidth);
        if (nWide < 1)
            nWide = 1;
        var percentWide = 100 / nWide;
        if (percentWide != previousPercent)
        {
            rectangle.setWidth(new Dimension([percentWide], Dimension.Type.Percent));
            console.log(percentWide);
            previousPercent=percentWide;
        }
    }
    genericWindow.divMain.appendChild(divSearchWrapper);
    divSearchWrapper.appendChild(divSearch);
    divSearch.appendChild(buttonUpdate);
    divSearch.appendChild(buttonLocation);
    divSearch.appendChild(buttonTheirProfile);
    divSearch.appendChild(buttonGender);
    divSearch.appendChild(buttonInterests);
    genericWindow.divMain.appendChild(divEntries);
    divEntries.appendChild(entriesDisplay.div);





    var popupTheirProfile = new Popup(divSearch, 'absolute', false, {width: '100%', height: 'auto', left: '0px', top: '24px'});
    popupTheirProfile.div.style.minHeight = '10px';
    var popupGender = new Popup(divSearch, 'absolute', false, {width: '100%', height: 'auto', left: '0px', top: '24px'});
    popupGender.div.style.minHeight = '10px';
    var divTheirProfile = document.createElement('div');
    var divGender = document.createElement('div');

    stylePopupFrame(divTheirProfile);
    stylePopupFrame(divGender);



    var sliderUnitDistance;
    sliderUnitDistance = new SliderUnit(function(value) {
        searchObject.distance=(value<=100?value:undefined);
        saveSearchObject();
        setText(sliderUnitDistance.divValue, 'Distance: ' + ((value > 100) ? "Any" : String(value) + 'Km'));
    }, 1, 101, 1, 120);
    var sliderUnitAge;
    sliderUnitAge = new SliderUnit([function(value) {
            searchObject.ageFrom = value;
            saveSearchObject();
            updateAgeText();
        }, function(value) {
            searchObject.ageTo = value;
            saveSearchObject();
            updateAgeText();
        }], 18, 101, 2, 155);

    var tickBoxesEthnicity = new TickBoxes(Ethnicities.values, 'combination', '100%', '200px', "Ethnicity:");
    var tickBoxesGenderLookingFor = new TickBoxes(Genders.values, 'combination', 'auto', '200px', "I am looking for:");
    var tickBoxesGenderInterestedIn = new TickBoxes(Genders.values, 'combination', 'auto', '200px', "Interested in:");
    divTheirProfile.appendChild(tickBoxesEthnicity.div);
    divGender.appendChild(tickBoxesGenderLookingFor.div);
    divGender.appendChild(tickBoxesGenderInterestedIn.div);
    popupTheirProfile.div.appendChild(divTheirProfile);
    popupGender.div.appendChild(divGender);
    var popupInterests = new PopupInterests(divSearch, function(interests) {
        searchObject.interests = interests;
        saveSearchObject();
    });
    initSearchObject();
    popupTheirProfile.onshow = function() {
        sliderUnitDistance.slider.setValue(searchObject.distance);
        sliderUnitAge.slider.setValue(searchObject.ageFrom, 0);
        sliderUnitAge.slider.setValue(searchObject.ageTo, 1);
    };
    mySocketProfiles.addEventListener('message', _interpret);
    function _interpret(e)
    {
        var message = e.message; 
        interpret(message);
    }
    function interpret(message)
    {
        switch (message.type)
        {
            case 'search':
                entriesDisplay.update(message.profiles);
                break;
            case "set_location":
                currentLatLng=message.latLng;
                break;
        } 
    }
    function createSettingsButton(srcImg, srcImgHover, clickCallback)
    {
        var div = document.createElement('div');
        var img = document.createElement('img');
        div.style.position = 'relative';
        div.style.height = String(settingsHeight) + 'px';
        div.style.minWidth = String(settingsHeight) + 'px';
        div.style.float = 'right';
        div.style.marginRight = '5px';
        div.style.cursor = 'pointer';
        div.style.zIndex = '10';
        verticallyCenter(div);
        img.style.height = '100%';
        img.src = window.thePageUrl + srcImg;
        new Hover(img, function() {
            img.src = window.thePageUrl + srcImgHover;
        }, function() {
            img.src = window.thePageUrl + srcImg;
        });
        div.addEventListener("click", clickCallback);
        div.appendChild(img);
        return div;
    }
    function stylePopupFrame(div)
    {
        div.style.height = 'auto';
        div.style.minHeight = '10px';
        div.style.width = '100%';
        div.style.marginTop = '2px';
        div.style.marginBottom = '2px';
        div.style.position = 'relative';
        div.style.float = 'left';
    }
    function SliderUnit(callbacks, min, max, nSliders, width)
    {
        var self = this;
        this.div = document.createElement('div');
        this.div.style.position = 'relative';
        this.div.style.width = String(width) + 'px';
        this.div.style.height = '32px';
        this.div.style.margin = '3px';
        this.div.style.float = 'left';
        this.divValue = document.createElement('div');
        this.divValue.style.position = 'absolute';
        this.divValue.style.width = '100%';
        this.divValue.style.paddingLeft = '6px';
        this.divValue.style.fontSize = '12px';

        this.slider = new GenericSlider(callbacks, min, max, nSliders, '100%');
        this.slider.div.style.bottom = '0px';
        this.div.appendChild(self.divValue);
        this.div.appendChild(this.slider.div);
        divTheirProfile.appendChild(this.div);
    }
    function updateAgeText()
    {
        setText(sliderUnitAge.divValue, searchObject.ageFrom == searchObject.ageTo ? 'Age ' + String(searchObject.ageFrom) : 'Aged from ' + String(searchObject.ageFrom) + ' to ' + ((searchObject.ageTo > 100) ? "100+" : String(searchObject.ageTo)));
    }
    function saveSearchObject()
    {
        settings.set('searchObject', searchObject);
    }
    function initSearchObject()
    {
        searchObject = settings.get('searchObject');
        if (!searchObject)
            searchObject = {};
        if (!searchObject.distance)
            searchObject.distance = 50;
        if (!searchObject.ageFrom)
            searchObject.ageFrom = 18;
        if (!searchObject.ageTo)
            searchObject.ageTo = 101;
        if (searchObject.interests)
            if (searchObject.interests.like && searchObject.interests.dislike)
            {
                popupInterests.setValues(searchObject.interests);
            }
        tickBoxesEthnicity.setValues(searchObject.ethnicities);
        tickBoxesGenderLookingFor.setValues(searchObject.genderLookingFor);
        tickBoxesGenderInterestedIn.setValues(searchObject.genderInterestedIn);
    }
    function updateProfiles()
    {
        if(searchObject.distance!=undefined)
        searchObject.location=QuadTree.getQuadsForRadius(currentLatLng, searchObject.distance);
        var jObject = {type: 'search', values: searchObject};
        console.log(JSON.stringify(jObject));
        mySocketProfiles.send(jObject);
    }
    function showLocationPicker()
    {
        if (callbacks.showLocationPicker)
            callbacks.showLocationPicker(true);
    }

    function showTheirProfile()
    {
        popupTheirProfile.show();
    }
    function showInterests()
    {
        popupInterests.show();
    }
    function showGender()
    {
        popupGender.show();
    }
    var themesObject = {components: [
            {name: 'frame', elements: [popupTheirProfile.div, divSearchWrapper]},
            {name: 'frame', elements: [popupGender.div]},
            {name: 'body', elements: [divTheirProfile, divSearch]},
            {name: 'body', elements: [divGender]},
            {name: 'text', elements: [sliderUnitDistance.divValue]},
            {name: 'text', elements: [sliderUnitAge.divValue]}
        ],
        callback: function(theme) {

        }
    };
    genericWindow.onclose = function() {
        Themes.remove(themesObject);
        terminal.close();
    };
    Themes.register(themesObject);
}
ProfilesDisplay.Callbacks = function(showLocationPicker, openProfile)
{
    this.showLocationPicker = showLocationPicker;
    this.openProfile=openProfile;
};
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function LobbySwingers(callbackFinishedLoading, otherCallbacks)
{
    var messenger = new Messenger();
    var terminal = messenger.getTerminal(interpret);
    var locationPicker;
    var mySocketProfiles = otherCallbacks.getMySocketProfiles();
    var profilesDisplay;
    var mapUserIdToProfile = {};
    mySocketProfiles.addEventListener('message', function(e) {
        interpret(e.message);
    });
    var profileEditor;
    function showProfile(userId) {
        var profile = mapUserIdToProfile[userId];
        if (!profile)
        {
            profile = new Profile(userId, messenger, false, mySocketProfiles);
            profile.addEventListener('close', (function(userId) {
                delete mapUserIdToProfile[userId];
            }).bind(null, userId));
            mapUserIdToProfile[userId] = profile;
        }
        else
            profile.bringToFront();
    }
    LobbySwingers.showMyProfile = function(){
        new Task(function(){console.log('show');profileEditor.show(true);}).run();
    };
    function interpret(jObject)
    {
        switch (jObject.type)
        {
            case "authenticate":
                gotAuthenticate(jObject);
                break;
            case "set_location":
                mySocketProfiles.send(jObject);
                break;
            case "image_uploader_reply":
                ImageUploader.interpret(jObject);
                break;
        }
    }
    ;
    function gotAuthenticate(jObject)
    {
        if (jObject.successful)
        {
    locationPicker = new LocationPicker(messenger);
    profilesDisplay = new ProfilesDisplay(mySocketProfiles, messenger, new ProfilesDisplay.Callbacks(function() {
        locationPicker.show(true);
    }, showProfile));
            profileEditor = new Profile(jObject.userId, messenger, true, mySocketProfiles, new Profile.Callbacks(function() {
                locationPicker.show(true);
            },
                    function()
                    {
                        ImageUploader.show(true, 1, {}, {send: function(jObject) {
                                jObject.type = 'profile_picture';
                                mySocketProfiles.send(jObject);
                            }}, 'Add Profile Picture');
                    }));
        }

    }
    callbackFinishedLoading();
}

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
includeJQuery = true;
function LobbyChat(callbackFinishedLoading, otherCallbacks)
{
    var mapIdToWall = {};
    var mapIdToRoom = {};
    Tab.setText("ChatDimension :)");
    var settings = new Settings('#lobby_chat', function () {
        this.set("profilePicture");
    });
    var userInformation;
    var font = new Font();
    var soundEffects;
    var emoticons = new Emoticons(Configuration.emoticonsXmlString);
    var rooms;
    var walls;
    var users;
    var webcamSettings;
    var notifications;

    websocket = new MySocket("chat_lobby");
    websocket.addEventListener('open', function () {
        var jObject = {};
        jObject.type = "connect";
        websocket.send(jObject);
    });
    websocket.addEventListener('message', function (e) {
        interpret(e.message);
    });
    var onEnter = function ()
    {
        rooms = new Rooms(mapIdToRoom, {send:
                    websocket.send
        }, userInformation);
        if (Configuration.wallsEnabled)
            walls = new Walls({send:
                        websocket.send}, userInformation);
        if (Configuration.videoEnabled && !isMobile)
            webcamSettings = new WebcamSettings(userInformation);
        getRooms();
        //if(Configuration.wallsEnabled)
        //getWalls();
        //if(Configuration.wallsEnabled)
        //for(var i=0; i<openOnEnterWalls.length; i++)
        //{
        //    Lobby.openWall(openOnEnterWalls[i]);
        // }
        callbackFinishedLoading();
    };
    function gotVideoPm(jObject)
    {
        Lobby.openRoom(jObject);
    }
    function getVideoPm(userId)
    {

        if (userId != userInformation.userId)
        {
            var jObject = {};
            jObject.type = 'video_pm';
            jObject.otherUserId = userId;
            jObject.userId = userInformation.userId;
            websocket.send(jObject);
        }
    }
    function gotPm(jObject)
    {
        Lobby.openRoom(jObject);
        clearNotification(websocket.send, jObject.roomUuid);
    }
    Lobby.getVideoPm = function (userId)
    {
        getVideoPm(userId);
    };
    function getPm(userId)
    {
        if (userId != userInformation.userId)
        {
            var jObject = {};
            jObject.type = 'pm';
            jObject.otherUserId = userId;
            jObject.userId = userInformation.userId;
            websocket.send(jObject);
        }
    }
    Lobby.getPm = function (userId)
    {
        getPm(userId);
    };
    function getUsers()
    {
        var jObject = {};
        jObject.type = 'users';
        websocket.send(jObject);
    }
    function gotUsers(jObject)
    {
        users.listUsers(jObject.users);
    }
    function gotConnect(jObject)
    {
        userInformation = new UserInformation(jObject.user_id);
        if (onEnter)
        {
            onEnter();
            onEnter = undefined;
        }
    }
    function gotRooms(jObject)
    {
        rooms.listRooms(jObject.rooms);
    }
    function gotNotifications(jObject)
    {
        console.log('got notifications');
        if (notifications)
            notifications.listNotifications(jObject.notifications);
    }
    function getRooms()
    {
        var jObject = {};
        jObject.type = 'get_rooms';
        websocket.send(jObject);
    }
    function gotWalls(jObject)
    {
        walls.listWalls(jObject.rooms);
    }
    function getWalls()
    {
        var jObject = {};
        jObject.type = 'get_walls';
        websocket.send(jObject);
    }
    function gotCreateRoom(jObject)
    {
        if (jObject.successful)
        {
            CreateRoom.hide();
        } else
        {
            CreateRoom.error(jObject.reason);
        }
    }
    function gotProfilePictureReply(jObject)
    {
        ImageUploader.interpret(jObject);
    }
    function gotProfilePicture(jObject)
    {
        ProfilePicture.update(jObject.userId, "ServletImages?path=" + jObject.path + "&t=" + new Date().getTime());
    }
    var timerEnableAlerts;
    this.authenticate = function (jObject) {
        if (jObject.successful)
        {
            soundEffects = new SoundEffects(userInformation);
            users = new Users(true, "users", userInformation, undefined, undefined, showImageUploaderProfilePicture);
            rooms.enableOpen();
            for (var i = 0; i < openOnEnter.length; i++)
            {
                Lobby.openRoom(openOnEnter[i], true);
            }
            timerEnableAlerts = new Timer(function () {
                Tab.enableFlash(true);
            }, 3000, 1);
            userInformation.name = jObject.username;
            userInformation.userId = jObject.userId;
            var jObjectProfilePicture = settings.get('profilePicture');
            if (jObjectProfilePicture)
            {
                websocket.send(jObjectProfilePicture);
            }
            notifications = new Notifications(mapIdToRoom, websocket.send);
        }
    };
    function showImageUploaderProfilePicture()
    {
        ImageUploader.show(true, 1, {}, {send: function (jObject) {
                jObject.type = 'profile_picture';
                websocket.send(jObject);
                settings.set('profilePicture', jObject);
            }}, 'profile picture');
    }
    function callbackRoomClosed(roomId)
    {
        delete mapIdToRoom[roomId];
    }
    Lobby.openRoom = function (roomInformation, leaveNotifications)
    {
        if (mapIdToRoom[roomInformation.roomUuid])
        {
            var room = mapIdToRoom[roomInformation.roomUuid];
            room.newRoomInformation(roomInformation);
            room.task.unminimize();
        } else
        {//xxx
            if ((!isMobile) || (roomInformation.type != Room.Type.videoDynamic && roomInformation.type != Room.Type.videoStatic && roomInformation.type != Room.Type.videoPm))
                mapIdToRoom[roomInformation.roomUuid] = new Room(userInformation, roomInformation, callbackRoomClosed, "room", Configuration.URL_ENDPOINT_ROOM, {unminimize: font.unminimize, getFont: font.getFont}, {unminimize: emoticons.unminimize, getLookupTree: emoticons.getLookupTree}, {unminimize: soundEffects.unminimize}, {show: ImageUploader.show, interpret: ImageUploader.interpret}, {show: function () {
                        LobbySwingers.showMyProfile();
                    }});
        }
        if (notifications && (!leaveNotifications))
            notifications.clearNotification(roomInformation.roomUuid);
    };
    Lobby.openWall = function (wallInfo)
    {
        if (mapIdToWall[wallInfo.id])
        {
            var room = mapIdToWall[wallInfo.id];
            room.wallInformation(wallInfo);
            room.task.unminimize();
        }
        else
        {
            mapIdToWall[wallInfo.id] = new Wall(userInformation, wallInfo, Configuration.URL_ENDPOINT_WALL, {show: ImageUploader.show, interpret: ImageUploader.interpret}, {show: showImageUploaderProfilePicture});
        }
    };
    //if (!WebSocket)
    //{
    //    optionPane = new OptionPane(document.documentElement);
    //    optionPane.show([['Ok', function () {
    //           }]], "Sorry but your browser does not support websockets, please use the latest version of Chrome, Opera, Saphari, Firefox or IE!", function () {
    //   });
    //    optionPane.div.style.zIndex = '30000';
    //    optionPane.div.style.top = '30%';
    //    optionPane.div.style.position = 'fixed';
    //}
    function interpret(jObject)
    {
        console.log("lobby chat");
        console.log(jObject);
        console.log('type: ' + jObject.type);
        switch (jObject.type)
        {
            case "connect":
                gotConnect(jObject);
                break;
            case "get_rooms":
                gotRooms(jObject);
                break;
            case "notifications":
                gotNotifications(jObject);
                break;
            case "authenticate":
                gotUsername(jObject);
                break;
            case "users":
                gotUsers(jObject);
                break;
            case "pm":
                gotPm(jObject);
                break;
            case "video_pm":
                gotVideoPm(jObject);
                break;
            case "create_room":
                gotCreateRoom(jObject);
                break;
            case "profile_picture":
                gotProfilePicture(jObject);
                break;
            case "profile_picture_reply":
                gotProfilePictureReply(jObject);
                break;
        }
    }
    ;

}
var Configuration={};Configuration.debugging=true;Configuration.ajaxTimeout=120000;Configuration.authenticationType='full';Configuration.isPersistent=false;if(!window.isCors)Configuration.videoEnabled=true;Configuration.wallsEnabled=false;Configuration.allowRude=true;if(window.isCors==undefined)window.isCors=false;Configuration.emoticonsXmlString = "<?xml version=\'1.0\' encoding=\'UTF-8\' ?> \r\n<messaging_emoticons>\r\n  <folder>\r\n      <path>emoticons-icons-pack-42286<\/path>\r\n      <name>general<\/name>\r\n    <emoticon>\r\n<path>smile.gif<\/path>\r\n      <string>:)<\/string>\r\n      <String>:-)<\/String>\r\n      <string>:smile:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>grin.png<\/path>\r\n      <string>:D<\/string>\r\n      <String>:d<\/String>\r\n      <string>:grin:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n<path>0.gif<\/path>\r\n      <string>:kiss:<\/string>\r\n      <string>:*<\/string>\r\n      <string>:-*<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n<path>1.gif<\/path>\r\n      <string>:snigger:<\/string>\r\n      <string>:chuckle:<\/string>\r\n    <\/emoticon>\r\n<emoticon>\r\n<path>2.gif<\/path>\r\n      <string>:cry:<\/string>\r\n      <string>:\'(<\/string>\r\n      <string>:,(<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>3.gif<\/path>\r\n      <string>:laugh:<\/string>\r\n      <string>:lol:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>4.gif<\/path>\r\n      <string>:sun:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>5.gif<\/path>\r\n      <string>:doubt:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>6.gif<\/path>\r\n      <string>:rara:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>7.gif<\/path>\r\n      <string>>:clap:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>8.gif<\/path>\r\n      <string>:present:<\/string>\r\n      <string>:gift:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>9.gif<\/path>\r\n      <string>:angry:<\/string>\r\n      <string>:snarl:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>10.gif<\/path>\r\n      <string>:mobile:<\/string>\r\n      <string>:cell:<\/string>\r\n      <string>:phone:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>12.gif<\/path>\r\n      <string>:brokenheart:<\/string>\r\n      <string>:nolove:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>13.gif<\/path>\r\n      <string>&lt;3<\/string>\r\n      <string>:heart:<\/string>\r\n      <string>:love:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>14.gif<\/path>\r\n      <string>:drink:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>15.gif<\/path>\r\n      <string>:peace:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>16.gif<\/path>\r\n      <string>:wine:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>17.gif<\/path>\r\n      <string>:fedup:<\/string>\r\n      <string>:bored:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>18.gif<\/path>\r\n      <string>:hide:<\/string>\r\n      <string>:peak:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>19.gif<\/path>\r\n      <string>:cloud:<\/string>\r\n      <string>:clouds:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>20.gif<\/path>\r\n      <string>:music:<\/string>\r\n      <string>:notes:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>21.gif<\/path>\r\n      <string>:speachless:<\/string>\r\n      <string>:shocked:<\/string>\r\n      <string>:O<\/string>\r\n      <string>:o<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>23.gif<\/path>\r\n      <string>:disgusted:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>24.gif<\/path>\r\n      <string>:karate:<\/string>\r\n      <string>:threaten:<\/string>\r\n    <\/emoticon>\r\n\r\n\r\n    <emoticon>\r\n        <path>25.gif<\/path>\r\n      <string>:moon:<\/string>\r\n      <string>:night:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>26.gif<\/path>\r\n      <string>:bomb:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>27.gif<\/path>\r\n      <string>:wink:<\/string>\r\n      <string>;)<\/string>\r\n      <string>;-)<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>28.gif<\/path>\r\n      <string>:agent:<\/string>\r\n      <string>:spy:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>29.gif<\/path>\r\n      <string>:teary:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>30.gif<\/path>\r\n      <string>:balloons:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>31.gif<\/path>\r\n        <string>:rainbow:<\/string>\r\n\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>32.gif<\/path>\r\n      <string>:chopper:<\/string>\r\n      <string>:cleaver:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>35.gif<\/path>\r\n      <string>:handshake:<\/string>\r\n      <string>:shake:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>36.gif<\/path>\r\n      <string>:stars:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>37.gif<\/path>\r\n      <string>:coffee:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>39.gif<\/path>\r\n      <string>:cake:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>40.gif<\/path>\r\n      <string>:delight:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>41.gif<\/path>\r\n      <string>:blush:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>43.gif<\/path>\r\n      <string>:sad:<\/string>\r\n      <string>:(<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>45.gif<\/path>\r\n      <string>:snail:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>46.gif<\/path>\r\n      <string>:poop:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>47.gif<\/path>\r\n      <string>:wave:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>48.gif<\/path>\r\n      <string>:idea:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>53.gif<\/path>\r\n      <string>:shhh:<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>42.gif<\/path>\r\n      <string>:impertinent:<\/string>\r\n      <string>:-P<\/string>\r\n      <string>:-p<\/string>\r\n      <string>:P<\/string>\r\n      <string>:p<\/string>\r\n    <\/emoticon>\r\n\r\n    <emoticon>\r\n        <path>54.gif<\/path>\r\n      <string>:ok:<\/string>\r\n    <\/emoticon>\r\n  <\/folder>\r\n  \r\n  <folderXXX>\r\n      <path>evil<\/path>\r\n      <name>evil<\/name>\r\n    <emoticon>\r\n        <path>animated-devil-smiley-image-0164.gif<\/path>\r\n      <string>:evil1:<\/string>\r\n    <\/emoticon>\r\n    \r\n    <emoticon>\r\n        <path>smileys-devil-006872.gif<\/path>\r\n      <string>:666:<\/string>\r\n    <\/emoticon>\r\n    \r\n    <emoticon>\r\n        <path>smileys-devil-195541.gif<\/path>\r\n      <string>:satan:<\/string>\r\n    <\/emoticon>\r\n    \r\n    <emoticon>\r\n        <path>smileys-devil-558545.gif<\/path>\r\n      <string>:evil5:<\/string>\r\n    <\/emoticon>\r\n    \r\n    <emoticon>\r\n        <path>smileys-devil-229910.gif<\/path>\r\n      <string>:evil2:<\/string>\r\n    <\/emoticon>\r\n    \r\n    <emoticon>\r\n        <path>smileys-devil-352992.gif<\/path>\r\n      <string>:evil3:<\/string>\r\n    <\/emoticon>\r\n    \r\n    <emoticon>\r\n        <path>smileys-devil-360723.gif<\/path>\r\n      <string>:evil4:<\/string>\r\n    <\/emoticon>\r\n    \r\n    <emoticon>\r\n        <path>smileys-devil-828560.gif<\/path>\r\n      <string>:evil6:<\/string>\r\n    <\/emoticon>\r\n  <\/folderXXX>\r\n  \r\n  <folderXXX>\r\n    <path>offensive<\/path>\r\n    <name>offensive<\/name>\r\n    <emoticon>\r\n        <path>animated-bizarre-smiley-image-0021.gif<\/path>\r\n      <string>:bukake:<\/string>\r\n    <\/emoticon>\r\n    \r\n    <emoticon>\r\n        <path>animated-bizarre-smiley-image-0043.gif<\/path>\r\n      <string>:breast:<\/string>\r\n    <\/emoticon>\r\n    \r\n    <emoticon>\r\n        <path>animated-bizarre-smiley-image-0038.gif<\/path>\r\n        <string>:zoophilia:<\/string>\r\n      <string>:welsh:<\/string>\r\n    <\/emoticon>\r\n    \r\n    <emoticon>\r\n        <path>animated-bizarre-smiley-image-0047.gif<\/path>\r\n      <string>:shag:<\/string>\r\n    <\/emoticon>\r\n    \r\n    <emoticon>\r\n        <path>animated-love-smiley-image-0051.gif<\/path>\r\n      <string>:dogging:<\/string>\r\n    <\/emoticon>\r\n    \r\n    <emoticon>\r\n        <path>animated-bizarre-smiley-image-0004.gif<\/path>\r\n      <string>:flash:<\/string>\r\n    <\/emoticon>\r\n    \r\n    <emoticon>\r\n        <path>animated-bizarre-smiley-image-0019.gif<\/path>\r\n      <string>:wank:<\/string>\r\n    <\/emoticon>\r\n    \r\n    <emoticon>\r\n        <path>0084.gif<\/path>\r\n      <string>:bums:<\/string>\r\n    <\/emoticon>\r\n    \r\n    <emoticon>\r\n        <path>fart1.gif<\/path>\r\n      <string>:fart:<\/string>\r\n    <\/emoticon>\r\n    \r\n    <emoticon>\r\n        <path>frombehind.gif<\/path>\r\n      <string>:anal:<\/string>\r\n    <\/emoticon>\r\n    \r\n    <emoticon>\r\n        <path>spermy3.gif<\/path>\r\n      <string>:sperm:<\/string>\r\n    <\/emoticon>\r\n    \r\n    <emoticon>\r\n        <path>animated-bizarre-smiley-image-0017.gif<\/path>\r\n      <string>:oral:<\/string>\r\n    <\/emoticon>\r\n  <\/folderXXX>\r\n  \r\n  <folderXXX>\r\n      <path>toilet<\/path>\r\n      <name>toilet<\/name>\r\n    <emoticon>\r\n        <path>smiley-toilet06.gif<\/path>\r\n      <string>:2:<\/string>\r\n    <\/emoticon>\r\n    \r\n    <emoticon>\r\n        <path>smiley-toilet13.gif<\/path>\r\n      <string>:sitting:<\/string>\r\n    <\/emoticon>\r\n    \r\n    \r\n    <emoticon>\r\n        <path>smiley-toilet02.gif<\/path>\r\n      <string>:urinal:<\/string>\r\n    <\/emoticon>\r\n  <\/folderXXX>\r\n  <folder>\r\n      <path>aliens<\/path>\r\n      <name>aliens<\/name>\r\n    <emoticon>\r\n        <path>alien42.gif<\/path>\r\n      <string>:alien42:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>alien47.gif<\/path>\r\n      <string>:alien47:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>alien48.gif<\/path>\r\n      <string>:alien48:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>alien49.gif<\/path>\r\n      <string>:alien49:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>alien51.gif<\/path>\r\n      <string>:alien51:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>alien60.gif<\/path>\r\n      <string>:alien60:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>alien66.gif<\/path>\r\n      <string>:alien66:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>alien70.gif<\/path>\r\n      <string>:alien70:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>alien72.gif<\/path>\r\n      <string>:alien72:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>alien73.gif<\/path>\r\n      <string>:alien73:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>alien80.gif<\/path>\r\n      <string>:alien80:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>alien81.gif<\/path>\r\n      <string>:alien81:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>alien82.gif<\/path>\r\n      <string>:alien82:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>alien85.gif<\/path>\r\n      <string>:alien85:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>alien93.gif<\/path>\r\n      <string>:alien93:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>alien95.gif<\/path>\r\n      <string>:alien95:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>alien96.gif<\/path>\r\n      <string>:alien96:<\/string>\r\n    <\/emoticon>\r\n  <\/folder>\r\n  <folder>\r\n      <path>signs<\/path>\r\n      <name>signs<\/name>\r\n    <emoticon>\r\n        <path>smileys-smiley-with-sign-363798.gif<\/path>\r\n      <string>:do not feed:<\/string>\r\n    <\/emoticon>\r\n    <emoticonXXX>\r\n        <path>smileys-smiley-with-sign-083208.gif<\/path>\r\n      <string>:idiot:<\/string>\r\n    <\/emoticonXXX>\r\n    <emoticon>\r\n        <path>welcome1.gif<\/path>\r\n      <string>:welcome:<\/string>\r\n    <\/emoticon>\r\n    <emoticonXXX>\r\n        <path>feminazi_smiley.gif<\/path>\r\n      <string>:feminazi:<\/string>\r\n    <\/emoticonXXX>\r\n  <\/folder>\r\n  <folder>\r\n      <path>animals<\/path>\r\n      <name>animals<\/name>\r\n    <emoticon>\r\n        <path>serpentbleu.gif<\/path>\r\n      <string>:snake:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>sponge1.gif<\/path>\r\n      <string>:spongebob:<\/string>\r\n    <\/emoticon>\r\n    <emoticonXXX>\r\n        <path>bear1.gif<\/path>\r\n      <string>:bear:<\/string>\r\n    <\/emoticonXXX>\r\n    <emoticon>\r\n        <path>butterfly07.gif<\/path>\r\n      <string>:butterfly1:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>butterfly08.gif<\/path>\r\n      <string>:butterfly2:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>fish5.gif<\/path>\r\n      <string>:fish1:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>fish10.gif<\/path>\r\n      <string>:fish2:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>parrot.gif<\/path>\r\n      <string>:parrot:<\/string>\r\n    <\/emoticon>\r\n  <\/folder>\r\n  <folderXXX>\r\n      <path>drugs<\/path>\r\n      <name>drugs<\/name>\r\n    <emoticon>\r\n        <path>bong.gif<\/path>\r\n      <string>:bong:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n      <string>:cigarette:<\/string>\r\n        <path>cigarette.gif<\/path>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>joint.gif<\/path>\r\n      <string>:joint:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>passing-joint-smiley-emoticon.gif<\/path>\r\n      <string>:passing_joint:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>smiley-rolling-joint.gif<\/path>\r\n      <string>:rolling:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>drugs.gif<\/path>\r\n      <string>:drugs:<\/string>\r\n    <\/emoticon>\r\n  <\/folderXXX>\r\n  <folder>\r\n      <path>transport<\/path>\r\n      <name>transport<\/name>\r\n    <emoticon>\r\n        <path>smiley-transport003.gif<\/path>\r\n      <string>:sherif:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>smiley-transport022.gif<\/path>\r\n      <string>:train:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>smiley-transport029.gif<\/path>\r\n      <string>:school_bus:<\/string>\r\n    <\/emoticon>\r\n  <\/folder>\r\n  <folder>\r\n      <path>violent<\/path>\r\n      <name>violent<\/name>\r\n    <emoticon>\r\n        <path>smiley-violent013.gif<\/path>\r\n      <string>:chainsaw:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>smiley-violent029.gif<\/path>\r\n      <string>:microwave:<\/string>\r\n    <\/emoticon>\r\n  <\/folder>\r\n  <folder>\r\n      <path>sport<\/path>\r\n      <name>sport<\/name>\r\n    <emoticon>\r\n        <path>smiley-sport002.gif<\/path>\r\n      <string>:header:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>smiley-sport003.gif<\/path>\r\n      <string>:goal:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>smiley-sport006.gif<\/path>\r\n      <string>:football:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>smiley-sport007.gif<\/path>\r\n      <string>:surfing:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>smiley-sport017.gif<\/path>\r\n      <string>:weights:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>smiley-sport031.gif<\/path>\r\n      <string>:ref:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>smiley-sport035.gif<\/path>\r\n      <string>:spectator:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>smiley-sport037.gif<\/path>\r\n      <string>:shooting:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>smiley-sport038.gif<\/path>\r\n      <string>:diving:<\/string>\r\n    <\/emoticon>\r\n    <emoticon>\r\n        <path>smiley-sport041.gif<\/path>\r\n      <string>:fishing:<\/string>\r\n    <\/emoticon>\r\n  <\/folder>\r\n<\/messaging_emoticons>\r\n";Configuration.radioChannelsXmlString = "<?xml version=\'1.0\' encoding=\'UTF-8\' ?> \r\n<channels>\r\n    <channel>\r\n        <url>http:\/\/bbcmedia.ic.llnwd.net\/stream\/bbcmedia_radio2_mf_q<\/url>\r\n        <name>BBC Radio 2<\/name>\r\n    <\/channel>\r\n    <channel>\r\n        <url>http:\/\/bbcmedia.ic.llnwd.net\/stream\/bbcmedia_6music_mf_p<\/url>\r\n        <name>BBC 6<\/name>\r\n    <\/channel>\r\n    <channel>\r\n        <url>http:\/\/media-ice.musicradio.com\/CapitalSouthCoastMP3<\/url>\r\n        <name>103.2 Capital FM<\/name>\r\n    <\/channel>\r\n    <channel>\r\n        <url>http:\/\/ice-sov.musicradio.com:80\/CapitalXTRALondon<\/url>\r\n        <name>Capital XTRA London<\/name>\r\n    <\/channel>\r\n    <channel>\r\n        <url>http:\/\/media-ice.musicradio.com:80\/ClassicFMMP3<\/url>\r\n        <name>Classic FM<\/name>\r\n    <\/channel>\r\n    <channel>\r\n        <url>http:\/\/ice01.va.audionow.com:8000\/DesiBite.mp3<\/url>\r\n        <name>Desi Bite Radio<\/name>\r\n    <\/channel>\r\n    <channel>\r\n        <url>http:\/\/ice-sov.musicradio.com:80\/HeartLondonMP3<\/url>\r\n        <name>Heart 106.2 FM<\/name>\r\n    <\/channel>\r\n    <channel>\r\n        <url>http:\/\/icy-e-bz-03-gos.sharp-stream.com:8000\/metro.mp3<\/url>\r\n        <name>Metro Radio<\/name>\r\n    <\/channel>\r\n    <channel>\r\n        <url>http:\/\/s3.xrad.io:8096<\/url>\r\n        <name>107.7 Splash FM<\/name>\r\n    <\/channel>\r\n    <channel>\r\n        <url>http:\/\/s04.whooshclouds.net:8220\/live<\/url>\r\n        <name>Totalrock<\/name>\r\n    <\/channel>\r\n    <channel>\r\n        <url>http:\/\/radio.virginradio.co.uk\/stream<\/url>\r\n        <name>Virgin Radio UK<\/name>\r\n    <\/channel>\r\n    <channel>\r\n        <url>http:\/\/media-ice.musicradio.com:80\/Capital<\/url>\r\n        <name>Capital FM<\/name>\r\n    <\/channel>\r\n<\/channels>\r\n";Configuration.pageType='all_desktop';Configuration.ENDPOINT_TYPE =MySocket.Type.WebSocket;Configuration.forcedImports=[pickupElseCreateElement];window.lobbiesToLoad=[];window.lobbiesToLoad.push(LobbyChat);window.lobbiesToLoad.push(LobbySwingers);var preloadedImages=[];var imagesToPreload=[window.thePageUrl+'images/add_image.png',window.thePageUrl+'images/add_image_button.png',window.thePageUrl+'images/add_image_button_blue.png',window.thePageUrl+'images/arrow_left.png',window.thePageUrl+'images/arrow_left_hover.png',window.thePageUrl+'images/arrow_right.png',window.thePageUrl+'images/arrow_right_hover.png',window.thePageUrl+'images/background.png',window.thePageUrl+'images/background2.jpg',window.thePageUrl+'images/black_menu.png',window.thePageUrl+'images/bold.png',window.thePageUrl+'images/button_cancel.png',window.thePageUrl+'images/button_grey_play.png',window.thePageUrl+'images/button_grey_stop.png',window.thePageUrl+'images/button_play_blue.png',window.thePageUrl+'images/button_stop_blue.png',window.thePageUrl+'images/close_black.png',window.thePageUrl+'images/close_red.png',window.thePageUrl+'images/close_white.png',window.thePageUrl+'images/color_picker.png',window.thePageUrl+'images/color_picker_hover.png',window.thePageUrl+'images/delete.png',window.thePageUrl+'images/delete_hover.png',window.thePageUrl+'images/email.png',window.thePageUrl+'images/emoticons-icon-blue.gif',window.thePageUrl+'images/emoticons-icon.gif',window.thePageUrl+'images/font-colors-icon.gif',window.thePageUrl+'images/font-icon.gif',window.thePageUrl+'images/font-icon.png',window.thePageUrl+'images/font.png',window.thePageUrl+'images/gender.png',window.thePageUrl+'images/gender_hover.png',window.thePageUrl+'images/google-maps-marker.png',window.thePageUrl+'images/interests.png',window.thePageUrl+'images/interests_hover.png',window.thePageUrl+'images/italic.png',window.thePageUrl+'images/keyboard.png',window.thePageUrl+'images/location_picker_icon.png',window.thePageUrl+'images/location_picker_icon_blue.png',window.thePageUrl+'images/maximize_black.png',window.thePageUrl+'images/maximize_red.png',window.thePageUrl+'images/maximize_white.png',window.thePageUrl+'images/minimize_black.png',window.thePageUrl+'images/minimize_red.png',window.thePageUrl+'images/minimize_white.png',window.thePageUrl+'images/move.png',window.thePageUrl+'images/nights-sky.jpg',window.thePageUrl+'images/notifications-icon.png',window.thePageUrl+'images/others',window.thePageUrl+'images/profile',window.thePageUrl+'images/profile-picture-icon-blue.gif',window.thePageUrl+'images/profile-picture-icon.gif',window.thePageUrl+'images/profiles_logo.png',window.thePageUrl+'images/Red-Radio-icon.png',window.thePageUrl+'images/reload.png',window.thePageUrl+'images/reload_hover.png',window.thePageUrl+'images/room-icon.gif',window.thePageUrl+'images/rooms-icon.gif',window.thePageUrl+'images/se-resize.png',window.thePageUrl+'images/set_not_profile.png',window.thePageUrl+'images/set_not_profile_hover.png',window.thePageUrl+'images/set_profile.png',window.thePageUrl+'images/set_profile_hover.png',window.thePageUrl+'images/shadow.png',window.thePageUrl+'images/smile.gif',window.thePageUrl+'images/smiley.png',window.thePageUrl+'images/smile_blue.gif',window.thePageUrl+'images/sound-effects-icon-blue.gif',window.thePageUrl+'images/sound-effects-icon.gif',window.thePageUrl+'images/star--background-neon.jpg',window.thePageUrl+'images/star--background-seamless-repeating1.jpg',window.thePageUrl+'images/theme-icon.png',window.thePageUrl+'images/themes-icon.gif',window.thePageUrl+'images/themes-icon2.gif',window.thePageUrl+'images/tick.png',window.thePageUrl+'images/trees.jpg',window.thePageUrl+'images/underline.png',window.thePageUrl+'images/Untitled.png',window.thePageUrl+'images/upload-image-icon-blue.gif',window.thePageUrl+'images/upload-image-icon.gif',window.thePageUrl+'images/user.png',window.thePageUrl+'images/users.gif',window.thePageUrl+'images/users_highlighted.gif',window.thePageUrl+'images/user_info.png',window.thePageUrl+'images/user_info_blue.png',window.thePageUrl+'images/video-icon.png',window.thePageUrl+'images/video-start-icon-blue.gif',window.thePageUrl+'images/video-start-icon.gif',window.thePageUrl+'images/video-stop-icon-blue.gif',window.thePageUrl+'images/video-stop-icon.gif',window.thePageUrl+'images/video_downloader',window.thePageUrl+'images/wall-icon.gif',window.thePageUrl+'images/walls-icon.gif',window.thePageUrl+'images/webcam-settings-icon.gif',window.thePageUrl+'images/webcam.png',window.thePageUrl+'images/white_menu.png',window.thePageUrl+'images/writing.png',window.thePageUrl+'images/writing_hover.png',window.thePageUrl+'images/writing_lock.png',window.thePageUrl+'images/writing_lock_hover.png']; var taskPreloadImages = new Task(function(){for(var i=0; i<imagesToPreload.length; i++){var img = new Image(); img.src=imagesToPreload[i]; preloadedImages.push(img);}});var lobby = new Lobby();