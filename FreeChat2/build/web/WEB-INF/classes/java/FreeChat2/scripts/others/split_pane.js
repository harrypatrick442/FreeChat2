function SplitPane(element1, elementTab, element2, elementTotalRegion, vertical, min, max, def, callback) {
    var state;
    if (min == undefined||min<0)
    {
        min = 0;
    }
    else {
        if(max==undefined || max>100)
        {
            max = 100;
        }
    }
    var offsets = [];
    var latestPercentage;
    function onMouseUp(e) {
        state = 'up';
    }
    this.setPosition = function (percent) {
        latestPercentage = percent;
        if (vertical) {
            setPercentHorizontal(percent);
        }
        else {
            setPercentVertical(percent);
        }
        if (callback != undefined) { callback(); }
    };
    this.getPosition = function () {
        return latestPercentage;
    };
    var timer;
    function onMouseMove(e) {
        if (state == 'down') {
            if (!vertical) {
                var newX = offsets[0] + e.pageX
                var percent = (100 * newX) / elementTotalRegion.offsetWidth;
                latestPercentage = normalizePercent(percent);
                setPercentVertical(latestPercentage);
            }
            else {
                var newY = offsets[0] + e.pageY;
                var percent = (100 * newY) / elementTotalRegion.offsetHeight;
                latestPercentage = normalizePercent(percent);
                setPercentHorizontal(latestPercentage);
            }
            timer.reset();
        }

    }
    document.documentElement.addEventListener("mousemove",function (e) {
            onMouseMove(e);
        });
    elementTab.onmousedown = function (e) {
        if (!vertical) {
            offsets[0] = (elementTab.offsetWidth / 2) + element1.offsetWidth - e.pageX;
        }
        else {
            offsets[0] = (elementTab.offsetHeight / 2) + element1.offsetHeight - e.pageY;
        }
        state = 'down';
        timer = new Timer(function () { if (callback != undefined) { callback(); } }, 1000, 1);
    };
   document.documentElement.addEventListener("mouseup", function (e) {
            onMouseUp(e);
        });
    function setPercentVertical(percent)
    {
        element1.style.width = String(percent) + '%';
        element2.style.width = String(100 - percent) + '%';
    }
    function setPercentHorizontal(percent)
    {
        element1.style.height = String(percent) + '%';
        element2.style.height = String(100 - percent) + '%';
    }
    function normalizePercent(percent)
    {

        if (percent < min) {
            percent = min;
        }
        else {
            if (percent > max) {
                percent = max;
            }
        }
        return percent;
    }

    if (def != undefined) {
        if (!vertical) {
            setPercentVertical(normalizePercent(def));
        }
        else {
            setPercentHorizontal(normalizePercent(def));
        }
    }
}