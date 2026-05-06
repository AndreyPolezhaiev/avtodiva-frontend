import { inject, Injectable } from "@angular/core";
import { InstructorService } from "../../instructor.service";
import { InstructorResponseDto } from "../../../../models/instructor/instructor.response";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SearchInstructorService {
  private instructorService = inject(InstructorService);

  public getAllInstructors(): Observable<InstructorResponseDto[]> {
    return this.instructorService.getAllInstructors();
  }
}