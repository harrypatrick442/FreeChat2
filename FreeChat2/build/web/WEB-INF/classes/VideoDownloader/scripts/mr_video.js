function MrVideo()
{
    var self = this;
    this.div = pickupElseCreateElement('divMrVideo', 'div');
    this.div.style.width = '100px';
    this.div.style.height = '53px';
    this.div.style.position = 'absolute';
    this.div.style.left = 'calc(50% - 50px)';
    this.div.style.zIndex = '1000';
    // this.div.style.marginLeft = '-50px';
    this.div.style.top = '10px';
    var img = pickupElseCreateElement('imgMrVideo', 'img');
    img.style.width = '100%';
    img.style.height = '100%';
    this.div.appendChild(img);
    this.div.style.cursor = Cursors.hand;
    makeUndraggable(this.div);
    makeUndraggable(img);

    function makeUndraggable(element)
    {
        element.style.webkitUserDrag = ' none';
        element.style.khtmlUserDrag = ' none';
        element.style.mozUserDrag = ' none';
        element.style.oUserDrag = ' none';
        element.style.userDrag = ' none';
    }
    (function Controller(img, div)
    {
        var CurrentEyes = {right: 'right', left: 'left', cross: 'cross', sad: 'sad'};
        var urlLeft = window.thePageUrl + 'images/video_downloader/mr_video_left.png';
        var urlRight = window.thePageUrl + 'images/video_downloader/mr_video_right.png';
        var urlCrossed = window.thePageUrl + 'images/video_downloader/mr_video_cross_eyed.png';
        var urlSad = window.thePageUrl + 'images/video_downloader/mr_video_sad.png';
        var urlSmoking = window.thePageUrl + 'images/video_downloader/mr_video_smoking.png';
        var urlSmokingStoned = window.thePageUrl + 'images/video_downloader/mr_video_smoking_stoned.png';
        var currentEyes = CurrentEyes.right;
        (function initialize()
        {
            img.src = urlRight;
        })();
        function setLeft()
        {
            img.src = urlLeft;
            currentEyes = CurrentEyes.left;
        }
        function setRight()
        {
            img.src = urlRight;
            currentEyes = CurrentEyes.right;
        }
        function setCrossed()
        {
            img.src = urlCrossed;
            currentEyes = CurrentEyes.cross;
        }
        function setSad()
        {
            img.src = urlSad;
            currentEyes = CurrentEyes.sad;
        }
        function setSmoking()
        {
            img.src = urlSmoking;
            currentEyes = CurrentEyes.smoking;
            timer.stop();
            new Timer(function() {
                img.src = urlSmokingStoned;
                timer.reset();
            }, 3000, 1, false);

        }
        self.setSmoking = setSmoking;
        function change()
        {
            if (currentEyes == CurrentEyes.right)
                setLeft();
            else
            if (currentEyes == CurrentEyes.left)
                setRight();
            else
            if (currentEyes == CurrentEyes.smoking)
                setLeft();
        }
        var timer = new Timer(function() {
            change();
            timer.setDelay(Random.get(2000, 1000));

        }, 3000, -1, false);
        var efficientMoveCycle = new EfficientMovingCycle(img);
        var start;
        efficientMoveCycle.onmousedown = function(e) {
            start = [div.offsetLeft - e.pageX, div.offsetTop - e.pageY];
            timer.stop();
            if (timerCrossEyed)
                timerCrossEyed.stop();
            setSad();
            div.style.cursor = Cursors.grab;
        };
        efficientMoveCycle.onmousemove = function(e) {
            drag((start[0] + e.pageX), (start[1] + e.pageY));
        };
        var timerCrossEyed;
        efficientMoveCycle.onmouseup = function() {
            div.style.cursor = Cursors.hand;
            setCrossed();
            if (!timerCrossEyed)
            {
                timerCrossEyed = new Timer(function() {
                    setLeft();
                    timer.reset();
                }, 2000, 1, false);
            }
            else
                timerCrossEyed.reset();
        };

        function drag(x, y)
        {
            div.style.left = String(x) + 'px';
            div.style.top = String(y) + 'px';
        }
        ;
    })(img, this.div);
}