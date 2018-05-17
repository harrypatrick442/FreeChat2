function VolumeSlider(callback) {
    var self = this;
    this.div = document.createElement('div');
    var divInternal = document.createElement('div');
    var divSlider = document.createElement('div');
    var divInner = document.createElement('div');
    this.div.style.position = 'relative';
    this.div.style.width = '130px';
    this.div.style.height = '37px';
    this.div.style.paddingRight = '18px';
    divInner.style.position = 'absolute';
    divInner.style.width = '131px';
    divInner.style.height = '2px';
    divInner.style.borderRadius = '13px';
    divInner.style.border = '2px solid #aaaaaa';
    divInner.style.marginLeft = '6px';
    divInner.style.bottom = '6px';
    divInner.style.left = '4px';
    divInternal.style.position = 'relative';
    divInternal.style.left = '-8px';
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
    divSlider.style.zIndex = '10';
    this.div.appendChild(divInner);
    divInner.appendChild(divInternal);
    divInternal.appendChild(divSlider);
    var height = 6;
    var left = 8;
    var arrayDivs = [];
    for (var i = 0; i < 20; i++)
    {
        var div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.marginRight = '3px';
        div.style.backgroundColor = '#cccccc';
        div.style.height = String(height) + 'px';
        height++;
        div.style.width = '5px';
        div.style.left = String(left) + 'px';
        left = left + 7;
        div.style.bottom = '14px';
        self.div.appendChild(div);
        arrayDivs.push(div);
    }
    function setText(div, text)
    {
        if (div.innerText)
        {
            div.innerText = text;
        }
        else
        {
            div.textContent = text;
        }
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
    function verticallyCenter(element)
    {
        element.style.position = 'relative';
        element.style.top = '50%';
        element.style.transform = 'translateY(-50%)';
        element.style.msTransform = 'translateY(-50%)';
        element.style.webkitTransform = 'translateY(-50%)';
        element.style.oTransform = 'translateY(-50%)';
    }
    var state=0;
    var start;
    var efficientMovingCycle = new EfficientMovingCycle(divSlider);
    function onmousedown(pageX, pageY) {
        if (divSlider.style.display === "none")
        {
            return;
        }
        if (!e)
            var e = window.event;
        start = [divSlider.offsetLeft - pageX, divSlider.offsetTop - pageY];
        state = 1;
    };
    function onmousemove(pageX, pageY) {
        if (state == 1) {
            drag((start[0] + pageX), (start[1] + pageY));
        }
    };
    if(!isMobile)
    {
    efficientMovingCycle.onmousedown = function(e){ onmousedown(e.pageX, e.pageY);};
    efficientMovingCycle.onmousemove=function(e){onmousemove(e.pageX, e.pageY);};
    efficientMovingCycle.onmouseup=function(){
        state = 0;
    };
    }
    else
    {
    efficientMovingCycle.ontouchstart = function(e){ onmousedown(e.changedTouches[0].pageX, e.changedTouches[0].pageY);};
    efficientMovingCycle.ontouchmove = function(e){ onmousemove(e.changedTouches[0].pageX, e.changedTouches[0].pageY);};
    efficientMovingCycle.ontouchend=function(){
        state = 0;
    };
    }
    var left;
    var percent;
    this.getPercentage = function ()
    {
        return((left * 100) / divInternal.clientWidth) | 0;
    };
    var timerCallback;
    var drag = function (x, y)
    {
        var maxLeft = divInternal.clientWidth;
        left = x;
        if (left > maxLeft)
        {
            left = maxLeft;
        }
        else
        {
            if (left < 0)
            {
                left = 0;
            }
        }
        divSlider.style.left = String(left) + 'px';
        percent = self.getPercentage();
        var i = 0;
        while (i < (percent / 5) | 0)
        {
            arrayDivs[i].style.backgroundColor = '#cccccc';
            i++;
        }
        while (i < arrayDivs.length)
        {
            arrayDivs[i].style.backgroundColor = '#999999';
            i++;
        }
        if (!timerCallback)
        {
            timerCallback = new Timer(function () {

                if (callback)
                {
                    try
                    {
                        callback(percent);
                    }
                    catch (ex)
                    {
                        console.log(ex);
                    }
                }
            }, 300, 1);
        }
        else
        {
            timerCallback.reset();
        }
    };
    this.setVolume=function(percentage)
    {
        left=(percentage*divInternal.clientWidth)/100;
        drag(left , 0);
    };
}