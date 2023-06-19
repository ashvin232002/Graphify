// import  {clearBoard} from "./javaScript/clearBaord"
var TotalR = 25; 
var TotalC = 80; 

var startCell = [6, 18];
var endCell = [18, 56];

//isInProcess basically stands for that wheather algorithm is actually running or not
var isInProcess = false;  


var isDigonalMovesAllowed = false;


// Digonal Move Button

//This is The function To allow or not to allow the diaglonal Move in the graph
$('#boxx').click(function () {
	if (isDigonalMovesAllowed == false) {
		isDigonalMovesAllowed = true;
	}
	else {
		isDigonalMovesAllowed = false;
	}
});


var animateThisCells = [];
var isErrorOccure=false;
var isWeCanCreatWalls = false; //This would be allow us to add obstacle after clicking
var algorithm = null;    //algorithm value
var isJustFinished = false;
var speedOfAnimation = "Fast"; //speed
var animationState = null;
var isStartMoving = false;  //start
var isEndMoving = false;   //end


///------------------------------GRID GENERATION-----------------------------------------

//gridmaker is function that run a loop for the number of rows and for the number of cols to
//make the grid with this number of rows and nuber of cols
// genrating grid using js
function gridMaker(rows, cols) {
	console.log("OK");
	var grid = "";
	for (let row = rows; row >=1 ; row--) {
		grid += "<tr>";
		for (let col =cols; col >=1; col--) {
			grid += "<td></td>";
		}
		grid += "</tr>";
	}
	grid ="<table>"+grid+"</table>"
	return grid;
}


// make html table
//calling the gridmaker function
var HTMLgrid = gridMaker(TotalR, TotalC);
//$(id) represent the select element from the HTML body on a CSS-style selector
// .append() function is then called on the selected element and is used to insert content or elements as the last child of the selected element
$("#tableContainer").append(HTMLgrid);
//----------------------------------------------------------------------------------------------------




// ------------------------------- CLEAR BOARD --------------------------------------------------------------------------//
// clearing the bord
// Clearing the bord exept starting ans ending
// so bassically clearBoard function is a function that  clear the board 
function clearBoard(keepWalls) {
	//.find() get all the elements and we can take a length of that
	var cells = $("#tableContainer").find("td");
	var startIndex = (startCell[0] * (TotalC));
	startIndex+=startCell[1];
	var endIndex = (endCell[0] * (TotalC));
	endIndex+=endCell[1];
    // console.log(" Printing the cells",cells);

	for (var i = 1; i <= cells.length; i++) {
		isWall = $(cells[i-1]).hasClass("wall");
		$(cells[i-1]).removeClass();//if it has a Wall call Then remove it 
		if ((i-1) == endIndex) {
			$(cells[i-1]).addClass("end");//if it is  a end index then add the end class
		}else if ((i-1) == startIndex) {
			$(cells[(i-1)]).addClass("start"); //if it is a start index then add the start class
		} 
		else if ((keepWalls && isWall)==true) 
		{
			$(cells[(i-1)]).addClass("wall");
		}
	}
}


//----=By update the start Button Text-------------------------------
//update button
//$(id).html will replace the inner contest.
function updateStartBtnText() {
	if(isInProcess==false)
	{
		if (algorithm == "Depth-First Search (DFS)") {
			console.log("okokokoko");
			$("#startBtn").html("Start DFS");
		}else if (algorithm == "Dijkstra") {
			$("#startBtn").html("Start Dijkstra");
		} else if (algorithm == "Greedy Best-First Search") {
			$("#startBtn").html("Start Greedy BFS");
		}  else if (algorithm == "Breadth-First Search (BFS)") {
			$("#startBtn").html("Start BFS");
		} else if (algorithm == "A*") {
			$("#startBtn").html("Start A*");
		} 
	}
	return;
}


//-----------This The resultant Text which we have to use During the display
// Show error messages
function update(message) {
	$("#resultsIcon").removeClass();
	$("#resultsIcon").addClass("fas fa-exclamation");
	$('#results').css("background-color", "#ffc107");
	$("#length").text("");
	if (message == "wait") {
		$("#duration").text("Please wait for the algorithm to finish.");
	}
}



// making walls and removing walls
//td is tag that represent the table data
//--------------------------BY CLICKING ADD AND REMOVE WALL ----------------------------------------------------------------------------------------
/*
mousedown : so bassically mousedown event on all the the elements 
            using jQuery.When a mousedown event is triggered on any of those elements,
			the associated callback function would be triggered
*/
$("td").mousedown(function () {
	var index = $("td").index(this);

	//basically to find the starting index [
    //startcell[0](number of row)*(total Number of column)
	// + add the extra colms startIndx[1] which we have to add to find the starting point

	var startIndex = (startCell[0] * (TotalC)) ;
	startIndex+= startCell[1];

	//same as the starting index as we have created 
	var endIndex = (endCell[0] * (TotalC)) ;
	endIndex+= endCell[1];


	//check weather any algorithm is in running state or not
	if (isInProcess != true) {
        //if it is in the running state
		if (isJustFinished && isInProcess == false)
		{
			clearBoard(keepWalls = true);
			isJustFinished = false;
		}
		if (index == startIndex) {
			isStartMoving = true;
		} 
		else if (index == endIndex) 
		{	//console.log("11112344");
			isEndMoving = true;
		} 
		else if(index != startIndex&&index != endIndex)
		{
			isWeCanCreatWalls = true;
		}
	}
	else
	{
          //if it is not in the running state than ignore it
	}
});




