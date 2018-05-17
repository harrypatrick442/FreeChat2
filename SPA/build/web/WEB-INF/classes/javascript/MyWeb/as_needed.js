function AsNeeded()
{
    var functionsToScriptPath = [
        {names: ['JSON'], src: 'scripts/as_needed/json2.js'},
        {names: ['CustomEvent'], src: 'scripts/as_needed/custom_event.js'},
        {names: [], src: ''}];
    for (var i = 0; i < functionsToScriptPath.length; i++)
    {
        var o = functionsToScriptPath[i];
        for (var j = 0; j < o.names.length; j++)
        {
            if (needsImporting(o.names[j]))
            {
                load(window.thePageUrl+o.src);
                break;
            }
        }
    }
    function load(src)
    {
        var xhrObj = new XMLHttpRequest();
        xhrObj.open('GET', src, false);
        xhrObj.send('');
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.text = xhrObj.responseText;
        document.getElementsByTagName('head')[0].appendChild(script);
    }
    function needsImporting(name)
    {
        return window[name] == undefined;
    }
}