function Contact()
{
    var self = this;
    var settings = new Settings("#Contact", function () {
        this.set("position");
        this.set("showing");
        this.set("size");
        //this is a reset function for this particualr instance of this particular class.
    });
    this.type = 'Contact';
    this.taskBarInformation = {tooltip: 'Contact the site creator', icon: ('images/email.png'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var divMain = document.createElement('div');
    var textContactEmail = document.createElement('input');
    var textContactName = document.createElement('input');
    var textContactPhone = document.createElement('input');
    var textContactSubject = document.createElement('input');
    var textareaContactMessage = document.createElement('textarea');
    var buttonSend = document.createElement('button');
    var imgSendSuccessful = document.createElement('img');
    imgSendSuccessful.src=window.thePageUrl+'images/tick.png';
    imgSendSuccessful.style.height='19px';
    imgSendSuccessful.style.float='right';
    imgSendSuccessful.style.position='relative';
    imgSendSuccessful.style.top='-1px';
    imgSendSuccessful.style.display='none';
    buttonSend.style.overflow='hidden';
    buttonSend.style.height='20px';
    
    function setLayoutStyle(element, placeholder)
    {
    element.style.width='100%';
    element.style.position='relative';
    element.style.float='left';
    element.placeholder=placeholder;
    element.style.marginTop='3px';
    }
    this.div.style.position = "absolute";
    this.div.style.width = '300px';
    this.div.style.height = '300px';
    this.div.style.top = '300px';
    this.div.style.left = '220px';
    this.div.style.overflowY='hidden';
    divInner.style.position = 'absolute';
    divInner.style.border = '1px solid #66a3ff';
    //divInner.style.border = '3px solid #0099ff';
    divInner.style.backgroundColor = '#0099ff';
    divInner.style.padding = '0px 3px 3px 3px';
    divInner.style.borderRadius = "5px";
    divInner.style.overflow = 'hidden';
    divTab.style.height = "20px";
    divMain.style.width = "100%";
    divMain.style.height = "calc(100% - 20px)";
    divMain.style.backgroundColor = '#555555';
    divMain.style.overflow='hidden';
    setLayoutStyle(textContactEmail, 'Email');
    setLayoutStyle(textContactName, 'Name');
    setLayoutStyle(textContactPhone, 'Phone');
    setLayoutStyle(textContactSubject, 'Subject');
    setLayoutStyle(textareaContactMessage, 'Message');
    setLayoutStyle(buttonSend);
    buttonSend.style.cursor='pointer';
    setText(buttonSend,'Submit');
    textareaContactMessage.style.height='calc(100% - 125px)';
    this.div.style.display = 'none';
    setText(divName, "Contact site creator/owner");
    var startPosition = settings.get("position");
    if (startPosition)
    {
        this.div.style.left = String(startPosition[0]) + 'px';
        this.div.style.top = String(startPosition[1]) + 'px';
    }
    //var startSize = settings.get("size");
    //if (startSize)
    //{
    //    this.div.style.width = String(startSize[0]) + 'px';
    //    this.div.style.height = String(startSize[1]) + 'px';
    //}
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.cursor = 'move';
    divTab.style.padLeft = '10px';
    divTab.className = 'div-room-class';
    divName.style.float = 'left';
    divName.style.paddingLeft = '5px';
    divName.style.fontFamily = 'Arial';
    divName.style.fontSize = '12px';
    verticallyCenter(divName);
    divMain.style.position = 'relative';
    divMain.style.float = 'left';
    divMain.style.overflowY='hidden';
    var spinner = new Spinner();
    spinner.div.style.bottom='40px';
    spinner.div.style.left='calc(50% - 27px)';
    spinner.hide();
    function verticallyCenter(element)
    {
        element.style.position = 'relative';
        element.style.top = '50%';
        element.style.transform = 'translateY(-50%)';
        element.style.msTransform = 'translateY(-50%)';
        element.style.webkitTransform = 'translateY(-50%)';
        element.style.oTransform = 'translateY(-50%)';
    }
    function setButtonGenericStyle(button)
    {
        button.style.float = 'right';
        button.style.border = '0px';
        button.style.backgroundColor = 'transparent';
        button.style.cursor = 'pointer';
        button.style.fontWeight = '900';
        button.style.fontSize = '14px';
    }
    this.div.appendChild(divInner);
    divInner.appendChild(divTab);
    divTab.appendChild(divName);
    divInner.appendChild(divMain);
    divMain.appendChild(textContactEmail);
    divMain.appendChild(textContactName);
    divMain.appendChild(textContactPhone);
    divMain.appendChild(textContactSubject);
    divMain.appendChild(textareaContactMessage);
    divMain.appendChild(buttonSend);
    buttonSend.appendChild(imgSendSuccessful);
    divMain.appendChild(spinner.div);
    var optionPane;
    function setErrorMessage(message)
    {
        if(!optionPane)
        {
            optionPane = new OptionPane(document.documentElement);
        }
        optionPane.show([['Ok', function () {
                    }]], message, function () {
            });
    }
    function setSent()
    {
        imgSendSuccessful.style.display='inline';
        new Timer(function(){self.task.minimize();}, 1200, 1, false);
    }
buttonSend.onclick=function()
{
    var jObject={};
    jObject.email=textContactEmail.value;
    jObject.name=textContactName.value;
    jObject.phone=textContactPhone.value;
    jObject.subject=textContactSubject.value;
    jObject.message=textareaContactMessage.value;
    var str = btoa(JSON.stringify(jObject));
    spinner.show();
    httpPostAsynchronous(window.thePageUrl+'ServletContact', function( reply ){
        spinner.hide();
        var jObjectReply = JSON.parse(atob(reply));
        if(jObjectReply.success)
        {
            setSent();
        }
        else {
            setErrorMessage(jObjectReply.message);
        }
    }, str);
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
        }, 50, 6);
    };
    this.show = function ()
    {
        self.div.style.display = 'inline';
        settings.set("showing", true);
        self.flash();
    };
    this.hide = function ()
    {
        self.div.style.display = 'none';
        settings.set("showing", false);
    };
    var showing = settings.get("showing");
    if (showing)
    {
        //this.show();
    } else
    {
        this.hide();
    }
    

        Themes.register({components: [
                {name: 'body', elements: [divMain]},
                {name: 'text', elements: [divName]}
            ],
            callback: function (theme) {

            }}, undefined);
    Window.style(self.div, divInner, divTab);
    Windows.add(this, true, divTab, divInner, new WindowInformation(true, true,200, 150, 400, 400, 0, 100, 0, Windows.maxYPx, true,false, true), 
         new WindowCallbacks(function(){
                    settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
                    settings.set("size", [200, self.div.offsetHeight]);
            }, function(){
            if (self.div.offsetLeft && self.div.offsetTop)
                settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
         },
    function(){
        self.task.minimize();}, undefined,
    function(){
        self.task.minimize();},
    function(zIndex){settings.set("zIndex", zIndex);}));
        TaskBar.add(this);
    makeUnselectable(this.div);
}
