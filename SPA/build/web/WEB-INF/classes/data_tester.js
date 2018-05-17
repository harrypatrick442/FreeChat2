function DataTester(userInfo, toUserInfo)
{
    var websocket = new MySocket(Configuration.URL_ENDPOINT_WALL);
    var data = new Data({'send':send});
    this.div=document.createElement('div');
    var buttonConnect = document.createElement('button');
    buttonConnect.textContent='Connect';
    buttonConnect.addEventListener("click", function(){
     data.connect();
    });
    this.div.appendChild(buttonConnect);
     console.log('loaded');
     function send(msg)
     {
        msg.type='data';
        msg.from = userInfo.name;
        msg.to = toUserInfo.name;
        console.log(JSON.stringify(msg));
        websocket.send(JSON.stringify(msg));
     }
}
var user1Info={name:'user1'};
var user2Info={name:'user2'};
var dataTester1 = new DataTester(user1Info, user2Info);
var dataTester2 = new DataTester(user2Info, user1Info);
document.documentElement.appendChild(dataTester1.div);
document.documentElement.appendChild(dataTester2.div);