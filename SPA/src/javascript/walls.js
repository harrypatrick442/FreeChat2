function Walls(callbacks, userInformation)
{
    var self = this;
    var selfWalls = this;
    var settings = new Settings("#walls", function () {
        this.set("position");
        this.set("showing");
        this.set("size");
        //this is a reset function for this particualr instance of this particular class.
    });
    var minWidth=200;
    var minHeight=100;
    this.type = 'Walls';
    this.taskBarInformation = {tooltip: 'Lists all walls', icon: ('images/walls-icon.gif'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var divMain = document.createElement('div');
    this.div.style.position = "absolute";
    this.div.style.width = '200px';
    this.div.style.height = '300px';
    this.div.style.top = '300px';
    this.div.style.left = '10px';
    divInner.style.position='absolute';
    divInner.style.border = '1px solid #66a3ff';
    //divInner.style.border = '3px solid #0099ff';
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
    }
    var menuBar = new MenuBar({options: [{name: 'Add', options: [{name: 'Wall', callback: function () {
                            CreateWall.show(createWall, true, Wall.Type.dynamic);
                        }}]}]}, {left: 0, top: -2});
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.height = "20px";
    divTab.style.cursor = 'move';
    divTab.style.padLeft = '10px';
    divName.style.float = 'left';
    divName.style.paddingLeft = '5px';
    divName.style.fontFamily = 'Arial';
    verticallyCenter(divName);
    setText(divName, "Walls");
    divMain.style.backgroundColor = '#555555';
    divMain.style.position = 'relative';
    divMain.style.float = 'left';
    divMain.style.height = 'calc(100% - 41px)';
    divMain.style.width = "100%";
    divMain.style.overflowY = 'auto';
    divMain.style.paddingBottom = '1px';
    var mapIdToWallEntry = {};
    var arrayWallEntries = [];
    this.listWalls = function (walls)
    {
        var alreadyPresent = [];
        var i = 0;
        for (var i = walls.length - 1; i >= 0; i--)
        {
            var r = walls[i];
            if (r.id)
            {
                if (!walls[r.id])
                {
                    var wallEntry = new WallEntry(r);
                    var j = 0;
                    var inserted = false;
                    var lowerCaseName = wallEntry.info.name.toLowerCase();
                    while (j < arrayWallEntries.length)
                    {
                        var rEntry = arrayWallEntries[j];
                        if (rEntry.info.name.toLowerCase() > lowerCaseName)
                        {
                            mapIdToWallEntry[r.id] = wallEntry;
                            arrayWallEntries.splice(j, 0, wallEntry);
                            divMain.insertBefore(wallEntry.div, divMain.children[j]);
                            inserted = true;
                            break;
                        }
                        j++;
                    }
                    if (!inserted)
                    {
                        mapIdToWallEntry[r.id] = wallEntry;
                        arrayWallEntries.push(wallEntry);
                        divMain.appendChild(wallEntry.div);
                    }
                }
                alreadyPresent.push(r.id);
            }
        }
        i = 0;
        while (i < arrayWallEntries.length)
        {
            var wallInfo = arrayWallEntries[i].info;
            if (alreadyPresent.indexOf(wallInfo.id) < 0)
            {
                divMain.removeChild(mapIdToWallEntry[wallInfo.id].div);
                arrayWallEntries.splice(i, 1);
                delete mapIdToWallEntry[wallInfo.id];
            }
            i++;
        }
    };
    function createWall(name, password, type)
    {
        var jObject = {};
        jObject.type = 'create_wall';
        jObject.name = name;
        jObject.wall_type = type;
        if (password && password.length > 0)
        {
            jObject.has_password = true;
            jObject.password = password;
        }
        else
        {
            jObject.has_password = false;
        }
        callbacks.send(jObject);
    }
    function WallEntry(r)
    {
        var self = this;
        this.info = r;
        this.div = document.createElement('div');
        var divName = document.createElement('div');
        var divImg = document.createElement('div');
        var img = document.createElement('img');
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
        divImg.style.float = 'left';
        divImg.style.height = '28px';
        divImg.style.width = '28px';
        img.style.width = '100%';
        verticallyCenter(divName);
        verticallyCenter(divImg);
        verticallyCenter(img);
        setText(divName, r.name);
        this.div.appendChild(divName);
        this.div.appendChild(divImg);
        img.src = window.thePageUrl+'images/wall.png';
        divImg.appendChild(img);
        new Hover(this.div, function () {
            self.div.style.backgroundColor = '#fdfdfe';
        }, function () {
        });
        this.div.onmousedown = function ()
        {
            Windows.cancelBringToFront(selfWalls);
                showWall();
            function showWall()
            {
                var wall = Lobby.mapIdToWall[r.id];
                if (wall)
                {
                    wall.task.unminimize();
                }
                else
                {
                    Lobby.openWall(r);
                }
            }
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
        Windows.bringToFront(self);
        settings.set("showing", true);
    };
    this.hide = function ()
    {
        self.div.style.display = 'none';
        settings.set("showing", false);
    };
    var showing = settings.get("showing");
    if(showing)
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
    Themes.register({components:[
            {name:'body', elements:[divMain]},
            {name:'text', elements:[divName]}
        ],
    callback:function(theme){
        
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
        self.task.minimize();}));
    TaskBar.add(this);
}