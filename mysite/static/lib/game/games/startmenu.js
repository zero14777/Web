ig.module('game.games.startmenu')
.requires('impact.game', 'game.games.menu', 'game.games.instructionsmenu',
          'game.games.warpgame', 'impact.font', 'game.entities.button')
.defines (function()
{
    

    StartMenu = Menu.extend({

        title: new ig.Image('media/warptitle.png'),
        background: 'media/space.png',
        init: function () {
            this.parent();
            //make all buttons

            this.createButtons();
        },

        createButtons: function() {
            //start button
            ig.game.spawnEntity(Button, 290, 400,
                {
                    game: this,
                    images: {
                        up: new ig.AnimationSheet('media/buttons/startup.png', 300, 60),
                        down: new ig.AnimationSheet('media/buttons/startdown.png', 300, 60),
                    },
                    size: { x: 300, y: 60 }, // dimensions of the start button.
                    attribute: {},
                    cost: [0],
                    cap: null,
                    action: this.startGame
                });

            //continue button
            ig.game.spawnEntity(Button, 290, 500,
                {
                    game: this,
                    images: {
                        up: new ig.AnimationSheet('media/buttons/continueup.png', 300, 60),
                        down: new ig.AnimationSheet('media/buttons/continuedown.png', 300, 60),
                    },
                    size: { x: 300, y: 60 }, // dimensions of the continue button.
                    attribute: {},
                    cost: [0],
                    cap: null,
                    action: this.continueGame
                });
            this.sortEntities();
        },

        startGame: function () {
            // temp
            console.log("started");
			
			state = {
				armor: { stat: 10000 },
			    materials: { stat: 0 },
				missileCount: { stat: 10 },
				fighterCount: { stat: 10 },  //5
				level: { stat: 1 },
				warpDrive: {stat: 0},
				
				upgrades: {
					weapons: {
						main: {
							damage: { stat: 0 },
							fireRate: { stat: 0 },
							delay: { stat: 0 },
							piercing: { stat: 0 } ///BIG
						},
						secondary: {
							damage: { stat: 0 },
							fireRate: { stat: 0 },
							range: { stat: 0 }     //BIG
						}
					},
					missile: {
						damage: { stat: 0 },
						fireRate: { stat: 0 },
						targetSpeed: { stat: 0 }    //BIG
					},
					fighters: {
						count: { stat: 0 },  //BIG
						armor: { stat: 0 },
						damage: { stat: 0 }
					},
					shields: { stat: 0 },
					armor: { stat: 0 },
					engine: { stat: 0 } //BIG
				}
			};
            ig.system.setGame(InstructionsMenu);
        },

        continueGame: function() {
            // temp
            console.log("started");
			
			if(typeof(Storage)!=="undefined" && localStorage.getItem("save")) {
				state = JSON.parse(localStorage.getItem("save")); 
				ig.system.setGame(EndOfLevelMenu);
			}
			else if (typeof(Storage)!=="undefined") {
				return; //alert("sorry no save game present");
			}
			else {
				return; //alert("sorry your browser does not support the autosave feature");
			}
        },
        
        update: function() {
            this.parent();
        },
        
        draw: function () {
            this.parent();
            this.title.draw(223, 180);
        }
    })
})
