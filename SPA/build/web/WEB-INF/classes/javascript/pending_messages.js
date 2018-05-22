function PendingMessages(){
    var list = [];
    this.unpendIfPending = function(jObject){
        var iterator = new Iterator(list);
        while(iterator.hasNext()){
            var message = iterator.next();
            if(message.equals(jObject)){
                iterator.remove();
                message.unpend();
                return true;
            }
        }
        return false;
    };
    this.add=function(message){
        list.push(message);
    };
}