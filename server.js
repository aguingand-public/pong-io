console.log("Server lauched !");

var url = require('url');
var fs=require('fs');
var http = require('http');

var server = http.createServer();

var io = require('socket.io')(server);

// ball module
var pong = require('./pong.js');


var paddle = [];

var param = {
  width:500, height:500,
  bsize:12,
  pw:60, ph:10
}

var PI=Math.PI, HALF_PI=PI/2.0;

var ball = new pong.Ball(param.width/2,param.height/2, -PI+HALF_PI/2, 4.5);


function constrain(val, min, max) {
      return (val > min) ? ((val < max) ? val : max) : min;
}
var atan2 = Math.atan2;

var loop = function() {
  io.emit('ball infos', {x:ball.x, y:ball.y});

  ball.x+=ball.vx;
  ball.y+=ball.vy;

  ball.touchX(param.bsize/2,pong.INFERIEUR_A,function() {
        var int=(ball.angle-PI)*2;
        ball.angle-=PI+int;
  });
  ball.touchX(param.width-param.bsize/2,pong.SUPERIEUR_A, function() {
      var int=(ball.angle-PI)*2;
      ball.angle+=PI-int;
  });
  ball.touchY(param.bsize/2,pong.INFERIEUR_A, function() {
      var int=(ball.angle-HALF_PI)*2;
      ball.angle+=PI-int;
  });

  if(ball.y+param.bsize/2>param.height) {
      ball.x=param.width/2;
      ball.y=param.height/2;
      ball.setAngle(PI+0.2);
  }

  for(var i=0;i<paddle.length;i++) {
      if(typeof paddle[i] === "undefined")
        continue;
      if(ball.x>paddle[i].x&&ball.x<paddle[i].x+param.pw) {
          ball.touchY(paddle[i].y-param.bsize/2,pong.SUPERIEUR_A, function() {

              var int=(ball.angle-HALF_PI)*2;
              ball.angle-=PI+int;
          });
      }
    }

}
var connection_count=0;

io.on('connection', function(socket) {
  console.log('connect');
  console.log(socket.id);
  
  if(connection_count == 0)
    setInterval(loop,20); // lancement de la boucle 'ball' lors de la première connexion

  //console.log('id = '+id);
  paddle.push({ 
    x : param.width/2,
    y : param.height - param.ph -10
  });
  
  var connect_id = connection_count;
  socket.emit('init', {id:connect_id, param:param, paddle:paddle});
  console.log('init emit');
  connection_count++;
  
  socket.on('move', function(data) {

    paddle[data.id] = {
      x : data.paddle.x,
      y : data.paddle.y
    }

    socket.broadcast.emit('paddle pos', {paddle:paddle});
  });

  socket.on('disconnect', function() {
    console.log('one client disconnected');
    socket.broadcast.emit('paddle pos', {paddle:paddle});
  });
});

server.on('request', function(req, res) {
   var matches;
   var pathname = url.parse(req.url).pathname;
   if(pathname=='/') {
     fs.readFile('client.html','utf8',function(error,content) {
       if(error) {
          res.writeHead(404, {'Content-Type' : 'text/plain'});
          res.write('index.html not found');
          res.end();
        }
        else {
          res.writeHead(200, {'Content-Type':'text/html'});
          res.write(content);
          res.end();
        }
    });
   }
   else if(matches = pathname.match(/^\/assets\/(.+\.([a-z0-9]+))$/)) {
      fs.readFile('assets/'+matches[1],'utf8', function(error,content) {
        if(error) {
          res.writeHead(404, {'Content-Type' : 'text/plain'});
          res.write('pathname not found');
          console.log("error on assets");
          res.end();
        }
        else {
          var mimetype = 'text/plain';
          if(matches[2] == 'css')
            mimetype = 'text/css';
          else if(matches[2] == 'js')
            mimetype = 'application/javascript';
          res.writeHead(200, {'Content-Type':mimetype});
          res.write(content);
          res.end();
        }
      });
   }/*
   else {
     res.writeHead(404,{'Content-Type':'text/plain'});
     res.write('page not found');
     res.end();
   }*/
});

server.listen(1996, function() {
  console.log('Listening on port 1996');
});