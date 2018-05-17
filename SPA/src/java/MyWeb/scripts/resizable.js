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


