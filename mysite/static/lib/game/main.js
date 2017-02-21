var state = {materials: { stat: 0 }/*Def moved to startmenu*/};

var frames = 0;
setInterval(function () { console.log("FPS=" + frames); frames = 0; }, 1000);

ig.module('game.main')

.requires('game.games.startmenu', 'game.games.endoflevelmenu')
.defines(function () {
    ig.resetGame = function() {
        ig.system.setGame(StartMenu);
    };

    ig.goToEndOfLevelMenu = function() {
        ig.system.setGame(EndOfLevelMenu);
    }

    // change back eventually
    ig.main('#canvas', StartMenu, 60, 880, 660, 1);
});