//----------------------------------------click on THE START BUTTON ------------------------------------------------------------
// start button
/* This is  a startBtn same as the react onClick event where we can trigger some event*/
$("#startBtn").click(function () {
	//.prop() function is used to get and set the value of its "disabled" property.
	//so once the onclick event is triggred the start button would be disabled
	$("#boxx").prop("disabled", true);
	if (algorithm != null) 
	{ 

		if (isInProcess==true) 
		{ 
			update("wait"); //pass the function update with message(wait);
			return; 
		}
		else
		{
			
		}
		//if algorithm is already selected pass the alorithm name as a parameter and run the algorithm
		runAlgoritham(algorithm);
	}
	else
	{
		//If the algorithm is not selected give the alert that the algorithm would not  selected yet
		alert("Please select an Algoritham");
		return;
	}
	// $("#boxx").prop("disabled", false);
});



//---------------------------THIS IS CHECK FUNCTION THAT ENABLE START BUTTON-------------------------------------------------
//This is a check function
function Check()
{
	if(isInProcess==false)
	{
		
		$("#boxx").prop("disabled", false);
	}else{
		// console.log("My Interval called Inside check function");
	}
}

//This is setInterval() that check after every 1s time (1000ms) that the state is  isInProgress state or not  
//we are doing this because once the algorithm would be successfully completed we have to enable our start button and clear button
setInterval((Check) , 1000);



//-------------------------------------MOUSE POINTER ON SELECTED ELEMENT FUNCTIONLITY--------------------------------------------------------
// mouse pointer is over the selected element
$("td").mouseenter(function () {
	///This is a base case
	//No wall creation 
	if (!isWeCanCreatWalls && !isStartMoving && !isEndMoving&&isInProcess==false) 
	{ 	
		return; 
	}
	// console.log("OKOKOK");
	// console.log("isEnding moving="+isEndMoving);

	/* so basically $(id).index(this) is jquery method used to retrieve the index of the
	   current element(this) among collection of all td elmentx*/
	var index = $("td").index(this);

	//take start and end index 
	var startIndex = startCell[1];
	startIndex+=(startCell[0] * (TotalC)) ;
	var endIndex = (endCell[0] * (TotalC));
	endIndex+= endCell[1];
	
	if (isInProcess==false) 
	{
		if (isJustFinished==true) 
		{
			clearBoard(keepWalls = true);
			isJustFinished = false;
		}
		
		if (isStartMoving==true && index != endIndex) 
		{
			shiftEndOrStart(startIndex, index, "start");
		} 
		else if (isEndMoving==true && index != startIndex) {
			console.log("this is exicuted");
			shiftEndOrStart(endIndex, index, "end");
		} 
		else if (index != startIndex && index != endIndex) {
			//if we are trying to convert the start or end index to wall
			// that is not possible at all
			console.log("mid");
			$(this).toggleClass("wall");
		}
		
		
	}else{
		//already in inProgress No possible to create any wall
	}
});





//---------------------------------------------ON DUBLE CLICK APPLY TOGGLE CLASS FUNCTIONALITY--------------------------------------------------------------------------------------------------
$("td").click(function () {
	//identifying the current cell index
	var index = $("td").index(this);

	//taking the startIndex and Ending index
	var startIndex = startCell[1];
	startIndex+=(startCell[0] * (TotalC)) ;
	var endIndex = (endCell[0] * (TotalC));
	endIndex+= endCell[1];

	if ((isInProcess == false) && !(index == startIndex) && !(index == endIndex)) {
		if(isJustFinished==false) 
		{
			
		}
		else
		{
			clearBoard(keepWalls = true);
			isJustFinished = false;
		}
		//when we click on that particularcell toggle the class or (change the class)
		$(this).toggleClass("wall");
	}else{
		//in progress state or index would be same as  starting or ending index
	}
});


// when mouse leave element
$("body").mouseup(function () {
	isWeCanCreatWalls = false;
	isEndMoving = false;
	isStartMoving = false;
});



//--------------------------------------------------CLEAR BUTTON --------------------------------------------------------------//
//clear Button click 
$("#clearBtn").click(function () 
{
	if (isInProcess!=false)
	{ 
		update("wait"); 
		return; 
	}
	else
	{
		clearBoard(keepWalls = false);
	}
});


//-------------------------------------------------ALGORITHM CHOOSING -----------------------------------
$("#algorithms .dropdown-item").click(function () {
	if (isInProcess==true)
	{ 
		update("wait"); 
		return; 
	}
	else if(isInProcess==false)
	{
		//$(this).text() set the value of the algorithm which would be clicked
		algorithm = $(this).text();
		updateStartBtnText();
	}
	
});


function shiftEndOrStart(prevIndex, newIndex, startOrEnd){
	var newCellY = newIndex % TotalC;
	var newCellX = Math.floor((newIndex - newCellY) / TotalC);
	if (startOrEnd == "start"){
    	startCell = [newCellX, newCellY];
    } else {

    	endCell = [newCellX, newCellY];
    }
    clearBoard(keepWalls = true);
    return;
}



function getNextValidBlock(i, j) {
	var answer = [];
	
	if (i < (TotalR - 1)&&j<(TotalC)) { answer.push([i + 1, j]); }
	if (j < (TotalC - 1)&&i<TotalR)  { answer.push([i, j + 1]); }
	
	// isDigonalMovesAllowed moves
	if (isDigonalMovesAllowed == true) {  
		
		if (i > 0 && j > 0) { answer.push([i - 1, j - 1]); }
		if (i > 0 && j + 1 < TotalC) {
			answer.push([i - 1, j + 1]);
		}
		if (i + 1 < TotalR && j > 0) {
			answer.push([i + 1, j - 1]);
		}
		if (i + 1 < TotalR && j + 1 < TotalC) {
			answer.push([i + 1, j + 1]);
		}
	}
	if (i > 0&&j>=0) { answer.push([i - 1, j]); }
	if (j > 0&&i>=0) { answer.push([i, j - 1]); }

	return answer;
}

// For backtracking and Pathfinding 
function creatPrevIndexTable() {
	var prev = [];
	for (var i = TotalR; i>=1; i--) {
		var row = [];
		for (var j = TotalC ; j>=1 ; j--)
		{
			row.push(null);
		}
		prev.push(row);
	}
	return prev;
}


