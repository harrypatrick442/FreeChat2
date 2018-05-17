function LocationPicker(messenger) {
    var settings = new Settings('#LocationPicker');
    var terminal = messenger.getTerminal(interpret);
    var map;
    var selectedGeolocation;
    var autocomplete;
    var genericWindow = new GenericWindow(/*name*/'Location picker', /*tooltipMessage*/'Used to pick location', /*iconPath*/'images/location_picker_icon.png', /*minWidth*/150, /*maxWidth*/1000, /*minHeight*/200, /*maxHeight*/1000, /*defaultWidth*/500, /*defaultHeight*/500, /*defaultX*/200, /*defaultY*/200, /*minimized*/false, /*minimizable*/true, /*maximizable*/true, /*minimizeOnClose*/true);
    genericWindow.onshow = function() {
        //resizeMap();
    };
    genericWindow.onresize = function() {
        resizeMap();
    };
    //var buttonFinished = document.createElement('button');
    var autocompleteInput = document.createElement('input');
    var divMap = document.createElement('div');
    var divMapPicker = document.createElement('div');
    autocompleteInput.placeholder = 'Enter your address';
    autocompleteInput.type = 'text';
    autocompleteInput.style.minWidth = '50%';
    autocompleteInput.style.top = '40px';
    autocompleteInput.style.left = '10px';
    autocompleteInput.style.position = 'absolute';
    autocompleteInput.style.padding = '0';
    autocompleteInput.style.paddingLeft = '2px';
    autocompleteInput.style.margin = '0';
    autocompleteInput.style.zIndex = '1000';
    autocompleteInput.style.height = "30px";
    autocompleteInput.style.borderRadius = "1px";
    autocompleteInput.style.border = "0";
    autocompleteInput.style.backgroundColor = "#ffffff";
    autocompleteInput.disabled = false;
    //divMapPicker.style.height = 'calc(100% - 30px)';
    divMapPicker.style.height = '100%';
    divMapPicker.style.top = '0px';
    divMapPicker.style.width = '100%';
    divMapPicker.style.position = 'absolute';
    //setText(buttonFinished, 'Finished');
    //buttonFinished.style.width = '70px';
    //buttonFinished.style.left = 'calc(50% - 35px)';
    //buttonFinished.style.bottom = '5px';
    //buttonFinished.style.position = 'absolute';
    //buttonFinished.style.color = '#000000';
    //buttonFinished.style.fontSize = '14px';
    //buttonFinished.style.fontFamily = 'Arial';
    //buttonFinished.style.cursor = 'pointer';
    //buttonFinished.disabled = true;
    divMap.style.width = '100%';
    divMap.style.height = '100%';
    genericWindow.divMain.appendChild(divMapPicker);
    //genericWindow.divMain.appendChild(buttonFinished);
    divMapPicker.appendChild(divMap);
    divMapPicker.appendChild(autocompleteInput);



    function fillInAddress() {
        var place = autocomplete.getPlace();
        var geolocation = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};

        setGeolocation(geolocation);
    }


    function geolocate() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var geolocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setGeolocation(geolocation);
            });
        }
    }

    function resizeMap() {
        selectedGeolocation = undefined;
        autocompleteInput.value = '';
        if (map)
        {
            google.maps.event.trigger(map, 'resize');

        }
        reset();
    }

    var markerWidth = 40;
    var markerHeight = 62;
    var divMarkerHousing = document.createElement("div");
    divMarkerHousing.style.position = "absolute";
    divMarkerHousing.style.height = String(markerHeight) + "px";
    divMarkerHousing.style.width = String(66 + markerWidth) + "px";
    divMarkerHousing.style.top = "4px";
    divMarkerHousing.style.right = "6px";
    setText(divMarkerHousing, 'Drag into position:');
    divMarkerHousing.style.borderRadius = '4px';
    divMarkerHousing.style.backgroundColor = '#ffffff';
    divMarkerHousing.style.padding = '2px';
    divMarkerHousing.style.fontFamily = 'Arial';
    divMarkerHousing.style.fontSize = '14px';
    divMarkerHousing.style.fontWeight = 'Bold';
    divMapPicker.appendChild(divMarkerHousing);

    function setHousingShowing(value)
    {
        if (!value)
            divMarkerHousing.style.display = 'none';
        else
            divMarkerHousing.style.display = 'inline';
    }
    function setState(placed)
    {
        setHousingShowing(!placed);
        //buttonFinished.disabled = !placed;
    }
    var marker = new (function Marker() {
        var self = this;
        this.div = document.createElement("div");
        var img = document.createElement("img");
        this.div.style.position = "absolute";
        this.div.style.height = String(markerHeight) + "px";
        this.div.style.width = String(markerWidth) + "px";
        this.div.style.top = "6px";
        this.div.style.right = "10px";
        this.div.style.cursor = "pointer";
        this.div.style.zIndex = "2";
        img.src = window.thePageUrl + "images/google-maps-marker.png";
        img.style.height = "100%";
        img.style.width = "100%";
        this.div.appendChild(img);
        var boundaries;
        var startOffsets;
        var position;
        this.reset = function() {
            self.div.style.top = "6px";
            self.div.style.left = String(divMap.offsetWidth - (10 + markerWidth)) + "px";
        };
        function setPosition(x, y)
        {
            self.div.style.left = String(x) + 'px';
            self.div.style.top = String(y) + 'px';
        }
        function pixelOffsetToLatLng(x, y) {
            var offsetx = divMap.offsetWidth / 2 - x;
            var offsety = y - divMap.offsetHeight / 2;
            var latlng = map.getCenter();
            var scale = Math.pow(2, map.getZoom());

            var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(latlng);
            var pixelOffset = new google.maps.Point((offsetx / scale) || 0, (offsety / scale) || 0);

            var worldCoordinateNewCenter = new google.maps.Point(
                    worldCoordinateCenter.x - pixelOffset.x,
                    worldCoordinateCenter.y + pixelOffset.y
                    );

            var latLngPosition = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
            var latLng = {lat: latLngPosition.lat(), lng: latLngPosition.lng()};
            return latLng
        }
        function mouseDown(x, y)
        {
            setHousingShowing(false);
            startOffsets = {x: self.div.offsetLeft - x, y: self.div.offsetTop - y};
            var halfWidth = markerWidth / 2;
            boundaries = {xFrom: -halfWidth, yFrom: -markerHeight, xTo: divMapPicker.offsetWidth - halfWidth, yTo: divMapPicker.offsetHeight - markerHeight};
        }
        function mouseMove(x, y)
        {
            x = startOffsets.x + x;
            y = startOffsets.y + y;
            if (x < boundaries.xFrom)
                x = boundaries.xFrom;
            else
            {
                if (x > boundaries.xTo)
                    x = boundaries.xTo;
            }
            if (y < boundaries.yFrom)
                y = boundaries.yFrom;
            else
            {
                if (y > boundaries.yTo)
                    y = boundaries.yTo;
            }
            position = {x: x, y: y};
            setPosition(x, y);
        }
        function mouseUp() {
            self.div.style.cursor = "pointer";
            var latlng = pixelOffsetToLatLng((markerWidth / 2) + position.x, markerHeight + position.y);
            setGeolocation(latlng);
            settings.set('location', latlng);
        }
        var efficientMovingCycle = new EfficientMovingCycle(self.div);
        efficientMovingCycle.onmousedown = function(e) {
            e.preventDefault && e.preventDefault();
            mouseDown(e.pageX, e.pageY);
        };
        efficientMovingCycle.onmouseup = mouseUp;
        efficientMovingCycle.onmousemove = function(e) {
            e.preventDefault && e.preventDefault();
            mouseMove(e.pageX, e.pageY);
        };
        efficientMovingCycle.ontouchstart = function(e) {
            e.preventDefault && e.preventDefault();
            mouseDown(e.changedTouches[e.changedTouches.length - 1].pageX, e.changedTouches[e.changedTouches.length - 1].pageY);
        };
        efficientMovingCycle.ontouchmove = function(e) {
            e.preventDefault && e.preventDefault();
            mouseMove(e.changedTouches[e.changedTouches.length - 1].pageX, e.changedTouches[e.changedTouches.length - 1].pageY);
        };
        efficientMovingCycle.ontouchend = mouseUp;
        this.center = function()
        {
            setPosition((divMap.offsetWidth / 2) - (markerWidth / 2), (divMap.offsetHeight / 2) - markerHeight);
        };
        makeUnselectable(this.div);
        divMapPicker.appendChild(this.div);
    })();
    this.show = function(bringToFront)
    {
        genericWindow.show();
        if (bringToFront)
        {
            Windows.bringToFront(genericWindow);
        }
    };
    genericWindow.onclose = function() {
        terminal.close();
    };
    function reset() {
        setState(false);
        marker.reset();
    }
    function setGeolocation(geo)
    {
        map.setZoom(16);      // This will trigger a zoom_changed on the map
        map.setCenter(geo);
        marker.center();
        selectedGeolocation = geo;
        setState(true);
        picked();
    }
    function initMap() {
        var uluru = {lat: -25.363, lng: 131.044};
        map = new google.maps.Map(divMap, {
            zoom: 4,
            center: uluru
        });
        map.addListener('center_changed',
                resizeMap
                );
    }

    function initAutocomplete() {
        autocomplete = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */autocompleteInput,
                {types: ['geocode']});
        autocomplete.addListener('place_changed', fillInAddress);
    }
    GoogleMaps.get(function() {
        initAutocomplete();
        initMap();
        var location = settings.get('location');
        if (!location)
            geolocate();
        else
            setGeolocation(location);
    });
    function getFormattedAddress(result)
    {
        var addressComponents = result.address_components;
        var locality;
        var administrativeAreaLevel1;
        var country;
        for (var i = 0; i < addressComponents.length; i++)
        {
            var addressComponent = addressComponents[i];
            for (var j = 0; j < addressComponent.types.length; j++) {
                var type = addressComponent.types[j];
                switch (type)
                {
                    case 'locality':
                        locality=addressComponent.short_name;
                        break;
                    case 'administrative_area_level_1':
                        administrativeAreaLevel1=addressComponent.short_name;
                        break;
                    case 'country':
                        country=addressComponent.short_name;
                        break;
                }
            }
        }
        var str='';
        var first=true;
        if(locality){
             if(first)first=false;else str+=',';str+=locality;}
        if(administrativeAreaLevel1){
             if(first)first=false;else str+=',';str+=administrativeAreaLevel1;}
        if(country){
             if(first)first=false;else str+=',';str+=country;}
        return str;
            
    }
        function getLocationStringFromLatLng(latLng, callback)
        {
            var geocoder = geocoder = new google.maps.Geocoder();
            geocoder.geocode({'latLng': latLng}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        callback(getFormattedAddress(results[0]));
                    }
                }
            });
        }
        //buttonFinished.onclick=function(){
        //     getLocationStringFromLatLng(selectedGeolocation, function(formattedAddress){
        //         callbackLocationPicked(selectedGeolocation, formattedAddress);
        //    });
        //   };
        function interpret(message)
        {

        }
        function picked()
        {
            getLocationStringFromLatLng(selectedGeolocation, function(formattedAddress) {
                var jObject = {type: 'set_location', latLng:selectedGeolocation, formattedAddress: formattedAddress};
                jObject.levelQuadNs = QuadTree.getMyQuadrants(selectedGeolocation);
                terminal.send(jObject);
            });
        }
        makeUnselectable(this.div);
        divMap.addEventListener('touchstart', resizeMap);
}