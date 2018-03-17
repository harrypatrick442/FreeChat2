function Spinner(name) {
    var self = this;
    if(!name)
        name=2;
    var design = Spinner.designs[name];
    this.div = document.createElement('div');
    this.div.id = design.id;
    this.div.style.position = 'absolute';
    this.div.style.margin = 'auto';
    for (var i = 1; i < 9; i++)
    {
        var div = document.createElement('div');
        div.id = design.childIdPrefix + String(i);
        div.className = design.childClassName;
        this.div.appendChild(div);
    }
    this.show=function()
    {
      self.div.style.display='block';  
    };
    this.hide = function()
    {
      self.div.style.display='none';  
    };
    this.center = function()
    {
    self.div.style.top = 'calc(50% - '+String(self.div.offsetWidth/2)+'px)';
    self.div.style.left = 'calc(50% - '+String(self.div.offsetHeight/2)+'px)';  
    };
}
Spinner.designs = {1: {id: 'floatingCirclesG', childIdPrefix: 'frotateG_', nChildren: 8, childClassName: 'f_circleG'}, 2: {id: 'circularG', childIdPrefix: 'circularG_', nChildren: 8, childClassName: 'circularG'}};
    