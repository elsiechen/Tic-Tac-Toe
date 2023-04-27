var content = document.querySelector('.content');

const gameBoard = (() => {
    let gameBoard = ['X', 'O'];
    const renderGameBoard = () => {
        for(let i=0; i<gameBoard.length; i++){
            const div = document.createElement('div');
            div.textContent = gameBoard[i];
            content.appendChild(div);
        }
    };
    return { renderGameBoard };
})();
// render the contents of the gameboard array to the webpage 
gameBoard.renderGameBoard();

// const Player = () => {

// };

// const displayController = (() => {

// })();
