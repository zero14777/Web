ig.module('game.entities.background')
.requires('impact.entity')
.defines(function () {
    Background = ig.Entity.extend(
    {
        //size: {x: 0, y: 0},
        zIndex: -1000,
        
        animSheet: undefined,

        init: function (x, y, settings) {
            this.animSheet = new ig.AnimationSheet(settings.image, 880, 660);
            this.addAnim('blob', 0.1, [0]);
            this.game = settings.game;

            this.parent(x, y, settings);
        },


        update: function () {
            this.parent();
        }
    });
});