function Genders(){
    
}
function GenderPicker()
{
    this.div = document.createElement('div');
    this.div.style.width='100%';
    this.div.style.height='25px';
    this.div.style.float='left';
    this.div.style.position='relative';
    var select = document.createElement('select');
    select.style.height='100%';
    select.style.width='100%';
    for(var i=0; i<Genders.values.length; i++)
    {
        var values = Genders.values[i];
        var option = document.createElement('option');
        setText(option, values.txt);
        option.value=values.value;
        select.appendChild(option);
    }
    this.div.appendChild(select);
    this.getValue=function(){
        return select.options[select.selectedIndex].value;
    };
}
Genders.values =[{value: 0, txt: 'a man'},
        {value: 1, txt: 'a woman'},
        {value: 2, txt: 'a couple(man + woman)'},
        {value: 3, txt: 'a couple of men'},
        {value: 4, txt: 'a couple of women'},
        {value: 5, txt: 'a transexual man'},
        {value: 6, txt: 'a transexual women'}
    ];