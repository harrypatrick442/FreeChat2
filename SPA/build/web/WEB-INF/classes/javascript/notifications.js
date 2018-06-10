 function Notifications(mapIdToRoom, send)
{
    var self = this;
    var selfNotifications = self;
    var settings = new Settings("#rooms", function () {
        this.set("position");
        this.set("showing");
        this.set("size");
        //this is a reset function for this particualr instance of this particular class.
    });
    var minWidth = 200;
    var minHeight = 100;
    this.type = 'Notifications';
    this.taskBarInformation = {tooltip: 'Notifications', icon: ('images/notifications-icon.png'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var divMain = document.createElement('div');
    this.div.style.position = "absolute";
    this.div.style.width = '200px';
    this.div.style.height = '300px';
    this.div.style.top = '300px';
    this.div.style.left = '10px';
    divInner.style.position = 'absolute';
    divInner.style.border = '1px solid #66a3ff';
    //divInner.style.border = '3px solid #0099ff';
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
        if (startSize[0] < minWidth)
            startSize[0] = minWidth;
        if (startSize[1] < minHeight)
            startSize[1] = minHeight;
        this.div.style.width = String(startSize[0]) + 'px';
        this.div.style.height = String(startSize[1]) + 'px';
    }
    var startZIndex = settings.get("zIndex");
    if (startZIndex)
    {
        self.div.style.zIndex = String(startZIndex);
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
    setText(divName, "Notifications");
    divMain.style.backgroundColor = '#555555';
    divMain.style.position = 'relative';
    divMain.style.float = 'left';
    divMain.style.height = 'calc(100% - 41px)';
    divMain.style.width = "100%";
    divMain.style.overflowY = 'auto';
    divMain.style.paddingBottom = '1px';
    var mapIdToNotificationEntry = {};
    var arrayNotificationEntries = [];
    this.listNotifications = function (notifications)
    {
        console.log('listing notifications.');
        var alreadyPresent = [];
        var i = 0;
        for (var i = notifications.length - 1; i >= 0; i--)
        {
            var r = notifications[i];
            if (r.roomUuid)
            {
                if (!mapIdToNotificationEntry[r.roomUuid])
                {
                    var notificationEntry = new NotificationEntry(r);
                    var j = 0;
                    var inserted = false;
                    var lowerCaseName = notificationEntry.info.roomName.toLowerCase();
                    while (j < arrayNotificationEntries.length)
                    {
                        var rEntry = arrayNotificationEntries[j];
                        if (rEntry.info.roomName.toLowerCase() > lowerCaseName)
                        {
                            mapIdToNotificationEntry[r.roomUuid] = notificationEntry;
                            arrayNotificationEntries.splice(j, 0, notificationEntry);
                            divMain.insertBefore(notificationEntry.div, divMain.children[j]);
                            inserted = true;
                            break;
                        }
                        j++;
                    }
                    if (!inserted)
                    {
                        mapIdToNotificationEntry[r.roomUuid] = notificationEntry;
                        arrayNotificationEntries.push(notificationEntry);
                        divMain.appendChild(notificationEntry.div);
                    }
                }
                alreadyPresent.push(r.roomUuid);
            }
        }
        i = 0;
        while (i < arrayNotificationEntries.length)
        {
            var roomInfo = arrayNotificationEntries[i].info;
            if (alreadyPresent.indexOf(roomInfo.roomUuid) < 0)
            {
                removeNotification(roomInfo.roomUuid);
            }
            i++;
        }
    };
    function removeNotification(roomUuid) {
        var notificationEntry = mapIdToNotificationEntry[roomUuid];
        notificationEntry.dispose();
        divMain.removeChild(notificationEntry.div);
        arrayNotificationEntries.splice(arrayNotificationEntries.indexOf(notificationEntry), 1);
        delete mapIdToNotificationEntry[roomUuid];
    }
    this.clearNotification = function (roomUuid) {
        var notificationEntry = mapIdToNotificationEntry[roomUuid];
        if (!notificationEntry)
            return;
        removeNotification(roomUuid);
        clearNotification(send, roomUuid);
    };
    function NotificationEntry(r)
    {
        console.log('notififcation');
        console.log(r);
        var self = this;
        this.info = r;
        this.div = document.createElement('div');
        var divName = document.createElement('div');
        var divImg = document.createElement('div');
        var compositeImage = new CompositeImage(divImg, concateUsersImages(r.users));
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
        divImg.style.float = 'left';
        divImg.style.height = '28px';
        divImg.style.width = '28px';
        verticallyCenter(divName);
        verticallyCenter(divImg);
        setText(divName, r.roomName);
        this.div.appendChild(divName);
        this.div.appendChild(divImg);
        new Hover(this.div, function () {
            self.div.style.backgroundColor = '#fdfdfe';
        }, function () {
        });
        this.div.onmousedown = function ()
        {
            Windows.cancelBringToFront(selfNotifications);
            var room = mapIdToRoom[r.roomUuid];
            if (room)
            {
                room.task.unminimize();
            }
            else
            {
                console.log('room type in pm is: ');console.log(r.roomType);console.log(r);
                var usernames = [];
                foreach(r.users,function(user){usernames.push(user.username);});
                Lobby.openRoom({roomUuid:r.roomUuid, name:r.roomName, type:r.type, usernames:usernames, show:true});
            }
        };
        this.dispose = function(){
            compositeImage.dispose();
        };
        function concateUsersImages(users){
            var list =[];
            foreach(users, function(user){
                if(user.relativePathImage){
                    list.push(user.relativePathImage);
                }
            });
            return list;
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
    if (showing)
    {
        this.show();
    }
    else
    {
        if (showing == false)
        {
            this.hide();
        }
    }
    makeUnselectable(this.div);
    Themes.register({components: [
            {name: 'body', elements: [divMain]},
            {name: 'text', elements: [divName]}
        ],
        callback: function (theme) {

        }});
    Window.style(self.div, divInner, divTab);
    Windows.add(this, false, divTab, divInner, new WindowInformation(true, true, 200, 100, 199, Windows.maxHeightPx, 0, 100, 0, Windows.maxYPx, true, false, true),
            new WindowCallbacks(function () {
                settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
                settings.set("size", [200, self.div.offsetHeight]);
            }, function () {
                if (self.div.offsetLeft && self.div.offsetTop)
                    settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
            },
                    function () {
                        self.task.minimize();
                    }, undefined, function () {
                self.task.minimize();
            }, function (zIndex) {
                settings.set("zIndex", zIndex);
            }));
    TaskBar.add(this);
    getNotifications();
    function getNotifications() {
        send({type: "get_notifications"});
    }
}