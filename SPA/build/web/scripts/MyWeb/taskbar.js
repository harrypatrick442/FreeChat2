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
            Windows.hide(self.obj);
            var active = Windows.getActive();
            if (active != null)
            {
                setActiveTask(active.task);
            } else
            {
                setActiveTask(null);
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
