function ExpandingTextarea(minHeight, callbackResized)
{
    var self = this;
    self.textarea = document.createElement('textarea');
    self.textarea.style.resize='none';
    self.textarea.style.overflow='hidden';
    var observe;
    if (window.attachEvent) {
        observe = function (element, event, handler) {
            element.attachEvent('on' + event, handler);
        };
    } else {
        observe = function (element, event, handler) {
            element.addEventListener(event, handler, false);
        };
    }

    function resize() {
        self.textarea.style.height = 'auto';
        var heightString=(self.textarea.scrollHeight<minHeight?minHeight:self.textarea.scrollHeight)+ 'px';
        self.textarea.style.height = heightString;
        console.log('set height to'+heightString);
        if(callbackResized)
            callbackResized(self.textarea.scrollHeight, heightString);
    }
    this.resize=resize;
    /* 0-timeout to get the already changed text */
    function delayedResize() {
        window.setTimeout(resize, 0);
    }
    observe(self.textarea, 'change', resize);
    observe(self.textarea, 'cut', delayedResize);
    observe(self.textarea, 'paste', delayedResize);
    observe(self.textarea, 'drop', delayedResize);
    observe(self.textarea, 'keydown', delayedResize);
    self.textarea.focus();
    self.textarea.select();
    resize();

}