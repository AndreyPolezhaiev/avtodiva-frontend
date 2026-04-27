import { inject, Injectable } from "@angular/core";
import { StudentRequestDto } from "../../../../models/student/student.request";
import { EMPTY, Observable, tap } from "rxjs";
import { StudentResponseDto } from "../../../../models/student/student.response";
import { StudentService } from "../../student.service";
import { NotificationService } from "../../../notification/notification.service";
import { HttpErrorResponse } from "@angular/common/http";
import { PhoneFormatter } from "../../../../shared/utils/phone-formatter.service";

@Injectable({
  providedIn: 'root'
})
export class CreateStudentService {
  private studentService = inject(StudentService);

  public createStudent(studentRequest: StudentRequestDto): Observable<StudentResponseDto> {
    const cleanPhone = PhoneFormatter.formatPhoneNumber(studentRequest.phoneNumber);

    if (cleanPhone.length < 10) {
      alert('Номер телефону занадто короткий! Має бути мінімум 10 цифр.');
      return EMPTY;
    }

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
            NotificationService.showError('Студент з номером ' + studentRequest.phoneNumber + ' вже існує', err);
          }
        }
      })
    );
  }
}