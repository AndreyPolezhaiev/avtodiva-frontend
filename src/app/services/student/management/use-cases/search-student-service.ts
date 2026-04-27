import { inject, Injectable } from "@angular/core";
import { StudentService } from "../../student.service";
import { StudentResponseDto } from "../../../../models/student/student.response";
import { Observable, of } from "rxjs";
import { StudentSearchParametersDto } from "../../../../models/student/student.search";

@Injectable({
  providedIn: 'root'
})
export class SearchStudentService {
  private studentService = inject(StudentService);

  public searchStudents(params: StudentSearchParametersDto): Observable<StudentResponseDto[]> {
    const nameLen = params.name?.trim().length || 0;
    const phoneLen = params.phoneNumber?.trim().length || 0;

    if (nameLen === 0 && phoneLen === 0) {
      return this.studentService.searchStudents(params);
    }

    if (Math.max(nameLen, phoneLen) <= 2) {
      return of([]);
    }

    return this.studentService.searchStudents(params);
  }
}