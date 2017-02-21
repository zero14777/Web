ig.module('game.games.instructionsmenu')
.requires('impact.game', 'game.games.menu', 'game.games.controlsmenu', 'impact.font', 'game.entities.button')
.defines (function()
{



    InstructionsMenu = Menu.extend({
		
		init: function () {
		    this.background = 'media/instructions.png';
            this.parent();

            //draw background
            //var data = [
			//	[1]
            //];
            //var bg = new ig.BackgroundMap(660, data, 'media/instructions.png');

            //this.backgroundMaps.push(bg);

            //this.backgroundMaps[0].setScreenPos(0, 0);
            //this.backgroundMaps[0].repeat = true;
            //this.backgroundMaps[0].distance = 1;
			
			//this.backgroundMaps = [];

			//this.img = new ig.Image ('media/instructions.png');
			

            //make all buttons
            this.createButtons();
        },

        createButtons: function () {
            //start button
            ig.game.spawnEntity(Button, 270, 560,
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
        },


        startGame: function () {
            ig.system.setGame(ControlsMenu);
        },

        update: function () {
            this.parent();
        },

        draw: function () {
            this.parent();
        }
    })
})
