/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function Lobby()
{
    var optionPane;
    var lobbies = [];
    var themePicker = new ThemePicker();
    var contact = new Contact();
    var radio = new Radio(Configuration.radioChannelsXmlString);
    if (!window.isCors)
        Themes.register({components: [
                {name: 'background', elements: [document.body]}
            ],
            callback: function(theme) {

            }}, undefined);
    var spinnerLoading = new Spinner(1);
    spinnerLoading.show();
    document.documentElement.appendChild(spinnerLoading.div);
    spinnerLoading.center();
    spinnerLoading.div.style.zIndex = '100000';
    spinnerLoading.div.style.position = 'fixed';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    MySocket.timeoutMs = Configuration.ajaxTimeout;
    var mySocketProfiles = new MySocket('profiles');
    mySocketProfiles.addEventListener('open', function() {
        window.activity = new Activity(function() {
            var jObject = {type: 'set_user_active'};
            mySocketProfiles.send(jObject);
        }, function() {
            var jObject = {type: 'time_reference'};
            mySocketProfiles.send(jObject);
        });
    });
    mySocketProfiles.addEventListener('message', function(e)
    {
        var message = e.message;
        switch (message.type)
        {
            case "authenticate":
                if (message.successful){
                    Authenticate.hide();
                    authenticateLobbies(message);
                }
                else
                    Authenticate.error(message.reason);
                break;
            case "register":
                if (message.successful){
                    Authenticate.hide();
                    authenticateLobbies(message);
                }
                else
                    Authenticate.error(message.reason);
                break;
            case "time_reference":
                window.activity.setTimeReference(message.reference);
        }
    });
    function authenticateLobbies(jObject){
        foreach(lobbies, function(lobby){
            if(lobby.authenticate)
                lobby.authenticate(jObject);
        });
    }
    mySocketProfiles.addEventListener('close', function()
    {
        optionPane = new OptionPane(document.documentElement);
        if (Lobby.closedReason != 'spam')
        {
            optionPane.show([['Ok', function() {
                    }]], "Server was just restarted, please wait a minute then reload page!", function() {
            });
            optionPane.div.style.zIndex = '30000';
            optionPane.div.style.top = '30%';
            optionPane.div.style.position = 'fixed';
            reloadPage();
        }
    });
    var loadCount = 0;
    function finishedLoading()
    {
        loadCount--;
        if (loadCount <= 0)
        {
            getCredentials();
            spinnerLoading.hide();
            taskPreloadImages.run();
        }
    }
    function getCredentials() {
        Authenticate.acquire(function(jObject) {
            jObject.type = 'authenticate';
            mySocketProfiles.send(jObject);
        }, (Configuration.authenticationType == 'full' ? function(jObject) {
            jObject.type = 'register';
            mySocketProfiles.send(jObject);
        } : undefined));
        console.log(Configuration.authenticationType == 'full');
    }
    function getMySocketProfiles()
    {
        return mySocketProfiles;
    }
    (function initializeLobbies()
    {
        loadCount = window.lobbiesToLoad.length;
        var callbacks = {getMySocketProfiles: getMySocketProfiles};
        for (var i = 0; i < window.lobbiesToLoad.length; i++)
        {
            var LobbyFunction = lobbiesToLoad[i];
            lobbies.push(new LobbyFunction(finishedLoading, callbacks));
        }
    })();
    function reloadPage()
    {
        return;
        new Timer(function() {
            window.location.reload();
        }, 120000, 1);
    }
}