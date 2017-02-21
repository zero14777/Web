ig.module('game.entities.enemy_destroyed_A')
.requires('impact.entity', 'game.warplib')
.defines(function()
{
    destroyedEnemyA = ig.Entity.extend(
    {
		name: "MATERIALS",
		value: 50,
		shield: 10000000.0,
		size: {x: 12, y: 12},
		type: ig.Entity.TYPE.A,
		radius: 0,
		moveRadius: 0,
		zIndex: -1000,
		accelRate: 500,
		collectRadius: 200,
		
        animSheet: new ig.AnimationSheet ('media/materials.png', 16, 16),

        init: function (x, y, settings) {
          	  	this.addAnim ('blob', 0.1, [0]);

			this.parent (x, y, settings);

			this.game = settings.game;
			this.value = settings.value;
			
			this.friction.x = 50;
			this.friction.y = 50;
			this.maxVel.x = 200;
			this.maxVel.y = 200;
		},
        
        
        update: function () {
			if(Math.sqrt(Math.pow((this.pos.x + this.size.x - this.game.player.pos.x - (this.game.player.size.x/2)), 2) +
				Math.pow((this.pos.y + this.size.y - this.game.player.pos.y - (this.game.player.size.y/2)), 2)) < 
				(this.collectRadius)){
				this.move();
			} else {
				this.accel.x = 0;
				this.accel.y = 0;
			}
			this.parent();
		},

	move: function () {
		if (this.pos.x + (this.size.x/2) < this.game.player.pos.x + (this.game.player.size.x/4)){
			this.accel.x = this.accelRate;
		} else
		if (this.pos.x + (this.size.x/2) > this.game.player.pos.x + (this.game.player.size.x*3/4)){
			this.accel.x = -this.accelRate;
		} else
		{
			this.accel.x = 0;
		}
		if (this.pos.y + (this.size.y/2) < this.game.player.pos.y + (this.game.player.size.x/4)){
			this.accel.y = this.accelRate;
		} else
		if (this.pos.y + (this.size.y/2) > this.game.player.pos.y + (this.game.player.size.x*3/4)){
			this.accel.y = -this.accelRate;
		} else
		{
			this.accel.y = 0;
		}
	}
    });
});

