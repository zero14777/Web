ig.module('game.entities.smallLaser')
.requires('game.warplib', 'impact.sound', 'impact.entity', 'impact.entity-pool')
.defines(function() 
{
   SmallLaser = ig.Entity.extend({
        target: {},
		parentShip: {},
		game: {},
		angle: 0,
		laserLen: 10,
		damage: 50,
		moveRadius: 0,
		radius: 0,
		stop: {},
		smallLaserSFX: null,
		friendly: false,
 
		setup: function  (x, y, settings) {
			this.parentShip = settings.parentShip;

			this.game = settings.game;
			this.color = settings.color;

			this.target.x = settings.target.x;
			this.target.y = settings.target.y;
			this.damage = settings.damage;
			
			this.angle = Math.atan((this.target.y - this.pos.y) / (this.target.x - this.pos.x));
			if (this.target.x - this.pos.x < 0) {
				this.angle += Math.PI;
			}
			this.friendly = false;
			if (settings.friendly) {
				this.friendly = settings.friendly;
			} 

			this.smallLaserSFX = settings.smallLaserSFX;
			this.smallLaserSFX.play();
			
			this.stop.x = this.pos.x + Math.cos(this.angle) * 10;
			this.stop.y = this.pos.y + Math.sin(this.angle) * 10;
		},
 
        init: function (x, y, settings) {
			this.parent(x,y,settings);
			this.setup (x, y, settings);
        },
		
		reset: function (x, y, settings) {
			this.parent(x, y, settings);
			this.setup (x, y, settings);
		},
		
		entHit: function (ent) {
			var entx = (ent.pos.x + ent.size.x/2);
			var enty = (ent.pos.y + ent.size.y/2);
			
			if (inRange(entx, this.stop.x, enty, this.stop.y, ent.radius)) {
				return true;
			}
			
			return false;
		},
		
		detectHit: function () {
			var entities = this.game.entities;

			for (var i = 0; i < entities.length; i++) {
				var ent = entities[i];
				if (this === ent || this.parentShip === ent || (this.friendly && ent.friendly) || (!this.friendly && !ent.friendly)) {
					continue;
				}
				if (this.entHit(ent)) {
					entHit(ent, this.damage);
					this.kill();
				}
			}
		},
		
		move: function () {
			var xChange = Math.cos(this.angle) * 10;
			var yChange = Math.sin(this.angle) * 10;
			this.pos.x += xChange;
			this.pos.y += yChange;
			this.stop.x += xChange;
			this.stop.y += yChange;
			if (inRange(this.target.x, this.stop.x, this.target.y, this.stop.y, 5)) {
				this.kill();
			}
		},
 
        update: function () {
			this.detectHit();
			this.move();
			
			this.parent();
        },

        draw: function () {
			var startX = ig.system.getDrawPos(this.pos.x - ig.game.screen.x);
			var startY = ig.system.getDrawPos(this.pos.y - ig.game.screen.y);
				
			var endX = ig.system.getDrawPos(this.stop.x - ig.game.screen.x);
			var endY = ig.system.getDrawPos(this.stop.y - ig.game.screen.y);
				
			ig.system.context.strokeStyle = this.color;
			ig.system.context.lineWidth = 2;
			ig.system.context.beginPath();
			ig.system.context.moveTo(startX,startY);
			ig.system.context.lineTo(endX,endY);
			ig.system.context.stroke();
			ig.system.context.closePath();

			this.parent();
        }
    });
	
	ig.EntityPool.enableFor (SmallLaser);
});
