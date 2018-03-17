function EnterPassword(parent, callbackSubmit, callbackClose)
{
    var self = this;
    var timer;
    var callback;
    this.div = document.createElement('div');
    var divTab = document.createElement('div');
    var buttonClose = new Window.CloseButton(function(){
        callbackClose();});
    var divInner = document.createElement('div');
    var divPassword = document.createElement('div');
    var textPassword = document.createElement('input');
    var buttonEnter = document.createElement('button');
    var divError = document.createElement('div');
    var textError = document.createElement('textarea');
    this.div.style.position = 'absolute';
    this.div.style.height = 'auto';
    this.div.style.width = 'auto';
    this.div.style.top = '50%';
    this.div.style.left = '50%';
    this.div.style.marginLeft = '-100px';
    this.div.style.backgroundColor = '#001f4d';
    this.div.style.border = '1px solid #66a3ff';
    this.div.style.zIndex = '2000';
    this.div.style.padding = '6px';
    this.div.style.borderRadius = '5px';
    this.div.style.padding='0px 3px 3px 3px';
    this.div.style.border = '1px solid #66a3ff';
    //divInner.style.border = '3px solid #0099ff';
    this.div.style.backgroundColor = '#0099ff';
    divTab.style.width='auto';
    divTab.style.float='none';
    divTab.style.height='20px';
    divInner.style.float='none';
    divInner.style.backgroundColor = '#555555';
    divInner.style.height='100%';
    divInner.style.width='auto';
    divInner.style.padding='1px';
    divPassword.style.float='none';
    textPassword.placeholder = 'Password';
    function styleText(text)
    {
        text.type = 'text';
        text.style.position = 'relative';
        text.style.float = 'left';
        text.style.height = '100%';
        text.style.width = '180px';
        text.style.fontSize = '20px';
        text.style.fontFamily = 'Arial';
        text.style.height = '30px';
        text.style.boxSizing = 'border-box';
    }
    buttonEnter.style.height = '30px';
    buttonEnter.style.fontSize = '20px';
    buttonEnter.style.boxSizing = 'border-box';
    buttonEnter.style.float='none';
    buttonEnter.style.width='100%';
    buttonEnter.style.cursor='pointer';
    buttonEnter.style.cursor='pointer';
    divError.style.position = 'relative';
    divError.style.float = 'none';
    divError.style.width = '180px';
    divError.style.boxSizing = 'border-box';
    divError.style.backgroundColor = '#eeeeee';
    divError.style.fontFamily = 'Arial';
    divError.style.fontSize = '14px';
    divError.style.display='none';
    textError.style.position = 'relative';
    textError.style.width = '100%';
    textError.style.boxSizing = 'border-box';
    textError.style.backgroundColor = 'transparent';
    textError.style.border = '0px';
    textError.style.resize='none';
    textError.style.overflowY='hidden';
    textError.readOnly=true;
    setText(buttonEnter, "Enter");
    this.setError = function (error)
    {
        if (error)
        {
            divError.style.display = 'block';
            setText(textError, error);
        }
        else
        {
            divError.style.display = 'none';
        }
    };
    this.setCallback=function(callbackIn)
    {
        callback = callbackIn;
    };
    this.show=function(hasPassword, type)
    {
        self.type=type;
        self.div.style.display='block';
    timer = new Timer(function () {
        if (flashing) {
            self.div.style.backgroundColor = initialBackgroundColor;
            flashing = false;
        } else {
            self.div.style.backgroundColor = '#ccff00';
            flashing = true;
        }
    }, 60, 6);
    };
    this.hide=function()
    {
        self.div.style.display='none';
        textPassword.value="";
        divError.style.display='none';
    };
    buttonEnter.onclick = function ()
    {
        doCallback();
    };
    addOnKeyDown(textPassword);
    function doCallback()
    {
        callbackSubmit(textPassword.value);
    }
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
    this.div.appendChild(divTab);
    divTab.appendChild(buttonClose.button);
    this.div.appendChild(divInner);
    divInner.appendChild(divPassword);
    divPassword.appendChild(textPassword);
    divInner.appendChild(buttonEnter);
    divInner.appendChild(divError);
    divError.appendChild(textError);
    var flashing = false;
    var initialBackgroundColor = self.div.style.backgroundColor;
    parent.appendChild(self.div);
}