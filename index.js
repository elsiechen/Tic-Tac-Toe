function gameBoard () {
    const rows = 3;
    const columns = 3;
    let board = [];
    // Create nested array that represent the state of game board
    // Row 0 represent the top row and
    // column 0 represent the left-most column.
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            // Important: push object cell() instead of value 0
            board[i].push(cell());
        }
    }

    const getBoard = () => board;

    const putMarker = (row, column, playerMarker) => {
        // Put marker on the empty cell
        board[row][column].addMarker(playerMarker);
    };

    const printBoard = () => {
        const boardWithCellValues = 
            board.map(row => row.map(cell => cell.getValue()));
        console.log(boardWithCellValues);
    };

    return { rows, columns, getBoard, putMarker, printBoard };
}


//  A Cell represents one "square" on the board and can have one of
//  0: no token is in the square,
//  1: Player One's token,
//  2: Player 2's token

function cell() {
    let value = 0;
    // Add a player's marker to change the value of the cell
    const addMarker = playerMarker => {
        value = playerMarker;
    };
    // Get the current value of this cell through closure
    const getValue = () => value;

    return { addMarker, getValue };
}

// The GameController will be responsible for controlling the 
// flow and state of the game's turns, as well as whether
// anybody has won the game
function gameController(
    playerOne = 'playerOne', 
    playerTwo = 'playerTwo') 
{
    const board = gameBoard();

    const players = [
        { name: playerOne, marker: 1 }, { name: playerTwo, marker: 2 }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0]? 
            players[1]: players[0];
    }; 

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${ getActivePlayer().name }'s turn`);
    };

    const checkEqual = (firstNum, secondNum, thirdNum) => {
        let result = false;
        if(firstNum === secondNum && secondNum === thirdNum
            && firstNum !== 0 && secondNum !== 0 && thirdNum !== 0){
            result = true;
        }
        return result;
    };

    const checkIfWin = () => {
        let win = false;
        const array = board.getBoard();

        // compare three not zero numbers 
        // win situation: row
        for (let i = 0; i < board.rows; i++){
            let firstNum = array[i][0].getValue();
            let secondNum = array[i][1].getValue();
            let thirdNum = array[i][2].getValue();
            
            let ifEqual = checkEqual(firstNum, secondNum, thirdNum);
            if(ifEqual){
                win = true;
                return win;
            }
        }
        // win situation: column
        for (let j = 0; j < board.columns; j++){
            let firstNum = array[0][j].getValue();
            let secondNum = array[1][j].getValue();
            let thirdNum = array[2][j].getValue();
            
            let ifEqual = checkEqual(firstNum, secondNum, thirdNum);
            if(ifEqual){
                win = true;
                return win;
            }
        }
        // // win situation: diagonal
        let ifEqual = checkEqual(
            array[2][0].getValue(),
            array[1][1].getValue(),
            array[0][2].getValue());
        if(ifEqual){
            win = true;
            return win;
        }
        
        let ifEqualTwo = checkEqual(
            array[0][0].getValue(),
            array[1][1].getValue(),
            array[2][2].getValue());
        if(ifEqualTwo){
            win = true;
            return win;
        }
        return win;
    };

    function checkIfDraw() {
        const array = board.getBoard();
        let findMarker = 0;
        for (let i = 0; i < array.length; i++){
            for(let j = 0; j < array[i].length; j++){
                if(array[i][j].getValue() !== 0) findMarker++;
            }
        }
        if(findMarker === (board.rows * board.columns)) return true;
        else return false;
    }

    const printWin = () => {
        const win = checkIfWin();
        const draw = checkIfDraw();
        
        if(win === true){
            printNewRound();
            console.log(`${getActivePlayer().name} is the winner.`);
            return;
        }
        else if(draw){
            printNewRound();
            console.log('Draw');
            return;
        }
        switchPlayerTurn();
        printNewRound();
    };

    const playRound = (row, column) => {
        console.log(`Put ${ getActivePlayer().name }'s marker on 
            row ${ row } and column ${ column }`);
       
        // Check if cell is occupied
        const array = board.getBoard();
        let cell = array[row][column].getValue();
        if(cell !== 0) return;

        // cell isn't occupied, put marker and print
        board.putMarker(row, column, getActivePlayer().marker);     
        printWin();
    };

    // Initial play game message
    printNewRound();
    return { getActivePlayer, 
             playRound,
             checkIfWin,
             checkIfDraw,
             getBoard: board.getBoard};
}

