window.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < 9; i++) {
        let squareElement = document.createElement('div');
        squareElement.classList.add('tile');
        document.querySelector('.container').appendChild(squareElement);
    }

    const squares = Array.from(document.querySelectorAll('.tile'));
    const whosTurn = document.querySelector('.display-player');
    const resetBtn = document.querySelector('#reset');
    const avatars = Array.from(document.querySelectorAll('.avatar-icon'));
    const avatarContainer = Array.from(document.querySelectorAll('.avatar-container'));
    const winnerAnnounce = document.querySelector('.announcer');

    let gameSquares = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;

    const tie = 'TIE';
    const playerX_won = 'PLAYERX_WON';
    const playerO_won = 'PLAYERO_WON';

    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const checkWin = () => {
        let isRoundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningCombos[i];
            const a = gameSquares[winCondition[0]];
            const b = gameSquares[winCondition[1]];
            const c = gameSquares[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                isRoundWon = true;
                break;
            }
        }

    if (isRoundWon) {
            showWinner(currentPlayer === 'X' ? playerX_won : playerO_won);
            isGameActive = false;
            return;
        }

    if (!gameSquares.includes('')) {
        showWinner(tie); 
    }
    }

    const showWinner = (type) => {
        switch(type) {
            case playerO_won:
                winnerAnnounce.innerHTML = 'Player <span class="playerO">O</span> Won';
                break;
            case playerX_won:
                winnerAnnounce.innerHTML = 'Player <span class="playerX">X</span> Won';
                break;
            case tie:
                winnerAnnounce.innerText = 'Tie';
        }

        winnerAnnounce.classList.remove('hide');
    };

    const validateSquare = square => {
        if (square.innerText === 'X' || square.innerText === 'O'){
            return false;
        }

        return true;
    };

    const boardUpdate = index => {
        gameSquares[index] = currentPlayer;
    }

    const playerChange = () => {
        whosTurn.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        whosTurn.innerText = currentPlayer;
        whosTurn.classList.add(`player${currentPlayer}`);
    }

    const actionHandler = (square, index) => {
        if(validateSquare(square) && isGameActive) {
            square.innerText = currentPlayer;
            square.classList.add(`player${currentPlayer}`);
            boardUpdate(index);
            checkWin();
            playerChange();
        }
    }
    
    const gameReset = () => {
        gameSquares = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        winnerAnnounce.classList.add('hide');

        if (currentPlayer === 'O') {
            playerChange();
        }

        squares.forEach(square => {
            square.innerText = '';
            square.classList.remove('playerX');
            square.classList.remove('playerO');
        });

        resetBtn.blur();
    }

    const container = document.querySelector('.container'); 
 
    container.addEventListener('click', (e) => { 
        const index = squares.findIndex((i) => i === e.target); 
        actionHandler(e.target, index); 
    }); 

    resetBtn.addEventListener('click', gameReset);

    avatars.forEach(el => {
        el.setAttribute('draggable', 'true');
        el.ondragstart = drag;
    })

    let firstAvatarContainer = avatarContainer[0];
    let secondAvatarContainer = avatarContainer[1];

    firstAvatarContainer.addEventListener('dragover', allowDrop);
    secondAvatarContainer.addEventListener('dragover', allowDrop);

    function allowDrop(event) {
        event.preventDefault();
    }

    function drag(event) {
        event.dataTransfer.setData('id', event.target.dataset.item)
    }

    firstAvatarContainer.addEventListener('drop', drop, { once: true }); 
    secondAvatarContainer.addEventListener('drop', drop, { once: true }); 

    function drop(event) {
        let itemId = event.dataTransfer.getData('id');
        event.target.appendChild(document.querySelector(`[data-item~="${itemId}"]`));
    }

    let count = 0;
    document.addEventListener('keydown', (e) => {
        let pressedKey = e.key;
        if (pressedKey === 'ArrowRight') {
            if (count >= 9) {
                count = 9;
                squares[count - 1].style.backgroundColor = 'gray';
            } else {
                if (count > 0) {
                    squares[count - 1].style.backgroundColor = '#12181B';
                }
                squares[count].style.backgroundColor = 'gray';
                count++;
            }
        }
        if (pressedKey === 'ArrowLeft') {
            if (count <= 1) {
                count = 1;
                squares[count - 1].style.backgroundColor = 'gray';
            } else {
                count--;
                squares[count].style.backgroundColor = '#12181B';
                squares[count - 1].style.backgroundColor = 'gray';
            }
            
        }
        
        if (pressedKey === 'Enter') { 
            let isEnterAllowed = squares.some(el => el.style.backgroundColor === 'gray');
            if (isEnterAllowed) {
                actionHandler(squares[count - 1], count); 
            } else {
                alert('Pick a tile');
            }
            
        }
        
     })
});