//-------------------checking is cell is wall or not -------------------------------
// wall or not ?
function isCellisAWall(i, j, cells) {
	if(isInProcess==true)
	{
		//finding the cell location 
		var cellNum = (i * (TotalC));
		cellNum+= j;
		return $(cells[cellNum]).hasClass("wall");
	}
	else
	{
		return;
	}
}

//------------------making visited matrix for wall -------------------------------
// if wall is there then already visited else not visited
function makeVisitedMatrix() {
	var ans = [];
	var cells = $("#tableContainer").find("td");
	console.log("PRINTING THE ALL CELLS",cells);
	for (var i = 1; i<=TotalR&&isInProcess==true; i++) 
	{
		var row = [];
		for (var j = 1; j<=TotalC ; j++) 
		{
			//passing the (row,col,cells);
			if (isCellisAWall(i-1, j-1, cells)==false) 
			{
				//no wall
				row.push(false);
			} 
			else if(isInProcess==true)
			{	
				//wall present
				row.push(true);	
			}
		}
		ans.push(row);
	}
	return ans;
}


//------------------get Recent Delay basically set the timing for the speed response------------------------//
function getRecentDelay() {
	var ans;
	if (speedOfAnimation === "Normal") 
	{
		ans = 10;
	} 
	else if (speedOfAnimation === "Slow") {
		ans = 200;
	} 
	else  
	{
		ans = 1;
	}
	return ans;
}




// animation and waiting
async function animateBlocks() {
	
	var cells = $("#tableContainer").find("td");
	animationState = null;
	var delay = getRecentDelay();

	//finding the cell position
	var startIndex =  startCell[1];
	startIndex+=(startCell[0] * (TotalC));
	
	var endIndex =  endCell[1];
	endIndex+=(endCell[0] * (TotalC)) ;

	
	for (var i = 0; i < animateThisCells.length; i++) {
		delay=getRecentDelay();
		var cellCoordinates = animateThisCells[i][0];
		if(isInProcess==true)
		{

			var x = cellCoordinates[0];
			var num = (x * (TotalC));
			var y = cellCoordinates[1];
			
			num+= y;
			if ((num == startIndex || num == endIndex)==false) 
			{ 
				var cell = cells[num];
				var colorClass = animateThisCells[i][1];

			
				// waiting for this and it exicute other code 
				await new Promise(resolve => setTimeout(resolve, delay));

				$(cell).removeClass();
				$(cell).addClass(colorClass);
			}
			else
			{	
				continue; 
				
			}
		}
	}
	animateThisCells = [];
	return new Promise(resolve => resolve(true));
}



//-------------------checking is cell is wall or not -------------------------------
// wall or not ?
function isCellisAWall(i, j, cells) {
	if(isInProcess==true)
	{
		//finding the cell location 
		var cellNum = (i * (TotalC));
		cellNum+= j;
		return $(cells[cellNum]).hasClass("wall");
	}
	else
	{
		return;
	}
}
//walls maker
// 2D array
function makeWallMaze() {
	var walls = [];
	for (var i = TotalR; i >=1; i--) {
		var row = [];
		for (var j = 1;isInProcess==true&&j<=TotalC; j++) {
			row.push(true);
		}
		walls.push(row);
	}
	if(isErrorOccure==false)
	{
		return walls;
	}
	else
	{
		return;
	}
	
}

// Random Maze funcation blocking removal
function answerThatAreWalls(answer, walls) {
	var ans = 0;
	console.log("answer",answer);
	//here I am not getting
	for (var k = 1; k <= answer.length; k++) {
		var i = answer[k-1][0];
		var j = answer[k-1][1];
		if (walls[i][j]==false) 
		{ 
			
		}
		else
		{
			ans=ans+1; 
		}
	}
	console.log("PRINTING THE ANS IN THE answerThatAreWalls page",ans);
	return ans;
}


// Random maze
async function randomMazeCreator() {
	isInProcess = true;
	clearBoard(keepWalls = false);
	var visited = makeVisitedMatrix();
	var walls = makeWallMaze();
	var cells = [startCell, endCell];    //[[],[]]
	visited[startCell[0]][startCell[1]] = true;
	visited[endCell[0]][endCell[1]] = true;
	walls[startCell[0]][startCell[1]] = false;
	walls[endCell[0]][endCell[1]] = false;
	

	for (var i = 0; i < TotalR; i++) {
		for (var j = 0; j < TotalC; j++) {
			var x=(Math.floor(Math.random()*(3.2)));
			if (walls[i][j]==true && (x)>=1 && answerThatAreWalls(walls[i][j], walls) <1) 
			{
				walls[i][j]=(!walls[i][j]);
			}
		}
	}

	//Animate cells
	var cells = $("#tableContainer").find("td");
	for (var i = TotalR-1 ; i >=0 ; i--) {
		for (var j = TotalC-1 ; j >=0 ; j--) {
			
			if (isInProcess==true&&(i == 0 || i == (TotalR - 1) || j == 0 || j == (TotalC - 1) || walls[i][j])) {
				animateThisCells.push([[i, j], "wall"]);
			}
		}
	}
	// waiting for animation complete
	await animateBlocks();
	isInProcess = false;
	return;
}

//---------------------------------------Recursive Maza Creation ------------------------------------------------------------------------------------------------
// Recursive maze
// pre preparation
async function recursiveDivMaze(bias) {
	isInProcess = true;
	clearBoard(keepWalls = false);

	//Animate edge walls
    //by this two loops we always try to cover the last row ,  first row, first column , last column
	for (var i = 0;i<=TotalR-1;i++) {
		for (var j = 0; j < TotalC; j++) {
			// ------------------------------------//if it is 0th row or 0th colm or lastrow or lastcol apply the property of walll 
			if (isErrorOccure==false&&(i == 0 || j == 0 || i == (TotalR - 1) || j == (TotalC - 1))==false) {
				
			}
			else
			{	
				animateThisCells.push([[i, j], "wall"]);
			}
		}
	}

	//now taking the walls and 
	var walls = makeVisitedMatrix();
	var passages = makeVisitedMatrix();
	
	recursiveDivMazeHelper(isInProcess,1, (TotalR - 2), 1, (TotalC - 2), 2, (TotalR - 3), 2, (TotalC - 3), walls, passages, bias);
	if(isErrorOccure==true)
	{
		console.log("Error");
	}
	await animateBlocks();
	isInProcess = false;
	return;
}




