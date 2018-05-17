function TickBoxes(entries, type, width, tickBoxWidth, titl, doubleBox)
{
    var self = this;
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    this.div.style.width = width;
    this.div.style.position = 'relative';
    this.div.style.float = 'left';
    this.div.style.height = 'auto';
    var divIntermediate = document.createElement('div');
    divIntermediate.style.position = 'relative';
    divIntermediate.style.float = 'left';
    divIntermediate.style.height = 'auto';
    if (width.indexOf('auto') > -1)
    {
        divIntermediate.style.margin = '3px';
        divIntermediate.style.width = 'auto';
        divInner.style.margin = '2px';
        divInner.style.width = 'auto';
    } else
    {
        divIntermediate.style.width = 'calc(100% - 6px)';
        divIntermediate.style.marginTop = '2px';
        divIntermediate.style.marginBottom = '2px';
        divIntermediate.style.left = '3px';
        divInner.style.marginTop = '2px';
        divInner.style.marginBottom = '2px';
        divInner.style.width = 'calc(100% - 4px)';
        divInner.style.left = '2px';
    }
    divInner.style.height = 'auto';
    divInner.style.position = 'relative';
    divInner.style.float = 'left';
    this.div.appendChild(divIntermediate);
    if (titl)
    {
        var divTitle = document.createElement('div');
        divTitle.style.width = '100%';
        divTitle.style.position = 'relative';
        divTitle.style.height = '18px';
        divTitle.style.left = '10px';
        divTitle.style.float = 'left';
        divTitle.style.fontSize = '12px';
        setWordEllipsis(divTitle);
        setText(divTitle, titl);
        divInner.appendChild(divTitle);
    }
    divIntermediate.appendChild(divInner);
    if (doubleBox)
    {
        var divLikeDislike = document.createElement('div');
        divLikeDislike.style.width = '100%';
        divLikeDislike.style.position = 'relative';
        divLikeDislike.style.height = '18px';
        divLikeDislike.style.left = '2px';
        divLikeDislike.style.float = 'left';
        divLikeDislike.style.fontSize = '8px';
        divLikeDislike.style.fontWeight = 'bold';
        setWordEllipsis(divLikeDislike);
        setText(divLikeDislike, "Like  Dislike");
        divInner.appendChild(divLikeDislike);
    }
    var tickBoxes = [];
    if (type == 'combination' && !doubleBox) {
        var tickBoxAll;
        tickBoxAll = new TickBox(function () {
            for (var i = 0; i < tickBoxes.length; i++)
            {
                tickBoxes[i].setTicked(tickBoxAll.ticked);
            }
        }, 'All', tickBoxWidth);
        tickBoxAll.value = -1;
        divInner.appendChild(tickBoxAll.div);
    }
    var callback = (type == 'single') && !doubleBox ? function (ticked, tickBoxChanged)
    {

        if (ticked)
        {
            for (var j = 0; j < tickBoxes.length; j++)
            {
                var tickBox = tickBoxes[j];
                if (tickBox != tickBoxChanged)
                {
                    tickBox.setTicked(false);
                }
            }
        } else
            tickBoxChanged.setTicked(true);
    } : (doubleBox ? [function () {}, function () {}] : function () {});
    for (var i = 0; i < entries.length; i++)
    {
        var entry = entries[i];
        var tickBox = new TickBox(callback, entry.txt, tickBoxWidth, doubleBox);
        tickBox.value = entry.value;
        tickBoxes.push(tickBox);
        divInner.appendChild(tickBox.div);
    }
    this.getValues = doubleBox ? function () {
        var jObjectLeft = [];
        var jObjectRight = [];
        for (var j = 0; j < tickBoxes.length; j++)
        {
            var tickBox = tickBoxes[j];
            if (tickBox.ticked)
                jObjectLeft.push(tickBox.value);
            else {
                if (tickBox.ticked != undefined)
                    jObjectRight.push(tickBox.value);
            }
        }
        return {left: jObjectLeft, right: jObjectRight};
    } : function ()
    {
        var jObject = [];
        for (var j = 0; j < tickBoxes.length; j++)
        {
            var tickBox = tickBoxes[j];
            if (tickBox.ticked)
                jObject.push(tickBox.value);
        }
        return jObject;
    };
    this.setValues = doubleBox ? function (jObject)
    {
        if (jObject)
            if (jObject.left&& jObject.right)
        {
                for (var j = 0; j < tickBoxes.length; j++)
                {
                    var tickBox = tickBoxes[j];
                    if (jObject.left.indexOf(tickBox.value) > -1)
                        tickBox.setTicked(true);
                    else
                    {
                        if (jObject.right.indexOf(tickBox.value) > -1)
                        {
                            tickBox.setTicked(false);
                        }
                    }
                }
        }
    } : function (jObject)
    {
        if (jObject)
        for (var j = 0; j < tickBoxes.length; j++)
        {
            var tickBox = tickBoxes[j];
            tickBox.setTicked(jObject.indexOf(tickBox.value) > -1);
        }
    };
    var themesObject = {components: [{name: 'body', elements: [divInner]}, {name: 'frame', elements: [divIntermediate]}
        ],
        callback: function (theme) {
        }
    };
    if (titl)
    {
        themesObject.components.push({name: 'text', elements: [divTitle]});
    }
    if (doubleBox)
    {
        themesObject.components.push({name: 'text', elements: [divLikeDislike]});
    }
    Themes.register(themesObject);
    this.close = function () {
        for (var i = 0; i < entries.length; i++)
        {
            var tickBox = tickBoxes[i];
            tickBox.close();
        }
        Themes.remove(themesObject);
    };
}
TickBoxes.Type = {Single: 'single', Combination: 'combination'};