ig.module('game.aStar')
.requires()//must have all entities with destination() function
.defines(function() {
	node = function (x, y, gScore, fScore, prev){
		this.x = x;
		this.y = y;
		this.gScore = gScore;
		this.fScore = fScore;
		this.prev = prev;
	};

	pathFinding = function (pathEntity, entities){
		if(collisionCheck(pathEntity.destX, pathEntity.destY, pathEntity, entities)){
			pathEntity.findDestination();
		}

		var start = new node(pathEntity.pos.x, pathEntity.pos.y, 0, 
						fScore(pathEntity, 0, pathEntity.pos.x, pathEntity.pos.y), null);
		var nodeDist = 10;
		var closedSet = new Array();
		var openSet = new Array();
		var path = new Array();
		openSet.push(start);

		while(true){
			var current;
			var minFScore;
			var currSpot;
			for(var i = 0; i < openSet.length; i++){
				if(i === 0){
					tempFScore = openSet[i].fScore;
					current = openSet[i];
					currSpot = i;
				}
				if(fScore(pathEntity, openSet[i].gScore, openSet[i].x, openSet[i].y) < tempFScore){
					tempFScore = openSet[i].fScore;
					current = openSet[i];
					currSpot = i;
				}
			}

			if (Math.abs(current.x - pathEntity.destX) <= nodeDist,
				Math.abs(current.y - pathEntity.destY) <= nodeDist){
				var lastNode = new node(pathEntity.destX, pathEntity.destY, 0, 0, current);
				var last = current;
				while(current){
					path.splice(0, 0, current);
					current = current.prev;
					delete last.prev;
					last = current;
				}
				//path.push(lastNode);
				return path;
			}
			
			if(openSet.length === 0){
				var noPath = [start];
				return noPath;
			}

			openSet.splice(currSpot, 1);
			closedSet.push(current);

			for(var x = -1 * nodeDist; x <= nodeDist; x += nodeDist){
				for(var y = -1 * nodeDist; y <= nodeDist; y += nodeDist){
					var skip = false;
					var tempX = current.x + x;
					var tempY = current.y + y;
					var tempGScore;
					if(x != 0 && y != 0){
						tempGScore = current.gScore + 14;
					} else {
						tempGScore = current.gScore + 10;
					}
					
					if(collisionCheck(tempX, tempY, pathEntity, entities)){
						continue;
					}

					for(var i = 0; i < entities.length; i++){
						if(pathEntity === entities[i] ||
							entities[i].moveRadius === 0){
							continue;
						}
						if(Math.sqrt(Math.pow((current.x + pathEntity.size.x - entities[i].pos.x + (entities[i].size.x/2)), 2) +
							Math.pow((current.y + pathEntity.size.y - entities[i].pos.y + (entities[i].size.y/2)), 2)) < 
							(entities[i].moveRadius + pathEntity.moveRadius)){
							if(entities[i].name === "PLAYER"){
								tempGScore += 600;
								break;
							}
						}
					}
					
					for(var n = 0; n < closedSet.length; n++){
						if(tempX === closedSet[n].x &&
							tempY === closedSet[n].y){
							if(tempGScore < closedSet[n].gScore){
								closedSet[n].gScore = tempGScore;
								closedSet[n].prev = current;
							}
							skip = true;
							break;
						}
					}
					
					if(skip){
						continue;
					}
					
					for(var z = 0; z < openSet.length; z++){
						if(openSet[z].x == tempX &&
							openSet[z].y == tempY){
							if(tempGScore < openSet[z].gScore){
								openSet[z].gScore = tempGScore;
								openSet[z].prev = current;
							}
							skip = true;
							break;
						}
					}

					if(skip){
						continue;
					}
					
					openSet.push(new node(tempX, tempY, tempGScore, 
					fScore(pathEntity, tempGScore, tempX, tempY), current));
				}
			}
		}
	};

	collisionCheck = function (currX, currY, pathEntity, entities){
		collided = false;
		for(var i = 0; i < entities.length; i++){
			if(pathEntity === entities[i] ||
				entities[i].moveRadius === 0){
				continue;
			}
			if(Math.sqrt(Math.pow((currX + pathEntity.size.x - entities[i].pos.x - (entities[i].size.x/2)), 2) +
				Math.pow((currY + pathEntity.size.y - entities[i].pos.y - (entities[i].size.y/2)), 2)) < 
				(entities[i].pathRadius + pathEntity.pathRadius)){
				collided = true;
				break;
			}
		}

		if(collided){
			return true;
		} else {
			return false;
		}
	};

	fScore = function (pathEntity, gScore, currX, currY){
		var fScore = gScore + Math.abs((currX - pathEntity.destX) * 10) +
				Math.abs((currY - pathEntity.destY) * 10);
		return fScore;
	};
});
