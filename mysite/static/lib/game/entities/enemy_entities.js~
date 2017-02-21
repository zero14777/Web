ig.module ('game.entities.enemy_entities')
.requires ('impact.entity', 'game.entities.pathing_entities', 'game.entities.explosion')
.defines (function()
{
    Enemies = Pathable.extend(
    {
        maxArmor: 1,
		
        init: function (x, y, settings) {
			this.maxArmor = this.armor;
			console.log (this.maxArmor + ":   " + this.armor);
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
		
		draw: function () {
			this.parent();
			
			barPosX = this.pos.x + this.size.x / 5 + 5 - ig.game.screen.x;
			barPosY = this.pos.y + this.size.y + 15 - ig.game.screen.y;
			
			var shieldStyle = ig.system.context.createLinearGradient(barPosX, barPosY, barPosX + 10, barPosY + 10);
			shieldStyle.addColorStop(0,"cyan");
			shieldStyle.addColorStop(1,"blue");
			var armorStyle = ig.system.context.createLinearGradient(barPosX, barPosY + 5, barPosX + 10, barPosY + 5);
			armorStyle.addColorStop(0,"red");
			armorStyle.addColorStop(.4,"orange");
			armorStyle.addColorStop(1, "green");
		
			if (this.isTakingDamage > 0) {
				drawOutline (barPosX, barPosY - 1, 20, 2, shieldStyle);
				drawBar (barPosX, barPosY, barPosX + this.shield / 5, barPosY, shieldStyle, 2);
				drawBar (barPosX + this.shield / 5, barPosY, barPosX + 20, barPosY, "black", 2);
				
				if (this.shield <= 0) {
					var armor = this.armor / this.maxArmor * 20;
				
					drawOutline (barPosX, barPosY + 4, 20, 2, armorStyle);
					drawBar (barPosX, barPosY + 5, barPosX + armor, barPosY + 5, armorStyle, 2);
					drawBar (barPosX + armor, barPosY + 5, barPosX + 20, barPosY + 5, "black", 2);
				}
			}
			else if (this.shield < 100) {
				drawOutline (barPosX, barPosY - 1, 20, 2, shieldStyle);
				drawBar (barPosX, barPosY, barPosX + this.shield / 5, barPosY, shieldStyle, 2);
				drawBar (barPosX + this.shield / 5, barPosY, barPosX + 20, barPosY, "black", 2);
			}
		},
		
        update: function () {
			this.parent();
		},
		
		check: function ( other ){
			//if(other.name === "ENEMY"){
				//other.explode();
				//this.explode();
				//this.redefinePath();
			//} else
			if(other.name === "ASTEROID"){
				this.explode();
			}
		},



		explodeNoDrop: function() {
			this.explosionSFX.play();
			ig.game.spawnEntity(explosion, this.pos.x + ((this.size.x - 54)/2), this.pos.y + ((this.size.y - 54)/2), {game: this.game});
			this.isDead = true;
			this.kill();
		},

		explode: function () {
			ig.game.spawnEntity(destroyedEnemyA, this.pos.x + ((this.size.x - 16)/2), this.pos.y + ((this.size.y - 16)/2), {game: this.game, value: this.value});
			this.explosionSFX.play();
			ig.game.spawnEntity(explosion, this.pos.x + ((this.size.x - 54)/2), this.pos.y + ((this.size.y - 54)/2), {game: this.game});
			this.isDead = true;
			this.kill();
		}
	});
});