///-----------------------------------------------recursiveDivMazeHelper---------------------------------------------------------------------------------------------
///recursiveDivMazeHelper :-----------------------Function that called Inside the recursiveDivMaze() function with the appropriate parameters ------------------------------------
// Recursive maze
// Atual creater

function recursiveDivMazeHelper(isInProcess,iStart, iEnd, jStart, jEnd, horzStart, horzEnd, vertStart, vertEnd, walls, passages, bias) {
	
	if(isInProcess==false)
	{
		return;
	}
	var height = iEnd - iStart + 1;
	var width = jEnd - jStart + 1;
	var totalArea=height*width;
	if(totalArea<0)
	{
		return;
	}
	var canMakeVertWall = (vertEnd - vertStart) >= 0;
	var canMakeHorzWall = (horzEnd - horzStart) >= 0;
	if (height < 3 || width < 3 || !canMakeVertWall || !canMakeHorzWall) {
		return;
	}
	else
	{
		var x = Math.floor(Math.random() * 10);
		if (bias =="HORIZONTAL") 
		{
			var horizontalOrVertical = (x < 1 &&x>=0) ? "VERTICAL" : "HORIZONTAL"; 
		} 
		else if (bias == "VERTICAL") 
		{
			var horizontalOrVertical = (x>=0&&x < 8) ? "VERTICAL" : "HORIZONTAL";
			
		} else {
			var horizontalOrVertical = (x < 5&&x>=0) ? "VERTICAL" : "HORIZONTAL"; 
		}

		if (horizontalOrVertical == "VERTICAL") 
		{
			var vertWidth = vertEnd - vertStart;
			vertWidth++;
			var randCol = Math.floor(Math.random() * vertWidth);
			randCol+=vertStart;

			if (passages[iEnd][randCol]==true) {
				var randRow = iEnd;
			} 
			else if ( passages[iStart][randCol]==true) 
			{
		
				var randRow = iStart;
			} 
			else 
			{
				var randRow = (Math.floor(Math.random()+Math.random()) == 0) ? iStart : iEnd; 
			}
			for (var i = iStart; i <= iEnd; i++) 
			{
				if (passages[i][randCol]!=true) 
				{ 
					if (i != randRow) 
					{
						walls[i][randCol] = true;
						animateThisCells.push([[i, randCol], "wall"]);
					} else {
						
						for (var j =randCol + 1 ; j <=randCol - 1 ; j--) {
							passages[i][j] = true;
						}
						
					}
				}
				else
				{
					continue; 
				}
				
			}
			recursiveDivMazeHelper(isInProcess ,iStart, iEnd, jStart, (randCol - 1), horzStart, horzEnd, vertStart, (randCol - 2), walls, passages); //left
			recursiveDivMazeHelper(isInProcess,iStart, iEnd, (randCol + 1), jEnd, horzStart, horzEnd, (randCol + 2), vertEnd, walls, passages); //right
		} 
		else 
		{
			var horzHeight = horzEnd - horzStart;
			horzHeight++;
			var randRow = horzStart;
			randRow+=Math.floor(Math.random() * horzHeight);
			
			if (passages[randRow][jEnd]==true) 
			{
				var randCol = jEnd;
			} 
			else if (passages[randRow][jStart]==true) 
			{
				var randCol = jStart;
			}  
			else 
			{
				var randCol = (Math.floor(Math.random()+Math.floor(Math.random()) != 0))? jEnd : jStart;
			}

			for (var j = jStart; j <= jEnd; j++) {

				if (passages[randRow][j]==false) 
				{
					if (j != randCol) 
					{
						walls[randRow][j] = true;
						animateThisCells.push([[randRow, j], "wall"]);
					} 
					else 
					{
						for (var i = randRow + 1   ; i >=randRow-1 ; i--) 
						{
							passages[i][j] = true;
						}
					} 
				}
				else
				{	
					continue;
				}
				
			}
			recursiveDivMazeHelper(isInProcess,iStart, (randRow - 1), jStart, jEnd, horzStart, (randRow - 2), vertStart, vertEnd, walls, passages); //up
			recursiveDivMazeHelper(isInProcess,(randRow + 1), iEnd, jStart, jEnd, (randRow + 2), horzEnd, vertStart, vertEnd, walls, passages); //down
		}
		return;
	}
}


//----This is a Maze Creater function which is called from the selction from the dropdown menu
// maze creater
$("#mazes .dropdown-item").click(function () {
	if (isInProcess) { update("wait"); return; }
	maze = $(this).text();
	if (maze == "Random") {
		randomMazeCreator();
	} else if (maze == "Recursive Division") {
		recursiveDivMaze(null);
	} else if (maze == "Recursive Division (Vertical Skew)") {
		recursiveDivMaze("VERTICAL");
	} else if (maze == "Recursive Division (Horizontal Skew)") {
		recursiveDivMaze("HORIZONTAL");
	} 
});








//------------------------------------COUNTING THE LENGTH-----------------------------------------------
// Counts length of path
// Done for final 
function countLength() {
	//iN The jquery after $(id) we can get all the cells 
	var cells = $("td");
	var ans = 0;
	if(isInProcess==true)
	{
		for (var i = 1; i <= cells.length; i++) {
			if ($(cells[i-1]).hasClass("success")==false) {
				
			}
			else
			{
				ans++;
			}
		}
	}
	else
	{
		isErrorOccure=true;
	}
	return ans;
}



