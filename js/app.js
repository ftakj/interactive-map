//date to use with Foursquare api calls
var foursquaredate;
var clientID;
var clientSecret;
var map;
var $map = $('#map')

var markerData = [
      {
        title: 'Disneyland',
        lat: 33.812092,
        lng: -117.918974,
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
      },
      {
        title: 'California Adventure',
        lat: 33.804220,
        lng: -117.920859,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      },
      {
        title: 'Angel Stadium',
        lat: 33.800308,
        lng: -117.882732,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      },
      {
        title: 'Anaheim Convention Center',
        lat: 33.800672,
        lng: -117.920873,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      },
      {
        title: 'Downtown Disney',
        lat: 33.809209,
        lng: -117.923157,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'}
      ];
var filters = ["Choose a destination", "Disneyland", "California Adventure", "Angel Stadium", "Anaheim Convention Center", "Downtown Disney"];

// Define Location class which will be used to link markers to foursquare
var Location = function(data) {
	var self = this;
	this.title = data.title;
	this.lat = data.lat;
	this.lng = data.lng;
  this.icon = data.icon;
	this.url = "";
	this.street = "";
	this.city = "";
	this.phone = "";

  this.visible = ko.observable(true);
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
			self.twitter = "@" + self.twitter;
		}
    self.instagram = results.contact.instagram;
    if (typeof self.instagram === 'undefined'){
			self.instagram = "";
		} else {
			self.instagram = "@" + self.instagram;
		}
    self.herenow = results.hereNow.summary;
    if(self.herenow === "Nobody here"){
      self.herenow = "No one is currently checked in";
    } else {
      self.herenow = self.herenow + " checked in via foursquare";
    }
    console.log(self.herenow);
	}).fail(function() {
		alert("There was an error. Please try again");
	});
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(this.lat, this.lng),
    animation: google.maps.Animation.BOUNCE,
    title: this.title,
    map: map,
    icon: this.icon
  });
}

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
    self.filters = ko.observableArray(filters);
    self.filter = ko.observable('');
    self.markers = ko.observableArray(markerData);
    self.filteredMarkers = ko.computed(function() {
        var filter = self.filter();
        // If filter is empty or set to choose a destination, return all markers
        if (!filter || filter == "Choose a destination") {
            return self.markers();
        } else {
            return ko.utils.arrayFilter(self.markers(), function(i) {
                return i.title == filter;
                       });
                   }
               });
             }

function loadApp() {
  ko.applyBindings(new ViewModel());
}