function screenController(playerOne, playerTwo) {
    const game = gameController(playerOne, playerTwo);
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const restartBtn = document.querySelector('.restart');
    
    restartBtn.style.display = 'block';

    const updateScreen = () => {
        // clear the board
        boardDiv.textContent = '';

        // get the newest version of board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // render board screen
        board.forEach(row => {
            row.forEach((cell, columnIndex) => {
                const cellBtn = document.createElement('button');
                cellBtn.classList.add('cell');
                // change cell color for playing with ai 
                if(playerTwo === 'AI') cellBtn.classList.add('blueCell');

                // create data attribute to identify row and column
                // important: get row index
                const rowIndex = board.indexOf(row);
                cellBtn.dataset.index = `${rowIndex}-${columnIndex}`;
                cellBtn.textContent = cell.getValue();
                boardDiv.appendChild(cellBtn);
            })
        })

        // display player's turn or win or draw
        // disable cell btns if win or draw
        const cellBtns = document.querySelectorAll('.cell');
        if(game.checkIfWin()) {
            playerTurnDiv.textContent = `${activePlayer.name} is the winner.`
            playerTurnDiv.classList.add('result');
            cellBtns.forEach(btn => {
                btn.disabled = 'true';
            });
        }else if(game.checkIfDraw()){
            playerTurnDiv.textContent = 'Draw';
            playerTurnDiv.classList.add('result');
            cellBtns.forEach(btn => {
                btn.disabled = 'true';
            });
        }else {
            playerTurnDiv.textContent = `${ activePlayer.name }'s turn...`;
        }
    };
    
    if(playerTwo === 'AI') {
        boardDiv.addEventListener('click', aiClickEvent);
        restartBtn.addEventListener('click', aiRestartEvent);
    } else {
        boardDiv.addEventListener('click', clickEvent);
        restartBtn.addEventListener('click', restartEvent);
    }
    
    // Initial render screen
    updateScreen();

    function clickEvent(e) {
        const selectedCell = e.target.dataset.index;
        // make sure it's valid click
        if(!selectedCell) return;

        // get index of row and column
        const subArray = selectedCell.split('-');
        const rowIndex = subArray[0];
        const columnIndex = subArray[1]; 
        game.playRound(rowIndex, columnIndex);
        updateScreen();
    }

    function aiClickEvent(e) {
        clickEvent(e);

        // get array of available cell index
        const available = [];
        const cellElements = boardDiv.children;
        
        for(let i=0; i<cellElements.length; i++){
            if(cellElements[i].innerHTML === '0'){
                const cellIndex = cellElements[i].getAttribute('data-index');
                available.push(cellIndex);
            }
        }
        // if there's no available cell for ai, stop ai from action
        if(!available.length) return;

        // get random cell index for ai to play
        const randanIndex = Math.floor(Math.random() * available.length);
        const randomSelectedCell = available[randanIndex];
        const getArray = randomSelectedCell.split('-');
        const row = getArray[0];
        const column = getArray[1]; 
        // const aiPlay = game.playRound(row, column);
        function aiPlay(){
            game.playRound(row, column);
        }
        setTimeout(function(){
            aiPlay();
            updateScreen();
        }, 1000);

    }

    function restartEvent() {
        screenController('Ryan1', 'Rosalyn2');
    }

    function aiRestartEvent() {
        screenController('Ryan1', 'AI');
    }
    
}

// separate click event for ai and two players 
const aiBtn = document.querySelector('.ai');
const twoPlayerBtn = document.querySelector('.twoPlayer');
const restartBtn = document.querySelector('.restart');

restartBtn.style.display = 'none';

aiBtn.addEventListener('click', aiScreenController)
twoPlayerBtn.addEventListener('click', twoPlayerScreenController);

function aiScreenController() {
    screenController('Ryan1', 'AI');
}

function twoPlayerScreenController() {
    screenController('Ryan1', 'Rosalyn2');
}




