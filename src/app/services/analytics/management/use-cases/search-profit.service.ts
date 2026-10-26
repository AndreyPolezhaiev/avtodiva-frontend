import { inject, Injectable } from "@angular/core";
import { EMPTY, Observable } from "rxjs";
import { AnalyticsService } from "../../analytics.service";
import { ProfitSearchParametersDto } from "../../../../models/analytics/profit.search";
import { ProfitResponseDto } from "../../../../models/analytics/profit.response";
import { NotificationService } from "../../../notification/notification.service";

@Injectable({
  providedIn: "root"
})
export class SearchProfitService {
  private analyticsService = inject(AnalyticsService);

  public getProfit(searchDto: ProfitSearchParametersDto): Observable<ProfitResponseDto> {
    const { from, to } = searchDto;

    if (from && to && new Date(from) > new Date(to)) {
      NotificationService.showError("Дата 'З' не може бути пізніше дати 'До'");
      return EMPTY;
    }

    return this.analyticsService.getProfit(searchDto);
  }
}
