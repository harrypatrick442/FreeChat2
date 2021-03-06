function GenericWindow(name, tooltipMessage, iconPath, minWidth, maxWidth, minHeight, maxHeight, defaultWidth, defaultHeight, defaultX, defaultY, minimized, minimizable, maximizable, minimizeOnClose, bringToFront)
{
    var self = this;
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

    this.show = function ()
    {
        self.div.style.display = 'inline';
        if (self.onshow)
        {
            try
            {
                self.onshow();
            }
            catch (ex)
            {
                console.log(ex);
            }
        }
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
        self.task.minimize();
    } : function () {
    };
    var callbackMaximize = maximizable ? function () {
        self.task.maximize();
    } : function () {
    };
    var callbackClose = minimizeOnClose ? function () {
        self.task.minimize();
    } : function () {
        close();
    };
    Themes.register(themesObject, undefined);
    var themesObjectWindow = Window.style(self.div, self.divInner, self.divTab);
    var windowInformation = new WindowInformation(true, true, minWidth, minHeight, maxWidth, maxHeight, 0, 100, 0, Windows.maxYPx, true, true, true);
    var callbacks = new WindowCallbacks(function () {
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
        settings.set("size", [self.div.offsetWidth, self.div.offsetHeight]);
    }, function () {
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
    }
    ,
            callbackMinimize,
            callbackMaximize,
            callbackClose, function (zIndex) {
                settings.set("zIndex", zIndex);
            }, function () {
        if (self.onresize)
        {
            try
            {
                self.onresize();
            }
            catch (ex) {
            }

        }
    });
    var params = {obj: this,
        minimized: false,
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
        if (self.onclose)
        {
            self.onclose();
        }
    }
    TaskBar.add(this);
    if (bringToFront != false)
        Windows.bringToFront(self);
}