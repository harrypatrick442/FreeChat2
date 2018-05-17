function Ignore()
{
    
}
Ignore.ignore=function(unique_id)
{
    var index = Ignore.users.indexOf(unique_id);
    if(index<0)
    {
        Ignore.users.push(unique_id);
    }
};
Ignore.unignore=function(unique_id)
{
    var index = Ignore.users.indexOf(unique_id);
    if (index >= 0)
    {
        Ignore.users.splice(index, 1);
    }
};
Ignore.users = [];
Ignore.isIgnored = function (unique_id)
{
    if (Ignore.users.indexOf(unique_id) >= 0)
    {
        return true;
    }
    return false;
};