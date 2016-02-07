if (Meteor.isClient) {
  var MAP_ZOOM = 15;
  Meteor.startup(function() {
    GoogleMaps.load();
  })
  var temp =        $.getJSON("https://api.particle.io/v1/devices/2a0033000a47343232363230/analogvalue?access_token=b3a37050b8109deebfc7229155d24069b6dc2f1b",
          function(data) {
            console.log(data["result"]);
            Session.set("waterLevel", data["result"]);
          });
  Session.set("waterLevel", temp);
  // takes a value from Mark and then also sends a text message

  Template.map.onCreated(function() {
    var self = this;

    GoogleMaps.ready('map', function(map) {
      var marker;
      var geocoder = new google.maps.Geocoder();

      // distance calculator
      function distance(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist
      }
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

          new google.maps.Marker({
            position: new google.maps.LatLng(41.825753, -71.403183),
            map: map.instance
          });

          new google.maps.Marker({
            position: new google.maps.LatLng(41.826178, -71.402760),
            map: map.instance
          });
        }
        // The marker already exists, so we'll just change its position.
        else {
          marker.setPosition(latLng);
        }

        document.getElementById("location").innerHTML = "Distance to closet water fountain: " + Math.round((distance(latLng.lat, latLng.lng, 41.825753, -71.403183, "K") ) * 1000) + "m";
        if (distance(latLng.lat, latLng.lng, 41.825753, -71.403183, "K") < 0.1 && Session.get("waterLevel") > 700) {
          Meteor.call('sendEmail',
           Session.get("cell-number") + '@txt.att.net',
           'hi.drate@gmail.com',
           'Hey there!',
           'Time to fill up that water bottle, friend!');
           document.getElementById("volume").innerHTML = "Your water bottle is empty! You may be thirsty!"
        } else if (Session.get("waterLevel") < 700) {
          document.getElementById("volume").innerHTML = "Your water bottle is not empty!"
        }

        // Center and zoom the map view onto the current position.
        map.instance.setCenter(marker.getPosition());
        map.instance.setZoom(MAP_ZOOM);


      });
    });
  }),

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

Template.body.events({
  'click #updateData': function() {
    $.getJSON("https://api.particle.io/v1/devices/2a0033000a47343232363230/analogvalue?access_token=b3a37050b8109deebfc7229155d24069b6dc2f1b",
    function(data) {
      console.log(data["result"]);
      Session.set("waterLevel", data["result"]);
    }
  )},
    "click #cell-submit": function() {
      console.log($("#cell-number").val())
      Session.set("cell-number", $("#cell-number").val());
      document.getElementById("phoneNumber").innerHTML = "Your cell phone number:" + Session.get("cell-number")
    }
})
}

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
  process.env.MAIL_URL = "smtp://postmaster@sandboxbb92cafd2d7c4ebca8faa12a3e56ba6e.mailgun.org:605b6c9b454e4cb83ee816922fd83a70@smtp.mailgun.org:587";
});
}
