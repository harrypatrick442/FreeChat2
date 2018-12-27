/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Users(independant, cssName, userInformation, callbackEntered, callbackLeft, callbackProfilePicture)
{
    var self = this;
    var initialized = false;
    var settings = new Settings("#users", function () {
        this.set("position");
        this.set("showing");
        this.set("size");
        //this is a reset function for this particualr instance of this particular class.
    });
    var minWidth = 200;
    var minHeight = 100;
    this.type = 'Users';
    if (independant)
    {
        this.taskBarInformation = {tooltip: 'Lists all users on site', icon: ('images/users.gif'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    }
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var divMain = document.createElement('div');
    if (independant)
    {

        this.div.style.position = "absolute";
        this.div.style.width = '200px';
        this.div.style.height = '450px';
        this.div.style.top = '300px';
        this.div.style.left = '220px';
        this.div.style.position = 'absolute';
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
        this.div.style.display = 'none';
        setText(divName, "All Users");
        var startPosition = settings.get("position");
        if (startPosition)
        {
            this.div.style.left = String(startPosition[0]) + 'px';
            this.div.style.top = String(startPosition[1]) + 'px';
        }
        var startSize = settings.get("size");
        if (startSize)
        {
            if (startSize[0] < minWidth)
                startSize[0] = minWidth;
            if (startSize[1] < minHeight)
                startSize[1] = minHeight;
            this.div.style.width = String(startSize[0]) + 'px';
            this.div.style.height = String(startSize[1]) + 'px';
        }  var startZIndex = settings.get("zIndex");
        if (startZIndex)
        {
            self.div.style.zIndex=String(startZIndex);
        }
    
    } else
    {
        this.div.style.position = "relative";
        this.div.style.width = '150px';
        this.div.style.height = '100%';
        this.div.style.backgroundColor = '#555555';
        divInner.style.borderBottomRightRadius = "5px";
        divTab.style.backgroundColor = "#e6e6ff";
        divTab.style.height = "14px";
        divMain.style.backgroundColor = '#d9d9d9';
        divMain.style.width = "100%";
        divMain.style.height = "calc(100% - 14px)";
        divMain.style.borderBottomRightRadius = '5px';
        divName.style.height = '100%';
        setText(divName, "Users");
        divInner.style.width = "100%";
        divInner.style.height = "100%";
    }
    this.div.className = 'div-room';
    //ff0066
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
    divMain.style.overflowY = 'auto';
    var currentUsers = [];
    var currentUsernames = [];
    var menuOptions = [{name: 'PM', callback: function (r) {
                Lobby.getPm(r.userId);
            }}, {name: 'Ignore', callback: function (r) {
                if (Ignore.isIgnored(r.userId))
                {
                    Ignore.unignore(r.userId);
                } else
                {
                    Ignore.ignore(r.userId);
                }
            }}];
    if (Configuration.videoEnabled)
    {
        menuOptions.push({name: 'Video PM', callback: function (r) {
                Video.getWebcamPermission(function () {
                    Lobby.getVideoPm(r.userId);
                });
            }});
    }
    var menu = new Menu({options: menuOptions});
    this.mapUniqueIdToUser={};
    this.listUsers = function (users)
    {
        var alreadyPresent = [];
        var i = 0;
        var addedAtLeastOne = false;
        for (var i = users.length - 1; i >= 0; i--)
        {
            var r = users[i];
            if (currentUsernames.indexOf(r.name) < 0)
            {
                addedAtLeastOne = r.name;
                var user = new UserEntry(r);
                var inserted = false;
                for (var j = 0; j < currentUsernames.length; j++)
                {
                    if (currentUsernames[j] > user.name)
                    {
                        divMain.insertBefore(user.div, divMain.children[j]);
                        currentUsers.splice(j, 0, user);
                        self.mapUniqueIdToUser[user.userId]=user;
                        currentUsernames.splice(j, 0, user.name);
                        inserted = true;
                        break;
                    }
                }
                if (!inserted)
                {
                    divMain.appendChild(user.div);
                    self.mapUniqueIdToUser[user.userId]=user;
                    currentUsers.push(user);
                    currentUsernames.push(user.name);
                }
            }
            alreadyPresent.push(r.name);
        }
        i = 0;
        while (i < currentUsers.length)
        {
            if (alreadyPresent.indexOf(currentUsers[i].name) < 0)
            {
                if (callbackLeft)
                {
                    callbackLeft(currentUsers[i].name);
                }
                divMain.removeChild(currentUsers[i].div);
                delete self.mapUniqueIdToUser[currentUsers[i].userId];
                currentUsers.splice(i, 1);
                currentUsernames.splice(i, 1);
            } else
            {
                i++;
            }
        }
        initialized = true;
        if (addedAtLeastOne && independant)
        {
            Tab.attention(r.name + " Entered!");
            SoundEffects.entered();
        }
    };
    function UserEntry(r)
    {
        var self = this;
        this.name = r.name;
        this.userId = r.userId;
        this.div = document.createElement('div');
        this.div.style.position = 'relative';
        this.div.style.height = '32px';
        this.div.style.width = '100%';
        this.div.style.backgroundColor = '#f0f0f0';
        this.div.style.cursor = 'pointer';
        this.div.style.float = 'left';
        this.div.style.border = '1px solid #00264d';
        this.div.style.borderRadius = '3px';
        this.div.style.left = '-1px';
        this.div.style.marginLeft = '2px';
        this.div.style.marginTop = '1px';
        this.div.style.overflow = 'hidden';
        this.div.style.width = 'calc(100% - 6px)';
        this.div.style.paddingLeft = '2px';
        var divName = document.createElement('div');
        var divPicture = document.createElement('div');
        divName.style.float = 'left';
        divName.style.fontFamily = 'Arial';
        divName.style.fontSize = '14px';
        divName.style.height = '18px';
        divName.style.paddingLeft = '0px';
        divName.style.textOverflow = 'ellipsis';
        divName.style.overflow = 'hidden';
        divName.style.whiteSpace = 'nowrap';
        divName.style.width = 'calc(100% - 32px)';
        verticallyCenter(divName);
        divPicture.style.marginRight = '1px';
        divPicture.style.height = '30px';
        divPicture.style.width = '30px';
        divPicture.style.float = 'left';
        verticallyCenter(divPicture);
        setText(divName, r.name);
        console.log('r is ');
        console.log(r);
        var profilePicture = new ProfilePicture({userName:r.name, userUuid:r.userId});
        divPicture.appendChild(profilePicture.div);
        if (r.relativePathImage)
        {
            ProfilePicture.update(r.name, 'images/profile/' + r.relativePathImage);
        }
        this.div.appendChild(divPicture);
        this.div.appendChild(divName);
        new Hover(this.div, function () {
            self.div.style.backgroundColor = '#fdfdfe';
        }, function () {
        });
        this.div.onclick = function (e)
        {

            if (!e)
                var e = window.event;
            console.log(r.userId);
            console.log(userInformation)
            if (r.userId != userInformation.userId)
            {
                var ignoreStr = 'Ignore';
                if (Ignore.isIgnored(r.userId))
                {
                    ignoreStr = 'Unignore';

                }
                menu.show(e.pageX, e.pageY, function () {
                }, r, [{}, {name: ignoreStr}, {}]);
            } else
            {
                divPicture.onclick = function () {
                    if (callbackProfilePicture)
                    {
                        try
                        {
                            callbackProfilePicture();
                        } catch (ex)
                        {
                            console.log(ex);
                        }
                    }
                };
            }
        };
        if (callbackEntered && initialized)
        {
            callbackEntered(r.name);
        }

        this.dispose = function ()
        {
            ProfilePicture.remove(profilePicture);
        };
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
    divInner.appendChild(divTab);

    divTab.appendChild(divName);
    divInner.appendChild(divMain);
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
    if (showing || showing == undefined)
    {
        this.show();
    } else
    {
        if (showing == false)
        {
            this.hide();
        }
    }
    if (independant)
    {

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
    } else
    {

        Themes.register({components: [
                {name: 'text', elements: [divTab]},
                {name: 'body1', elements: [divMain]},
                {name: 'frame1', elements: [divTab, self.div]},
                {name: 'text_color', elements: [divName]}
            ],
            callback: function (theme) {

            }}, undefined);
        Themes.register({components: [
            ],
            callback: function (theme) {

            }}, undefined);
    }
    makeUnselectable(this.div);
    this.dispose = function ()
    {
        while (currentUsers.length > 0)
        {
            var currentUser = currentUsers[0];
            currentUser.dispose();
            currentUsers.splice(currentUsers.indexOf(currentUser), 1);
        }
    };
}
