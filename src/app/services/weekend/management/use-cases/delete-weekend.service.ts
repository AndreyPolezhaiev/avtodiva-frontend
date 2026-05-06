import { inject, Injectable } from "@angular/core";
import { WeekendService } from "../../weekend.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DeleteWeekendService {
  private weekendService = inject(WeekendService);

  public deleteWeekend(weekendId: number): Observable<void> {
    return this.weekendService.deleteWeekendById(weekendId);
  }
}