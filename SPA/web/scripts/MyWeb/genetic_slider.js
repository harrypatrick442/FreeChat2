function GenericSlider(callbacks, min, max, nInstances, width, allowSlidersToOvertake, callbackWhenDone) {
    if(allowSlidersToOvertake==undefined)
        allowSlidersToOvertake = false ;
    var self = this;
    var selfGenericSlider = this;
    if (min == undefined)
        min = 0;
    if (max == undefined)
        max = 100;
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    this.div.style.position = 'relative';
    if (width)
        this.div.style.width = width;
    else
        this.div.style.width = '100%';
    this.div.style.height = '20px';
    this.div.style.position = "absolute";
    divInner.style.position = 'absolute';
    divInner.style.width = 'calc(100% - 18px)';
    divInner.style.height = '2px';
    divInner.style.borderRadius = '13px';
    divInner.style.border = '2px solid #aaaaaa';
    divInner.style.left = '7px';
    divInner.style.bottom = '6px';
    this.div.appendChild(divInner);
    function SliderInstance(callback, index) {
        var self = this;
        var divInternal = document.createElement('div');
        var divSlider = document.createElement('div');
        divInternal.style.position = 'absolute';
        divInternal.style.left = '-9px';
        divInternal.style.width = '100%';
        divInternal.style.height = '2px';
        makeUnselectable(divInternal);
        divSlider.style.position = 'absolute';
        divSlider.style.height = '18px';
        divSlider.style.width = '18px';
        divSlider.style.borderRadius = '9px';
        divSlider.style.right = '0px';
        divSlider.style.bottom = '-7px';
        divSlider.style.zIndex = '25';
        divSlider.style.backgroundColor = '#ffffff';
        divSlider.style.cursor = 'pointer';
        divSlider.style.zIndex = String(1+index);
        divInner.appendChild(divInternal);
        divInternal.appendChild(divSlider);
        var left = 8;
        function leftFromValue(value)
        {
            return (((value - min) * divInternal.clientWidth) / (max - min));
        }
        function makeUnselectable(node) {
            if (node.nodeType == 1) {
                node.setAttribute("unselectable", "on");
            }
            var child = node.firstChild;
            while (child) {
                makeUnselectable(child);
                child = child.nextSibling;
            }
        }
        var state = 0;
        var start;
        var efficientMovingCycle = new EfficientMovingCycle(divSlider);
        var getLeftSliderValue;
        var getRightSliderValue;
        this.setupOvertakeLimits = function (leftSlider, rightSlider) {
            if (!allowSlidersToOvertake) {
                if (leftSlider)
                    getLeftSliderValue = leftSlider.getValue;
                else
                    getLeftSliderValue = function () {
                        return min;
                    };
                if (rightSlider)
                    getRightSliderValue = rightSlider.getValue;
                else
                    getRightSliderValue = function () {
                        return max;
                    };
            }
        };
        var leftSliderLeft;
        var rightSliderLeft;
        function onmousedown(pageX, pageY) {
            if (divSlider.style.display === "none")
            {
                return;
            }
            if (!e)
                var e = window.event;
            start = [divSlider.offsetLeft - pageX, divSlider.offsetTop - pageY];
            state = 1;
            if (!allowSlidersToOvertake&&nInstances>1)
            {
                leftSliderLeft = leftFromValue(getLeftSliderValue());
                rightSliderLeft = leftFromValue(getRightSliderValue());
            }
        }
        ;
        function onmousemove(pageX, pageY) {
            if (state == 1) {
                drag((start[0] + pageX), (start[1] + pageY));
            }
        }
        ;
        if (!isMobile)
        {
            efficientMovingCycle.onmousedown = function (e) {
                onmousedown(e.pageX, e.pageY);
            };
            efficientMovingCycle.onmousemove = function (e) {
                onmousemove(e.pageX, e.pageY);
            };
            efficientMovingCycle.onmouseup = function () {
                state = 0;
            };
        } else
        {
            efficientMovingCycle.ontouchstart = function (e) {
                onmousedown(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
            };
            efficientMovingCycle.ontouchmove = function (e) {
                onmousemove(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
            };
            efficientMovingCycle.ontouchend = function () {
                state = 0;
            };
        }
        var left;
        var value = max;
        this.getValue = function ()
        {
            return(((left * (max - min)) / divInternal.clientWidth) + min) | 0;
        };
        var timerCallback;
        var theCallback = callback ? (callbackWhenDone ? function () {
            if (!timerCallback)
            {
                timerCallback = new Timer(function () {

                    try
                    {
                        callback(value);
                    } catch (ex)
                    {
                        console.log(ex);
                    }
                }, 300, 1);
            } else
            {
                timerCallback.reset();
            }
        }
        : function () {
            try
            {
                callback(value);
            } catch (ex)
            {
                console.log(ex);
            }
        }) : function () {};
        var drag = allowSlidersToOvertake||nInstances<2 ? function (x)
        {
            var maxLeft = divInternal.clientWidth;
            left = x;
            if (left > maxLeft)
            {
                left = maxLeft;
            } else
            {
                if (left < 0)
                {
                    left = 0;
                }
            }
            divSlider.style.left = String(left) + 'px';
            value = self.getValue();
            theCallback();
        } : function (x) {
            console.log('correct');
            console.log(leftSliderLeft);
            console.log(rightSliderLeft);
            var maxLeft = divInternal.clientWidth;
            left = x;
            if (left > maxLeft)
            {
                left = maxLeft;
            } else
            {
                if (left < 0)
                {
                    left = 0;
                }
            }
                    if(left<leftSliderLeft)
                    {
                        left=leftSliderLeft;
                    }
                    else
                    {
                        if(left>rightSliderLeft)
                        {
                            left=rightSliderLeft;
                        }
                    }
            divSlider.style.left = String(left) + 'px';
            value = self.getValue();
            theCallback();
        };
        this.setValue = function (value)
        {
            left = leftFromValue(value);
            drag(left, 0);
        };
    }
    var sliderInstances = [];
    if (nInstances > 1)
    {
        for (var i = 0; i < nInstances; i++)
        {
            var sliderInstance = new SliderInstance(callbacks[i],i);
            sliderInstances.push(sliderInstance);
        }
        for (var i = 0; i < nInstances; i++)
        {
            var sliderInstance = sliderInstances[i];
            sliderInstance.setupOvertakeLimits((i > 0) ? sliderInstances[i - 1] : undefined, (i < sliderInstances.length - 1) ? sliderInstances[i + 1] : undefined);
        }
    } else {
        var sliderInstance = new SliderInstance(callbacks);
        sliderInstances.push(sliderInstance);
    }

    this.getValue = function (nInstance)
    {
        if (!nInstance)
            nInstance = 0;
        var sliderInstance = sliderInstances[nInstance];
        return sliderInstance.getValue();
    };
    this.setValue = function (value, nInstance)
    {
        if (!nInstance)
            nInstance = 0;
        var sliderInstance = sliderInstances[nInstance];
        sliderInstance.setValue(value);
    };
}