ig.module ('game.games.warpgame')
.requires ('game.warplib', 'impact.game','game.entities.player', 'impact.font', 
           'game.entities.enemy_short_A', 'game.entities.enemy_missile_A', 'game.entities.enemy_long_A',
           'game.entities.fighter', 'game.entities.asteroid')
.defines(function()
{

	WarpGame = ig.Game.extend({
		// Load a font
		font: new ig.Font ('media/04b03.font.png'),
		
		player: {},
		
		spawnCooldown: 0.0,
		level: 1,
		warping: false,
		
		squadTypes: [ 
			{missile: [1, 1], short: [1], long:[]},
			{missile: [1], short: [1], long:[1, 1]},
			{missile: [1], short: [1, 1], long:[1]},
			{missile: [1, 1], short: [1, 1], long:[1, 1]},
			
			{missile: [2, 1], short: [2], long:[]},
			{missile: [2], short: [1], long:[2, 1]},
			{missile: [1], short: [2, 1], long:[2]},
			{missile: [2, 1], short: [2, 1], long:[2, 1]},
			
			{missile: [2, 2], short: [2, 1], long:[]},
			{missile: [2], short: [1], long:[2, 2, 1]},
			{missile: [2], short: [2, 1], long:[2]},
			{missile: [2, 2], short: [2, 2], long:[2, 2]},
			
			{missile: [3, 2, 1], short: [2, 2], long:[]},
			{missile: [3, 2], short: [2], long:[3, 3, 1]},
			{missile: [3], short: [3, 3, 1], long:[2]},
			{missile: [3, 2, 1], short: [3, 2, 1], long:[3, 2, 1]},
			
			{missile: [3, 3, 2], short: [3, 2], long:[2]},
			{missile: [3, 3], short: [2], long:[3, 3, 3, 2]},
			{missile: [3, 3], short: [3, 3, 3, 2], long:[2, 2]},
			{missile: [3, 3, 3, 2], short: [3, 3, 3, 2], long:[3, 3, 3, 2]},
                     
            {missile: [3, 3, 3, 3, 3], short: [3, 3, 3, 3, 3], long:[3, 3, 3, 3, 3]},
            {missile: [3, 3, 3, 2, 2, 2, 1, 1, 1], short: [3, 3, 3, 2, 2, 2, 1, 1, 1], long:[3, 3, 3, 2, 2, 2, 1, 1, 1]}
		],
		//engineCharge: 0.0,
		engineCharge: 120.0,
		effectiveLevel: 0,
		eLevCount: 60,
		
		squads: [],
		
		init: function() {
			// Initialize your game here; bind keys etc.
			
			ig.input.initMouse(); 
			this.level = state.level.stat;
			ig.EntityPool.drainAllPools();
			
			var data = [
				[1]
			];

			this.warping = false;

			var bg = new ig.BackgroundMap (600, data, 'media/spacetransparentfar.png');
			this.backgroundMaps.push (bg);
			
			this.backgroundMaps[0].setScreenPos (0, 0);
			this.backgroundMaps[0].repeat = true;
			this.backgroundMaps[0].distance = 3;
			
			var bg1 = new ig.BackgroundMap (600, data, 'media/spacetransparentmiddle.png');
			var bg2 = new ig.BackgroundMap (600, data, 'media/spacetransparentclose.png');
		
			
			this.backgroundMaps.push (bg1);
			this.backgroundMaps.push (bg2);
			
			
			this.backgroundMaps[1].setScreenPos (0, 0);
			this.backgroundMaps[1].repeat = true;
			this.backgroundMaps[1].distance = 2;
			
			this.backgroundMaps[2].setScreenPos (0, 0);
			this.backgroundMaps[2].repeat = true;
			this.backgroundMaps[2].distance = 1;
			
			ig.input.bind (ig.KEY.MOUSE1, "firePrimary");
			ig.input.bind (ig.KEY.MOUSE2, "fireSecondary");
			ig.input.bind (ig.KEY.E, "fireMissile");
			ig.input.bind (ig.KEY.W, 'forward');
			ig.input.bind (ig.KEY.A, 'left');
			ig.input.bind (ig.KEY.S, 'backward');
			ig.input.bind (ig.KEY.D, 'right');
			ig.input.bind (ig.KEY.SPACE, 'launch');
			ig.input.bind (ig.KEY.R, 'recall');
			ig.input.bind (ig.KEY.ENTER, 'menu');
			
			ig.input.bind (ig.KEY._1, 'balence');
			ig.input.bind (ig.KEY._2, 'weapons');
			ig.input.bind (ig.KEY._3, 'shields');
			ig.input.bind (ig.KEY._4, 'engines');

			this.player = ig.game.spawnEntity (PlayerShip, 400, 400, {game: this, state: state});
			//ig.game.spawnEntity (ShortAttack, 700, 300, {game: this});
			/*ig.game.spawnEntity (Asteroid, 700, 300, {vel: {x: 10, y: -4}});
			ig.game.spawnEntity (Asteroid, -200, 900, {vel: {x: 5, y: -2}});
			ig.game.spawnEntity (Asteroid, -1100, -500, {vel: {x: 12, y: -5}});
			ig.game.spawnEntity (Asteroid, 200, -300, {vel: {x: 11, y: 1}});
			ig.game.spawnEntity (Asteroid, 1400, 1500, {vel: {x: 7, y: -7}});*/
			
		},
		
		spawnEnemy: function(type, areax, areay, squad, tier) {
			var x = areax;
			var y = areay;
			while (true) {
				x = Math.random() * 400 - 200 + areax;
				y = Math.random() * 400 - 200 + areay;
				//if (!checkCollison) {
					console.log ("enemy spawned");
					break;
				//}
			}
			squad.push (ig.game.spawnEntity (type, x, y, {game: this, level: this.level-1, tier: tier}));
		},
		
		generateEnemies2: function() {
			var numEnemies = this.squads.length;
			if (numEnemies < 1) {
				numEnemies = -100000000000000;
			}
			var randX = Math.random() * 300 + 700;
			var randY = Math.random() * 300 + 500;
			if (Math.random() > 0.5) {
				randX *= -1;
			}
			if (Math.random() > 0.5) {
				randY *= -1;
			}
			if (3 - numEnemies > Math.sqrt(Math.random() * 40)) {
				var squadNum = Math.floor (Math.random() * 4) + this.level * 2 - 2 + this.effectiveLevel;
				if (squadNum >= this.squadTypes.length) {
					squadNum = this.squadTypes.length - 1;
				}
				var squadType = this.squadTypes[squadNum];
				var squad = new Array();
				
				for (var i = 0; i < squadType.short.length; i++) {
					this.spawnEnemy (ShortAttack, this.player.pos.x + randX, this.player.pos.y - randY, squad, squadType.short[i]);
				}
				for (var i = 0; i < squadType.long.length; i++) {
					this.spawnEnemy (LongAttack, this.player.pos.x + randX, this.player.pos.y - randY, squad, squadType.long[i]);
				}
				for (var i = 0; i < squadType.missile.length; i++) {
					this.spawnEnemy (MissileAttack, this.player.pos.x + randX, this.player.pos.y - randY, squad, squadType.missile[i]);
				}
				this.squads.push (squad);
				return;
			}
			console.log ("no spawn");
		},
		
		deleteOldSquads: function () {
			for (var i = 0; i < this.squads.length; i++) {
				var squad = this.squads[i];
				var deadSquad = true;
				for (var j = 0; j < squad.length; j++) {
					if (!squad[j].isDead) {
						deadSquad = false;
						break;
					}
				}
				if (deadSquad) {
					this.squads.splice (i, 1);
					i --;
				}
			}
		},

		generateLevel: function () {
			this.deleteOldSquads();
		
			if (this.spawnCooldown <= 0) {
				this.generateEnemies2();
				this.spawnCooldown = 5.0;
			}
			if (this.spawnCooldown > 0) {
				this.spawnCooldown -= 1.0 / FPS;
			}
			
			
			
		},
		
		endLevel: function () {
			var player = this.player;
			state.armor.stat = player.armor;
			state.materials.stat = player.materialCount;
			state.fighterCount.stat = player.fighterCount + player.fighterQueue;
			state.missileCount.stat = player.weapons[2].ammo;
			state.level.stat++;
			
			if(typeof(Storage)!=="undefined") {
				localStorage.setItem("save", JSON.stringify(state));
			}
			
			ig.system.setGame(EndOfLevelMenu);
		},
		
		update: function() {
			// Update all entities and backgroundMaps
			this.parent();
			
			frames++;
			
			if (this.engineCharge > 0) {
				this.engineCharge -= 1.0 / FPS;
			} 
			else {
				this.engineCharge = 0;
			}
			
			this.eLevCount -= 1 / FPS;
			if (this.eLevCount <= 0) {
				this.eLevCount = 60;
				this.effectiveLevel++;
			}
			
			this.generateLevel();
			// Add your own, additional update code here
			this.sortEntitiesDeferred();
			if (this.player.armor <= 0) {
				localStorage.clear();
			    ig.resetGame();
			}
			
			if(this.engineCharge <= 0 && this.warping === true){
				this.endLevel();
			}

			if (ig.input.pressed('menu') && this.engineCharge <= 0) {
				this.warping = true;
				this.engineCharge = 60.0 - (this.player.warpDrive * 3.0);
			}
		},
		
		drawBar: function (startX, startY, endX, endY, color) {
			ig.system.context.strokeStyle = color;
			ig.system.context.lineWidth = 20;
			ig.system.context.beginPath();
			ig.system.context.moveTo(startX,startY);
			ig.system.context.lineTo(endX,endY);
			ig.system.context.stroke();
			ig.system.context.closePath();
			
		},
		
		drawOutline: function (startX, startY, endX, endY, color) {
			ig.system.context.beginPath();
			ig.system.context.rect(startX, startY, endX, endY);
			ig.system.context.strokeStyle = color;
			ig.system.context.lineWidth = 2;
			ig.system.context.stroke(); 
			ig.system.context.closePath();
		},
		
		printBar: function (startX, startY, health, outOf) {
			ig.system.context.font = "15px Georgia";
			ig.system.context.fillStyle = "white";
			ig.system.context.fillText(Math.round(health) + outOf, startX + 5, startY + 5);
		},
		
		healthBars: function () {
			var shieldStyle = ig.system.context.createLinearGradient(20, 20, 160, 90);
			shieldStyle.addColorStop(0,"cyan");
			shieldStyle.addColorStop(1,"blue");
			var armorStyle = ig.system.context.createLinearGradient(20, 60, 120, 60);
			armorStyle.addColorStop(0,"red");
			armorStyle.addColorStop(.4,"orange");
			armorStyle.addColorStop(1, "green");
		
			//if (this.player.isTakingDamage > 0) {
				this.drawOutline (20, 10, 100, 20, shieldStyle);
				this.drawBar (20, 20, 20 + this.player.shield, 20, shieldStyle);
				this.drawBar (20 + this.player.shield, 20, 120, 20, "black");
				this.printBar(35, 20, this.player.shield, "/100");
				//if (this.player.shield <= 10) {
				var armor = this.player.armor / this.player.maxArmor * 100;
				
				this.drawOutline (20, 50, 100, 20, armorStyle);
				this.drawBar (20, 60, 20 + armor, 60, armorStyle);
				this.drawBar (20 + armor, 60, 120, 60, "black");
				this.printBar(20, 60, this.player.armor, "/" + this.player.maxArmor);
				//}
			//}
			//else if (this.player.shield < 100) {
			//	this.drawOutline (20, 10, 100, 20, shieldStyle);
			//	this.drawBar (20, 20, 20 + this.player.shield, 20, shieldStyle);
			//	this.drawBar (20 + this.player.shield, 20, 120, 20, "black");
			//	this.printBar(35, 20, this.player.shield, "/100");
			//}
		},

		fighterData: function() {
			ig.system.context.font = "15px Georgia";
			ig.system.context.fillStyle = "white";
			ig.system.context.fillText(this.player.fightersOut + " / " + this.player.maxFighters, 815, 20);
		},
		
		cursorData: function() {
			var xTar = ig.input.mouse.x;
			var yTar = ig.input.mouse.y;
			ig.system.context.font = "12px Georgia";
			ig.system.context.fillStyle = "white";
			ig.system.context.fillText(this.player.fighterCount, xTar + 10, yTar - 5);
			ig.system.context.fillText(this.player.weapons[2].ammo, xTar + 10, yTar + 20);
		},
		
		drawTriangle: function (posX, posY, angle, color) {
			ig.system.context.fillStyle = color;

			var r120 = 2 * Math.PI / 3;

			ig.system.context.beginPath();
			ig.system.context.moveTo(posX + Math.cos(angle) * 6, posY + Math.sin(angle) * 6);
			ig.system.context.lineTo(posX + Math.cos(angle + r120) * 6, posY + Math.sin(angle + r120) * 6);
			ig.system.context.lineTo(posX + Math.cos(angle - r120) * 6, posY + Math.sin(angle - r120) * 6);
			ig.system.context.closePath();
			ig.system.context.fill();
		},
		
		indicators: function() {
			var enemies = this.getEntitiesByType ('Enemies');
			var posX = this.player.pos.x + this.player.size.x / 2;
			var posY = this.player.pos.y + this.player.size.y / 2;
			for (var i = 0; i < enemies.length; i++) {
				var ent = enemies[i];
				if (!inRange (posX, ent.pos.x + ent.size.x / 2, posY, ent.pos.y + ent.size.y / 2, 440)) {
					var angle = Math.atan ((posY - ent.pos.y - ent.size.y / 2) / (posX - ent.pos.x - ent.size.x / 2));
					if (posX - ent.pos.x - ent.size.x / 2 >= 0) {
						angle += Math.PI;
					}
					this.drawTriangle (posX + Math.cos (angle) * 300 - ig.game.screen.x, posY + Math.sin (angle) * 300 - ig.game.screen.y, angle, "red");
				}
			}
            
            var mats = this.getEntitiesByType ('destroyedEnemyA');
			var posX = this.player.pos.x + this.player.size.x / 2;
			var posY = this.player.pos.y + this.player.size.y / 2;
			for (var i = 0; i < mats.length; i++) {
				var ent = mats[i];
				if (!inRange (posX, ent.pos.x + ent.size.x / 2, posY, ent.pos.y + ent.size.y / 2, 440)) {
					var angle = Math.atan ((posY - ent.pos.y - ent.size.y / 2) / (posX - ent.pos.x - ent.size.x / 2));
					if (posX - ent.pos.x - ent.size.x / 2 >= 0) {
						angle += Math.PI;
					}
					this.drawTriangle (posX + Math.cos (angle) * 300 - ig.game.screen.x, posY + Math.sin (angle) * 300 - ig.game.screen.y, angle, "blue");
				}
			}
		},

		draw: function() {
			// Draw all entities and backgroundMaps
			//this.backgroundMaps[0].draw();
			this.parent();
			this.healthBars();
			this.cursorData();
			this.indicators();
			this.fighterData();
			
			ig.system.context.font = "20px Georgia";
			ig.system.context.fillStyle = "white";
			ig.system.context.fillText(this.player.materialCount, 20, 100);
			
			ig.system.context.font = "20px Georgia";
			ig.system.context.fillStyle = "white";
			ig.system.context.fillText("sector: " + this.level, 20, 130);
			
			ig.system.context.fillStyle = "cyan";
			if (this.player.energy.e === 33) {
				ig.system.context.fillText("B", 20, 640);
			} 
			else if (this.player.energy.e === 60) {
				ig.system.context.fillText("E", 20, 640);
			}
			else if (this.player.energy.w === 60) {
				ig.system.context.fillText("W", 20, 640);
			}
			else {
				ig.system.context.fillText("S", 20, 640);
			}
			var shEngine = Math.floor (this.engineCharge / 60) + ":";
			if (this.engineCharge % 60 < 10) {
				shEngine += "0";
			}
			shEngine += Math.floor (this.engineCharge % 60);
			if(this.engineCharge > 0) {
				ig.system.font = "14px Georgia";
				if(this.warping){
					ig.system.context.fillText("Preparing to jump", 656, 640);
				} else {
					ig.system.context.fillText("Warpdrive cooling down", 600, 640);
				}
				ig.system.font = "20px Georgia";
				ig.system.context.fillText(shEngine, 820, 640);
			} else {
				ig.system.context.fillText("Ready", 810, 640);
				ig.system.context.fillText("Hit 'Enter' initiate warp to next sector", 265, 20);
				ig.system.context.font = "12px Georgia";
				ig.system.context.fillText('Warpdrive will take ' + (60.0 - (this.player.warpDrive * 3.0)) + ' seconds to prepare', 320, 42);
			}
			if(this.warping && this.engineCharge <= 30 && this.player.fightersOut > 0){
				ig.system.context.font = "16px Georgia";
				ig.system.context.fillText("Recall fighters before jump", 343, 20);
			}
		}
	});


	// Start the Game with 60fps, a resolution of 320x240, scaled
	// up by a factor of 2
	//ig.main( '#canvas', WarpGame, FPS, 880, 660, 1);

});
