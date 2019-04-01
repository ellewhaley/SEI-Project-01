document.addEventListener('DOMContentLoaded', () => {
  console.log('JS Loaded')
  const grid = document.querySelector('.grid')
  const width = 16
  const height = 16
  const squares = []
  let gameInPlay = true
  let spaceship = 249
  let alienMove = 0

// ALIEN

  // 1. Create a grid
  for(let i = 0; i < width * width; i++) {
    const square = document.createElement('div')
    squares.push(square)
    grid.appendChild(square)
  }

  // 2. create an array for the aliens to be stored in
  let alienArray = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
    32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43
  ]

  // 3. create a forEach to add the .alien class to all the elements in the array.
  alienArray.forEach(alienIndex => {
    squares[alienIndex].classList.add('alien')
  })

  const alienMovement = [1, 1, 1, 1, width, -1, -1, -1, -1, width]
  // set interval
  const alienInterval = setInterval(() => {
    // loop through
    alienArray.forEach((alienIndex) => {
      squares[alienIndex].classList.remove('alien')
    })

    // 5. get all aliens moving right - forEach (%)
    alienArray = alienArray.map((alienIndex) => alienIndex + alienMovement[alienMove])

    alienArray.forEach((alienIndex) => {
      squares[alienIndex].classList.add('alien')
    })

    alienMove++

    if (alienMove === alienMovement.length) alienMove = 0

    if (alienArray.some(alienIndex => alienIndex >= 240)) clearInterval(alienInterval)
  }, 500)

// 6. get aliens moving down.

// SPACESHIP

  squares[spaceship].classList.add('spaceship')

  function spaceshipInPlay() {
    const spaceshipPos = squares.find(square =>
      square.classList.contains('spaceship'))
    spaceshipPos.classList.remove('spaceship')
    squares[spaceship].classList.add('spaceship')
  }

  document.addEventListener('keydown', (e) => {
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
  })

 // BULLETS

  document.addEventListener('keydown', (e) => {
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
          squares[bulletIndex].classList.remove('alien')
          // clearInterval(alienInterval)
        }
      }, 200)
    }
  },)

  // BOMBS

  function bombDrop() {
    setInterval(() => {
      let randomAlien = alienArray[Math.floor(Math.random() * alienArray.length)]

      setInterval(() => {
        squares[randomAlien].classList.remove('bomb')
        randomAlien += width
        squares[randomAlien].classList.add('bomb')
      }, 500)
    }, 2000)
  }

  bombDrop()






  //  Check for rocket/invader collisions.

})
