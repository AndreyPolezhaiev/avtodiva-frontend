import { inject, Injectable } from "@angular/core";
import { ScheduleSlotCrudService } from "../../schedule-slot-crud.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DeleteScheduleSlotService {
  private slotCrudService = inject(ScheduleSlotCrudService);

  public deleteScheduleSlot(slotId: number): Observable<void> {
    return this.slotCrudService.deleteSlotById(slotId);
  }
}