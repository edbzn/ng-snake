import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  afterRender,
} from '@angular/core';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  template: `
    <canvas #game width="800" height="600"></canvas>
    <div class="score">Score: <span id="score">0</span></div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;

    }

    .score {
      color: #fff;
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 2rem;
    }

    canvas {
      background-color: #000;
      border: 2px solid #fff;
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GameComponent {
  @ViewChild('game') game: ElementRef<HTMLCanvasElement> | null = null;

  constructor() {
    afterRender(() => {
      const game = this.game!;
      const ctx = game.nativeElement.getContext('2d')!;

      // create snake
      const snake = [
        { x: 200, y: 200 },
        { x: 190, y: 200 },
        { x: 180, y: 200 },
        { x: 170, y: 200 },
        { x: 160, y: 200 },
      ];

      // create food
      const food = { x: 300, y: 200 };

      // create the score var
      let score = 0;

      const startGame = (speed?: number) => setInterval(draw, speed ?? 100);
      let gameLoop = startGame();

      // add keyboard controls
      let direction = 'RIGHT';
      document.addEventListener('keydown', (event) => {
        const key = event.keyCode;
        if (key === 37 && direction !== 'RIGHT') direction = 'LEFT';
        if (key === 38 && direction !== 'DOWN') direction = 'UP';
        if (key === 39 && direction !== 'LEFT') direction = 'RIGHT';
        if (key === 40 && direction !== 'UP') direction = 'DOWN';
      });

      // check collision function
      function checkCollision(
        head: { x: number; y: number },
        array: { x: number; y: number }[]
      ) {
        // check if head collides with any part of the snake
        for (let i = 0; i < array.length; i++) {
          if (head.x === array[i].x && head.y === array[i].y) return true;
        }
        return false;
      }

      // when the snake eats the food
      function eatFood() {
        // increase score
        score++;
        // display score on screen
        document.getElementById('score')!.innerHTML = score.toString();
        // generate new food
        food.x = Math.floor(Math.random() * 79) * 10;
        food.y = Math.floor(Math.random() * 59) * 10;

        // restart game loop with new speed
        clearInterval(gameLoop);
        gameLoop = startGame(100 - (score * 2));
      }

      // draw everything to the canvas
      function draw() {
        // clear canvas
        ctx.clearRect(0, 0, 800, 600);
        // draw snake
        snake.forEach((snakePart) => {
          ctx.fillStyle = 'lightgreen';
          ctx.strokeStyle = 'darkgreen';
          ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
          ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
        });
        // draw food
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, 10, 10);
        ctx.strokeRect(food.x, food.y, 10, 10);
        // old head position
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        // which direction
        if (direction === 'LEFT') snakeX -= 10;
        if (direction === 'RIGHT') snakeX += 10;
        if (direction === 'UP') snakeY -= 10;
        if (direction === 'DOWN') snakeY += 10;

        // if the snake eats the food
        if (snakeX === food.x && snakeY === food.y) {
          eatFood();
        } else {
          // remove the tail
          snake.pop();
        }
        // add new head
        const newHead = { x: snakeX, y: snakeY };
        // game over
        if (
          snakeX < 0 ||
          snakeX > 790 ||
          snakeY < 0 ||
          snakeY > 590 ||
          checkCollision(newHead, snake)
        ) {
          // display game over
          document.getElementById('score')!.innerHTML = 'GAME OVER!';
          clearInterval(gameLoop);
          return;
        }
        snake.unshift(newHead);
      }
    });
  }
}
