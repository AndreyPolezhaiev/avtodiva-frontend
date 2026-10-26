import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SearchProfitService } from "./use-cases/search-profit.service";
import { ProfitSearchParametersDto } from "../../../models/analytics/profit.search";
import { ProfitResponseDto } from "../../../models/analytics/profit.response";

@Injectable({
  providedIn: "root"
})
export class AnalyticsManagementService {
  private searchProfitService = inject(SearchProfitService);

  public getProfit(params: ProfitSearchParametersDto): Observable<ProfitResponseDto> {
    return this.searchProfitService.getProfit(params);
  }
}
