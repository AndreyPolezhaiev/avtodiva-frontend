import { inject, Injectable } from "@angular/core";
import { ScheduleSlotCrudService } from "../../schedule-slot-crud.service";
import { Observable, map } from "rxjs";
import { ScheduleSlotResponseDto } from "../../../../../models/schedule-slot/schedule-slot.response";
import { SlotSearchParametersDto } from "../../../../../models/schedule-slot/schedule-slot.search";

@Injectable({
  providedIn: 'root'
})
export class SearchScheduleSlotService {
  private slotCrudService = inject(ScheduleSlotCrudService);

  public searchSlots(searchDto: SlotSearchParametersDto): Observable<ScheduleSlotResponseDto[]> {
    return this.slotCrudService.searchSlots(searchDto);
  }

  public findLastBookedByStudentId(studentId: number): Observable<ScheduleSlotResponseDto | null> {
    return this.slotCrudService.findLastBookedByStudentId(studentId).pipe(
      map(slot => slot ? slot : null)
    );
  }

  public getStudentPrefillData(studentId: number): Observable<any> {
    return this.slotCrudService.findLastBookedByStudentId(studentId).pipe(
      map(slot => {
        if (!slot) return null;
        return {
          description: slot.description,
          link: slot.link,
          instructorId: slot.instructorDto?.id,
          carId: slot.carDto?.id
        };
      })
    );
  }
}