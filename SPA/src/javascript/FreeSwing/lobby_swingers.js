/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function LobbySwingers(callbackFinishedLoading, otherCallbacks)
{
    var messenger = new Messenger();
    var terminal = messenger.getTerminal(interpret);
    var locationPicker = new LocationPicker(messenger);
    var mySocketProfiles = otherCallbacks.getMySocketProfiles();
    var mapUserIdToProfile = {};
    mySocketProfiles.addEventListener('message', function(e) {
        interpret(e.message);
    });
    var profilesDisplay = new ProfilesDisplay(mySocketProfiles, messenger, new ProfilesDisplay.Callbacks(function() {
        locationPicker.show(true);
    }, showProfile));
    var profileEditor;
    function showProfile(userId) {
        var profile = mapUserIdToProfile[userId];
        if (!profile)
        {
            profile = new Profile(userId, messenger, false, mySocketProfiles);
            profile.addEventListener('close', (function(userId) {
                delete mapUserIdToProfile[userId];
            }).bind(null, userId));
            mapUserIdToProfile[userId] = profile;
        }
        else
            profile.bringToFront();
    }
    LobbySwingers.showMyProfile = function(){
        new Task(function(){console.log('show');profileEditor.show();}).run();
    };
    function interpret(jObject)
    {
        switch (jObject.type)
        {
            case "authenticate":
                gotAuthenticate(jObject);
                break;
            case "set_location":
                mySocketProfiles.send(jObject);
                break;
            case "image_uploader_reply":
                ImageUploader.interpret(jObject);
                break;
        }
    }
    ;
    function gotAuthenticate(jObject)
    {
        if (jObject.successful)
        {
            profileEditor = new Profile(jObject.userId, messenger, true, mySocketProfiles, new Profile.Callbacks(function() {
                locationPicker.show(true);
            },
                    function()
                    {
                        ImageUploader.show(true, 1, {}, {send: function(jObject) {
                                jObject.type = 'profile_picture';
                                mySocketProfiles.send(jObject);
                            }}, 'Add Profile Picture');
                    }));
        }

    }
    callbackFinishedLoading();
}
