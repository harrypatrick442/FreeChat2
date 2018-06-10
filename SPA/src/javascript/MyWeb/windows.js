
var Windows = new (function(){
    var self = this;
this.maxYPx = 1200;
this.maxWidthPx = 1800;
this.maxHeightPx = 1800;
this.instances = [];
this.currentBounds = {minYPx: 0, maxYPx: 1200, minXPercent: 0, maxXPercent: 100};
this.add = function(obj, minimized, divTab, divInner, windowInformation, callbacks)
{
    var self = this;
    this.instances.push(obj);
    document.body.appendChild(obj.div);
    obj.div.addEventListener("mousedown", function() {
        if (!obj.cancelBringToFront)
        {
            self.bringToFront(obj);
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
            obj.resizable = new Resizable(obj.div, divInner, windowInformation.minWidthPx, windowInformation.minHeightPx, windowInformation.maxWidthPx, windowInformation.maxHeightPx, self.currentBounds,
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
            }
                    ,function(e){
                        console.log("started");
                    if(windowInformation.maximized)
                        console.log(e);
                        Window.unmaximize(obj, {left:e.screenX});
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
this.isWindow = function(element)
{
    return self.instances.indexOf(element) >= 0;
};
this.getParentWindow = function(element)
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
this.remove = function(obj)
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
this.hide = function(obj)
{
    obj.hide();};
this.show = function(obj)
{
    obj.show();
};
this.cancelBringToFront = function(obj)
{
    obj.cancelBringToFront = true;
};
this.bringToFront = function(obj)
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
};
this.getActive = function()
{
    var i = self.instances.length - 1;
    while (i > 0)
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


var Window = new (function(){
    document.body.style.overflowY = 'auto';
    var self = this;
this.stopEventPropogation = function(e)
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
this.getStartPosition = function()
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
this.maximize = function(obj, fillElseReduce)
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
this.unmaximize=function(obj, mouseDragPosition){
    unmaximize(obj, mouseDragPosition);
};
this.resize=function(obj){
    if(obj.windowInformation.maximized){
        var p = Resizable.padding * 2;
        setWindowSizePosition(obj, document.documentElement.clientWidth, document.documentElement.clientHeight - (p + Windows.taskBar.div.offsetHeight), -Resizable.padding, -Resizable.padding);
    }
};

this.style = function(div, divInner, divTab)
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
        callback: function(theme) {

        }
    };
    Themes.register(themesObject, undefined);
};
this.CloseButton = function(callback)
{
    var button = new self.Button(callback, 'images/close_white.png', 'images/close_red.png');
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
this.MinimizeButton = function(callback)
{
    var button = new self.Button(callback, 'images/minimize_white.png', 'images/minimize_red.png');
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
this.MaximizeButton = function(callback)
{
    var button = new self.Button(callback, 'images/maximize_white.png', 'images/maximize_red.png');
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
this.Button = function(callback, imageSource, imageSourceHover)
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
    this.button.addEventListener("mousedown",function()
    {
        console.log('canceling');
        if(window.Drag)
            Drag.cancel = true;
    });
    this.button.addEventListener("click",function()
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
        if(windowInformation.previousSizes)
        {
            if(!mouseDragPosition)
            setWindowSizePosition(obj, windowInformation.previousSizes.width, windowInformation.previousSizes.height, windowInformation.previousSizes.top, windowInformation.previousSizes.left);
        else{
            var s = mouseDragPosition.left;
            var b = mouseDragPosition.left/document.documentElement.clientWidth;
            var leftOffset = (b*windowInformation.previousSizes.width);
            var l = mouseDragPosition.left-leftOffset;
            console.log(l);
            setWindowSizePosition(obj, windowInformation.previousSizes.width, windowInformation.previousSizes.height, undefined, l);}   
        }
        windowInformation.maximized = false;
    }
    function setWindowSizePosition(obj, width, height, top, left)
    {
        obj.div.style.height = String(height) + 'px';
        obj.div.style.width = String(width) + 'px';
        if(top)
            obj.div.style.top = String(top) + 'px';
        if(left)
        obj.div.style.left = String(left) + 'px';
    }
window.addEventListener("resize", function() {
    for (var i = 0; i < Windows.instances.length; i++)
    {
        var obj = Windows.instances[i];
            self.resize(obj, true);
    }
}, false);
this.divDragHeightTaskBarPx = document.documentElement.clientHeight / 12;
        
        })();
        
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