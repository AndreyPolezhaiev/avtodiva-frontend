import { Routes } from '@angular/router';
import { CarComponent } from './pages/admin/car/car.component';
import { HomeComponent } from './pages/admin/home/home.component';
import { InstructorComponent } from './pages/admin/instructor/instructor.component';
import { StudentComponent } from './pages/admin/student/student.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ScheduleSlotComponent } from './pages/admin/schedule-slot/schedule-slot.component';
import { WeekendComponent } from './pages/admin/weekend/weekend.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: HomeComponent},
      { path: 'schedule', component: ScheduleSlotComponent },
      { path: 'cars', component: CarComponent },
      { path: 'instructors', component: InstructorComponent },
      { path: 'students', component: StudentComponent },
      { path: 'weekends', component: WeekendComponent }
    ]
  }
];
