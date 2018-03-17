
function Datas(userInformation, callbacks)
{
    var self = this;
    var mapUserToData = {};
    var arrayUsers = [];
    this.updateUsers = function (jObject)
    {
        var users = jObject.users;
        var usernames = [];
        for (var i = 0; i < users.length; i++)
        {
            var user = users[i];
            if (user.name != userInformation.name)
            {
                var video = mapUserToData[user.name];
                if (video)
                {

                }
                else
                {
                    addUser(user);
                }
                usernames.push(user.name);
            }

        }
        var i = 0;
        while (i < arrayUsers.length)
        {
            if (usernames.indexOf(arrayUsers[i]) < 0)
            {
                //remove user
                remove(i);
            }
            else
            {
                i++;
            }
        }
        doPresentation();
    };
    function remove(user)
    {
        mapUserToData[arrayUsers[user]].disconnect();
        var video = mapUserToData[arrayUsers[user]];
        self.div.removeChild(video.div);
        delete video;
        arrayUsers.splice(user, 1);
    }
    function addUser(toUser)
    {

        var data = new Data({
            send: function (obj)
            {
                obj.type = 'data';
                obj.from = userInformation.name;
                obj.to = toUser.name;
                callbacks.send(obj);
            },
            ask: function (offer)
            {
                data.accept();
            },
            connected: function ()
            {

            },
            disconnected: function ()
            {

            },
            addedStream: function ()
            {
                data.div.style.display='block';
                doPresentation();
            },
            removedStream: function ()
            {
                data.div.style.display='none';
                doPresentation();
            }
        });
        mapUserToData[toUser.name] = data;
        arrayUsers.push(toUser.name);
        sendReady(toUser);
    }
    function sendReady(toUser)
    {
        var jObject = {};
        jObject.type = 'data';
        jObject.data_type = 'ready';
        jObject.to = toUser.name;
        jObject.from = userInformation.name;
        callbacks.send(jObject);
    }
    this.recieved = function (jObject)
    {
        var video = mapUserToData[jObject.from];
        if (video)
        {
            console.log(jObject.webcam_type);
            switch (jObject.webcam_type)
            {
                case "do_connect":
                    video.connect();
                    break;
                case "ice":
                    video.recievedIce(jObject);
                    break;
                case "data_connect":
                    video.connect(jObject);
                    break;
                case "data_disconnect":
                    video.disconnect(jObject);
                    break;
                case "request":
                    video.recievedOffer(jObject);
                    break;
                case "reply":
                    video.accepted(jObject);
                    break;

            }
        }
    };
    this.dispose = function ()
    {
        for(var i=0; i<arrayUsers.length; i++)
        {
            remove(i);
        }
        Datas.instances.splice(Datas.instances.indexOf(self), 1);
    };
    Datas.instances.push(self);
}
Datas.instances = [];
Datas.showMe = function (bool)
{
    for (var i = 0; i < Datas.instances.length; i++)
    {
        var videos = Datas.instances[i];
        videos.showMe(bool);
    }
};