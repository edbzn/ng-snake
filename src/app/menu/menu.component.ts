import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="menu">
      <h1 class="menu__title">Snake</h1>
      <div class="menu__content">
        <div class="menu__item">
          <a routerLink="/game">Start Game</a>
        </div>
      </div>
    </div>
  `,
  styles: `
    .menu {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
    }

    .menu__title {
      font-size: 3rem;
      font-weight: bold;
      margin-bottom: 2rem;
      color: var(--primary-color);
    }

    .menu__content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .menu__item {
      margin-bottom: 1rem;
    }

    .menu__item a {
      color: #fff;
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: bold;
      padding: 0.5rem 1rem;
      border: 2px solid #fff;
      border-radius: 0.5rem;
      transition: all 0.2s ease-in-out;
    }

    .menu__item a:hover {
      background-color: #fff;
      color: #000;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MenuComponent {}
