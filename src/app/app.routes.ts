import { Routes } from '@angular/router';
import { CarComponent } from './component/car/car.component';
import { HomeComponent } from './component/home/home.component';
import { InstructorComponent } from './component/instructor/instructor.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'cars', component: CarComponent },
      { path: 'instructors', component: InstructorComponent },
      { path: 'students', component: CarComponent },
      { path: 'weekends', component: CarComponent },
      { path: 'schedule', component: CarComponent }
    ]
  }
];
