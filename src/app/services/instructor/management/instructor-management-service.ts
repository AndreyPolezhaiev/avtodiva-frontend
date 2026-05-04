import { inject, Injectable } from "@angular/core";
import { SearchInstructorService } from "./use-cases/search-instructor-service";
import { Observable } from "rxjs";
import { InstructorResponseDto } from "../../../models/instructor/instructor.response";

@Injectable({
  providedIn: "root"
})
export class InstructorManagementService {
  private searchInstructorService = inject(SearchInstructorService);

  public getAllInstructors(): Observable<InstructorResponseDto[]> {
    return this.searchInstructorService.getAllInstructors();
  }
}