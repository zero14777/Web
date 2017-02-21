ig.module('game.entities.button')
.requires('impact.entity')
.defines(function()
{
    Button = ig.Entity.extend({

        
        game: {},
        images: {}, // will contain the up and down images
        animSheet: {},
        size: {}, // will contain x and y dimensions of button
        pressSFX: new ig.Sound('media/sounds/button.*'),
        zIndex: 1000, // want it in front of backgrounds
        action: function () { }, // what the button will do
        action2: undefined,
        attribute: undefined,
        cost: [],
        currentCost: 0,
	    cap: null,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.setup(settings);
        },

        setup: function (settings) {
            this.game = settings.game;
            this.images = settings.images;
            this.size = settings.size;
            this.action = settings.action;
            this.attribute = settings.attribute;
            this.cost = settings.cost;
            this.cap = settings.cap;

            if (typeof settings.action2 !== 'undefined') {
                this.action2 = settings.action2;
            }

            if (typeof settings.attribute.stat !== 'undefined') {
                if (settings.cost.length > 1) {
                    this.currentCost = settings.cost[settings.attribute.stat]
                }
                else {
                    this.currentCost = settings.cost[0];
                }
            }
            else {
                this.currentCost = settings.cost[0];
            }

            this.animSheet = this.images.up;
            this.addAnim('blob', 0.1, [0]);
        },

        draw: function() {
            this.parent();
        },

        update: function() {
            this.parent();
        },

        pressed: function() {
            this.animSheet = this.images.down;
            this.addAnim('blob', 0.1, [0]);
            this.currentAnim = this.anims.blob
            
            this.pressSFX.play();
        },

        released: function() {
            this.animSheet = this.images.up;
            this.addAnim('blob', 0.1, [0]);
            this.currentAnim = this.anims.blob
        },

        reaction: function() {
            this.action();
            if (typeof this.action2 !== 'undefined') {
                this.action2();
            }
            state.materials.stat -= this.currentCost;
            if (this.cap !== null) {

                // the button acts on something and has varying costs
                if (typeof this.attribute.stat !== 'undefined' && this.cost.length > 1) {
                    if (this.attribute.stat <= this.cap) {
                        this.currentCost = this.cost[this.attribute.stat];
                    }
                }

                if (this.attribute.stat > this.cap || this.cap === 1) {
		            console.log("capped");
                    this.kill();
                }
            }
        },

        canAfford: function() {
            var canAfford = false;
            if (state.materials.stat >= this.currentCost || this.currentCost === 0) {
                canAfford = true;
            }
            return canAfford;
        }
    });
});
