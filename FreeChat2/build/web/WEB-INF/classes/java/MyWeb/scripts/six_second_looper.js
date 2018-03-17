var SixSecondLooper = new (function() {
    var looper = new Looper(6000);
    this.add = looper.add;
    this.remove = looper.rempve;
})();
