function objectSize(obj)
{
    var length=0;
    for(var i in obj)
    {
        length++;
    }
    return length;
}