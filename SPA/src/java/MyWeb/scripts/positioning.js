function getAbsolute(element)
{
    var offsets = {};
    offsets.left = 0;
    offsets.right = 0;
    offsets.top = 0;
    offsets.bottom = 0;
    var skip=0;
    try{
        while(true)
        {
            var rect=element.getBoundingClientRect();
            if(skip==0)
            {
            offsets.left += element.offsetLeft- element.scrollLeft;
            offsets.right += element.offsetRight- element.scrollRight;
            offsets.top +=  element.offsetTop- element.scrollTop;
            offsets.bottom += element.offsetBottom- element.scrollBottom;
        }
        else
        {
            skip--;
        }
            if(element.parentElement==document.documentElement)
            {
                return offsets;
            }
            element = element.parentElement;
        }
    }
    catch(ex)
    {

    }
}
function getZIndex (element) {      
  var z = window.document.defaultView.getComputedStyle(element).getPropertyValue('z-index');
  if (isNaN(z)) return window.getZIndex(element.parentNode);
  return z; 
};