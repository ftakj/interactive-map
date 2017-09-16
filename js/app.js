//date to use with Foursquare api calls
var foursquaredate;
var clientID;
var clientSecret;
var map;

var initialData = {
    filters: ["Choose a destination", "Disneyland", "California Adventure", "Angel Stadium", "Anaheim Convention Center", "Downtown Disney"],
    markers: [
      {title: 'Disneyland', location: {lat: 33.812092, lng: -117.918974}, icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'},
      {title: 'California Adventure', location: {lat: 33.804220, lng: -117.920859}, icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},
      {title: 'Angel Stadium', location: {lat: 33.800308, lng: -117.882732}, icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},
      {title: 'Anaheim Convention Center', location: {lat: 33.800672, lng: -117.920873}, icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},
      {title: 'Downtown Disney', location: {lat: 33.809209, lng: -117.923157}, icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'}  ]
};

var foursquareInfo = function(data) {
  var self = this;
}


function startMap() {
    var self = this;
    // Create a new map with zoom auto-set to 13
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 33.812092, lng: -117.918974},
      zoom: 13
      });
        // iterate over locations array returning markers
        for (var i = 0; i < 5; i++){
          var position = initialData.markers[i].location;
          var title = initialData.markers[i].title;
          var icon = initialData.markers[i].icon;
          var marker = new google.maps.Marker({
            position: position,
            animation: google.maps.Animation.DROP,
            title: title,
            map: map,
            icon: icon
          });
        }
    }


var ViewModel = function(data) {
    var self = this;
    // Store clientID and secret for foursquare API
    clientID = "JTNSWR0O4211C3F5BO0NP1SBLEQR0FH2APFYYPWLXD1OPFLD";
    clientSecret = "KEZMBI3TX1EK5NDBUTGAWM1L3NOX554HQPZOTOTIQDLTKQPF";
    foursquaredate = 20170915;
    this.name = ko.observable('Map of Anaheim');
    self.filters = ko.observableArray(data.filters);
    self.filter = ko.observable('');
    self.markers = ko.observableArray(data.markers);
    self.filteredMarkers = ko.computed(function() {
        var filter = self.filter();
        if (!filter || filter == "Choose a destination") {
            return self.markers();
        } else {
            return ko.utils.arrayFilter(self.markers(), function(i) {
                return i.title == filter;
                       });
                   }
               });
             }
ko.applyBindings(new ViewModel(initialData));
