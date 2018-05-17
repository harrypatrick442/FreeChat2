var GoogleMaps =new (function () {
    var initialized = false;
    this.get = function (callback) {
        if (!initialized)
        {
            var runObject = httpJsonpAsynchronous(undefined, callback, undefined, 10000, undefined, true, true);
            runObject.run("https://maps.googleapis.com/maps/api/js?key=AIzaSyA8YK1QPEwKxSWLT1Mjh45xz_3R4Crxo9g&libraries=places&callback=" + runObject.callbackName);
        } else
            callback();
    };
})();