import { Routes } from '@angular/router';
import { CarComponent } from './pages/admin/car/car.component';
import { HomeComponent } from './pages/admin/home/home.component';
import { InstructorComponent } from './pages/admin/instructor/instructor.component';
import { StudentComponent } from './pages/admin/student/student.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ScheduleSlotComponent } from './pages/admin/schedule-slot/schedule-slot.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: HomeComponent},
      { path: 'cars', component: CarComponent },
      { path: 'instructors', component: InstructorComponent },
      { path: 'students', component: StudentComponent },
      { path: 'weekends', component: CarComponent },
      { path: 'schedule', component: ScheduleSlotComponent }
    ]
  }
];
