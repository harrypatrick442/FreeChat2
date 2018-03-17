function Volume(parent, callback, percent)
{
    var self = this;
    var timer;
    this.div = document.createElement('div');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var buttonClose = document.createElement('button');
    var divInner = document.createElement('div');
    var volumeSlider = new VolumeSlider(function(p){setPercentageText(p);
        percent=p;
        callback(p);});
    this.div.style.position = 'absolute';
    this.div.style.height = 'auto';
    this.div.style.width = 'auto';
    this.div.style.top = '50%';
    this.div.style.left = '50%';
    this.div.style.marginLeft = '-86px';
    this.div.style.backgroundColor = '#001f4d';
    this.div.style.border = '1px solid #66a3ff';
    this.div.style.zIndex = '2000';
    this.div.style.padding = '6px';
    this.div.style.borderRadius = '5px';
    this.div.style.padding='0px 3px 3px 3px';
    this.div.style.border = '1px solid #66a3ff';
    this.div.style.display='none';
    //divInner.style.border = '3px solid #0099ff';
    this.div.style.backgroundColor = '#0099ff';
    divTab.style.width='auto';
    divTab.style.float='none';
    divTab.style.height='18px';
    divName.style.height = '100%';
    divName.style.float = 'left';
    divName.style.paddingLeft = '5px';
    divName.style.fontFamily = 'Arial';
    divName.style.fontSize = '14px';
    divInner.style.float='none';
    divInner.style.backgroundColor = '#555555';
    divInner.style.height='100%';
    divInner.style.width='auto';
    divInner.style.padding='6px';
    setButtonGenericStyle(buttonClose);
    setText(buttonClose, String.fromCharCode(10006));
    function setButtonGenericStyle(button)
    {
        button.style.float = 'right';
        button.style.border = '0px';
        button.style.backgroundColor = 'transparent';
        button.style.cursor = 'pointer';
        button.style.fontWeight = '900';
        button.style.fontSize = '14px';
        button.style.marginTop='-3px';
    }
    function setPercentageText(percent)
    {
        setText(divName, 'Volume: '+String(percent)+'%');
    }
    this.show=function()
    {
        self.div.style.display='block';
    timer = new Timer(function () {
            if (flashing) {
                styleFromObject(self.div, Themes.theme.components.frame);
                flashing = false;
            } else {
                styleFromObject(self.div, Themes.theme.components.frameFlashing);
                flashing = true;
            }
        }, 50, 6);
        volumeSlider.setVolume(percent);
        setPercentageText(percent);
    };
    this.hide=function()
    {
        self.div.style.display='none';
    };
    function addOnKeyDown(text)
    {
    text.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode == 13) {
            try
            {
            doCallback();
        }
        catch(ex){
            console.log(ex);
        }
        }
    };
    }
    new Hover(buttonClose, function () {
        buttonClose.style.color = '#ff0000';
    });
    buttonClose.onclick=function()
    {
        self.hide();
    };
    this.div.appendChild(divTab);
    divTab.appendChild(divName);
    divTab.appendChild(buttonClose);
    this.div.appendChild(divInner);
    var flashing = false;
    Themes.register({components:[
            {name:'body', elements:[divInner]},
            {name: 'frame', elements: [self.div]},
            {name: 'frameBorder', elements: [self.div]},
            {name:'text', elements:[divName, buttonClose]}
        ],
    callback:function(theme){
        
    }}, undefined);
    //var initialBackgroundColor = self.div.style.backgroundColor;
    parent.appendChild(self.div);
    divInner.appendChild(volumeSlider.div);
}