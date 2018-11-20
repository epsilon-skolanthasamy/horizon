function initMap() {
	$('.location-map').each(function(){
		var mapIdentifier = $(this).attr('data-map-identifier');
		var mapData = mapLocations[mapIdentifier];
		var locations = mapData['locations'];
		var bounds = new google.maps.LatLngBounds();


		var map = new google.maps.Map(document.getElementById(mapIdentifier), {
			zoom: mapData['zoom'],
			center: new google.maps.LatLng(locations[0][1], locations[0][2]),
			mapTypeId: mapData['mapTypeId'],
			disableDefaultUI: mapData['disableDefaultUI']
		});

		var infowindow = new google.maps.InfoWindow({});

		var marker, i;

		for (i = 0; i < locations.length; i++) {
			var markerData = {};

			markerData['position'] = new google.maps.LatLng(locations[i][1], locations[i][2]);
			markerData['map'] = map;
			if(mapLocations[mapIdentifier]['markerIcon']) {
				markerData['icon'] = mapLocations[mapIdentifier]['markerIcon'];
			}

			marker = new google.maps.Marker(markerData);

			bounds.extend(marker.position);

			google.maps.event.addListener(marker, 'click', (function (marker, i) {
				return function () {
					infowindow.setContent(locations[i][0]);
					infowindow.open(map, marker);
				}
			})(marker, i));
		}

		if(mapData['setMapBounds']) {
			map.fitBounds(bounds);
		}
	});
}
