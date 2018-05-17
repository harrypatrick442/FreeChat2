function MessageBuffer(sendUnsynched) {

    var toSend = [];
    this.getMessages = function(nMax) {
        if (nMax != undefined)
        {
            var length = toSend.length;
            var i = 0;
            var j = (length < nMax) ? length : nMax;
            while (i < j) {
                sendUnsynched(toSend.splice(0, 1)[0]);
                i++;
            }
        }
        else
        {
            var returns = toSend;
            toSend = [];
            return returns;
        }
    };
    this.send = function(jObject) {
        toSend.push(jObject);
    };
}
