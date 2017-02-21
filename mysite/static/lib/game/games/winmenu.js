ig.module('game.games.winmenu')
.requires('impact.game', 'game.games.menu', 'impact.font', 'game.entities.button')
.defines(function () {



    WinMenu = Menu.extend({

        text: new ig.Image('media/win.png'),

        init: function () {
            this.background = 'media/space.png';
            this.parent();

        //    this.createButtons();
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
            this.text.draw(100, 260);
        }
    })
})
