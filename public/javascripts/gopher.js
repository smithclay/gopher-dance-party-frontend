(function() {
  const DANCE_FLOOR_WIDTH = 800;
  const DANCE_FLOOR_HEIGHT = 600;
  const KEYPRESS_PIXEL_MOVEMENT = 5;

  function Gopher(socket, id) {
    this.id = id || ('id-' + Math.floor(Math.random() * 32768));
    this.el = document.createElement('div');
    this.el.id = this.id;
    this.el.className = 'gopher';

    this.GOPHER_HEIGHT = 250;
    this.GOPHER_WIDTH = 183;

    var creature = document.getElementById('creature').cloneNode(false);
    creature.style.display = '';
    creature.style.height = this.GOPHER_HEIGHT + 'px';

    this.el.appendChild(creature);
    this.socket = socket;

    this.setX(Math.random() * 300);
    this.setY(Math.random() * 300);
  }

  Gopher.prototype._setupTouchEvents = function() {
    var that = this;
    this.el.addEventListener('touchmove', function(evt) {
      if (evt.touches.length >= 0) {
        that.setPosition(evt.touches[0].pageX, evt.touches[0].pageY);
      }
    });
  }

  Gopher.prototype._setupKeyboardEvents = function() {
    var that = this;
    function keyboardMove(evt) {
      switch (evt.keyCode) {
        case 37:
        that.move(-KEYPRESS_PIXEL_MOVEMENT, 0);
        break;
        case 39:
        that.move(KEYPRESS_PIXEL_MOVEMENT, 0);
        break;
        case 38:
        that.move(0, -KEYPRESS_PIXEL_MOVEMENT);
        break;
        case 40:
        that.move(0, KEYPRESS_PIXEL_MOVEMENT);
        break;
        case 66:
        that.bounce();
        break;
      }
    }
    window.addEventListener('keydown', keyboardMove);
  }

  Gopher.prototype.setX = function(x) {
    if (x >= DANCE_FLOOR_WIDTH) {
      x = DANCE_FLOOR_WIDTH;
    } 
    if (x < 0) {
      x = 0;
    }

    this.x = x;
    this.el.style.left = this.x + 'px';
  }

  Gopher.prototype.setY = function(y) {
    if (y >= DANCE_FLOOR_HEIGHT) {
      y = DANCE_FLOOR_HEIGHT;
    }

    if (y < 0) {
      y = 0;
    }

    this.y = y;
    this.el.style.top = this.y + 'px';
  }

  Gopher.prototype.setPosition = function(x, y) {
    this.setX(x);
    this.setY(y);

    // TODO: remove from here
    this.socket.emit('move', {id: this.id, x: this.x, y: this.y});
  }

  Gopher.prototype.setActiveSession = function(isActiveSession) {
    if (this.isActiveSession) {
      return;
    }

    this.isActiveSession = isActiveSession;

    if (!this.isActiveSession) {
      return;
    }

    var textNode = document.createElement('p');
    textNode.style.color = 'white';
    textNode.style.textAlign = 'center';
    textNode.innerText = 'you';
    this.el.appendChild(textNode);

    this._setupTouchEvents();
    this._setupKeyboardEvents();
  }

  Gopher.prototype.move = function(x, y) {
    var left = parseInt(this.el.style.left === "" ? 0 : this.el.style.left, 10);
    var top = parseInt(this.el.style.top === "" ? 0 : this.el.style.top, 10);
    var x = left + x;
    var y = top + y;

    this.setPosition(x, y);
  };

  Gopher.prototype.bounce = function() {
    if (this.isBouncing) {
      return;
    }
    var that = this;
    this.el.className = 'gopher gopher-bounce';
    this.isBouncing = true;

    // TODO: Remove from here
    this.socket.emit('bounce', {id: this.id});

    setTimeout(function() {
      that.el.className = 'gopher';
      that.isBouncing = false;
    }, 2000);
  };

  Gopher.prototype.randomMove = function() {
    this.move(Math.floor(Math.random() * 5), Math.floor(Math.random() * 5));
  };

  window.Gopher = Gopher;
})();
