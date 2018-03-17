function Timeout(callback)
{
    var moved = -1;
    var timer = new Timer(function () { if (moved > -1) { if (callback) { callback(); } moved = -1;}}, 10000, -1);
    (function () {
        var oldOnMouseDown = document.documentElement.onmousedown;
        if (oldOnMouseDown == undefined) {
            oldOnMouseDown = function () { };
        }
        document.documentElement.onmousedown = function (e) {
            oldOnMouseDown.apply(this);
            moved = 0;
        };
    })();
}