/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
includeJQuery = true;
function LobbyChat(callbackFinishedLoading, otherCallbacks)
{
    var mapIdToWall = {};
    var mapIdToRoom = {};
    Tab.setText("ChatDimension :)");
    var settings = new Settings('#lobby_chat', function () {
        this.set("profilePicture");
    });
    var userInformation;
    var font = new Font();
    var soundEffects;
    var emoticons = new Emoticons(Configuration.emoticonsXmlString);
    var rooms;
    var walls;
    var users;
    var webcamSettings;

    websocket = new MySocket("chat_lobby");
    websocket.addEventListener('open', function () {
        var jObject = {};
        jObject.type = "connect";
        websocket.send(jObject);
    });
    websocket.addEventListener('message', function (e) {
        interpret(e.message);
    });
    var onEnter = function ()
    {
        soundEffects = new SoundEffects(userInformation);
        rooms = new Rooms(mapIdToRoom, {send:
                    websocket.send
        }, userInformation);
        if (Configuration.wallsEnabled)
            walls = new Walls({send:
                        websocket.send}, userInformation);
        users = new Users(true, "users", userInformation, undefined, undefined, showImageUploaderProfilePicture);
        if (Configuration.videoEnabled && !isMobile)
            webcamSettings = new WebcamSettings(userInformation);
        getRooms();
        getUsers();
        //if(Configuration.wallsEnabled)
        //getWalls();
        //if(Configuration.wallsEnabled)
        //for(var i=0; i<openOnEnterWalls.length; i++)
        //{
        //    Lobby.openWall(openOnEnterWalls[i]);
        // }
        callbackFinishedLoading();
    };
    function gotVideoPm(jObject)
    {
        Lobby.openRoom(jObject);
    }
    function getVideoPm(userId)
    {

        if (userId != userInformation.userId)
        {
            var jObject = {};
            jObject.type = 'video_pm';
            jObject.otherUserId = userId;
            jObject.userId = userInformation.userId;
            websocket.send(jObject);
        }
    }
    function gotPm(jObject)
    {
        Lobby.openRoom(jObject);
    }
    Lobby.getVideoPm = function (userId)
    {
        getVideoPm(userId);
    };
    function getPm(userId)
    {
        if (userId != userInformation.userId)
        {
            var jObject = {};
            jObject.type = 'pm';
            jObject.otherUserId = userId;
            jObject.userId = userInformation.userId;
            websocket.send(jObject);
        }
    }
    Lobby.getPm = function (userId)
    {
        getPm(userId);
    };
    function getUsers()
    {
        var jObject = {};
        jObject.type = 'users';
        websocket.send(jObject);
    }
    function gotUsers(jObject)
    {
        users.listUsers(jObject.users);
    }
    function gotConnect(jObject)
    {
        userInformation = new UserInformation(jObject.user_id);
        if (onEnter)
        {
            onEnter();
            onEnter = undefined;
        }
    }
    function gotRooms(jObject)
    {
        rooms.listRooms(jObject.rooms);
    }
    function getRooms()
    {
        var jObject = {};
        jObject.type = 'get_rooms';
        websocket.send(jObject);
    }
    function gotWalls(jObject)
    {
        walls.listWalls(jObject.rooms);
    }
    function getWalls()
    {
        var jObject = {};
        jObject.type = 'get_walls';
        websocket.send(jObject);
    }
    function gotCreateRoom(jObject)
    {
        if (jObject.successful)
        {
            CreateRoom.hide();
        } else
        {
            CreateRoom.error(jObject.reason);
        }
    }
    function gotProfilePictureReply(jObject)
    {
        ImageUploader.interpret(jObject);
    }
    function gotProfilePicture(jObject)
    {
        ProfilePicture.update(jObject.userId, "ServletImages?path=" + jObject.path + "&t=" + new Date().getTime());
    }
    var timerEnableAlerts;
    this.authenticate = function (jObject) {
        if (jObject.successful)
        {
            console.log('authenticated');
            console.log(jObject);
            rooms.enableOpen();
            for (var i = 0; i < openOnEnter.length; i++)
            {
                Lobby.openRoom(openOnEnter[i]);
            }
            timerEnableAlerts = new Timer(function () {
                Tab.enableFlash(true);
            }, 3000, 1);
            userInformation.name = jObject.username;
            userInformation.userId = jObject.userId;
            var jObjectProfilePicture = settings.get('profilePicture');
            if (jObjectProfilePicture)
            {
                websocket.send(jObjectProfilePicture);
            }
        }
    };
    function showImageUploaderProfilePicture()
    {
        ImageUploader.show(true, 1, {}, {send: function (jObject) {
                jObject.type = 'profile_picture';
                websocket.send(jObject);
                settings.set('profilePicture', jObject);
            }}, 'profile picture');
    }
    function callbackRoomClosed(roomId)
    {
        delete mapIdToRoom[roomId];
    }
    Lobby.openRoom = function (roomInformation)
    {
        if (mapIdToRoom[roomInformation.id])
        {
            var room = mapIdToRoom[roomInformation.id];
            room.newRoomInformation(roomInformation);
            room.task.unminimize();
        } else
        {//xxx
            if ((!isMobile) || (roomInformation.type != Room.Type.videoDynamic && roomInformation.type != Room.Type.videoStatic && roomInformation.type != Room.Type.videoPm))
                mapIdToRoom[roomInformation.id] = new Room(userInformation, roomInformation, callbackRoomClosed, "room", Configuration.URL_ENDPOINT_ROOM, {unminimize: font.unminimize, getFont: font.getFont}, {unminimize: emoticons.unminimize, getLookupTree: emoticons.getLookupTree}, {unminimize: soundEffects.unminimize}, {show: ImageUploader.show, interpret: ImageUploader.interpret}, {show: showImageUploaderProfilePicture});
        }
    };
    Lobby.openWall = function (wallInfo)
    {
        if (mapIdToWall[wallInfo.id])
        {
            var room = mapIdToWall[wallInfo.id];
            room.wallInformation(wallInfo);
            room.task.unminimize();
        }
        else
        {
            mapIdToWall[wallInfo.id] = new Wall(userInformation, wallInfo, Configuration.URL_ENDPOINT_WALL, {show: ImageUploader.show, interpret: ImageUploader.interpret}, {show: showImageUploaderProfilePicture});
        }
    };
    //if (!WebSocket)
    //{
    //    optionPane = new OptionPane(document.documentElement);
    //    optionPane.show([['Ok', function () {
    //           }]], "Sorry but your browser does not support websockets, please use the latest version of Chrome, Opera, Saphari, Firefox or IE!", function () {
    //   });
    //    optionPane.div.style.zIndex = '30000';
    //    optionPane.div.style.top = '30%';
    //    optionPane.div.style.position = 'fixed';
    //}
    function interpret(jObject)
    {
        console.log("lobby chat");
        console.log(jObject);
        console.log('type: ' + jObject.type);
        switch (jObject.type)
        {
            case "connect":
                gotConnect(jObject);
                break;
            case "get_rooms":
                gotRooms(jObject);
                break;
            case "authenticate":
                gotUsername(jObject);
                break;
            case "users":
                gotUsers(jObject);
                break;
            case "pm":
                gotPm(jObject);
                break;
            case "video_pm":
                gotVideoPm(jObject);
                break;
            case "create_room":
                gotCreateRoom(jObject);
                break;
            case "profile_picture":
                gotProfilePicture(jObject);
                break;
            case "profile_picture_reply":
                gotProfilePictureReply(jObject);
                break;
        }
    }
    ;

}