function Dimension(sizes, sizeType, maxSizeType, minSizeType)
{
    var self = this;
    EventEnabledBuilder(this);
    var modifiedEvent = new CustomEvent("modified");
    function dispatchModifiedEvent() {
        self.dispatchEvent (modifiedEvent);
    }
    this.set = function (sizes, sizeType, maxSizeType, minSizeType)
    {
        _set(sizes, sizeType, maxSizeType, minSizeType);
        dispatchModifiedEvent();
    };
    function _set(sizes, sizeType, maxSizeType, minSizeType) {
        var sizeCount = 0;
        function setThisSizes(name, sizeType)
        {
            if (sizeType && (sizeCount < sizes.length || sizeType == Dimension.Type.Auto))
            {
                var sizeX = sizes[sizeCount];
                switch (sizeType)
                {
                    case Dimension.Type.Percent:
                        self[name] = sizeX;
                        self[name + 'String'] = String(sizeX) + '%';
                        sizeCount++;
                        break;
                    case Dimension.Type.Fixed:
                        self[name] = sizeX;
                        self[name + 'String'] = String(sizeX) + 'px';
                        sizeCount++;
                        break;
                    case Dimension.Type.Calc:
                        self[name] = sizeX;
                        self[name + 'String'] = 'calc(' + sizeX + ')';
                        sizeCount++;
                        break;
                    default:
                        self[name + 'String'] = 'auto';
                        self.isAuto = true;
                        break;
                }
            }
        }
        self.sizeType = sizeType;
        self.maxSizeType = maxSizeType;
        self.minSizeType = minSizeType;
        setThisSizes('size', sizeType);
        setThisSizes('maxSize', maxSizeType);
        setThisSizes('minSize', minSizeType);
    };
    _set(sizes, sizeType, maxSizeType, minSizeType);
    this.getSizeString = function () {
        return self.sizeString;
    };
    this.getMaxSizeString = function () {
        return self.minSizeString;
    };
    this.getMinSizeString = function () {
        return self.maxSizeString;
    };
}
Dimension.Type = {Auto: 'auto', Fixed: 'fixed', Percent: 'percent', Calc: 'calc'};
Dimension.Default = new Dimension([100], Dimension.Type.Fixed);