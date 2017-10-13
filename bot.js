//var tile = document.body.getElementsByClassName("container")[0].getElementsByClassName("game-container")[0].getElementsByClassName("tile-container")[0];
var grid = [4][4];
var items1 = [4][4];
var onlyUp = true;
var nextResults = [4];

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function bot() {
	grid = getGridInfo(); // Current grid

	var currentResult = [calcHori(), calcVert()];


	// Predicted grid if move left
	grid = getGridInfo();
	tryLeft();

	nextResults[0] = Math.max(calcHori(), calcVert()) + currentResult[0];


	// Predicted grid if move right
	grid = getGridInfo();
	tryRight();

	nextResults[1] = Math.max(calcHori(), calcVert()) + currentResult[0];


	// Predicted grid if move down
	grid = getGridInfo();
	tryDown();

	nextResults[2] = calcHori() + currentResult[1];

	nextResults[3] = 0;

	grid = getGridInfo();

	// left	37
	// up	38
	// right39
	// down	40
	// Decide direction of movement
	move()

	await sleep(200);


	for(var q = 0; q < 4; q++){ 
		items1 = getGridInfo();

		var count = 0;

		for(var x = 0; x < 4; x++){ 
			for(var y = 0; y < 4; y++){
				if(grid[x][y] == items1[x][y]){
					count++;
				}
			}
		}

		if (count == 16){

			move()

			await sleep(200);
		}
	}

	bot();
}

function move(){
	if (nextResults[3] > nextResults[2] && nextResults[3] > nextResults[1] && nextResults[3] > nextResults[0]){
		pressKey(38);
	} else if (nextResults[2] >= nextResults[1] && nextResults[2] >= nextResults[0]){
		pressKey(40);
		nextResults[2] = -1;
		//console.log("Going down");
	} else if (nextResults[1] == nextResults[0]){
		if (Math.floor(Math.random() * 2) == 0){
			pressKey(39);
			nextResults[1] = -1;
			//console.log("Going right");
		} else {
			pressKey(37);
			nextResults[0] = -1;
			//console.log("Going left");
		}
	} else if (nextResults[1] > nextResults[0]){
		pressKey(39);
		nextResults[1] = -1;
		//console.log("Going right");
	} else {
		pressKey(37);
		nextResults[0] = -1;
		//console.log("Going left");
	}

}


function tryLeft(){
	for (var h = 0; h < 3; h++){
		for (var i = 0; i < 4; i++){
			for (var j = 0; j < 3; j++){
				if (grid[i][j] == 0){
					grid[i][j] = grid[i][j+1]
					grid[i][j+1] = 0;
				}

				if (h == 2 && grid[i][j] == grid[i][j+1]){
					grid[i][j] += grid[i][j];
					grid[i][j+1] = 0;
				}
			}
		}
	}
}

function tryRight(){
	for (var h = 0; h < 3; h++){
		for (var i = 0; i < 4; i++){
			for (var j = 3; j > 0; j--){
				if (grid[i][j] == 0){
					grid[i][j] = grid[i][j-1]
					grid[i][j-1] = 0;
				}

				if (h == 2 && grid[i][j] == grid[i][j-1]){
					grid[i][j] += grid[i][j];
					grid[i][j-1] = 0;
				}
			}
		}
	}
}


function tryDown(){
	for (var h = 0; h < 3; h++){
		for (var i = 0; i < 4; i++){
			for (var j = 3; j > 0; j--){
				if (grid[j][i] == 0){
					grid[j][i] = grid[j-1][i]
					grid[j-1][i] = 0;
				}

				if (h == 2 && grid[j][i] == grid[j-1][i]){
					grid[j][i] += grid[j][i];
					grid[j-1][i] = 0;
				}
			}
		}
	}
}

function getGridInfo(){
	return([[getTileInfo(1,1),getTileInfo(2,1),getTileInfo(3,1),getTileInfo(4,1)],
		[getTileInfo(1,2),getTileInfo(2,2),getTileInfo(3,2),getTileInfo(4,2)],
		[getTileInfo(1,3),getTileInfo(2,3),getTileInfo(3,3),getTileInfo(4,3)],
		[getTileInfo(1,4),getTileInfo(2,4),getTileInfo(3,4),getTileInfo(4,4)]
		]);
}

function getTileInfo (x,y){
	var location = "tile-position-" + x + "-" + y;
	var tile = document.body.getElementsByClassName("container")[0].getElementsByClassName("game-container")[0].getElementsByClassName("tile-container")[0];

	try{
		return(parseInt(tile.getElementsByClassName(location + " tile-merged")[0].getElementsByClassName("tile-inner")[0].innerText));
	}
	catch(err){
		try{
			return(parseInt(tile.getElementsByClassName(location)[0].getElementsByClassName("tile-inner")[0].innerText));
		}
		catch(err){
			return(0);
		}
	}
}

function calcVert(){
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

function calcHori(){
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

function pressKey(codeKey){

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
