document.addEventListener('DOMContentLoaded', () => {

  // ************************* variables **************************

  const startPage = document.querySelector('.start-page')
  const startButton = document.getElementById('start-button')
  const startAgain = document.querySelector('.start-again')
  const countdownDiv = document.querySelector('.countdown')
  const grid = document.querySelector('.grid')
  const score = document.querySelector('.score')
  const livesDiv = document.querySelector('.lives')
  const endScore = document.querySelector('.end-score')
  const restartButton = document.getElementById('restart')
  const gameOver = document.querySelector('.game-over')
  const scoreBoard = document.querySelector('.score-board')
  const winOrLose = document.querySelector('.win-or-lose')
  const width = 16
  const squares = []
  const alienMovement = [1, 1, 1, 1, width, -1, -1, -1, -1, width] // right x4 down left x4 down (repeat)
  const alienStart = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
    32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43
  ]
  let alienArray = alienStart.slice()
  let alienInterval
  let spaceship = 249
  let bombSelectionInterval
  let alienMove = 0
  let scoreTotal = 0
  let lives = 3
  let gameInPlay = false
  let timeLeft

  // ***************************** COUNTDOWN ***************************
  function startTimer() {
    countdownDiv.classList.remove('hidden')
    startPage.classList.add('hidden')
    startAgain.classList.add('hidden')
    countdownDiv.classList.remove('hidden')
    timeLeft = 3
    countdownDiv.innerText = timeLeft
    const countdown  = setInterval(() => {
      timeLeft--
      countdownDiv.innerText = timeLeft
      if(timeLeft <=0) {
        clearInterval(countdown)
        startGame()
      }
    }, 1000)
  }

  // *************************** ALIENS ****************************

  // Add alien class
  function createAliens() {
    alienArray.forEach(alienIndex => {
      squares[alienIndex].classList.add('alien')
    })
  }
  // move aliens
  function moveAliens() { // set interval
    alienArray.forEach((alienIndex) => { // loop through
      squares[alienIndex].classList.remove('alien')
    })

    alienArray = alienArray.map((alienIndex) => alienIndex + alienMovement[alienMove])

    alienArray.forEach((alienIndex) => {
      squares[alienIndex].classList.add('alien')
    })

    alienMove++
    if (alienMove === alienMovement.length) alienMove = 0
    if (alienArray.some(alienIndex => alienIndex >= 240)) {
      return lostGame()
    }
  }

  // **************************** GRID *****************************

  for(let i = 0; i < width * width; i++) {
    const square = document.createElement('div')
    squares.push(square)
    grid.appendChild(square)
  }

  // ************************** SPACESHIP **************************

  function createSpaceship() {
    squares[spaceship].classList.add('spaceship')
  }

  function moveSpaceship(direction) {
    squares[spaceship].classList.remove('spaceship')
    spaceship += direction
    squares[spaceship].classList.add('spaceship')
  }

  // ************************** SPACESHIP **************************

  function handleSpaceshipMove(e) {
    switch(e.keyCode) {
      case 37:
        // left
        if(spaceship % width > 0) {
          moveSpaceship(-1)
        }
        break

      case 39:
        // right
        if(spaceship % width < width - 1) {
          moveSpaceship(+1)
        }
        break
    }
  }

  // *************************** BULLETS **************************

  function handleShootBullet(e) {
    console.log('shooty mcshoot')
    let bulletIndex = spaceship
    if (e.keyCode === 32) {
      e.preventDefault()
      const bulletInterval = setInterval(() => {
        if(bulletIndex - width >= 0) {
          squares[bulletIndex].classList.remove('bullet')
          bulletIndex -= width
          squares[bulletIndex].classList.add('bullet')
        } else {
          squares[bulletIndex].classList.remove('bullet')
        }
        if (squares[bulletIndex].classList.contains('alien')) {
          clearInterval(bulletInterval)
          squares[bulletIndex].classList.remove('bullet')
          scoreTotal++
          score.innerText = scoreTotal
          const alienPos = alienArray.indexOf(bulletIndex)
          alienArray.splice(alienPos, 1)
          squares[bulletIndex].classList.remove('alien')
          squares[bulletIndex].classList.add('alienExp')
          setTimeout(() => {
            squares[bulletIndex].classList.remove('alienExp')
          }, 500)
          if (alienArray.length === 0) {
            wonGame()
          }
        }
        if(!gameInPlay) clearInterval(bulletInterval)
      }, 200)
    }
  }

  // **************************** BOMB ***************************

  function BombAllocation() {
    let randomAlien = alienArray[Math.floor(Math.random() * alienArray.length)]

    const bombInterval = setInterval(() => {
      if(!gameInPlay) clearInterval(bombInterval)
      // if (randomAlien + width <= 255) {
      squares[randomAlien].classList.remove('bomb')
      randomAlien += width
      squares[randomAlien].classList.add('bomb')
      // } else {
      //   squares[randomAlien].classList.remove('bomb')
      // }
      if (squares[randomAlien].classList.contains('spaceship')) {
        squares[randomAlien].classList.remove('bomb')
        clearInterval(bombInterval)
        squares[randomAlien].classList.add('spaceshipExp')
        setTimeout(() => {
          squares[randomAlien].classList.remove('spaceshipExp')
        }, 500)
        loseLife()
        if (lives === 0) {
          clearInterval(alienInterval)
          clearInterval(bombInterval)
          return lostGame()
        }
      }
    }, 100)
  }

  // ********************** LIFE **********************

  function loseLife() {
    lives--
    livesDiv.innerText = lives
  }

  // ************************ START GAME ***********************

  function startGame() {
    countdownDiv.classList.add('hidden')
    clearIntervals()
    gameInPlay = true
    squares.forEach(square => {
      square.classList.remove('alien', 'alienExp', 'spaceship', 'spaceshipExp', 'bullet', 'bomb')
    })
    scoreBoard.classList.remove('hidden')
    alienArray = alienStart.slice()
    spaceship = 249
    alienMove = 0
    scoreTotal = 0
    score.innerText = scoreTotal
    lives = 3
    livesDiv.innerText = lives
    createAliens()
    bombSelectionInterval = setInterval(BombAllocation, 500)
    alienInterval = setInterval(moveAliens, 300)
    moveAliens()
    BombAllocation()
    createSpaceship()
    scoreBoard.classList.remove('hidden')
    grid.classList.remove('hidden')
  }

  // ************************ END GAME ************************
  function clearIntervals(){
    clearInterval(alienInterval)
    clearInterval(bombSelectionInterval)
  }

  function endGame() {
    gameInPlay = false
    clearIntervals()
    grid.classList.add('hidden')
    scoreBoard.classList.add('hidden')
    gameOver.innerText = 'Game Over!'
    endScore.innerText = `You Scored: ${scoreTotal}`
    startAgain.classList.remove('hidden')
    restartButton.classList.remove('hidden')
    restartButton.innerText = 'Play again?'
  }

  function lostGame() {
    endGame()
    winOrLose.innerText = 'Uh Ohh. You Dead!'
  }

  function wonGame() {
    endGame()
    winOrLose.innerText = 'Congratulations you defeated all the Aliens!'
  }

  // ********************* Event Listeners *********************

  document.addEventListener('keydown', handleSpaceshipMove)
  document.addEventListener('keydown', handleShootBullet)

  startButton.addEventListener('click', startTimer)
  restartButton.addEventListener('click', startTimer)
})
