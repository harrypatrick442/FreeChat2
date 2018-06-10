function Drag(element, handle, minX, maxX, minY, maxY, callback, callbackBegan) {
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
        onDown(e.pageX, e.pageY);
    };
    efficientMovingCycle.ontouchstart = function (e) {
        onDown(e.touches[0].pageX, e.touches[0].pageY);
    };
    //handle.addEventListener("touchstart", function(e){
    //    onDown(e.touches[0].pageX, e.touches[0].pageY);
    //});
    function onDown(x, y)
    {
        if(callbackDown)
            callbackDown();
        if (element.style.display === "none")
        {
            return;
        }
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
          state = 0;
    };
    efficientMovingCycle.ontouchend = function (e) {
        state=0;
    };
}