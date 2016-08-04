var socket = io();

(function() {
  var gophers = {};
  const KEYPRESS_PIXEL_MOVEMENT = 5;

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

  var gopher = new Gopher(socket);
  gopher.setActiveSession(true);
  document.getElementById('dancefloor').appendChild(gopher.el);
  socket.emit('add', {id: gopher.id, x: gopher.x, y: gopher.y});
  
  // Fetch and initialize existing gophers
  $.getJSON('/bootstrap', function(data) {
    for (var k in data) {
      console.log('adding...', k, data[k]);
      initalizeGopherFromJson({id: k, x: data[k].X, y: data[k].Y});
    }
  });

  function keyboardMove(evt) {
    switch (evt.keyCode) {
      case 37:
      gopher.move(-KEYPRESS_PIXEL_MOVEMENT, 0);
      break;
      case 39:
      gopher.move(KEYPRESS_PIXEL_MOVEMENT, 0);
      break;
      case 38:
      gopher.move(0, -KEYPRESS_PIXEL_MOVEMENT);
      break;
      case 40:
      gopher.move(0, KEYPRESS_PIXEL_MOVEMENT);
      break;
    }
  }

  function unload() {
    socket.emit('del', {id: gopher.id});
  }

  window.addEventListener('unload', unload);
  window.addEventListener('keydown', keyboardMove);
})();
