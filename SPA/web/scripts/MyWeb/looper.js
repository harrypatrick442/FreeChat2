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
