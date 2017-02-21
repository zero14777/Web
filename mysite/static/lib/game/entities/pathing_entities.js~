ig.module ('game.entities.pathing_entities')
.requires ('impact.entity')
.defines (function()
{
    Pathable = ig.Entity.extend(
    {
        armor: 1,
        shield: 100.0,
		
		isTakingDamage: 0.0,
		shieldStrength: 10,
		pathRecalc: null, 
		isDead: false,
		
		acceleration: 100,

        angle: 0.0,
        destX: 0,
        destY: 0,

        path: [{
            x: 0,
            y: 0
        }],
		newpath: false,
		game: {},
		friendly: false,

        
        init: function (x, y, settings) {
            this.friction.x = 1;
            this.friction.y = 1;
		this.pathRecalc = 1.0 + Math.random();
						
            this.parent (x, y, settings);
        },
        
		redefinePath: function () {
			var skipnewpath = false;
			if(Math.sqrt(Math.pow((this.pos.x + (this.size.x/2) - this.game.player.pos.x - (this.game.player.size.x/2)), 2) +
				Math.pow((this.pos.y + (this.size.y/2) - this.game.player.pos.y - (this.game.player.size.y/2)), 2)) > 
				1000){
				skipnewpath = true;
				this.path = new Array();
				this.path.push({x: this.game.player.pos.x, y: this.game.player.pos.y});
			}
			if(!skipnewpath){
				var newpath = pathFinding(this, this.game.entities);
				if(!(newpath.length < 2)) {
					this.path = newpath;
				} else
				if(this.path.length < 1) {
					this.path = newpath;
				}
			}
		},
		
        update: function () {
			rechargeShields (this);
			this.pathRecalc -= 1.0 / FPS;
			if (this.pathRecalc < 0) {
				this.redefinePath();
				this.pathRecalc = 1.0;
			}
			this.parent();
		},
        
        move: function (){
			if(this.path[0].x < this.pos.x + this.radius &&
			   this.path[0].x >= this.pos.x - this.radius &&
			   this.path[0].y < this.pos.y + this.radius &&
			   this.path[0].y >= this.pos.y - this.radius)
			{
				this.path.splice(0, 1);
				if(this.path.length === 0) {
					return true;
				}
			}

			//handle ship movement manually for now
			//it looks bad but the accel method needs a lot of work to operate correctly
			if (this.pos.x < this.path[0].x){
				this.accel.x = this.acceleration;
			}
			if (this.pos.x > this.path[0].x){
				this.accel.x = -this.acceleration;
			}
			if (this.pos.y < this.path[0].y){
				this.accel.y = this.acceleration;
			}
			if (this.pos.y > this.path[0].y){
				this.accel.y = -this.acceleration;
			}

			return false;
		}
	});
});
