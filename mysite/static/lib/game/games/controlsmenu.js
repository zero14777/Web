ig.module('game.games.controlsmenu')
.requires('impact.game', 'game.games.menu', 'game.games.warpgame', 'impact.font', 'game.entities.button')
.defines(function () {



    ControlsMenu = Menu.extend({

        init: function () {
            this.background = 'media/controls.png';
            this.parent();

            this.createButtons();
        },

        createButtons: function () {
            //start button
            ig.game.spawnEntity(Button, 270, 580,
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
            ig.system.setGame(WarpGame);
        },

        update: function () {
            this.parent();
        },

        draw: function () {
            this.parent();
        }
    })
})