///-------------------------------updateSpeedDisplayFunction-----------------------------------------------
///which is called inside the dropdown of the speed selector
// chaning display of speed
function updateSpeedDisplay(speedOfAnimation) {
	if(isErrorOccure==false)
	{
		if (speedOfAnimation == "Slow") {
			$(".speedDisplay").text("Speed: Slow");
		} else if (speedOfAnimation == "Fast") {
			$(".speedDisplay").text("Speed: Fast");
		}else if (speedOfAnimation == "Normal") {
			$(".speedDisplay").text("Speed: Normal");
		} 
	}
	return;
}


//---------------------So here basically click evet on the dropdown of the speed option-------------------
$("#speed .dropdown-item").click(function () {
	
	speedOfAnimation = $(this).text();
	updateSpeedDisplay(speedOfAnimation);

});


///----------------THIS IS THE DISPLAY OF THE  OUTPUT FUNCTION --------------------
function showResult(isPathFound, length) {
	var firstAnimation = "swashOut";
	var secondAnimation = "swashIn";
	$("#results").removeClass();
	$("#results").addClass("magictime " + firstAnimation);
	// delay to looks like animation
	setTimeout(function () {
		$("#resultsIcon").removeClass();
		if (isPathFound!=true) {
			$('#results').css("background-color", "#ff6961");
			$("#resultsIcon").addClass("fas fa-times");
		} else {
			$('#results').css("background-color", "#77dd77");
			$("#resultsIcon").addClass("fas fa-check");
			
		}
		$("#duration").text("");
		$("#length").text("Length: " + length);
		$('#results').removeClass(firstAnimation);
		$('#results').addClass(secondAnimation);
	}, 2222);
}



//-------This is the Algorithm in the visual Form ------------------------------
// Algoritham in visual form
async function runAlgoritham(algorithm) {
	isInProcess = true;
	clearBoard(keepWalls = true);//keep wall as it is 
	var isPathFound = executeAlgo();

	await animateBlocks();
	if (isPathFound) {
		showResult( true, countLength());
	} else {
		showResult( false, countLength());
	}
	isInProcess = false;
	isJustFinished = true;
}


//------------------------This the algorithm Running function which runs a algorithm for the name
//----------------------   selected ---------------------------------------------------
//RunAlgo
function executeAlgo() {
	//console.log("I AM INSIDE THE ALGORITHM RUNNING FUNCTION ");
	//console.log(algorithm);


	if (isErrorOccure==false&& isInProcess==true&&algorithm == "Depth-First Search (DFS)") {
		var visited = makeVisitedMatrix();
		var isPathFound = DFS(startCell[0], startCell[1], visited);//passing the i,j start row,column


	} else if (isErrorOccure==false&&algorithm == "Breadth-First Search (BFS)") {
		var isPathFound = BFS();


	} else if (isErrorOccure==false&&algorithm == "Dijkstra") {
		var isPathFound = dijkstra();
		// console.log(isPathFound);


	} else if (isErrorOccure==false&&algorithm == "A*") {
		var isPathFound = AStar();


	} else if (isErrorOccure==false&&algorithm == "Greedy Best-First Search") {
		var isPathFound = greedyBestFirstSearch();

		
	} 
	return isPathFound;
}





function shiftEndOrStart(prevIndex, newIndex, startOrEnd){
	var newCellY = newIndex % TotalC;
	var newCellX = Math.floor((newIndex - newCellY) / TotalC);
	if (startOrEnd == "start"){
    	startCell = [newCellX, newCellY];
    } else {

    	endCell = [newCellX, newCellY];
    }
    clearBoard(keepWalls = true);
    return;
}



function getNextValidBlock(i, j) {
	var answer = [];


	//regular up,down,left,right moves
	//           (i-1,j)
	//   (i,j-1)         (i,j+1)
	//           (i+1,j)


	if (i < (TotalR - 1)&&j<(TotalC)) { answer.push([i + 1, j]); }
	if (j < (TotalC - 1)&&i<TotalR)  { answer.push([i, j + 1]); }
	


	// isDigonalMovesAllowed moves
	if (isDigonalMovesAllowed == true) { 
		
		
		//Diagonal Moves
		// (i-1,j-1)	        (i-1,j+1)
					// (i,j)
		//  (i+1,j-1)           (i+1,j+1)


		if (i > 0 && j > 0) { answer.push([i - 1, j - 1]); }
		if (i > 0 && j + 1 < TotalC) {
			answer.push([i - 1, j + 1]);
		}
		if (i + 1 < TotalR && j > 0) {
			answer.push([i + 1, j - 1]);
		}
		if (i + 1 < TotalR && j + 1 < TotalC) {
			answer.push([i + 1, j + 1]);
		}
	}
	if (i > 0&&j>=0) { answer.push([i - 1, j]); }
	if (j > 0&&i>=0) { answer.push([i, j - 1]); }

	return answer;
}


////------------------------------IF THE ALGORITHM IS DFS ------------------------------------------------
//here we have passed visited array that check if there is wall then make it visited else not
function DFS(i, j, visited) {
	if ((i == endCell[0] && j == endCell[1])==false) {
		//  source==target
		 //do nothing
	}
	else
	{
		animateThisCells.push([[i, j], "success"]);
		return true;
	}
	
	animateThisCells.push([[i, j], "searching"]);
	visited[i][j] = true;

	var nextBlocks = getNextValidBlock(i, j);//find the nextvalid blocks by standing at current point
	for (var k = 1; k <= nextBlocks.length; k++) {
		var m = nextBlocks[k-1][0];
		var n = nextBlocks[k-1][1];

		if (visited[m][n]==true)
		{
               //if the cell is already visited ignore it. 
		}
		else
		{
            //apply the recursion try for evry possible state 
			var isPathFound = DFS(m, n, visited);
			if (isPathFound==false)
			{
                 //if notPathFound return from there 
			} 
			else
			{
				animateThisCells.push([[i, j], "success"]);
				return true;
			}
		}
	}
	if(isErrorOccure==false)
	{
		animateThisCells.push([[i, j], "visited"]);
	}
	return false;
}







