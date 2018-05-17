
var pickupElseCreateElement;
new (function() {
    var mapElementToDefaultDisplay = {};
    pickupElseCreateElement = function(id, tag)
    {

        var element = document.getElementById(id);
        if (element)
        {
            element.style.display = getDefaultDisplay(element);
            return element;
        }
        else
        {
            var element = document.createElement(tag);
            element.id = id;
            element.isStatic = true;
            element.setAttribute("isStatic", true);
            return element;
        }
    };
    function getDefaultDisplay(element)
    {
        var display = mapElementToDefaultDisplay[element.tag];
        if (!display)
        {
            var temp = document.createElement(element.tag);
            display = temp.style.display;
            delete temp;
            mapElementToDefaultDisplay[element.tag] = display;
        }
        return display;
    }
    function getAllElementsWithAttribute(attribute)
    {
        var matchingElements = [];
        var allElements = document.getElementsByTagName('*');
        for (var i = 0, n = allElements.length; i < n; i++)
        {
            if (allElements[i].getAttribute(attribute) !== null)
            {
                // Element exists with attribute. Add to array.
                matchingElements.push(allElements[i]);
            }
        }
        return matchingElements;
    }
    var iterator = new Iterator(getAllElementsWithAttribute('isStatic'));
    while (iterator.hasNext())
    {
        var element = iterator.next();
        if (element.getAttribute('isStatic'))
        {
            element.style.display = 'none';
        }
    }
    document.body.style.display = bodyDefaultDisplay;
})();