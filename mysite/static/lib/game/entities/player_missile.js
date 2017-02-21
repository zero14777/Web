ig.module('game.entities.player_missile')
.requires('impact.entity', 'game.entities.pathing_entities', 'game.aStar', 'game.warplib', 'game.entities.enemy_destroyed_A', 'impact.sound', 'impact.entity-pool')
.defines(function()
{
    playerMissile = ig.Entity.extend(
    {
		name: "PMISSILE",
		size: {x: 10, y: 10},
		type: ig.Entity.TYPE.A,
		offset: {x: 2, y: -2},
		checkAgainst: ig.Entity.TYPE.A,
		damage: 0,
		radius: 5,
		moveRadius: 50,
		pathRadius: 30,
		missileSpeed: 200,
		missileAccel: 700,
		explosionSFX: new ig.Sound('media/sounds/missileExplosion.*'),
		zIndex: -3000,
		target: null,
		
        animSheet: new ig.AnimationSheet ('media/friendlymissile.png', 14, 6),
        init: function (x, y, settings) {
			this.addAnim ('blob', 0.1, [0]);
		
			this.game = settings.game;
			this.target = settings.target;
			this.damage = settings.damage;
			this.armor = 300;
				
			this.parent (x, y, settings);
			this.maxVel.x = this.missileSpeed;
			this.maxVel.y = this.missileSpeed;
		},

			
		rotate: function () {
				
			var xDiff = -this.target.pos.x - this.target.size.x + this.pos.x + this.size.x;

			var yDiff = -this.target.pos.y - this.target.size.y + this.pos.y + this.size.y;

			var angle = Math.atan(yDiff / xDiff);
				
			if (xDiff < 0) {
				angle += Math.PI;

			}

			this.currentAnim.angle = angle;

		},
			
		update: function () {
			if(this.target.isDead || !this.target) {
				this.findTarget();
			}
			if(this.target){
			this.rotate();
			this.move();
			}
			this.parent();
		},

		move: function () {
			if (this.pos.x + (this.size.x/2) < this.target.pos.x + (this.target.size.x/4)){
				this.accel.x = this.missileAccel;
			} else
			if (this.pos.x + (this.size.x/2) > this.target.pos.x + (this.target.size.x*3/4)){
				this.accel.x = -this.missileAccel;
			} else
			{
				this.accel.x = 0;
			}
			if (this.pos.y + (this.size.y/2) < this.target.pos.y + (this.target.size.y/4)){
				this.accel.y = this.missileAccel;
			} else
			if (this.pos.y + (this.size.y/2) > this.target.pos.y + (this.target.size.y*3/4)){
				this.accel.y = -this.missileAccel;
			} else
			{
				this.accel.y = 0;
			}
		},

		check: function ( other ){
			if(other.name === "ENEMY"){
				entHit(other, this.damage);
				this.explode();
			} else
			if(other.name === "ASTEROID"){
				this.explode();
			}
		},

		findTarget: function () {
			var target = false;
			var closest = 10000;
			var enemies = this.game.getEntitiesByType ('Enemies');
			for (var i = 0; i < enemies.length; i++) {
				var ent = enemies[i];
				if (ent === this) {
					continue;
				}
				var range = getRange (this.pos.x, ent.pos.x, this.pos.y, ent.pos.y);
				if (range < closest) {
					target = ent;
					closest = range;
				}
			}
			this.target = target;
		},

		explode: function () {
			this.timer = 10.0;
			this.explosionSFX.play();
			//ig.game.spawnEntity(explosion, this.pos.x, this.pos.y, null);
			this.kill();
		}
    });

	ig.EntityPool.enableFor (playerMissile);
});

