import { inject, Injectable } from "@angular/core";
import { ScheduleSlotService } from "../../schedule-slot.service";
import { Observable, map } from "rxjs";
import { ScheduleSlotResponseDto } from "../../../../models/schedule-slot/schedule-slot.response";

@Injectable({
  providedIn: 'root'
})
export class SearchScheduleSlotService {
  private scheduleSlotService = inject(ScheduleSlotService);

  public findLastBookedByStudentId(studentId: number): Observable<ScheduleSlotResponseDto | null> {
    return this.scheduleSlotService.findLastBookedByStudentId(studentId).pipe(
      map(slot => slot ? slot : null)
    );
  }

  public getStudentPrefillData(studentId: number): Observable<any> {
    return this.scheduleSlotService.findLastBookedByStudentId(studentId).pipe(
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