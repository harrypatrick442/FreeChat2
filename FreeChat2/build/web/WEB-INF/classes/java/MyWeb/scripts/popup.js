
function Popup(parent, placement, forceToFront, offsets, callbackClosing)
{
    var self = this;
    this.div = document.createElement('div');
    this.div.style.display='none';
    function extractNumber(str)
    {
        var index = str.indexOf('%');
        if (index > -1)
            return parseInt(str.substring(0, index));
        index = str.indexOf('px');
        return parseInt(str.substring(0, index));
    }
    var offsetNumbers;
    function getOffsetNumbers()
    {
        offsetNumbers = {};
        if (offsets.width)
            offsetNumbers.width = extractNumber(offsets.width);
        if (offsets.height)
            offsetNumbers.height = extractNumber(offsets.height);
        if (offsets.left)
            offsetNumbers.left = extractNumber(offsets.left);
        if (offsets.top)
            offsetNumbers.top = extractNumber(offsets.top);
    }
    getOffsetNumbers(offsets);
    var self = this;
    if (!placement)
        placement = Popup.Placement.Relative;
    if (forceToFront == undefined)
        forceToFront = false;
    var showing = false;
    var parentWindow = Windows.getParentWindow(parent);
    var mousedown = function (e) {
        if (!e)
            var e = window.event;
        if (!pointIsOver(e.pageX, e.pageY))
            self.hide();
    };
    this.show = function ()
    {
        if (!showing)
        {
            self.div.style.display = 'inline';
            showing = true;
            document.documentElement.addEventListener("mousedown", mousedown);
            bringInFront();
            position();
                if(self.onshow)
                    try
                {
                    self.onshow();
                }
                catch(ex)
                {
                    console.log(ex);
                }
        }
    };
    this.hide = function ()
    {
        if (showing)
        {
            showing = false;
            self.div.style.display='none';
            document.documentElement.removeEventListener("mousedown", mousedown);
            if(callbackClosing)
                callbackClosing();
        }
    };
    function pointIsOver(x, y)
    {
        var offsets = getAbsolute(self.div);
        return (x >= offsets.left && x < offsets.left + self.div.offsetWidth && y >= offsets.top && y < offsets.top + self.div.offsetHeight);
    }
    function bringInFront()
    {
        var zIndex;
        if (forceToFront)
            zIndex = getZIndex(parentWindow);
        else
            zIndex = 200000;
        self.div.style.zIndex = String(zIndex + 1);
    }
    function position()
    {
        var left;
        var top;
        switch (placement)
        {
            case Popup.Placement.Absolute:
                self.div.style.position = 'absolute';
                var abs = getAbsolute(parent);
                if (offsets)
                {
                    if (offsets.width)
                    {
                        if (offsets.width.indexOf('%') > 0)
                            self.div.style.width = String((offsetNumbers.width * parent.offsetWidth) / 100) + 'px';
                        else
                        {
                        if (offsets.width.indexOf('px') > 0)
                            self.div.style.width = offsets.width;
                        else
                            self.div.style.width='auto';
                        }
                    }
                    if (offsets.height)
                    {
                        if (offsets.height.indexOf('%') > 0)
                            self.div.style.height = String((offsetNumbers.height * parent.offsetHeight) / 100) + 'px';
                        else
                        {
                        if (offsets.height.indexOf('px') > 0)
                            self.div.style.height = offsets.height;
                        else
                            self.div.style.height='auto';
                        }
                    }
                }
                left = abs.left + offsetNumbers.left;
                top = abs.top + offsetNumbers.top;
                break;
            case Popup.Placement.Fixed:
                self.div.style.position = 'fixed';
                left = self.x;
                top = self.y;
        }
        self.div.style.left = String(left) + 'px';
        self.div.style.top = String(top) + 'px';
    }
    document.documentElement.appendChild(this.div);
}
Popup.Placement = {Absolute: 'absolute', Relative: 'relative', Fixed: 'fixed'};