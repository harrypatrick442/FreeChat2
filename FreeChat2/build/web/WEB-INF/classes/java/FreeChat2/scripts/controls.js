
function Controls()
{
    var self = this;
    this.div = document.createElement('div');

    var spinner = new Spinner(1);
    spinner.center();
    spinner.div.style.zIndex = '100000';
    spinner.div.style.position = 'fixed';
    spinner.hide();
    document.documentElement.appendChild(spinner.div);
    function addButton(str, callback)
    {
        var button = document.createElement('button');
        button.textContent = str;
        button.addEventListener('click', callback);
        self.div.appendChild(button);
    }
    var loc = window.location.pathname;
    var dir = loc.substring(0, loc.lastIndexOf('/'));
    var busy = false;
    function generateAndPush(callback)
    {
        if (busy)
            return;
        spinner.show();
        httpGetAsynchronous(dir + '?secret_set_controls=true&operation=generate_and_push', function() {
            spinner.hide();
            busy = false;
            if (callback)
                callback();
        });
    }
    function initialSettings(callback, force)
    {
        var sizes = {};
        var positions = {};
        var zIndices = {};
        for (var key in localStorage)
        {
            if (key.indexOf('_size') > 0)
                sizes[key] = JSON.parse(localStorage[key]);
            else
            {
                if (key.indexOf('_position') > 0)
                    positions[key] = JSON.parse(localStorage[key]);
                else
                {
                    if (key.indexOf('_zIndex') > 0)
                    {
                        zIndices[key] = JSON.parse(localStorage[key]);
                    }
                }
            }
        }

        if (busy)
            return;
        spinner.show();
        var uniqueKey = randomString(10);
        var str = 'var key = \'' + uniqueKey +
                '\';var previousKey = localStorage.getItem(\'previousKey\');'
                + (force ? 'if(previousKey==undefined||(previousKey!=undefined&&previouskey!=key))' : 'if(previousKey==undefined)')
                + '{var initialSizes='
                + JSON.stringify(sizes)
                + ';\nvar initialPositions='
                + JSON.stringify(positions)
                + ';\nvar initialZIndices='
                + JSON.stringify(zIndices)
                + ';\nSettings.addRange(initialSizes);\nSettings.addRange(initialPositions);\nSettings.addRange(initialZIndices); localStorage.setItem(\'settingsInitialPreviousKey\', key);}';
        httpGetAsynchronous(dir + '?secret_set_controls=true&operation=generate_initial_settings&js_code=' + escape(str), function(result) {
            spinner.hide();
            busy = false;
            if (callback)
                callback();
        });
    }
    function randomString(length)
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    addButton("Generate and Push scripts/generated/xxx", generateAndPush);
    addButton("Generate scripts/generated/xxx", function()
    {
        if (busy)
            return;
        spinner.show();
        httpGetAsynchronous(dir + '?secret_set_controls=true&operation=generate', function() {
            spinner.hide();
            busy = false;
        });
    });
    addButton("Test", function()
    {
        if (busy)
            return;
        spinner.show();
        httpGetAsynchronous(dir + '?secret_set_controls=true&operation=test', function(response) {
            console.log(response);
            spinner.hide();
            busy = false;
        });
    });
    addButton("Guarbage watch summary", function()
    {
        if (busy)
            return;
        spinner.show();
        httpGetAsynchronous(dir + '?secret_set_controls=true&operation=get_guarbage_watch_summary', function(result) {
            spinner.hide();
            busy = false;
            console.log(result);
        });
    });
    addButton("Clear scripts list", function()
    {
        if (busy)
            return;
        spinner.show();
        httpGetAsynchronous(dir + '?secret_set_controls=true&operation=clear_scripts_list', function(result) {
            spinner.hide();
            busy = false;
            console.log(result);
        });
    });
    addButton("Clear static content", function()
    {
        if (busy)
            return;
        spinner.show();
        httpGetAsynchronous(dir + '?secret_set_controls=true&operation=clear_static_content', function(result) {
            spinner.hide();
            busy = false;
            console.log(result);
        });
    });
    addButton("Update initial settings", function()
    {
        initialSettings();
    });
    addButton("Force update initial settings", function()
    {
        initialSettings(undefined, true);
    });
}
var controls = new Controls();
document.documentElement.appendChild(controls.div);