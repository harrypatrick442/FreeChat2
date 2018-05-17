function SliderSwitch(callback) {
    var maxLeft = 43;
    var self = this;
    this.div = document.createElement('div');
    var divOff = document.createElement('div');
    var divOffText = document.createElement('div');
    var divOn = document.createElement('div');
    var divOnText = document.createElement('div');
    var divSlider = document.createElement('div');
    var imgSlider = document.createElement('img');
    this.div.style.position = 'relative';
    this.div.style.height = '16px';
    this.div.style.width = '60px';
    this.div.style.borderRadius = '13px';
    this.div.style.border = '2px solid #aaaaaa';
    divOff.style.right = '0px';
    divOff.style.backgroundColor = '#660022';
    setStyleState(divOff);
    divOffText.style.width = '100%';
    divOffText.style.height = '14px';
    makeUnselectable(divOffText);
    verticallyCenter(divOffText);
    divOn.style.left = '0px';
    divOn.style.backgroundColor = '#00e600';
    setStyleState(divOn);
    divOnText.style.width = '100%';
    divOnText.style.height = '14px';
    makeUnselectable(divOnText);
    verticallyCenter(divOnText);
    divSlider.style.position = 'absolute';
    divSlider.style.height = '18px';
    divSlider.style.width = '18px';
    divSlider.style.borderRadius = '9px';
    divSlider.style.right = '0px';
    divSlider.style.top = '-1px';
    divSlider.style.zIndex = '25';
    divSlider.style.backgroundColor = '#ffffff';
    divSlider.style.cursor = 'pointer';
    divSlider.zIndex = '10';
    this.div.appendChild(divOff);
    divOff.appendChild(divOffText);
    this.div.appendChild(divOn);
    divOn.appendChild(divOnText);
    this.div.appendChild(divSlider);
    divSlider.appendChild(imgSlider);
    setText(divOffText, "Off");
    setText(divOnText, "On");
    function setStyleState(div)
    {
        div.style.position = 'absolute';
        div.style.height = '100%';
        div.style.width = '100%';
        div.style.textAlign = 'center';
        div.style.fontFamily = 'Arial';
        div.style.fontSize = '12px';
        div.style.borderRadius = '11px';
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
    var state;
    var start;
    divSlider.onmousedown = function (e) {
        if (divSlider.style.display === "none")
        {
            return;
        }
        if (!e)
            var e = window.event;
        start = [divSlider.offsetLeft - e.pageX, divSlider.offsetTop - e.pageY];
        state = 1;
    };
    document.documentElement.addEventListener("mousemove", function (e) {
        if (state == 1) {
            drag((start[0] + e.pageX), (start[1] + e.pageY));
        }
    }
    );
    drag = function (x, y)
    {

        var left = x;
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
        if (divSlider.offsetLeft > (maxLeft / 2))
        {
            showOn(true);
        }
        else
        {
            showOn(false);
        }
    };
    document.documentElement.addEventListener("mouseup", function () {
        if (state == 1)
        {
            try
            {
            if (divSlider.offsetLeft > (maxLeft / 2))
            {
                on();
            }
            else
            {
                off();
            }}
        catch(ex)
        {
            console.log(ex);
        }
        }
        state = 0;
    });
    function showOn(bool)
    {
        if (bool)
        {
            divOn.style.display = 'inline';
            divOff.style.display = 'none';
        }
        else
        {
            divOn.style.display = 'none';
            divOff.style.display = 'inline';
        }
    }
    function on()
    {
        divSlider.style.left = maxLeft + 'px';
        showOn(true);
        callback(true);
    }
    function off()
    {
        divSlider.style.left = '0px';
        showOn(false);
        callback(false);
    }
}