(() => {
  const grid = document.querySelector('.grid');
  const scoreDisplay = document.querySelector('#score');
  const startBtn = document.querySelector('#start-button');
  const newGameBtn = document.querySelector('#new-button');
  const displaySquares = document.querySelectorAll('.mini-grid div');
  const scoresBox = document.querySelector('#scores-box');
  const levelSpan = document.querySelector('#level');
  const width = 10;
  const displayWidth = 4;
  const displayIndex = 0;
  let level = 1
  let speed = 1000;

  //Piezas
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ];

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ];

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ];

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ];

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ];

  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
  ];


  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

  const colors = [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
  ];

  let squares = Array.from(document.querySelectorAll('.grid div'))
  let nextRandom = 0;
  let currentPosition = 4;
  let currentRotation = 0;
  let timerId;
  let levelTimer;
  let score = 0;
 
  let random = Math.floor(Math.random()*theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];
  
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''

    })
  }

  function control(e) {
    if(grid.classList.contains('over')) return;
    if(e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      dropDown();
    }
  }

  function dropDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //start a new round
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    if(!isAtLeftEdge) currentPosition -=1;
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition +=1;
    }
    draw();
  }

  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1);
    if(!isAtRightEdge) currentPosition +=1;
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1;
    }
    draw();
  }

  
  ///FIX ROTATION OF TETROMINOS A THE EDGE 
  function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)  ;
  }
  
  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0);
  }
  
  function checkRotatedPosition(P){
    P = P || currentPosition; 
    if ((P+1) % width < 4) {      
      if (isAtRight()){           
        currentPosition += 1;    
        checkRotatedPosition(P); 
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1;
      checkRotatedPosition(P);
      }
    }
  }
  
  //rotate the tetromino
  function rotate() {
    undraw();
    currentRotation ++;
    if(currentRotation === current.length) {
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    checkRotatedPosition();
    draw();
  }

  //display the shape in the mini-grid display
  function displayShape() {
    displaySquares.forEach(square => {
      square.classList.remove('tetromino');
      square.style.backgroundColor = '';
    })
    upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetromino');
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
    })
  }

  //add score
  function addScore() {
    for (let i = 0; i < 199; i +=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

      if(row.every(index => squares[index].classList.contains('taken'))) {
        score +=10;
        scoreDisplay.innerHTML = score;
        row.forEach(index => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
          squares[index].style.backgroundColor = '';
        })
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
      }
    }
  }

  //game over
  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      newGameBtn.style.display = 'block';
      startBtn.style.display = 'none'
      grid.classList.add('over');
      scoreDisplay.innerHTML = 'Game over with ' + score + ' points !!';
      clearInterval(timerId);
      const previousScore = JSON.parse(localStorage.getItem('score')) || '';
      localStorage.setItem('score', JSON.stringify(previousScore+ ',' + score ));
    }
  }

  function increaseLevel() {
    speed = speed - 200 <= 100 ?  100 : speed - 200;
    clearInterval(timerId);
    timerId = setInterval(dropDown, speed);
    level = level + 1 >= 4 ? 4 : level + 1;
    levelSpan.innerText = level
  }

  function getScores() {
    return JSON.parse(localStorage.getItem('score')).split(',').sort().reverse().filter(elem => elem !== '').splice(0, 9)
  }

  function displayScores() {
    levelSpan.innerText = level
    const prevScores = getScores();
    prevScores.sort((a, b) => a -b).reverse().forEach((score, index) => {
      const singleScore = document.createElement('li');               
      singleScore.classList.add('single-score');
      singleScore.innerText = `${index + 1}º. ${score} points`

      scoresBox.appendChild(singleScore)
    })
  }

  document.addEventListener('keyup', control)

  //add functionality to the button
  startBtn.addEventListener('click', () => {
    if (timerId) {
      grid.classList.remove('over')
      grid.classList.add('pause');

      clearInterval(timerId);
      clearInterval(levelTimer);
      timerId = null;
    } else {
      grid.classList.remove('pause');
      draw();
      timerId = setInterval(dropDown, speed);
      levelTimer = setInterval(increaseLevel, 40000)
      displayShape();
    }
  })

  newGameBtn.addEventListener('click', () => {
    location.reload();
  })

  displayScores()
  
})()