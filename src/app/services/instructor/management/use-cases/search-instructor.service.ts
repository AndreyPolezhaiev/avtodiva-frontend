import { inject, Injectable } from "@angular/core";
import { InstructorService } from "../../instructor.service";
import { InstructorResponseDto } from "../../../../models/instructor/instructor.response";
import { Observable } from "rxjs";
import { InstructorDetailedResponseDto } from "../../../../models/instructor/instructor.detailed";

@Injectable({
  providedIn: "root"
})
export class SearchInstructorService {
  private instructorService = inject(InstructorService);

  public getAllInstructors(): Observable<InstructorResponseDto[]> {
    return this.instructorService.getAllInstructors();
  }

  public getDetailedInstructor(id: number): Observable<InstructorDetailedResponseDto> {
    return this.instructorService.getDetailedInstructorById(id);
  }
}