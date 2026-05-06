import { inject, Injectable } from "@angular/core";
import { InstructorService } from "../../instructor.service";
import { InstructorRequestDto } from "../../../../models/instructor/instructor.request";
import { InstructorResponseDto } from "../../../../models/instructor/instructor.response";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CreateInstructorService {
  private instructorService = inject(InstructorService);

  public createInstructor(requestDto: InstructorRequestDto): Observable<InstructorResponseDto> {
    return this.instructorService.createInstructor(requestDto);
  }
}
