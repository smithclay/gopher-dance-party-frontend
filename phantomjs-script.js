var page = require('webpage').create();
var url = 'http://gopher.dance/#autodance';

page.onError = function (msg, trace) {
    console.log(msg);
    trace.forEach(function(item) {
        console.log('  ', item.file, ':', item.line);
    });
};

page.onConsoleMessage = function(msg, lineNo, sourceId){
  console.log('browser console: ' + msg);
};

console.log('Opening: ', url);

page.open(url, function (status) {
  console.log('Page opened. Status: ', status);
  var danceKeys = [page.event.key.Right];
  var key = danceKeys[Math.floor(Math.random()*danceKeys.length)]

  const MAX_MOVES = 10;
  var moves = 0;

  setInterval(function() {
    if (moves > MAX_MOVES) {
     phantom.exit();
    }

    console.log('Busting a dance move!');
    page.sendEvent('keypress', key, null, null, null);
    page.sendEvent('keypress', key, null, null, null);
    page.sendEvent('keypress', key, null, null, null);
    page.sendEvent('keypress', key, null, null, null);
    page.sendEvent('keypress', key, null, null, null);
    page.sendEvent('keypress', page.event.key.B, null, null, null);

    moves = moves + 1;
  }, 1500);
});

