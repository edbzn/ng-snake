import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  ViewChild,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-game',
  standalone: true,
  template: `
    <canvas #game width="800" height="600"></canvas>
    @if (gameOver()) {
      <div class="score">
        Game Over!
        <div>Score {{ score() }}</div>
        <div>Press F5 to restart</div>
      </div>
    } @else {
      <div class="score">Score {{ score() }}</div>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      position: relative;
    }

    .score {
      color: #fff;
      font-size: 2rem;
      font-weight: bold;
      margin: 2rem;
      text-align: center;
      position: absolute;
      top: 0
    }

    .score > div {
      font-size: 0.9rem;
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

  #cdr = inject(ChangeDetectorRef);

  direction = signal<'RIGHT' | 'LEFT' | 'UP' | 'DOWN'>('RIGHT');
  snake = signal([
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 },
    { x: 170, y: 200 },
    { x: 160, y: 200 },
  ]);
  score = signal(0);
  food = signal({
    x: Math.floor(Math.random() * 79) * 10,
    y: Math.floor(Math.random() * 59) * 10,
  });
  gameOver = signal(false);
  gameLoop: any;

  constructor() {
    afterNextRender(() => {
      this.gameLoop = this.startGame();
    });

    inject(DestroyRef).onDestroy(() => {
      if (this.gameLoop) {
        clearInterval(this.gameLoop);
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.keyCode;
    if (key === 37 && this.direction() !== 'RIGHT') this.direction.set('LEFT');
    if (key === 38 && this.direction() !== 'DOWN') this.direction.set('UP');
    if (key === 39 && this.direction() !== 'LEFT') this.direction.set('RIGHT');
    if (key === 40 && this.direction() !== 'UP') this.direction.set('DOWN');
  }

  private checkCollision(
    head: { x: number; y: number },
    array: { x: number; y: number }[]
  ) {
    for (let i = 0; i < array.length; i++) {
      if (head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
  }

  private eatFood() {
    this.score.set(this.score() + 1);
    this.food.set({
      x: Math.floor(Math.random() * 79) * 10,
      y: Math.floor(Math.random() * 59) * 10,
    });

    clearInterval(this.gameLoop);
    this.gameLoop = this.startGame(100 - this.score() * 2);

    this.#cdr.detectChanges();
  }

  private startGame(speed = 100) {
    return setInterval(() => this.draw(), speed);
  }

  private draw() {
    const ctx = this.game?.nativeElement.getContext('2d')!;

    ctx.clearRect(
      0,
      0,
      this.game?.nativeElement.width!,
      this.game?.nativeElement.height!
    );

    for (let i = 0; i < this.snake().length; i++) {
      ctx.fillStyle = 'green';
      ctx.fillRect(this.snake()[i].x, this.snake()[i].y, 10, 10);

      ctx.strokeStyle = 'black';
      ctx.strokeRect(this.snake()[i].x, this.snake()[i].y, 10, 10);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(this.food().x, this.food().y, 10, 10);

    let snakeX = this.snake()[0].x;
    let snakeY = this.snake()[0].y;

    if (this.direction() === 'LEFT') snakeX -= 10;
    if (this.direction() === 'UP') snakeY -= 10;
    if (this.direction() === 'RIGHT') snakeX += 10;
    if (this.direction() === 'DOWN') snakeY += 10;

    if (snakeX === this.food().x && snakeY === this.food().y) {
      this.eatFood();
    } else {
      this.snake().pop();
    }

    const newHead = {
      x: snakeX,
      y: snakeY,
    };

    if (
      snakeX < 0 ||
      snakeX > this.game?.nativeElement.width! - 10 ||
      snakeY < 0 ||
      snakeY > this.game?.nativeElement.height! - 10 ||
      this.checkCollision(newHead, this.snake())
    ) {
      clearInterval(this.gameLoop);
      this.gameOver.set(true);
    }

    this.snake().unshift(newHead);
    this.#cdr.detectChanges();
  }
}
