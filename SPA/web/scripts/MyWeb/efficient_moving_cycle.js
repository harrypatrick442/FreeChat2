function EfficientMovingCycle(element)
{
    var self = this;
    var moveEvent;
    var upEvent;
    this.onmousedown = function () {
    };
    this.onmousemove = function () {
    };
    this.onmouseup = function () {
    };
    this.ontouchstart = function () {
    };
    this.ontouchmove = function () {
    };
    this.ontouchend = function () {
    };
    if (!isMobile)
    {
        element.addEventListener("mousedown", function (e) {
            if (!e)
                var e = window.event;
            try
            {
                if(self.onmousedown(e)==false)
                    return;
            }
            catch (ex)
            {
                console.log(ex);
            }
        if(moveEvent)
                document.documentElement.removeEventListener("mousemove", moveEvent);
            if(upEvent)
                document.documentElement.removeEventListener("mouseup", upEvent);
            moveEvent = function (e) {
                if (!e)
                    var e = window.event;
                try
                {
                    self.onmousemove(e);
                }
                catch (ex)
                {
                    console.log(ex);
                }
            };
            document.documentElement.addEventListener("mousemove", moveEvent);
            upEvent = function (e) {
                if (!e)
                    var e = window.event;
                try
                {
                    self.onmouseup(e);
                }
                catch (ex)
                {
                    console.log(ex);
                }
                document.documentElement.removeEventListener("mousemove", moveEvent);
                document.documentElement.removeEventListener("mouseup", upEvent);
            };
            document.documentElement.addEventListener("mouseup", upEvent);
        });
    }
    else
    {
        element.addEventListener("touchstart", function (e) {
            if (!e)
                var e = window.event;
            try
            {
                if(self.ontouchstart(e)==false)
                    return;
            }
            catch (ex)
            {
                console.log(ex);
            }
        if(moveEvent)
                document.documentElement.removeEventListener("mousemove", moveEvent);
            if(upEvent)
                document.documentElement.removeEventListener("mouseup", upEvent);
            moveEvent = function (e) {
                if (!e)
                    var e = window.event;
                try
                {
                    self.ontouchmove(e);
                }
                catch (ex)
                {
                    console.log(ex);
                }
                if (e.preventDefault)
                {
                    e.preventDefault();
                }
            };
            document.documentElement.addEventListener("touchmove", moveEvent);
            upEvent = function (e) {
                if (!e)
                    var e = window.event;
                try
                {
                    self.ontouchend(e);
                }
                catch (ex)
                {
                    console.log(ex);
                }
                document.documentElement.removeEventListener("touchmove", moveEvent);
                document.documentElement.removeEventListener("touchend", upEvent);
            };
            document.documentElement.addEventListener("touchend", upEvent);
            if (e.preventDefault)
            {
                e.preventDefault();
            }
        });
    } 
}
