function WebcamSettings(userInformation)
{
    var self = this;
    this.type = 'Rooms';
    var settings = new Settings("#webcam_settings", function () {
        this.set("position");
        this.set("showing");
        //this is a reset function for this particualr instance of this particular class.
    });
    this.taskBarInformation = {tooltip:'Webcam settings',icon: ('images/webcam-settings-icon.gif'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var table = document.createElement('table');
    var trTab = document.createElement('tr');
    var tdTab = document.createElement('td');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var trMain = document.createElement('tr');
    var tdMain = document.createElement('td');
    var divMain = document.createElement('div');
    var divPublicName = document.createElement('div');
    this.div.style.position = "absolute";
    this.div.style.width = '200px';
    this.div.style.height = '50px';
    this.div.style.top = String(250) + 'px';
    this.div.style.left = '1000px';
    this.div.style.display='none';
    divInner.style.position='relative';
    divInner.style.border = '1px solid #66a3ff';
    //divInner.style.border = '3px solid #0099ff';
    divInner.style.backgroundColor='#0099ff';
    divInner.style.padding='0px 3px 3px 3px';
    divInner.style.borderRadius = "5px";
    divInner.style.overflow = 'hidden';
    table.style.overflow = 'hidden';
    table.style.width='100%';
    table.style.height='100%';
    setTableSkinny(table);
    trTab.style.height = 'auto';
    trMain.style.height = "100%";
    tdMain.style.width = '100%';
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.height = "20px";
    divTab.style.cursor = 'move';
    divTab.style.padLeft = '10px';
    divName.style.float = 'left';
    divName.style.paddingLeft = '5px';
    divName.style.fontFamily = 'Arial';
    verticallyCenter(divName);
    setText(divName, "Webcam Settings");
    divMain.style.backgroundColor = '#555555';
    divMain.style.position = 'relative';
    divMain.style.float = 'left';
    divMain.style.height = '100%';
    divMain.style.width = "100%";
    divMain.style.overflow = 'hidden';
    divPublicName.style.float='left';
    divPublicName.style.margin='3px';
    divPublicName.style.fontFamily='Arial';
    setText(divPublicName, "Public Feed:");
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
    var sliderSwitchPublic = new SliderSwitch(function(bool){ Videos.showMe(bool);});
    sliderSwitchPublic.div.style.float='right';
    sliderSwitchPublic.div.style.margin='3px';
    this.div.appendChild(divInner);
    divInner.appendChild(table);
    table.appendChild(trTab);
    trTab.appendChild(tdTab);
    tdTab.appendChild(divTab);
    divTab.appendChild(divName);
    table.appendChild(trMain);
    trMain.appendChild(tdMain);
    tdMain.appendChild(divMain);
    divMain.appendChild(divPublicName);
    divMain.appendChild(sliderSwitchPublic.div);
    var windowInformation = new WindowInformation(true, true, 200, 50, 250, 50, 0, 100, 0, Windows.maxYPx, true, false, true);
    var windowCallbacks=         new WindowCallbacks(function(){ 
            }, function(){
        if(self.div.offsetLeft&&self.div.offsetTop)
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
         },
            function(){
        self.task.minimize();}, undefined,
            function(){
        self.task.minimize();}, function(zIndex){settings.set("zIndex", zIndex);});
    var  params = {obj: this,
        minimized: false,
        divTab: divTab,
        divInner: divInner,
        windowInformation: windowInformation,
        callbacks: windowCallbacks};
    Windows.add( params);
    
    
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
        self.flash();
        Windows.bringToFront(self);
        settings.set("showing", true);
    };
    var showing = settings.get("showing");
    if(showing)
    {
        //this.show();
    }
    this.hide = function ()
    {
        self.div.style.display = 'none';
        settings.set("showing", false);
    };
    makeUnselectable(this.div);
    Themes.register({components:[
            {name:'body', elements:[divMain]},
            {name:'text', elements:[divName]},
            {name:'text_color', elements:[divPublicName]}
        ],
    callback:function(theme){
        
    }}, undefined);
    Window.style(self.div, divInner, divTab);
    TaskBar.add(this);
}