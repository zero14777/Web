ig.module('game.entities.fighter')
.requires('impact.entity', 'game.entities.pathing_entities', 'game.aStar', 'game.warplib', 'game.entities.enemy_entities', 'impact.sound')
.defines(function()
{
    Fighter = Pathable.extend(
    {
		name: "FIGHTER",
		size: {x: 10, y: 10},
		type: ig.Entity.TYPE.A,
		checkAgainst: ig.Entity.TYPE.A,
		//bounciness: 1,
		//collides: ig.Entity.COLLIDES.ACTIVE,
		collisionDmg: 0,
		radius: 12,
		target: {},
		pathRadius: 0,
		moveRadius: 0,
		circleRange: 100, //distance in pixels that the ship will try to stay from the player
		laserSFX: new ig.Sound('media/sounds/fighterSmallLaser.*'),
		explosionSFX: new ig.Sound('media/sounds/fighterExplosion.*'),
		zIndex: 100000,
		fuel: 3000,
		
		maxArmor: 0,
		
		weapons: [{damage: 5, range: 200, reload: 0.5, charge: 0, delay: 0.0001, fire: 1.0, target:{x: 0, y: 0}}],
		
        animSheet: new ig.AnimationSheet ('media/ball.png', 10, 10),
        init: function (x, y, settings) {
            this.addAnim ('blob', 0.1, [0]);
			
			this.game = settings.game;
			this.armor = settings.armor;
			this.maxArmor = settings.armor;
			
			this.weapons[0].damage = settings.damage;
			this.friendly = true;
            
			this.shieldStrength = 0.000000001;
			this.target = settings.target;
			this.acceleration = 400;
			
            this.parent (x, y, settings);
			this.maxVel.x = 200;
			this.maxVel.y = 200;
			
            this.findDestination();
		},
        
		rotate: function () {
			var xDiff = -this.game.player.pos.x - this.game.player.size.x + this.pos.x + this.size.x;
			var yDiff = -this.game.player.pos.y - this.game.player.size.y + this.pos.y + this.size.y;
			var angle = Math.atan(yDiff / xDiff);
			if (xDiff < 0) {
				angle += Math.PI;
			}
			
			this.currentAnim.angle = angle;
		},
        
        update: function () {
			if (!this.target || this.target.pos === undefined || this.target === this.game.player || this.target.isDead) {
				this.findTarget();
				this.findDestination();
			}
			this.newpath = this.move();
            if (this.newpath) {
                this.findDestination();
			}
			if (this.target.pos !== undefined) {
				this.fire();
			}
			//this.rotate();
			this.fuel--;
			if (this.fuel < 0) {
				this.explode();
			}
			this.parent();
		},
		
		draw: function () {
			this.parent();
			
			barPosX = this.pos.x + this.size.x / 5 + 2 - ig.game.screen.x;
			barPosY = this.pos.y + this.size.y - ig.game.screen.y;
			
			var shieldStyle = ig.system.context.createLinearGradient(barPosX, barPosY, barPosX + 5, barPosY + 10);
			shieldStyle.addColorStop(0,"cyan");
			shieldStyle.addColorStop(1,"blue");
			var armorStyle = ig.system.context.createLinearGradient(barPosX, barPosY + 5, barPosX + 5, barPosY + 5);
			armorStyle.addColorStop(0,"red");
			armorStyle.addColorStop(.4,"orange");
			armorStyle.addColorStop(1, "green");
		
			if (this.isTakingDamage > 0) {
				/*drawOutline (barPosX, barPosY - 1, 5, 2, shieldStyle);
				drawBar (barPosX, barPosY, barPosX + this.shield / 20, barPosY, shieldStyle, 2);
				drawBar (barPosX + this.shield / 20, barPosY, barPosX + 5, barPosY, "black", 2);*/
				
				if (this.shield <= 0) {
					var armor = this.armor / this.maxArmor * 5;
				
					drawOutline (barPosX, barPosY + 4, 5, 2, armorStyle);
					drawBar (barPosX, barPosY + 5, barPosX + armor, barPosY + 5, armorStyle, 2);
					drawBar (barPosX + armor, barPosY + 5, barPosX + 5, barPosY + 5, "black", 2);
				}
			}
			/*else if (this.shield < 100) {
				drawOutline (barPosX, barPosY - 1, 5, 2, shieldStyle);
				drawBar (barPosX, barPosY, barPosX + this.shield / 20, barPosY, shieldStyle, 2);
				drawBar (barPosX + this.shield / 20, barPosY, barPosX + 5, barPosY, "black", 2);
			}*/
		},
		
		fire: function () {
			var targetx = this.target.pos.x;
			var targety = this.target.pos.y;
			if (!inRange(this.pos.x, targetx, this.pos.y, targety, this.weapons[0].range)) {
				var enemies = this.game.getEntitiesByType ('Enemies');
				for (var i = 0; i < enemies.length; i++) {
					var ent = enemies[i];
					if (inRange(this.pos.x, ent.pos.x, this.pos.y, ent.pos.y, this.weapons[0].range)) {
						targetx = ent.pos.x;
						targety = ent.pos.y;
						break;
					}
				}
			}
			
			if (inRange(this.pos.x, targetx, this.pos.y, targety, this.weapons[0].range) && this.weapons[0].charge <= 0) {
				this.weapons[0].fire = this.weapons[0].delay;
				this.weapons[0].target.x = targetx + Math.random() * 40 - 20;
				this.weapons[0].target.y = targety + Math.random() * 40 - 20;
				this.weapons[0].charge = this.weapons[0].reload;
			}
			if (this.weapons[0].charge > 0) {
				this.weapons[0].charge -= 1 / FPS;
			}
			if (this.weapons[0].fire <= this.weapons[0].delay) {
				this.weapons[0].fire -= 1 / FPS;
			}
			if (this.weapons[0].fire <= 0) {
				this.weapons[0].fire = this.weapons[0].delay * 2;
				var settings = {parentShip:this, damage:this.weapons[0].damage, friendly: this.friendly,
								target: this.weapons[0].target, game: this.game, color: "cyan", smallLaserSFX: this.laserSFX};
				ig.game.spawnEntity (SmallLaser, this.pos.x + this.radius, this.pos.y + this.radius, settings);
			}
			
		},
		
		redefinePath: function () {
			var node = {};
			node.x = this.destX;
			node.y = this.destY;
			this.path[0] = node;
		},
		
		move: function () {
			if (inRange (this.path[0].x, this.pos.x, this.path[0].y, this.pos.y, 30)) {
				this.findDestination();
			}
		
			if (this.target.pos !== undefined && !inRange (this.target.pos.x, this.pos.x, this.target.pos.y, this.pos.y, 150)) {
				this.findDestination();
			}
			
			return this.parent();
		},
		
		findTarget: function () {
			var target = {};
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

        findDestination: function () {
			if (!this.target || this.target.pos === undefined || this.target === this.game.player) {
				this.findTarget(); 
			}
			var goodEnd = false;
			var tarx = this.game.player.pos.x + this.game.player.size.x / 2;
			var tary = this.game.player.pos.y + this.game.player.size.y / 2;
			if (this.target.pos !== undefined && !this.game.player.fighterRecall && this.fuel > 1000) {
				tarx = this.target.pos.x + this.target.size.x / 2;
				tary = this.target.pos.y + this.target.size.y / 2;
			}
			while(!goodEnd){
				this.destY = tary + Math.random() * this.circleRange * 2 - this.circleRange;
				this.destX = tarx + Math.random() * this.circleRange * 2 - this.circleRange;
				//if(!collisionCheck(this.destX, this.destY, this, this.game.entities)){
					goodEnd = true;
					this.newpath = false;
				//}
			}
			this.redefinePath();
		},

		check: function ( other ){
			//if(other.name === "ENEMY"){
				//other.explode();
				//this.explode();
				//this.redefinePath();
			//} else
			if (other.name === "PLAYER" && (this.game.player.fighterRecall || this.fuel < 1000)) {
				this.game.player.fighterQueue += 1;

				this.game.player.fightersOut--;
				this.kill();
			} 
			//if(other.name === "ASTEROID"){
			//	this.explode();
			//}
		},

		explode: function () {
			//ig.game.spawnEntity(destroyedEnemyA, this.pos.x, this.pos.y, null);
			this.explosionSFX.play();
			this.game.player.fightersOut--;
			//ig.game.spawnEntity(explosion, this.pos.x, this.pos.y, null);
			this.kill();
		}
    });
});

