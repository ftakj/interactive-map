var map;
function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 33.812092, lng: -117.918974},
      zoom: 13
      });
    }
