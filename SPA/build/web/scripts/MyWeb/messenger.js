function Messenger()
{
    var listTerminals = [];
    var mapTerminalIdToInterpreter = {};
    function send(terminal, jObject)
    {
        for (var i = 0; i < listTerminals.length; i++)
        {
            var t = listTerminals[i];
            if (t != terminal)
                mapTerminalIdToInterpreter[t.id](jObject);
        }
    }
    function close(terminal)
    {
        listTerminals.splice(listTerminals.indexOf(terminal), 1);
        delete mapTerminalIdToInterpreter[terminal.id];
    }
    this.getTerminal = function(interpreter)
    {
        return new Terminal(interpreter);
    };
    var idCount = 0;

    function Terminal(interpreter)
    {
        this.id = idCount;
        idCount++;
        var self = this;
        this.send = function(jObject)
        {
            send(self, jObject);
        };
        this.close = function()
        {
            close(self);
        };
        listTerminals.push(this);
        mapTerminalIdToInterpreter[self.id] = interpreter;
    }
}