setInterval(function(){
	var grid = getGridInfo();
	var bestMove = getBestNextMove(grid);
	
	if (bestMove == "left"){
		pressKey(37);
	} else if (bestMove == "up"){
		pressKey(38);
	} else if (bestMove == "right"){
		pressKey(39);
	} else if (bestMove == "down"){
		pressKey(40);
	}
}, 250);


function calcVert(grid){
	// Calculate the vertical score (for movement up or down)
	var vSum = 0;
	for (var i = 0; i < 4; i++) {
		if (grid[0][i] != 0){
			if (grid[1][i] == grid[0][i]){
				vSum += grid[0][i];
			} else if (grid[1][i] == 0 && grid[2][i] == grid[0][i]){
				vSum += grid[0][i];
			} else if (grid[1][i] == 0 && grid[2][i] == 0 && grid[3][i] == grid[0][i]){
				vSum += grid[0][i];
			}
		}

		if (grid[1][i] != 0){
			if (grid[2][i] == grid[1][i]){
				vSum += grid[1][i];
			} else if (grid[2][i] == 0 && grid[3][i] == grid[1][i]){
				vSum += grid[1][i];
			}
		}

		if (grid[2][i] != 0){
			if (grid[3][i] == grid[2][i]){
				vSum += grid[2][i];
			}
		}
	}
	return(vSum);
}


function calcHori(grid){
	// Calculate the horizontal score (for movement left or right)
	var hSum = 0;
	for (var i = 0; i < 4; i++) {
		if (grid[i][0] != 0){
			if (grid[i][1] == grid[i][0]){
				hSum += grid[i][0];
			} else if (grid[i][1] == 0 && grid[i][2] == grid[i][0]){
				hSum += grid[i][0];
			} else if (grid[i][1] == 0 && grid[i][2] == 0 && grid[i][3] == grid[i][0]){
				hSum += grid[i][0];
			}
		}

		if (grid[i][1] != 0){
			if (grid[i][2] == grid[i][1]){
				hSum += grid[i][1];
			} else if (grid[i][2] == 0 && grid[i][3] == grid[i][1]){
				hSum += grid[i][1];
			}
		}

		if (grid[i][2] != 0){
			if (grid[i][3] == grid[i][2]){
				hSum += grid[i][2];
			}
		}
	}
	return(hSum);
}


function getBestNextMove(grid) {
	var lastWasUp = false; // to make sure that the subsequent move after going up is down
	var scoreFor = {}; // dictionary of directions, with each value the score/quality of the move

	isPossible = {} // dictionary of directions, where the value is a boolean on whether the move is possible
	isPossible["down"] = isDifferentGrid(grid, moveDown(grid));
	isPossible["left"] = isDifferentGrid(grid, moveLeft(grid));
	isPossible["right"] = isDifferentGrid(grid, moveRight(grid));
	isPossible["up"] = isDifferentGrid(grid, moveUp(grid));

	// calculate scores if the move is left
	if (isPossible["left"]){
		predictedGrid = moveLeft(grid);
		scoreFor["left"] = Math.max(calcHori(predictedGrid), calcVert(predictedGrid)) + calcHori(grid);
	} else {
		scoreFor["left"] = -1;
	}

	// calculate scores if the move is right
	if (isPossible["right"]) {
		predictedGrid = moveRight(grid);
		scoreFor["right"] = Math.max(calcHori(predictedGrid), calcVert(predictedGrid)) + calcHori(grid);
	} else {
		scoreFor["right"] = -1;
	}

	// calculate scores if the move is down
	if (isPossible["down"]){
		predictedGrid = moveDown(grid);
		scoreFor["down"] = Math.max(calcHori(predictedGrid), calcVert(predictedGrid)) + calcVert(grid);
	} else {
		scoreFor["down"] = -1;
	}

	// scoreFor["up"] is not caclulated as we try to avoid this move at all costs, and only use it if there are no choice


	// If the last move was up, then try to move down as soon as possible. This is because our strategy is to stack all the
	// high value blocks at the bottom, and if the last move was up this strategy was ruined.
	if (lastWasUp && isPossible["down"]){
		lastWasUp = false;
		return "down";
	// If the only possible move is up
	} else if (!isPossible["down"] && !isPossible["right"] && !isPossible["left"] && isPossible["up"]){
		return "up";

	} else if (scoreFor["down"] >= scoreFor["right"] && scoreFor["down"] >= scoreFor["left"] && isPossible["down"]){
		return "down";

	} else if (scoreFor["right"] == scoreFor["left"] && isPossible["left"] && isPossible["right"]){
		// If the score for moving left and right is equal, then pick a direction randomly
		if (Math.floor(Math.random() * 2) == 0){
			return "right";
		} else {
			return "left";
		}

	} else if (scoreFor["right"] == scoreFor["left"] && isPossible["left"]){
		return "left";

	} else if (scoreFor["right"] >= scoreFor["left"] && isPossible["right"]) {
		return "right";
		
	} else if (isPossible["left"]){
		return "left";
		
	}
}


function isDifferentGrid(grid1, grid2){
	// Compare the given grids, and return true if they are different
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (grid1[i][j] != grid2[i][j]){
				return true;
			}
		}
	}
	return false;
}


function moveLeft(grid){
	// Predict what the grid and score will look like if you move left in the game
	// Returns an array with grid and score

	// Create a deep copy of the grid
	var newGrid = [];
	var score = 0;
	for (var i = 0; i < 4; i++)
	    newGrid[i] = grid[i].slice();


	// Calculate what the board will look like when moving left
	for (var h = 0; h < 3; h++){
		for (var i = 0; i < 4; i++){
			for (var j = 0; j < 3; j++){
				// Shift tile over into empty space
				if (newGrid[i][j] == 0){
					newGrid[i][j] = newGrid[i][j+1]
					newGrid[i][j+1] = 0;
				}

				// Combine two tiles
				if (h == 2 && newGrid[i][j] == newGrid[i][j+1]){
					newGrid[i][j] *= 2;
					//score ++;//= newGrid[i][j]; // Increase score by value of tile
					newGrid[i][j+1] = 0;
				}
			}
		}
	}

	return newGrid;
}


