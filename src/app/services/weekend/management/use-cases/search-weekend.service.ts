import { inject, Injectable } from "@angular/core";
import { WeekendService } from "../../weekend.service";
import { WeekendSearchParametersDto } from "../../../../models/weekend/weekend.search";
import { EMPTY, Observable } from "rxjs";
import { WeekendResponseDto } from "../../../../models/weekend/weekend.response";
import { NotificationService } from "../../../notification/notification.service";

@Injectable({
  providedIn: "root"
})
export class SearchWeekendService {
  private weekendService = inject(WeekendService);

  public searchWeekends(searchDto: WeekendSearchParametersDto): Observable<WeekendResponseDto[]> {
    const { startDate, endDate } = searchDto;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      NotificationService.showError("Дата 'З' не може бути пізніше дати 'До'");
      return EMPTY;
    }

    return this.weekendService.searchWeekends(searchDto);
  }
}