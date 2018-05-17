function ExpandingTextInput()
{   
    var self=this;
    this.div = document.createElement('div');
    this.div.style.float='left';
    this.div.style.position='relative';
    this.text = document.createElement('input');
    this.text.type = 'text';
    this.text.style.float='left';
    this.text.style.position='absolute';
    var span = document.createElement('span');
    span.style.visibility='hidden';
    span.style.float='left';
    span.style.position='relative';
    this.div.appendChild(span);
    this.div.appendChild(this.text);
    this.text.onkeyup = function () {
        span.innerHTML = self.text.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };
}