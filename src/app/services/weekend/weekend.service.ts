import { Injectable } from "@angular/core";
import { environment } from "../../../environmets/environment";
import { HttpClient } from "@angular/common/http";
import { WeekendRequestDto } from "../../models/weekend/weekend.request";
import { Observable } from "rxjs";
import { WeekendResponseDto } from "../../models/weekend/weekend.response";
import { UpdateWeekendRequestDto } from "../../models/weekend/weekend.update";
import { WeekendSearchParametersDto } from "../../models/weekend/weekend.search";

@Injectable({
  providedIn: 'root'
})
export class WeekendService {
  private apiUrl = `${environment.apiBaseUrl}/api/weekends`;

  constructor(private http: HttpClient) {}

  public createWeekend(weekend: WeekendRequestDto[]): Observable<WeekendResponseDto[]> {
    return this.http.post<WeekendResponseDto[]>(this.apiUrl, weekend);
  }

  public searchWeekends(searchDto: WeekendSearchParametersDto): Observable<WeekendResponseDto[]> {
    return this.http.get<WeekendResponseDto[]>(`${this.apiUrl}/search`, {
      params: {...searchDto} as any
    });
  }

  public getWeekendById(id: number): Observable<WeekendResponseDto> {
    return this.http.get<WeekendResponseDto>(`${this.apiUrl}/${id}`);
  }

  public updateWeekend(id: number, weekend: UpdateWeekendRequestDto): Observable<WeekendResponseDto> {
    return this.http.put<WeekendResponseDto>(`${this.apiUrl}/${id}`, weekend);
  }

  public deleteWeekendById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
