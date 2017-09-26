// Load Jquery code to hide menu
$( document ).ready(function() {

$( ".close" ).hide();
$( "#menu" ).hide();
$( ".hamburger" ).click(function() {
$( "#menu" ).slideToggle( "fast", function() {
$( ".hamburger" ).hide();
$( ".close" ).show();
});
});

$( ".close" ).click(function() {
$( "#menu" ).slideToggle( "fast", function() {
$( ".close" ).hide();
$( ".hamburger" ).show();
});
});

});

//date to use with Foursquare api calls
var foursquaredate;
var clientID;
var clientSecret;
var map;
var $map = $('#map');

var markerData = [
      {
        title: 'Disneyland',
        lat: 33.812092,
        lng: -117.918974,
      },
      {
        title: 'California Adventure',
        lat: 33.804220,
        lng: -117.920859,
      },
      {
        title: 'Angel Stadium',
        lat: 33.800308,
        lng: -117.882732,
      },
      {
        title: 'Anaheim Convention Center',
        lat: 33.800672,
        lng: -117.920873,
      },
      {
        title: 'Downtown Disney',
        lat: 33.809209,
        lng: -117.923157,
      }
      ];
var filters = ["Locations", "Disneyland", "California Adventure", "Angel Stadium", "Anaheim Convention Center", "Downtown Disney"];

// Define Location class which will be used to link markers to foursquare
var Location = function(data) {
	var self = this;
	this.title = data.title;
	this.lat = data.lat;
	this.lng = data.lng;
  this.icon = "";
	this.url = "";
	this.street = "";
	this.city = "";
  this.checkins = "";
  this.twitter = "";
  this.instagram = "";
	this.phone = "";
  this.show = ko.observable(true);
  this.showInfo = ko.observable(true);
  var latLng = [data.lat, data.lng]
  // Generate foursquare API URL
	var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll='+
  this.lat + ',' + this.lng + '&client_id=' + clientID + '&client_secret='
  + clientSecret + '&v=' + foursquaredate + '&query=' + this.title;
  // Generate foursquare API request using JQuery's .getJSON method
	$.getJSON(foursquareURL).done(function(data) {
		var results = data.response.venues[0];
		self.url = results.url;
		self.street = results.location.formattedAddress[0];
    self.city = results.location.formattedAddress[1];
    self.phone = results.contact.formattedPhone;
    self.checkins = results.stats.checkinsCount;
    self.twitter = results.contact.twitter;
    // If there is no twitter handle return ""
    if (typeof self.twitter === 'undefined'){
			self.twitter = "";
		} else {
			self.twitter = self.twitter;
		}
    self.instagram = results.contact.instagram;
    if (typeof self.instagram === 'undefined'){
			self.instagram = "";
		} else {
			self.instagram = self.instagram;
		}
    self.herenow = results.hereNow.summary;
    if(self.herenow === "Nobody here"){
      self.herenow = "No one is currently checked in";
    } else {
      self.herenow = self.herenow;
    }
	}).fail(function() {
		alert("There was an error with the Foursquare API call. Please refresh the page and try again to load Foursquare data.");
	});

  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(this.lat, this.lng),
    animation: google.maps.Animation.DROP,
    title: this.title,
    map: map,
  });
  this.selectedMarker = ko.computed(function() {
  if(this.show() == true) {
    this.marker.setMap(map);
  } else {
    this.marker.setMap(null);
  }
  return true;
}, this);

this.infowindow = new google.maps.InfoWindow({content: self.locationInfo});

this.marker.addListener('click', function(){
  var locationInfo = '<div class="street">' + self.street + '</div>' +
        '<div class="city">' + self.city + '</div>' +
        '<div class="phone">' + self.phone + '</div>' +
        '<div class="checkedIn">' + self.herenow + '</div>' +
        '<div class="twitter"><a href="http://twitter.com/' + self.twitter + '" data-show-count="true" ><img src="images/twitter.png" alt="Twitter icon" style="width:70px;" /></a></div>' +
        '<div class="instagram"><a href="http://instagram.com/' + self.instagram + '" data-show-count="true" ><img src="images/instagram.png" alt="Instagram icon" style="width:70px;" /></a></div><br></br>' +
        '<div class="url"><a href="' + self.url +'"><h3>' + self.title + " Website" + '</h3></a></div>' ;
  var infowindow = new google.maps.InfoWindow({
    content: locationInfo,
    maxWidth: 150
  });
  console.log(infowindow);
  infowindow.open(map, this);
  google.maps.event.addDomListener(window, 'resize', function() {
          infowindow.open(map, this);
        });
  self.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      self.marker.setAnimation(null);
  }, 2000);
}, this);

  this.resetMap = function() {
    map.setCenter({lat:33.812092, lng: -117.918974});
    map.setZoom(13);
  }

  this.bounce = function(chosenMarker) {
  google.maps.event.trigger(self.marker, 'click');
  map.setCenter(self.marker.position);
  map.setZoom(17);
};
  this.name = ko.observable('Map of Anaheim');
};

var ViewModel = function() {
    var self = this;

    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 33.812092, lng: -117.918974},
      zoom: 13
    });

    this.markerList = ko.observableArray([]);
    // Store clientID and secret for foursquare API
    clientID = "JTNSWR0O4211C3F5BO0NP1SBLEQR0FH2APFYYPWLXD1OPFLD";
    clientSecret = "KEZMBI3TX1EK5NDBUTGAWM1L3NOX554HQPZOTOTIQDLTKQPF";
    // API date required by foursquare in all requests
    foursquaredate = "20170915";
    // For each object in our markerData array push it to the observableArray
    markerData.forEach(function(markerItem){
		self.markerList.push( new Location(markerItem));
	});
    // Set timeout error message in case map fails to load
    setTimeout(function(){
        $map.append('<h2 align="center">' + "Failed to load map. Please wait a few seconds and try again" + '</h2>');
    }, 1500);
    // Set the name of the map
    this.name = ko.observable('Map of Anaheim');
    // Assign the filters array
    self.filter = ko.observable();
    self.filteredMarkers = ko.computed(function() {
        var filter = self.filter();
        // If filter is empty or set to Locations, return all markers
        if (filter == "Locations") {
          self.markerList().forEach(function(markerItem){
				        markerItem.show(true);
                markerItem.showInfo(false);
                markerItem.resetMap();
			});
          var result = ko.observable( this.markerList());
            return result();
        } else {
            return ko.utils.arrayFilter(self.markerList(), function(markerItem) {
                if (markerItem.title == filter) {
                  // Set marker to show on map
                  markerItem.show(true);
                  markerItem.showInfo(true);
                  markerItem.bounce();
                  return markerItem;
                } else {
                  markerItem.show(false);
                  markerItem.showInfo(false);
                }
                       });
                   }
               }, self);
             }

function loadApp() {
  ko.applyBindings(new ViewModel());
}
