var Random = new (function() {
    var self = this;
    this.get = function(minIncluded, maxExclu) {
        var res = Math.floor(Math.random() * (minIncluded + maxExclu)) + minIncluded;
        if (res >= maxExclu)
            res--;
        return res;
    };
    this.getIgnoring = function(minIncluded, maxExclu, ignores)
    {
        var range = maxExclu - minIncluded;
        range -= ignores.length;
        var from = minIncluded;
        var pAt = Math.random() * range;
        var dSum = 0;
        var i = 0;
        while (i < ignores.length)
        {
            var to = ignores[i];
            var d = to - from;
            dSum += d;
            if (dSum >= pAt)
            {

                return self.get(from, to);
            }
            from = to;
            i++;
        }
        return self.get(to, maxExclu);
    };
})();