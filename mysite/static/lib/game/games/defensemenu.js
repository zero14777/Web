ig.module('game.games.defensemenu')
.requires('impact.game', 'game.games.menu', 'game.games.warpgame',
          'impact.font', 'game.entities.button')
.defines(function() {

    DefenseMenu = Menu.extend({

        testCost: [50, 100, 150, 250, 400],
        attribute: { stat: 0 },
        background: 'media/space.png',

        init: function () {
            this.parent();
            //make all buttons
            this.createButtons();
        },

        createButtons: function() {

            // go back
            ig.game.spawnEntity(Button, 10, 590,
                {
                    game: this,
                    images: {
                        up: new ig.AnimationSheet('media/buttons/backbuttonup.png', 300, 60),
                        down: new ig.AnimationSheet('media/buttons/backbuttondown.png', 300, 60),
                    },
                    size: { x: 300, y: 60 },
                    attribute: {},
                    cost: [0],
                    cap: null,
                    action: this.goBack
                });

            // buy armor upgrade
            if (state.upgrades.armor.stat <= this.value) {
                ig.game.spawnEntity(Button, 290, 100,
                    {
                        game: this,
                        images: {
                            up: new ig.AnimationSheet('media/buttons/bigarmorbuttonup.png', 300, 60),
                            down: new ig.AnimationSheet('media/buttons/bigarmorbuttondown.png', 300, 60),
                        },
                        size: { x: 300, y: 60 },
                        attribute: state.upgrades.armor,
                        cost: this.testCost,
                        cap: this.value,
                        action: this.upgrade,
                        action2: this.postUpgradeRepair
                    });
            }

            // buy shield upgrade
            if (state.upgrades.shields.stat <= this.value) {
                ig.game.spawnEntity(Button, 290, 200,
                    {
                        game: this,
                        images: {
                            up: new ig.AnimationSheet('media/buttons/shieldsbuttonup.png', 300, 60),
                            down: new ig.AnimationSheet('media/buttons/shieldsbuttondown.png', 300, 60),
                        },
                        size: { x: 300, y: 60 },
                        attribute: state.upgrades.shields,
                        cost: this.testCost,
                        cap: this.value,
                        action: this.upgrade
                    });
            }

            // buy engine upgrade
            if (state.upgrades.engine.stat < 1) {
                ig.game.spawnEntity(Button, 290, 300,
                    {
                        game: this,
                        images: {
                            up: new ig.AnimationSheet('media/buttons/enginebuttonup.png', 300, 60),
                            down: new ig.AnimationSheet('media/buttons/enginebuttondown.png', 300, 60),
                        },
                        size: { x: 300, y: 60 },
                        attribute: state.upgrades.engine,
                        cost: [250],
                        cap: 1,
                        action: this.upgrade,
                    });
            }
        },

        // really bad
        upgrade: function () {
            ++this.attribute.stat;
            //state.materials.stat -= this.cost;
            console.log(this.attribute.stat);
        },

        goBack: function () {
            console.log("go back");
            ig.goToEndOfLevelMenu();
        },

        update: function () {
            this.parent();
            
        },

        draw: function () {
            this.parent();
            ig.system.context.font = "20px Georgia";
            ig.system.context.fillStyle = "white";
            ig.system.context.fillText('Materials: ' + state.materials.stat, 390, 590);

            // Display costs
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

        postUpgradeRepair: function() {
            state.armor.stat += 2000;
            if (state.armor.stat > 10000 + this.attribute.stat * 2000) {
                state.armor.stat = 10000 + this.attribute.stat * 2000;
            }
        }

    });
});