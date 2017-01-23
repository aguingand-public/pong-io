const INFERIEUR_A=0, SUPERIEUR_A=1;

var cos = Math.cos, sin = Math.sin;

function Ball(posx,posy,angle,vel) {
    
    this.x=posx;
    this.y=posy;
    this.angle=angle;
    this.vel=vel;

    this.updateVel();
};


Ball.prototype.updateVel = function() {
    this.vx=cos(this.angle)*this.vel;
    this.vy=sin(this.angle)*this.vel;
};

Ball.prototype.setAngle = function(a) {
    this.angle = a;
    this.updateVel();
};

Ball.prototype.touchX = function(posToTouch,comp,callback) {
    if(comp==INFERIEUR_A&&this.x<posToTouch) {
        this.x=posToTouch;
    }
    else if(comp==SUPERIEUR_A&&this.x>posToTouch) {
        this.x=posToTouch;
    }
    else return;
    
    typeof callback === 'function' && callback();
    this.updateVel();
};

Ball.prototype.touchY = function(posToTouch,comp,callback) {
    if(comp==INFERIEUR_A&&this.y<posToTouch) {
        this.y=posToTouch;
    }
    else if(comp==SUPERIEUR_A&&this.y>posToTouch) {
        this.y=posToTouch;
    }
    else return;

    typeof callback === 'function' && callback();
    this.updateVel();
};

module.exports = { Ball:Ball, INFERIEUR_A:INFERIEUR_A, SUPERIEUR_A:SUPERIEUR_A }