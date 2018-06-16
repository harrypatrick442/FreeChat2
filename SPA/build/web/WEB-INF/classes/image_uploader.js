function ImageUploader(crop, aspectRatio, jObjectExtra, callbacks, forName)
{


    var self = this;
    var settings = new Settings("#image_uploader", function () {
        this.set("position");
        this.set("size");
        //this is a reset function for this particualr instance of this particular class.
    });
    var genericWindow = new GenericWindow({
        name:'Image Uploader',
        tooltipMessage:'Used to pick location',
        iconPath:'images/upload-image-icon.gif',
        minWidth:250,
        maxWidth:1000,
        minHeight:250,
        maxHeight:1000,
        defaultWidth:250,
        defaultHeight:250,
        defaultX:250,
        defaultY:250,
        minimized:true,
        minimizable:true,
        maximizable:false,
        minimizeOnClose:true});
    this.type = 'ImageUploader';
    var buttonChooseCover = document.createElement('input');
    var buttonChoose = document.createElement('input');
    var textPath = document.createElement('input');
    var divProcessText = document.createElement('div');
    var imgPreview = document.createElement('img');
    var divCroppingFrame = document.createElement('div');
    var imgCroppingFrame = document.createElement('img');
    var buttonUpload = document.createElement('input');
    var divCroppingTool = document.createElement('div');
    var imgMove = document.createElement('img');
    var imgCroppingToolTab = document.createElement('img');
    var divSpinner = document.createElement('div');
    var colorProcessText='#ffffff';
    genericWindow.setName("Image uploader for: "+ forName);
    
    this.setup = function (cropIn, aspectRatioIn, jObjectExtraIn, callbacksIn, forNameIn)
    {
        crop = cropIn;
        forName=forNameIn;
        aspectRatio = aspectRatioIn;
        jObjectExtra = jObjectExtraIn;
        callbacks = callbacksIn;
        genericWindow.setName("Image uploader for: "+ forNameIn);
        setProcessingText("");
        move(); resize();
    };
    var imageUploader = {};
    var mouseStateResize = 'up';
    var mouseStateMove = 'up';
    var mouseStartOffsets = [];
    var mouseStartOffsetsResize = [];
    var set = false;
    var file;
    imageUploader.jObjectExtra = jObjectExtra;

    buttonChooseCover.type = 'button';
    buttonChooseCover.value = 'Choose Image';
    buttonChooseCover.style.width = '125px';
    buttonChooseCover.style.left = '0px';
    buttonChooseCover.style.top = '5px';
    buttonChooseCover.style.position = 'absolute';
    buttonChooseCover.style.color = '#000000';
    buttonChooseCover.style.fontSize = '14px';
    buttonChooseCover.style.fontFamily = 'Arial';
    buttonChooseCover.style.cursor = 'pointer';

    buttonChoose.type = 'file';
    buttonChoose.accept = '.gif, .jpeg, .jpg, .bmp, .png';
    buttonChoose.style.width = '74px';
    buttonChoose.style.height = '22px';
    buttonChoose.style.left = '0px';
    buttonChoose.style.top = '0px';
    buttonChoose.style.position = 'absolute';
    buttonChoose.style.border = '0px';
    buttonChoose.style.color = 'transparent';
    buttonChoose.style.backgroundColor = 'transparent';
    buttonChoose.style.display = 'none';
    buttonChoose.style.cursor = 'pointer';
    textPath.style.type = 'text';
    textPath.style.position = 'absolute';
    textPath.style.width = 'calc(100% - 160px)';
    textPath.style.height = '20px';
    textPath.style.right = '10px';
    textPath.style.top = '10px';
    textPath.style.fontSize = '14px';
    textPath.style.border = '0px';
    textPath.style.backgroundColor = 'transparent';
    textPath.readOnly = true;
    divProcessText.style.width = '100%';
    divProcessText.style.height = '20px';
    divProcessText.style.bottom = '35px';
    divProcessText.style.position = 'absolute';
    divProcessText.style.backgroundColor = 'transparent';
    divProcessText.style.textAlign = ' center';
    divProcessText.style.verticalAlign = ' middle';
    divProcessText.style.fontSize='14PX';
    divProcessText.style.fontFamily='Arial';
    divProcessText.style.whiteSpace='nowrap';
    divProcessText.style.overflow='hidden';
    divProcessText.style.textOverflow='ellipsis';
    imgPreview.style.objectFit = ' contain';
    imgPreview.style.position = 'absolute';
    divCroppingFrame.style.width = '100%';
    divCroppingFrame.style.height = 'calc(100% - 70px)';
    divCroppingFrame.style.top = '35px';
    divCroppingFrame.style.left = '0px';
    divCroppingFrame.style.position = 'absolute';
    divCroppingFrame.style.overflowY = 'scroll';
    divCroppingFrame.style.backgroundColor = '#ffffff';
    imgCroppingFrame.style.width = 'calc(100% - 4px)';
    imgCroppingFrame.style.top = '1px';
    imgCroppingFrame.style.left = '1px';
    imgCroppingFrame.style.position = 'absolute';
    buttonUpload.type = 'button';
    buttonUpload.value = 'Done';
    buttonUpload.style.position = 'absolute';
    buttonUpload.style.width = '70px';
    buttonUpload.style.left = 'calc(50% - 35px)';
    buttonUpload.style.bottom = '5px';
    buttonUpload.style.color = '#000000';
    buttonUpload.style.fontSize = '14px';
    buttonUpload.style.fontFamily='Arial';
    buttonUpload.style.cursor = 'pointer';
    divCroppingTool.style.cursor = 'move';
    divCroppingTool.style.width = '10px';
    divCroppingTool.style.height = '10px';
    divCroppingTool.style.top = '0px';
    divCroppingTool.style.left = '0px';
    divCroppingTool.style.position = 'absolute';
    divCroppingTool.style.border = '1px dashed #000000';
    divCroppingTool.style.display = 'none';
    divCroppingTool.className = 'divCroppingTool';
    imgMove.style.position = 'absolute';
    imgMove.style.right = 'calc(50% - 24px)';
    imgMove.style.top = 'calc(50% - 24px)';
    imgMove.style.width = '48px   ';
    imgMove.style.height = '48px';
    imgMove.style.display = 'none';
    imgMove.src = window.thePageUrl+'images/move.png';
    imgMove.style.cursor='move';
    imgCroppingToolTab.style.width = '48px';
    imgCroppingToolTab.style.height = '48px';
    imgCroppingToolTab.style.bottom = '-1px';
    imgCroppingToolTab.style.right = '-1px';
    imgCroppingToolTab.style.position = 'absolute';
    imgCroppingToolTab.style.cursor = 'se-resize';
    imgCroppingToolTab.src = window.thePageUrl+'images/se-resize.png';
    divSpinner.style.width = '188px';
    divSpinner.style.height = '188px';
    divSpinner.style.bottom = '60px';
    divSpinner.style.left = 'calc(50% - 94px)';
    divSpinner.style.position = 'absolute';
    divSpinner.style.display = 'none';
    var spinner = new Spinner(1);
    spinner.div.style = 'top:calc(50% - ' + String(spinner.div.style.height) + ')';
    divSpinner.appendChild(spinner.div);
    genericWindow.divMain.appendChild(buttonChooseCover);
    genericWindow.divMain.appendChild(buttonChoose);
    genericWindow.divMain.appendChild(textPath);
    genericWindow.divMain.appendChild(divProcessText);
    genericWindow.divMain.appendChild(imgPreview);
    genericWindow.divMain.appendChild(divCroppingFrame);
    divCroppingFrame.appendChild(imgCroppingFrame);
    genericWindow.divMain.appendChild(buttonUpload);
    divCroppingFrame.appendChild(divCroppingTool);
    divCroppingTool.appendChild(imgCroppingToolTab);
    imgMove.style.display = 'inline';
    divCroppingTool.appendChild(imgMove);
    genericWindow.divMain.appendChild(divSpinner);
    buttonUpload.onclick = function () {
        if (set) {
            uploadImage(file);
        }
        else
        {
            setProcessingText('You must select an image first!');
        }
    };
    imgCroppingToolTab.addEventListener('mousedown', onMouseDownResize, false);
    document.documentElement.addEventListener("mouseup", function () {
        onMouseUp();
    });
    document.documentElement.addEventListener("mouseleave", function () {
        onMouseUp();
    });
    divCroppingFrame.addEventListener('mousemove', onMouseMove, false);
    buttonChooseCover.onclick = function () {
        buttonChoose.click();
    };
    buttonChoose.onclick = function () {
        this.value = null;
    };
    buttonChoose.addEventListener('change', handleFileSelected, false);
    imgPreview.style.display = 'none';
    function onMouseDownMove(e)
    {
        mouseStartOffsets[0] = divCroppingTool.offsetLeft - e.pageX;
        mouseStartOffsets[1] = divCroppingTool.offsetTop - e.pageY;
        mouseStateMove = 'down';
        if (e.preventDefault)
        {
            e.preventDefault();
        }
    }
    function onMouseDownResize(e)
    {
        mouseStartOffsetsResize[0] = divCroppingTool.offsetWidth - e.pageX;
        mouseStartOffsetsResize[1] = divCroppingTool.offsetHeight - e.pageY;
        mouseStartOffsetsResize[2] = divCroppingTool.offsetWidth;
        mouseStartOffsetsResize[3] = e.pageX;
        mouseStateResize = 'down';
        if (e.preventDefault)
        {
            e.preventDefault();
        }
    }
    function onMouseUp()
    {
        mouseStateMove = 'up';
        mouseStateResize = 'up';
    }
    function resize(a, height)
    {

        var mY = imgCroppingFrame.offsetHeight - divCroppingTool.offsetTop;
        var mX = imgCroppingFrame.offsetWidth - divCroppingTool.offsetLeft;
        if (a)
        {
            if (height)
            {
                var width = a;
                if (width > mX)
                {
                    width = mX;
                }
                else
                {
                    if (width < 100)
                    {
                        width = 100;
                    }
                }
                if (height > mY)
                {
                    height = mY;
                }
                else
                {
                    if (height < 100)
                    {
                        height = 100;
                    }
                }
            }
            else
            {
                if (a > mX)
                {
                    a = mX;
                }
                if (a > mY)
                {
                    a = mY;
                }
                if (a < 100)
                {
                    a = 100;
                }
                width = a;
                height = a;
            }
            divCroppingTool.style.width = String(width) + 'px';
            divCroppingTool.style.height = String(height) + 'px';
        }
        else
        {
            if (mX > divCroppingTool.offsetWidth)
            {
                mX = divCroppingTool.offsetWidth;
            }
            if (mY > divCroppingTool.offsetHeight)
            {
                mY = divCroppingTool.offsetHeight;
            }
            if (aspectRatio)
            {
                if (mX > mY * aspectRatio)
                {
                    mX = mY * aspectRatio;
                }
                else
                {
                    mY = mX / aspectRatio;
                }
            }
            divCroppingTool.style.width = String(mX) + 'px';
            divCroppingTool.style.height = String(mY) + 'px';

        }

    }
    function move(x, y)
    {

        var mX = imgCroppingFrame.offsetWidth - divCroppingTool.offsetWidth;
        var mY = imgCroppingFrame.offsetHeight - divCroppingTool.offsetHeight;
        if (x && y)
        {
            if (x > mX)
            {
                x = mX;
            }
            if (y > mY)
            {
                y = mY;
            }
            if (x < 0)
            {
                x = 0;
            }
            if (y < 0)
            {
                y = 0;
            }
        }
        else
        {
            if (divCroppingTool.offsetLeft > mX)
            {
                if (mX < 0)
                {
                    mX = 0;
                }
            }
            else
            {
                mX = divCroppingTool.offsetLeft;
            }
            if (divCroppingTool.offsetTop > mY)
            {
                if (mY < 0)
                {
                    mY = 0;
                }
            }
            else
            {
                mY = divCroppingTool.offsetTop;
            }
            x = mX;
            y = mY;

        }
        divCroppingTool.style.left = String(x) + 'px';
        divCroppingTool.style.top = String(y) + 'px';
    }
    function onMouseMove(e)
    {
        reposition(e.pageX, e.pageY);
    }
    var first = false;

    function reposition(x, y)
    {

        if (mouseStateResize == 'down')
        {
            if (!aspectRatio)
            {
                resize(mouseStartOffsetsResize[0] + x, mouseStartOffsetsResize[1] + y);
            } else
            {
                x = mouseStartOffsetsResize[2] + (x - mouseStartOffsetsResize[3]) / aspectRatio;
                y = mouseStartOffsetsResize[1] + y;
                var z = (x + y) / 2;
                resize(z);
            }
        } else
        {
            if (mouseStateMove == 'down')
            {
                x = mouseStartOffsets[0] + x;
                y = mouseStartOffsets[1] + y;
                move(x, y);
            }
        }
    }
    if (!isMobile)
    {
        divCroppingTool.addEventListener('mousedown', onMouseDownMove, false);
        imgMove.addEventListener('mousedown', onMouseDownMove, false);
    } else
    {
        imgCroppingToolTab.addEventListener('touchmove', function (e)
        {
            e.preventDefault();
            if (first) {
                first = false;
            }
            reposition(e.touches[0].pageX, e.touches[0].pageY);
        }, false);
        imgMove.addEventListener('touchmove', function (e)
        {
            e.preventDefault();
            if (first) {
                first = false;
            }
            reposition(e.touches[0].pageX, e.touches[0].pageY);
        }, false);
        imgCroppingToolTab.addEventListener('touchstart', function (e)
        {
            first = true;
            mouseStartOffsetsResize[0] = divCroppingTool.offsetWidth - e.touches[0].pageX;
            mouseStartOffsetsResize[1] = divCroppingTool.offsetHeight - e.touches[0].pageY;
            mouseStartOffsetsResize[2] = divCroppingTool.offsetWidth;
            mouseStartOffsetsResize[3] = e.touches[0].pageX;
            mouseStateResize = 'down';
        }, false);
        imgMove.addEventListener('touchstart', function (e)
        {
            first = true;
            mouseStartOffsets[0] = divCroppingTool.offsetLeft - e.touches[0].pageX;
            mouseStartOffsets[1] = divCroppingTool.offsetTop - e.touches[0].pageY;
            mouseStateMove = 'down';
        }, false);
        imgCroppingToolTab.addEventListener('touchend', function (e)
        {
            mouseStateResize = 'up';
        }, false);
        imgMove.addEventListener('touchend', function (e)
        {
            mouseStateMove = 'up';
        }, false);
    }
    function handleFileSelected(evt) {
        textPath.value = this.value;
        var files = evt.target.files;
        if (files) {
            file = files[0];
            setImage(file);
        }
    }
    function setProcessingText(value, red)
    {
        divProcessText.textContent = value;
        if(value&&value.length>0)
        {
            divProcessText.style.display='inline';
            divCroppingFrame.style.height = 'calc(100% - 95px)';
        }
        else
        {
            divProcessText.style.display='none';
            divCroppingFrame.style.height = 'calc(100% - 70px)';
        }
        if(red)
        {
            divProcessText.style.color='#ff0000';
        }
        else
        {
            divProcessText.style.color=colorProcessText;
        }
    }
    function setImage(image)
    {
        var reader = new FileReader();
        reader.onload = function (evt) {
            var data = evt.target.result;
            imgPreview.src = data;
            imgCroppingFrame.src = data;
            imgCroppingFrame.onload = function () {
                imageUploader.height = imgCroppingFrame.naturalHeight;
                imageUploader.width = imgCroppingFrame.naturalWidth;
                if (crop)
                {
                    initializeCroppingTool();
                }
                set = true;
            };
        };
        reader.readAsDataURL(image);
    }
    function initializeCroppingTool()
    {
        var width = imgCroppingFrame.offsetWidth;
        var height = imgCroppingFrame.offsetHeight;
        if(aspectRatio)
        {
            if (width / height > aspectRatio)
            {
                width = height * aspectRatio;
            } else
            {
                height = width / aspectRatio;
            }
        }
        divCroppingTool.style.width = String(width) + 'px';
        divCroppingTool.style.height = String(height) + 'px';
        divCroppingTool.style.left = '0px';
        divCroppingTool.style.top = '0px';
        divCroppingTool.style.display = 'inline';
    }
    var timerFailed;
    function uploadImage(file)
    {
        if (file)
        {
            timerFailed = new Timer(function () {
                setProcessingText('uploading image failed', true);
                divSpinner.style.display = 'none';
            }, 15000, 1);
            divSpinner.style.display = 'inline';
            setProcessingText('reading the file');
            var reader = new FileReader();
            setProcessingText('reading the file...');
            reader.onload = function (evt) {
                setProcessingText('encoding the file...');
                var data = btoa(evt.target.result);
                setProcessingText('sending the file');
                var jObject={};
                jObject.type = "upload_image";
                jObject.data = data;
                jObject.crop = crop;
                jObject.extra = jObjectExtra;
                if (crop)
                {
                    var hf = imageUploader.height / imgCroppingFrame.offsetHeight;
                    var wf = imageUploader.width / imgCroppingFrame.offsetWidth;
                    jObject.w = String(Math.round(divCroppingTool.offsetWidth * wf));
                    jObject.h = String(Math.round(divCroppingTool.offsetHeight * hf));
                    jObject.x = String(Math.round(divCroppingTool.offsetLeft * wf));
                    jObject.y = String(Math.round(divCroppingTool.offsetTop * hf));
                } else
                {
                }
                callbacks.send(jObject);
            };
            reader.readAsBinaryString(file);
        }
    }
    this.interpret = function (jObject)
    {
        divSpinner.style.display = 'none';
        timerFailed.stop();
        if (jObject.successful == true)
        {
            setProcessingText('successfully uploaded image');
            if (Windows.instances)
            {
                for (var i = Windows.instances.length - 2; i < Windows.instances.length; i++)
                {
                    var window = Windows.instances[i];
                    if (window.isRoom)
                    {
                        Windows.bringToFront(window);
                        return;
                    }
                }
            }
        } else
        {
            if (jObject.reason != undefined)
            {
             setProcessingText(jObject.reason, true);   
            }
        }
    };
    //divInner.appendChild(menuBar.div);

    this.show = function ()
    {
        genericWindow.show();
        genericWindow.flash();
        genericWindow.bringToFront(self);
    };
    this.hide = function ()
    {
        genericWindow.hide();
    };
    makeUnselectable(this.div);
    //var windowInformation = new WindowInformation(true, true, 250, 250, 600, 600, 0, 100, 0, Windows.maxYPx, true,false, true);
    //var windowCallbacks = new WindowCallbacks(
    //        
     //       function()
    //{
      //          settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
        //        settings.set("size", [self.div.offsetWidth, self.div.offsetHeight]);
    //},
    //function(){
      //  if(self.div.offsetLeft&&self.div.offsetTop)
        //settings.set("position", [self.div.offsetLeft, self.div.offsetTop]);
    //},
    //function(){
      //  self.task.minimize();}
    //, undefined, function(){
      //  self.task.minimize();}
        //    , function(zIndex){settings.set("zIndex", zIndex);}
          //  ,function(){
            //    move(); resize();
            //});
            //var params = {obj: this,
        //minimized: true,
        //divTab: self.divTab,
        //divInner: self.divInner,
        //windowInformation: windowInformation,
        //callbacks: windowCallbacks};
    //Windows.add( params);
    //TaskBar.add(this);
}
ImageUploader.show = function (crop, aspectRatio, jObjectExtra, callbacks, forName)
{
    if (!ImageUploader.instance)
    {
        ImageUploader.instance = new ImageUploader(crop, aspectRatio, jObjectExtra, callbacks, forName);
    }
    else
    {
        ImageUploader.instance.setup (crop, aspectRatio, jObjectExtra, callbacks, forName);
    }
    ImageUploader.instance.show();
};
ImageUploader.interpret=function(jObject)
{
  if(ImageUploader.instance)
  {
      ImageUploader.instance.interpret(jObject);
  }
};