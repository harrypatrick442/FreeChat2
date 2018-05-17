var key = 'myy9CMkaqs';var previousKey = localStorage.getItem('previousKey');if(previousKey==undefined||(previousKey!=undefined&&previouskey!=uniqueKey)){var initialSizes={"#emoticons_size":[329,335],"#rooms_size":[200,206],"#sound_effects_size":[200,207],"#themes_size":[200,205],"#users_size":[200,201],"Main_size":[583,356]};
var initialPositions={"#emoticons_position":[0,0],"#radio_position":[273,413],"#rooms_position":[820,305],"#sound_effects_position":[0,301],"#themes_position":[785,78],"#users_position":[684,337],"Main_position":[215,16]};
var initialZIndices={"#Contact_zIndex":103,"#emoticons_zIndex":102,"#font_zIndex":101,"#radio_zIndex":106,"#rooms_zIndex":110,"#sound_effects_zIndex":104,"#themes_zIndex":109,"#users_zIndex":107,"#webcam_settings_zIndex":105,"Main_zIndex":108};
Settings.addRange(initialSizes);
Settings.addRange(initialPositions);
Settings.addRange(initialZIndices); localStorage.setItem('settingsInitialPreviousKey', key);}