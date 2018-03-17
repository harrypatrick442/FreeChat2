function PicturePoster()
{
    inputFile.onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement;
   var files = tgt.files;
if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            imgPreview.src=  window.thePageUrl+fr.result;
        };
        fr.readAsDataURL(files[0]);
    }
    else {
        // fallback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }
}
}