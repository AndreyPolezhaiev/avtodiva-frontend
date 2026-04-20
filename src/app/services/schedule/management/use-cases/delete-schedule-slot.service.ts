import { inject, Injectable } from "@angular/core";
import { ScheduleSlotService } from "../../schedule-slot.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DeleteScheduleSlotService {
  private scheduleSlotService = inject(ScheduleSlotService);

  public deleteScheduleSlot(slotId: number): Observable<void> {
    return this.scheduleSlotService.deleteSlotById(slotId);
  }
}