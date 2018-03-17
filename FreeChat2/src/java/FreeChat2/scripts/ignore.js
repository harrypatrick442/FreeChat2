function Ignore()
{
    
}
Ignore.ignore=function(name)
{
    var index = Ignore.users.indexOf(name);
    if(index<0)
    {
        Ignore.users.push(name);
    }
};
Ignore.unignore=function(name)
{
    var index = Ignore.users.indexOf(name);
    if (index >= 0)
    {
        Ignore.users.splice(index, 1);
    }
};
Ignore.users = [];
Ignore.isIgnored = function (name)
{
    if (Ignore.users.indexOf(name) >= 0)
    {
        return true;
    }
    return false;
};