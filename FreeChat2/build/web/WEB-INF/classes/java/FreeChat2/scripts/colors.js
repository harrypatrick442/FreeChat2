function Colors(cssName, callback)
{
    var self = this;
    var selfColors = this;
    var settings = new Settings("#colors"+cssName, function () {
        this.set("color");
        //this is a reset function for this particualr instance of this particular class.
    });
    this.taskBarInformation = {tooltip:'Pick font color',icon: ('images/' + cssName + '-icon.gif'), style: {backgroundColor: 'transparent'}, hoverStyle: {backgroundColor: 'rgba(0,255,255, 0.5)'}, activeStyle: {backgroundColor: 'rgba(0, 128, 255, 0.5)'}};
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divTab = document.createElement('div');
    var divMain = document.createElement('div');
    var divTitle = document.createElement('div');
    this.div.style.position = 'absolute';
    this.div.style.height = 'auto';
    this.div.style.width = '300px';
    this.div.style.display = 'none';
    divInner.style.height = '100%';
    divInner.style.border = '1px solid #66a3ff';
    divInner.style.backgroundColor = '#0099ff';
    divInner.style.padding = '0px 3px 3px 3px';
    divInner.style.borderRadius = "5px";
    divInner.style.overflow = 'hidden';
    divTab.style.float = 'left';
    divTab.style.width = "100%";
    divTab.style.height = "20px";
    divTab.style.cursor = 'move';
    divTab.style.padLeft = '10px';
    divMain.style.float = 'left';
    divMain.style.height = 'auto';
    divMain.style.width = '100%';
    divMain.style.position='relative';
    divMain.style.backgroundColor = '#ffffff';
    divMain.style.overflow = 'hidden';
    divTitle.style.float = 'left';
    divTitle.style.paddingLeft = '5px';
    divTitle.style.fontFamily = 'Arial';
    verticallyCenter(divTitle);
    setText(divTitle, "Font colors");
    function verticallyCenter(element)
    {
        element.style.position = 'relative';
        element.style.top = '50%';
        element.style.transform = 'translateY(-50%)';
        element.style.msTransform = 'translateY(-50%)';
        element.style.webkitTransform = 'translateY(-50%)';
        element.style.oTransform = 'translateY(-50%)';
    }
    this.getColor = function ()
    {
        return selfColors.selected.color;
    };



    this.div.appendChild(divInner);
    divInner.appendChild(divTab);
    divTab.appendChild(divTitle);
    divInner.appendChild(divMain);

    var x = [0, 64, 128, 192, 255];
    function rgb(r, g, b) {
        return "#" + pad(r.toString(16), 2) + pad(g.toString(16), 2) + pad(b.toString(16), 2);
    }
    function pad(num, size) {
        var s = num + "";
        while (s.length < size)
            s = "0" + s;
        return s;
    }
    var n = 0;
    var j = 25;
    var divRow;
    var dark = true;
    var select=false;
    var nSelect = settings.get('color');
    for (var g in x) {
        for (var r in x) {
            for (var b in x) {
                if (j >= 25)
                {
                    divRow = document.createElement('div');
                    divRow.style.height='20%';
                    divRow.style.width='100%';
                    divMain.appendChild(divRow);
                    j = 0;
                }
                        select = false;
                    if(n==nSelect||!n)
                    {
                        select = true;
                    }
                    divRow.appendChild(new Color(rgb(x[r], x[g], x[b]), dark, callback, select, n).div);
                    n++;
                    j++;
                    if (n > 8)
                    {
                        dark = false;
                    }
            }
        }
    }
    function Color(color, dark, callback, select, n)
    {
        var self = this;
        this.color = color;
        this.div = document.createElement('div');
        this.div.style.position = 'relative';
        this.div.style.height = '12px';
        this.div.style.width = 'calc(4% - 2px)';
        this.div.style.float = 'left';
        this.div.style.border = '1px solid ' + color;
        this.div.style.backgroundColor = color;
        this.div.style.cursor = 'pointer';
        var border;
        if (dark)
        {
            border = '1px solid #ffffff';
        }
        else
        {
            border = '1px solid #000000';
        }
        new HoverAndClick(this.div, function () {
            self.div.style.border = border;
        }, undefined, function () {
            selectColor();
        });
        if (select)
        {
            selectColor();
        }
        function selectColor()
        {
            if (selfColors.selected)
            {
                selfColors.selected.div.style.border = '1px solid ' + selfColors.selected.color;
            }
            selfColors.selected = self;
            self.div.style.border = border;
            if (callback)
            {
                callback(self.color);
            }
            settings.set('color', n);
        }
    }
    this.show = function (bringToFront)
    {
        self.div.style.display = 'inline';
        if(bringToFront)
        {
            Windows.bringToFront(self);
        }
    };
    this.hide = function ()
    {
        self.div.style.display = 'none';
    };
    this.unminimize = function ()
    {
        self.task.unminimize();
    };
    Themes.register({components:[
            {name:'body', elements:[divMain]},
            {name:'text', elements:[divTitle]}
        ],
    callback:function(theme){
        
    }}, undefined);
    Window.style(self.div, divInner, divTab);
    Windows.add(this, true, divTab, divInner, new WindowInformation(false, true, undefined, undefined, undefined, undefined, 0, 100, 0, Windows.maxYPx, false, false, true)
            , new WindowCallbacks(
                    undefined,
            undefined,
            undefined,
            undefined,
            function(){
        self.task.minimize();}
            
                    ), function(zIndex){settings.set("zIndex", zIndex);});
            if(!isMobile)
    divInner.style.position='relative';
    TaskBar.add(this);
}
Colors.getComplementary=function(hex)
{
    // Convert hex to rgb
    // Credit to Denis http://stackoverflow.com/a/36253499/4939630
    var rgb = 'rgb(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length/3 + '})', 'g')).map(function(l) { return parseInt(hex.length%2 ? l+l : l, 16); }).join(',') + ')';

    // Get array of RGB values
    rgb = rgb.replace(/[^\d,]/g, '').split(',');

    var r = rgb[0], g = rgb[1], b = rgb[2];

    // Convert RGB to HSL
    // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2.0;

    if(max == min) {
        h = s = 0;  //achromatic
    } else {
        var d = max - min;
        s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

        if(max == r && g >= b) {
            h = 1.0472 * (g - b) / d ;
        } else if(max == r && g < b) {
            h = 1.0472 * (g - b) / d + 6.2832;
        } else if(max == g) {
            h = 1.0472 * (b - r) / d + 2.0944;
        } else if(max == b) {
            h = 1.0472 * (r - g) / d + 4.1888;
        }
    }

    h = h / 6.2832 * 360.0 + 0;

    // Shift hue to opposite side of wheel and convert to [0-1] value
    h+= 180;
    if (h > 360) { h -= 360; }
    h /= 360;

    // Convert h s and l values into r g and b values
    // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
    if(s === 0){
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    r = Math.round(r * 255);
    g = Math.round(g * 255); 
    b = Math.round(b * 255);

    // Convert r b and g values to hex
    rgb = b | (g << 8) | (r << 16); 
    return "#" + (0x1000000 | rgb).toString(16).substring(1);
};