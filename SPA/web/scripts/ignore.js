function Ignore()
{
    
}
Ignore.ignore=function(userId)
{
    var index = Ignore.users.indexOf(userId);
    if(index<0)
    {
        Ignore.users.push(userId);
    }
};
Ignore.unignore=function(userId)
{
    var index = Ignore.users.indexOf(userId);
    if (index >= 0)
    {
        Ignore.users.splice(index, 1);
    }
};
Ignore.users = [];
Ignore.isIgnored = function (userId)
{
    if (Ignore.users.indexOf(userId) >= 0)
    {
        return true;
    }
    return false;
};