import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, EMPTY, tap, switchMap, catchError } from "rxjs";
import { StudentRequestDto } from "../../../../models/student/student.request";
import { StudentResponseDto } from "../../../../models/student/student.response";
import { PhoneFormatter } from "../../../../shared/utils/phone-formatter.service";
import { NotificationService } from "../../../notification/notification.service";
import { StudentService } from "../../student.service";
import { UpdateStudentRequestDto } from "../../../../models/student/student.update";
import { VerifyStudentService } from "./verify-student.service";
import { StudentManagementService } from "../student-management.service";

@Injectable({
  providedIn: "root"
})
export class UpdateStudentService {
  private studentService = inject(StudentService);
  private verifyStudentService = inject(VerifyStudentService);

  public updateStudent(studentId: number, studentRequest: UpdateStudentRequestDto): Observable<StudentResponseDto> {
    return this.verifyStudentBeforeUpdating(studentId, studentRequest);
  }

  private verifyStudentBeforeUpdating(studentId: number, studentRequest: UpdateStudentRequestDto): Observable<StudentResponseDto> {
    return this.verifyStudentService.verifyExistedStudent(studentRequest).pipe(
      switchMap(() => {
        return this.executeStudentUpdate(studentId, studentRequest);
      }),
      catchError(err => {
        NotificationService.showError('Не вдалося оновити учня', err.message);

        return EMPTY;
      })
    )
  }

  private executeStudentUpdate(studentId: number, studentRequest: UpdateStudentRequestDto): Observable<StudentResponseDto> {
    return this.studentService.updateStudent(studentId, studentRequest).pipe(
      tap({
        next: (newStudent) => {
          NotificationService.showSuccess(`Учня ${newStudent.name} оновлено`);
        }
      })
    );
  }
}