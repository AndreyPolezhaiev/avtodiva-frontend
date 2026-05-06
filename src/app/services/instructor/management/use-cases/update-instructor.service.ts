import { inject, Injectable } from "@angular/core";
import { InstructorService } from "../../instructor.service";
import { InstructorResponseDto } from "../../../../models/instructor/instructor.response";
import { InstructorRequestDto } from "../../../../models/instructor/instructor.request";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class UpdateInstructorService {
  private instructorService = inject(InstructorService);

  public updateInstructor(id: number, requestDto: InstructorRequestDto): Observable<InstructorResponseDto> {
    return this.instructorService.updateInstructor(id, requestDto);
  }
}