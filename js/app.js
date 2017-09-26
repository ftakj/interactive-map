// Load Jquery code to hide menu
$(document).ready(function() {
    // Automatically hides the close div and menu
    $(".close").hide();
    $("#menu").hide();
    // When hamburger is clicked slide open menu
    $(".hamburger").click(function() {
        $("#menu").slideToggle("fast", function() {
            $(".hamburger").hide();
            $(".close").show();
        });
    });
    // When close is clicked slide the menu closed
    $(".close").click(function() {
        $("#menu").slideToggle("fast", function() {
            $(".close").hide();
            $(".hamburger").show();
        });
    });

});

//date to use with Foursquare api calls
let foursquaredate;
let clientID;
let clientSecret;
let map;
let $map = $('#map');

// Create marker data to display on map
const markerData = [{
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

// Create filter array to use as a filter against marker data
const filters = ["Locations", "Disneyland", "California Adventure", "Angel Stadium", "Anaheim Convention Center", "Downtown Disney"];

// Define Location class which will be used to link markers to foursquare
let Location = function(data) {
    let self = this;
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
    // When this.show is true the marker will show on map
    this.show = ko.observable(true);
    // Generate foursquare API URL
    let foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' +
        this.lat + ',' + this.lng + '&client_id=' + clientID + '&client_secret=' +
        clientSecret + '&v=' + foursquaredate + '&query=' + this.title;
    // Generate foursquare API request using JQuery's .getJSON method
    $.getJSON(foursquareURL).done(function(data) {
        let results = data.response.venues[0];
        self.url = results.url;
        self.street = results.location.formattedAddress[0];
        self.city = results.location.formattedAddress[1];
        self.phone = results.contact.formattedPhone;
        self.checkins = results.stats.checkinsCount;
        self.twitter = results.contact.twitter;
        // If there is no twitter handle return ""
        if (typeof self.twitter === 'undefined') {
            self.twitter = "";
        } else {
            self.twitter = self.twitter;
        }
        self.instagram = results.contact.instagram;
        if (typeof self.instagram === 'undefined') {
            self.instagram = "";
        } else {
            self.instagram = self.instagram;
        }
        // Display how many users are checked in using Foursquare
        self.herenow = results.hereNow.summary;
        if (self.herenow === "Nobody here") {
            self.herenow = "No one is currently checked in";
        } else {
            self.herenow = self.herenow;
        }
        // Set up fail method to alert users if foursquare call fails
    }).fail(function() {
        alert("There was an error with foursquare, please reload");
    });
    // Create markers to display on map
    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.lat, this.lng),
        animation: google.maps.Animation.DROP,
        title: this.title,
        map: map,
    });
    // Only show selected marker, set other markers to null (don't show)
    this.selectedMarker = ko.computed(function() {
        if (this.show() === true) {
            this.marker.setMap(map);
        } else {
            this.marker.setMap(null);
        }
        return true;
    }, this);
    // When marker is clicked run the following function
    this.marker.addListener('click', function() {
        // Save foursquare info to the locationInfo variable
        let locationInfo = '<div class="street">' + self.street + '</div>' +
            '<div class="city">' + self.city + '</div>' +
            '<div class="phone">' + self.phone + '</div>' +
            '<div class="checkedIn">' + self.herenow + '</div>' +
            '<div class="twitter"><a href="http://twitter.com/' + self.twitter +
            '"><img src="images/twitter.png" alt="Twitter icon" style="width:70px;" /></a></div>' +
            '<div class="instagram"><a href="http://instagram.com/' + self.instagram +
            '"><img src="images/instagram.png" alt="Instagram icon" style="width:70px;" /></a></div><br></br>' +
            '<div class="url"><a href="' + self.url + '"><h3>' + self.title + " Website" + '</h3></a></div>';
        // save infowindow variable using the locationInfo data
        let infowindow = new google.maps.InfoWindow({
            content: locationInfo,
            maxWidth: 150
        });
        // open infowindow using data passed through the keyword this
        infowindow.open(map, this);
        // set animation for the marker to bounce when clicked for 1.5 seconds
        self.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            self.marker.setAnimation(null);
        }, 1400);
    }, this);
    // reset map to display all markers when filter goes back to locations
    this.resetMap = function() {
        map.setCenter({
            lat: 33.812092,
            lng: -117.918974
        });
        map.setZoom(13);
    };
    // bounce marker and set center of map to the position of marker
    this.bounce = function(chosenMarker) {
        google.maps.event.trigger(self.marker, 'click');
        map.setCenter(self.marker.position);
        map.setZoom(17);
    };
};

let ViewModel = function() {
    let self = this;
    // Create map with a starting center location
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 33.812092,
            lng: -117.918974
        },
        zoom: 13
    });
    // Create empy array to pass marker data into
    this.markerList = ko.observableArray([]);
    // Store clientID and secret for foursquare API
    clientID = "JTNSWR0O4211C3F5BO0NP1SBLEQR0FH2APFYYPWLXD1OPFLD";
    clientSecret = "KEZMBI3TX1EK5NDBUTGAWM1L3NOX554HQPZOTOTIQDLTKQPF";
    // API date required by foursquare in all requests
    foursquaredate = "20170915";
    // For each object in our markerData array push it to the observableArray
    markerData.forEach(function(markerItem) {
        self.markerList.push(new Location(markerItem));
    });
    // Set the name of the map
    this.name = ko.observable('Map of Anaheim');
    // Assign the filters array
    self.filter = ko.observable();
    // How to handle filtered markers with computed function
    self.filteredMarkers = ko.computed(function() {
        let filter = self.filter();
        // If filter is set to Locations, return all markers
        if (filter == "Locations") {
            self.markerList().forEach(function(markerItem) {
                markerItem.show(true);
                markerItem.resetMap();
            });
            let result = ko.observable(this.markerList());
            return result();
        } else {
            return ko.utils.arrayFilter(self.markerList(), function(markerItem) {
                if (markerItem.title == filter) {
                    // Set marker to show and bounce on map
                    markerItem.show(true);
                    markerItem.bounce();
                    return markerItem;
                } else {
                    markerItem.show(false);
                }
            });
        }
    }, self);
};

// Run mapError function if map fails to load
function mapError() {
    alert("There was an error with the Google Maps API, please reload");
}
// When loadApp is passed from the callback, run the ViewModel
function loadApp() {
    ko.applyBindings(new ViewModel());
}
