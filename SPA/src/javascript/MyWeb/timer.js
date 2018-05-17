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