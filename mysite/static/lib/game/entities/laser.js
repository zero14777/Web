ig.module('game.entities.laser')
.requires('game.warplib', 'impact.sound', 'impact.entity', 'impact.entity-pool')
.defines(function() 
{
    SimpleLaser = ig.Entity.extend({
        target: {},
		parentShip: {},
		time: 0.4,
		game: {},
		laserLen: 0,
		moveRadius: 0,
		radius: 0,
		friendly: false,
		piercing: false,
		laserLen: 400,
		
		laserSFX: null,
 
		setup: function  (x, y, settings) {
			this.parentShip = settings.parentShip;

			this.game = settings.game;
			this.color = settings.color;

			this.target.x = settings.target.x;
			this.target.y = settings.target.y;
			this.damage = settings.damage;
			
			this.laserSFX = settings.laserSFX;
			this.laserSFX.play();
			if (settings.piercing) {
				this.piercing = settings.piercing;
			}
			
			this.friendly = false;
			if (settings.friendly) {
				this.friendly = settings.friendly;
			}

			this.laserLen = Math.sqrt (Math.pow(x - this.target.x, 2) + Math.pow(y - this.target.y, 2));
			
			this.time = 0.4;
			
			this.detectHit ();
		},
 
        init: function (x, y, settings) {
			this.parent (x, y, settings);
			this.setup (x, y, settings);
        },
		
		reset: function (x, y, settings) {
			this.parent	(x, y, settings);
			this.setup (x, y, settings);
        },
		
		entHit: function (ent, slope, yint) {
			var entx = (ent.pos.x + ent.size.x/2);
			var enty = (ent.pos.y + ent.size.y/2);
			
			var xclose = (entx + slope * enty - slope * yint) / (Math.pow (slope, 2) + 1);
			var yclose = slope * xclose + yint;
			
			var xcompare = (this.pos.x - this.target.x) * (this.pos.x - xclose);
			var ycompare = (this.pos.y - this.target.y) * (this.pos.y - yclose);
			
			if (xcompare < 0 || ycompare < 0) {
				
				return false;
			}
			
			var entsize = ent.radius;
			
			if (inRange(entx, xclose, enty, yclose, entsize) && 
				inRange(this.pos.x, xclose, this.pos.y, yclose, this.laserLen + ent.radius))
			{
				if (!this.piercing) {
					this.target.x = xclose;
					this.target.y = yclose;
					this.laserLen = getRange (this.pos.x, xclose, this.pos.y, yclose);
				}
				return true;
			}
			return false;
		},
		
		detectHit: function () {
			var slope = (this.pos.y - this.target.y) / (this.pos.x - this.target.x);
			var yint = this.pos.y - slope * this.pos.x;
			var entities = this.game.entities;
			var target = {};

			for (var i = 0; i < entities.length; i++) {
				var ent = entities[i];
				if (this === ent || this.parentShip === ent || (this.friendly && ent.friendly) || (!this.friendly && !ent.friendly)) {
					continue;
				}
				if (this.entHit(ent, slope, yint)) {
					
					if (!this.piercing) {
						target = ent;
					}
					else {
						entHit(ent, this.damage);
					}
				}
			}
			if (!this.piercing && target !== {}) {
				entHit(target, this.damage);
			}
			
			
		},
 
        update: function () {
			this.time -= 1.0 / FPS;
			if (this.time <= 0) {
				this.kill();
			}

			this.pos.x = this.parentShip.pos.x + this.parentShip.radius;
			this.pos.y = this.parentShip.pos.y + this.parentShip.radius;
			
			this.parent();
        },

        draw: function () {
			var startX = ig.system.getDrawPos(this.pos.x - ig.game.screen.x);
			var startY = ig.system.getDrawPos(this.pos.y - ig.game.screen.y);
				
			var endX = ig.system.getDrawPos(this.target.x - ig.game.screen.x);
			var endY = ig.system.getDrawPos(this.target.y - ig.game.screen.y);
			
			var grd = laserGrd (startX, startY, endX, endY, this.color);
				
			ig.system.context.strokeStyle = grd;
			ig.system.context.lineWidth = 4;
			ig.system.context.beginPath();
			ig.system.context.moveTo(startX, startY);
			ig.system.context.lineTo(endX, endY);
			ig.system.context.stroke();
			ig.system.context.closePath();

			this.parent();
        }
    });
	
	ig.EntityPool.enableFor (SimpleLaser);
});
