if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);
  Template.body.helpers({
    map: function() {
      function success(position) {
      var mapcanvas = document.createElement('div');
      mapcanvas.id = 'mapcontainer';
      mapcanvas.style.height = '400px';
      mapcanvas.style.width = '600px';

      document.querySelector('article').appendChild(mapcanvas);

      var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var options = {
        zoom: 15,
        center: coords,
        mapTypeControl: false,
        navigationControlOptions: {
        	style: google.maps.NavigationControlStyle.SMALL
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById("mapcontainer"), options);

      var marker = new google.maps.Marker({
          position: coords,
          map: map,
          title:"You are here!"
      });
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success);
    } else {
      error('Geo Location is not supported');
    }
    }
  })
  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}


if (Meteor.isServer) {
  
}
