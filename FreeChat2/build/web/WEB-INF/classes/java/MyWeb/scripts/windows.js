function Window()
{

}
function Windows()
{

}
Windows.maxYPx = 1200;
Windows.maxWidthPx = 1800;
Windows.maxHeightPx = 1800;
Windows.instances = [];
Windows.currentBounds = {minYPx: 0, maxYPx: 1200, minXPercent: 0, maxXPercent: 100};
Windows.add = function(obj, minimized, divTab, divInner, windowInformation, callbacks)
{
    Windows.instances.push(obj);
    document.body.appendChild(obj.div);
    obj.div.addEventListener("mousedown", function() {
        if (!obj.cancelBringToFront)
        {
            Windows.bringToFront(obj);
        }
        obj.cancelBringToFront = false;
    });
    if (!windowInformation)
        windowInformation = new WindowInformation();
    obj.windowInformation = windowInformation;
    obj.windowMethods = {resized: function() {
            maximized = false;
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
            obj.resizable = new Resizable(obj.div, divInner, windowInformation.minWidthPx, windowInformation.minHeightPx, windowInformation.maxWidthPx, windowInformation.maxHeightPx, Windows.currentBounds,
                    callbacks.resized,
                    callbacks.resizedInstantaneous);
        }
        if (windowInformation.dragable)
        {
            obj.drag = new Drag(obj.div, divTab, windowInformation.minXPercent, windowInformation.maxXPercent, windowInformation.minYPx, windowInformation.maxYPx, function()
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
            });



        }
    }
    if (!isMobile)
    {
        obj.buttonClose = new Window.CloseButton(function() {
            if (callbacks.minimizeOnClose)
            {
                if (callbacks.minimize)
                {
                    callbacks.maximize();
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
        if (windowInformation.maximizable)
        {
            obj.buttonMaximize = new Window.MaximizeButton(function() {
                if (callbacks.maximize)
                    callbacks.maximize();
            });
            divTab.appendChild(obj.buttonMaximize.button);
        }
        if (windowInformation.minimizable)
        {
            obj.buttonMinimize = new Window.MinimizeButton(function() {
                if (callbacks.minimize)
                    callbacks.minimize();
            });
            divTab.appendChild(obj.buttonMinimize.button);
        }
    }

};
Windows.isWindow = function(element)
{
    return Windows.instances.indexOf(element) >= 0;
};
Windows.getParentWindow = function(element)
{
    while (true)
    {
        if (element.parentElement == document.documentElement)
        {
            return document.documentElement;
        }
        else
        {
            if (Windows.isWindow(element))
            {
                return element;
            }
        }
        element = element.parentElement;
    }
};
Windows.remove = function(obj)
{
    Windows.instances.splice(Windows.instances.indexOf(obj), 1);
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
Windows.hide = function(obj)
{
    obj.hide();
};
Windows.show = function(obj)
{
    obj.show();
};
Windows.cancelBringToFront = function(obj)
{
    obj.cancelBringToFront = true;
};
Windows.bringToFront = function(obj)
{
    var spliced = Windows.instances.splice(Windows.instances.indexOf(obj), 1)[0];
    if (spliced)
    {
        Windows.instances.push(spliced);
    }
    var zIndex = 100;
    for (var i = 0; i < Windows.instances.length; i++)
    {
        var obj = Windows.instances[i];
        obj.div.style.zIndex = String(zIndex);
        if (obj.windowMethods.callbacks.callbackZIndexChanged)
        {
            obj.windowMethods.callbacks.callbackZIndexChanged(zIndex);
        }
        zIndex++;
    }
};
Windows.getActive = function()
{
    var i = Windows.instances.length - 1;
    while (i > 0)
    {
        var active = Windows.instances[i];
        if (active.div.style.display != 'none')
        {
            return active;
        }
        i--;
    }
    return null;
};
document.body.style.overflowY = 'auto';
Window.stopEventPropogation = function(e)
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
Window.getStartPosition = function()
{
    var diag;
    while (true)
    {
        diag = 100 * Math.random() | 0;
        if (!Window.previousDiag)
        {
            break;
        }
        else
        {
            if (Math.abs(Window.previousDiag - diag) > 19)
            {
                break;
            }
        }
    }
    var top = 0;
    var left = 260;
    Window.previousDiag = diag;
    return [left + diag, top + diag];
};
Window.maximize = function(obj, fillElseReduce)
{

    function getSizes()
    {
        var p = Resizable.padding * 2;
        return {width: obj.div.offsetWidth - p, height: obj.div.offsetHeight - p, top: obj.div.offsetTop, left: obj.div.offsetLeft};
    }
    var windowInformation = obj.windowInformation;
    if (fillElseReduce != undefined)
    {
        if (fillElseReduce)
        {
            maximize();
        }
        else
        {
            unmaximize();
        }
    }
    else
    {
        if (!windowInformation.maximized || (windowInformation.maximized && !equalValues(getSizes(), windowInformation.maximizedSizes)))
        {
            maximize();
        }
        else
        {
            unmaximize();
        }
    }
    function setWindowSizePosition(width, height, top, left)
    {
        obj.div.style.height = String(height) + 'px';
        obj.div.style.width = String(width) + 'px';
        obj.div.style.top = String(top) + 'px';
        obj.div.style.left = String(left) + 'px';
    }
    function maximize()
    {
        windowInformation.previousSizes = getSizes();
        var p = Resizable.padding * 2;
        setWindowSizePosition(document.documentElement.clientWidth, document.documentElement.clientHeight - (p + Windows.taskBar.div.offsetHeight), -Resizable.padding, -Resizable.padding);
        windowInformation.maximizedSizes = getSizes();
        windowInformation.maximized = true;
    }
    function unmaximize()
    {
        setWindowSizePosition(windowInformation.previousSizes.width, windowInformation.previousSizes.height, windowInformation.previousSizes.top, windowInformation.previousSizes.left);
        windowInformation.maximized = false;
    }
};
Window.style = function(div, divInner, divTab)
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
        div.style.height = 'calc(100% - ' + String(Window.divDragHeightTaskBarPx) + 'px)';
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
        callback: function(theme) {

        }
    };
    Themes.register(themesObject, undefined);
};
Window.CloseButton = function(callback)
{
    var button = new Window.Button(callback, 'images/close_white.png', 'images/close_red.png');
    this.button = button.button;
    var themesObject = {components: [
            {name: 'closeImage', elements: [button.img]}
        ],
        callback: function(theme) {

        }
    };
    Themes.register(themesObject, undefined);
    this.close = function()
    {
        Themes.remove(themesObject);
    };
};
Window.MinimizeButton = function(callback)
{
    var button = new Window.Button(callback, 'images/minimize_white.png', 'images/minimize_red.png');
    this.button = button.button;
    var themesObject = {components: [
            {name: 'minimizeImage', elements: [button.img]}
        ],
        callback: function(theme) {

        }
    };
    Themes.register(themesObject, undefined);
    this.close = function()
    {
        Themes.remove(themesObject);
    };
};
Window.MaximizeButton = function(callback)
{
    var button = new Window.Button(callback, 'images/maximize_white.png', 'images/maximize_red.png');
    this.button = button.button;
    var themesObject = {components: [
            {name: 'maximizeImage', elements: [button.img]}
        ],
        callback: function(theme) {

        }
    };
    Themes.register(themesObject, undefined);
    this.close = function()
    {
        Themes.remove(themesObject);
    };
};
Window.Button = function(callback, imageSource, imageSourceHover)
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
    new Hover(this.button, function() {
        previousImage = self.img.src;
        self.img.src = window.thePageUrl + imageSourceHover;
    }, function() {
        self.img.src = previousImage;


    });
    this.button.onclick = function()
    {
        callback();
    };

};
function WindowInformation(resizable, dragable, minWidthPx, minHeightPx, maxWidthPx, maxHeightPx, minXPercent, maxXPercent, minYPx, maxYPx, minimizable, maximizable, minimizeOnClose)
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
}
function WindowCallbacks(resized, dragged, minimize, maximize, close, callbackZIndexChanged, resizedInstantaneous)
{
    this.resized = resized;
    this.dragged = dragged;
    this.minimize = minimize;
    this.maximize = maximize;
    this.close = close;
    this.callbackZIndexChanged = callbackZIndexChanged;
    this.resizedInstantaneous = resizedInstantaneous;
}
window.addEventListener("resize", function() {
    for (var i = 0; i < Windows.instances.length; i++)
    {
        var obj = Windows.instances[i];
        if (obj.windowInformation.maximized)
        {
            obj.windowInformation.maximized = false;
            Window.maximize(obj, true);
        }
    }
}, false);
Window.divDragHeightTaskBarPx = document.documentElement.clientHeight / 12;
        