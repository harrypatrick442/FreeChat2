function Rectangle(dimensionWidth, dimensionHeight)
{

    var self = this;
    EventEnabledBuilder(this);
    var modifiedEvent = new CustomEvent("modified");
    function dispatchModifiedEvent() {
        self.dispatchEvent (modifiedEvent);
    }
    this.setWidth=function(width)
    {
        dimensionWidth= width;
        evaulateWidth();
        dispatchModifiedEvent();
    };
    this.setHeight=function(height)
    {
        dimensionHeight= height;
        evaulateHeight();
        dispatchModifiedEvent();
    };
    this.set=function(width, height)
    {
        dimensionWidth= width;
        evaulateWidth();
        dimensionHeight= height;
        evaulateHeight();
        dispatchModifiedEvent();
    };
    function evaulateWidth() {
        if (dimensionWidth)
        {
            self.width = dimensionWidth;
            self.isDefaultWidth = false;
        } else
        {
            self.width = Dimension.Default;
            self.isDefaultWidth = true;
        }
        dimensionWidth.addEventListener('modified', dispatchModifiedEvent);
    }
    function evaluateHeight(){
        if (dimensionHeight)
        {
            self.height = dimensionHeight;
            self.isDefaultHeight = false;
        } else {
            self.height = Dimension.Default;
            self.isDefaultHeight = true;
        }
        dimensionHeight.addEventListener('modified', dispatchModifiedEvent);
    }
    evaulateWidth();
    evaluateHeight();
}