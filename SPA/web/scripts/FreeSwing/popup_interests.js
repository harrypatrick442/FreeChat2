function PopupInterests(parentDiv, callback)
{
    var self=this;
    var popupInterests = new Popup(parentDiv, 'absolute', false, {width: '100%', height: 'auto', left: '0px', top: '24px'}            , function(){
        callback(self.getValues());
    });
    popupInterests.div.style.minHeight = '10px';
    var divInterests = document.createElement('div');
    function stylePopupFrame(div)
    {
        div.style.height = 'auto';
        div.style.minHeight = '10px';
        div.style.width = '100%';
        div.style.marginTop = '2px';
        div.style.marginBottom = '2px';
        div.style.position = 'relative';
        div.style.float = 'left';
    }
    stylePopupFrame(divInterests);
    var tickBoxesInterests = new TickBoxes(Interests.values, 'combination', '100%', '190px', "Interested in:", true);
    divInterests.appendChild(tickBoxesInterests.div);
    popupInterests.div.appendChild(divInterests);
    this.setValues = function (interests) {
        var o={left:interests['like'], right:interests.dislike};
        tickBoxesInterests.setValues(o);
    };
    this.getValues=function(){
        var o= tickBoxesInterests.getValues();
        return{like:o.left, dislike:o.right};
    };
    this.show=function(){
        popupInterests.show();
    };
}
