
function Emoticons(xmlString)
{
    var self = this;
    var settings = new Settings("#emoticons", function () {
        this.set("position");
        this.set("size");
        this.set("showing");
        //this is a reset function for this particualr instance of this particular class.
    });
    var minWidth=100;
    var minHeight=100;
    this.taskBarInformation = {tooltip: 'Click emoticons to insert into your current active room', icon: ('images/emoticons-icon.gif'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var table = document.createElement('table');
    var trTab = document.createElement('tr');
    var tdTab = document.createElement('td');
    var divTab = document.createElement('div');
    var trMain = document.createElement('tr');
    var tdMain = document.createElement('td');
    var divMain = document.createElement('div');
    var divTitle = document.createElement('div');
    var divEmoticons = document.createElement('div');
    this.div.style.position = 'absolute';
    this.div.style.height = '280px';
    this.div.style.width = '410px';
    this.div.style.left = '0px';
    this.div.style.top = '0px';
    makeUnselectable(this.div);
    divInner.style.position='absolute';
    divInner.style.border = '1px solid #66a3ff';
    divInner.style.backgroundColor = '#0099ff';
    divInner.style.padding = '0px 3px 3px 3px';
    divInner.style.borderRadius = "5px";
    divInner.style.overflow = 'hidden';
    table.style.position = 'relative';
    table.style.float = 'left';
    table.style.display = 'table';
    table.style.width = "100%";
    table.style.height = "100%";
    table.style.overflow = 'hidden';
    setTableSkinny(table);
    trTab.style.height = 'auto';
    trMain.style.height = '100%';
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.height = "20px";
    divTab.style.cursor = 'move';
    divTab.style.padLeft = '10px';
    divMain.style.float = 'left';
    divMain.style.height = '100%';
    divMain.style.width = '100%';
    divMain.style.backgroundColor = '#ffffff';
    divMain.style.overflow = 'auto';
    divEmoticons.style.width = '100%';
    divEmoticons.style.position = 'relative';
    divEmoticons.style.float = 'left';
    divEmoticons.style.height = '100px';
    divEmoticons.style.overflow = 'visible';
    divTitle.style.float = 'left';
    divTitle.style.paddingLeft = '5px';
    divTitle.style.fontFamily = 'Arial';
    verticallyCenter(divTitle);
    setText(divTitle, "Emoticons");
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
    
    function Emoticon(url, strings)
    {
        var self = this;
        var img = document.createElement('img');
        this.div = document.createElement('div');
        if(isMobile)
            img.style.height = String(6*pxToMmRatio)+'px';
        else
            img.style.height='30px';
        this.div.style.position = 'relative';
        this.div.style.float = 'left';
        this.div.style.height = 'auto';
        this.div.style.width = 'auto';
        this.div.style.cursor = 'pointer';
        new Hover(this.div, function () {
            self.div.style.backgroundColor = '#e6f2ff';
        });
        this.div.appendChild(img);
        this.emoticonString = strings[0].textContent;
        img.src = window.thePageUrl+url;
        img.onclick = function (e) {
            if (Windows.instances)
            {
                for (var i = Windows.instances.length - 2; i < Windows.instances.length; i++)
                {
                    var window = Windows.instances[i];
                    if (window.acceptsEmoticons)
                    {
                        window.insertEmoticon(strings[0]);
                        Windows.bringToFront(window);
                        return;
                    }
                }
            }
        };
    }
    function setTableSkinny(table)
    {
        table.cellSpacing = "0";
        table.cellPadding = "0";
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
    divInner.appendChild(table);
    table.appendChild(trTab);
    trTab.appendChild(tdTab);
    tdTab.appendChild(divTab);
    divTab.appendChild(divTitle);
    table.appendChild(trMain);
    trMain.appendChild(tdMain);
    tdMain.appendChild(divMain);
    divMain.appendChild(divEmoticons);

    var lookupTree = {};
        var xml = objectFromXML(xmlString, true);
        if (xml.messaging_emoticons)
        {
            if (xml.messaging_emoticons.folder)
            {
                doFolder(xml.messaging_emoticons.folder);
            }
            if (Configuration.allowRude&&xml.messaging_emoticons.folderXXX)
            {
                doFolder(xml.messaging_emoticons.folderXXX);
            }
        }
        var test = "<?xml version='1.0' encoding='UTF-8' ?>";
    function doFolder(folders)
    {
        if (folders.length)
        {
            for (var i = 0; i < folders.length; i++)
            {
                var pathPrefix = 'emoticons/' + folders[i].path + '/';
                doEmoticon(folders[i].emoticon, pathPrefix);
            }
        }
        else
        {
            var pathPrefix = 'emoticons/' + folders.path + '/';
            doEmoticon(folders.emoticon, pathPrefix);
        }
    }
    function doEmoticon(emoticons, pathPrefix)
    {
        if (emoticons.length)
        {
            for (var i = 0; i < emoticons.length; i++)
            {
                var url = pathPrefix + emoticons[i].path;
                doString(emoticons[i].string, url);

            }
        }
        else
        {
            var url = pathPrefix + emoticons.path;
            doString(emoticons.string, url);
        }
    }
    function doString(str, url)
    {
        if (typeof str === 'string')
        {
            mapCharacter(0, str, url, lookupTree);
            divEmoticons.appendChild(new Emoticon(url, [str]).div);
        }
        else
        {
            for (var i = 0; i < str.length; i++)
            {
                mapCharacter(0, str[i], url, lookupTree);
            }
            divEmoticons.appendChild(new Emoticon(url, str).div);

        }
    }
    function mapCharacter(index, string, url, map)
    {
        var map2 = [];
        if (index < string.length)
        {
            var indexN = index + 1;
            if (map[string.charAt(index)] != undefined && map[string.charAt(index)] != null)
            {
                map2 = map[string.charAt(index)];
            }
            else
            {
                map[string.charAt(index)] = map2;
            }
            mapCharacter(indexN, string, url, map2);
        }
        else
        {
            map.url = url;
        }
    }
    this.getLookupTree = function ()
    {
        return lookupTree;
    };
    var timerFlash;
    this.flash = function ()
    {
        var flashing = false;
        timerFlash = new Timer(function () {
            if (flashing) {
                styleFromObject(divInner, Themes.theme.components.frame);
                flashing = false;
            } else {
                styleFromObject(divInner, Themes.theme.components.frameFlashing);
                flashing = true;
            }
        }, 50, 6, false);
    };
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
    if(showing)
    {
        this.show();
    }
    this.unminimize = function ()
    {
        self.task.unminimize();
        self.flash();
    };
    Themes.register({components:[
            {name:'text', elements:[divTitle]}
        ],
    callback:function(theme){
        
    }}, undefined);
    Window.style(self.div, divInner, divTab);
    Windows.add(this, true, divTab, divInner, new WindowInformation(true, true,180, 100, 1200, 1200, 0, 100, 0, Windows.maxYPx, true,false, true), 
         new WindowCallbacks(function(){
                settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
                settings.set("size", [self.div.offsetWidth, self.div.offsetHeight]);
            }, function(){
        if(self.div.offsetLeft&&self.div.offsetTop)
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
         },
         
         function(){
        self.task.minimize();},
         undefined,
         function(){
        self.task.minimize();}, function(zIndex){settings.set("zIndex", zIndex);}));
    TaskBar.add(this);
}