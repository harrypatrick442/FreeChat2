function Message(params)
{
    var self = this;
    var fontScale = isMobile?Font.mobileScale: 1;
    if (params.str == undefined)
    {
        return;
    }
    this.div = document.createElement('div');
    this.div.style.backgroundColor = params.backgroundColor;
    this.div.style.padding = '0px 1px 0px 1px';
    this.div.style.minHeight='28px';
    this.div.style.float='left';
    this.div.style.width='100%';
    this.div.style.position='relative';
    var cover;
    var lookupTree = params.callbackEmoticons.getLookupTree();
    var fontObj = params.fontObj;
    var font = fontObj.font;
    if(params.pending)
        { 
            cover = document.createElement('div');
            cover.style.width='100%';
            cover.style.height='100%';
            cover.style.backgroundColor='rgba(0, 0, 0, 0.3)';
            cover.style.zIndex='10';
            cover.style.position='absolute';
            self.div.appendChild(cover);
        }
    
    if (font == undefined)
    {
        font = 'Arial';
    }
    var color = fontObj.color;
    if (color == undefined)
    {
        color = '#000000';
    }
    var size = fontObj.size;
    if (!size)
    {
        size = 12;
    }
    var div = document.createElement("div");
    div.style.padding='0px';
    div.style.margin='0px';
    var bold = fontObj.bold;
    if(bold){
    div.style.fontWeight = 'bold';
    }
    var italic = fontObj.italic;
    if(italic)
    {
        div.style.fontStyle='italic';
    }
    div.style.color=color;
    div.style.fontFamily=font?font:'verdana, geneva, sans-serif';
    div.style.fontSize=String(size*fontScale)+'px';
    if(params.userUuid){
    var img = document.createElement('img');
    img.style="width:26px; height:26px; max-height:100%; float:left; margin:1px;overflow:hidden;";
    img.src='http://localhost/FreeChat2/profile_image/'+params.userUuid;
    this.div.appendChild(img);
    img.onerror = function () {
        img.src = window.thePageUrl+'images/user.png';
    };
    }
    if (params.username != undefined)
    {
        this.div.appendChild(getDivUsername(params.username));
    }
    var indexChar = 0;
    var indexChar2 = 0;
    while (indexChar < params.str.length) {
        var res = checkForEmoticon(indexChar, params.str);
        if (res != null)
        {
            if (indexChar > indexChar2)
            {
                createText(params.str, font, color, italic, bold, size, indexChar2, indexChar);
                
            }
            indexChar = res[1] + 1;
            indexChar2 = indexChar;   
            div.innerHTML+='<img style="height:'+String(16*fontScale)+'px" src="'+window.thePageUrl+res[0]+'"></img>';
        } else
        {
            indexChar++;
        }
    }
    
    createText(params.str, font, color, italic, bold, size, indexChar2, indexChar);
    
    this.div.appendChild(div);
    this.unpend = function(){
        if(params.pending){
            self.div.removeChild(cover);
        };
    };
    this.equals = function(jObject){
        var font = jObject.font;
        return params.str==jObject.content&&isEquivalent(jObject.font, fontObj);
    };
    function createText(strAll, font, color, italic, bold, size, indexFrom, indexTo)
    {
            var str = (indexFrom != undefined && indexTo != undefined)?strAll.substring(indexFrom, indexTo):strAll;
            var words = str.split(" ");
            var iteratorWords = new Iterator(words);
            while(iteratorWords.hasNext())
            {
                var word = iteratorWords.next();
                if (isUrl(word))
                {
                    var fullLink=(!/^(?:f|ht)tps?\:\/\//.test(word)?"http://":"")+word;
                    div.innerHTML+='<a target="_blank" style="font-size:'+String(size * fontScale)+'px" href="'+fullLink+'">'+fullLink+'</a> ';
                }
                else
                {
                    div.innerHTML += word + " ";
                }
            }
    }

    function isUrl(s)
    {
        var regexp = /(\.com|\.co.uk|\.net|\.org|\.info|\www\.|((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:ww‌​w.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?‌​(?:[\w]*))?))/;
        return regexp.test(s);
    }
    function checkForEmoticon(index, message)
    {
        var theChar = message.charAt(index);
        if (lookupTree == undefined)
        {
            return null;
        }
        var lTree = lookupTree;
        while (true)
        {
            var map2 = lTree[theChar];
            if (map2 == undefined)
            {
                if (lTree['url'] != undefined)
                {
                    var r = [];
                    r[0] = lTree['url'];
                    r[1] = index - 1;
                    return r;
                }
                break;
            }
            lTree = map2;
            index++;
            if (index < message.length)
            {
                theChar = message.charAt(index);
            }
        }
        return null;
    }
    function getDivUsername(user){
        var div = document.createElement('div');
        div.textContent=user;
        div.style.padding='0px !important';
        div.style.margin='0px !important';
        div.style.cursor='pointer';
        div.style.color='rgb(59, 89, 152)';
        div.style.fontWeight = "bold";
        div.style.float = "top";
        div.style.fontSize = String(11*fontScale) + 'px';
        new HoverAndClick(div, function(){div.style.textDecoration = 'underline';}, function(){}, function(e){
            params.menuMessages.show(e.pageX, e.pageY, function () {
                }, {}, [{userUiud:params.userUuid},{}, {}]);
        });
        return div;
    }
    function getImage(user){
        
    }
}