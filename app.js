document.addEventListener('DOMContentLoaded', () => {

  // ************************* variables **************************

  const startPage = document.querySelector('.start-page')
  const startButton = document.getElementById('start-button')
  const grid = document.querySelector('.grid')
  const score = document.querySelector('.score')
  const livesDiv = document.querySelector('.lives')
  const endScore = document.querySelector('.end-score')
  const startAgain = document.querySelector('.start-again')
  const restartButton = document.getElementById('restart')
  const gameOver = document.querySelector('.game-over')
  const scoreBoard = document.querySelector('.score-board')
  const width = 16
  const squares = []
  const alienMovement = [1, 1, 1, 1, width, -1, -1, -1, -1, width] // right x4 down left x4 down (repeat)
  const alienInterval = setInterval(moveAliens, 500) // let alienInterval
  const alienStart = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
    32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43
  ]
  let alienArray = alienStart
  let spaceship = 249
  let alienMove = 0
  let scoreTotal = 0
  let lives = 3

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
      return endGame()
    }
  }
  // remove alien class
  function clearAliens() {
    alienArray.forEach(alienIndex => {
      squares[alienIndex].classList.remove('alien')
    })
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
        }
      }, 200)
    }
  }

  // **************************** BOMB ***************************

  function BombAllocation() {
    setInterval(() => {
      let randomAlien = alienArray[Math.floor(Math.random() * alienArray.length)]

      const bombInterval = setInterval(() => {
        if (randomAlien + width <= 255) {
          squares[randomAlien].classList.remove('bomb')
          randomAlien += width
          squares[randomAlien].classList.add('bomb')
        } else {
          squares[randomAlien].classList.remove('bomb')
        }
        if (squares[randomAlien].classList.contains('spaceship')) {
          squares[randomAlien].classList.remove('bomb')
          clearInterval(bombInterval)
          spaceshipExplosion()
          loseLife()
          if (lives === 0) {
            clearInterval(alienInterval)
            clearInterval(bombInterval)
            return endGame()
          }
        }
      }, 500)
    }, 2000)
  }

  // ********************* SPACESHIP EXPLOSION *********************

  function spaceshipExplosion() {
    squares[spaceship].classList.add('spaceshipExp')
    setTimeout(() => {
      squares[spaceship].classList.remove('spaceshipExp')
    }, 1000)
  }

  // ********************** LIFE **********************

  function loseLife() {
    lives--
    livesDiv.innerText = lives
  }

  // ************************ START GAME ***********************

  function startGame() {
    // scoreTotal = 0 // re-set the score
    // clearAliens()// clear all alien classes
    // alienArray = alienStart // re-set the alien array
    createAliens() // apply alien classes
    moveAliens() // start the movement
    BombAllocation() // start the bombs dropping
    createSpaceship() // create spaceship
    startPage.classList.add('hidden') // hide start screen
    scoreBoard.classList.remove('hidden')
    grid.classList.remove('hidden')
  }

  // ************************ END GAME ************************

  function endGame() {
    grid.style.display = 'none'
    clearInterval(alienInterval)
    livesDiv.innerText = 'You Dead!'
    gameOver.innerText = 'Game Over!'
    endScore.innerText = `You Scored: ${scoreTotal}`
    restartButton.classList.remove('hidden')
    restartButton.innerText = 'Play again?'
    scoreBoard.classList.add('hidden')
  }

  // ********************* RESTART *****************************

  function restart(){
    scoreBoard.classList.remove('hidden')
    scoreTotal = 0 // re-set the score
    score.innerText = scoreTotal
    lives = 3 // re-set lives
    livesDiv.innerText = lives
    clearAliens()// clear all alien classes
    createAliens() // apply alien classes
    moveAliens() // start the movement
    BombAllocation() // start the bombs dropping
    createSpaceship() // create spaceship
    startAgain.classList.add('hidden') // hide end screen
    scoreBoard.classList.remove('hidden')
    grid.classList.remove('hidden')
  }

  // ********************* Event Listeners *********************

  document.addEventListener('keydown', handleSpaceshipMove)
  document.addEventListener('keydown', handleShootBullet)

  startButton.addEventListener('click', startGame)
  restartButton.addEventListener('click', restart)
})
