function ProgressBar(percentage, classNameSurfix)
{
    this.div = document.createElement('div');
    var divBar = document.createElement('div');
    var divText = document.createElement('div');
    var divTextSurrounding = document.createElement('div');
    this.div.appendChild(divTextSurrounding);
    divTextSurrounding.appendChild(divText);
    this.div.appendChild(divBar);
    this.div.className = 'div-' + classNameSurfix;
    divBar.style.height = '100%';
    divBar.style.position = 'absolute';
    divBar.style.left = '0px';
    divBar.style.top = '0px';
    divBar.style.backgroundColor = '#00aa00';
    divBar.className = 'div-' + classNameSurfix + '-bar';
    divText.style.textAlign = 'center;position';
    divText.style.position=' relative';
    divText.style.top = '50%';
    divText.style.msTransform = 'translateY(-50%)';
    divText.style.transform='translateY(-50%)';
    divText.style.webkitTransform = 'translateY(-50%)';
    divText.className = 'div-' + classNameSurfix + '-text';
    divTextSurrounding.style.display = 'table-cell';
    divTextSurrounding.style.verticalAlign = 'middle';
    divTextSurrounding.style.width = '30px;';
    divTextSurrounding.style.lineHeight = '100%';
    divTextSurrounding.style.left = '50%';
    divTextSurrounding.style.position = 'absolute';
    divTextSurrounding.style.top = '0px';
    divTextSurrounding.style.height = '100%';
    divTextSurrounding.style.marginLeft = '-15px';
    divTextSurrounding.style.zIndex = '2';
    divTextSurrounding.className = 'div-' + classNameSurfix + '-text-surrounding';
    this.div.style.display = 'none';
    this.set = function (percent) {
        if (percent > 100) {
            percent = 100;
        }
        else {
            if (percent < 0) {
                percent = 0;
            }
        }
        divBar.style.width = String(percent) + '%';
        if(divText.textContent)
        {
            divText.textContent = String(percent) + '%';
        }
        else {
            divText.innerText = String(percent) + '%';
        }
    };
    if (undefined == percentage)
    {
        this.set(0);
    }
    else {
        this.set(percentage);
    }
}