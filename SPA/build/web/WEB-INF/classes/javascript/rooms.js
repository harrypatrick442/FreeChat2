function Rooms(mapIdToRoom, callbacks, userInformation)
{
    var self = this;
    var selfRooms = this;
    var settings = new Settings("#rooms", function () {
        this.set("position");
        this.set("showing");
        this.set("size");
        //this is a reset function for this particualr instance of this particular class.
    });
    var minWidth=200;
    var minHeight=100;
    this.type = 'Rooms';
    this.taskBarInformation = {tooltip: 'Lists all rooms', icon: ('images/rooms-icon.gif'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
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
    divInner.style.position='absolute';
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
        if(startSize[0]<minWidth)
            startSize[0]=minWidth;
        if(startSize[1]<minHeight)
            startSize[1]=minHeight;
        this.div.style.width = String(startSize[0]) + 'px';
        this.div.style.height = String(startSize[1]) + 'px';
    }  var startZIndex = settings.get("zIndex");
        if (startZIndex)
        {
            self.div.style.zIndex=String(startZIndex);
        }
    
    var menuBarOptions=[{name: 'Text room', callback: function () {
                            CreateRoom.show(createRoom, true, Room.Type.dynamic);
                        }}];
        if(Configuration.videoEnabled)
    menuBarOptions.push({name: 'Video room', callback: function () {
                            CreateRoom.show(createRoom, true, Room.Type.videoDynamic);
                        }});
    var menuBar = new MenuBar({options: [{name: 'Add', options: menuBarOptions}]}, {left: 0, top: -2});
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.height = "20px";
    divTab.style.cursor = 'move';
    divTab.style.padLeft = '10px';
    divName.style.float = 'left';
    divName.style.paddingLeft = '5px';
    divName.style.fontFamily = 'Arial';
    verticallyCenter(divName);
    setText(divName, "Rooms");
    divMain.style.backgroundColor = '#555555';
    divMain.style.position = 'relative';
    divMain.style.float = 'left';
    divMain.style.height = 'calc(100% - 41px)';
    divMain.style.width = "100%";
    divMain.style.overflowY = 'auto';
    divMain.style.paddingBottom = '1px';
    var mapIdToRoomEntry = {};
    var arrayRoomEntries = [];
    var openEnabled=false;
    this.enableOpen=function(){openEnabled=true;};
    this.listRooms = function (rooms)
    {
        var alreadyPresent = [];
        var i = 0;
        for (var i = rooms.length - 1; i >= 0; i--)
        {
            var r = rooms[i];
            if (r.id)
            {
                if (!mapIdToRoomEntry[r.id]&&((!isMobile)||(r.type!=Room.Type.videoDynamic&&r.type!=Room.Type.videoStatic&&r.type!=Room.Type.videoPm)))
                {
                    var roomEntry = new RoomEntry(r);
                    var j = 0;
                    var inserted = false;
                    var lowerCaseName = roomEntry.info.name.toLowerCase();
                    while (j < arrayRoomEntries.length)
                    {
                        var rEntry = arrayRoomEntries[j];
                        if (rEntry.info.name.toLowerCase() > lowerCaseName)
                        {
                            mapIdToRoomEntry[r.id] = roomEntry;
                            arrayRoomEntries.splice(j, 0, roomEntry);
                            divMain.insertBefore(roomEntry.div, divMain.children[j]);
                            inserted = true;
                            break;
                        }
                        j++;
                    }
                    if (!inserted)
                    {
                        mapIdToRoomEntry[r.id] = roomEntry;
                        arrayRoomEntries.push(roomEntry);
                        divMain.appendChild(roomEntry.div);
                    }
                }
                alreadyPresent.push(r.id);
            }
        }
        i = 0;
        while (i < arrayRoomEntries.length)
        {
            var roomInfo = arrayRoomEntries[i].info;
            if (alreadyPresent.indexOf(roomInfo.id) < 0)
            {
                divMain.removeChild(mapIdToRoomEntry[roomInfo.id].div);
                arrayRoomEntries.splice(i, 1);
                delete mapIdToRoomEntry[roomInfo.id];
            }
            i++;
        }
    };
    function createRoom(name, password, type)
    {
        var jObject = {};
        jObject.type = 'create_room';
        jObject.name = name;
        jObject.room_type = type;
        if (password && password.length > 0)
        {
            jObject.has_password = true;
            jObject.password = password;
        }
        else
        {
            jObject.has_password = false;
        }
        callbacks.send(jObject);
    }
    function RoomEntry(r)
    {
        var self = this;
        this.info = r;
        this.div = document.createElement('div');
        var divName = document.createElement('div');
        var divImg = document.createElement('div');
        var img = document.createElement('img');
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
        img.style.width = '100%';
        verticallyCenter(divName);
        verticallyCenter(divImg);
        verticallyCenter(img);
        setText(divName, r.name);
        this.div.appendChild(divName);
        this.div.appendChild(divImg);
        switch (r.type)
        {
            case Room.Type.static:
                img.src = window.thePageUrl+'images/keyboard.png';
                break;
            case Room.Type.videoStatic:
                img.src = window.thePageUrl+'images/webcam.png';
                break;
            case Room.Type.videoDynamic:
                img.src = window.thePageUrl+'images/webcam.png';
                break;
            default:
                img.src = window.thePageUrl+'images/keyboard.png';
                break;
        }

        divImg.appendChild(img);
        new Hover(this.div, function () {
            self.div.style.backgroundColor = '#fdfdfe';
        }, function () {
        });
        this.div.onmousedown = function ()
        {
            Windows.cancelBringToFront(selfRooms);
           // if (r.type == Room.Type.videoDynamic || r.type == Room.Type.videoStatic)
            //{
                    //Video.getWebcamPermission(function () {
                    showRoom();
                    //});
            //}
          //  else
          //  {
      //          showRoom();
           // }
            function showRoom()
            {
                if(!openEnabled){
                    var optionPaneSignIn = new OptionPane(divMain);
                    optionPaneSignIn.show([['Ok', function () {
                            }]], "You must enter a username to access chatrooms!", function () {
                    });
                    optionPaneSignIn.div.style.left = '6px';
                    optionPaneSignIn.div.style.width = '180px';
                    optionPaneSignIn.div.style.marginLeft = '0px';
                    return;
                }
                var room = mapIdToRoom[r.id];
                if (room)
                {
                    room.task.unminimize();
                }
                else
                {
                    Lobby.openRoom(r);
                }
            }
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
    divInner.appendChild(menuBar.div);
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
    if(showing)
    {
        this.show();
    }
    else
    {
        if(showing==false)
        {
            this.hide();
        }
    }
    makeUnselectable(this.div);
    Themes.register({components:[
            {name:'body', elements:[divMain]},
            {name:'text', elements:[divName]}
        ],
    callback:function(theme){
        
    }});
    Window.style(self.div, divInner, divTab);
    Windows.add(this, false, divTab, divInner, new WindowInformation(true, true, 200, 100, 199, Windows.maxHeightPx, 0, 100, 0, Windows.maxYPx, true, false, true), 
         new WindowCallbacks(function(){
                settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
                settings.set("size", [200, self.div.offsetHeight]);
            }, function(){
        if(self.div.offsetLeft&&self.div.offsetTop)
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
         },
         function(){
        self.task.minimize();}, undefined, function(){
        self.task.minimize();}, function(zIndex){settings.set("zIndex", zIndex);}));
    TaskBar.add(this);
}