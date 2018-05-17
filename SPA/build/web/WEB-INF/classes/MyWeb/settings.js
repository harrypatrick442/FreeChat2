function Settings(settingsName, callbackReset)
{
    this.get = function (name)
    {
        try
        {
        //return JSON.parse(getCookie(settingsName + '_' + name));
        return JSON.parse(localStorage.getItem(settingsName + '_' + name));
    }
    catch(ex)
    {
        return undefined;
    }
    };
    this.set = function (name, obj)
    {
        try
        {
        //setCookie(settingsName + '_' + name, JSON.stringify(obj));
        localStorage.setItem(settingsName + '_' + name, JSON.stringify(obj));
    }
   catch(ex)
   {
       console.log(ex);
   }
    };
    this.reset=callbackReset;
    Settings.instances.push(this);
}
Settings.getAll=function(){
    return localStorage;
};
Settings.addRange=function(obj)
{
    for(var key in obj)
    {
        localStorage.setItem(key, JSON.stringify(obj[key]));
    }
};
Settings.instances=[];
Settings.resetAll = function ()
{
    
};
console.log('settings is done');