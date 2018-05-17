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