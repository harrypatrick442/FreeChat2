function TickBox(callback, name, width, doubleBox)
{
    var self = this;
    this.div = document.createElement('div');
    this.div.style.width = width;
    this.div.style.height = '20px';
    this.div.style.position = 'relative';
    this.div.style.float = 'left';
    var divName = document.createElement('div');

    var checkbox = document.createElement('input');
    var checkbox2;
    checkbox.type = 'checkbox';
    checkbox.style.width = '10px';
    checkbox.style.height = '10px';
    checkbox.style.position = 'absolute';
    this.div.appendChild(checkbox);
    if (doubleBox)
    {
        checkbox2 = document.createElement('input');
        checkbox2.type = 'checkbox';
        checkbox2.style.width = '10px';
        checkbox2.style.height = '10px';
        checkbox2.style.left = '30px';
        checkbox2.style.position = 'absolute';
        this.div.appendChild(checkbox2);
    }
    divName.style.width = 'calc(100% - ' + (doubleBox ? '50' : '20') + 'px)';
    divName.style.left = doubleBox ? '50px' : '20px';
    divName.style.height = '100%';
    divName.style.position = 'absolute';
    divName.style.fontSize = '12px';
    setWordEllipsis(divName);
    setText(divName, name);
    this.div.appendChild(divName);
    self.ticked = doubleBox?undefined:false;
    var click = doubleBox ? function (n) {
        console.log(self.ticked);
        var check = (n > 0 ? checkbox2 : checkbox);
        var other = (n > 0 ? checkbox : checkbox2);
       /* try
        {
            callback[n](check.checked, self);
        } catch (ex)
        {
            console.log(ex);
        }*/
        if (other.checked)
        {
            other.checked = false;
           /* try
            {
                callback[(n + 1) % 1](other.checked, self);
            } catch (ex)
            {
                console.log(ex);
            }*/
        }
        self.ticked = checkbox.checked ?checkbox.checked:(checkbox2.checked?false:undefined);
    } : function () {
        self.ticked = checkbox.checked;
        try
        {
            callback(checkbox.checked, self);
        } catch (ex)
        {
            console.log(ex);
        }
    };

    checkbox.addEventListener('click', function () {
        click(0);
    });
    if (doubleBox)
        checkbox2.addEventListener('click', function () {
            click(1);
        });
    this.setTicked = function (value) {
        
        if (doubleBox)
        {
            if (value == undefined)
                return;
            checkbox2.checked = !value;
        }
        checkbox.checked = value;
        self.ticked=value;
    };
    var themesObject = {components: [
            {name: 'text', elements: [divName]}
        ],
        callback: function (theme) {
        }
    };
    Themes.register(themesObject);
    this.close = function () {
        Themes.remove(themesObject);
    };
}