import { inject, Injectable } from "@angular/core";
import { WeekendService } from "../../weekend.service";
import { UpdateWeekendRequestDto } from "../../../../models/weekend/weekend.update";
import { Observable } from "rxjs";
import { WeekendResponseDto } from "../../../../models/weekend/weekend.response";

@Injectable({
  providedIn: "root"
})
export class UpdateWeekendService {
  private weekendService = inject(WeekendService);

  public updateWeekend(weekendId: number, weekendRequest: UpdateWeekendRequestDto): Observable<WeekendResponseDto> {
    return this.weekendService.updateWeekend(weekendId, weekendRequest);
  }
}