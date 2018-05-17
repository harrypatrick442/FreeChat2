function ProfilesDisplay(mySocketProfiles, messenger, callbacks)
{
    var self = this;
    var currentLatLng;
    var terminal = messenger.getTerminal(interpret);
    var settings = new Settings('#ProfilesDisplay');
    var rectangle = new Rectangle(new Dimension([100], Dimension.Type.Percent), new Dimension([], Dimension.Type.Auto));
    var genericWindow = new GenericWindow(/*name*/'Profile search', /*tooltipMessage*/'Used to pick location', /*iconPath*/'images/profiles_logo.png', /*minWidth*/150, /*maxWidth*/1000, /*minHeight*/200, /*maxHeight*/1000, /*defaultWidth*/500, /*defaultHeight*/500, /*defaultX*/200, /*defaultY*/200, /*minimized*/false, /*minimizable*/true, /*maximizable*/true, /*minimizeOnClose*/true);
    var entriesDisplay = new EntriesDisplay(function(r) {
        return r.userId;
    },
            function(r) {
                ProfileEntryBuilder(r, rectangle, callbacks.openProfile);
            },
            'userId');
    var divSearch = document.createElement('div');
    var divSearchWrapper = document.createElement('div');
    var divEntries = document.createElement('div');
    var settingsHeight = 24;
    divSearchWrapper.style.height = String(settingsHeight+2) + 'px';
    divSearch.style.width = '100%';
    divSearch.style.height = 'calc(100% - 2px)';
    divSearchWrapper.style.width = '100%';
    divEntries.style.height = 'calc(100% - ' + String(settingsHeight+4) + 'px)';
    divEntries.style.width = '100%';
    divEntries.style.top =String(settingsHeight+4) +'px';
    var buttonUpdate = createSettingsButton('images/reload.png', 'images/reload_hover.png', updateProfiles);
    var buttonLocation = createSettingsButton('images/location_picker_icon.png', 'images/location_picker_icon_blue.png', showLocationPicker);
    var buttonTheirProfile = createSettingsButton('images/user_info.png', 'images/user_info_blue.png', showTheirProfile);
    var buttonGender = createSettingsButton('images/gender.png', 'images/gender_hover.png', showGender);
    var buttonInterests = createSettingsButton('images/interests.png', 'images/interests_hover.png', showInterests);
    var searchObject;
    var previousPercent = 100;
    genericWindow.onresize = function()
    {
        resizeEntryWidth();
    };
    new Task(resizeEntryWidth).run();
    function resizeEntryWidth()
    {
        var nWide = Math.floor(divSearch.offsetWidth / ProfileEntryBuilder.minWidth);
        if (nWide < 1)
            nWide = 1;
        var percentWide = 100 / nWide;
        if (percentWide != previousPercent)
        {
            rectangle.setWidth(new Dimension([percentWide], Dimension.Type.Percent));
            console.log(percentWide);
            previousPercent=percentWide;
        }
    }
    genericWindow.divMain.appendChild(divSearchWrapper);
    divSearchWrapper.appendChild(divSearch);
    divSearch.appendChild(buttonUpdate);
    divSearch.appendChild(buttonLocation);
    divSearch.appendChild(buttonTheirProfile);
    divSearch.appendChild(buttonGender);
    divSearch.appendChild(buttonInterests);
    genericWindow.divMain.appendChild(divEntries);
    divEntries.appendChild(entriesDisplay.div);





    var popupTheirProfile = new Popup(divSearch, 'absolute', false, {width: '100%', height: 'auto', left: '0px', top: '24px'});
    popupTheirProfile.div.style.minHeight = '10px';
    var popupGender = new Popup(divSearch, 'absolute', false, {width: '100%', height: 'auto', left: '0px', top: '24px'});
    popupGender.div.style.minHeight = '10px';
    var divTheirProfile = document.createElement('div');
    var divGender = document.createElement('div');

    stylePopupFrame(divTheirProfile);
    stylePopupFrame(divGender);



    var sliderUnitDistance;
    sliderUnitDistance = new SliderUnit(function(value) {
        searchObject.distance=(value<=100?value:undefined);
        saveSearchObject();
        setText(sliderUnitDistance.divValue, 'Distance: ' + ((value > 100) ? "Any" : String(value) + 'Km'));
    }, 1, 101, 1, 120);
    var sliderUnitAge;
    sliderUnitAge = new SliderUnit([function(value) {
            searchObject.ageFrom = value;
            saveSearchObject();
            updateAgeText();
        }, function(value) {
            searchObject.ageTo = value;
            saveSearchObject();
            updateAgeText();
        }], 18, 101, 2, 155);

    var tickBoxesEthnicity = new TickBoxes(Ethnicities.values, 'combination', '100%', '200px', "Ethnicity:");
    var tickBoxesGenderLookingFor = new TickBoxes(Genders.values, 'combination', 'auto', '200px', "I am looking for:");
    var tickBoxesGenderInterestedIn = new TickBoxes(Genders.values, 'combination', 'auto', '200px', "Interested in:");
    divTheirProfile.appendChild(tickBoxesEthnicity.div);
    divGender.appendChild(tickBoxesGenderLookingFor.div);
    divGender.appendChild(tickBoxesGenderInterestedIn.div);
    popupTheirProfile.div.appendChild(divTheirProfile);
    popupGender.div.appendChild(divGender);
    var popupInterests = new PopupInterests(divSearch, function(interests) {
        searchObject.interests = interests;
        saveSearchObject();
    });
    initSearchObject();
    popupTheirProfile.onshow = function() {
        sliderUnitDistance.slider.setValue(searchObject.distance);
        sliderUnitAge.slider.setValue(searchObject.ageFrom, 0);
        sliderUnitAge.slider.setValue(searchObject.ageTo, 1);
    };
    mySocketProfiles.addEventListener('message', _interpret);
    function _interpret(e)
    {
        var message = e.message; 
        interpret(message);
    }
    function interpret(message)
    {
        switch (message.type)
        {
            case 'search':
                entriesDisplay.update(message.profiles);
                break;
            case "set_location":
                currentLatLng=message.latLng;
                break;
        } 
    }
    function createSettingsButton(srcImg, srcImgHover, clickCallback)
    {
        var div = document.createElement('div');
        var img = document.createElement('img');
        div.style.position = 'relative';
        div.style.height = String(settingsHeight) + 'px';
        div.style.minWidth = String(settingsHeight) + 'px';
        div.style.float = 'right';
        div.style.marginRight = '5px';
        div.style.cursor = 'pointer';
        div.style.zIndex = '10';
        verticallyCenter(div);
        img.style.height = '100%';
        img.src = window.thePageUrl + srcImg;
        new Hover(img, function() {
            img.src = window.thePageUrl + srcImgHover;
        }, function() {
            img.src = window.thePageUrl + srcImg;
        });
        div.addEventListener("click", clickCallback);
        div.appendChild(img);
        return div;
    }
    function stylePopupFrame(div)
    {
        div.style.height = 'auto';
        div.style.minHeight = '10px';
        div.style.width = '100%';
        div.style.marginTop = '2px';
        div.style.marginBottom = '2px';
        div.style.position = 'relative';
        div.style.float = 'left';
    }
    function SliderUnit(callbacks, min, max, nSliders, width)
    {
        var self = this;
        this.div = document.createElement('div');
        this.div.style.position = 'relative';
        this.div.style.width = String(width) + 'px';
        this.div.style.height = '32px';
        this.div.style.margin = '3px';
        this.div.style.float = 'left';
        this.divValue = document.createElement('div');
        this.divValue.style.position = 'absolute';
        this.divValue.style.width = '100%';
        this.divValue.style.paddingLeft = '6px';
        this.divValue.style.fontSize = '12px';

        this.slider = new GenericSlider(callbacks, min, max, nSliders, '100%');
        this.slider.div.style.bottom = '0px';
        this.div.appendChild(self.divValue);
        this.div.appendChild(this.slider.div);
        divTheirProfile.appendChild(this.div);
    }
    function updateAgeText()
    {
        setText(sliderUnitAge.divValue, searchObject.ageFrom == searchObject.ageTo ? 'Age ' + String(searchObject.ageFrom) : 'Aged from ' + String(searchObject.ageFrom) + ' to ' + ((searchObject.ageTo > 100) ? "100+" : String(searchObject.ageTo)));
    }
    function saveSearchObject()
    {
        settings.set('searchObject', searchObject);
    }
    function initSearchObject()
    {
        searchObject = settings.get('searchObject');
        if (!searchObject)
            searchObject = {};
        if (!searchObject.distance)
            searchObject.distance = 50;
        if (!searchObject.ageFrom)
            searchObject.ageFrom = 18;
        if (!searchObject.ageTo)
            searchObject.ageTo = 101;
        if (searchObject.interests)
            if (searchObject.interests.like && searchObject.interests.dislike)
            {
                popupInterests.setValues(searchObject.interests);
            }
        tickBoxesEthnicity.setValues(searchObject.ethnicities);
        tickBoxesGenderLookingFor.setValues(searchObject.genderLookingFor);
        tickBoxesGenderInterestedIn.setValues(searchObject.genderInterestedIn);
    }
    function updateProfiles()
    {
        if(searchObject.distance!=undefined)
        searchObject.location=QuadTree.getQuadsForRadius(currentLatLng, searchObject.distance);
        var jObject = {type: 'search', values: searchObject};
        console.log(JSON.stringify(jObject));
        mySocketProfiles.send(jObject);
    }
    function showLocationPicker()
    {
        if (callbacks.showLocationPicker)
            callbacks.showLocationPicker(true);
    }

    function showTheirProfile()
    {
        popupTheirProfile.show();
    }
    function showInterests()
    {
        popupInterests.show();
    }
    function showGender()
    {
        popupGender.show();
    }
    var themesObject = {components: [
            {name: 'frame', elements: [popupTheirProfile.div, divSearchWrapper]},
            {name: 'frame', elements: [popupGender.div]},
            {name: 'body', elements: [divTheirProfile, divSearch]},
            {name: 'body', elements: [divGender]},
            {name: 'text', elements: [sliderUnitDistance.divValue]},
            {name: 'text', elements: [sliderUnitAge.divValue]}
        ],
        callback: function(theme) {

        }
    };
    genericWindow.onclose = function() {
        Themes.remove(themesObject);
        terminal.close();
    };
    Themes.register(themesObject);
}
ProfilesDisplay.Callbacks = function(showLocationPicker, openProfile)
{
    this.showLocationPicker = showLocationPicker;
    this.openProfile=openProfile;
};