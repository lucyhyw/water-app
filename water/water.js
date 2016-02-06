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
      Meteor.call('sendEmail',
            '9737234645@txt.att.net',
            'water@brown.edu',
            'Hello from Meteor!',
            'This is a test of Email.send.');
    }
  });
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
  process.env.MAIL_URL = "smtp://postmaster@sandboxdfe1e7846a90444588f960fba7f0c953.mailgun.org:3a5dbee9bcc9fe84292c92cfdf44dc1c@smtp.mailgun.org:587";
});
}
