import { inject, Injectable } from "@angular/core";
import { InstructorService } from "../../instructor.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DeleteInstructorService {
  private instructorService = inject(InstructorService);

  public deleteInstructor(instructorId: number): Observable<void> {
    return this.instructorService.deleteInstructorById(instructorId);
  }
}