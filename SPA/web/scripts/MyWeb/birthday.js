function Birthday()
{
    this.div = document.createElement('div');
    var selectDay = document.createElement('select');
    var selectMonth = document.createElement('select');
    var selectYear = document.createElement('select');
    this.div.style.height = '25px';
    this.div.style.float = 'left';
    this.div.style.width = '100%';
    function style(select)
    {
        select.style.width = 'calc(33.33% - 2.66px)';
        select.style.height = '100%';
        select.style.position = 'relative';
        select.style.float = 'left';
        select.style.marginLeft = '2px';
    }
    style(selectDay);
    style(selectMonth);
    style(selectYear);
    var now = new Date();
    var year = 1900 + now.getYear();
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    selectDay.appendChild(createOption(undefined, 'Day'));
    selectMonth.appendChild(createOption(undefined, 'Month'));
    selectYear.appendChild(createOption(undefined, 'Year'));
    for (var i = 1; i < 32; i++)
    {
        var option = createOption(i, String(i));
        selectDay.appendChild(option);
    }
    for (var i = 0; i < 12; i++)
    {
        var option = createOption(i, months[i]);
        selectMonth.appendChild(option);
    }
    var maxYear = year - 17;
    for (var i = maxYear - 100; i < maxYear; i++)
    {
        var option = createOption(i, String(i));
        selectYear.appendChild(option);
    }
    function createOption(value, txt)
    {
        var option = document.createElement('option');
        option.value = value;
        setText(option, txt);
        return option;
    }
    this.div.appendChild(selectDay);
    this.div.appendChild(selectMonth);
    this.div.appendChild(selectYear);
    this.getValue = function()
    {
        var day =selectDay.options[selectDay.selectedIndex].value;
        var month =selectMonth.options[selectMonth.selectedIndex].value;
        var year = selectYear.options[selectYear.selectedIndex].value;
        return{day:(day=='undefined'? undefined:parseInt(day)),month:(month=='undefined'?undefined:parseInt(month)), year:(year=='undefined'?undefined:parseInt(year))};
    };

}