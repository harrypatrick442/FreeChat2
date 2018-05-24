
function Videos(userInformation, callbacks)
{
    var aspectRatio = 1;
    var self = this;
    var mapUserToVideo = {};
    var arrayUsers = [];
    this.div = document.createElement('div');
    this.div.style.width = '100%';
    this.div.style.height = '100%';
    this.div.style.position = 'relative';
    this.div.style.overflow = 'hidden';
    this.showMe = function (bool)
    {
        for (var i = 0; i < arrayUsers.length; i++)
        {
            var video = mapUserToVideo[arrayUsers[i]];
            video.showMe(bool);
        }
    };
    this.updateUsers = function (jObject)
    {
        var users = jObject.users;
        var uniqueUuids = [];
        for (var i = 0; i < users.length; i++)
        {
            var user = users[i];
            if (user.userId != userInformation.userId)
            {
                var video = mapUserToVideo[user.userId];
                if (video)
                {

                }
                else
                {
                    addUser(user);
                }
                uniqueUuids.push(user.userId);
            }

        }
        var i = 0;
        while (i < arrayUsers.length)
        {
            if (uniqueUuids.indexOf(arrayUsers[i]) < 0)
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
    function remove(i)
    {
        mapUserToVideo[arrayUsers[i]].disconnect();
        var video = mapUserToVideo[arrayUsers[i]];
        self.div.removeChild(video.div);
        delete video;
        arrayUsers.splice(i, 1);
    }
    function doPresentation()
    {
        var a = 1;
        var bestPair;
        var bestCount;
        var currentMaxWidth;
        var arrayVideosVisible =[];
        for(var i=0; i<arrayUsers.length; i++)
        {
            var video = mapUserToVideo[arrayUsers[i]];
            if(video.div.style.display!='none')
            {
                arrayVideosVisible.push(video);
            }
        }
        var n = arrayVideosVisible.length;
        var minMarginTop = 10;
        var minMarginLeft = 10;
        while (true)
        {
            var b = Math.ceil(n / a);
            var maxHeightIgnoringWidth = (self.div.offsetHeight / a) - minMarginTop;
            var maxWidthIgnoringHeight = (self.div.offsetWidth / b) - minMarginLeft;
            var maxWidth;
            var maxHeight;
            if (maxHeightIgnoringWidth * aspectRatio > maxWidthIgnoringHeight)
            {
                maxWidth = maxWidthIgnoringHeight;
                maxHeight = maxWidth / aspectRatio;
            }
            else
            {
                maxHeight = maxHeightIgnoringWidth;
                maxWidth = maxHeight * aspectRatio;
            }
            if (!bestPair || !currentMaxWidth || currentMaxWidth < maxWidth)
            {
                bestPair = [maxWidth, maxHeight];
                bestCount = [b, a];
                currentMaxWidth = maxWidth;
            }
            a++;
            if (a > n)
            {
                break;
            }
        }
        var width = String(bestPair[0]) + 'px';
        var height = String(bestPair[1]) + 'px';
        var marginLeft = String((self.div.offsetWidth - (bestCount[0] * bestPair[0])) / (bestCount[0] + 1)) + 'px';
        var marginTop = String((self.div.offsetHeight - (bestCount[1] * bestPair[1])) / (bestCount[1] + 1)) + 'px';
        for (var i = 0; i < arrayVideosVisible.length; i++)
        {
            var video =  arrayVideosVisible[i];
            video.div.style.width = width;
            video.div.style.height = height;
            video.div.style.marginTop = marginTop;
            video.div.style.marginLeft = marginLeft;
        }
    }
    this.resize = function ()
    {
        doPresentation();
    };
    function addUser(toUser)
    {

        var video = new Video({
            send: function (obj)
            {
                obj.type = 'video';
                obj.from = userInformation.userId;
                obj.to = toUser.userId;
                callbacks.send(obj);
            },
            ask: function (offer)
            {
                video.accept();
            },
            connected: function ()
            {

            },
            disconnected: function ()
            {

            },
            addedStream: function ()
            {
                video.div.style.display='block';
                doPresentation();
            },
            removedStream: function ()
            {
                video.div.style.display='none';
                doPresentation();
            }
        });
        video.div.style.width = '100px';
        video.div.style.height = '100px';
        video.div.style.position = 'relative';
        video.div.style.float = 'left';
        video.div.style.backgroundColor = '#222222';
        video.div.style.display='none';
        self.div.appendChild(video.div);
        mapUserToVideo[toUser.userId] = video;
        arrayUsers.push(toUser.userId);
        sendReady(toUser);
    }
    function sendReady(toUser)
    {
        var jObject = {};
        jObject.type = 'video';
        jObject.webcam_type = 'ready';
        jObject.to = toUser.userId;
        jObject.from = userInformation.userId;
        callbacks.send(jObject);
    }
    this.recieved = function (jObject)
    {
        var video = mapUserToVideo[jObject.from];
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
                case "video_connect":
                    video.connect(jObject);
                    break;
                case "video_disconnect":
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
        Videos.instances.splice(Videos.instances.indexOf(self), 1);
    };
    Videos.instances.push(self);
}
Videos.instances = [];
Videos.showMe = function (bool)
{
    for (var i = 0; i < Videos.instances.length; i++)
    {
        var videos = Videos.instances[i];
        videos.showMe(bool);
    }
};