function DataConnectionsHandler(wallInfo, userInfo, callbacks)//does the clever rtc stuff to establish connections through other connections.
{
    var datas = new Datas(userInfo,
    {
        send:function(obj){}
    });
    function getUsers()
    {
        var jObject = {type:'users','wall_id':wallInfo.id};
        callbacks.send(jObject);
    }
    this.interpret=function(msg)
    {
      switch(msg.type)
      {
          case 'users':
              break;
      }
    };
}