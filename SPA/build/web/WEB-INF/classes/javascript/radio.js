function Radio(xmlString)
{
    var self = this;
    var playing = true;
    var settings = new Settings("#radio", function () {
        this.set("position");
        this.set("showing");
        this.set("channel");
        this.set("volume");
        this.set("play");
        //this is a reset function for this particualr instance of this particular class.
    });
    var minWidth=390;
    var minHeight=80;
    this.type = 'Radio';
    this.taskBarInformation = {tooltip:'Radio', icon: ('images/Red-Radio-icon.png'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var divMain = document.createElement('div');
    var divControls = document.createElement('div');
    var divRun = document.createElement('div');
    var imgRun = document.createElement('img');
    var volumeSlider = new VolumeSlider(function (percent) {
        audio.volume=(percent/100);
        settings.set("volume", percent);
    });
    var selectChannel = document.createElement('select');
    this.div.style.position = "absolute";
    this.div.style.width = '390px';
    this.div.style.height = '80px';
    this.div.style.top = '300px';
    this.div.style.left = '360px';
    this.div.style.overflow='hidden';
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
        this.div.style.height = '80px';
    }  var startZIndex = settings.get("zIndex");
        if (startZIndex)
        {
            self.div.style.zIndex=String(startZIndex);
        }
    
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.height = "20px";
    divTab.style.cursor = 'move';
    divTab.style.padLeft = '10px';
    divName.style.float = 'left';
    divName.style.paddingLeft = '5px';
    divName.style.fontFamily = 'Arial';
    verticallyCenter(divName);
    setText(divName, "Radio");
    divMain.style.backgroundColor = '#555555';
    divMain.style.position = 'relative';
    divMain.style.float = 'left';
    divMain.style.height = 'calc(100% - 20px)';
    divMain.style.width = "100%";
    divMain.style.overflow = 'hidden';
    divControls.style.height = '44px';
    divControls.style.width = '100%';
    divControls.style.marginTop = '6px';
    divRun.style.cursor = 'pointer';
    divRun.style.height = '40px';
    divRun.style.float = 'left';
    volumeSlider.div.style.float = 'left';
    selectChannel.style.float = 'lect';
    selectChannel.style.margin = '2px';
    selectChannel.style.marginLeft = '20px';
    verticallyCenter(divRun);
    verticallyCenter(imgRun);
    verticallyCenter(volumeSlider.div);
    verticallyCenter(selectChannel);
    new HoverAndClick(divRun, function () {
        if (playing)
        {
            imgRun.src = window.thePageUrl+'images/button_stop_blue.png';
        }
        else
        {
            imgRun.src = window.thePageUrl+'images/button_play_blue.png';
        }
    }, function () {
        setButtonPlaying();
    }, function () {
        playing = !playing;
        setButtonPlaying();
        setPlaying();
    });
    var audio = document.createElement("audio");
    audio.preload = "auto";
    var source = document.createElement('source');
    audio.appendChild(source);
    function load()
    {
        source.src = selectChannel.value;
        audio.load();
        if(playing)
        {
            play();
        }
    }
    function play()
    {
        audio.play();
    }
    function stop()
    {
        audio.pause();
    }
    function setPlaying()
    {
        if (playing)
        {
            settings.set("playing", true);
            play();
        }
        else
        {
            settings.set("playing", false);
            stop();
        }
    }
    function setButtonPlaying()
    {
        if (playing)
        {
            imgRun.src = window.thePageUrl+'images/button_grey_stop.png';
        }
        else
        {
            imgRun.src = window.thePageUrl+'images/button_grey_play.png';
        }
    }
    selectChannel.onchange = function()
    {
        load();
        settings.set("channel", selectChannel.value);
    };
        var xml = objectFromXML(xmlString, true);
        if (xml.channels)
        {
            if (xml.channels.channel)
            {
                doChannel(xml.channels.channel);
                var channel = settings.get("channel");
                if(channel)
                {
                    selectChannel.value=channel;
                }
                var _playing=settings.get("playing");
                if(_playing!=undefined)
                {
                    if(!_playing)
                    {
                        playing=false;
                    }
                }
                setButtonPlaying();
                load();
                setPlaying();
            }
        }
    function doChannel(channel)
    {
        if (channel.length)
        {
            for (var i = 0; i < channel.length; i++)
            {
                var url = channel[i].url;
                var name = channel[i].name;
                var option = document.createElement('option');
                option.value = url;
                setText(option, name);
                selectChannel.appendChild(option);
            }
        }
        else
        {
            var url = channel.url;
            var name = channel.name;
            var option = document.createElement('option');
            option.value = url;
            setText(option, name);
            selectChannel.appendChild(option);
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
    divInner.appendChild(divMain);
    divMain.appendChild(divControls);
    divControls.appendChild(divRun);
    divRun.appendChild(imgRun);
    divControls.appendChild(volumeSlider.div);
    divControls.appendChild(selectChannel);
    this.show = function ()
    {
        self.div.style.display = 'inline';
        settings.set("showing", true);
    };
    var showing = settings.get("showing");
    if(showing)
    {
        this.show();
    }
    this.hide = function ()
    {
        self.div.style.display = 'none';
        settings.set("showing", false);
    };
    makeUnselectable(this.div);
    Themes.register({components:[
            {name:'body', elements:[divMain]},
            {name:'text', elements:[divName]}
        ],
    callback:function(theme){
        
    }}, undefined);
    Window.style(self.div, divInner, divTab);
    var windowInformation =new WindowInformation(false, true, 390, 80, 390, 80, 0, 100, 0, Windows.maxYPx, true, false, true);
         var windowCallbacks = new WindowCallbacks(function(){
                settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
                settings.set("size", [390, self.div.offsetHeight]);
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
    Windows.add( params);
    TaskBar.add(this);
    var volume =settings.get("volume");
    if(volume)
    {
        volumeSlider.setVolume(volume);
    }
}