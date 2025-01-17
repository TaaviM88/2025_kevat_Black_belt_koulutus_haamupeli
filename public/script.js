const BOARD_SIZE = 20;
let board; //kenttä tallennetaan tähän
let player;
const cellSize = calculateCellSize();
document.getElementById("new-game-btn").addEventListener('click',startGame);

document.addEventListener('keydown', (event) => {
  switch (event.key) {
      case 'ArrowUp':
        player.move(0, -1); // Liikuta ylös
          break;
      case 'ArrowDown':
        player.move(0, 1); // Liikuta alas
          break;
      case 'ArrowLeft':
        player.move(-1, 0); // Liikuta vasemmalle
          break;
      case 'ArrowRight':
        player.move(1, 0); // Liikuta oikealle
          break;
  }
  event.preventDefault(); // Prevent default scrolling behaviour
});



function startGame()
{
    document.getElementById('intro-screen').style.display ='none';
    document.getElementById('game-screen').style.display = 'block';

    //generate board and draw it
   

    player = new Player(0,0);
    board = generateRandomBoard();
    drawBoard(board);
}

function generateRandomBoard(){
    const newBoard = Array.from({length: BOARD_SIZE},()=> Array(BOARD_SIZE).fill(' '));
    for(let y = 0; y<BOARD_SIZE; y++){
        for(let x = 0; x< BOARD_SIZE; x++){
            if(y === 0  || y === BOARD_SIZE -1 || x === 0 || x === BOARD_SIZE -1){
                newBoard[y][x] = 'W' // W is wall
            }
        }
    }

    generateObstacles(newBoard);

    //laitetaan pelaaja fixattuun paikkaan(kova koodattu)
    //newBoard[6][7] = 'P';
    
    const [playerX, playerY] = randomEmptyPosition(newBoard);
    setCell(newBoard, playerX, playerY, 'P');
    player.x = playerX;
    player.y = playerY;
    console.log(newBoard);

    return newBoard;
}

function drawBoard(board) {
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML ='';
   // Asetetaan grid-sarakkeet ja rivit dynaamisesti BOARD_SIZE:n mukaan
  gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`; 
    
   // Luodaan jokainen ruutu
   for (let y = 0; y < BOARD_SIZE; y++) {
       for (let x = 0; x < BOARD_SIZE; x++) {
           const cell = document.createElement('div');
           cell.classList.add('cell');
           cell.style.width = cellSize + 'px';
           cell.style.height = cellSize + 'px';
           if (getCell(board,x,y) === 'W') {
            cell.classList.add('wall'); // 'W' on seinä
           }else if(getCell(board,x,y)  === 'P'){
            cell.classList.add('player');
           }
           gameBoard.appendChild(cell);
       }
   }

}

function calculateCellSize() {
  // Otetaan talteen pienempi luku ikkunan leveydestä ja korkeudesta
  const screenSize = Math.min(window.innerWidth, window.innerHeight);
  // Tehdään pelilaudasta hieman tätä pienempi, jotta jää pienet reunat
  const gameBoardSize = 0.95 * screenSize;
  // Laudan koko jaetaan ruutujen määrällä, jolloin saadaan yhden ruudun koko
  return gameBoardSize / BOARD_SIZE;
}

function generateObstacles(board) {
  // Lista esteitä koordinaattiparien listoina
  const obstacles = [
      [[0,0],[0,1],[1,0],[1,1]], // Square
      [[0,0],[0,1],[0,2],[0,3]],  // I
      [[0,0],[1,0],[2,0],[1,1]], // T
      [[1,0],[2,0],[1,1],[0,2],[1,2]], // Z
      [[1,0],[2,0],[0,1],[1,1]], // S
      [[0,0],[1,0],[1,1],[1,2]], // L
      [[0,2],[0,1],[1,1],[2,1]]  // J
  ];

  // Valitse muutama paikka esteille pelikentällä
  const positions = [
      { startX: 2, startY: 2 },
      { startX: 8, startY: 2 },
      { startX: 4, startY: 8 },
      { startX: 10, startY: 10 },
      { startX: 13, startY: 14 }
  ];

  // Käydään läpi valitut paikat ja arvotaan niihin esteet
  positions.forEach(pos => {
      const randomObstacle = obstacles[Math.floor(Math.random() * obstacles.length)];
      placeObstacle(board, randomObstacle, pos.startX, pos.startY);
  });
}

function placeObstacle(board, obstacle, startX, startY) {
  for (coordinatePair of obstacle) {
      [x,y] = coordinatePair;
      board[startY + y][startX + x] = 'W';
  }
}

function getRandomInt(min,max){
  return Math.floor(Math.random() * (max - min +1))+min;
}

function randomEmptyPosition(board) {
  x = getRandomInt(1, BOARD_SIZE - 2);
  y = getRandomInt(1, BOARD_SIZE - 2);
  if (board[y][x] === ' ') {
      return [x, y];
  } else {
      randomEmptyPosition(board);
  }
}

function setCell(board, x, y, value) {
  board[y][x] = value;
}
function getCell(board, x, y) {
  return board[y][x];
}




class Player{
  constructor(x,y)
  {
    this.x = x;
    this.y = y;
  }

   move(deltaX, deltaY) {
    // pelaajan nykyiset koordinaatit tallennetaan muuttujiin
    const currentX = player.x;
    const currentY = player.y;
  
    console.log(`Current Position: (${currentX}, ${currentY})`);
  
    // Laske uusi sijainti
    const newX = currentX + deltaX;
    const newY = currentY + deltaY;
  
    // Päivitä pelaajan sijainti
    player.x = newX;
    player.y = newY;
  
    // Päivitä pelikenttä
    board[currentY][currentX] = ' '; // Tyhjennetään vanha paikka
    board[newY][newX] = 'P'; // Asetetaan uusi paikka
  
    drawBoard(board);
  }
}