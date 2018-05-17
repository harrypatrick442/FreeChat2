function EditButton(callback, dontFlipFlop)
    {
        var locked=true;
        this.div = document.createElement('div');
        this.div.style.height = '20px';
        this.div.style.maxHeight = '100%';
        this.div.style.width = 'auto';
        this.div.style.position = 'absolute';
        this.div.style.right = '0px';
        this.div.style.cursor = 'pointer';
        var img = document.createElement('img');
        img.style.height = '100%';
        this.div.style.top = '0px';
        img.style.position = 'relative';
        img.style.float = 'left';
        var hovering = false;
        function setIcon()
        {
            if (hovering)
                img.src = window.thePageUrl + (locked ? 'images/writing_hover.png' : 'images/writing_lock_hover.png');
            else
                img.src = window.thePageUrl + (locked ? 'images/writing.png' : 'images/writing_lock.png');
        }
        this.setIcon=setIcon;
        img.src = window.thePageUrl + (locked ? 'images/writing.png' : 'images/writing_lock.png');
        this.div.appendChild(img);
        setIcon();
        new Hover(this.div, function () {
            hovering = true;
            setIcon();
        }, function () {
            hovering = false;
            setIcon();
        });
        this.div.addEventListener(dontFlipFlop?'click':'mousedown', dontFlipFlop?function(e){callback();
}:function(){
        locked = !locked;
        setIcon();
        callback(locked);
    });
}