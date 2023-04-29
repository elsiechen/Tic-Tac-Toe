function gameBoard () {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            // Important: push object cell() instead of value 0
            board[i].push(cell());
        }
    }

    const getBoard = () => board;

    const putMarker = (row, column, playerMarker) => {
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

    const addMarker = playerMarker => {
        value = playerMarker;
    };

    const getValue = () => value;

    return { addMarker, getValue };
}

function gameController(playerOne, playerTwo) 
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
        console.log(win);
        return win;
    };

    const printWin = () => {
        const win = checkIfWin();
        // find empty cell
        const array = board.getBoard();
        // const findZero = array.filter(row => row.map( cell => cell === 0));
        let findMarker = 0;
        for (let i = 0; i < array.length; i++){
            for(let j = 0; j < array[i].length; j++){
                // console.log(array[i][j].getValue());
                if(array[i][j].getValue() !== 0) findMarker++;
            }
        }
        console.log(findMarker);
        console.log(win);
        if(win === true){
            printNewRound();
            console.log(`${getActivePlayer().name} is the winner.`);
            return;
        }
        else if(findMarker === board.rows * board.columns){
            printNewRound();
            console.log('Draw');
            return;
        }
        switchPlayerTurn();
        printNewRound();
        console.log('Still playing...')
    };

    const playRound = (row, column) => {
        console.log(`Put ${ getActivePlayer().name }'s marker on 
            row ${ row } and column ${ column }`);
        
        board.putMarker(row, column, getActivePlayer().marker);

        printWin();
        // switchPlayerTurn();
        // printNewRound();
    };

    // Initial play game message
    printNewRound();
    return { getActivePlayer, playRound };
}

const game = gameController('playerOne', 'playerTwo');

