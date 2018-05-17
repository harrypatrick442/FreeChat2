function EntryBuilder(obj, rect)
{
    obj.div = document.createElement('div');
    obj.divMain = document.createElement('div');
    obj.divInner = document.createElement('div');
    obj.div.style.position = 'relative';
    obj.div.style.float = 'left';
    obj.div.style.boxSizing = 'border-box';
    obj.divInner.style.position = 'relative';
    obj.divInner.style.float = 'left';
    obj.divInner.style.boxSizing = 'border-box';
    obj.divMain.style.position = 'relative';
    obj.divMain.style.float = 'left';
    obj.div.appendChild(obj.divInner);
    obj.divInner.appendChild(obj.divMain);
    EventEnabledBuilder(obj);
    obj.closeEvent = new CustomEvent("close");
    obj.updateEvent = new CustomEvent("update");
    obj.setRect=function()
    {
        console.log('setting rect');
        obj.div.style.width = rect.width.getSizeString();
        obj.div.style.maxWidth = rect.width.getMaxSizeString();
        if (rect.isDefaultHeight)
        {
            obj.div.style.minHeight = '100px';
            obj.div.style.height = '100px';
            obj.div.style.maxHeight = 'auto';
        } else
        {
            obj.div.style.height = rect.height.getSizeString();
            obj.div.style.maxHeight = rect.height.getMaxSizeString();
            obj.div.style.minHeight = rect.height.getMinSizeString();
        }
        if (rect.width.isAuto)
        {
            obj.divInner.style.marginLeft = '2px';
            obj.divInner.style.width = 'auto';
            obj.divMain.style.width = 'auto';
            obj.divMain.style.marginLeft = '2px';
            obj.divMain.style.marginRight = '2px';
        } else
        {
            obj.divInner.style.left = '2px';
            obj.divInner.style.width = 'calc(100% - 2px)';
            obj.divMain.style.left = '2px';
            obj.divMain.style.width = 'calc(100% - 4px)';
        }
        if (rect.height.isAuto)
        {
            obj.divInner.style.marginTop = '2px';
            obj.divInner.style.height = 'auto';
            obj.divMain.style.height = 'auto';
            obj.divMain.style.marginTop = '2px';
            obj.divMain.style.marginBottom = '2px';
        } else
        {

            obj.divInner.style.top = '2px';
            obj.divInner.style.height = 'calc(100% - 4px)';
            obj.divMain.style.top = '2px';
            obj.divMain.style.height = 'calc(100% - 4px)';
        }
    };
    
    
        rect.addEventListener("modified", obj.setRect);
    obj.setRect();
    obj.update=function(r)
    {
       this.updateEvent.r=r; this.dispatchEvent (this.updateEvent);
    };
    obj.themesObjectEntry = {components: [
            {name: 'frame', elements: [obj.divInner]},
            {name: 'body', elements: [obj.divMain]},
            {name: 'text', elements: []}
        ]
    };
    Themes.register(obj.themesObjectEntry);
    obj.close = function   (){
        rect.removeEventListener("resize", this.setRect);
        this.dispatchEvent(this.closeEvent);
        Themes.remove(this.themesObjectEntry);
    };
}
