/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Font()
{
    Font.mobileScale=pxToMmRatio/4;
    var settings = new Settings("#font", function () {
        this.set("font");
        //this is a reset function for this particualr instance of this particular class.
    });
    var arrayFonts = ['Andale Mono', 'Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold', 'Avant Garde', 'Baskerville', 'Big Caslon', 'Bodoni MT', 'Book Antiqua', 'Brush Script MT', 'Calibri', 'Calisto MT', 'Cambria', 'Candara', 'Century Gothic', 'Consolas', 'Copperplate', 'Courier New', 'Didot', 'Franklin Gothic Medium', 'Futura', 'Garamond', 'Geneva', 'Georgia', 'Gill Sans', 'Goudy Old Style', 'Helvetica', 'Hoefler Text', 'Impact', 'Lucida Bright', 'Lucida Console', 'Lucida Grande', 'Lucida Sans Typewriter', 'Monaco', 'Optima', 'Palatino', 'Perpetua', 'Papyrus', 'Rockwell', 'Rockwell Extra Bold', 'Segoe UI', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana'];
    this.taskBarInformation = {tooltip: 'Customize your font', icon: ('images/font-icon.gif'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    var self = this;
    this.bold = false;
    this.italic = false;
    this.underline = false;
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divTab = document.createElement('div');
    var divMain = document.createElement('div');
    var selectFamily = document.createElement('select');
    var selectSize = document.createElement('select');
    var divBold = document.createElement('div');
    var imgBold = document.createElement('img');
    var divItalic = document.createElement('div');
    var imgItalic = document.createElement('img');
    var divUnderline = document.createElement('div');
    var imgUnderline = document.createElement('img');
    var divColor = document.createElement('div');
    var imgColor = document.createElement('img');
    for (var i = 0; i < arrayFonts.length; i++)
    {
        var font = arrayFonts[i];
        addOption(selectFamily, font, font).style.fontFamily = font;
    }
    for (var i = 8; i < 17; i++)
    {
        addOption(selectSize, String(i), i);
    }
    var divTitle = document.createElement('div');
    this.div.style.position = 'absolute';
    this.div.style.display = 'none';
    if(!isMobile)
    this.div.style.width='300px';
    divInner.style.height = 'auto';
    divInner.style.border = '1px solid #66a3ff';
    divInner.style.backgroundColor = '#0099ff';
    divInner.style.padding = '0px 3px 3px 3px';
    divInner.style.borderRadius = "5px";
    divInner.style.overflow = 'hidden';
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.height = "20px";
    divTab.style.cursor = 'move';
    divMain.style.float = 'left';
    divMain.style.height = 'auto';
    divMain.style.width = '100%';
    divMain.style.backgroundColor = '#ffffff';
    divMain.style.overflow = 'hidden';
    divMain.style.padding = '1px';
    setDivGenericStyle(divBold);
    divBold.style.border = '1px solid #999999';
    divBold.style.marginRight = '2px';
    verticallyCenter(imgBold);
    imgBold.src = window.thePageUrl+'images/bold.png';
    setDivGenericStyle(divItalic);
    divItalic.style.border = '1px solid #999999';
    divItalic.style.marginRight = '2px';
    verticallyCenter(imgItalic);
    imgItalic.src = window.thePageUrl+'images/italic.png';
    setDivGenericStyle(divUnderline);
    divUnderline.style.border = '1px solid #999999';
    divUnderline.style.marginRight = '2px';
    verticallyCenter(imgUnderline);
    imgUnderline.src = window.thePageUrl+'images/underline.png';
    setDivGenericStyle(divColor);
    divColor.style.marginRight = '2px';
    divColor.style.height = '19px';
    imgColor.src = window.thePageUrl+'images/color_picker.png';
    imgColor.style.height = '100%';
    selectFamily.style.marginLeft = '2px';
    selectFamily.style.marginRight = '2px';
    selectFamily.style.cursor = 'pointer';
    selectFamily.style.float = 'left';
    selectFamily.style.height = '19px';
    selectFamily.value = 'Arial';
    selectSize.style.marginRight = '1px';
    selectSize.style.cursor = 'pointer';
    selectSize.style.float = 'left';
    selectSize.style.height = '19px';
    selectSize.value = '12';
    divTitle.style.float = 'left';
    divTitle.style.paddingLeft = '5px';
    divTitle.style.fontFamily = 'Arial';
    verticallyCenter(divTitle);
    setText(divTitle, "Font");


    this.div.appendChild(divInner);
    divInner.appendChild(divTab);
    divInner.appendChild(divMain);
    divMain.appendChild(selectFamily);
    divMain.appendChild(selectSize);
    divTab.appendChild(divTitle);
    divMain.appendChild(divBold);
    divBold.appendChild(imgBold);
    divMain.appendChild(divItalic);
    divItalic.appendChild(imgItalic);
    divMain.appendChild(divUnderline);
    divUnderline.appendChild(imgUnderline);
    divMain.appendChild(divColor);
    divColor.appendChild(imgColor);



    function addOption(select, name, value)
    {
        var option = document.createElement('option');
        setText(option, name);
        option.value = value;
        select.appendChild(option);
        return option;
    }
    function verticallyCenter(element)
    {
        element.style.position = 'relative';
        element.style.top = '50%';
        element.style.transform = 'translateY(-50%)';
        element.style.msTransform = 'translateY(-50%)';
        element.style.webkitTransform = 'translateY(-50%)';
        element.style.oTransform = 'translateY(-50%)';
    }
    function setDivGenericStyle(button)
    {
        button.style.float = isMobile?'left':'right';
        button.style.border = '0px';
        button.style.backgroundColor = '#dddddd';
        button.style.cursor = 'pointer';
        button.style.fontWeight = '900';
        button.style.fontSize = '12px';
        button.style.height = '18px';
    }
    var colors = new Colors("font-colors", function (color) {
        divColor.style.backgroundColor = color;
        textChanged();
    });
    this.setFont = function (font)
    {
        if (font)
        {
            if (font.size)
            {
                font.size=font.size;
                selectSize.value = String(font.size);
            }
            if (font.family)
            {
                selectFamily.value = font.family;
            }
            setBold(font.bold);
            setItalic(font.italic);
            setUnderline(font.underlined);
            textChanged();
        }
    };
    this.getFont = function ()
    {
        var obj = {};
        obj.size = parseInt(selectSize.value);
        obj.family = selectFamily.value;
        obj.color = colors.getColor();
        obj.bold = self.bold;
        obj.italic = self.italic;
        obj.underlined = self.underline;
        return obj;
    };

    var timerFlash;
    this.flash = function ()
    {
        var flashing = false;
        timerFlash = new Timer(function () {
            if (flashing) {
                styleFromObject(divInner, Themes.theme.components.frame);
                flashing = false;
            } else {
                styleFromObject(divInner, Themes.theme.components.frameFlashing);
                flashing = true;
            }
        }, 50, 6, false);
    };
    this.show = function (bringToFront)
    {
        self.div.style.display = 'inline';
    };
    this.hide = function ()
    {
        self.div.style.display = 'none';
    };
    this.unminimize = function ()
    {
        self.task.unminimize();
        self.flash();
    };
    function textChanged()
    {

        if (self.getFont)
        {
            Font.latest = self.getFont();
            var i = 0;
            while (i < Font.callbacks.length)
            {
                var callback = Font.callbacks[i];
                if (callback)
                {
                    callback(Font.latest);
                    i++;
                }
                else
                {
                    Font.callbacks.splice(i, 1);
                }
            }
            settings.set("font", Font.latest);
        }
    }
    selectSize.onchange = textChanged;
    selectFamily.onchange = textChanged;



    divColor.addEventListener("click", function () {
        colors.show(true);
    });
    new HoverAndClick(divBold, function () {
        divBold.style.backgroundColor = '#e6ffff';
    }, undefined, function () {
        setBold(!self.bold);
        textChanged();
    });
    function setBold(value)
    {
        if (value) {
            divBold.style.border = '1px solid #000000';
            self.bold = true;
        } else {
            divBold.style.border = '1px solid #999999';
            self.bold = false;
        }
    }
    new HoverAndClick(divItalic, function () {
        divItalic.style.backgroundColor = '#e6ffff';
    }, undefined, function () {
        setItalic(!self.italic);
        textChanged();
    });
    function setItalic(value)
    {
        if (value) {
            divItalic.style.border = '1px solid #000000';
            self.italic = true;
        } else {
            divItalic.style.border = '1px solid #999999';
            self.italic = false;
        }
    }
    new HoverAndClick(divUnderline, function () {
        divUnderline.style.backgroundColor = '#e6ffff';
    }, undefined, function () {
        setUnderline(!self.underline);
        textChanged();
    });
    function setUnderline(value)
    {
        if (value) {
            divUnderline.style.border = '1px solid #000000';
            self.underline = true;
        } else {
            divUnderline.style.border = '1px solid #999999';
            self.underline = false;
        }
    }
    new Hover(divColor, function () {
        imgColor.src = window.thePageUrl+'images/color_picker_hover.png';
    }, function () {
        imgColor.src = window.thePageUrl+'images/color_picker.png';
    });
    makeUnselectable(this.div);
    Themes.register({components:[
            {name:'body', elements:[divMain]},
            {name:'text', elements:[divTitle]}
        ],
    callback:function(theme){
        
    }}, undefined);
    Window.style(self.div, divInner, divTab);
    var windowInformation =  new WindowInformation(false, true,undefined, undefined, undefined, undefined, 0, 100, 0, Windows.maxYPx, true,false, true);
    var callbacks=new WindowCallbacks(undefined, undefined,
    function(){
        self.task.minimize(self);}, undefined, function(){
        self.task.minimize(self);}, function(zIndex){settings.set("zIndex", zIndex);});
    var params = {obj: this,
        minimized: true,
        divTab: divTab,
        divInner: divInner,
        windowInformation: windowInformation,
        callbacks: callbacks};
    Windows.add( params);
    if(!isMobile)
    divInner.style.position='relative';
    TaskBar.add(this);
    self.setFont(settings.get("font"));
}
Font.callbacks = [];
Font.addCallback = function (callback)
{
    Font.callbacks.push(callback);
};
Font.removeCallback = function (callback)
{
    var index = Font.callbacks.indexOf(callback);
    if (index > -1)
    {
        Font.callbacks.splice(index, 1);
    }
};