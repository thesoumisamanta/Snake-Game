//variables
let snakeVelocity = {
    x: 0,
    y: 0
}
const foodSound = new Audio('food.mp3')
const gameOverSound = new Audio('gameover.mp3')
const moveSound = new Audio('move.mp3')
const music = new Audio('music.mp3')

let speed = 10
let baseSpeed = 10
let score = 0
let lastPaintTime = 0
let snakeArr = [
    {
        x: 13,
        y: 15
    }
]

food = {
    x: 5,
    y: 7
}

const foodImages = [
    'images/apple.png',
    'images/grapes.png',
    'images/orange.png',
    'images/pineapple.avif',
    'images/strawberry.png',
    'images/mango.png',
    'images/green.png',
]

const preLoadedFoodImages = foodImages.map(src => {
    const img = new Image()
    img.src = src
    return img
})

let currentFoodImage = foodImages[0]

const board = document.getElementById('board')
const userScore = document.getElementById('userScore')
const highestScore = document.getElementById('highestScore')
const gameOverModal = document.getElementById('game-over-modal')
const playAgainBtn = document.getElementById('play-again-btn')
const finalScoreElement = document.getElementById('final-score')
const levelSelector = document.getElementById('game-level')

const btnUp = document.getElementById('btn-up')
const btnDown = document.getElementById('btn-down')
const btnLeft = document.getElementById('btn-left')
const btnRight = document.getElementById('btn-right')

//level selection
levelSelector.addEventListener('change', (e) => {
    speed = parseInt(e.target.value);
    baseSpeed = speed
});

//game
const main = (currentTime) => {
    window.requestAnimationFrame(main)
    if ((currentTime - lastPaintTime) / 1000 < 1 / speed) {
        return
    }

    lastPaintTime = currentTime
    gameEngine()
}

const isCollide = (snake) => {

    //snake hit itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true
        }
    }

    //snake hit the wall
    if ((snake[0].x > 18) || (snake[0].x < 1) || (snake[0].y > 18) || (snake[0].y < 1)) {
        return true
    }

    return false

}

const gameEngine = () => {

    //display the snake
    board.innerHTML = ''
    snakeArr.forEach((element, index) => {
        snakeElement = document.createElement('div')
        snakeElement.style.gridRowStart = element.y
        snakeElement.style.gridColumnStart = element.x

        if (index === 0) {
            snakeElement.classList.add('head')
        } else {
            snakeElement.classList.add('snake')
        }

        board.appendChild(snakeElement)
    })

    //display food
    foodElement = document.createElement('div')
    foodElement.style.gridRowStart = food.y
    foodElement.style.gridColumnStart = food.x
    foodElement.classList.add('food')
    
    foodElement.style.backgroundImage = `url(${currentFoodImage})`
    foodElement.style.backgroundSize = 'cover'
    foodElement.style.backgroundposition = 'center'
    board.appendChild(foodElement)


    //if the snak hit the wall or itself
    if (isCollide(snakeArr)) {
        gameOver()
    }

    //snake eaten the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play()
        score += 1

        if(score % 10 === 0){
            speed += 2
            levelSelector.value = baseSpeed
        }

        if (score > highScoreValue) {
            highScoreValue = score
            localStorage.setItem("highScore", JSON.stringify(highScoreValue))
            highestScore.innerHTML = 'Highest Score: ' + highScoreValue
        }
        userScore.innerHTML = 'Score: ' + score
        snakeArr.unshift({
            x: snakeArr[0].x + snakeVelocity.x,
            y: snakeArr[0].y + snakeVelocity.y
        })
        let a = 2
        let b = 16

        //food will not appear within the snake body
        do {
            food = {
                x: Math.round(a + (b - a) * Math.random()),
                y: Math.round(a + (b - a) * Math.random())
            }

            currentFoodImage = foodImages[Math.floor(Math.random()* foodImages.length)]
        } while (snakeArr.some(segment => segment.x === food.x && segment.y === food.y));
    }

    //moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] }
    }

    snakeArr[0].x += snakeVelocity.x
    snakeArr[0].y += snakeVelocity.y

}

//gameOver
const gameOver = () => {
    gameOverSound.play()
    music.pause()
    snakeVelocity = {
        x: 0,
        y: 0
    }

    finalScoreElement.textContent = `Your Score: ${score}`
    gameOverModal.style.display = 'flex'
}

//reset the game
const resetGame = () => {
    snakeArr = [
        {
            x: 13,
            y: 15
        }
    ]
    snakeVelocity = {
        x: 0, 
        y: 0
    }
    score = 0
    speed = baseSpeed
    userScore.innerHTML = 'Score: 0'
    music.play()
    gameOverModal.style.display = 'none'

    food = {
        x: 3,
        y: 8
    }
    currentFoodImage = foodImages[Math.floor(Math.random() * foodImages.length)]

    levelSelector.value = baseSpeed
}

//initial speed
window.addEventListener('load', () => {
    speed = 10
    baseSpeed = 10
    document.getElementById('game-level').value = "10"
})

//main
let highScore = localStorage.getItem("highScore");
if (highScore === null) {
    highScoreValue = 0;
    localStorage.setItem("highScore", JSON.stringify(highScoreValue));
} else {
    // Make sure the value is valid JSON
    try {
        highScoreValue = JSON.parse(highScore);
        highestScore.innerHTML = 'Highest Score: ' + highScoreValue;
    } catch (error) {
        // If parsing fails, set the high score to 0
        highScoreValue = 0;
        localStorage.setItem("highScore", JSON.stringify(highScoreValue));
        highestScore.innerHTML = 'Highest Score: ' + highScoreValue;
    }
}

window.requestAnimationFrame(main)

//keyDown controls
window.addEventListener('keydown', (e) => {

    e.preventDefault()
    moveSound.play()
    switch (e.key) {
        case "ArrowUp":
            if (snakeVelocity.y !== 1) {
                snakeVelocity.x = 0;
                snakeVelocity.y = -1;
            }
            break;
        case "ArrowDown":
            if (snakeVelocity.y !== -1) {
                snakeVelocity.x = 0;
                snakeVelocity.y = 1;
            }
            break;
        case "ArrowLeft":
            if (snakeVelocity.x !== 1) {
                snakeVelocity.x = -1;
                snakeVelocity.y = 0;
            }
            break;
        case "ArrowRight":
            if (snakeVelocity.x !== -1) {
                snakeVelocity.x = 1;
                snakeVelocity.y = 0;
            }
            break;
        default: 
            return;
    }
});

//Mobile controls
btnUp.addEventListener('click', () => {
    moveSound.play()
    if (snakeVelocity.y !== 1) {
        snakeVelocity.x = 0;
        snakeVelocity.y = -1;
    }
})

btnDown.addEventListener('click', () => {
    moveSound.play()
    if (snakeVelocity.y !== -1) {
        snakeVelocity.x = 0;
        snakeVelocity.y = 1;
    }
})

btnLeft.addEventListener('click', () => {
    moveSound.play()
    if (snakeVelocity.x !== 1) {
        snakeVelocity.x = -1;
        snakeVelocity.y = 0;
    }
})

btnRight.addEventListener('click', () => {
    moveSound.play();
    if (snakeVelocity.x !== -1) {
        snakeVelocity.x = 1;
        snakeVelocity.y = 0;
    }
});

playAgainBtn.addEventListener('click', resetGame)