  const DANCE_FLOOR_WIDTH = 800;
  const DANCE_FLOOR_HEIGHT = 600;

  function Gopher(socket, id) {
    this.id = id || ('id-' + Math.floor(Math.random() * 32768));
    this.el = document.createElement('div');
    this.el.id = this.id;
    this.el.className = 'gopher gopher-bounce';
    this.el.innerHTML = '<img src="images/gopher.png" height="250"/>';
    this.socket = socket;

    this.setX(Math.random() * 300);
    this.setY(Math.random() * 300)

    this.GOPHER_HEIGHT = 250;
    this.GOPHER_WIDTH = 183;
  }

  Gopher.prototype.setX = function(x) {
    this.x = x;
    this.el.style.left = this.x + 'px';
  }

  Gopher.prototype.setY = function(y) {
    this.y = y;
    this.el.style.top = this.y + 'px';
  }

  Gopher.prototype.move = function(x, y) {
    var left = parseInt(this.el.style.left === "" ? 0 : this.el.style.left, 10);
    var top = parseInt(this.el.style.top === "" ? 0 : this.el.style.top, 10);
    this.x = left + x;
    this.y = top + y;

    if (this.x >= DANCE_FLOOR_WIDTH) {
      this.x = DANCE_FLOOR_WIDTH;
      return;
    } 
    if (this.x < 0) {
      this.x = 0;
      return;
    }

    if (this.y >= DANCE_FLOOR_HEIGHT) {
      this.y = DANCE_FLOOR_HEIGHT;
      return;
    }

    if (this.y < 0) {
      this.y = 0;
      return;
    }
  	
    // TODO: remove from here
    this.socket.emit('move', {id: this.id, x: this.x, y: this.y});

    this.el.style.left = this.x + 'px';
    this.el.style.top = this.y + 'px';
  };

  Gopher.prototype.randomMove = function() {
    this.move(Math.floor(Math.random() * 5), Math.floor(Math.random() * 5));
  };
