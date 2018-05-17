function Profile(userId, messenger, editor, mySocketProfiles, callbacks)
{
    EventEnabledBuilder(this);
    var closeEvent = new CustomEvent("close");
    var self = this;
    var settings = new Settings('#ProfileEditor');
    var terminal = messenger.getTerminal(interpret);
    var genericWindow = new GenericWindow(/*name*/'Profile Editor', /*tooltipMessage*/'Used to pick location', /*iconPath*/'images/profiles_logo.png', /*minWidth*/150, /*maxWidth*/1000, /*minHeight*/200, /*maxHeight*/1000, /*defaultWidth*/500, /*defaultHeight*/500, /*defaultX*/200, /*defaultY*/200, /*minimized*/false, /*minimizable*/true, /*maximizable*/true, /*minimizeOnClose*/editor);
    var divMainInner = document.createElement('div');
    var divCrossingColor = document.createElement('div');
    var spinner = new Spinner(1);
    spinner.div.style.position = 'absolute';
    spinner.div.style.width = '109px';
    spinner.div.style.height = '109px';
    spinner.div.style.left = 'calc(50% - 55px)';
    spinner.div.style.top = 'calc(50% - 55px)';
    genericWindow.divMain.appendChild(spinner.div);
    genericWindow.divMain.style.overflowY = 'auto';
    divMainInner.style.width = '100%';
    divMainInner.style.height = '100%';
    divMainInner.style.position = 'absolute';
    divMainInner.style.display = 'none';
    divCrossingColor.style.height = 'auto';
    divCrossingColor.style.width = '100%';
    divCrossingColor.style.paddingBottom = '0px';
    divCrossingColor.style.position = 'relative';
    divCrossingColor.style.float = 'left';
    var textBoxes = [];
    var textBoxesAutoHeight = [];
    var textBoxStatus = setupTextBox(function(text) {
        updateProfile({values: {status: text}});
    }, 255, 18, 'calc(100% - 56px)', '53px', 14, undefined);
    var textBoxStatusHeading = setupTextBox(undefined, undefined, 18, '50px', '3px', 14, 'Status:');
    textBoxStatus.div.style.backgroundColor = 'rgba(255,255,255,0.30)';
    textBoxStatusHeading.div.style.backgroundColor = 'rgba(255,255,255,0.30)';
    var divStatus = getSurroundDiv();
    textBoxStatusHeading.div.style.position = 'absolute';
    textBoxStatus.div.style.position = 'absolute';
    divStatus.appendChild(textBoxStatusHeading.div);
    divStatus.appendChild(textBoxStatus.div);
    divStatus.style.position = 'relative';
    divStatus.style.minHeight = '23px';
    var divInfo = getSurroundDiv();
    var textBoxUsername = setupTextBox(undefined, undefined, 14, 'calc(100% - 6px)', '3px', 12, undefined, undefined);
    var textBoxJoined = setupTextBox(undefined, undefined, 14, 'calc(100% - 6px)', '3px', 12, undefined, undefined);
    var textBoxLocation = setupTextBox(undefined, undefined, 14, 'auto', '3px', 12, 'Location: please select', undefined);
    var textBoxAge = setupTextBox(undefined, undefined, 14, 'calc(100% - 6px)', '3px', 12, undefined, undefined);
    textBoxLocation.div.style.marginTop = '0px';

    var textBoxLastOnline = setupTextBox(undefined, undefined, 14, 'calc(100% - 6px)', '3px', 12, editor ? 'Last active: Now' : undefined, undefined);
    var divLocation = getSurroundChildDiv('14px');
    divLocation.style.marginBottom = '0px';
    divLocation.appendChild(textBoxLocation.div);
    if (editor)
    {
        var editButtonLocation = new EditButton(function() {
            if (callbacks.showLocationPicker)
                callbacks.showLocationPicker();
        }, true);
        editButtonLocation.div.style.right = '-4px';
        editButtonLocation.div.style.position = 'relative';
        editButtonLocation.div.style.float = 'left';
        editButtonLocation.div.style.top = '-2px';
        editButtonLocation.div.style.minHeight = '18px';
        divLocation.appendChild(editButtonLocation.div);
    }
    textBoxJoined.div.style.marginBottom = '2px';
    var divImagesDisplay = getSurroundDiv();
    var imagesDisplay = new ImagesDisplay(window.thePageUrl + 'images/profile/', [], editor ? callbacks.showImageUploader : undefined,
            function(operation) {
                var jObject = {type: 'profile_picture_operation', operation: operation};
                mySocketProfiles.send(jObject);
            });
    imagesDisplay.div.style.width = 'calc(100%)';
    imagesDisplay.div.style.height = '140px';
    imagesDisplay.div.style.position = 'relative';
    imagesDisplay.div.style.float = 'top';
    genericWindow.onresize = resized;
    var divAbout = getSurroundDiv();
    var textBoxAboutHeading = setupTextBox(undefined, undefined, 14, '150px', '3px', 12, 'About: ');
    var textBoxAbout = setupTextBox(function(text) {
        updateProfile({values: {about: text}});
    }, 10000, 14, 'calc(100% - 6px)', '3px', 12, undefined, true, true, 20);
    var divParameters = getSurroundDiv();
    var divInterestsLike = getSurroundDiv();
    var divInterestsDislike = getSurroundDiv();
    var textBoxInterestsLike = setupTextBox(undefined, undefined, 14, 'calc(100% - 6px)', '3px', 12, 'Likes: None', true);
    var textBoxInterestsDislike = setupTextBox(undefined, undefined, 14, 'calc(100% - 6px)', '3px', 12, 'Dislikes: None', true);
    genericWindow.divMain.appendChild(divMainInner);
    divMainInner.appendChild(divCrossingColor);
    divCrossingColor.appendChild(divStatus);
    divCrossingColor.appendChild(divInfo);
    divInfo.appendChild(textBoxUsername.div);
    divInfo.appendChild(textBoxLastOnline.div);
    divInfo.appendChild(divLocation);
    divInfo.appendChild(textBoxJoined.div);
    divInfo.appendChild(textBoxAge.div);
    divCrossingColor.appendChild(divImagesDisplay);
    divImagesDisplay.appendChild(imagesDisplay.div);
    divCrossingColor.appendChild(divAbout);
    divAbout.appendChild(textBoxAboutHeading.div);
    divAbout.appendChild(textBoxAbout.div);
    divCrossingColor.appendChild(divInterestsLike);
    divInterestsLike.appendChild(textBoxInterestsLike.div);
    divCrossingColor.appendChild(divInterestsDislike);
    divInterestsDislike.appendChild(textBoxInterestsDislike.div);
    if (editor)
    {
        var editButtonInterestsLike = new EditButton(showPopupInterests, true);
        var editButtonInterestsDislike = new EditButton(showPopupInterests, true);
        divInterestsLike.appendChild(editButtonInterestsLike.div);
        divInterestsDislike.appendChild(editButtonInterestsDislike.div);
    }
    var popupInterests = new PopupInterests(divCrossingColor, function(interests) {
        setInterestsText(interests);
        updateProfile({values: {interests: interests}});
    });
    var liveLastActive;
    mySocketProfiles.addEventListener('message', _interpret);
    spinner.center();
    spinner.show();
    function _interpret(e)
    {
        var message = e.message;
        interpret(message);
    }
    function interpret(message)
    {
        switch (message.type)
        {
            case 'get_profile':
                if (message.userId == userId)
                {
                    setProfile(message);
                }
                break;
            case 'profile_picture_add':
                imagesDisplay.addImage(message.picture);
                break;
            case 'set_location':
                if (editor)
                    textBoxLocation.setValue('Location: ' + message.formattedAddress);
                break;
        }
    }
    function updateProfile(jObject)
    {
        jObject.type = 'update_profile';
        mySocketProfiles.send(jObject);
    }
    var themesObject = {components: [
            {name: 'frame', elements: [divCrossingColor]},
            {name: 'body', elements: [divStatus, divInfo, divImagesDisplay, divAbout, divInterestsLike, divInterestsDislike]}
            //{name: 'body', elements: [divTheirProfile]},
            //{name: 'body', elements: [divGender]},
            //{name: 'text', elements: [sliderUnitDistance.divValue]},
            //{name: 'text', elements: [sliderUnitAge.divValue]}
        ],
        callback: function(theme) {

        }
    };
    genericWindow.onclose = function() {
        mySocketProfiles.removeEventListener('message', interpret);
        Themes.remove(themesObject);
        terminal.close();
        for (var i = 0; i < textBoxes.length; i++)
        {
            textBoxes[i].close();
        }
        liveLastActive.close();
        self.dispatchEvent(closeEvent);
    };
    this.bringToFront = function()
    {
        Windows.bringToFront(genericWindow);
    };
    Themes.register(themesObject);
    (function loadProfile() {
        mySocketProfiles.send({type: 'get_profile', userId: userId});
    })();

    function getSurroundDiv()
    {
        var div = document.createElement('div');
        div.style.position = 'relative';
        div.style.height = 'auto';
        div.style.width = '100%';
        div.style.float = 'left';
        div.style.marginBottom = '2px';
        return div;
    }
    function getSurroundChildDiv(heightString)
    {
        var div = document.createElement('div');
        div.style.position = 'relative';
        div.style.height = heightString ? heightString : 'auto';
        div.style.width = '100%';
        div.style.float = 'left';
        div.style.marginTop = '3px';
        return div;
    }
    function setupTextBox(callback, maxLength, height, widthString, leftString, fontSize, initialText, multiline, minHeight)
    {
        var autoSize = (multiline ? true : (widthString.indexOf('auto') >= 0 ? true : false));
        var textBox = new TextBox(editor ? callback : undefined, multiline, autoSize, fontSize, true, initialText, maxLength, minHeight);
        textBox.div.style.height = autoSize && multiline ? 'auto' : String(height) + 'px';
        if (minHeight)
        {
            textBox.div.style.minHeight = String(minHeight) + 'px';
        }
        textBox.div.style.width = widthString;
        textBox.div.style.left = leftString;
        textBox.div.style.position = 'relative';
        textBox.div.style.marginTop = '3px';
        textBoxes.push(textBox);
        if (autoSize && multiline)
            textBoxesAutoHeight.push(textBox);
        return textBox;
    }
    function resized()
    {

        imagesDisplay.resized;
        for (var i = 0; i < textBoxesAutoHeight.length; i++)
        {
            textBoxesAutoHeight[i].resize();
        }
    }
    function setProfile(jObject)
    {
        var values = jObject.values;
        for (var i in values)
        {
            switch (i)
            {
                case 'username':
                    textBoxUsername.setValue('Username: ' + values[i]);
                    break;
                case 'about':
                    textBoxAbout.setValue(values[i]);
                    break;
                case 'status':
                    textBoxStatus.setValue(values[i]);
                    break;
                case 'joined':
                    textBoxJoined.setValue('Joined: ' + Activity.getJoined(values[i]).str);
                    break;
                case 'formattedAddress':
                    textBoxLocation.setValue('Location: ' + values[i]);
                    break;
                case 'lastActive':
                    if (!editor)
                    {
                        if (!liveLastActive)
                            liveLastActive = new Activity.LiveLastActive(userId, values[i], function(lastOnline) {
                                textBoxLastOnline.setValue('Last active: ' + lastOnline.str);
                            });
                    }
                    break;
                case 'interests':
                    popupInterests.setValues(values[i]);
                    setInterestsText(values[i]);
                    break;
                case 'pictures':
                    imagesDisplay.addImages(values[i]);
                    break;
                case 'birthday':
                    textBoxAge.setValue('Age: ' + Activity.getAge(values[i]));
                    break;
            }
        }
        divMainInner.style.display = 'inline';
        spinner.hide();
        resized();
    }
    function showPopupInterests()
    {
        popupInterests.show();
    }
    function setInterestsText(interests)
    {
        for (var setKey in interests)
        {
            var set = interests[setKey];
            var first = true;
            var str = '';
            for (var i = 0; i < set.length; i++)
            {
                if (first)
                    first = false;
                else
                    str += ',  ';
                str += Interests.txtFromValue(set[i]);
            }
            if (setKey == 'like')
                textBoxInterestsLike.setValue('Likes: ' + str);
            else
                textBoxInterestsDislike.setValue('Dislikes: ' + str);
        }
    }
}
Profile.Callbacks = function(showLocationPicker, showImageUploader)
{
    this.showLocationPicker = showLocationPicker;
    this.showImageUploader = showImageUploader;
};