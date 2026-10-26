import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ProfitSearchParametersDto } from "../../models/analytics/profit.search";
import { ProfitResponseDto } from "../../models/analytics/profit.response";

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.analyticsApiBaseUrl}/analytics`;

  constructor(private http: HttpClient) {}

  public getProfit(searchDto: ProfitSearchParametersDto): Observable<ProfitResponseDto> {
    return this.http.get<ProfitResponseDto>(`${this.apiUrl}/profit`, {
      params: {...searchDto} as any
    });
  }
}
