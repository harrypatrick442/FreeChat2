function Authenticate(callbackSignIn, callbackRegister, enableAge)
{
    var enablePassword = (callbackRegister != undefined);
    var self = this;
    var settings = new Settings("#username", function () {
        this.set("username");
        //this is a reset function for this particualr instance of this particular class.
    });
    var timer;
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divInputsSignIn = document.createElement('div');
    var divInputsRegister;
    //var divTextInputs = document.createElement('div');
    var textUsername = document.createElement('input');
    var textPasswordSignIn;
    var button = document.createElement('button');
    var divError = document.createElement('div');
    var textError = document.createElement('textarea');
    var spinner = new Spinner(1);
    spinner.hide();
    this.div.style.position = 'fixed';
    this.div.style.height = 'auto';
    this.div.style.width = '244px';
    this.div.style.top = 'calc(50% - 100px)';
    this.div.style.left = 'calc(50% - 128px)';
    this.div.style.backgroundColor = '#001f4d';
    this.div.style.border = '1px solid #66a3ff';
    this.div.style.zIndex = '3000000';
    this.div.style.borderRadius = '5px';
    this.div.style.padding = '6px';
    divInner.style.height = 'auto';
    divInner.style.width = 'calc(100% - 8px)';
    divInner.style.position = 'relative';
    divInner.style.float='left';
    divInputsSignIn.style.position = 'relative';
    divInputsSignIn.style.width = '244px';
    divInputsSignIn.style.height = 'auto';
    divInputsSignIn.style.float = 'left';


    //divTextInputs.style.position = 'relative';
    //divTextInputs.style.height = 'auto';
    //divTextInputs.style.width = '180px';
    //divTextInputs.style.float='left';
    
    
    
    if (enablePassword) {
        divInputsRegister = document.createElement('div');
        textPasswordSignIn = document.createElement('input');
        var textPasswordRegister = document.createElement('input');
        var textPasswordReenterRegister = document.createElement('input');
        var textEmailRegister = document.createElement('input');
        var textUsernameRegister = document.createElement('input');
        var birthday = new Birthday();
        var genderPicker = new GenderPicker();
        setLayoutStyle(genderPicker.div);
        setLayoutStyle(birthday.div);
        var buttonRegister = document.createElement('button');
        setLayoutStyle(buttonRegister);
        buttonRegister.style.marginBottom='2px';
        styleTextInputRegister(textEmailRegister, 'Email');
        styleTextInputRegister(textUsernameRegister, 'Username');
        styleTextInputRegister(textPasswordRegister, 'Password');
        styleTextInputRegister(textPasswordReenterRegister, 'Re-enter Password');
        textPasswordSignIn.onkeydown = detectEnterKey;
        textEmailRegister.onkeydown = detectEnterKey;
        textUsernameRegister.onkeydown = detectEnterKey;
        textPasswordRegister.onkeydown = detectEnterKey;
        textPasswordReenterRegister.onkeydown = detectEnterKey;
        textPasswordRegister.type = 'password';
        textPasswordReenterRegister.type = 'password';
        buttonRegister.style.width = '100%';
        buttonRegister.style.marginTop = '3px';
        buttonRegister.style.boxSizing = 'border-box';
        buttonRegister.className='btn btn-primary';
        setText(buttonRegister, 'Done');
        divInputsRegister.appendChild(genderPicker.div);
        divInputsRegister.appendChild(birthday.div);
        divInputsRegister.appendChild(buttonRegister);
        divInputsRegister.style.position = 'relative';
        divInputsRegister.style.width = '244px';
        divInputsRegister.style.height='auto';
        divInputsRegister.style.float = 'left';
        buttonRegister.onclick = sendRegister;
                function    sendRegister() {this.blur();
            if (textEmailRegister.value.length < 1)
            {
                setError("You must enter an email address!");
                return;
            }
            if (textUsernameRegister.value.length < 1)
            {
                setError("You must enter a username!");
                return;
            }
            if (textPasswordRegister.value.length < 1)
            {
                setError("You must enter a password!");
                return;
            }
            if (textPasswordReenterRegister.value.length < 1)
            {
                setError("You must re-enter your password!");
                return;
            }
            if (textPasswordRegister.value != textPasswordReenterRegister.value)
            {
                setError("The passwords entered do not match!");
                return;
            }
            showSpinner();
            var bd= birthday.getValue();
            if( !bd.year)
            {
                setError("You must enter a birth year!");
                return;
            }
            if(bd.month==undefined)
            {
                setError("You must enter a birth month!");
                return;
            }
            if(!bd.day)
            {
                setError("You must enter a birth day!");
                return;
            }
            var jObject = {email: textEmailRegister.value, username: textUsernameRegister.value, password: textPasswordRegister.value, gender:genderPicker.getValue(), birthday:bd};
            console.log('registering');
            callbackRegister(jObject);
        };
    }

    function styleTextInputSignIn(txt, placeholder)
    {
        setLayoutStyle(txt);
        txt.type = 'text';
        txt.placeholder = placeholder;
        divInputsSignIn.appendChild(txt);
    }
    function styleTextInputRegister(txt, placeholder)
    {
        setLayoutStyle(txt);
        txt.type = 'text';
        txt.placeholder=placeholder;
        divInputsRegister.appendChild(txt);
    }
    styleTextInputSignIn(textUsername, 'Username');
    if (enablePassword)
    {
        styleTextInputSignIn(textPasswordSignIn, 'Password');
        textPasswordSignIn.type = 'password';
    }
    button.style.height = '100%';
    button.style.position = 'relative';
    button.style.float = 'none';
    button.style.width='100%';
    button.style.marginTop='3px';
    button.style.marginBottom='2px';
    button.className='btn btn-primary';
    divError.style.position = 'relative';
    divError.style.float = 'left';
    divError.style.width = '100%';
    divError.style.backgroundColor = '#eeeeee';
    divError.style.fontFamily = 'Arial';
    divError.style.fontSize = '14px';
    divError.style.display = 'none';
    divError.style.marginTop = '4px';
    divError.style.boxSizing = 'border-box';
    textError.style.position = 'relative';
    textError.style.width = '100%';
    textError.style.boxSizing = 'border-box';
    textError.style.backgroundColor = 'transparent';
    textError.style.border = '0px';
    textError.style.resize = 'none';
    textError.style.overflowY = 'hidden';
    textError.style.float='left';
    textError.readOnly = true;
    setText(button, "Enter");
    function setError(error)
    {
        if (error)
        {
            hideSpinner();
            divError.style.display = 'inline';
            setText(textError, error);
        } else
        {
            divError.style.display = 'none';
        }
    }
    this.setError = setError;
    function showSpinner()
    {
        spinner.show();
        spinner.center();
        textUsername.disabled = true;
    }
    function hideSpinner()
    {
        spinner.hide();
        textUsername.disabled = false;
    }
    function sendSignIn() {
        this.blur();
        showSpinner();
        var jObject = {};
        if (enablePassword)
            jObject.password = textPasswordSignIn.value;
        jObject.username = textUsername.value;
        callbackSignIn(jObject);
    }
    button.onclick = sendSignIn;
    function detectEnterKey(evt) {
        evt = evt || window.event;
        if (evt.keyCode == 13)
        {
            (showingRegister?sendRegister:sendSignIn)();
        }
    };
    textUsername.onkeydown = detectEnterKey;
    textUsername.addEventListener('click', function ()
    {
        textUsername.focus();
    });var showingRegister=false;

    var tabPanel;
    if (enablePassword)
    {
        tabPanel = new TabPanel(['Sign In', 'Register'], true);
        tabPanel.onChangeTab = function (i) {
            setError('');
            switch (i)
            {
                case 1:
                    showingRegister=true;
                    tabPanel.div.style.height = 'auto';
                    break;
                default:
                    showingRegister=false;
                    tabPanel.div.style.height = 'auto';
                    break;
            }
        };
        this.div.appendChild(tabPanel.div);
        tabPanel.panels[0].div.appendChild(divInputsSignIn);
        tabPanel.panels[1].div.appendChild(divInputsRegister);
        tabPanel.panels[1].div.className='dsfdsfdsf';

        
        tabPanel.div.style.height = 'auto';
        tabPanel.div.style.position = 'relative';
    } else
    {
        this.div.appendChild(divInputsSignIn);
    }
    //divInputsSignIn.appendChild(divTextInputs);
    divInputsSignIn.appendChild(button);
    this.div.appendChild(divError);
    divError.appendChild(textError);
    this.div.appendChild(spinner.div);
    var flashing = false;
    var flashingCount = 0;
    var initialBackgroundColor = self.div.style.backgroundColor;
    timer = new Timer(function () {
        flashingCount++;
        if (flashing) {
            self.div.style.backgroundColor = initialBackgroundColor;
            flashing = false;
            if (flashingCount > 6)
            {
                timer.stop();
            }
        } else {
            self.div.style.backgroundColor = '#ccff00';
            flashing = true;
        }
    }, 60, -1);
    this.hide = function ()
    {
        self.div.style.display = 'none';
        settings.set("username", textUsername.value);
    };
    var username = settings.get("username");
    if (username)
    {
        textUsername.value = username;
    }
    Themes.register({components: [
            {name: 'body', elements: enablePassword?[tabPanel.div, divInner]:[divInner]}
        ],
        callback: function (theme) {

        }}, undefined);
    function setLayoutStyle(element)
    {
    element.style.width='100%';
    element.style.position='relative';
    element.style.float='left';
    element.style.marginTop='3px';
    element.style.boxSizing='border-box';
    }
}
var authenticate;
Authenticate.acquire = function (callback, enablePassword)
{
    if (!authenticate)
        authenticate = new Authenticate(callback, enablePassword);
    document.body.appendChild(authenticate.div);
};
Authenticate.hide = function ()
{
    if (authenticate)
    {
        authenticate.hide();
    }
};
Authenticate.error = function (message)
{
    if (authenticate)
    {
        authenticate.setError(message);
    }
};