function Interests() {

}

Interests.values = [
    {value: 1, txt: 'Adult Parties'},
    {value: 2, txt: 'Adult Baby Minding'},
    {value: 3, txt: 'Anal'},
    {value: 4, txt: 'Anal Play'},
    {value: 5, txt: 'Bareback'},
    {value: 6, txt: 'BDSM (giving)'},
    {value: 7, txt: 'BDSM (receiving)'},
    {value: 8, txt: 'Being Filmed'},
    {value: 9, txt: 'Blindfolds'},
    {value: 10, txt: 'Bukkake'},
    {value: 11, txt: 'Car Meets'},
    {value: 12, txt: 'CIM'},
    {value: 13, txt: 'Cross Dressing'},
    {value: 14, txt: 'Cuckolding'},
    {value: 15, txt: 'Cybersex'},
    {value: 16, txt: 'Deep Throat'},
    {value: 17, txt: 'Depilation'},
    {value: 18, txt: 'Dogging'},
    {value: 19, txt: 'Domination(giving)'},
    {value: 20, txt: 'Domination(receiving)'},
    {value: 21, txt: 'Double Penetration'},
    {value: 22, txt: 'Enema'},
    {value: 23, txt: 'Exhibitionism'},
    {value: 24, txt: 'Face Sitting'},
    {value: 25, txt: 'Facials'},
    {value: 26, txt: 'Female Ejaculation'},
    {value: 27, txt: 'Fisting(giving)'},
    {value: 28, txt: 'Fisting(receiving)'},
    {value: 29, txt: 'Food Sex/Sploshing'},
    {value: 30, txt: 'Foot Worship'},
    {value: 31, txt: 'French Kissing'},
    {value: 32, txt: 'Gang Bangs'},
    {value: 33, txt: 'Group Sex'},
    {value: 34, txt: 'Hand Relief'},
    {value: 35, txt: 'Hardsports(giving)'},
    {value: 36, txt: 'Hardsports(receiving)'},
    {value: 37, txt: 'Humiliation(giving)'},
    {value: 38, txt: 'Humiliation(receiving)'},
    {value: 39, txt: 'Lapdancing'},
    {value: 40, txt: 'Massage'},
    {value: 41, txt: 'Milking/Lactating'},
    {value: 42, txt: 'Modeling'},
    {value: 43, txt: 'Moresomes'},
    {value: 44, txt: 'Naturism/Nudism'},
    {value: 45, txt: 'Making Videos'},
    {value: 46, txt: 'Oral'},
    {value: 47, txt: 'Parties'},
    {value: 48, txt: 'Period Play'},
    {value: 49, txt: 'Pole Dancing'},
    {value: 50, txt: 'Pregnant'},
    {value: 51, txt: 'Prostate Massage'},
    {value: 52, txt: 'Pussy Pumping'},
    {value: 53, txt: 'Phone Sex'},
    {value: 54, txt: 'Receiving Oral'},
    {value: 55, txt: 'Rimming(giving)'},
    {value: 56, txt: 'Rimming(receiving)'},
    {value: 57, txt: 'Role Play/Fantasy'},
    {value: 58, txt: 'Safe Sex'},
    {value: 59, txt: 'Same Room Swap'},
    {value: 60, txt: 'Sauna'},
    {value: 61, txt: 'SM'},
    {value: 62, txt: 'Smoking(Fetish)'},
    {value: 63, txt: 'Snowballing'},
    {value: 64, txt: 'Soft Swing'},
    {value: 65, txt: 'Spanking(giving)'},
    {value: 66, txt: 'Spanking(receiving)'},
    {value: 67, txt: 'Strap On'},
    {value: 68, txt: 'Striptease'},
    {value: 69, txt: 'Sub games'},
    {value: 70, txt: 'Swallow'},
    {value: 71, txt: 'Swingers Clubs'},
    {value: 72, txt: 'Taking Photos'},
    {value: 73, txt: 'Tantric'},
    {value: 74, txt: 'Threesomes'},
    {value: 75, txt: 'Tie & Tease'},
    {value: 76, txt: 'Toys'},
    {value: 77, txt: 'Uniforms'},
    {value: 78, txt: 'Unprotected Sex'},
    {value: 79, txt: 'Voyeurism'},
    {value: 80, txt: 'Watersports(giving)'},
    {value: 81, txt: 'Watersports(receiving)'}
];
Interests.mapValueToTxt={};(function(){
    for(var i=0;  i<Interests.values.length; i++)
    {
        var pair = Interests.values[i];
        Interests.mapValueToTxt[pair.value]=pair.txt;
    }
})();
Interests.txtFromValue=function(value)
{
    return Interests.mapValueToTxt[value];
};