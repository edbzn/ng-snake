import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'game',
    loadComponent: () => import('./game/game.component')
  },
  {
    path: 'menu',
    loadComponent: () => import('./menu/menu.component')
  },
  {
    path: '',
    redirectTo: '/menu',
    pathMatch: 'full'
  }
];
