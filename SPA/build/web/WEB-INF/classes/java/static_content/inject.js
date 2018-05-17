// this is the code which will be injected into a given page...
(function() {
        var staticElements = [];
	     var htmlStr='';
		getStaticElements(document.body);
		console.log(htmlStr);
httpPostAsynchronous('http://localhost/index' , function(){}, 'operation=set_static_content&html='+encodeURIComponent(htmlStr),10000, function(){});
		function getStaticElements(parent)
		{
			console.log('running');
			for (var i = 0;i < parent.children.length; i++)
			{
			console.log('child');
				var child = parent.children[i];
				if (child.getAttribute("isStatic"))
				{console.log('is');
					htmlStr+='<'+child.tagName.toLowerCase()+" isStatic='true'"+(child.className?" class='"+child.className+"'":'')+(child.id?" id='"+child.id+"'":'')+getStyleHtml(child)+'>';
					staticElements.push(child);
					getStaticElements(child); 
					htmlStr+="</"+child.tagName.toLowerCase()+'>';
				}
			}
		}
	function getStyleHtml(element)
	{
        var str=" style='";
		for(var i in element.style)
		{
			var v = element.style[i];
			if((undefined!=v)&&(v!='')&&(isNaN(parseInt(i))))
			{
				str+=i;
				str+=':';
				str+=v;
				str+=';';
			}
		}
		str+="'";
		return str;
	}
function httpPostAsynchronous(theUrl, callback, toSend, timeout, callbackTimedOut) {
    if (!toSend)
    {
        toSend = null;
    }
    var xmlHttp = new XMLHttpRequest();
    if (timeout)
    {
        xmlHttp.timeout = timeout;
    }
    if (callbackTimedOut)
    {
        xmlHttp.ontimeout = callbackTimedOut;
    }
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            if (callback != undefined) {
                console.log(xmlHttp.responseText);
                callback(xmlHttp.responseText);
            }
        }
    };
    xmlHttp.open("POST", theUrl, true); // false for synchronous request
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send(toSend);
}
})();


