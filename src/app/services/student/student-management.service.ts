import { inject, Injectable } from "@angular/core";
import { StudentService } from "./student.service";
import { Observable, of, switchMap, tap, throwError } from "rxjs";
import { StudentResponseDto } from "../../models/student/student.response";
import { StudentRequestDto } from "../../models/student/student.request";
import { HttpErrorResponse } from "@angular/common/http";
import { NotificationService } from "../notification/notification.service";

@Injectable({
  providedIn: 'root',
})
export class StudentManagementService {
  private studentService = inject(StudentService);

  public verifyStudent(student: StudentRequestDto): Observable<StudentResponseDto | null> {
    return this.studentService.searchByPhone(student.phoneNumber).pipe(
      switchMap(foundStudent => {
        if (!foundStudent) {
          return of(null);
        }

        const isSameName = foundStudent.name.toLowerCase().trim() === student.name.toLowerCase().trim();

        if (isSameName) {
          return of(foundStudent);
        } 
        else {
          return throwError(() => new Error(
            `Номер ${student.phoneNumber} вже закріплений за учнем "${foundStudent.name}".`
          ));
        }
      })
    );
  }

  public createStudent(studentRequest: StudentRequestDto): Observable<StudentResponseDto> {
    return this.studentService.createStudent(studentRequest).pipe(
      tap({
        next: (newStudent) => {
          NotificationService.showSuccess(`Учня ${newStudent.name} створено`);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            NotificationService.showError('Цей номер вже використовується (Conflict).');
          } 
          else {
            NotificationService.showError('Не вдалося створити нового учня', err);
          }
        }
      })
    );
  }
}