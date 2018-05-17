var Themes={};
    Themes.themes = {
        Blue: {
            components: {
                frame: {'background-color': '#0099ff'},
                frameFlashing: {'background-color': '#ccff00'},
                frameBorder: {'border': '1px solid #66a3ff', '-webkit-box-shadow': 'none','-moz-box-shadow': 'none','box-shadow': 'none', 'border-radius': '5px'},
                text: {'color': '#000000', 'font-weight': 'bold', 'font-size': '14px', 'font-family':'Arial'},
                controls: {'background-color': '#ccb3ff'},
                feed: {'background-color': '#e6ffff'},
                body: {'background-color': '#555555'},
                background: {'background-image': 'url("images/background.png")'},
                taskbar: {'background-color': 'rgba(102,153,153, 0.5)', 'border-top': '1px solid rgba(102,153,153,0.8)'},
                taskbarMobile: {'background-color': '#0099ff', 'border-top': '0'},
                text_color: {'color': '#000000'},
                text_font: { 'font-weight': 'bold', 'font-family':'Arial'},
                frame1: {'background-color': '#e6e6ff'},
                body1: {'background-color': '#555555'},
                closeImage:{'../src':window.thePageUrl+'images/close_black.png'},
                minimizeImage:{'../src':window.thePageUrl+'images/minimize_black.png'},
                maximizeImage:{'../src':window.thePageUrl+'images/maximize_black.png'},
                frameMobile: {'background-color': '#0099ff'},
                frameBorderMobile: {'border': '0px solid #66a3ff', '-webkit-box-shadow': 'none','-moz-box-shadow': 'none','box-shadow': 'none', 'border-radius': '0px'},
                imgTaskbar:{'../src':window.thePageUrl+'images/black_menu.png'}
                
            }
        },
        'Insane pink': {
            components: {
                frame: {'background-color': '#ff0066'},
                frameFlashing: {'background-color': '#ccff00'},
                frameBorder: {'border': '1px solid #9933ff', '-webkit-box-shadow': 'none','-moz-box-shadow': 'none','box-shadow': 'none', 'border-radius': '5px'},
                text: {'color': '#000000', 'font-weight': 'bold', 'font-size': '14px', 'font-family':'Arial'},
                controls: {'background-color': '#df80ff'},
                feed: {'background-color': '#e6ccff'},
                body: {'background-color': '#800080'},
                background: {'background-image': 'url("images/star--background-neon.jpg")'},
                taskbar: {'background-color': 'rgba(0,255,188, 0.4)', 'border-top': '1px solid rgba(0,255,188, 0.6)'},
                taskbarMobile: {'background-color': '#ff0066', 'border-top': '0'},
                text_color: {'color': '#000000'},
                text_font: { 'font-weight': 'bold', 'font-family':'Arial'},
                frame1: {'background-color': '#e6e6ff'},
                body1: {'background-color': '#800080'},
                closeImage:{'../src':window.thePageUrl+'images/close_black.png'},
                minimizeImage:{'../src':window.thePageUrl+'images/minimize_black.png'},
                maximizeImage:{'../src':window.thePageUrl+'images/maximize_black.png'},
                frameMobile: {'background-color': '#ff0066'},
                frameBorderMobile: {'border': '0px solid #9933ff', '-webkit-box-shadow': 'none','-moz-box-shadow': 'none','box-shadow': 'none', 'border-radius': '0px'},
                imgTaskbar:{'../src':window.thePageUrl+'images/black_menu.png'}
               
            }
        },
        Orange: {
            components: {
                frame: {'background-color': '#F68735'},
                frameFlashing: {'background-color': '#ccff00'},
                frameBorder: {'border': '1px solid #999FAD', '-webkit-box-shadow': 'none','-moz-box-shadow': 'none','box-shadow': 'none', 'border-radius': '5px'},
                text: {'color': '#000000', 'font-weight': 'bold', 'font-size': '14px', 'font-family':'Arial'},
                controls: {'background-color': '#A8ACB8'},
                feed: {'background-color': '#DDDDDB'},
                body: {'background-color': '#3F547F'},
                background: {'background-image': 'url("images/background.png")'},
                taskbar: {'background-color': 'rgba(102,153,153, 0.5)', 'border-top': '1px solid rgba(102,153,153,0.8)'},
                taskbarMobile: {'background-color': '#F68735', 'border-top': '0'},
                text_color: {'color': '#000000', 'font-weight': 'lighter'},
                text_font: { 'font-weight': 'bold', 'font-family':'Arial'},
                frame1: {'background-color': '#e6e6ff'},
                body1: {'background-color': '#3F547F'},
                closeImage:{'../src':window.thePageUrl+'images/close_black.png'},
                minimizeImage:{'../src':window.thePageUrl+'images/minimize_black.png'},
                maximizeImage:{'../src':window.thePageUrl+'images/maximize_black.png'},
                frameMobile: {'background-color': '#F68735'},
                frameBorderMobile: {'border': '0px solid #999FAD', '-webkit-box-shadow': 'none','-moz-box-shadow': 'none','box-shadow': 'none', 'border-radius': '0px'},
                imgTaskbar:{'../src':window.thePageUrl+'images/black_menu.png'}
            }
        },
        Dark: {
            components: {
                frame: {'background-color': '#2C2B2B'},
                frameFlashing: {'background-color': '#ccff00'},
                text: {'color': '#ffffff', 'font-weight': 'lighter', 'font-size': '12px', 'font-family':'Arial'},
                frameBorder: {'border': '0px solid #8fc800', '-webkit-box-shadow': '0px 0px 6px 1px rgba(143,200,0,0.8)','-moz-box-shadow': '0px 0px 6px 1px rgba(143,200,0,0.8)','box-shadow': '0px 0px 6px 1px rgba(143,200,0,0.8)', 'border-radius': '3px'},
                controls: {'background-color': '#555555'},
                feed: {'background-color': '#aaaaaa'},
                body: {'background-color': '#201F1F'},
                background: {'background-image': 'url("images/nights-sky.jpg")'},
                taskbar: {'background-color': 'rgba(102,153,153, 0.5)','border-top': '1px solid rgba(102,153,153, 0.75)'},
                taskbarMobile: {'background-color': '#2C2B2B', 'border-top': '0'},
                text_color: {'color': '#ffffff'},
                text_font: { 'font-weight': 'lighter', 'font-family':'Arial'},
                frame1: {'background-color': '#201F1F'},
                body1: {'background-color': '#201F1F'},
                closeImage:{'../src':window.thePageUrl+'images/close_white.png'},
                minimizeImage:{'../src':window.thePageUrl+'images/minimize_white.png'},
                maximizeImage:{'../src':window.thePageUrl+'images/maximize_white.png'},
                frameMobile: {'background-color': '#2C2B2B'},
                frameBorderMobile: {'border': '0px solid #8fc800', '-webkit-box-shadow': 'none','-moz-box-shadow': 'none','box-shadow': 'none', 'border-radius': '0px'},
                imgTaskbar:{'../src':window.thePageUrl+'images/white_menu.png'}
               
        }
    },
        Nature: {
            components: {
                frame: {'background-color': '#394d00'},
                frameFlashing: {'background-color': '#ccff00'},
                text: {'color': '#ffffff', 'font-weight': 'lighter', 'font-size': '12px', 'font-family':'Arial'},
                frameBorder: {'border': '1px solid #998800', '-webkit-box-shadow': 'none','-moz-box-shadow': 'none','box-shadow': 'none', 'border-radius': '5px'},
                controls: {'background-color': '#555555'},
                feed: {'background-color': '#aaaaaa'},
                body: {'background-color': '#331200'},
                background: {'background-image': 'url("images/trees.jpg")'},
                taskbar: {'background-color': 'rgba(230,92,0, 0.55)','border-top': '1px solid rgba(230,92,0, 0.75)'},
                taskbarMobile: {'background-color': '#394d00', 'border-top': '0'},
                text_color: {'color': '#ffffff'},
                text_font: { 'font-weight': 'lighter', 'font-family':'Arial'},
                frame1: {'background-color': '#201F1F'},
                body1: {'background-color': '#201F1F'},
                closeImage:{'../src':window.thePageUrl+'images/close_white.png'},
                minimizeImage:{'../src':window.thePageUrl+'images/minimize_white.png'},
                maximizeImage:{'../src':window.thePageUrl+'images/maximize_white.png'},
                frameMobile: {'background-color': '#394d00'},
                frameBorderMobile: {'border': '0px solid #998800', '-webkit-box-shadow': 'none','-moz-box-shadow': 'none','box-shadow': 'none', 'border-radius': '0px'},
                imgTaskbar:{'../src':window.thePageUrl+'images/white_menu.png'}

        }
    }
    };
Themes.arrayObjects = [];
Themes.restyleObject = function (object, theme)
{
    if (object && theme && theme.components) {
        for (var k = 0; k < object.components.length; k++)
        {
            var component = object.components[k];
            if (component)
            {
                var style = theme.components[component.name];
                if (style)
                {
                    for (var l = 0; l < component.elements.length; l++)
                    {
                        styleFromObject(component.elements[l], style);
                    }
                }
            }
        }
        if (object.callback)
        {
            object.callback(theme);
        }
    }
};
Themes.restyle = function (name)
{
    var theme = Themes.themes[name];
    Themes.theme = theme;
    if (theme && theme.components)
    {
        for (var j = 0; j < Themes.arrayObjects.length; j++)
        {
            var object = Themes.arrayObjects[j];
            Themes.restyleObject(object, Themes.theme);
        }
    }

};
Themes.remove = function (obj)
{
    Themes.arrayObjects.splice(Themes.arrayObjects.indexOf(obj), 1);
};
Themes.register = function (obj)//obj contains a map that maps a component name ( such as frame-color) to the element. if themeName is undefined, the default will.
{
    Themes.arrayObjects.push(obj);
    Themes.restyleObject(obj, Themes.theme);
};