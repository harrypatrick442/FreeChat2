function LobbyVideoDownloader()
{
    this.div = pickupElseCreateElement('divLobbyVideoDownloader', 'div');
    this.div.style.height = '1000px';
    this.div.style.width = '100%';
    this.div.style.textAlign = 'center';
    this.div.style.backgroundColor = '#f7f7f7';//#1199ff';
    var downloadPanel = new DownloadPanel();
    function DownloadPanel()
    {
        var youtubeDownloader = new YoutubeDownloader(function(linksVideos, linksAudios, title, icon) {
            availablePanel.setLinks(linksVideos, linksAudios);
            progressPanel.hide();
            aboutPanel.set(title, icon);
            enterPanel.unlock();

        }, function(txt) {
            enterPanel.lock();
            progressPanel.setText(txt);
        }, function(txt) {
            errorPanel.setError(txt);
            progressPanel.hide();
            aboutPanel.hide();
            enterPanel.unlock();
        });
        var borderRadiusString = '10px';
        var borderString = '2px solid #f9ddff';
        var aboutPanel = new AboutPanel();
        var enterPanel = new EnterPanel();
        var errorPanel = new ErrorPanel();
        var progressPanel = new ProgressPanel();
        availablePanel = new AvailablePanel();
        this.div = pickupElseCreateElement('divDownloadPanel', 'div');
        this.div.style.maxWidth = '100%';
        this.div.style.width = '450px';
        this.div.style.webkitBoxShadow = '1px 1px 16px 1px rgba(109,30,204,1)';
        this.div.style.mozBoxShadow = '1px 1px 16px 1px rgba(109,30,204,1)';
        this.div.style.boxShadow = '1px 1px 16px 1px rgba(109,30,204,1)';
        this.div.style.display = 'inline-block';
        this.div.style.backgroundColor = '#5A99F0';
        //this.div.style.background = 'background: -moz-radial-gradient(center, ellipse cover, rgba(0,153,204,1) 0%, rgba(255,255,255,1) 70%, rgba(255,255,255,1) 100%);'; /* ff3.6+ */
//this.div.style.background=' -webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%, rgba(0,153,204,1)), color-stop(78%, rgba(255,255,255,1)), color-stop(100%, rgba(255,255,255,1)))'; /* safari4+,chrome */
//this.div.style.background='-webkit-radial-gradient(center, ellipse cover, rgba(0,153,204,1) 0%, rgba(255,255,255,1) 78%, rgba(255,255,255,1) 100%)'; /* safari5.1+,chrome10+ */
//this.div.style.background=' -o-radial-gradient(center, ellipse cover, rgba(0,153,204,1) 0%, rgba(255,255,255,1) 78%, rgba(255,255,255,1) 100%)'; /* opera 11.10+ */
//this.div.style.background=' -ms-radial-gradient(center, ellipse cover, rgba(0,153,204,1) 0%, rgba(255,255,255,1) 78%, rgba(255,255,255,1) 100%)'; /* ie10+ */
//this.div.style.background='radial-gradient(ellipse at center, rgba(0,153,204,1) 0%, rgba(255,255,255,1) 78%, rgba(255,255,255,1) 100%)'; /* w3c */
//this.div.style.filter=" progid:DXImageTransform.Microsoft.gradient( startColorstr='#0099cc', endColorstr='#ffffff',GradientType=1 )"; /* ie6-9 */
        this.div.style.height = 'auto';
        this.div.style.top = /*String(document.documentElement.clientHeight/2)+*/'70px';
        this.div.style.position = 'relative';
        this.div.style.paddingTop = '8px';
        this.div.style.paddingBottom = '7px';
        this.div.style.textAlign = 'center';
        this.div.style.borderRadius = '8px';
        var divCentered = pickupElseCreateElement('divCenteredDownloadPanel', 'div');
        divCentered.style.width = '580px';
        divCentered.style.maxWidth = '96%';
        divCentered.style.maxWidth = 'calc(100% - 16px)';
        divCentered.style.display = 'inline-block';
        function AboutPanel()
        {
            var self = this;
            this.div = pickupElseCreateElement('divAboutPanel', 'div');
            var divText = pickupElseCreateElement('divTextAboutPanel', 'div');
            var img = pickupElseCreateElement('imgAboutPanel', 'img');
            this.div.style.width = '100%';
            this.div.style.display = 'none';
            this.div.style.marginTop = '4px';
            this.div.style.float = 'top';
            divText.style.fontFamily = 'Arial';
            divText.style.fontSize = '20px';
            divText.style.display = 'block';
            divText.style.boxSizing = 'border-box';
            divText.style.margin = '4px';
            img.style.maxHeight = '100px';
            this.set = function(title, icon) {
                if (title || icon)
                {
                    if (title)
                    {
                        divText.textContent = title;

                        divText.style.display = 'block';
                    }
                    if (icon)
                        img.src = icon;
                    self.div.style.display = 'inline-block';
                }
                else
                    self.hide();
            };
            this.hide = function() {
                self.div.style.display = 'none';
            };
            this.div.appendChild(divText);
            this.div.appendChild(img);
        }
        function EnterPanel()
        {
            var self = this;
            this.div = pickupElseCreateElement('divEnterPanel', 'div');
            var textUrl = pickupElseCreateElement('textUrlEnterPanel', 'input');
            var divUrl = pickupElseCreateElement('divUrlEnterPanel', 'div');
            var buttonDownload = pickupElseCreateElement('buttonDownloadEnterPanel', 'div');
            var imgButtonDownload = pickupElseCreateElement('imgButtonDownloadEnterPanel', 'img');
            this.div.style.heigt = 'auto';
            this.div.style.width = '100%';
            this.div.style.borderRadius = borderRadiusString;
            this.div.style.float = 'top';
            this.div.style.boxSizing = 'border-box';

            console.log('set it as: ');
            console.log(borderRadiusString);
            this.div.style.backgroundColor = '#ffffff';
            this.div.style.border = borderString;
            textUrl.autocomplete="off";
            textUrl.type = 'text';
            textUrl.style.boxSizing = 'border-box';
            textUrl.style.height = '100%';
            textUrl.style.width = '100%';
            textUrl.style.border = '0';
            textUrl.style.borderTopLeftRadius = borderRadiusString;
            textUrl.style.borderBottomLeftRadius = borderRadiusString;
            textUrl.style.paddingLeft = '4px';
            textUrl.style.fontFamily = 'Arial';
            textUrl.style.fontSize = '20px';
            textUrl.placeholder = 'https://www.youtube.com/watch?v=G0scbIjVquU';
            textUrl.onkeydown = function(event) {
                event = event || window.event;
                if (event.keyCode == 13) {
                    startDownload();
                }
            };
            textUrl.onpaste = function(event)
            {
                new Task(function() {
                    startDownload();
                }).run();
            };
            divUrl.style.height = '35px';
            divUrl.style.overflow = 'hidden';
            divUrl.style.margin = '2px';
            divUrl.style.marginRight = '0px';
            buttonDownload.style.height = '35px';
            buttonDownload.style.width = '30px';
            buttonDownload.style.float = 'right';
            buttonDownload.style.overflow = 'hidden';
            buttonDownload.style.boxSizing = 'border-box';
            buttonDownload.style.borderTopRightRadius = borderRadiusString;
            buttonDownload.style.borderBottomRightRadius = borderRadiusString;
            buttonDownload.style.cursor = 'pointer';
            buttonDownload.style.margin = '2px';
            buttonDownload.style.marginLeft = '0px';
            imgButtonDownload.style.height = '100%';
            imgButtonDownload.style.width = '100%';
            var imgDownloadUrl = window.thePageUrl + 'images/video_downloader/download.png';
            var imgDownloadUrlClick = window.thePageUrl + 'images/video_downloader/download_click.png';
            var imgDownloadUrlHover = window.thePageUrl + 'images/video_downloader/download_hover.png';
            var imgDownloadUrlLocked = window.thePageUrl + 'images/video_downloader/download_locked.png';
            imgButtonDownload.src = imgDownloadUrl;
            var hovering = false;
            var mouseDown = false;
            var locked = false;
            if (!isMobile)
                new Hover(buttonDownload, function() {
                    hovering = true;
                    setButtonDownloadImage();
                }, function() {
                    hovering = false;
                    setButtonDownloadImage();
                });
            function setButtonDownloadImage()
            {
                if (!locked)
                {
                    if (!hovering)
                    {
                        mouseDown = false;
                        imgButtonDownload.src = imgDownloadUrl;
                    }
                    else
                    {
                        if (mouseDown)
                            imgButtonDownload.src = imgDownloadUrlClick;
                        else
                            imgButtonDownload.src = imgDownloadUrlHover;
                    }
                }
                else
                {
                    imgButtonDownload.src = imgDownloadUrlLocked;
                }
            }
            this.lock = function()
            {
                locked = true;
                buttonDownload.disabled = true;
                textUrl.disabled = true;
                setButtonDownloadImage();
            };
            this.unlock = function()
            {
                buttonDownload.disabled = false;
                textUrl.disabled = false;
                locked = false;
                setButtonDownloadImage();
            };
            function startDownload() {
                mouseDown = true;
                setButtonDownloadImage();
                if (!locked)
                {
                    self.lock();
                    new Task(function() {
                        progressPanel.setText('starting..');
                        download(textUrl.value);
                    }).run();
                }
            }
            buttonDownload.addEventListener('mousedown', startDownload);
            buttonDownload.addEventListener('mouseup', function() {
                mouseDown = false;
                setButtonDownloadImage();
            });
            this.div.appendChild(buttonDownload);
            buttonDownload.appendChild(imgButtonDownload);
            this.div.appendChild(divUrl);
            divUrl.appendChild(textUrl);
        }
        function ProgressPanel()
        {
            var self = this;
            var spinnerKartLoader = new SpinnerKartLoader();
            this.div = pickupElseCreateElement('divProgressPanel', 'div');
            var divText = pickupElseCreateElement('divTextProgressPanel', 'div');
            this.div.style.width = '100%';
            this.div.style.display = 'none';
            this.div.style.border = borderString;
            this.div.style.backgroundColor = '#711089';
            this.div.style.marginTop = '4px';
            this.div.style.float = 'top';
            this.div.style.boxSizing = 'border-box';
            divText.style.fontFamily = 'Arial';
            divText.style.fontSize = '20px';
            divText.style.color = '#0c1849';
            divText.style.boxSizing = 'border-box';
            divText.style.margin = '4px';
            this.setText = function(text) {
                if (text)
                {
                    divText.textContent = text;
                    self.div.style.display = 'inline-block';
                }
                else
                    self.hide();
            };
            this.hide = function() {
                self.div.style.display = 'none';
            };
            this.div.appendChild(divText);
            this.div.appendChild(spinnerKartLoader.div);
        }
        function ErrorPanel()
        {
            var self = this;
            this.div = pickupElseCreateElement('divErrorPanel', 'div');
            var divText = pickupElseCreateElement('divTextErrorPanel', 'div');
            this.div.style.width = '100%';
            this.div.style.display = 'none';
            this.div.style.border = borderString;
            this.div.style.backgroundColor = '#ffffff';
            this.div.style.marginTop = '4px';
            this.div.style.float = 'top';

            this.div.style.boxSizing = 'border-box';
            divText.style.fontFamily = 'Arial';
            divText.style.fontSize = '20px';
            divText.style.color = '#dd1d1d';
            divText.style.boxSizing = 'border-box';
            divText.style.margin = '4px';
            this.setError = function(text) {
                if (text)
                {
                    divText.textContent = text;
                    self.div.style.display = 'inline-block';
                }
                else
                    self.hide();
            };
            this.hide = function() {
                self.div.style.display = 'none';
            };
            this.div.appendChild(divText);
        }
        function AvailablePanel()
        {
            var self = this;
            this.div = pickupElseCreateElement('divAvailablePanel', 'div');
            this.div.style.width = '100%';
            this.div.style.display = 'none';
            this.div.style.marginTop = '4px';
            this.div.style.float = 'top';
            this.div.style.boxSizing = 'border-box';
            var linkButtons = [];
            var nLinkButton = 0;
            function LinkButton(link, isMp3)
            {
                var self = this;
                this.div = pickupElseCreateElement('divLinkButton' + nLinkButton, 'div');
                this.div.style.height = '34px';
                if (document.body.clientWidth > 400)
                {
                    this.div.style.width = '31%';
                    this.div.style.width = 'calc(33.3% - 4px)';
                }
                else
                {
                    if (document.body.clientWidth > 200)
                    {
                        this.div.style.width = '48%';
                        this.div.style.width = 'calc(50% - 4px)';
                    }
                    else
                    {
                        this.div.style.width = '96%';
                        this.div.style.width = 'calc(100% - 4px)';
                    }
                }
                this.div.style.float = 'left';
                this.div.style.position = 'relative';
                this.div.style.overflow = 'hidden';
                this.div.style.boxSizing = 'border-box';
                var img = pickupElseCreateElement('imgLinkButton' + nLinkButton, 'img');
                img.style.height = '100%';
                img.style.width = '100%';
                img.style.position = 'absolute';
                img.style.left = '0px';
                var divText = pickupElseCreateElement('divTextLinkButton' + nLinkButton, 'a');
                divText.href = link.url;
                divText.type = 'video/' + link.type;
                divText.download = 'video';
                divText.style.textDecoration = 'none';
                divText.style.width = '100%';
                divText.style.left = '0px';
                divText.style.top = '3px';
                divText.style.position = 'absolute';
                divText.textContent = link.format + (link.quality ? '(' + link.quality + ')' : '');
                divText.style.fontFamily = 'Arial';
                divText.style.fontSize = '20px';
                divText.style.textAlign = 'center';
                divText.style.verticalAlign = 'middle';
                divText.style.overflow = 'hidden';
                divText.style.display = 'inline-block';
                divText.style.textOverflow = 'ellipsis';
                divText.style.whiteSpace = 'nowrap';
                divText.style.color = '#000000';
                this.div.appendChild(img);
                this.div.appendChild(divText);
                this.div.style.borderRadius = '6px';
                this.div.style.cursor = 'pointer';
                this.div.style.border = borderString;
                this.div.style.margin = '2px';
                var url1 = 'images/video_downloader/download_specific.png';
                var url2 = 'images/video_downloader/download_specific_hover.png';
                var imgUrl = window.thePageUrl + (isMp3 ? url2 : url1);
                var imgUrlClick = window.thePageUrl + 'images/video_downloader/download_specific_clicked.png';
                var imgUrlHover = window.thePageUrl + (isMp3 ? url1 : url2);
                var hovering = false;
                var mouseDown = false;
                new Hover(self.div, function() {
                    hovering = true;
                    setImage();
                }, function() {
                    hovering = false;
                    setImage();
                });
                function setImage()
                {
                    if (!hovering)
                    {
                        mouseDown = false;
                        img.src = imgUrl;
                    }
                    else
                    {
                        if (mouseDown)
                            img.src = imgUrlClick;
                        else
                            img.src = imgUrlHover;
                    }
                }
                setImage();
                this.div.addEventListener('mousedown', function() {
                    mouseDown = true;
                    setImage();
                });
                this.div.addEventListener('mouseup', function() {
                    mouseDown = false;
                    setImage();
                    mrVideo.setSmoking();
                });
                nLinkButton++;
            }
            this.setLinks = function(linksVideos, linksAudios) {
                clearLinks();
                var iterator = new Iterator(linksVideos);
                while (iterator.hasNext())
                {
                    var link = iterator.next();
                    var linkButton = new LinkButton(link, false);
                    linkButtons.push(linkButton);
                    self.div.appendChild(linkButton.div);
                }
                iterator = new Iterator(linksAudios);
                while (iterator.hasNext())
                {
                    var link = iterator.next();
                    var linkButton = new LinkButton(link, true);
                    linkButtons.push(linkButton);
                    self.div.appendChild(linkButton.div);
                }
                this.div.style.display = 'inline-block';
            };
            this.clearLinks = clearLinks;
            function clearLinks()
            {
                nLinkButton = 0;
                self.div.style.display = 'none';
                var iterator = new Iterator(linkButtons);
                while (iterator.hasNext())
                {
                    var linkButton = iterator.next();
                    self.div.removeChild(linkButton.div);
                    iterator.remove();
                }
            }
        }
        this.div.appendChild(divCentered);
        divCentered.appendChild(aboutPanel.div);
        divCentered.appendChild(enterPanel.div);
        divCentered.appendChild(progressPanel.div);
        divCentered.appendChild(availablePanel.div);
        divCentered.appendChild(errorPanel.div);
        function download(url)
        {
            errorPanel.hide();
            youtubeDownloader.getVideosAvailable(url);
            availablePanel.clearLinks();
            aboutPanel.hide();
        }
        function failed(text)
        {
            if (!text)
                text = 'Sorry but downloading failed! Please try again!';
            errorPanel.setError(text);
        }
    }
    try
    {
        var mrVideo = new MrVideo();
        this.div.appendChild(mrVideo.div);
    }
    catch (ex)
    {
        console.log(ex);
    }
    this.div.appendChild(downloadPanel.div);
    document.body.appendChild(this.div);
    document.body.style.padding = '0';
    document.body.style.margin = '0';
}