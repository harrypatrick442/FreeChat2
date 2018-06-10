function Message(str, callbackEmoticons, color, font, bold, italic, size, user, menuMessage, backgroundColor)
{
    if (str == undefined)
    {
        return;
    }
    this.div = document.createElement('div');
    this.div.style.backgroundColor = backgroundColor;
    this.div.style.padding = '0px 1px 0px 1px';
    var lookupTree = callbackEmoticons.getLookupTree();
    var userFont = 'Calibri';
    if (font == undefined)
    {
        font = 'Arial';
    }
    if (color == undefined)
    {
        color = '#000000';
    }
    if (!size)
    {
        size = 12;
    }
    var div = document.createElement("div");
    var arrayDivs;
    if (user != undefined)
    {
        arrayDivs = createTextDivs('&lt'+user + '&gt ',userFont, color, italic, bold, size);
        append(arrayDivs, div);
    }
    var indexChar = 0;
    var indexChar2 = 0;
    while (indexChar < str.length) {
        var res = checkForEmoticon(indexChar, str);
        if (res != null)
        {
            if (indexChar > indexChar2)
            {
                arrayDivs = createTextDivs(str, font, color, italic, bold, size, indexChar2, indexChar);
                for (var j = 0; j < arrayDivs.length; j++)
                {
                    div.appendChild(arrayDivs[j]);
                }
            }
            indexChar = res[1] + 1;
            indexChar2 = indexChar;
            var img = document.createElement("img");
            img.src = window.thePageUrl+res[0];
            if(!isMobile)
            img.style.height = '30px';
        else
            img.style.height=String(4*pxToMmRatio)+'px';
            div.appendChild(img);
        } else
        {
            indexChar++;
        }
    }
    arrayDivs = createTextDivs(str, font, color, italic, bold, size, indexChar2, indexChar);
    append(arrayDivs, div);
    this.div.appendChild(div);
    function append(arrayDivs, div)
    {
        for (var j = 0; j < arrayDivs.length; j++)
        {
            div.appendChild(arrayDivs[j]);
        }
    }
    function createTextDivs(strAll, font, color, italic, bold, size, indexFrom, indexTo)
    {
        var str;
        if (indexFrom != undefined && indexTo != undefined)
        {
            str = strAll.substring(indexFrom, indexTo);
        } else
        {
            str = strAll;
        }
        var words = str.split(" ");
        var arrayDivs = [];
        for (var i = 0; i < words.length; i++)
        {
            var div = document.createElement("div");
            div.style.whiteSpace = 'pre';
            div.style.padding='0px !important';
            div.style.margin='0px !important';
            var word = words[i];
            div.innerHTML = word + " ";
            var isAUrl = isUrl(word);
            if (italic || isAUrl)
            {
                div.style.fontStyle = "italic";
            }
            if (bold)
            {
                div.style.fontWeight = "bold";
            }
            if (isAUrl)
            {
                div.style.textDecoration = 'underline';
                div.style.color = 'blue';
                div.style.cursor = 'pointer';
                div.addEventListener('click', function () {
                    try {if (!/^(?:f|ht)tps?\:\/\//.test(word)) {
                            word = "http://" + word;
                        }
                        var win = window.open(word, '_blank');
                        win.focus();
                    } catch(ex){
                    }
                });
            } else
            {
                div.style.color = color;
                div.style.fontFamily = font;
            } 
            div.style.fontSize = String(size*(function(){if(isMobile)return Font.mobileScale; return 1;})()) + 'px';
            div.style.display = "inline-block";
            arrayDivs.push(div);
        }
        return arrayDivs;
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
}

