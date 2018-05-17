
function Tooltip(text)
{
    var self = this;
    if(!isMobile)
    {
    var timerTooltip;
    this.div = document.createElement('div');
    var divBody = document.createElement('div');
    var divArrow = document.createElement('div');
    this.div.style.position='fixed';
    this.div.style.width='auto';
    this.div.style.height='auto';
    this.div.style.display='none';
    this.div.style.zIndex='400000';
    divBody.style.backgroundColor='#222222';
    divBody.style.borderRadius='6px';
    divBody.style.color = '#ffffff';
    divBody.style.padding='6px';
    divBody.style.fontFamily='Arial';
    divArrow.style.width='0'; 
    divArrow.style.height='0'; 
    divArrow.style.borderLeft='10px solid transparent';
    divArrow.style.borderRight='10px solid transparent';
    divArrow.style.borderTop='10px solid #222222';
    divArrow.style.marginLeft='10px';
    setText(divBody, text);
    this.div.appendChild(divBody);
    this.div.appendChild(divArrow);
    document.body.appendChild(this.div);
    }
    this.show = function(x, y)
    {
        if(!isMobile)
        {
            self.div.style.left=String(x-10)+'px';
            self.div.style.display='block';
            self.div.style.top=String(y-(self.div.offsetHeight))+'px';
        }
    };
    this.showAfterDelay = function(x, y){
        if(!isMobile)
        {
            timerTooltip = new Timer(function(){self.show(x, y);}, 800, 1, false);
        }
    };
    this.hide=function()
    {
        if(!isMobile)
        {
            if(timerTooltip)
            {
                timerTooltip.stop();
            }
        self.div.style.display='none';
        }
    };
}
