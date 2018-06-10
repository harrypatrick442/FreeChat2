function CompositeImage(parentElement, sources) {
    var self = this;
    var img = document.createElement('img');
    img.style.width = '100%';
    parentElement.appendChild(img);
    var index=0;
    this.set = function (sourcesIn) {
        if (sources.length > 0)
            sources = sourcesIn;
    };
    this.dispose = function () {
        parentElement.removeChild(img);
    };
    this.activate = function () {
        if(!contains(CompositeImage.actives, self)) {
            if (sources.length > 0) {
                CompositeImage.actives.push(self);
                if (CompositeImage.actives.length < 2)
                    CompositeImage.timer.reset();
            }
        }
    };
    this.deactivate = function () {
        var index = CompositeImage.actives.indexOf(self);
        if (index >= 0)
            CompositeImage.actives.splice(index, 1);
    };
    if (!CompositeImage.timer) {
        CompositeImage.timer = new Timer(function () {
            foreach(CompositeImage.actives, function (active) {
                active.switch();
            });
        }, 3000, -1);
    }
    this.activate();
    function contains(array, element) {
        return array.indexOf(element) < 0;
    }
    this.switch = function () {
        if (index >= sources.length)
            index = 0;
        img.src = sources[index];
        index++;
    };
}
CompositeImage.actives = [];

