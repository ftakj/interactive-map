var map;
var initialMarkers = [
    {title: 'Disneyland', location: {lat: 33.812092, lng: -117.918974}},
    {title: 'California Adventure', location: {lat: 33.804220, lng: -117.920859}},
    {title: 'Angel Stadium', location: {lat: 33.800308, lng: -117.882732}},
    {title: 'Anaheim Convention Center', location: {lat: 33.800672, lng: -117.920873}},
    {title: 'Downtown Disney', location: {lat: 33.809209, lng: -117.923157}},
  ];
// Create empty array variable to store markers in
var markers = [];
var Marker = function(data) {
  this.title = ko.observable(data.title);
  this.location = ko.observable(data.location);
}

function initMap() {
    // Create a new map with zoom auto-set to 14
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 33.812092, lng: -117.918974},
      zoom: 13
      });

        // iterate over locations array returning markers
        for (var i = 0; i < initialMarkers.length; i++){
          var position = initialMarkers[i].location;
          var title = initialMarkers[i].title;
          var marker = new google.maps.Marker({
            position: position,
            animation: google.maps.Animation.DROP,
            title: title,
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          });
          // Push each marker to our empty markers array
          markers.push(marker);
        }
    }

var ViewModel = function() {
  var self = this;

  this.markerList = ko.observableArray([]);
  initialMarkers.forEach(function(thisMarker){
        self.markerList.push(new Marker(thisMarker));
        });
  this.name=ko.observable('Anaheim');

  }


ko.applyBindings(new ViewModel())