// /------------------------Matrix Creation ------------------------------------
// Done for final
function creatDistanceMatrix() {
	if(isInProcess==true)
	{
		var costOf = [];
		for (var i = 1; i <= TotalR; i++) {
			var row = [];
			for (var j = 0; j < TotalC; j++) {
				//taking the vector<vector>> with value of INT_MAX
				row.push(1000000000);
			}
			costOf.push(row);
		}
		return costOf;
	}
	else
	{	console.log("Error");
		isErrorOccure=true;
		return;
	}
}



//To find the evry time minimum value path then we use min heap
function minHeap() {
	this.heap = [];

	//isEmpty  function length is zero or not
	this.isEmpty = function () {
		if(this.heap.length != 0)
		{
			return false;
		}
		else if(this.heap.length==0)
		{
			return true;
		}
	}

	//clear function --  clear the heap
	this.clear = function () {
		// clear this heap 
		this.heap = [];
		return;
	}




	//get the minimum element from heap
	this.getMin = function () {
		if (this.isEmpty()==true) {
			return null;
		}
		else
		{
			//In the min Heap the smallest element is stored at the first iNdex 
			var mini = this.heap[0];
			//when performing the pop operation , the last element of the heap is
			//removed and then stored at the first index to replace the root
			this.heap[0] = this.heap[this.heap.length - 1];
			this.heap[this.heap.length - 1] = mini;
			this.heap.pop();


			if (this.isEmpty()==true) 
			{
				
			}
			else
			{
				//after removing the element to maintain the heap again well(properly) positioned 
				//we have to follow the siftDown() method  .
				this.siftDown(0);
			}
			return mini;
		}
	}
	

	//pushing the element in to the heap 
	this.push = function (item) {
		this.heap.push(item);
		this.siftUp(this.heap.length - 1);
		return;
	}
    

	//to find the children 
	this.children = function (index) {
		//left  child would be (2*index+1)
		//right child would be (2*index+2)
		return [(index + index) + 1, (index + index) + 2];
	}

    
	

	this.parent = function (index) {
		if (index == 0) {
			return null;
		}
		else if(index!=0)
		{
			return Math.floor((index - 1) / 2);
		}
	}


	this.siftDown = function (index) {

		//taking the leftChild,rightChild
		var children = this.children(index);


		var isLeftChildValid = (children[0] <= (this.heap.length - 1));
		var isRightChildValid = (children[1] <= (this.heap.length - 1));
		var newIndex = index;



		if (isLeftChildValid && this.heap[newIndex][0] > this.heap[children[0]][0]) {
			newIndex = children[0];
		}
		else
		{


		}



		if (isRightChildValid && this.heap[newIndex][0] > this.heap[children[1]][0]) {
			newIndex = children[1];
		}
		else
		{

		}


		if (newIndex === index) 
		{ 
			return; 
		}
		else
		{
			var val = this.heap[index];
			this.heap[index] = this.heap[newIndex];
			this.heap[newIndex] = val;
			this.siftDown(newIndex);
			return;
		}
	}


	this.siftUp = function (index) {
		var parent = this.parent(index);
		if (parent !== null && this.heap[index][0] < this.heap[parent][0]) {
			var val = this.heap[index];
			this.heap[index] = this.heap[parent];
			this.heap[parent] = val;
			this.siftUp(parent);
		}
		else
		{

		}
		return;
	}
}


// For backtracking and Pathfinding 
function creatPrevIndexTable() {
	var prev = [];
	for (var i = TotalR; i>=1; i--) {
		var row = [];
		for (var j = TotalC ; j>=1 ; j--)
		{
			row.push(null);
		}
		prev.push(row);
	}
	return prev;
}



//basically disjkstra's algorithm is the most important in real life application to find the
// ..most optimal sorted path  
function dijkstra() {


	var isPathFound = false;//pathFound or not ?
	var minimumHeap = new minHeap();// minHeap() Initialization


	var prev = creatPrevIndexTable();//For the backTracking and PathFinding ...............
	var costOf = creatDistanceMatrix();//creating a matrix and Initializing with INT_MAX .................


	if(isInProcess==true)
	{
		var visited = makeVisitedMatrix();//taking the visited matrix to store the value at each point 
		costOf[startCell[0]][startCell[1]] = 0; //starting point of the cost would be 0
		minimumHeap.push([0, [startCell[0], startCell[1]]]);//pushing the minHeap  (distance =0, {startingNoderow,startingNodecol})
		animateThisCells.push([[startCell[0], startCell[1]], "searching"]);



		while (!minimumHeap.isEmpty()) 
		{
			var cell = minimumHeap.getMin();//find the top 
			var i = cell[1][0];     //[distance,[i,j]]
			var j = cell[1][1];     

			if (visited[i][j]==false)
			{
				visited[i][j] = true;
				animateThisCells.push([[i, j], "visited"]);


				if ((i == endCell[0] && j == endCell[1])!=true)
				{
					//if it is not a target node
				}
				else
				{
					//if it is target node
					isPathFound = true;
					break;
				}



				var answer = getNextValidBlock(i, j); //same as DFS find the available points to move





				if(isErrorOccure==false)
				{
                    //Taking the available steps which we can move 
					for (var k = 0; k < answer.length; k++) {
						
						//taking the (row,col) 
						var m = answer[k][0];
						var n = answer[k][1];


						if (visited[m][n]==false) 
						{ 
							var newDistance = costOf[i][j];
							newDistance++; //  increasing the one step  to move 


							if (newDistance < costOf[m][n]) {
								costOf[m][n] = newDistance;             //if there is a another path where the distance is smaller than previous store newDistance
								prev[m][n] = [i, j];                    //store into the prev array whenever there is a may need of backtrack
								minimumHeap.push([newDistance, [m, n]]);//pushing a newDistance into the minHeap
								animateThisCells.push([[m, n], "searching"]);
							}


						}
						else
						{	
							continue; 
						}
					}
				}
			} 
			else
			{ 
				continue; 
			}


		}
		// while (!minimumHeap.isEmpty()) {

		// 	//run another loop 
		// 	var cell = minimumHeap.getMin();
		// 	var i = cell[1][0];
		// 	var j = cell[1][1];
		// 	if (visited[i][j]==false) 
		// 	{ 
		// 		visited[i][j] = true;
		// 		animateThisCells.push([[i, j], "visited"]);
		// 	}
		// 	else
		// 	{
		// 		continue;
		// 	}
		// }


		if(isPathFound==false) 
		{
			// do nothing
		}
		else
		{

			//isPathFound == true   ,   we got our successFull Path
			var i = endCell[0];
			var j = endCell[1];
			animateThisCells.push([endCell, "success"]);
			while (prev[i][j] != null&&isInProcess==true) 
			{
				var prevCell = prev[i][j];
				j = prevCell[1];//prevCell is fpr the backtaracking purpose
				i = prevCell[0];
				animateThisCells.push([[i, j], "success"]);
			}
		}
		return isPathFound;
	}
	else
	{	
		isErrorOccure=true;
		return;
	}
}







