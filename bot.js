// Variables
var grid = [4][4];
var directional_scores = {};

// Call main() in console to start the bot
async function main() {
	// Main function of the bot, this is run in a loop.

	// Get the current tile positions
	grid = getGridInfo();

	// Get a score for every possible direction you can move (left, right, up, down).
	// The score is calculated as the sum of every tile you break divided by the recursion depth at the time.
	// So if you merge two 4's on the first turn, it would be +8 points. If you merge them on the second turn
	// it would be just +4 points (8/2), on the third it would be +2.67 points (8/3), etc. until the depth
	// specified has been reached
	// If this move is imposible, the score is set to -infinity
	var temp = predictLeft(grid);
	directional_scores["left"] = temp[1] + recursive(temp[0], 2) - stuckPrevention(grid, temp[0]);
	var temp = predictRight(grid);
	directional_scores["right"] = temp[1] + recursive(temp[0], 2) - stuckPrevention(grid, temp[0]);
	var temp = predictUp(grid);
	directional_scores["up"] = temp[1] + recursive(temp[0], 2) - stuckPrevention(grid, temp[0]);
	var temp = predictDown(grid);
	directional_scores["down"] = temp[1] + recursive(temp[0], 2) - stuckPrevention(grid, temp[0]);

	if (directional_scores["down"] >= directional_scores["left"] && directional_scores["down"] >= directional_scores["right"] && directional_scores["down"] >= directional_scores["up"]){
		//move down
		pressKey(40);
	} else if (directional_scores["left"] >= directional_scores["right"] && directional_scores["left"] >= directional_scores["up"]){
		// move left
		pressKey(37);
	} else if (directional_scores["right"] >= directional_scores["up"]){
		// right
		pressKey(39);
	} else {
		//up
		pressKey(38);
	}
	// left	37
	// up	38
	// right39
	// down	40

	await sleep(250);

	main();
}



function recursive(grid, depth){
	// Recursive fuction that returns the best score for any given grid and depth
	// Each score is adjusted based on how far away it is before being added to the grand total.

	var topScore = Math.max(predictLeft(grid)[1], predictRight(grid)[1], predictUp(grid)[1], predictDown(grid)[1]);
	
	if (depth == 6){ // Base case, return just the score divided by the set depth
		return topScore/depth;
	} else {
		// Find the best possible score you can achieve in the given grid and depth
		return topScore/depth + (Math.max(recursive(predictLeft(grid)[0], depth+1), recursive(predictRight(grid)[0], depth+1), recursive(predictUp(grid)[0], depth+1), recursive(predictDown(grid)[0], depth+1)))/depth;
	}
}


function stuckPrevention(grid1, grid2){
	// If there is a difference between 2 given grids, return 0
	// If they are the same, return infinity. This will be added to score of the given direction.
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (grid1[i][j] != grid2[i][j]){
				return 0;
			}
		}
	}
	return Infinity;
}


function predictLeft(grid){
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
					score += newGrid[i][j]; // Increase score by value of tile
					newGrid[i][j+1] = 0;
				}
			}
		}
	}

	return [newGrid, score];
}


function predictRight(grid){
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
					score += newGrid[i][j]; // Increase score by value of tile
					newGrid[i][j-1] = 0;
				}
			}
		}
	}

	return [newGrid, score];
}


function predictUp(grid){
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
					score += newGrid[j][i]; // Increase score by value of tile
					newGrid[j+1][i] = 0;
				}
			}
		}
	}
	return [newGrid, score];
}


function predictDown(grid){
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
					score += newGrid[j][i]; // Increase score by value of tile
					newGrid[j-1][i] = 0;
				}
			}
		}
	}

	return [newGrid, score];
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

function sleep(ms) {
	// Timeout function. Only called to wait for game animation to finish before proceeding
	return new Promise(resolve => setTimeout(resolve, ms));
}
