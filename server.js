var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res){
res.sendFile(__dirname + '/public/server.html');
});


io.on('connection', function(socket){
  console.log('user connected');
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(msg));
    document.getElementById("messages").appendChild(li);
   });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


http.listen(4000, function(){
  console.log('listening on *:4000');
});
