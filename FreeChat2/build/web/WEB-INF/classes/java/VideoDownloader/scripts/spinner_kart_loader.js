function SpinnerKartLoader()
{
    CssLoader.load(window.thePageUrl+'styles/spinner_kart_loader.css');
    this.div = pickupElseCreateElement('kartLoader', 'div');
    this.div.className = 'kart-loader';
    this.div.style.paddingLeft='28px'; 
    this.div.style.paddingTop='32px'; 
    this.div.style.width='45px';
    this.div.style.height='38px';
    this.div.style.position='relative';
    this.div.style.display='inline-block';
    this.div.style.margin='0px';
    this.div.style.top='0px';
    this.div.style.bottom='0px';
    this.div.style.left='0px';
    this.div.style.right='0px';
    this.width=45;
    this.height=38;
    for (var i = 0; i < 12; i++)
    {
        var sheath = pickupElseCreateElement('sheath_'+i, 'div');
        var segment = pickupElseCreateElement('segment_'+i, 'div');
        sheath.className = 'sheath';
        segment.className = 'segment';
        this.div.appendChild(sheath);
        sheath.appendChild(segment);
    }
}