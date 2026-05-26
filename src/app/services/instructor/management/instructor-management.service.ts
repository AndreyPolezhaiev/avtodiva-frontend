import { inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { InstructorResponseDto } from "../../../models/instructor/instructor.response";
import { CreateInstructorService } from "./use-cases/create-instructor.service";
import { InstructorRequestDto } from "../../../models/instructor/instructor.request";
import { UpdateInstructorService } from "./use-cases/update-instructor.service";
import { DeleteInstructorService } from "./use-cases/delete-instructor.service";
import { DataRegistryService } from "../../../shared/registry/data-registry.service";
import { LoadDataType } from "../../../shared/load-type";
import { InstructorDetailedResponseDto } from "../../../models/instructor/instructor.detailed";
import { SearchInstructorService } from "./use-cases/search-instructor.service";

@Injectable({
  providedIn: "root"
})
export class InstructorManagementService {
  private dataRegistryService = inject(DataRegistryService);
  private createInstructorService = inject(CreateInstructorService);
  private updateInstructorService = inject(UpdateInstructorService);
  private deleteInstructorService = inject(DeleteInstructorService);
  private searchInstructorService = inject(SearchInstructorService);

  public get instructors() {
    return this.dataRegistryService.instructors;
  }

  public createInstructor(requestDto: InstructorRequestDto): Observable<InstructorResponseDto> {
    return this.createInstructorService.createInstructor(requestDto).pipe((
      tap(() => this.dataRegistryService.refreshData(LoadDataType.INSTRUCTORS))
    ));
  }

  public updateInstructor(id: number, requestDto: InstructorRequestDto): Observable<InstructorResponseDto> {
    return this.updateInstructorService.updateInstructor(id, requestDto).pipe(
      tap(() => this.dataRegistryService.refreshData(LoadDataType.INSTRUCTORS))
    );
  }

  public deleteInstructor(id: number): Observable<void> {
    return this.deleteInstructorService.deleteInstructor(id).pipe(
      tap(() => this.dataRegistryService.refreshData(LoadDataType.INSTRUCTORS))
    );
  }

  public getDetailedInstructor(id: number): Observable<InstructorDetailedResponseDto> {
    return this.searchInstructorService.getDetailedInstructor(id);
  }
}