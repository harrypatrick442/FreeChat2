function TabPanel(tabNames, styleNames)
{
    styleNames=!styleNames?{}:styleNames;
    var self = this;
    this.panels = [];
    this.tabs = [];
    var nPanels = tabNames.length;
    this.div = document.createElement('div');
    var divPanelHousing = document.createElement('div');
    var divTabs = document.createElement('div');
    this.div.style.height = '100%';
    this.div.style.width = '100%';
    divTabs.style.width = '100%';
    divTabs.style.height = '20px';
    var tabPercent = 100 / nPanels;
    divPanelHousing.style.height = 'calc(100% - 20px)';
    divPanelHousing.style.width = '100%';
    divPanelHousing.style.top = '20px';
    divPanelHousing.style.position = 'absolute';
    this.div.appendChild(divTabs);
    this.div.appendChild(divPanelHousing);
    function Tab(name, panel, iTab)
    {
        var self = this;
        this.div = document.createElement('div');
        var divName = document.createElement('div');
        this.div.style.height = '18px';
        this.div.style.width = String(tabPercent) + '%';
        this.div.style.left = String(iTab * tabPercent) + '%';
        this.div.style.top = '2px';
        this.div.style.position = 'absolute';
        this.div.style.borderTopRightRadius = '10px';
        this.div.style.cursor = 'pointer';
        divName.style.paddingLeft = '5px';
        divName.style.height = '100%';
        divName.style.width = 'calc(100% - 5px)';
        divName.style.whiteSpace = 'nowrap';
        divName.style.overflow = 'hidden';
        divName.style.textOverflow = 'ellipsis';
        divName.style.display = 'inline-block;';
        this.div.appendChild(divName);
        var themesObject = {components: [
                {name:  (styleNames.frameStyleName?styleNames.frameStyleName:'frame'), elements: [self.div]},
                {name: (styleNames.textStyleName?styleNames.textStyleName:'text'), elements: [divName]}
            ],
            callback: function (theme) {

            }};
        Themes.register(themesObject);
        setText(divName, name);
        this.div.addEventListener("mousedown", function () {
            setActivePanel(panel);
        });
        this.close = function () {
            Themes.remove(themesObject);
        };
        this.setActive = function () {
            this.div.style.height = '18px';
        };
        this.setInactive = function () {
            this.div.style.height = '17px';
        };
    }
    function Panel()
    {
        var self = this;
        this.div = document.createElement('div');
        this.div.style.height = 'calc(100% - 3px)';
        this.div.style.width = '100%';
        this.div.style.top = '3px';
        this.div.style.left = '0px';
        this.div.style.position = 'absolute';

        this.show = function () {
            self.div.style.display = 'inline';
        };
        this.hide = function () {
            self.div.style.display = 'none';
        };
        var themesObject = {components: [
                {name: (styleNames.bodyStyleName?styleNames.bodyStyleName:'body'), elements: [self.div]}
            ],
            callback: function (theme) {

            }};
        Themes.register(themesObject);
        this.close = function () {
            Themes.remove(themesObject);
        };
    }
    function setActivePanel(panel)
    {
        for (var i = 0; i < self.panels.length; i++)
        {
            var p = self.panels[i];
            p.hide();
            if (panel != p)
                self.tabs[i].setInactive();
            else
            {
                self.tabs[i].setActive();
                if(self.onChangeTab)self.onChangeTab(i);
            }
        }
        panel.show();
    }
    for (var i = 0; i < nPanels; i++)
    {
        var panel = new Panel();
        var tab = new Tab(tabNames[i], panel, i);
        self.panels.push(panel);
        self.tabs.push(tab);
        divPanelHousing.appendChild(panel.div);
        divTabs.appendChild(tab.div);
    }
    setActivePanel(self.panels[0]);
    var themesObject = {components: [
            // {name: 'body', elements: [self.div]},
            {name: (styleNames.frameStyleName?styleNames.frameStyleName:'frame'), elements: [divPanelHousing]}
        ],
        callback: function (theme) {

        }};
    Themes.register(themesObject);
    this.close = function () {
        for (var i = 0; i < self.panels.length; i++)
        {
            self.panels[i].close();
            self.tabs[i].close();
        }
        Themes.remove(themesObject);
    };
}