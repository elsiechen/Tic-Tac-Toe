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
    }

    return { getBoard, putMarker, printBoard };
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

function gameController(playerOne, playerTwo) {
    const board = gameBoard();

    const players = [
        {
            name: playerOne,
            marker: 1
        },
        {
            name: playerTwo,
            marker: 2
        }
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

    const playRound = (row, column) => {
        console.log(`Put ${ getActivePlayer().name }'s marker on 
            row ${ row } and column ${ column }`);
        
        board.putMarker(row, column, getActivePlayer().marker);

        switchPlayerTurn();
        printNewRound();
    };
    // Initial play game message
    printNewRound();

    return { getActivePlayer, playRound};
}

const game = gameController('playerOne', 'playerTwo');

// game();
