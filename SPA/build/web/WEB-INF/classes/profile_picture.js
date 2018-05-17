function ProfilePicture(usersName)
{
    this.usersName = usersName;
    this.div = document.createElement('div');
    var img = document.createElement('img');
    this.div.style.height = '100%';
    this.div.style.width = '100%';
    img.src = window.thePageUrl+'images/user.png';
    img.style.height = '100%';
    img.style.width = '100%';
    img.onerror = function () {
        img.src = window.thePageUrl+'images/user.png';
    };
    this.set = function (url)
    {
        img.src = window.thePageUrl+url;
    };
    this.div.appendChild(img);
    var instances = ProfilePicture.mapNameToInstances[usersName];
    if (!instances)
    {
        instances = [];
        ProfilePicture.mapNameToInstances[usersName] = instances;
    }
    var url = ProfilePicture.mapNameToUrl[usersName];
    if (url)
    {
        img.src = window.thePageUrl+url;
    }
    instances.push(this);
}
ProfilePicture.mapNameToUrl = {};
ProfilePicture.mapNameToInstances = {};
ProfilePicture.update = function (usersName, url)
{
    console.log('updating');
    ProfilePicture.mapNameToUrl[usersName] = url;
    var instances = ProfilePicture.mapNameToInstances[usersName];
    if (instances)
    {
        for (var i = 0; i < instances.length; i++)
        {
            var instance = instances[i];
            instance.set(url);
        }
    }
};
ProfilePicture.remove = function (instance)
{
    var instances = ProfilePicture.mapNameToInstances[instance.usersName];
    if (instances)
    {
        instances.splice(instances.indexOf(instance), 1);
        if (instances.length < 1)
        {

            //if (ProfilePicture.mapNameToUrl[instance.usersName])
            //{
            //    delete ProfilePicture.mapNameToUrl[instance.usersName];
            //}
            delete ProfilePicture.mapNameToInstances[instance.usersName];
        }
    }
};