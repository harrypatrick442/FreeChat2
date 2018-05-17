var Tab = {flashEnabled: false, timerFlash: undefined, count: 0, flashing: false};
Tab.enableFlash = function (value)
{
    if (value)
    {
        Tab.flashEnabled = true;
    }
    else
    {
        Tab.flashEnabled = false;
    }
};
Tab.setText = function (str)
{
    document.title = str;
    Tab.text = str;
};
Tab.attention = function (str)
{
    if (!str)
    {
        str = "!";
    }
    if (Tab.timerFlash)
    {
        Tab.timerFlash.stop();
    }
    if (Tab.flashEnabled)
    {
        Tab.count = 0;
        Tab.timerFlash = new Timer(function () {
            if (Tab.count < 9)
            {
                var i = 0;
                while (i < Tab.count)
                {
                    str += '!';
                    i++;
                }
                document.title = str;
                Tab.count++;
            }
            else
            {
                Tab.setText(Tab.text);
                Tab.flashing = false;
            }
        }, 500, 10);
    }
};