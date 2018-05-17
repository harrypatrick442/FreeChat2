function WallItem(jObject, callbackGetAllWallItems)
{
    var self = this;
    this.div = document.createElement('div');
    switch(jObject.type)
    {
        case'image':
            var img = document.createElement('img');
            img.src=window.thePageUrl+jObject.image_src;
            img.style.position='static';
            img.style.width='100%';
            img.style.height='100%';
            self.div.appendChild(img);
            this.expand=function()
            {
                
            };
            this.collapse=function()
            {
                
            };
            break;
            case 'file':
                break;
            case 'url':
                break;
    }
    function expandThisOnly()
    {
        var items = callbackGetAllWallItems();
        for(var i=0; i<items.length; i++)
        {
            var item=items[i];
            if(item!=self)
            {
                item.collapse();
            }
        }
        self.expand();
    }
    this.div.addEventListener("click", expandThisOnly);
}