ig.module('game.games.menu')
.requires('impact.game', 'impact.font', 'game.entities.button', 'game.entities.background')
.defines(function () {

    Menu = ig.Game.extend({

        background: undefined,
        font: new ig.Font('media/04b03.font.png'),
        click: "click",
        selected: null,
        value: 4, // TEMP

        init: function () {
            ig.input.initMouse();
            ig.input.bind(ig.KEY.MOUSE1, this.click);

            this.createBackground();
        },

        createBackground: function() {
            ig.game.spawnEntity(Background, 0, 0,
                                { image: this.background }
                                );
        },

        inAButton: function (button) {
            var isInAButton = false;
            if (ig.input.mouse.x >= button.pos.x
                    && ig.input.mouse.y >= button.pos.y
                    && ig.input.mouse.x <= button.pos.x + button.size.x
                    && ig.input.mouse.y <= button.pos.y + button.size.y) {
                isInAButton = true;
            }
            return isInAButton
        },

        checkButtons: function () {
            var buttons = this.getEntitiesByType(Button);
            var button;
            for (var i = 0; i < buttons.length; ++i) {
                button = buttons[i];
                //console.log(button.currentCost);
                if (this.inAButton(button) && (button.canAfford() || button.currentCost === 0)) {
                //if (this.inAButton(button)) {
                //if (this.inAButton(button) && true) {
                    // you have clicked on the button.
                    button.pressed(); // this might be a bad way to do it.
                    this.selected = button;
                    break; // leave if you've pressed a button
                }
            }
        },

        update: function () {
            this.parent();

            if (ig.input.pressed(this.click)) {
                this.checkButtons();
            }

            if (ig.input.released(this.click) && this.selected !== null) {
                this.selected.released();
                if (this.inAButton(this.selected)) {
                    // Mouse was released while still inside the button.
                    this.selected.reaction();
                }
                this.selected = null;
            }
        },

        draw: function () {
            
            this.parent();
        }
    })
})
