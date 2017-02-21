ig.module('game.warplib').requires().defines(function()
{
	FPS = 60;
	
	inRange = function (x1, x2, y1, y2, range) {
		var dis = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
		
		if (dis < range) {
			return true;
		}
		return false;
	};
	
	getRange = function (x1, x2, y1, y2) {
		return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
	};
	
	entHit = function (ent, damage) {
	
		ent.isTakingDamage = 2.0;
		var shieldAbsorb = ent.shield * ent.shieldStrength;
		if (ent.shield > 0) {
			if (damage < shieldAbsorb) {
				ent.shield -= damage / ent.shieldStrength;
				return;
			}
			damage -= shieldAbsorb;
			ent.shield = 0.0;
		}
		
		ent.armor -= damage;
		if (ent.armor <= 0) {
			ent.explode();
		}
	};
	
	rechargeShields = function (ent) {
		if (ent.isTakingDamage > 0.0) {
			ent.isTakingDamage -= 1.0 / FPS;
			return;
		}
		if (ent.shield < 100.0) {
			ent.shield += 2.0 / FPS;
		}
		if (ent.shield > 100.0) {
			ent.shield = 100.0;
		}
	};
	
	drawBar = function (startX, startY, endX, endY, color, lineWidth) {
		ig.system.context.strokeStyle = color;
		ig.system.context.lineWidth = lineWidth;
		ig.system.context.beginPath();
		ig.system.context.moveTo(startX,startY);
		ig.system.context.lineTo(endX,endY);
		ig.system.context.stroke();
		ig.system.context.closePath();
		
	};
	
	drawOutline = function (startX, startY, endX, endY, color) {
		ig.system.context.beginPath();
		ig.system.context.rect(startX, startY, endX, endY);
		ig.system.context.strokeStyle = color;
		ig.system.context.lineWidth = 2;
		ig.system.context.stroke(); 
		ig.system.context.closePath();
	};
	
	playerLaser = function (grd) {
		grd.addColorStop(0,"blue");
		grd.addColorStop(0.3,"#4444FF");
		grd.addColorStop(0.5,"#DDDDFF");
		grd.addColorStop(0.7,"#4444FF");
		grd.addColorStop(1,"blue");
	}; 
	
	enemyLaser = function (grd) {
		grd.addColorStop(0,"red");
		grd.addColorStop(0.3,"#FF4444");
		grd.addColorStop(0.5,"#FFDDDD");
		grd.addColorStop(0.7,"#FF4444");
		grd.addColorStop(1,"red");
	};
	
	laserGrd = function (startx, starty, endx, endy, color) {
		var midpointx = (startx + endx) / 2;
		var midpointy = (starty + endy) / 2;

		var angle = Math.atan ((starty - endy) / (startx - endx));

		if (startx - endx < 0) {
			angle += Math.PI;
		}

		var grd=ig.system.context.createLinearGradient(midpointx - Math.sin(angle) * 3, 
													   midpointy + Math.cos(angle) * 3, 
													   midpointx + Math.sin(angle) * 3, 
													   midpointy - Math.cos(angle) * 3);
				
		color (grd);
		
		return grd;
	};
	
	
});
