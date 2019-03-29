document.addEventListener('DOMContentLoaded', () => {
  console.log('JS Loaded')
  const grid = document.querySelector('.grid')
  const width = 16
  const height = 16
  const squares = []
  let spaceship = 0
  let gameInPlay = true

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

  // // 4. create a forEach for the squares.
  // function aliensInPlay(element, index) {
  //   setInterval(() => {
  //
  //   })
  // }


  

  setInterval(() => {
    alienArray.forEach((alienIndex) => {
      squares[alienIndex].classList.remove('alien')
    })

    alienArray = alienArray.map((alienIndex) => alienIndex + 1)

    alienArray.forEach((alienIndex) => {
      squares[alienIndex].classList.add('alien')
    })
  }, 1000)
})



  // 5. get all aliens moving right - forEach (%)

  // 6. get aliens moving down.
