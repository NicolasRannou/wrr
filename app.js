var express = require('express');
var app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , webRTC = require('webrtc.io').listen(server);

server.listen(9007);

//get all files of interest
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

// css
app.get('/css/wrr.css', function(req, res) {
  res.sendfile(__dirname + '/css/wrr.css');
});
app.get('/css/welcomeRoom.css', function(req, res) {
  res.sendfile(__dirname + '/css/welcomeRoom.css');
});
app.get('/css/readingRoom.css', function(req, res) {
  res.sendfile(__dirname + '/css/readingRoom.css');
});

// js
app.get('/js/wrr.js', function(req, res) {
  res.sendfile(__dirname + '/js/wrr.js');
});
//app.get('/js/welcomeRoom.js', function(req, res) {
//  res.sendfile(__dirname + '/js/welcomeRoom.js');
//});
//app.get('/js/readingRoom.js', function(req, res) {
//  res.sendfile(__dirname + '/js/readingRoom.js');
//});
app.get('/webrtc.io.js', function(req, res) {
  res.sendfile(__dirname + '/webrtc.io.js');
});


// some logic on connection
io.sockets.on('connection', function(socket) {
  socket.emit('message', {data: "Please enter a username..."});
  
  var username;
  socket.on('message', function(msg) {
    if (!username) {
      username = msg.data;
      socket.broadcast.emit('message', {data:'<b>'+msg.data+' has entered the zone...</b>'});
      return;
    }
    socket.emit('message', {data:'<b>'+username+':</b> '+msg.data});
    socket.broadcast.emit('message', {data:'<b>'+username+':</b> '+msg.data});
  });
  
  socket.on('sync', function(msg) {
    socket.broadcast.emit('synch', {data: msg.data});
  });
  
  socket.on('disconnect', function() {
    socket.broadcast.emit('message', {data:'<b>'+username+' has left the zone...</b>'});
  });
});
