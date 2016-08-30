var socket = io();

(function() {
  var gophers = {};

  var initalizeGopherFromJson = function(json) {
      if (gophers[json.id]) {
        return;
      }

      var gopher = new Gopher(socket, json.id);
      gophers[json.id] = gopher;
      gopher.setX(json.x);
      gopher.setY(json.y);
      document.getElementById('dancefloor').appendChild(gopher.el);
  }

  socket.on('move', function(msg) {
    console.log('move', msg);
  });

  socket.on('del', function(json) {
    var gopher = gophers[json.id];
    if (gopher) {
      delete gophers[json.id];
      document.getElementById('dancefloor').removeChild(gopher.el);
    }
  });

  socket.on('pong', function(data) {
    console.log('pong', data);
  });

  socket.on('returns', function(stuff) {
    console.log('stuff!', stuff);
  });

  socket.on('add', function(json) {
    console.log('add', json);
    try {
      initalizeGopherFromJson(json);
    } catch (e) {
    }
  });
  
  socket.on('bounce', function(json){
    try {
      var gopher = gophers[json.id];
      if (gopher) {
        gopher.bounce();
      } else {
        console.log('error finding gopher, creating: ', json.id);
        initalizeGopherFromJson(json);
      }
    } catch (e) {
    }
  });

  socket.on('move', function(json){
    try {
      var gopher = gophers[json.id];
      if (gopher) {
        gopher.setX(json.x);
        gopher.setY(json.y);
      } else {
        console.log('error finding gopher, creating: ', json.id);
        initalizeGopherFromJson(json);
      }
    } catch (e) {
    }
  });

  var createGopher = function(socket) {
    // Create new Gopher for current session (must be connected to the socket).
    var gopher = new Gopher(socket, socket.id);
    gopher.setActiveSession(true);
    gophers[gopher.id] = gopher;
    document.getElementById('dancefloor').appendChild(gopher.el);
    socket.emit('add', {id: gopher.id, x: gopher.x, y: gopher.y});
    gopher.bounce();

    if (typeof newrelic == 'object') {
      newrelic.setCustomAttribute('gopher-id', gopher.id);
    }

    if (window.location.hash === '#autodance') {
      setInterval(function() {
        gopher.randomMove();
      }, 5000);
      setInterval(function() {
        gopher.bounce();
      }, 15000);
    }
  }

  socket.on('connect', function() {
    createGopher(socket);

    if (typeof newrelic == 'object') {
      newrelic.setCustomAttribute('socket-transport', socket.io.engine.transport.name);
    }
  });



  // Fetch and initialize existing gophers
  $.getJSON('/bootstrap', function(data) {
    for (var k in data) {
      console.log('adding...', k, data[k]);
      initalizeGopherFromJson({id: k, x: data[k].X, y: data[k].Y});
    }
  });
})();
