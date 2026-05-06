import { inject, Injectable } from "@angular/core";
import { StudentService } from "../../student.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DeleteStudentService {
  private studentService = inject(StudentService);

  public deleteStudent(studentId: number): Observable<void> {
    return this.studentService.deleteStudentById(studentId);
  }
}