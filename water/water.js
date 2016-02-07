if (Meteor.isClient) {
  var MAP_ZOOM = 15;
  Meteor.startup(function() {
    GoogleMaps.load();
  })

  Template.map.onCreated(function() {
    var self = this;

    GoogleMaps.ready('map', function(map) {
      var marker;
      var geocoder = new google.maps.Geocoder();

      
      // Create and move the marker when latLng changes.
      self.autorun(function() {
        var latLng = Geolocation.latLng();
        if (! latLng)
          return;

        // If the marker doesn't yet exist, create it.
        if (! marker) {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(latLng.lat, latLng.lng),
            map: map.instance
          });
          // geocodeAddress(geocoder, resultsMap, "1 Prospect St Providence, RI 02912");

          wf2 = new google.maps.Marker({
            position: new google.maps.LatLng(latLng.lat, latLng.lng),
            map: map.instance
          });


                    // takes a value from Mark and then also sends a text message
          $.getJSON("https://api.particle.io/v1/devices/2a0033000a47343232363230/analogvalue?access_token=b3a37050b8109deebfc7229155d24069b6dc2f1b",
              function(data) {
                console.log(data["result"]);
                var waterLevel = data["result"];
                if (waterLevel > 700) {
                   Meteor.call('sendEmail',
                    '9737234645@txt.att.net',
                    'hi.drate@gmail.com',
                    'Hey there!',
                    'Time to fill up that water bottle friend!');
                }

              });
    

          // function geocodeAddress(geocoder, resultsMap, address) {
          //    geocoder.geocode({'address': address}, function(results, status) {
          //      if (status === google.maps.GeocoderStatus.OK) {
          //        resultsMap.setCenter(results[0].geometry.location);
          //        var marker = new google.maps.Marker({
          //          map: resultsMap,
          //          position: results[0].geometry.location
          //        });
          //      } else {
          //        alert('Geocode was not successful for the following reason: ' + status);
          //      }
          //    });
          //  }

        }
        // The marker already exists, so we'll just change its position.
        else {
          marker.setPosition(latLng);
        }

        // Center and zoom the map view onto the current position.
        map.instance.setCenter(marker.getPosition());
        map.instance.setZoom(MAP_ZOOM);
      });
    });
  });

  Template.body.events({
    'click button': function () {

      Meteor.call('sendEmail',
            '9737234645@txt.att.net',
            'hi.drate@gmail.com',
            'Hey there!',
            'Time to fill up that water bottle friend!');
      }
  });

  Template.map.helpers({
    geolocationError: function() {
      var error = Geolocation.error();
      return error && error.message;
    },
    mapOptions: function() {
      var latLng = Geolocation.latLng();
      // Initialize the map once we have the latLng.
      if (GoogleMaps.loaded() && latLng) {
        return {
          center: new google.maps.LatLng(latLng.lat, latLng.lng),
          zoom: MAP_ZOOM
        };
      }
    }
  });
}










    //   var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    //
    //   var options = {
    //     zoom: 15,
    //     center: coords,
    //     mapTypeControl: false,
    //     navigationControlOptions: {
    //     	style: google.maps.NavigationControlStyle.SMALL
    //     },
    //     mapTypeId: google.maps.MapTypeId.ROADMAP
    //   };
    //   var map = new google.maps.Map(document.getElementById("mapcontainer"), options);
    //
    //   var marker = new google.maps.Marker({
    //       position: coords,
    //       map: map,
    //       title:"You are here!"
    //   });
    //   var geocoder = new google.maps.Geocoder();
    //   var waterFountainLocation = geocodeAddress(geocoder, map);
    //   function geocodeAddress(geocoder, resultsMap) {
    //   var address = "1 Prospect St Providence, RI 02912";
    //   geocoder.geocode({'address': address}, function(results, status) {
    //     if (status === google.maps.GeocoderStatus.OK) {
    //       resultsMap.setCenter(results[0].geometry.location);
    //       var marker = new google.maps.Marker({
    //         map: resultsMap,
    //         position: results[0].geometry.location
    //       });
    //     } else {
    //       alert('Geocode was not successful for the following reason: ' + status);
    //     }
    //   });
    // }
    //   // Create a marker and set its position.
    //   var waterFountain1 = new google.maps.Marker({
    //     map: map,
    //     position: waterFountainLocation,
    //     title: 'My First Water Fountain'
    //   });
    // }
    //
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(success);
    // } else {
    //   error('Geo Location is not supported');
    // }
    // }



Meteor.methods({
  sendEmail: function (to, from, subject, text) {
    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });

  // Let other method calls from the same client start running,
  // without waiting for the email sending to complete.
  this.unblock();


}})

if (Meteor.isServer) {
  Meteor.startup( function() {
  process.env.MAIL_URL = "smtp://postmaster@sandboxdfe1e7846a90444588f960fba7f0c953.mailgun.org:3a5dbee9bcc9fe84292c92cfdf44dc1c@smtp.mailgun.org:587";
});
}
