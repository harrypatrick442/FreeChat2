function TextBox(callbackEdit, multiline, autoSize, fontSize, isLocked, initialText, maxLength, styleNames, minHeight)
{
    var self = this;
    styleNames = !styleNames ? {} : styleNames;
    if (!minHeight)
        minHeight = 20;
    if (isLocked == undefined) 
        isLocked = true;
    this.div = document.createElement('div');
    var preText = document.createElement((!multiline && autoSize) ? 'span' : 'pre');
    this.div.style.float = 'left';
    preText.style.margin = '0px';
    var text;
    var expandingTextarea;
    if (!multiline)
    {
        preText.style.whiteSpace = 'nowrap';
        text = document.createElement('input');
        text.type = 'text';
        text.style.position = 'absolute';
        text.style.height = '100%';
        if (autoSize)
        {
            this.div.style.maxWidth = '100%';
        } else
        {
            verticallyCenter(preText);
        }
    } else
    {
        preText.style.whiteSpace = 'pre-wrap';
        if (autoSize)
        {
            expandingTextarea = new ExpandingTextarea(minHeight, function (height, heightString) {
                preText.style.height = heightString;
            });
            text = expandingTextarea.textarea;
            text.style.position = 'absolute';
            this.resize = expandingTextarea.resize;
            text.style.height = '100%';
        } else
        {
            text = document.createElement('textarea');
            text.style.resize = 'none';
            text.style.overflow = 'hidden';
            text.style.position = 'absolute';
        }
    }
    if (maxLength)
        text.maxLength = maxLength;
    function styleElement(text)
    {
        text.style.fontSize = String(fontSize) + 'px';
        text.style.fontFamily = 'Arial';
        text.style.boxSizing = 'border-box';
        text.style.width = '100%';
    }
    styleElement(text);
    styleElement(preText);
    if (initialText)
    {
        text.value = initialText;
        setText(preText, initialText);
    }
    preText.style.paddingLeft = '1px';
    preText.style.overflow = 'hidden';
    preText.style.textOverflow = 'ellipsis';
    if (multiline)
        preText.style.position = 'relative';
    preText.style.float = 'left';
    (!isLocked && callbackEdit ? text : preText).style.visibility = 'visible';
    (!isLocked && callbackEdit ? preText : text).style.visibility = 'hidden';
    this.div.appendChild(text);
    this.div.appendChild(preText);
    function switchLocked(locked)
    {
        console.log(locked);
        if (locked)
        {
            setText(preText, text.value);
            callbackEdit(text.value);
        }
        (locked ? text : preText).style.visibility = 'hidden';
        (locked ? preText : text).style.visibility = 'visible';
    }
    var editButton;
    if (callbackEdit)
    {
        editButton = new EditButton(switchLocked);
        this.div.appendChild(editButton.div);
    }
    this.setValue = function (str)
    {
        text.value = str;
        setText(preText, str);
        if (expandingTextarea)
            expandingTextarea.resize();
    };
    var themesObject = {components: [
            {name: (styleNames.textStyleName ? styleNames.textStyleName : 'text_color'), elements: [preText]},
            {name: (styleNames.textStyleName ? styleNames.textStyleName : 'text_font'), elements: [preText, text]}
        ],
        callback: function (theme) {

        }};
    Themes.register(themesObject);
    this.close = function () {
        Themes.remove(themesObject);
    };
}
