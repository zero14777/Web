ig.module('game.entities.enemy_missile')
.requires('impact.entity', 'game.entities.pathing_entities', 'game.aStar', 'game.warplib', 'game.entities.enemy_destroyed_A', 'impact.sound', 'impact.entity-pool')
.defines(function()
{
    enemyMissile = ig.Entity.extend(
    {
	name: "EMISSILE",
	size: {x: 10, y: 10},
	type: ig.Entity.TYPE.A,
	offset: {x: 0, y: 0},
	checkAgainst: ig.Entity.TYPE.A,
	damage: 0,
	radius: 10,
	moveRadius: 50,
	pathRadius: 30,
	missileSpeed: 150,
	missileAccel: 300,
	explosionSFX: new ig.Sound('media/sounds/missileExplosion.*'),
	zIndex: -3000,
	target: null,

		
        animSheet: new ig.AnimationSheet ('media/enemymissile.png', 10, 10),
        init: function (x, y, settings) {
            	this.addAnim ('blob', 0.1, [0]);
		
		this.game = settings.game;
            	this.target = this.game.player;
		this.damage = settings.damage;
		this.armor = 40;

		this.friction.x = 200;
		this.friction.y = 200;
			
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
		if(!this.target.isDead){
			this.rotate();
			this.move();
		}
		this.parent();
	},

        move: function () {
		if (this.pos.x + (this.size.x/2) < this.game.player.pos.x + (this.game.player.size.x/4)){
			this.accel.x = this.missileAccel;
		} else
		if (this.pos.x + (this.size.x/2) > this.game.player.pos.x + (this.game.player.size.x*3/4)){
			this.accel.x = -this.missileAccel;
		} else
		{
			this.accel.x = 0;
		}
		if (this.pos.y + (this.size.y/2) < this.game.player.pos.y + (this.game.player.size.x/4)){
			this.accel.y = this.missileAccel;
		} else
		if (this.pos.y + (this.size.y/2) > this.game.player.pos.y + (this.game.player.size.x*3/4)){
			this.accel.y = -this.missileAccel;
		} else
		{
			this.accel.y = 0;
		}
	},

	check: function ( other ){
		if(other.name === "PLAYER"){
			entHit(other, this.damage);
			this.explode();
		} else
		if(other.name === "ASTEROID"){
			this.explode();
		}
	},

	explode: function () {
		this.explosionSFX.play();
		//ig.game.spawnEntity(explosion, this.pos.x, this.pos.y, null);
		this.kill();
	}
    });

	ig.EntityPool.enableFor (enemyMissile);
});

