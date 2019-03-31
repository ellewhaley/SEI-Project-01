document.addEventListener('DOMContentLoaded', () => {
  console.log('JS Loaded')
  const grid = document.querySelector('.grid')
  const width = 16
  const height = 16
  const squares = []
  let gameInPlay = true
  let spaceship = 249
  let bulletIndex = 0


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

  setInterval(() => {
    alienArray.forEach((alienIndex) => {
      squares[alienIndex].classList.remove('alien')
    })
    // 5. get all aliens moving right - forEach (%)
    alienArray = alienArray.map((alienIndex) => alienIndex + 1)

    alienArray.forEach((alienIndex) => {
      squares[alienIndex].classList.add('alien')
    })
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

//BULLETS

  document.addEventListener('keydown', (e) => {
    let bulletIndex = spaceship
    if (e.keyCode === 32) {

      setInterval(() => {
        if(bulletIndex - width >= 0) {
          squares[bulletIndex].classList.remove('bullet')
          bulletIndex -= width
          squares[bulletIndex].classList.add('bullet')
        } else {
          squares[bulletIndex].classList.remove('bullet')
        }
      }, 200)
    }
  })

})
