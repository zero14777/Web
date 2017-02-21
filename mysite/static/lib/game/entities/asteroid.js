ig.module('game.entities.asteroid')
.requires('impact.entity', 'game.warplib')
.defines(function()
{
    Asteroid = ig.Entity.extend(
    {
		name: "ASTEROID",
		shield: 10000000.0,
		size: {x: 32, y: 32},
		type: ig.Entity.TYPE.A,
		radius: 16,
		moveRadius: 40,
		pathRadius: 20,
		zIndex: -1000,
		damage: 1000,
		
        animSheet: new ig.AnimationSheet ('media/ball.png', 32, 32),

        init: function (x, y, settings) {
            this.addAnim ('blob', 0.1, [0]);
			
			this.game = settings.game;
			
            this.parent (x, y, settings);
			this.vel.x = settings.vel.x;
			this.vel.y = settings.vel.y;
		},
        
        
        update: function () {
			this.parent();
		}
    });
});

