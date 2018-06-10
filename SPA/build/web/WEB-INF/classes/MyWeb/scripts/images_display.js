function ImagesDisplay(path, pictures, callbackUpload, callbackOperations)
{
    var self = this;
    var imageDisplays = [];
    var clickingButton = false;
    this.div = document.createElement('div');
    this.div.style.backgroundColor = "rgba(10,10,10,0.1)";
    this.div.style.overflowY = 'hidden';
    this.div.style.overflowX = 'hidden';
    var divImageDisplayHousing = document.createElement('div');
    divImageDisplayHousing.style.height = '100%';
    divImageDisplayHousing.style.width = 'auto';
    divImageDisplayHousing.style.position = 'absolute';
    divImageDisplayHousing.style.top = '0px';
    divImageDisplayHousing.style.left = '0px';
    divImageDisplayHousing.style.overflowY = 'hidden';
    divImageDisplayHousing.style.overflowX = 'visible';
    divImageDisplayHousing.style.minWidth = '10000px';
    divImageDisplayHousing.style.cursor = Cursors.hand;

    var divImageDisplayHousingMeasurer = document.createElement('div');
    divImageDisplayHousingMeasurer.style.height = '100%';
    divImageDisplayHousingMeasurer.style.width = 'auto';
    divImageDisplayHousingMeasurer.style.position = 'relative';
    divImageDisplayHousingMeasurer.style.float = 'left';
    this.div.appendChild(divImageDisplayHousing);
    divImageDisplayHousing.appendChild(divImageDisplayHousingMeasurer);

    var efficientMovingCycle = new EfficientMovingCycle(divImageDisplayHousing);
    var startOffsets;
    efficientMovingCycle.onmousedown = function(e) {
        e.preventDefault && e.preventDefault();
        return mouseDown(e.pageX, e.pageY);
    };
    efficientMovingCycle.onmouseup = mouseUp;
    efficientMovingCycle.onmousemove = function(e) {
        e.preventDefault && e.preventDefault();
        mouseMove(e.pageX, e.pageY);
    };
    efficientMovingCycle.ontouchstart = function(e) {
        e.preventDefault && e.preventDefault();
        return mouseDown(e.changedTouches[e.changedTouches.length - 1].pageX, e.changedTouches[e.changedTouches.length - 1].pageY);
    };
    efficientMovingCycle.ontouchmove = function(e) {
        e.preventDefault && e.preventDefault();
        mouseMove(e.changedTouches[e.changedTouches.length - 1].pageX, e.changedTouches[e.changedTouches.length - 1].pageY);
    };
    efficientMovingCycle.ontouchend = mouseUp;
    if (callbackUpload)
        divImageDisplayHousingMeasurer.appendChild(new ImageAdd().div);
    this.addImage = function(picture)
    {
        var imageDisplay = new ImageDisplay(picture.relativePath, picture.isProfile);
        divImageDisplayHousingMeasurer.appendChild(imageDisplay.div);
        imageDisplays.push(imageDisplay);
        if(callbackUpload)
            updateButtons();
    };
    this.addImages = function(pictures)
    {
        for (var i = 0; i < pictures.length; i++)
        {
            var picture = pictures[i];
            console.log('picture');
            console.log(picture);
            var imageDisplay = new ImageDisplay(picture.relativePath, picture.isProfile);
            divImageDisplayHousingMeasurer.appendChild(imageDisplay.div);
            imageDisplays.push(imageDisplay);
        }
        if(callbackUpload)
            updateButtons();
    };
    function updateButtons()
    {
        if (imageDisplays.length > 0)
        {
            imageDisplays[0].showRight();
            imageDisplays[imageDisplays.length - 1].showLeft();
            imageDisplays[0].hideLeft();
            imageDisplays[imageDisplays.length - 1].hideRight();
            if (imageDisplays.length > 1)
            {
                for (var i = 1; i < imageDisplays.length - 1; i++)
                {
                    imageDisplays[i].showLeft();
                    imageDisplays[i].showRight();
                }
            }
        }
    }
    function shiftLeft(imageDisplay)
    {
        var index = imageDisplays.indexOf(imageDisplay);
        if (index > 0)
        {
            divImageDisplayHousingMeasurer.removeChild(imageDisplay.div);
            divImageDisplayHousingMeasurer.insertBefore(imageDisplay.div, imageDisplays[index - 1].div);
            imageDisplays.splice(index, 1);
            index--;
            imageDisplays.splice(index, 0, imageDisplay);
            updateButtons();

        }
    }
    function shiftRight(imageDisplay)
    {
        var index = imageDisplays.indexOf(imageDisplay);
        if (index < imageDisplays.length)
        {
            divImageDisplayHousingMeasurer.removeChild(imageDisplay.div);
            if (index < imageDisplays.length - 2)
                divImageDisplayHousingMeasurer.insertBefore(imageDisplay.div, imageDisplays[index + 2].div);
            else
                divImageDisplayHousingMeasurer.appendChild(imageDisplay.div);
            imageDisplays.splice(index, 1);
            index++;
            imageDisplays.splice(index, 0, imageDisplay);
            updateButtons();
        }
    }
    function removeImage(imageDisplay)
    {

        var index = imageDisplays.indexOf(imageDisplay);
        imageDisplays.splice(index, 1);
        divImageDisplayHousingMeasurer.removeChild(imageDisplay.div);
        updateButtons();
    }
    function canUnprofile(imageDisplay){
        var nProfile = 0;
        foreach(imageDisplays, function(imageDisplay){
            if(imageDisplay.isProfile())
            {
                nProfile++;
            }
        });
        return nProfile>1;
    }
    function canDelete(i){
        var nOtherProfile = 0;
        foreach(imageDisplays, function(imageDisplay){
            if(i!=imageDisplay)
            if(imageDisplay.isProfile())
            {
                nOtherProfile++;
            }
        });
        return nOtherProfile>0;
    }
    this.addImages(pictures);
    function mouseDown(x, y)
    {
        if (clickingButton) {
            console.log('dsfdsffds');
            return false;
        }
        divImageDisplayHousing.style.cursor = Cursors.grab;
        startOffsets = {x: x - divImageDisplayHousing.offsetLeft, maxLeft: (self.div.offsetWidth > divImageDisplayHousingMeasurer.offsetWidth) ? 0 : maxLeft = self.div.offsetWidth - divImageDisplayHousingMeasurer.offsetWidth};
    }
    var previousLeft = 0;
    function mouseMove(x, y)
    {
        var left = x - startOffsets.x;
        if (left > 0)
        {
            left = 0;
        } else
        {
            if (left < startOffsets.maxLeft)
            {
                left = startOffsets.maxLeft;
            }
        }

        previousLeft = left;

        divImageDisplayHousing.style.left = String(left) + 'px';
    }
    function mouseUp() {
        divImageDisplayHousing.style.cursor = Cursors.hand;
    }
    var optionPaneError = new OptionPane(this.div);
    function showError(message){
        
                    optionPaneError.show([['Ok', function () {
                            }]], message, function () {
                    });
                    optionPaneError.div.style.left = '6px';
                    optionPaneError.div.style.width = String(self.div.offsetWidth)+'px';
                    optionPaneError.div.style.marginLeft = '0px';
    };
    this.resized = function()
    {
        var m = (self.div.offsetWidth > divImageDisplayHousingMeasurer.offsetWidth) ? 0 : self.div.offsetWidth - divImageDisplayHousingMeasurer.offsetWidth;
        if (previousLeft != undefined)
        {

            if (m < previousLeft)
            {
                m = previousLeft;
            } else
            {
                previousLeft = m;
            }
        }
        divImageDisplayHousing.style.left = String(m) + 'px';
    };
    function ImageDisplay(relativePath, isProfile)
    {
        var self = this;
        this.div = document.createElement('div');
        this.div.style.height = '100%';
        this.div.style.width = 'auto';
        this.div.style.position = 'relative';
        this.div.style.float = 'left';
        var img = document.createElement('img');
        img.style.height = '100%';
        img.src = path + relativePath;
        this.div.appendChild(img);
        var top = 10;
        if (callbackUpload)
        {
            function createControlButton(src, srcHover, callback)
            {
                var controlButton = new ControlButton(src, srcHover, top, callback);
                top += 20;
                self.div.appendChild(controlButton.div);
                return controlButton;
            }
            var showRight = true;
            var showLeft = true;
            if (!isMobile)
                new Hover(this.div, function() {
                    if (showLeft)
                        buttonLeft.div.style.display = 'inline';
                    if (showRight)
                        buttonRight.div.style.display = 'inline';
                    buttonDelete.div.style.display = 'inline';
                    buttonProfile.div.style.display = 'inline';
                }, function() {
                    buttonLeft.div.style.display = 'none';
                    buttonRight.div.style.display = 'none';
                    buttonDelete.div.style.display = 'none';
                    buttonProfile.div.style.display = 'none';
                });
            var buttonRight = createControlButton('images/arrow_right.png', 'images/arrow_right_hover.png', function() {
                callbackOperations({type: 'shift_right', relativePath: relativePath});
                shiftRight(self);
            });
            var buttonLeft = createControlButton('images/arrow_left.png', 'images/arrow_left_hover.png', function() {
                callbackOperations({type: 'shift_left', relativePath: relativePath});
                shiftLeft(self);
            });
            var buttonProfile;
                    buttonProfile= createControlButton(isProfile?'images/set_not_profile.png':'images/set_profile.png', isProfile?'images/set_not_profile_hover.png':'images/set_profile_hover.png', function() {
                        console.log(canUnprofile(self));
                        if((!isProfile)||canUnprofile(self))
                        {
                            isProfile?callbackOperations({type: 'set_not_profile', relativePath: relativePath}):callbackOperations({type: 'set_profile', relativePath: relativePath});
                            isProfile=!isProfile;
                            buttonProfile.setSrcs(isProfile?'images/set_not_profile.png':'images/set_profile.png', isProfile?'images/set_not_profile_hover.png':'images/set_profile_hover.png');
                        }
                        else{
                            showError("You can't unprofile your only profile picture!");
                        }
            });
            var buttonDelete = createControlButton('images/delete.png', 'images/delete_hover.png', function() {
                if(canDelete(self)){callbackOperations({type: 'delete', relativePath: relativePath});
                removeImage(self);}else showError("You can't delete your only profile picture!");
            });
            this.showRight = function()
            {
                showRight = true;
            };
            this.hideLeft = function()
            {
                showLeft = false;
                buttonLeft.div.style.display = 'none';
            };
            this.showLeft = function()
            {
                showLeft = true;
            };
            this.hideRight = function()
            {
                showRight = false;
                buttonRight.div.style.display = 'none';
            };
            this.isProfile=function(){
                return isProfile;
            };
        }

    }
    function ControlButton(src, srcHover, top, callback)
    {
        this.div = document.createElement('div');
        this.div.style.cursor = 'pointer';
        this.div.style.height = '20px';
        this.div.style.width = '20px';
        this.div.style.top = String(top) + 'px';
        this.div.style.right = '2px';
        this.div.style.position = 'absolute';
        this.div.style.display = isMobile ? 'inline' : 'none';
        var img = document.createElement('img');
        img.style.width = '100%';
        img.style.height = '100%';
        img.src = src;
        img.style.opacity = "0.75";
        var hovering=false;
        new Hover(this.div, function() {
            hovering=true;
            img.src = srcHover;
        }, function() {
            hovering=false;
            img.src = src;
            clickingButton = false;
        });
        this.div.appendChild(img);
        this.div.addEventListener('mousedown', function() {
            clickingButton = true;
        });
        this.div.addEventListener('mouseup', function() {
            clickingButton = false;
            callback();
        });
        this.setSrcs=function(srcIn, srcHoverIn)
        {
            src=srcIn;
            srcHover=srcHoverIn;
            img.src=hovering?srcHover:src;
        };
    }
    function ImageAdd()
    {
        this.div = document.createElement('div');
        this.div.style.height = '100%';
        this.div.style.width = 'auto';
        this.div.style.position = 'relative';
        this.div.style.float = 'left';
        this.div.style.cursor = 'pointer';
        this.div.onclick = callbackUpload;
        function styleImg(img)
        {
            img.style.maxHeight = '100%';
            img.style.verticalAlign = 'middle';
        }
        var img = document.createElement('img');
        img.src = window.thePageUrl + 'images/add_image.png';
        img.style.position = 'absolute';
        styleImg(img);
        var imgButton = document.createElement('img');
        imgButton.src = window.thePageUrl + 'images/add_image_button.png';
        styleImg(imgButton);
        this.div.appendChild(img);
        this.div.appendChild(imgButton);
        new Hover(this.div, function() {
            imgButton.src = window.thePageUrl + 'images/add_image_button_blue.png';
        }, function() {
            imgButton.src = window.thePageUrl + 'images/add_image_button.png';
        });
    }
}