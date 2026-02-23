import { Injectable } from "@angular/core";
import { environment } from "../../environmets/environment";
import { HttpClient } from "@angular/common/http";
import { WeekendRequestDto } from "../model/weekend/weekend.request";
import { Observable } from "rxjs";
import { WeekendResponseDto } from "../model/weekend/weekend.response";
import { UpdateWeekendRequestDto } from "../model/weekend/weekend.update";

@Injectable({
  providedIn: 'root'
})
export class WeekendService {
  private apiUrl = `${environment.apiBaseUrl}/api/weekends`;

  constructor(private http: HttpClient) {}

  public createWeekend(weekend: WeekendRequestDto): Observable<WeekendResponseDto> {
    return this.http.post<WeekendResponseDto>(this.apiUrl, weekend);
  }

  public getAllWeekends(): Observable<WeekendResponseDto[]> {
    return this.http.get<WeekendResponseDto[]>(`${this.apiUrl}/all`);
  }

  public getWeekendById(id: number): Observable<WeekendResponseDto> {
    return this.http.get<WeekendResponseDto>(`${this.http}/${id}`);
  }

  public updateWeekend(id: number, weekend: UpdateWeekendRequestDto): Observable<WeekendResponseDto> {
    return this.http.put<WeekendResponseDto>(`${this.apiUrl}/${id}`, weekend);
  }

  public deleteWeekendById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
