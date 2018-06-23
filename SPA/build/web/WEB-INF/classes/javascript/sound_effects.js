function SoundEffects(userInformation)
{
    var self = this;
    var settings = new Settings("#sound_effects", function () {
        this.set("position");
        this.set("size");
        this.set("showing");
        this.set("volume_user");
        this.set("volume_notifications");
        //this is a reset function for this particualr instance of this particular class.
    });
    var minWidth=200;
    var minHeight=100;
    this.type = 'SoundEffects';
    this.taskBarInformation = {tooltip: 'Send sound effects to the active chat window!', icon: ('images/sound-effects-icon.gif'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var divMain = document.createElement('div');

    var audioUserSoundEffects = document.createElement("audio");
    audioUserSoundEffects.preload = "auto";
    var sourceUserSoundEffects = document.createElement('source');
    audioUserSoundEffects.appendChild(sourceUserSoundEffects);
    var audioNotifications = document.createElement("audio");
    audioNotifications.preload = "auto";
    var sourceNotifications = document.createElement('source');
    audioNotifications.appendChild(sourceNotifications);
    function playUserSoundEffect(url)
    {
        sourceUserSoundEffects.src = url;
        audioUserSoundEffects.load();
        audioUserSoundEffects.play();
    }
    var v = settings.get("volume_user");
    if (v==undefined||v==null)
    {
        v = 100;
    }
    var volumeUserSoundEffects = new Volume(divInner, function (percent) {
        audioUserSoundEffects.volume = (percent / 100);
        settings.set("volume_user", percent);
    }, v);
    audioUserSoundEffects.volume = (v / 100);
    v = settings.get("volume_notifications");
    if (v==undefined||v==null)
    {
        v = 100;
    }
    var volumeNotifications = new Volume(divInner, function (percent) {
        audioNotifications.volume = (percent / 100);
        settings.set("volume_notifications", percent);
    }, v);
    audioNotifications.volume = (v / 100);
    this.div.style.position = "absolute";
    this.div.style.width = '200px';
    this.div.style.height = '500px';
    this.div.style.top = '50px';
    this.div.style.left = '550px';
    divInner.style.position = 'absolute';
    divInner.style.border = '1px solid #66a3ff';
    //divInner.style.border = '3px solid #0099ff';
    divInner.style.backgroundColor = '#0099ff';
    divInner.style.padding = '0px 3px 3px 3px';
    divInner.style.borderRadius = "5px";
    divInner.style.overflow = 'hidden';
    var menuBar = new MenuBar({options: [{name: 'Volume', options: [{name: "notifications", callback: function () {
                            volumeNotifications.show();
                        }}, {name: "user sound effects", callback: function () {
                            volumeUserSoundEffects.show();
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
    setText(divName, "Sound effects");
    divMain.style.backgroundColor = '#555555';
    divMain.style.position = 'relative';
    divMain.style.float = 'left';
    divMain.style.height = 'calc(100% - 41px)';
    divMain.style.width = "100%";
    divMain.style.overflowY = 'auto';
    divMain.style.paddingBottom = '1px';
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
    
    
    SoundEffects.playUserSoundEffect = playUserSoundEffect;
    function playNotifications(url)
    {
        sourceNotifications.src = url;
        audioNotifications.load();
        audioNotifications.play();
    }
    SoundEffects.playNotifications = playNotifications;
    function SoundEffectEntry(url, name)
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
        this.div.onclick = function ()
        {
            if (Windows.instances)
            {
                for (var i = Windows.instances.length - 2; i < Windows.instances.length; i++)
                {
                    var window = Windows.instances[i];
                    if (window.acceptsEmoticons)
                    {
                        window.sendSoundEffect(url, name);
                        Windows.bringToFront(window);
                        break;
                    }
                }
            }
            playUserSoundEffect(url);
        };
    }
    httpGetAsynchronous("sounds/sound_effects.xml", function (r) {

        var xml = objectFromXML(r, true);
        if (xml.messaging_sound_effects)
        {
            if (xml.messaging_sound_effects.folder)
            {
                doFolder(xml.messaging_sound_effects.folder);
            }
        }
    });
    function doFolder(folders)
    {
        if (folders.length)
        {
            for (var i = 0; i < folders.length; i++)
            {
                var pathPrefix = 'sounds/' + folders[i].path + '/';
                doSoundEffect(folders[i].sound, pathPrefix);
            }
        }
        else
        {
            var pathPrefix = 'sounds/' + folders.path + '/';
            doSoundEffect(folders.sound, pathPrefix);
        }
    }
    function doSoundEffect(sounds, pathPrefix)
    {
        if (sounds.length)
        {
            for (var i = 0; i < sounds.length; i++)
            {
                var url = pathPrefix + sounds[i].path;
                divMain.appendChild(new SoundEffectEntry(url, sounds[i].name).div);

            }
        }
        else
        {
            var url = pathPrefix + sounds.path;
            divMain.appendChild(new SoundEffectEntry(url, sounds.name).div);
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
    function setTableSkinny(table)
    {
        table.cellSpacing = "0";
        table.cellPadding = "0";
    }
    this.div.appendChild(divInner);
    divInner.appendChild(divTab);
    divTab.appendChild(divName);
    divInner.appendChild(menuBar.div);
    divInner.appendChild(divMain);
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
        }, 50, 6);
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
    this.unminimize = function ()
    {
        self.task.unminimize();
        self.flash();
    };
    makeUnselectable(this.div);
    Themes.register({components: [
            {name: 'body', elements: [divMain]},
            {name: 'text', elements: [divName]}
        ],
        callback: function (theme) {

        }}, undefined);
    Window.style(self.div, divInner, divTab);
    
    var windowInformation = new WindowInformation(true, true, 200, 100, 199, Windows.maxHeightPx, 0, 100, 0, Windows.maxYPx, true, false, true);
var windowCallbacks=         new WindowCallbacks(function(){
                settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
                settings.set("size", [200, self.div.offsetHeight]);
            }, function(){
        if(self.div.offsetLeft&&self.div.offsetTop)
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
         },
         function(){
        self.task.minimize();}, undefined, function(){
        self.task.minimize();}, function(zIndex){settings.set("zIndex", zIndex);});
    var  params = {obj: this,
        minimized: false,
        divTab: divTab,
        divInner: divInner,
        windowInformation: windowInformation,
        callbacks: windowCallbacks};
    Windows.add( params);TaskBar.add(this);
}
SoundEffects.entered = function ()
{
    if (SoundEffects.playNotifications)
    {
        SoundEffects.playNotifications('sounds/notification/sounds-1068-the-calling.mp3');
    }
};
SoundEffects.message = function ()
{
    if (SoundEffects.playNotifications)
    {
        SoundEffects.playNotifications('sounds/notification/sounds-1036-put-down.mp3');
    }
};
SoundEffects.pm = function ()
{
    if (SoundEffects.playNotifications)
    {
        SoundEffects.playNotifications('sounds/notification/sounds-913-served.mp3');
    }
};