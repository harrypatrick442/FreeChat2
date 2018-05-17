function ThemePicker()
{
    var self = this;
    var settings = new Settings("#themes", function () {
        this.set("position");
        this.set("size");
        this.set("showing");
        this.set("theme");
        //this is a reset function for this particualr instance of this particular class.
    });
    var minWidth=200;
    var minHeight=100;
    var currentStyle = settings.get("theme");
    if (currentStyle)
    {
        Themes.restyle(currentStyle);
    }
    else
    {
        Themes.restyle('Dark');
    }
    this.type = 'Themes';
    this.taskBarInformation = {tooltip: 'Choose a custom style', icon: ('images/themes-icon.gif'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var divMain = document.createElement('div');
    this.div.style.position = "absolute";
    this.div.style.width = '200px';
    this.div.style.height = '400px';
    this.div.style.top = '100px';
    this.div.style.left = '1150px';
    divInner.style.position='absolute';
    divInner.style.border = '1px solid #66a3ff';
    divInner.style.backgroundColor = '#0099ff';
    divInner.style.padding = '0px 3px 3px 3px';
    divInner.style.borderRadius = "5px";
    divInner.style.overflow = 'hidden';
    var startPosition = settings.get("position");
    if (startPosition)
    {
        this.div.style.left = String(startPosition[0]) + 'px';
        this.div.style.top = String(startPosition[1]) + 'px';
    }
    var startSize = settings.get("size");
    if (startSize)
    {
        if(startSize[0]<minWidth)
            startSize[0]=minWidth;
        if(startSize[1]<minHeight)
            startSize[1]=minHeight;
        this.div.style.width = String(startSize[0]) + 'px';
        this.div.style.height = String(startSize[1]) + 'px';
    }  var startZIndex = settings.get("zIndex");
        if (startZIndex)
        {
            self.div.style.zIndex=String(startZIndex);
        }
    
    var menuBar = new MenuBar({options: [/*{name: 'Add', options: [{name: 'Text room', callback: function () {
     CreateRoom.show(createRoom, true, Room.Type.dynamic);
     }}, {name: 'Video room', callback: function () {
     CreateRoom.show(createRoom, true, Room.Type.videoDynamic);
     }}]}*/]}, {left: 0, top: -2});
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.height = "20px";
    divTab.style.cursor = 'move';
    divTab.style.padLeft = '10px';
    divName.style.float = 'left';
    divName.style.paddingLeft = '5px';
    divName.style.fontFamily = 'Arial';
    verticallyCenter(divName);
    setText(divName, "Themes");
    divMain.style.backgroundColor = '#555555';
    divMain.style.position = 'relative';
    divMain.style.float = 'left';
    divMain.style.height = 'calc(100% - 20px)';
    divMain.style.width = "100%";
    divMain.style.overflowY = 'auto';
    for (var i in Themes.themes)
    {
        var themeEntry = new ThemeEntry(i);
        divMain.appendChild(themeEntry.div);
    }
    function ThemeEntry(name)
    {
        var self = this;
        this.div = document.createElement('div');
        var divName = document.createElement('div');
        this.div.style.position = 'relative';
        this.div.style.height = '30px';
        this.div.style.width = '100%';
        this.div.style.backgroundColor = '#f0f0f0';
        this.div.style.cursor = 'pointer';
        this.div.style.float = 'left';
        this.div.style.border = '1px solid #4d0026';
        this.div.style.borderRadius = '5px';
        this.div.style.left = '-1px';
        this.div.style.marginLeft = '2px';
        this.div.style.marginTop = '1px';
        this.div.style.overflow = 'hidden';
        this.div.style.width = 'calc(100% - 6px)';
        this.div.style.paddingLeft = '2px';
        divName.style.float = 'left';
        divName.style.fontFamily = 'Arial';
        divName.style.height = '19px';
        divName.style.paddingLeft = '0px';
        divName.style.textOverflow = 'ellipsis';
        divName.style.overflow = 'hidden';
        divName.style.whiteSpace = 'nowrap';
        divName.style.width = '100%';
        divName.style.width = 'calc(100% - 28px)';
        verticallyCenter(divName);
        setText(divName, name);
        this.div.appendChild(divName);
        new Hover(this.div, function () {
            self.div.style.backgroundColor = '#fdfdfe';
        }, function () {
        });
        this.div.onmousedown = function ()
        {
            Themes.restyle(name);
            settings.set("theme", name);
        };
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
    this.div.appendChild(divInner);
    divInner.appendChild(divTab);
    divTab.appendChild(divName);
    divInner.appendChild(menuBar.div);
    divInner.appendChild(divMain);
    this.show = function ()
    {
        self.div.style.display = 'inline';
        settings.set("showing", true);
    };
    this.hide = function ()
    {
        self.div.style.display = 'none';
        settings.set("showing", false);
    };
    var showing = settings.get("showing");
    if (showing)
    {
        this.show();
    }
    else
    {
        if(showing==false)
        {
            this.hide();
        }
    }
    makeUnselectable(this.div);
    Themes.register({components: [
            {name: 'body', elements: [divMain]},
            {name: 'text', elements: [divName]}
        ],
        callback: function (theme) {

        }}, undefined);
    Window.style(self.div, divInner, divTab);
    Windows.add(this, false, divTab, divInner, new WindowInformation(true, true, 200, 100, 199, Windows.maxHeightPx, 0, 100, 0, Windows.maxYPx, true, false, true), 
         new WindowCallbacks(function(){
                settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
                settings.set("size", [200, self.div.offsetHeight]);
            }, function(){
        if(self.div.offsetLeft&&self.div.offsetTop)
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
         },
         function(){
        self.task.minimize();}, undefined, function(){
        self.task.minimize();}, function(zIndex){settings.set("zIndex", zIndex);}));
    TaskBar.add(this);
}