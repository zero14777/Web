ig.module('game.games.offensemenu')
.requires('impact.game', 'game.games.menu', 'game.games.warpgame',
          'impact.font', 'game.entities.button')
.defines(function() {

    OffenseMenu = Menu.extend({

        testCost: [100, 300, 600, 1000, 1500],
        title: new ig.Image('media/weaponheader.png'),
        // needed for dumb reasons
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
            // ----------------------------------------------------------
            // MAIN CANNON

            // damage
            if (state.upgrades.weapons.main.damage.stat <= this.value) {
                ig.game.spawnEntity(Button, 20, 70,
                    {
                        game: this,
                        images: {
                            up: new ig.AnimationSheet('media/buttons/damagebuttonup.png', 174, 38),
                            down: new ig.AnimationSheet('media/buttons/damagebuttondown.png', 174, 38),
                        },
                        size: { x: 174, y: 38 },
                        attribute: state.upgrades.weapons.main.damage,
                        cost: this.testCost,
                        cap: this.value,
                        action: this.upgrade
                    });
            }

            // fireRate
            if (state.upgrades.weapons.main.fireRate.stat <= this.value) {
                ig.game.spawnEntity(Button, 20, 118,
                    {
                        game: this,
                        images: {
                            up: new ig.AnimationSheet('media/buttons/fireratebuttonup.png', 174, 38),
                            down: new ig.AnimationSheet('media/buttons/fireratebuttondown.png', 174, 38),
                        },
                        size: { x: 174, y: 38 },
                        attribute: state.upgrades.weapons.main.fireRate,
                        cost: this.testCost,
                        cap: this.value,
                        action: this.upgrade
                    });
            }

            // delay
            if (state.upgrades.weapons.main.delay.stat <= this.value) {
                ig.game.spawnEntity(Button, 20, 166,
                    {
                        game: this,
                        images: {
                            up: new ig.AnimationSheet('media/buttons/delaybuttonup.png', 174, 38),
                            down: new ig.AnimationSheet('media/buttons/delaybuttondown.png', 174, 38),
                        },
                        size: { x: 174, y: 38 },
                        attribute: state.upgrades.weapons.main.delay,
                        cost: this.testCost,
                        cap: this.value,
                        action: this.upgrade
                    });
            }

            // piercing
            if (state.upgrades.weapons.main.piercing.stat < 1) {
                ig.game.spawnEntity(Button, 20, 214,
                    {
                        game: this,
                        images: {
                            up: new ig.AnimationSheet('media/buttons/piercingbuttonup.png', 174, 38),
                            down: new ig.AnimationSheet('media/buttons/piercingbuttondown.png', 174, 38),
                        },
                        size: { x: 174, y: 38 },
                        attribute: state.upgrades.weapons.main.piercing,
                        cost: [500],
                        cap: 1,
                        action: this.upgrade
                    });
            }

            // ---------------------------------------------------------

            // ----------------------------------------------------------
            // SECONDARY CANNON

            // damage
            if (state.upgrades.weapons.secondary.damage.stat <= this.value) {
                ig.game.spawnEntity(Button, 244, 70,
                    {
                        game: this,
                        images: {
                            up: new ig.AnimationSheet('media/buttons/damagebuttonup.png', 174, 38),
                            down: new ig.AnimationSheet('media/buttons/damagebuttondown.png', 174, 38),
                        },
                        size: { x: 174, y: 38 },
                        attribute: state.upgrades.weapons.secondary.damage,
                        cost: this.testCost,
                        cap: this.value,
                        action: this.upgrade
                    });
            }

            // fireRate
            if (state.upgrades.weapons.secondary.fireRate.stat <= this.value) {
                ig.game.spawnEntity(Button, 244, 118,
                    {
                        game: this,
                        images: {
                            up: new ig.AnimationSheet('media/buttons/fireratebuttonup.png', 174, 38),
                            down: new ig.AnimationSheet('media/buttons/fireratebuttondown.png', 174, 38),
                        },
                        size: { x: 174, y: 38 },
                        attribute: state.upgrades.weapons.secondary.fireRate,
                        cost: this.testCost,
                        cap: this.value,
                        action: this.upgrade
                    });
            }

            // range
            if (state.upgrades.weapons.secondary.range.stat < 1) {
                ig.game.spawnEntity(Button, 244, 166,
                    {
                        game: this,
                        images: {
                            up: new ig.AnimationSheet('media/buttons/rangebuttonup.png', 174, 38),
                            down: new ig.AnimationSheet('media/buttons/rangebuttondown.png', 174, 38),
                        },
                        size: { x: 174, y: 38 },
                        attribute: state.upgrades.weapons.secondary.range,
                        cost: [500],
                        cap: 1,
                        action: this.upgrade
                    });
            }
            // ---------------------------------------------------------

            // ----------------------------------------------------------
            // MISSILE

            // damage
            if (state.upgrades.missile.damage.stat <= this.value) {
                ig.game.spawnEntity(Button, 460, 70,
                    {
                        game: this,
                        images: {
                            up: new ig.AnimationSheet('media/buttons/damagebuttonup.png', 174, 38),
                            down: new ig.AnimationSheet('media/buttons/damagebuttondown.png', 174, 38),
                        },
                        size: { x: 174, y: 38 },
                        attribute: state.upgrades.missile.damage,
                        cost: this.testCost,
                        cap: this.value,
                        action: this.upgrade
                    });
            }

            // fireRate
            if (state.upgrades.missile.fireRate.stat <= this.value) {
                ig.game.spawnEntity(Button, 460, 118,
                    {
                        game: this,
                        images: {
                            up: new ig.AnimationSheet('media/buttons/fireratebuttonup.png', 174, 38),
                            down: new ig.AnimationSheet('media/buttons/fireratebuttondown.png', 174, 38),
                        },
                        size: { x: 174, y: 38 },
                        attribute: state.upgrades.missile.fireRate,
                        cost: this.testCost,
                        cap: this.value,
                        action: this.upgrade
                    });
            }

            // targetSpeed
            if (state.upgrades.missile.targetSpeed.stat < 1) {
                ig.game.spawnEntity(Button, 460, 166,
                    {
                        game: this,
                        images: {
                            up: new ig.AnimationSheet('media/buttons/targetspeedbuttonup.png', 174, 38),
                            down: new ig.AnimationSheet('media/buttons/targetspeedbuttondown.png', 174, 38),
                        },
                        size: { x: 174, y: 38 },
                        attribute: state.upgrades.missile.targetSpeed,
                        cost: [500],
                        cap: 1,
                        action: this.upgrade
                    });
            }
            // ---------------------------------------------------------

            // ----------------------------------------------------------
            // FIGHTERS
            /*
            
*/
            // armor
            if (state.upgrades.fighters.armor.stat <= this.value) {
                ig.game.spawnEntity(Button, 685, 118,
                    {
                        game: this,
                        images: {
                            up: new ig.AnimationSheet('media/buttons/armorbuttonup.png', 174, 38),
                            down: new ig.AnimationSheet('media/buttons/armorbuttondown.png', 174, 38),
                        },
                        size: { x: 174, y: 38 },
                        attribute: state.upgrades.fighters.armor,
                        cost: this.testCost,
                        cap: this.value,
                        action: this.upgrade
                    });
            }

            // damage
            if (state.upgrades.fighters.damage.stat <= this.value) {
                ig.game.spawnEntity(Button, 685, 70,
                    {
                        game: this,
                        images: {
                            up: new ig.AnimationSheet('media/buttons/damagebuttonup.png', 174, 38),
                            down: new ig.AnimationSheet('media/buttons/damagebuttondown.png', 174, 38),
                        },
                        size: { x: 174, y: 38 },
                        attribute: state.upgrades.fighters.damage,
                        cost: this.testCost,
                        cap: this.value,
                        action: this.upgrade
                    });
            }

            // count
            if (state.upgrades.fighters.count.stat < 1) {
                ig.game.spawnEntity(Button, 685, 166,
                    {
                        game: this,
                        images: {
                            up: new ig.AnimationSheet('media/buttons/countbuttonup.png', 174, 38),
                            down: new ig.AnimationSheet('media/buttons/countbuttondown.png', 174, 38),
                        },
                        size: { x: 174, y: 38 },
                        attribute: state.upgrades.fighters.count,
                        cost: [500],
                        cap: 1,
                        action: this.upgrade
                    });
            }
            // ---------------------------------------------------------
        },


        // really bad
        upgrade: function() {
            ++this.attribute.stat;
            //state.materials.stat -= this.cost;
            console.log(this.attribute.stat);
        },

        goBack: function() {
            console.log("go back");
            ig.goToEndOfLevelMenu();
        },

        update: function() {
            this.parent();
        },

        draw: function () {
            this.parent();
            this.title.draw(0, 0);
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
                    ig.system.context.fillText(button.currentCost, button.pos.x - 15, button.pos.y + 30);
                }
            }
        }

    });
});
