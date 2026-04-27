import { inject, Injectable } from "@angular/core";
import { StudentService } from "../../student.service";
import { StudentRequestDto } from "../../../../models/student/student.request";
import { StudentResponseDto } from "../../../../models/student/student.response";
import { Observable, switchMap, of, throwError, EMPTY } from "rxjs";
import { PhoneFormatter } from "../../../../shared/utils/phone-formatter.service";
import { UpdateStudentRequestDto } from "../../../../models/student/student.update";

@Injectable({
  providedIn: 'root'
})
export class VerifyStudentService {
  private studentService = inject(StudentService);

  public verifyExistedStudent(studentRequest: StudentRequestDto | UpdateStudentRequestDto): Observable<StudentResponseDto | null> {
      const cleanPhone = PhoneFormatter.formatPhoneNumber(studentRequest.phoneNumber);
      
      if (cleanPhone.length < 10) {
        alert('Номер телефону занадто короткий! Має бути мінімум 10 цифр.');
        return EMPTY;
      }

      return this.studentService.searchByPhone(cleanPhone).pipe(
        switchMap(foundStudent => {
          if (!foundStudent) {
            return of(null);
          }
  
          const isSameName = foundStudent.name.toLowerCase().trim() === studentRequest.name.toLowerCase().trim();
  
          if (isSameName) {
            return of(foundStudent);
          } 
          else {
            return throwError(() => new Error(
              `Номер ${cleanPhone} вже закріплений за учнем "${foundStudent.name}".`
            ));
          }
        })
      );
    }
}
