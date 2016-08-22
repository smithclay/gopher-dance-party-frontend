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

  // Create new Gopher for current session.
  var gopher = new Gopher(socket);
  gopher.setActiveSession(true);
  gophers[gopher.id] = gopher;
  document.getElementById('dancefloor').appendChild(gopher.el);
  socket.emit('add', {id: gopher.id, x: gopher.x, y: gopher.y});
  setTimeout(function() {
    gopher.bounce();
  }, 1000);

  // Fetch and initialize existing gophers
  $.getJSON('/bootstrap', function(data) {
    for (var k in data) {
      console.log('adding...', k, data[k]);
      initalizeGopherFromJson({id: k, x: data[k].X, y: data[k].Y});
    }
  });

  function unload() {
    socket.emit('del', {id: gopher.id});
  }

  window.addEventListener('unload', unload);
})();
