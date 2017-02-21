ig.module('game.games.endoflevelmenu')
.requires('impact.game', 'game.games.menu', 'game.games.offensemenu',
          'game.games.defensemenu', 'game.games.warpgame', 'game.games.winmenu',
          'impact.font', 'game.entities.button')
.defines(function() {

    EndOfLevelMenu = Menu.extend({

        cost: {},
        cap: {},
        background: 'media/space.png',

	    testCost: [50, 100, 150, 200, 250],
	    init: function () {
            this.parent();
            this.createButtons();
        },

        createButtons: function() {
            
            // offense menu
            ig.game.spawnEntity(Button, 100, 100,
                {
                    game: this,
                    images: {
                        up: new ig.AnimationSheet('media/buttons/weaponmenubuttonup.png', 300, 60),
                        down: new ig.AnimationSheet('media/buttons/weaponmenubuttondown.png', 300, 60),
                    },
                    size: { x: 300, y: 60 },
                    attribute: {},
                    cost: [0],
                    cap: null,
                    action: this.offenseMenu
                });

            // defense menu
            ig.game.spawnEntity(Button, 480, 100,
                {
                    game: this,
                    images: {
                        up: new ig.AnimationSheet('media/buttons/defensemenubuttonup.png', 300, 60),
                        down: new ig.AnimationSheet('media/buttons/defensemenubuttondown.png', 300, 60),
                    },
                    size: { x: 300, y: 60 },
                    attribute: {},
                    cost: [0],
                    cap: null,
                    action: this.defenseMenu
                });

            // build missiles
            ig.game.spawnEntity(Button, 480, 410,
                {
                    game: this,
                    images: {
                        up: new ig.AnimationSheet('media/buttons/buildmissilesbuttonup.png', 300, 60),
                        down: new ig.AnimationSheet('media/buttons/buildmissilesbuttondown.png', 300, 60),
                    },
                    size: { x: 300, y: 60 },
                    attribute: {},
                    cost: [10],
                    cap: null,
                    action: this.buildMissiles
                });

            // build fighters
            ig.game.spawnEntity(Button, 100, 410,
                {
                    game: this,
                    images: {
                        up: new ig.AnimationSheet('media/buttons/buildfightersbuttonup.png', 300, 60),
                        down: new ig.AnimationSheet('media/buttons/buildfightersbuttondown.png', 300, 60),
                    },
                    size: { x: 300, y: 60 },
                    attribute: state.fighterCount,
                    cost: [15],
                    cap: null,
                    action: this.buildFighters
                });
	    

            // repair ship
	    if (state.armor.stat < 10000 + (state.upgrades.armor.stat) * 2000) {
            ig.game.spawnEntity(Button, 100, 240,
                {
                    game: this,
                    images: {
                        up: new ig.AnimationSheet('media/buttons/repairshipbuttonup.png', 300, 60),
                        down: new ig.AnimationSheet('media/buttons/repairshipbuttondown.png', 300, 60),
                    },
                    size: { x: 300, y: 60 },
                    attribute: state.armor,
                    cost: [50],
                    cap: 10000 + (state.upgrades.armor.stat) * 2000,
                    action: this.repairShip,
                });
            }

            // continue game
            ig.game.spawnEntity(Button, 10, 590,
                {
                    game: this,
                    images: {
                        up: new ig.AnimationSheet('media/buttons/continueup.png', 300, 60),
                        down: new ig.AnimationSheet('media/buttons/continuedown.png', 300, 60),
                    },
                    size: { x: 300, y: 60 },
                    attribute: {},
                    cost: [0],
                    cap: null,
                    action: this.continueGame
                });
                
            // repair warp drive
            ig.game.spawnEntity(Button, 480, 240,
                {
                    game: this,
                    images: {
                        up: new ig.AnimationSheet('media/buttons/warprepairbuttonup.png', 300, 60),
                        down: new ig.AnimationSheet('media/buttons/warprepairbuttondown.png', 300, 60),
                    },
                    size: { x: 300, y: 60 },
                    attribute: state.warpDrive,
                    cost: [500],
                    cap: 20,
                    action: this.repairWarpDrive,
                    action2: this.winGame
                });
        },

        offenseMenu: function() {
            //STUB
            console.log("offense menu");
            ig.system.setGame(OffenseMenu);
        },

        defenseMenu: function() {
            //STUB
            console.log("defense menu");
            ig.system.setGame(DefenseMenu);
        },

        buildMissiles: function() {
            //STUB
	    ++state.missileCount.stat;
	    //state.materials.stat -= this.cost;
            console.log("build missiles");
        },

        buildFighters: function() {
            //STUB
	    ++state.fighterCount.stat;
	    //state.materials.stat -= this.cost;
            console.log("build fighters");
        },

        repairShip: function() {
            state.armor.stat += 1000;
            if (state.armor.stat >= 10000 + state.upgrades.armor.stat * 2000) {
                state.armor.stat = 10000 + state.upgrades.armor.stat * 2000;
                this.kill();
            }
            console.log("repair ship");
        },

        continueGame: function() {            
            console.log("continue game");
	        ig.system.setGame(WarpGame);
        },

        repairWarpDrive: function() {
            ++this.attribute.stat;
            console.log("repair warp drive");
        },

        winGame: function() {
            if (this.attribute.stat >= 20) {
                ig.system.setGame(WinMenu);
            }
        },

        draw: function () {
            this.parent();
            ig.system.context.font = "20px Georgia";
            ig.system.context.fillStyle = "white";
            ig.system.context.fillText('Materials: ' + state.materials.stat, 390, 590);
            //ig.system.context.fillText(state.materials.stat, 430, 620);


            // Health display
            ig.system.context.fillText("Armor: " + Math.round(state.armor.stat) + " / "
                                       + (10000 + 2000 * state.upgrades.armor.stat),
                                       150, 320);

            // Fighter display
            ig.system.context.fillText("Fighters: " + state.fighterCount.stat,
                                       200, 490);

            // Missile display
            ig.system.context.fillText("Missiles: " + state.missileCount.stat,
                                       580, 490);

            // Warp Drive display
            ig.system.context.fillText("Warp Drive: " + (state.warpDrive.stat * 5) + "%",
                                       560, 320);

            // Draw costs
            var buttons = this.getEntitiesByType(Button);
            var button;
            for (var i = 0; i < buttons.length; ++i) {
                button = buttons[i];
                if (button.currentCost !== 0) {
                    ig.system.context.font = "20px Georgia";
                    ig.system.context.fillStyle = "red";
                    ig.system.context.fillText(button.currentCost, button.pos.x - 25, button.pos.y + 50);
                }
            }
        },
    });
});
