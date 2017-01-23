var vborder=20;

var paddle = [];
var ball = {};

var param;

var connect_id;
var connection_allowed=true;

var c;

/// SOCKET . IO
var socket = io();
socket.on('init', function(data) {
    if(data.id<0) {
        alert('Plus de places disponible :( ');
        connection_allowed=false;
    }
    console.log('init');

    connect_id = data.id;
    console.log('connect_id : '+connect_id);

    param = data.param;
    console.log(param);

    paddle = data.paddle;
    console.log(paddle);

    socket.emit('move',{paddle:paddle[connect_id], id:connect_id});
    println('My id : '+connect_id);
});

socket.on('ball infos', function(b) {
    //console.log(b);
    ball.x=b.x;
    ball.y=b.y;
});

socket.on('paddle pos', function(data) {
    if(data.disconnected)
        console.log('disconnected');
    paddle=data.paddle;
});


function setup() {
    c=createCanvas(500,500);

    ball.x=10;
    ball.y=10;
}

function draw() {
    if(typeof param == "undefined")
        return;

    background(0);
    fill(255);
    //console.log("a");
    for(var i=0;i<paddle.length;i++) {
        rect(paddle[i].x,paddle[i].y,param.pw,param.ph);
    }
    

    ellipse(ball.x,ball.y,param.bsize,param.bsize);
    /// Angle line
    /*push();
    stroke(255,0,0,200);
    translate(ball.x,ball.y);
    line(0,0,cos(ball.angle)*500,sin(ball.angle)*500);
    pop();*/
    ////////////

    /// <ball> paddle collision
    
    
}

function mouseMoved() {
    if(typeof param == "undefined")
        return;

    paddle[connect_id].vel=paddle[connect_id].x;
    paddle[connect_id].x=constrain(mouseX,0,width-param.pw);
    paddle[connect_id].vel-=paddle[connect_id].x;

    println("p:");
    console.log(paddle[connect_id])

    if(connection_allowed)
        socket.emit('move',{paddle:paddle[connect_id], id:connect_id});
}