// -------------------------------------------------------------------------------------BREATH FIRST SEARCH-----------------------------------
function Queue() {
	this.stack = new Array();

	//remove element from the top of 
	this.dequeue = function () {
		return this.stack.pop();
	}

	//adding a element to the top of the stack
	this.enqueue = function (item) {
		this.stack.unshift(item);
		return;
	}


	//isEmpty() function in Queue
	this.empty = function () {
		 if(this.stack.length != 0)
		 {
			return false;
		 }
		 else{
			 return true;
		 }
	}


	//clear function to start from very begining
	this.clear = function () {
		this.stack = new Array();
		return;
	}
}



// Done
function BFS() {
	var visited = makeVisitedMatrix();//take viisted array where user had put any wall or something like that
	var simpleQueue = new Queue(); //Initialize The stack 
	var isPathFound = false;
	isInProcess=true;
	var prev = creatPrevIndexTable();  //create prev matrix for the backtracking purpose 
	simpleQueue.enqueue(startCell);  //Inserting the element inside the queue
	animateThisCells.push(startCell, "searching");
	visited[startCell[0]][startCell[1]] = true;//making visited 

	while (simpleQueue.empty()==false&&isErrorOccure==false) // while not queue empty()
	{
		var cell = simpleQueue.dequeue();//removing the top element 
		var i = cell[0];
		var j = cell[1];
		animateThisCells.push([cell, "visited"]);
		if((i == endCell[0] && j == endCell[1])==false) 
		{	
			if(isErrorOccure==true)
			{
				console.log("Error");
				break;
			}
			var answer = getNextValidBlock(i, j); //if it not a answer then generating alll the valid walk from that point every time
			for (var k = 1; k <= answer.length; k++) {
				var m = answer[k-1][0];
				var n = answer[k-1][1];
				if ((visited[m][n]==false)) 
				{ 
					visited[m][n] = true;//making visited
					prev[m][n] = [i, j];//interting inside prev array
					animateThisCells.push([answer[k-1], "searching"]);
					simpleQueue.enqueue(answer[k-1]);; 
				}
				else
				{
					continue;
				}
			}
		}
		else
		{
			isPathFound = true; /// success
			break;
		}
		
	}
	while (simpleQueue.empty()==false) 
	{
		var cell = simpleQueue.dequeue();
		var r = cell[0];
		var c = cell[1];
		animateThisCells.push([cell, "visited"]); ///making all the elements visited which is inside the queue
	}





	if (isPathFound==false) 
	{

	}
	else
	{
		//if it is success assigning the class successs
		var c = endCell[1];
		var r = endCell[0];
		animateThisCells.push([[r, c], "success"]);
		while (prev[r][c] != null) 
		{	
			if(isInProcess==false)
			{
				break;
			}
			var prevCell = prev[r][c];
			r = prevCell[0];
			c = prevCell[1];
			animateThisCells.push([[r, c], "success"]);
		}
	}
	return isPathFound;
}




function greedyBestFirstSearch() 
{

	var isPathFound = false;                ///isPathFound =  false
	var prev = creatPrevIndexTable();       ///creating prevIndexTable
	var costs = creatDistanceMatrix();      //creating DistanceMatrix
	var visited = makeVisitedMatrix();      //making VisitedMatrix
	var minimumHeap = new minHeap();        // initializing minHeap


	isInProcess=true;
	if(isErrorOccure==true)
	{
		console.log("Error");
		return;
	}

	costs[startCell[0]][startCell[1]] = 0;                                                     //making startcell distance  = 0
	minimumHeap.push([0, [startCell[0], startCell[1]]]);                                       //pushing elements into the minHeap Like a dijkstra's 
	animateThisCells.push([[startCell[0], startCell[1]], "searching"]);



	while (minimumHeap.isEmpty()==false) {

		var cell = minimumHeap.getMin();
		var i = cell[1][0];
		var j = cell[1][1];
		if (visited[i][j]==false) 
		{ 
			visited[i][j] = true;
			animateThisCells.push([[i, j], "visited"]);



			if (isInProcess==true&&i == endCell[0] && j == endCell[1]) {
				isPathFound = true;                                                              //if target Node is Found
				break;
			}



			var answer = getNextValidBlock(i, j);				//generating all  the nextValid blocks


			for (var k = 1; k <= answer.length; k++) {
				
				var n = answer[k-1][1];
				var m = answer[k-1][0];


				if (visited[m][n]==false) 
				{ 


					var newCost = Math.abs(endCell[0] - m)*Math.abs(endCell[0] - m) ;  //assuming the hueristic value  targetnode(i,j)
					                                                                // (endCell[0]-m)*(endCell[0]-m)

					var zz=Math.abs(endCell[1] - n);            
					newCost+=zz;                                  //taking the total newCost as a heuristic cost



					if (isInProcess==true&&newCost < costs[m][n])   //newCost is less than the current cost 
					{
						prev[m][n] = [i, j];
						costs[m][n] = newCost;
						
						minimumHeap.push([newCost, [m, n]]);
						animateThisCells.push([[m, n], "searching"]);
					}
				}else
				{	
					continue;
				}
				
			}


		}
		else
		{	
			continue;
		}
		
	}
	// Make any nodes still in the heap "visited"
	while (minimumHeap.isEmpty()!=true) {
		var cell = minimumHeap.getMin();
		var i = cell[1][0];
		var j = cell[1][1];
		if (visited[i][j]==false) 
		{ 
			visited[i][j] = true;
			animateThisCells.push([[i, j], "visited"]); 
		}
		else
		{
			continue;
		}
		
	}
	// If a path was found, illuminate it
	if (isPathFound==true) 
	{
		var i = endCell[0];
		var j = endCell[1];
		animateThisCells.push([endCell, "success"]);
		if(isErrorOccure==true)
		{	

			console.log("Error Occured");
		}
		while (prev[i][j] != null&&isErrorOccure==false) {
			
			var prevCell = prev[i][j];
			i = prevCell[0];
			j = prevCell[1];
			animateThisCells.push([[i, j], "success"]);
			if((prev[i][j] != null)==false)
			{
				break;
			}
		}
	}
	else
	{
		// do nothing
	}
	return isPathFound;
}





