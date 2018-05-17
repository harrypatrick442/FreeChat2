String.prototype.insert = function (index, string) {
    if (index > 0)
        return this.substring(0, index) + string + this.substring(index, this.length);
    else
        return string + this;
};
function styleFromObject(element, style)
{
    for (var i in style)
    {
        var done = false;
        if (i.length > 2)
        {
            if (i.substring(0, 3) == '../')
            {
                var a = i.substring(3, i.length);
                element[a] = style[i];
                done = true;
            }
        }
        if (!done)
            element.style[i] = style[i];
    }
}
function removeChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
var equalValues = function (obj, obj2)
{
    return JSON.stringify(obj2) === JSON.stringify(obj);
};
function sortAlphabetically(array, property)
{
    if (property)
    {
        return array.sort(function (a, b) {
            var aString = a[property];
            var bString = b[property];
            if (aString > bString)
                return 1;
            if (aString < bString)
                return -1;
            return 0;
        });
    }
    return array.sort(function (a, b) {
        if (a > b)
            return 1;
        if (a < b)
            return -1;
        return 0;
    });
}
function setText(div, text)
{
    if (div.innerText)
    {
        div.innerText = text;
    } else
    {
        div.textContent = text;
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
function makeTextSelectable(element)
{
    setSelectable(element, "text");
}
function makeSelectable(element)
{
    setSelectable(element, "element");
}
function makeUnselectable(element) {
    setSelectable(element, "none");
}
function setSelectable(element, selectableString)
{
    if (element && element.type != 'text')//not text because this breaks internet explorer, stopping editing of text..
    {
        if (selectableString == "none")
        {
            if (element.nodeType == 1) {
                element.setAttribute("unselectable", "on");

            }
            if (element.onselectstart != undefined)// if IE
            {
                element.onselectstart = function () {
                    return false;
                };
            }
        }
        if (element.style)
        {
            var i = 0;
            while (i < makeUnselectable.strings.length)
            {
                var str = makeUnselectable.strings[i];
                if (element.style[str] != undefined)// if Firefox
                {
                    element.style[str] = selectableString;
                }
                i++;
            }
        }
        var child = element.firstChild;
        while (child) {
            setSelectable(child, selectableString);
            child = child.nextSibling;
        }
    }
}
function setWordEllipsis(e)
{
    e.style.display='inline-block';
    e.style.whiteSpace='nowrap';
    e.style.overflow='hidden';
    e.style.textOverflow='ellipsis';
}
//var div = document.createElement('div');
//div.style.height='1in';
//document.documentElement.appendChild(div);
var pxToMmRatio = document.documentElement.clientHeight / 120;
makeUnselectable.strings = ['webkitTouchCallout', 'webkitUserSelect', 'khtmlUserSelect', 'MozUserSelect', 'msUserSelect', 'userSelect', 'UserSelect'];