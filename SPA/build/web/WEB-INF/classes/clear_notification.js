function clearNotification(send, roomUuid){
        send({type:"clear_notification", roomUuid:roomUuid});
}