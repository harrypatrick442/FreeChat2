function ImageMessage(name, path, backgroundColor)
{
    this.div = document.createElement('div');
    var divImage = document.createElement('div');
    var img = document.createElement('img');
    this.div.style.backgroundColor=backgroundColor;
    img.style.maxHeight='350px';
    img.src=window.thePageUrl+'ServletImages?path='+path;
    this.div.appendChild(divImage);
    divImage.appendChild(img);
    return this.div;
}