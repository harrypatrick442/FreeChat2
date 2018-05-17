function MenuBar(menuInformation, menuOffsets)
{
    var self = this;
    var selfMenuBar = this;
    this.div = document.createElement('div');
    this.div.style.position = 'relative';
    this.div.style.width = '100%';
    this.div.style.height = 'auto';
    this.div.style.backgroundColor='#eeeeee';
    this.div.style.float='left';
    var items = [];
    var children = [];
    var callback;
    var callbackInformation;
    this.hideChildren = function ()
    {
        for (var i = 0; i < children.length; i++)
        {
            children[i].hide();
        }
    };
    this.hide=function()
    {
        self.hideChildren();
    };
    this.set = function (itemConfiguration, callbackIn, callbackInformationIn)
    {
        if (callbackIn)
        {
            callback = callbackIn;
        }
        if (callbackInformationIn)
        {
            callbackInformation = callbackInformationIn;
        }
        if(itemConfiguration)
        {
            configureItems(itemConfiguration);
        }
    };
    function configureItems(configuration)
    {
        for (var i = 0; i < configuration.length; i++)
        {
            var item = items[i];
            if (configuration[i].name)
            {
                setText(item.divName, configuration[i].name);
            }
            if (configuration[i].display != undefined)
            {
                if (configuration[i].display)
                {
                    item.div.style.display = 'block';
                }
                else
                {
                    item.div.style.display = 'none';
                }
            }
            if(configuration[i].children)
            {
                children[i].configureItems(configuration[i].children);
            }
        }
    }
    function Item(information, associatedChildMenu)
    {
        var self = this;
        this.div = document.createElement('div');
        this.div.style.position = 'relative';
        this.div.style.float = 'left';
        this.div.style.height = 'auto';
        this.div.style.cursor = 'pointer';
        this.div.style.margin='1px';
        this.div.style.border='1px solid #eeeeee';
        this.divName = document.createElement('div');
        this.divName.style.float='left';
        this.divName.style.position = 'relative';
        this.divName.style.height = 'auto';
        this.divName.style.width = 'auto';
        this.divName.style.margin = '1px';
        this.divName.style.fontFamily = 'Arial';
        this.divName.style.fontSize='12px';
        this.divName.style.fontWeight='bold';
        setText(this.divName, information.name);
        new Hover(this.div, function () {
            self.div.style.backgroundColor = 'rgba(26,209,255, 0.4)';
            self.div.style.border='1px solid #008fb3';
        }, function () {
        });
        this.div.onclick = function (e) {
            if (information.callback)//callback for individual item parsed in when menu created.
            {
                information.callback(callbackInformation, e);
            }
            if (callback)//general callback for all buttons.
            {
                callback(callbackInformation, e);
            }
            selfMenuBar.hideChildren();
            if (associatedChildMenu)
            {
                var position = getAbsolute(self.div);
                var left=position.left;
                var top = position.top+selfMenuBar.div.offsetHeight;
                if(menuOffsets)
                {
                    if(menuOffsets.top)
                    {
                        left+=menuOffsets.left;
                    }
                    if(menuOffsets)
                    {
                        top+=menuOffsets.top;
                    }
                }
                associatedChildMenu.show(left, top);
            }
        };
        this.div.appendChild(this.divName);
        items.push(this);
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
    for (var i = 0; i < menuInformation.options.length; i++)
    {
        var option = menuInformation.options[i];
        var menu=undefined;
        if (option.options&&option.options.length>0)
        {
            menu = new Menu(option, self);
            children.push(menu);
        }
        this.div.appendChild(new Item(option, menu).div);

    }
}