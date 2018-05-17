function OptionPane(parent)
{
    var self = this;
    this.div = document.createElement('div');
    var divInner = document.createElement('div');
    var divText = document.createElement('div');
    var tableButtons = document.createElement('table');
    var tableButtonsRow = document.createElement('tr');
    var buttonClose = new Window.CloseButton(function(){
        if (self.functClose != undefined)
        {
            self.functClose();
        }
        self.hide();});
    var divTop = document.createElement('div');
    var divTop = document.createElement('div');
    this.div.style.height = 'auto';
    this.div.style.width = 'auto';
    this.div.style.top = '50%';
    this.div.style.left = '50%';
    this.div.style.backgroundColor = '#C70039';
    this.div.style.borderRadius = '6px';
    this.div.style.overflow = 'hidden';
    this.div.style.zIndex = '2400';
    this.div.style.display = 'none';
    this.div.style.border = '1px solid #900C3F';
    this.div.style.padding='0px 3px 3px 3px';
    divText.style.float = 'top';
    divText.style.backgroundColor = '#eeeeee';
    divText.style.color = '#000000';
    divText.style.fontFamily = 'Arial';
    divText.style.fontWeight = 'bold';
    divText.style.padding = '2px';
    divText.style.marginTop = '20px';
    tableButtons.style.float = 'bottom';
    tableButtons.style.position = 'relative';
    tableButtons.style.width = '100%';
    divTop.style.position = 'absolute';
    divTop.style.height = '20px';
    divTop.style.width = '100%';
    divTop.style.top = '0px';
    divTop.style.left = '0px';
    divTop.style.fontWeight = 'bold';
    this.div.appendChild(divTop);
    divTop.appendChild(buttonClose.button);
    this.div.appendChild(divText);
    this.div.appendChild(tableButtons);
    tableButtons.appendChild(tableButtonsRow);
    setTableSkinny(tableButtons);
    if (!parent)
    {
        this.div.style.position = 'fixed';
        document.body.appendChild(this.div);
    }
    else
    {
        this.div.style.position = 'absolute';
        parent.appendChild(this.div);
    }
    this.hide = function ()
    {
        self.div.style.display = 'none';
    };
    this.show = function (listButtonNameToFunction, text, functClose)
    {
        while (tableButtonsRow.firstChild) {
            tableButtonsRow.removeChild(tableButtonsRow.firstChild);
        }
        self.functClose = functClose;
        divText.textContent = text;
        for (var i in listButtonNameToFunction)
        {
            var pair = listButtonNameToFunction[i];
            var button = document.createElement('button');
            button.textContent = pair[0];
            button.style.width = '100%';
            button.style.cursor = 'pointer';
            button.style.borderRadius = '3px';
            button.style.border = '1px solid #000000';
            button.style.fontWeight = 'bold';
            button.style.margin = '0px';
            button.addEventListener('click', pair[1], false);
            button.addEventListener('click', self.hide, false);
            var tableColumn = document.createElement('td');
            tableButtonsRow.appendChild(tableColumn);
            tableColumn.appendChild(button);
        }
        self.div.style.display = 'block';
        self.div.style.left='50%';
        self.div.style.top='50%';
        self.div.style.marginLeft = '-'+String(self.div.offsetWidth/2) + 'px';
        self.div.style.marginTop ='-'+String(self.div.offsetHeight / 2) + 'px';
    };
    function setTableSkinny(table)
    {
        table.cellSpacing = "0";
        table.cellPadding = "0";
    }
}

