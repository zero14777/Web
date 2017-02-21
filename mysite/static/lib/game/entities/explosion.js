ig.module('game.entities.explosion')
.requires('impact.entity', 'game.warplib', 'impact.entity-pool')
.defines(function()
{
    explosion = ig.Entity.extend(
    {
		name: "boom",
		//value: 50,
		//shield: 10000000.0,
		//size: {x: 32, y: 32},
		radius: 0,
		moveRadius: 0,
		zIndex: 10000,
		timer: 0.5,
		
        animSheet: new ig.AnimationSheet ('media/explosion.png', 54, 54),

        init: function (x, y, settings) {
			this.game = settings.game;
			this.addAnim ('boom', 0.01, [0, 1, 2]);
			
			this.timer = 0.5;
			
			this.parent (x, y, settings);
		},
        
        
        update: function () {
			this.timer -= 1.0 / FPS;
			this.anims.boom.update();
			if(this.timer <= 0){
				this.timer = 1.0;
				this.kill();
			}
		}
    });

	ig.EntityPool.enableFor (explosion);
});