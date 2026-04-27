import { inject, Injectable } from "@angular/core";
import { StudentService } from "../student.service";
import { Observable, of, switchMap, tap, throwError } from "rxjs";
import { StudentResponseDto } from "../../../models/student/student.response";
import { StudentRequestDto } from "../../../models/student/student.request";
import { CreateStudentService } from "./use-cases/create-student-service";
import { SearchStudentService } from "./use-cases/search-student-service";
import { StudentSearchParametersDto } from "../../../models/student/student.search";
import { VerifyStudentService } from "./use-cases/verify-student-service";
import { DeleteStudentService } from "./use-cases/delete-student-service";
import { UpdateStudentService } from "./use-cases/update-student-service";
import { UpdateStudentRequestDto } from "../../../models/student/student.update";

@Injectable({
  providedIn: 'root',
})
export class StudentManagementService {
  private createStudentService = inject(CreateStudentService);
  private searchStudentService = inject(SearchStudentService);
  private verifyStudentService = inject(VerifyStudentService);
  private deleteStudentService = inject(DeleteStudentService);
  private updateStudentService = inject(UpdateStudentService);

  public createStudent(studentRequest: StudentRequestDto): Observable<StudentResponseDto> {
    return this.createStudentService.createStudent(studentRequest);
  }

  public searchStudents(params: StudentSearchParametersDto): Observable<StudentResponseDto[]> {
    return this.searchStudentService.searchStudents(params);
  }

  public verifyExistedStudent(student: StudentRequestDto) {
    return this.verifyStudentService.verifyExistedStudent(student);
  }

  public updateStudent(studentId: number, studentRequest: UpdateStudentRequestDto) {
    return this.updateStudentService.updateStudent(studentId, studentRequest);
  }

  public deleteStudent(studentId: number): Observable<void> {
    return this.deleteStudentService.deleteStudent(studentId);
  }
}