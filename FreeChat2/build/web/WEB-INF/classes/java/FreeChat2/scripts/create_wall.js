function CreateWall()
{
    var self = this;
    var timer;
    var callback;
    this.div = document.createElement('div');
    var divName = document.createElement('div');
    var textName = document.createElement('input');
    var divPassword = document.createElement('div');
    var textPassword = document.createElement('input');
    var divButtons = document.createElement('div');
    var buttonCreate = document.createElement('button');
    var buttonCancel = document.createElement('button');
    var divError = document.createElement('div');
    var textError = document.createElement('textarea');
    this.div.style.position = 'fixed';
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
    divName.style.float='none';
    divPassword.style.float='none';
    divButtons.style.position = 'relative';
    divButtons.style.float = 'none';
    divButtons.style.width = '180px';
    divButtons.style.height = 'auto';
    textName.placeholder = 'Name';
    styleText(textName);
    textPassword.placeholder = 'Password(optional)';
    styleText(textPassword);
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
    
    
    
    buttonCreate.style.height = '30px';
    buttonCreate.style.width='50%';
    buttonCreate.style.fontSize = '20px';
    buttonCreate.style.boxSizing = 'border-box';
    buttonCreate.style.float='left';
    buttonCancel.style.height = '30px';
    buttonCancel.style.width='50%';
    buttonCancel.style.fontSize = '20px';
    buttonCancel.style.boxSizing = 'border-box';
    buttonCancel.style.float='right';
    buttonCancel.style.cursor='pointer';
    buttonCreate.style.cursor='pointer';
    divError.style.position = 'relative';
    divError.style.float = 'left';
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
    setText(buttonCreate, "Create");
    setText(buttonCancel, "Cancel");
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
        if(hasPassword)
        {
            divPassword.style.display='block';
        }
        else
        {
            divPassword.style.display='none';
        }
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
        textName.value="";
        textPassword.value="";
        divError.style.display='none';
    };
    buttonCreate.onclick = function ()
    {
        doCallback();
    };
    buttonCancel.onclick = function ()
    {
        self.hide();
    };
    addOnKeyDown(textName);
    addOnKeyDown(textPassword);
    function doCallback()
    {
        callback(textName.value, textPassword.value, self.type);
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
    textName.addEventListener('click',function()
    {
      textName.focus();  
    });
    textPassword.addEventListener('click',function()
    {
      textPassword.focus();  
    });
    this.div.appendChild(divName);
    divName.appendChild(textName);
    this.div.appendChild(divPassword);
    divPassword.appendChild(textPassword);
    this.div.appendChild(divButtons);
    divButtons.appendChild(buttonCreate);
    divButtons.appendChild(buttonCancel);
    this.div.appendChild(divError);
    divError.appendChild(textError);
    var flashing = false;
    var initialBackgroundColor = self.div.style.backgroundColor;
}
CreateRoom.show = function (callback, hasPassword, type)
{
    if(!CreateRoom.instance)
    {
    CreateRoom.instance = new CreateRoom();
    document.body.appendChild(CreateRoom.instance.div);
    }
    CreateRoom.instance.setCallback(callback);
    CreateRoom.instance.show(hasPassword, type);
};
CreateRoom.hide = function ()
{
    if(CreateRoom.instance)
    {
        CreateRoom.instance.hide();
    }
};
CreateRoom.error = function (message)
{
    if (CreateRoom.instance)
    {
        CreateRoom.instance.setError(message);
    }
};