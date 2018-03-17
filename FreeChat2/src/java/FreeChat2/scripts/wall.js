function Wall(userInformation, wallInfo, endpoint, callbacksImageUploader, callbacksImageUploaderProfilePicture)
{
    var dataConnectionsHandler= new DataConnectionsHandler(wallInfo, userInformation, {
        send:function(jObject){websocket.send(jObject);}
        //,addWallItem:function(wallItem){}
    });
    var self = this;
    var settings = new Settings(wallInfo.name, function () {
        this.set("position");
        this.set("size");
        //this is a reset function for this particualr instance of this particular class.
    });
    var minWidth=292;
    var minHeight=240;
    var createWallItem = new CreateWallItem();
    this.acceptsEmoticons = true;
    this.type = wallInfo.type;
    this.taskBarInformation = {tooltip: 'A wall you have open!', icon: ('images/wall-icon.gif'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}, attentionStyle: {backgroundColor: 'rgba(255,80,80,0.5)'}};
    this.div = document.createElement('div');
    var enterPassword;
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var divMain = document.createElement('div');
    var buttonClose = document.createElement('button');
    var buttonMinimize = document.createElement('button');
    var buttonMaximize = document.createElement('button');
    var divProfilePicture= document.createElement('div');
    var imgProfilePicture= document.createElement('img');
    var divUploadImage= document.createElement('div');
    var imgUploadImage= document.createElement('img');
    var divUploadFile = document.createElement('div');
    var imgUploadFile = document.createElement('img');
    var divControls = document.createElement('div');
    var themesObject;
    var divUsers = document.createElement('div');
    var imgUsers = document.createElement('img');
    var divFeed = document.createElement('div');
    var users = new Users(false, "users", userInformation, function (username) {}, showImageUploaderProfilePicture);
    setText(buttonMinimize, String.fromCharCode(10134));
    setText(buttonMaximize, String.fromCharCode(10064));
    setText(buttonClose, String.fromCharCode(10006));
    this.div.style.position = "absolute";
    this.div.style.width = '700px';
    this.div.style.height = '500px';
    this.div.style.left='430px';
    this.div.style.top='80px';
    if(wallInfo.name!='Main')
    {
        var startPosition = settings.get("position");
        if (!startPosition)
        {
            startPosition = Window.getStartPosition();
        }
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
    divInner.style.position = 'absolute';
    divInner.style.border = '1px solid #66a3ff';
    divInner.style.backgroundColor = '#0099ff';
    divInner.style.padding = '0px 3px 3px 3px';
    divInner.style.borderRadius = "5px";
    divInner.style.overflow = 'hidden';
    divMain.style.width = 'calc(100% - 150px)';
    divMain.style.height = 'calc(100% - 24px)';
    divMain.style.padding = '2px';
    divMain.style.marginRight = '2px';
    users.div.style.float = 'left';
    users.div.style.width = '150px';
    users.div.style.height = 'calc(100% - 20px)';
    divFeed.style.height = 'calc(100% - 20px)';
    divFeed.style.marginBottom = '2px';
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.height = "20px";
    divTab.style.cursor = 'move';
    divMain.style.backgroundColor = '#555555';
    divMain.style.float = 'left';
    divName.style.float = 'left';
    divName.style.paddingLeft = '5px';
    divName.style.fontFamily = 'Arial';
    verticallyCenter(divName);
    setText(divName, wallInfo.name+" Wall");
    buttonClose.className = 'button-wall-close';
    new Hover(buttonClose, function () {
        buttonClose.style.color = '#ff0000';
    });
    buttonMinimize.className = 'button-wall-minimize';
    new Hover(buttonMinimize, function () {
        buttonMinimize.style.color = '#ff0000';
    });
    buttonMaximize.className = 'button-wall-maximize';
    new Hover(buttonMaximize, function () {
        buttonMaximize.style.color = '#ff0000';
    });
    buttonClose.onclick = function ()
    {
        close();
    };
    function close()
    {
        websocket.close();
        self.task.remove(self);
        Windows.remove(self);
        delete Lobby.mapIdToWall[wallInfo.id];
        Themes.remove(themesObject);
        users.dispose();
    }
    buttonMinimize.onclick = function ()
    {
        self.task.minimize();
    };
    buttonMaximize.onclick = function ()
    {
        self.task.maximize();
    };
    
    divControls.style.height = '20px';
    divControls.style.width = '100%';
    divControls.style.backgroundColor = '#ccb3ff';
    divControls.style.border = '0px solid #333333';
    divControls.style.borderBottom = '0px';
    divFeed.style.width = '100%';
    divFeed.style.backgroundColor = '#e6ffff';
    divFeed.style.overflowY = 'scroll';
    divFeed.style.backgroundColor = '#AAAAAC';
    setupControlButton(divUsers, imgUsers, 'images/users.gif', 'images/users_highlighted.gif', function () {
        if (showingUsers) {
            hideUsers();
        } else {
            showUsers();
        }
    });
        setupControlButton(divProfilePicture, imgProfilePicture, 'images/profile-picture-icon.gif', 'images/profile-picture-icon-blue.gif', showImageUploaderProfilePicture);
        setupControlButton(divUploadImage, imgUploadImage, 'images/upload-image-icon.gif', 'images/upload-image-icon-blue.gif', showImageUploader);
        setupControlButton(divUploadFile, imgUploadFile, 'images/upload-file-icon.gif', 'images/upload-file-icon-blue.gif', function(){createWallItem.show();});
        
        
        function setupControlButton(div, img, srcImg, srcImgHover, clickCallback)
        {
            div.style.position = 'relative';
            div.style.height = '16px';
            div.style.float = 'right';
            div.style.marginRight = '5px';
            div.style.cursor = 'pointer';
            verticallyCenter(div);
            img.style.height = '100%';
            img.src = window.thePageUrl+srcImg;
            new Hover(img, function () {
                img.src = window.thePageUrl+srcImgHover;
            }, function () {
                img.src = window.thePageUrl+srcImg;
            });
            div.addEventListener("click", clickCallback);
        }
    var showingUsers = true;
    function showUsers()
    {
        users.div.style.display = 'block';
            divMain.style.marginRight = '2px';
            divMain.style.width = 'calc(100% - 156px)';
        showingUsers = true;
    }
    function hideUsers()
    {
        users.div.style.display = 'none';
        divMain.style.marginRight = '0px';
        divMain.style.width = 'calc(100% - 4px)';
        showingUsers = false;
    }
    hideUsers();
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
    setButtonGenericStyle(buttonClose);
    setButtonGenericStyle(buttonMinimize);
    setButtonGenericStyle(buttonMaximize);
    this.div.appendChild(divInner);
    divInner.appendChild(divTab);
    divInner.appendChild(divMain);
    divInner.appendChild(users.div);
    divMain.appendChild(divFeed);
    divMain.appendChild(divControls);
    divTab.appendChild(buttonClose);
    divTab.appendChild(buttonMaximize);
    divTab.appendChild(buttonMinimize);
    divTab.appendChild(divName);
    divControls.appendChild(divUsers);
    divUsers.appendChild(imgUsers);
        divControls.appendChild(divProfilePicture);
        divProfilePicture.appendChild(imgProfilePicture);
        divControls.appendChild(divUploadImage);
        divUploadImage.appendChild(imgUploadImage);
    this.show = function ()
    {
        self.div.style.display = 'inline';
        Windows.bringToFront(self);
    };
    this.hide = function ()
    {
        self.div.style.display = 'none';
    };
    var websocket;
    var onConnect = function (jObject)
    {
        if (enterPassword)
        {
            enterPassword.hide();
        }
        if (jObject.successful)
        {
            if (wallInfo.message)
            {
                interpret(wallInfo.message);
                self.task.attention();
            }
        }
        else
        {
            if (jObject.reason && enterPassword)
            {
                enterPassword.setError(jObject.reason);
            }
        }
    };
    function gotUsers(jObject)
    {
        users.listUsers(jObject.users);
    }function showImageUploaderProfilePicture()
    {
        if (callbacksImageUploaderProfilePicture)
        {
            if (callbacksImageUploaderProfilePicture.show)
            {
                callbacksImageUploaderProfilePicture.show();
            }
        }
    }
    function showImageUploader()
    {
        if (callbacksImageUploader)
        {
            if (callbacksImageUploader.show)
            {
                callbacksImageUploader.show(true, undefined, {}, {send: function (jObject) {
                        websocket.send(jObject);
                    }}, wallInfo.name);
            }
        }
    }
    function initializeWebsocket()
    {
        websocket = new MySocket("wall");
        websocket.onopen = function () {
            if (wallInfo.has_password)
            {
                enterPassword = new EnterPassword(divFeed, function (password) {
                    connect(password);
                }, close);
            }
            else
            {
                connect();
            }
        };
        websocket.onmessage = function (jObject)
        {
            interpret(jObject);
        };
    }
    function connect(password)
    {
        var jObject = {};
        jObject.type = "connect";
        if (password && password.length > 0)
        {
            jObject.password = password;
        }
        jObject.user_id = userInformation.id;
        jObject.wall_id = wallInfo.id;
        websocket.send(jObject);
    }
    function data(jObject)
    {
        
    }
    function interpret(jObject)
    {
        dataConnectionsHandler.interpret(jObject);
        switch (jObject.type)
        {
            case "connect":
                onConnect(jObject);
                break;
            case "users":
                gotUsers(jObject);
                break;
            case "data":
                data(jObject);
                break;
        }
    }
    makeUnselectable(this.div);
    makeTextSelectable(divFeed);
    themesObject = {components: [
            {name: 'controls', elements: [divControls]},
            {name: 'feed', elements: [divFeed]},
            {name: 'body', elements: [divMain]},
            {name: 'text', elements: [divName, buttonClose, buttonMinimize, buttonMaximize]}
        ],
        callback: function (theme) {

        }
    };
    Window.style(self.div, divInner, divTab);
    Themes.register(themesObject, undefined);
    initializeWebsocket();
    Windows.add(this, false, divTab, divInner, new WindowInformation(true, true, 292, 240, Windows.maxWidthPx,  Windows.maxHeightPx, 0, 100, 0, Windows.maxYPx, true, true, true), 
         new WindowCallbacks(function(){
                settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
                settings.set("size", [self.div.offsetWidth, self.div.offsetHeight]);
            }, function(){
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
         }));

        TaskBar.add(this);
}