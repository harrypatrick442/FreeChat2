function ProfileEntryBuilder(obj, rect, openProfile)
{
    EntryBuilder(obj, rect);
    obj.inner = new (function(obj, openProfile) {
var userId;
        var textBoxes = [];
        function setupTextBox(callback, maxLength, height, widthString, leftString, fontSize, initialText, multiline, minHeight)
        {
            var textBox = new TextBox(undefined, multiline, true, fontSize, true, initialText, maxLength, minHeight);
            textBox.div.style.height = String(height) + 'px';
            if (minHeight)
            {
                textBox.div.style.minHeight = String(minHeight) + 'px';
            }
            textBox.div.style.width = widthString;
            textBox.div.style.left = leftString;
            textBox.div.style.position = 'relative';
            textBox.div.style.marginTop = '3px';
            textBoxes.push(textBox);
            return textBox;
        }
        var divText = document.createElement('div');
        var img = document.createElement('img');
        divText.style.width = 'calc(100% - ' + String(ProfileEntryBuilder.height) + 'px)';
        var hS = String(ProfileEntryBuilder.height) + 'px';
        divText.style.height = hS;
        img.style.height = hS;
        img.style.width = hS;
        divText.style.position = 'relative';
        divText.style.float = 'left';
        img.style.position = 'relative';
        img.style.float = 'left';
        img.src = 'images/shadow.png';
        var textBoxUsername = setupTextBox(undefined, undefined, 14, 'calc(100% - 6px)', '3px', 12, 'Username: Unknown');
        var textBoxDistance = setupTextBox(undefined, undefined, 14, 'calc(100% - 6px)', '3px', 12, 'Distance: Unknown');
        var textBoxStatus = setupTextBox(undefined, undefined, 14, 'calc(100% - 6px))', '3px', 12, 'Status: Unknown');
        var textBoxLocation = setupTextBox(undefined, undefined, 14, 'calc(100% - 6px)', '3px', 12, 'Location: Unknown');
        var textBoxAge = setupTextBox(undefined, undefined, 14, 'calc(100% - 6px)', '3px', 12, 'Age: Unknown');

        var textBoxLastOnline = setupTextBox(undefined, undefined, 14, 'calc(100% - 6px)', '3px', 12, 'Last online: Unknown');
        obj.divMain.appendChild(img);
        obj.divMain.appendChild(divText);
        obj.divMain.style.cursor='pointer';
        obj.divMain.addEventListener('click',function(){openProfile(userId);});
        divText.appendChild(textBoxStatus.div);
        divText.appendChild(textBoxUsername.div);
        divText.appendChild(textBoxDistance.div);
        divText.appendChild(textBoxLocation.div);
        divText.appendChild(textBoxAge.div);
        divText.appendChild(textBoxLastOnline.div);
        var themesObject = {components: [
                {name: 'frame', elements: []},
                {name: 'body', elements: []},
                {name: 'text', elements: []}
            ]
        };
        var liveLastActive;
        function updateProfileEntry(e, initialize) {
            var r = initialize ? e : e.r;
            for (var i in r)
            {
                switch (i)
                {
                    case 'status':
                        textBoxStatus.setValue('Status: ' + r[i]);
                        break;
                    case 'formattedAddress':
                        textBoxLocation.setValue('Location: ' + r[i]);
                        break;
                    case 'age':
                        textBoxAge.setValue('Age:  ' + r[i]);
                        break;
                    case 'quadrant':
                        var distance=QuadTree.getDistanceFromQuad(r[i]);
                        if(distance)
                        {
                            textBoxDistance.setValue('Distance: ~'+distance+' Km');
                        }
                        break;
                    case 'pictures':
                        var pictures = r[i];
                        if (pictures.length > 0)
                        {
                            var newSrc;
                            var ran = Random.get(0, pictures.length);
                            newSrc = window.thePageUrl + 'images/profile/' + pictures[ran].relativePath;
                            if (newSrc == img.src && pictures.length > 1)
                            {
                                ran = Random.getIgnoring(0, pictures.length, [ran]);
                                newSrc = window.thePageUrl + 'images/profile/' + pictures[ran].relativePath;
                            }
                            img.src = newSrc;
                        }
                        break;
                    default:

                        if (initialize)
                            switch (i)
                            {

                                case 'username':
                                    textBoxUsername.setValue('Username: ' + r[i]);
                                    break;
                                case 'birthday':
                                    textBoxAge.setValue('Age: ' + Activity.getAge(r[i]));
                                    break;
                                case 'userId':
                                    userId=r[i];
                                    break;
                            }
                        break;


                }
            }
        }
        ;
        updateProfileEntry(obj, true);
        function closeProfileEntry() {
            Themes.remove(themesObject);
            for (var i = 0; i < textBoxes.length; i++)
            {
                textBoxes[i].close();
            }
            obj.removeEventListener('close', closeProfileEntry);
            obj.removeEventListener('update', updateProfileEntry);
        }
        ;
        obj.addEventListener('close', closeProfileEntry);
        obj.addEventListener('update', updateProfileEntry);
        Themes.register(themesObject);
    })(obj, openProfile);
}
ProfileEntryBuilder.height = 103;
ProfileEntryBuilder.minWidth = 300;