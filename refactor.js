document.addEventListener('DOMContentLoaded', () => {

  const grid = document.querySelector('.grid')
  const score = document.querySelector('.score')
  const health = document.querySelector('.health')
  const width = 16
  const squares = []
  let gameInPlay = true
  let spaceship = 249
  let alienMove = 0
  let scoreTotal = 0
  let loseLife = 5
  let alienArray = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
    32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43
  ]

  // **************************** GRID *****************************

  for(let i = 0; i < width * width; i++) {
    const square = document.createElement('div')
    squares.push(square)
    grid.appendChild(square)
  }

  // *************************** ALIENS ****************************

  // Add .alien class to all the elements in the array.
  alienArray.forEach(alienIndex => {
    squares[alienIndex].classList.add('alien')
  })

  // Aliens move right x4 down x1 left x4 down x1 (repeat)
  const alienMovement = [1, 1, 1, 1, width, -1, -1, -1, -1, width]
  const alienInterval = setInterval(() => { // set interval

    alienArray.forEach((alienIndex) => { // loop through
      squares[alienIndex].classList.remove('alien')
    })

    alienArray = alienArray.map((alienIndex) => alienIndex + alienMovement[alienMove])

    alienArray.forEach((alienIndex) => {
      squares[alienIndex].classList.add('alien')
    })

    alienMove++

    if (alienMove === alienMovement.length) alienMove = 0

    if (alienArray.some(alienIndex => alienIndex >= 240)) clearInterval(alienInterval)
  }, 500)


  // ********************** SPACESHIP FUNCTION **********************

  squares[spaceship].classList.add('spaceship')

  function spaceshipInPlay() {
    const spaceshipPos = squares.find(square =>
      square.classList.contains('spaceship'))
    spaceshipPos.classList.remove('spaceship')
    squares[spaceship].classList.add('spaceship')

  }

  // ************************** BOMB FUNCTION ***********************

  function randomAlien(){
    console.log('random alien selected')
    return alienArray[Math.floor(Math.random() * alienArray.length)]
  }

  function bombDrop(shooter, direction, className, speed) {
    if (gameInPlay) {
      const bombInterval = setInterval(() => {
        if (shooter + direction <= 255) {
          squares[shooter].classList.remove(className)
          shooter += direction
          squares[shooter].classList.add(className)
        } else squares[shooter].classList.remove(className)
        if (squares[shooter].classList.contains('spaceship')) {
          loseLife--
          health.innerText = loseLife
          squares[shooter].classList.remove(className)
          clearInterval(bombInterval)
          squares[shooter].classList.add('spaceshipExp')
          setTimeout(() => {
            squares[shooter].classList.remove('spaceshipExp')
          }, 1000)
        }
      }, speed)
    } else return
  }

  setInterval(() => {
    const alien = randomAlien()
    bombDrop(alien, width, 'bomb', 200)
  }, 2000)

  // ************************ END GAME FUNCTION ************************

  // function endGame() {
  //   if (loseLife === 0) {
  //     clearInterval(alienInterval)
  //     clearInterval(randomAlienInterval)
  //     clearInterval(bombInterval)
  //      health.innerText = 'You Dead!'
  //      let gameInPlay = false
  //      alienArray.forEach(alienIndex => {
  //      squares[alienIndex].classList.remove('alien')
  //  })
  //   }
  // }

  // ******************** SPACESHIP EVENT LISTENER ********************

  document.addEventListener('keydown', (e) => {
    if (gameInPlay) {
      switch(e.keyCode) {
        case 37:
          // left
          if(spaceship % width > 0) {
            spaceship--
            spaceshipInPlay()
          }
          break

        case 39:
          // right
          if(spaceship % width < width - 1) {
            spaceship++
            spaceshipInPlay()
          }
          break
      }
    } else return
  })

  // ******************** BULLETS EVENT LISTENER **********************

  document.addEventListener('keydown', (e) => {
    if (gameInPlay) {
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
    } else return
  })

  bombDrop()
  endGame()

})
