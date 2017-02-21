ig.module ('game.entities.testship').requires ('game.warplib', 'impact.entity').defines (function()
{
	TestShip = ig.Entity.extend(
	{
		angle: 0.0,
		
		
		animSheet: new ig.AnimationSheet ('media/ball.png', 32, 32),
		
		init: function (x, y, settings) {
			this.addAnim ('blob', 0.1, [0]);
			
			this.friction.x = 10;
			this.friction.y = 10;
			
			this.parent (x, y, settings);
		},
		
		hit: function () {
			console.log ("ouch");
			this.angle += 120;
		},
		
		update: function () {
			this.currentAnim.angle = this.angle * Math.PI / 180;
			this.parent();
		}
		
		
	});
	

});
