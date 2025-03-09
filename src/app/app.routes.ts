import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/main-calculator/main-calculator.component').then(m => m.MainCalculatorComponent)
  }
];
