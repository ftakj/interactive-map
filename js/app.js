var map;
// Create empty array variable to store markers in
var markers = [];
function initMap() {
    // Create a new map with zoom auto-set to 14
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 33.812092, lng: -117.918974},
      zoom: 14
      });
      var locations = [
          {title: 'Disneyland', location: {lat: 33.812092, lng: -117.918974}},
          {title: 'California Adventure', location: {lat: 33.804220, lng: -117.920859}},
          {title: 'Angel Stadium', location: {lat: 33.800308, lng: -117.882732}},
          {title: 'Anaheim Convention Center', location: {lat: 33.800672, lng: -117.920873}},
          {title: 'Downtown Disney', location: {lat: 33.809209, lng: -117.923157}},
        ];
        // iterate over locations array returning markers
        for (var i = 0; i < locations.length; i++){
          var position = locations[i].location;
          var title = locations[i].title;
          var marker = new google.maps.Marker({
            position: position,
            animation: google.maps.Animation.DROP,
            title: title,
            map: map,
          });
          // Push each marker to our empty markers array
          markers.push(marker);
        }
    }

var ViewModel = function() {
  this.name=ko.observable('Anaheim')
  this.markers=ko.observable('None!')
}

ko.applyBindings(new ViewModel())
