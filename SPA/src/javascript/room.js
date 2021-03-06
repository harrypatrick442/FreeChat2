function Room(userInformation, roomInformation, callbackClosed, cssName, endpoint, callbacksFont, callbacksEmoticons, callbacksSoundEffects, callbacksImageUploader, callbacksProfileEditor)
{
    var self = this;
    var settings = new Settings(roomInformation.name, function () {
        this.set("position");
        this.set("size");
        //this is a reset function for this particualr instance of this particular class.
    });
    this.isRoom = true;
    var minWidth = 292;
    var minHeight = 240;
    this.acceptsEmoticons = true;
    this.type = roomInformation.type;
    var useCalc = true;
    this.taskBarInformation = {tooltip: 'A room you have open', icon: ('images/' + cssName + '-icon.gif'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}, attentionStyle: {backgroundColor: 'rgba(255,80,80,0.5)'}};
    this.div = document.createElement('div');
    var enterPassword;
    var pendingMessages = new PendingMessages();
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divName = document.createElement('div');
    var divMain = document.createElement('div');

    var divInputText = document.createElement('div');
    var text = document.createElement('input');
    var divUploadImage;
    var imgUploadImage;
    var divProfilePicture;
    var imgProfilePicture;
    var divEmoticons;
    var imgEmoticons;
    var divFont;
    var divVideoStart;
    var imgVideoStart;
    var divVideoStop;
    var imgVideoStop;
    var divTyping;
    var divTypingHelper;
    var divTypingInner;
    var divControls = document.createElement('div');
    var divControlsInner = document.createElement('div');
    var divControls = document.createElement('div');
    var themesObject;
    var themesObjectWindow;
    var divSoundEffects = document.createElement('div');
    var imgSoundEffects = document.createElement('img');
    var divUsers = document.createElement('div');
    var imgUsers = document.createElement('img');
    var divFeed = document.createElement('div');
    if (roomInformation.type != Room.Type.videoStatic && roomInformation.type != Room.Type.videoDynamic && roomInformation.type != Room.Type.videoPm)
    {
        divProfilePicture = document.createElement('div');
        imgProfilePicture = document.createElement('img');
        divUploadImage = document.createElement('div');
        imgUploadImage = document.createElement('img');
        divEmoticons = document.createElement('div');
        imgEmoticons = document.createElement('img');
        divFont = document.createElement('div');
        divTyping = document.createElement('div');
        divTypingHelper = document.createElement('div');
        divTypingInner = document.createElement('div');
    } else
    {
        if (roomInformation.type == Room.Type.videoPm)
        {
            divVideoStart = document.createElement('div');
            imgVideoStart = document.createElement('img');
            divVideoStop = document.createElement('div');
            imgVideoStop = document.createElement('img');
        }
    }
    //SPINNER----------------------
    var spinner = new Spinner(1);
    spinner.div.style.position = 'absolute';
    spinner.div.style.width = '109px';
    spinner.div.style.height = '109px';
    spinner.div.style.left = 'calc(50% - 55px)';
    spinner.div.style.top = 'calc(50% - 55px)';
    divMain.appendChild(spinner.div);
    //!SPINNER-------------------------------

    //Users panel----------------------------------------------------------------------
    var users = new Users(false, "users", userInformation, function (username) {
        if (roomInformation.type == Room.Type.dynamic || roomInformation.type == Room.Type.static)
        {
            addAdminMessage(username + " has joined the chat!");
        }
    }, function (username) {
        if (roomInformation.type == Room.Type.dynamic || roomInformation.type == Room.Type.static)
        {
            addAdminMessage(username + " has left the chat!");
        }
    }, showProfileEditor);
    //Users panel---------------------------------------------------------------------------
    this.div.style.position = "absolute";
    this.div.style.width = '700px';
    this.div.style.height = '500px';
    this.div.style.left = '430px';
    this.div.style.top = '80px';
    var startPosition = settings.get("position");
    if (!startPosition)
    {
        startPosition = Window.getStartPosition();
    }
    this.div.style.left = String(startPosition[0]) + 'px';
    this.div.style.top = String(startPosition[1]) + 'px';
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
    divInner.style.position = 'absolute';
    divInner.style.border = '1px solid #66a3ff';
    divInner.style.backgroundColor = '#0099ff';
    divInner.style.padding = '0px 3px 3px 3px';
    divInner.style.borderRadius = "5px";
    divInner.style.overflow = 'hidden';
    divMain.style.width = 'calc(100% - 150px)';
    divMain.style.height = 'calc(100% - 24px)';
    divMain.style.padding = '2px';
    divMain.style.paddingBottom = '0px';
    divMain.style.position = 'relative';
    divMain.style.marginRight = '2px';
    users.div.style.float = 'left';
    users.div.style.width = '150px';
    users.div.style.height = 'calc(100% - 20px)';
    //if(!isMobile)
    //{
    if (roomInformation.type != Room.Type.videoStatic && roomInformation.type != Room.Type.videoDynamic && roomInformation.type != Room.Type.videoPm)
    {
        divFeed.style.height = 'calc(100% - 50px)';
    } else
    {
        divFeed.style.height = 'calc(100% - 22px)';
    }
    divFeed.style.marginBottom = '2px';
    divFeed.style.overflowX = 'hidden';
    divFeed.style.float = 'left';
    divInputText.style.height = '26px';
    divInputText.style.position = 'relative';
    divInputText.style.bottom = '0px';
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
    var menuOptions = [{name: 'PM', callback: function (r) {
                Lobby.getPm(r.userId);
            }}, {name: 'Ignore', callback: function (r) {
                if (!Ignore.isIgnored(r.userId))
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
    var menuMessages = new Menu({options: menuOptions});
    var video;
    var optionPane;
    var videos;

    if (roomInformation.type == Room.Type.videoPm)
    {

        if (roomInformation.otherUserId == userInformation.userId)
        {
            setText(divName, "Private Video with " + roomInformation.username);
        } else
        {
            setText(divName, "Private Video with " + roomInformation.other_username);
        }
        optionPane = new OptionPane(divFeed);
        video = new Video({
            send: function (obj)
            {
                obj.type = 'video';
                websocket.send(obj);
            },
            ask: function (offer)
            {
                optionPane.show([['Yes', function () {
                            video.accept();
                        }], ['No', function () {
                            video.decline();
                        }]], "Accept Video chat request from " + userInformation.name + "?", function () {
                    video.decline();
                });
            },
            connected: function ()
            {
                divVideoStart.style.display = 'none';
                divVideoStop.style.display = 'inline';
            },
            disconnected: function ()
            {
                roomInformation.accepted = false;
                divVideoStart.style.display = 'inline';
                divVideoStop.style.display = 'none';
            }
        });
        divFeed.appendChild(video.div);
    } else
    {
        //if (roomInformation.type == Room.Type.videoStatic || roomInformation.type == Room.Type.videoDynamic)
        //{
        //    videos = new Videos(userInformation, {send: function (jObject) {
        //           websocket.send(jObject);
        //       }});
        //    divFeed.appendChild(videos.div);
        // }
        var name = roomInformation.name;
        if (roomInformation.type == Room.Type.pm) {
            if (roomInformation.usernames.length > 1)
                name = "PM with: " + (roomInformation.usernames[0] == userInformation.name ? roomInformation.usernames[1] : roomInformation.usernames[0]);
        }
        setText(divName, name);
    }

    divInputText.style.border = ' 0x solid #333333';
    divInputText.style.borderTop = '0px';
    divInputText.style.overflow = 'hidden';
    divInputText.style.borderBottomLeftRadius = '4px';
    divInputText.style.borderBottomRightRadius = '4px';
    text.type = 'text';
    text.style.width = '100%';
    text.style.border = '0px';
    text.style.margin = '0px';
    text.addEventListener('click', function ()
    {
        focusText();
    });
    text.style.boxSizing = 'border-box';
    divControls.style.backgroundColor = '#ccb3ff';
    divControls.style.border = '0px';
    divControls.style.width = '100%';
    divControls.style.position = 'relative';
    divControls.style.float = 'left';
    divFeed.style.width = '100%';
    divInputText.style.width = '100%';
    divControls.style.height = '20px';
    divControlsInner.style.float = 'right';
    divControlsInner.style.height = '16px';
    divControlsInner.style.marginTop = '2px';
    divControlsInner.style.overflow = 'hidden';
    divControlsInner.style.position = 'relative';
    text.style.height = '100%';

    setupControlButton(divUsers, imgUsers, 'images/users.gif', 'images/users_highlighted.gif', function () {
        if (showingUsers) {
            hideUsers();
        } else {
            showUsers();
        }
        if (videos)
        {
            videos.resize();
        }
    });
    setupControlButton(divSoundEffects, imgSoundEffects, 'images/sound-effects-icon.gif', 'images/sound-effects-icon-blue.gif', showSoundEffects);
    if (roomInformation.type != Room.Type.videoStatic && roomInformation.type != Room.Type.videoDynamic && roomInformation.type != Room.Type.videoPm)
    {
        divFeed.style.backgroundColor = '#e6ffff';
        divFeed.style.overflowY = 'scroll';
        setupControlButton(divProfilePicture, imgProfilePicture, 'images/profile-picture-icon.gif', 'images/profile-picture-icon-blue.gif', showProfileEditor);
        setupControlButton(divUploadImage, imgUploadImage, 'images/upload-image-icon.gif', 'images/upload-image-icon-blue.gif', showImageUploader);
        setupControlButton(divEmoticons, imgEmoticons, 'images/emoticons-icon.gif', 'images/emoticons-icon-blue.gif', showEmoticons);
        divFont.className = 'div-' + cssName + '-font';
        divFont.style.position = 'relative';
        divFont.style.float = 'right';
        divFont.style.border = '1px solid #999999';
        divFont.style.height = '16px';
        divFont.style.width = '16px';
        divFont.style.textAlign = 'center';
        divFont.style.marginRight = '6px';
        divFont.style.cursor = 'pointer';
        divFont.style.backgroundColor = '#aaaaaa';
        setText(divFont, "T");
        divFont.addEventListener("click", showFont);
        verticallyCenter(divFont);
        new Hover(divFont, function () {
            divFont.style.backgroundColor = '#000000';
            divFont.style.color = '#ffffff';
        });
        verticallyCenter(divTyping);
        divTyping.style.position = 'relative';
        divTyping.style.float = 'left';
        divTyping.style.height = '16px';
        divTyping.style.width = 'calc(100% - 140px)';
        divTyping.style.overflow = 'hidden';
        divTypingHelper.style.height = '100%';
        divTypingHelper.style.float = 'left';
        divTypingHelper.style.width = '1px';
        divTypingInner.style.fontFamily = 'Arial';
        divTypingInner.style.fontSize = '12px';
        divTypingInner.style.float = 'left';
        divTypingInner.style.paddingLeft = '5px';
        divTypingInner.style.textAlign = 'center';

    } else
    {
        if (roomInformation.type == Room.Type.videoPm)
        {


            setupControlButton(divVideoStart, imgVideoStart, 'images/video-start-icon.gif', 'images/video-start-icon-blue.gif', function () {
                video.connect();
            });
            setupControlButton(divVideoStop, imgVideoStop, 'images/video-stop-icon.gif', 'images/video-stop-icon-blue.gif', function () {
                sendDisconnect();
                video.disconnect();
            });
            divFeed.style.overflow = 'hidden';
        } else
        {

        }
        divFeed.style.backgroundColor = '#AAAAAC';

    }

    function close()
    {
        if (video)
        {
            try
            {
                video.disconnect();
            } catch (ex)
            {
                console.log(ex);
            }
        } else
        {
            if (videos)
            {
                videos.dispose();
            } else
            {
                if (callbackFontChanged)
                {
                    Font.removeCallback(callbackFontChanged);
                }
            }
        }
		console.log('close');
        websocket.close();
        self.task.remove(self);
        Windows.remove(self);
        callbackClosed(roomInformation.roomUuid);
        Themes.remove(themesObject);
        Themes.remove(themesObjectWindow);
        users.dispose();
    }
    function setupControlButton(div, img, srcImg, srcImgHover, clickCallback)
    {
        div.style.position = 'relative';
        div.style.height = '16px';
        div.style.minWidth = '16px';
        div.style.float = 'right';
        div.style.marginRight = '5px';
        div.style.cursor = 'pointer';
        div.style.zIndex = '10';
        verticallyCenter(div);
        img.style.height = '100%';
        img.src = window.thePageUrl + srcImg;
        new Hover(img, function () {
            img.src = window.thePageUrl + srcImgHover;
        }, function () {
            img.src = window.thePageUrl + srcImg;
        });
        div.addEventListener("click", clickCallback);

    }
    var timerIsTyping;
    var sendTyping = true;
    function isTyping()
    {
        if (!timerIsTyping)
        {
            timerIsTyping = new Timer(function () {
                sendTyping = true;
            }, 1000, 1);
        }
        if (sendTyping)
        {
            var jObject = {};
            jObject.type = 'typing';
            websocket.send(jObject);
            sendTyping = false;
            timerIsTyping.reset();
        }
    }
    var badCount = 0;
    var lastMessage;
    var lastSentMessage = new Date().getTime();
    function isGoodMessage(str)
    {
        var newTime = new Date().getTime();
        if (newTime - lastSentMessage > 1300)
        {
            if (str.length < 8 || str != lastMessage)
            {
                lastSentMessage = newTime;
                lastMessage = str;
                return true;
                //{
                //  badCount++;
                //}
            } else
            {
                if (!this.optionPaneDisconnected)
                    this.optionPaneDisconnected = new OptionPane(document.body);
                this.optionPaneDisconnected.show([['Ok', function () {
                        }]], "Please don't spam the same message!", function () {
                });
            }
        } //else
        //lastSentMessage = newTime;
        //if (badCount > 2)
        //{
        //  Lobby.closedReason = 'spam';
        //MySocket.closeAll();
        //}
        return false;
    }
    text.onkeydown = function (evt) {
        evt = evt || window.event;
        if (!evt.ctrlKey && evt.keyCode == 13) {
            var str = text.value;
            var wasTruncated = false;
            if (str.length > 500)
            {

                str = str.substring(0, 499);
                wasTruncated = true;

            }
            if (userInformation.name)
            {
                if (isGoodMessage(str))
                {
                    sendMessage(str);
                    addMyMessage(str);
                    if (wasTruncated)
                    {
                        addAdminMessage("The message was truncated to the maximum length of 500 characters.");
                    }
                    text.value = "";
                }
            } else
            {
                addAdminMessage("You must enter a username before you can message!");
            }
        }
        isTyping();
    };

    var showingUsers = true;
    function showUsers()
    {
        users.div.style.display = 'block';
        divInputText.style.borderBottomRightRadius = '0px';
        if (useCalc)
        {
            divMain.style.marginRight = '2px';
            divMain.style.width = 'calc(100% - 156px)';
        }
        showingUsers = true;
    }
    function hideUsers()
    {
        users.div.style.display = 'none';
        divInputText.style.borderBottomRightRadius = '4px';
        if (useCalc)
        {
            divMain.style.marginRight = '0px';
            divMain.style.width = 'calc(100% - 4px)';
        }
        showingUsers = false;
    }
    if (roomInformation.type == Room.Type.pm)
    {
        hideUsers();
    } else
    {

        if (!isMobile)
            showUsers();
        else
            hideUsers();
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
    function showFont()
    {
        if (callbacksFont)
        {
            if (callbacksFont.unminimize)
            {
                callbacksFont.unminimize();
            }
        }
    }
    function showEmoticons()
    {
        if (callbacksEmoticons)
        {
            if (callbacksEmoticons.unminimize)
            {
                callbacksEmoticons.unminimize();
            }
        }
    }
    function showProfileEditor()
    {
        if (callbacksProfileEditor)
        {
            if (callbacksProfileEditor.show)
            {
                console.log('doing it');
                callbacksProfileEditor.show();
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
                    }}, roomInformation.name);
            }
        }
    }
    function showSoundEffects()
    {
        if (callbacksSoundEffects)
        {
            if (callbacksSoundEffects.unminimize)
            {
                callbacksSoundEffects.unminimize();
            }
        }
    }
    this.div.appendChild(divInner);
    divInner.appendChild(divTab);
    divInner.appendChild(divMain);
    divInner.appendChild(users.div);
    divMain.appendChild(divFeed);
    divMain.appendChild(divControls);
    divControls.appendChild(divControlsInner);
    divMain.appendChild(divInputText);
    divTab.appendChild(divName);
    divControlsInner.appendChild(divUsers);
    divUsers.appendChild(imgUsers);
    if (roomInformation.type != Room.Type.videoStatic && roomInformation.type != Room.Type.videoDynamic && roomInformation.type != Room.Type.videoPm)
    {
        divControlsInner.appendChild(divFont);
        divControlsInner.appendChild(divUploadImage);
        divUploadImage.appendChild(imgUploadImage);
        divControlsInner.appendChild(divEmoticons);
        divEmoticons.appendChild(imgEmoticons);
        divInputText.appendChild(text);
        divControlsInner.appendChild(divSoundEffects);
        divSoundEffects.appendChild(imgSoundEffects);
        divControls.appendChild(divTyping);
        divTyping.appendChild(divTypingHelper);
        divTyping.appendChild(divTypingInner);
        divControlsInner.appendChild(divProfilePicture);
        divProfilePicture.appendChild(imgProfilePicture);
    } else
    {
        if (roomInformation.type == Room.Type.videoPm)
        {
            divControlsInner.appendChild(divVideoStop);
            divVideoStop.appendChild(imgVideoStop);
            divControlsInner.appendChild(divVideoStart);
            divVideoStart.appendChild(imgVideoStart);
            divControlsInner.appendChild(divSoundEffects);
            divSoundEffects.appendChild(imgSoundEffects);
        }
    }

    this.show = function ()
    {
        self.div.style.display = 'inline';

    };
    this.hide = function ()
    {
        self.div.style.display = 'none';
    };
    this.newRoomInformation = function (jObject)
    {
        if (roomInformation.type == Room.Type.videoPm)
        {
            if (jObject.accepted)
            {
                roomInformation.accepted = true;
            }
        }
    };
    var callbackFontChanged = function (font) {
        text.style.fontSize = String(font.size * (function () {
            if (isMobile)
                return Font.mobileScale;
            return 1;
        })()) + 'px';
        text.style.fontFamily = font.family;
        text.style.color = font.color;
        if (font.bold)
        {
            text.style.fontWeight = 'Bold';
        } else
        {
            text.style.fontWeight = '';
        }
        if (font.italic)
        {
            text.style.fontStyle = 'italic';
        } else
        {
            text.style.fontStyle = 'normal';
        }
        if (font.underlined)
        {
            text.style.textDecoration = 'underline';
        } else
        {
            text.style.textDecoratino = 'none';
        }
    };
    var updateFont = function () {
        if (Font.latest) {
            callbackFontChanged(Font.latest);
        }
    };
    updateFont();
    Font.addCallback(callbackFontChanged);
    function addMessage(jObject)
    {
        if (pendingMessages.unpendIfPending(jObject))
            return;
        if (addMessage.color1)
        {
            addMessage.color1 = false;
            addMessage.backgroundColor = '#e6f2ff';
        } else
        {
            addMessage.color1 = true;
            addMessage.backgroundColor = '#e6e6ff';
        }

        var div = new Message({str: jObject.content,
            callbackEmoticons: callbacksEmoticons,
            fontObj: jObject.font,
            userUuid: jObject.userId,
            username: jObject.name,
            backgroundColor: addMessage.backgroundColor,
            pending: false,
            menuMessages: menuMessages,
      userInformation:userInformation}).div;
        if (div)
        {
            divFeed.appendChild(div);
        }
        scrollFeed();
        overflowFeed();
    }
    function addMyMessage(str)
    {
        var font = callbacksFont.getFont();
        if (addMessage.color1)
        {
            addMessage.color1 = false;
            addMessage.backgroundColor = '#e6f2ff';
        } else
        {
            addMessage.color1 = true;
            addMessage.backgroundColor = '#e6e6ff';
        }

        var message = new Message({str: str,
            callbackEmoticons: callbacksEmoticons,
            fontObj: font, userUuid: userInformation.userId,
            username: userInformation.name,
            backgroundColor: addMessage.backgroundColor,
            pending: true,
            menuMessages: menuMessages});
        if (message.div)
        {
            divFeed.appendChild(message.div);
            pendingMessages.add(message);
        }
        scrollFeed();
        overflowFeed();
    }
    function addAdminMessage(str)
    {
        var div = new Message({str: str,
            callbackEmoticons: callbacksEmoticons,
            fontObj: {color: "#4e0000", font: "Arial", bold: true, italic: false, size: 10},
            username: "Admin",
            backgroundColor: addMessage.backgroundColor,
            pending: false,
            menuMessages: menuMessages});
        if (div)
        {
            divFeed.appendChild(div);
        }
        scrollFeed();
        overflowFeed();
    }
    function addImageMessage(name, path)
    {
        if (name == userInformation.name)
        {
            name = 'You';
        }
        addAdminMessage(name + " sent image:");
        var div = new ImageMessage(name, path, addMessage.backgroundColor);
        if (div)
        {
            divFeed.appendChild(div);
        }
        scrollFeed();
        overflowFeed();
    }
    function sendMessage(str)
    {
        var jObject = {};
        jObject.type = 'message';
        jObject.content = str;
        jObject.font = callbacksFont.getFont();
        jObject.name = userInformation.name;
        if (roomInformation.type == Room.Type.pm)
        {
            console.log("notify");
            jObject.notify = true;
        }
        if (websocket)
        {
            websocket.send(jObject);
        }
    }
    function overflowFeed()
    {
        while (divFeed.children.length > 600) {
            divFeed.removeChild(divFeed.firstChild);
        }
    }
    function scrollFeed()
    {

        divFeed.scrollTop = divFeed.scrollHeight;
    }
    this.insertEmoticon = function (string)
    {
        var index = text.selectionStart;
        if (!index)
        {
            index = text.value.length;
        }
        var str = text.value;
        str = str.insert(index, string);
        text.value = str;
        focusText();
        index += string.length;
        text.setSelectionRange(index, index);
    };
    this.sendSoundEffect = function (url, name)
    {
        var jObject = {};
        jObject.type = 'sound';
        jObject.url = url;
        jObject.sound_name = name;
        jObject.name = userInformation.name;
        websocket.send(jObject);
        if (roomInformation.type == Room.Type.dynamic || roomInformation.type == Room.Type.static || roomInformation.type == Room.Type.pm)
        {
            addAdminMessage("you sent sound: " + jObject.sound_name);
        }
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
            if (roomInformation.message)
            {
                interpret(roomInformation.message);
                self.task.attention();
            }
        } else
        {
            if (jObject.reason && enterPassword)
            {
                enterPassword.setError(jObject.reason);
            }
        }
    };
    function gotVideo(jObject)
    {
        switch (jObject.webcam_type)
        {
            case "request":
                video.recievedOffer(jObject);
                break;
            case "ice":
                video.recievedIce(jObject);
                break;
            case "reply":
                if (jObject.accepted)
                {
                    video.accepted(jObject);
                } else

                {

                }
                break;
            case "video_connect":
                if (roomInformation.accepted)
                {
                    video.connect();
                }
                break;
            case "video_disconnect":
                if (video.connected)
                {
                    video.disconnect();
                }
                break;
        }

    }
    function sendDisconnect()
    {
        var jObject = {};
        jObject.type = 'video';
        jObject.webcam_type = 'video_disconnect';
        websocket.send(jObject);
    }
    function getUsers()
    {
        var jObject = {};
        jObject.type = 'users';
        jObject.roomUuid = roomInformation.roomUuid;
        websocket.send(jObject);
    }
    function gotMessage(jObject)
    {
        if (!Ignore.isIgnored(jObject.userId))
        {
            if (roomInformation.type == Room.Type.pm)
            {
                self.task.attention();
                SoundEffects.pm();
            } else
            {
                SoundEffects.message();
            }
            addMessage(jObject);
        }
    }
    var timerGotTyping;
    function gotTyping(jObject)
    {
        if (!Ignore.isIgnored(jObject.userId))
        {
            if (!timerGotTyping)
            {
                timerGotTyping = new Timer(function () {
                    setText(divTypingInner, "");
                }, 3000, 1);
            } else
            {
                timerGotTyping.reset();
            }
            setText(divTypingInner, jObject.from + " is typing..");
        }
    }
    function gotUsers(jObject)
    {
        if (roomInformation.type == Room.Type.videoPm)
        {
            if ((jObject.users.indexOf(roomInformation.otherUserId) < 0) && video && video.connected)
            {
                video.disconnect();
            }
        } else
        {
            if (videos)
            {
                videos.updateUsers(jObject);
            }
        }
        users.listUsers(jObject.users);
    }
    function gotSound(jObject)
    {
        if (!Ignore.isIgnored(jObject.userId))
        {
            SoundEffects.playUserSoundEffect(jObject.url);
            if (roomInformation.type == Room.Type.dynamic || roomInformation.type == Room.Type.static || roomInformation.type == Room.Type.pm)
            {
                addAdminMessage(jObject.name + " sent sound: " + jObject.sound_name);
            }
        }
    }
    function gotImage(jObject)
    {
        if (!Ignore.isIgnored(jObject.userId))
        {
            addImageMessage(jObject.name, jObject.path);
        }
    }
    function initializeWebsocket()
    {
        websocket = new MySocket("chat_room");
        websocket.onopen = function () {
            if (roomInformation.has_password)
            {
                enterPassword = new EnterPassword(divFeed, function (password) {
                    connect(password);
                }, close);
            } else
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
        console.log("connecting");
        spinner.show();
        var jObject = {};
        jObject.type = "connect";
        if (password && password.length > 0)
        {
            jObject.password = password;
        }
        jObject.user_id = userInformation.id;
        jObject.roomUuid = roomInformation.roomUuid;
        websocket.send(jObject);
    }
    function interpret(jObject)
    {
        switch (jObject.type)
        {
            case "message":
                gotMessage(jObject);
                break;
            case "typing":
                gotTyping(jObject);
                break;
            case "connect":
                onConnect(jObject);
                break;
            case "users":
                gotUsers(jObject);
                break;
            case "video":
                if (videos)
                {
                    videos.recieved(jObject);
                } else
                {
                    gotVideo(jObject);
                }
                break;
            case "sound":
                gotSound(jObject);
                break;
            case "image":
                gotImage(jObject);
                break;
            case "upload_image":
                callbacksImageUploader.interpret(jObject);
                break;
            case "finished_loading":
                spinner.hide();
                break;
        }

    }
    makeUnselectable(this.div);
    makeTextSelectable(divFeed);
    themesObject = {components: [
            {name: 'controls', elements: [divControls]},
            {name: 'feed', elements: [divFeed]},
            {name: 'body', elements: [divMain]},
            {name: 'text', elements: [divName]}
        ],
        callback: function (theme) {

        }
    };
    Themes.register(themesObject, undefined);
    initializeWebsocket();
    themesObjectWindow = Window.style(self.div, divInner, divTab);
    var windowInformation = new WindowInformation(true, true, minWidth, minHeight, Windows.maxWidthPx, Windows.maxHeightPx, 0, 100, 0, Windows.maxYPx, true, true, false);
    var windowCallbacks = new WindowCallbacks(function () {
        if (videos)
        {
            videos.resize();
        }
        else {
            scrollFeed();
        }
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
        settings.set("size", [self.div.offsetWidth, self.div.offsetHeight]);
    }, function () {
        settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
    }
    ,
            function () {
                self.task.minimize();
            },
            function () {
                self.task.maximize();
                if (videos)
                {
                    videos.resize();
                }
                focusText();
            },
            function () {
                close();
            }, function (zIndex) {
        settings.set("zIndex", zIndex);
    },
            function () {
            },
            function () {
            },
            function () {
            },
            function () {
                focusText();
            });
    var params = {obj: this,
        minimized: false,
        divTab: divTab,
        divInner: divInner,
        windowInformation: windowInformation,
        callbacks: windowCallbacks};
    Windows.add(params);
    TaskBar.add(this);
    if (roomInformation.type == Room.Type.pm && roomInformation.username != userInformation.name)
    {
        self.hide();
        if (roomInformation.message)
        {
            self.task.attention();
        }
        self.task.flash();
    }
    if (roomInformation.show)
        self.task.unminimize();
    function focusText() {
        console.log('focus');
        new Task(function () {
            text.focus();
        }).run();
    }
}
Room.Type = {static: 'static', dynamic: 'dynamic', pm: 'pm', videoStatic: 'video_static', videoDynamic: 'video_dynamic', videoPm: 'video_pm'};