// Clearing bord and also keep start and ending points
clearBoard();


// 
// 	Diskras => nearest dis from start
// 	Greedy Best-First Search estimates the distance to the goal point. 
// 	A* is using the sum of those two costOf.
// 	//https://www.redblobgames.com/pathfinding/a-star/introduction.html
// 



// Greedy-First Search is primarily used for heuristic-guided search, while Dijkstra's algorithm is specifically designed for finding the shortest path in weighted graphs.

function AStar() {

	/*
	      A* is an informed search algorithm that efficiently finds the shortest path in a graph by using a combination of path cost and heuristic estimates. 
	      It balances between exploration and exploitation to guide its search and is widely used in various applications that require efficient pathfinding.
	*/


	var isPathFound = false;                                        //isPthFound False
	var minimumHeap = new minHeap();                                //Initializing minHeap
	var tempCostOfTheBock=0;
	var prev = creatPrevIndexTable(); //creatPrevIndexTable
	var costs = creatDistanceMatrix();//DistanceMatrix
	if(isErrorOccure==true)
	{
		return false;
	}
	else
	{

		if(isInProcess==true)
		{
			var visited = makeVisitedMatrix();
			var costOf = creatDistanceMatrix();    //creating another array costOf
		}
		else
		{
			return;
		}
		costOf[startCell[0]][startCell[1]] = 0;     //Initializing by the starting node
		costs[startCell[0]][startCell[1]] = 0;      //starting nODE Distance would be 0

		minimumHeap.push([0, [startCell[0], startCell[1]]]);                          
		animateThisCells.push([[startCell[0], startCell[1]], "searching"]);
		

		while (minimumHeap.isEmpty()==false) 
		{
			var cell = minimumHeap.getMin();  //getting minimum Distance from the top of the minHeap
			var i = cell[1][0];
			var j = cell[1][1];

			if (visited[i][j]==false) 
			{ 
				visited[i][j] = true;
				animateThisCells.push([[i, j], "visited"]);


				if (isInProcess==true&&i == endCell[0] && j == endCell[1]) 
				{
					isPathFound = true;    //if it is target node
					break;
				}
				var answer = getNextValidBlock(i, j);   //generate all blocks to move
				for (var k = 1; k <= answer.length; k++) {
					var m = answer[k-1][0];
					var n = answer[k-1][1];
					if(visited[m][n]==false) 
					{ 
						var newDistance = costOf[i][j] + 1;                     //considering newDistance as (prevDistance+1)
						if (isInProcess==true&&newDistance < costOf[m][n]) 
						{
							costOf[m][n] = newDistance;                      //if newDistance < costOf[m][n]
							prev[m][n] = [i, j];
							var tempIndex=[m,n];
							animateThisCells.push([tempIndex, "searching"]);
						}
						var xDist=Math.abs(endCell[0] - m)                  //calculating the heuristic value for the new point 
						var yDist=Math.abs(endCell[1] - n);
						var newCost = costOf[i][j] + xDist + yDist;
						tempCostOfTheBock=newCost;
						if (isInProcess==true&&tempCostOfTheBock < costs[m][n]) 
						{
							costs[m][n] = newCost;
							minimumHeap.push([newCost, [m, n]]);
						}
					}
					else
					{
						continue; 
					}
				}
			}
			else
			{	
				continue; 
			}
			
		}
		while (minimumHeap.isEmpty()!=true) {

			//after visiting all the possible nodes
			//if target found or not found make animate of all visited cells
			var cell = minimumHeap.getMin();
			var i = cell[1][0];
			var j = cell[1][1];
			if (visited[i][j]==false)
			{ 
				visited[i][j] = true;
				
				animateThisCells.push([[i, j], "visited"]);
			}
			else
			{
				continue; 
			}
			
		}



		if (isPathFound==false)
		{
			
		}
		else
		{	

			//success while finding the path 
			var j = endCell[1];
			var i = endCell[0];
			if(isInProcess==false)
			{
				isErrorOccure=true;
			}
			animateThisCells.push([endCell, "success"]);

			while (prev[i][j] != null) 
			{
				if(isErrorOccure==true)
				{
					console.log("Error");
				}
				var prevCell = prev[i][j];
				i = prevCell[0];
				j = prevCell[1];
				if(isInProcess==true)
				{
					animateThisCells.push([[i, j], "success"]);
				}
				else
				{

				}
			}
		}
		return isPathFound;
	}
}


