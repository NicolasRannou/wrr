// Create the cube
createCube = function() {
  // create and initialize a 3D renderer
  var r = new X.renderer3D();
  r.container = '3d';
  r.init();
  // create a cube
  cube = new X.cube();
  // setting the edge length can also be skipped since 20 is the default
  cube.lengthX = cube.lengthY = cube.lengthZ = 20;
  // can also be skipped since [0,0,0] is the default center
  cube.center = [ 0, 0, 0 ];
  // [1,1,1] (== white) is also the default so this can be skipped aswell
  cube.color = [ 0.45, 0.92, 0.48 ];
  r.add(cube); // add the cube to the renderer
  r.render(); // ..and render it
  return r;
};

// Create the connection
createConnections = function(socket, renderer) {
  // on connect
  socket.on('connect', function() {
    $('#messages').append('<li>Connected to the server.</li>');
  });
  // on message
  socket.on('message', function(data) {
    $('#messages').append('<li>' + data.data + '</li>');
  });
  socket.on('synch', function(data) {
    var arr = new Float32Array($.map(data.data, function(value, key) {
      return value;
    }));
    renderer.camera.view = arr;
    renderer.render();
  });
  socket.on('disconnect', function() {
    $('#messages').append('<li>Disconnected from the server.</li>');
  });
  $('#target').submit(function() {
    var message = $('#messageText').val();
    socket.emit('message', {
      data : message
    });
    $('#messageText').val('');
    return false;
  });
  var push = false;
  renderer.interactor.onMouseUp = function(e) {
    push = false;
  };
  renderer.interactor.onMouseDown = function(e) {
    push = true;
  };
  renderer.interactor.onMouseMove = function(e) {
    if (push) {
      socket.emit('sync', {
        data : Array.apply([], renderer.camera.view)
      });
    }
  };
};

$(document).ready(function() {
  // Create the cube
  // connect push event as well
  var renderer = createCube();
  // create the socket connection
  var socket = io.connect(window.location.href);
  // connect the events
  createConnections(socket, renderer);
});