
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function Menu(menuInformation, parentMenu)
{
    var selfMenu = this;
    var self = this;
    this.parentMenu = parentMenu;
    this.div = document.createElement('div');
    this.div.style.position = 'absolute';
    this.div.style.backgroundColor = '#dddddd';
    this.div.style.border = '1px solid #bbbbbb';
    this.div.style.width = 'auto';
    this.div.style.height = 'auto';
    this.div.style.zIndex = '2500';
    this.div.style.display = 'none';
    this.div.style.verticallyAlign='center';
    var callback;
    var callbackInformation;
    var items = [];
    var children = [];
    this.show = function (x, y, callbackIn, callbackInformationIn, itemConfiguration)
    {
        callback = callbackIn;
        callbackInformation = callbackInformationIn;
        Menu.current = [self];
        if (parentMenu)
        {
            self.div.style.zIndex = String(1 + parseInt(parentMenu.div.style.zIndex));
        }
        var parent = parentMenu;
        while (parent)
        {
            Menu.current.push(parent);
            parent = parent.parentMenu;
        }
        if (itemConfiguration)
        {
            configureItems(itemConfiguration);
        }
        self.div.style.left = String(x) + 'px';
        self.div.style.top = String(y) + 'px';
        self.div.style.display = 'block';
    };
    this.hideChildren = function ()
    {
        for (var i = 0; i < children.length; i++)
        {
            children[i].hide();
        }
    };
    this.hide = function ()
    {
        self.div.style.display = 'none';
        self.hideChildren();
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
    this.configureItems = configureItems;
    function Item(information, associatedChildMenu)
    {
        var self = this;
        this.div = document.createElement('div');
        this.div.style.position = 'relative';
        this.div.style.float = 'none';
        this.div.style.height = 'auto';
        this.div.style.cursor = 'pointer';
        this.divName = document.createElement('div');
        this.divName.style.position = 'relative';
        this.divName.style.float = 'left';
        this.divName.style.height = 'auto';
        this.divName.style.width = 'calc(100% - 4px)';
        this.divName.style.padding = '2px';
        this.divName.style.fontFamily = 'Arial';
        setText(this.divName, information.name);
        new Hover(this.divName, function () {
            self.divName.style.backgroundColor = '#eeeeee';
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
            selfMenu.hideChildren();
            if (associatedChildMenu)
            {
                var position = getAbsolute(self.divName);
                associatedChildMenu.show(position.left+self.div.offsetWidth, position.top);
            }
            else
            {
                Menu.hide();
            }
        };
        this.div.appendChild(this.divName);
        items.push(this);
    }
    function setTableSkinny(table)
    {
        table.cellSpacing = "0";
        table.cellPadding = "0";
    }
    for (var i = 0; i < menuInformation.options.length; i++)
    {
        var option = menuInformation.options[i];
        if (option.options)
        {
            var menu = new Menu(option, self);
            children.push(menu);
        }
        self.div.appendChild(new Item(option, menu).div);

    }
    document.body.appendChild(this.div);
}
Menu.hide=function()
{
        Menu.current[Menu.current.length-1].hide();
        Menu.current=undefined;
};
document.documentElement.addEventListener("mousedown", function (e) {
    if (!e)
        var e = window.event;
    if (Menu.current) {
        var i=0;
        while(true)
        {
            var p = getAbsolute(Menu.current[i].div);
            if ((p.left < e.pageX) && (Menu.current[i].div.offsetWidth + p.left >= e.pageX) && (p.top < e.pageY) && (p.top + Menu.current[i].div.offsetHeight >= e.pageY)) {
                break;
            }
            else
            {
              Menu.current[i].hide();
              Menu.current.splice(i, 1);
            }
        }
    }
});