function moveRight(grid){
	// Predict what the grid and score will look like if you move right in the game
	// Returns an array with grid and score

	// Create a deep copy of the grid
	var newGrid = [];
	var score = 0;
	for (var i = 0; i < 4; i++)
	    newGrid[i] = grid[i].slice();

	// Calculate what the board will look like when moving right
	for (var h = 0; h < 3; h++){
		for (var i = 0; i < 4; i++){
			for (var j = 3; j > 0; j--){
				// Shift tile over into empty space
				if (newGrid[i][j] == 0){
					newGrid[i][j] = newGrid[i][j-1]
					newGrid[i][j-1] = 0;
				}

				// Combine two tiles
				if (h == 2 && newGrid[i][j] == newGrid[i][j-1]){
					newGrid[i][j] *= 2;
					score ++;//= newGrid[i][j]; // Increase score by value of tile
					newGrid[i][j-1] = 0;
				}
			}
		}
	}
	return newGrid;
}


function moveUp(grid){
	// Predict what the grid and score will look like if you move up in the game
	// Returns an array with grid and score

	// Create a deep copy of the grid
	var newGrid = [];
	var score = 0;
	for (var i = 0; i < 4; i++)
	    newGrid[i] = grid[i].slice();
	
	// Calculate what the board will look like when moving up
	for (var h = 0; h < 3; h++){
		for (var i = 0; i < 4; i++){
			for (var j = 0; j < 3; j++){
				// shift tile over into empty space
				if (newGrid[j][i] == 0){
					newGrid[j][i] = newGrid[j+1][i]
					newGrid[j+1][i] = 0;
				}

				// Combine two tiles
				if (h == 2 && newGrid[j][i] == newGrid[j+1][i]){
					newGrid[j][i] *= 2;
					score ++;//= newGrid[j][i]; // Increase score by value of tile
					newGrid[j+1][i] = 0;
				}
			}
		}
	}
	
	return newGrid;
}


function moveDown(grid){
	// Predict what the grid and score will look like if you move down in the game
	// Returns an array with grid and score

	// Create a deep copy of the grid
	var newGrid = [];
	var score = 0;
	for (var i = 0; i < 4; i++)
	    newGrid[i] = grid[i].slice();

	// Calculate what the board will look like when moving down
	for (var h = 0; h < 3; h++){
		for (var i = 0; i < 4; i++){
			for (var j = 3; j > 0; j--){
				// shift tile over into empty space
				if (newGrid[j][i] == 0){
					newGrid[j][i] = newGrid[j-1][i]
					newGrid[j-1][i] = 0;
				}

				// Combine two tiles
				if (h == 2 && newGrid[j][i] == newGrid[j-1][i]){
					newGrid[j][i] *= 2;
					score ++;//= newGrid[j][i]; // Increase score by value of tile
					newGrid[j-1][i] = 0;
				}
			}
		}
	}

	return newGrid;
}


function getGridInfo(){
	// Return a 2D array size 4x4 containing the tile values
	return([[getTileInfo(1,1),getTileInfo(2,1),getTileInfo(3,1),getTileInfo(4,1)],
		[getTileInfo(1,2),getTileInfo(2,2),getTileInfo(3,2),getTileInfo(4,2)],
		[getTileInfo(1,3),getTileInfo(2,3),getTileInfo(3,3),getTileInfo(4,3)],
		[getTileInfo(1,4),getTileInfo(2,4),getTileInfo(3,4),getTileInfo(4,4)]
		]);
}


function getTileInfo (x,y){
	// Get the value of the tile in the specified (x, y) position
	var location = "tile-position-" + x + "-" + y;
	var tile = document.body.getElementsByClassName("container")[0].getElementsByClassName("game-container")[0].getElementsByClassName("tile-container")[0];

	// If the tile does not exist, consider the value of the spot 0
	try{
		return(parseInt(tile.getElementsByClassName(location + " tile-merged")[0].getElementsByClassName("tile-inner")[0].innerText));
	}
	catch(err){
		// The reason for a try-catch inside a try-catch, is because not every tile is actually called the same name.
		// If the tile has been merged (so 4 and above), it will have a difference name from the starter tiles (2 or 4).
		try{
			return(parseInt(tile.getElementsByClassName(location)[0].getElementsByClassName("tile-inner")[0].innerText));
		}
		catch(err){
			return(0);
		}
	}
}


function pressKey(codeKey){
	// Simulate a key press (only used on the four arrow keys in this program)
	Podium = {};

	var oEvent = document.createEvent('KeyboardEvent');

    // Chromium Hack
    Object.defineProperty(oEvent, 'keyCode', {
    	get : function() {
    		return this.keyCodeVal;
    	}
    });     
    Object.defineProperty(oEvent, 'which', {
    	get : function() {
    		return this.keyCodeVal;
    	}
    });     

    if (oEvent.initKeyboardEvent) {
    	oEvent.initKeyboardEvent("keydown", true, true, document.defaultView, codeKey, codeKey, "", "", false, "");
    } else {
    	oEvent.initKeyEvent("keydown", true, true, document.defaultView, false, false, false, false, codeKey, 0);
    }

    oEvent.keyCodeVal = codeKey;

    document.body.dispatchEvent(oEvent);
}
