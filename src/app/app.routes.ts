import { Routes } from '@angular/router';
import { CarComponent } from './component/car/car.component';
import { HomeComponent } from './component/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'cars', component: CarComponent },
      { path: 'instructors', component: CarComponent },
      { path: 'students', component: CarComponent },
      { path: '', redirectTo: 'cars', pathMatch: 'full' }
    ]
  }
];
