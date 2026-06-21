import { Injectable } from "@angular/core";
import { environment } from "../../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ScheduleTemplateRequestDto } from "../../../../models/template/time/schedule-template.request";
import { ScheduleTemplateResponseDto } from "../../../../models/template/time/schedule-template.response";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScheduleTemplateService {
  private apiUrl = `${environment.apiBaseUrl}/template`;

  constructor(private http: HttpClient) {}

  public createTemplate(template: ScheduleTemplateRequestDto): Observable<ScheduleTemplateResponseDto> {
    return this.http.post<ScheduleTemplateResponseDto>(`${this.apiUrl}`, template);
  }

  public getAllTemplates(): Observable<ScheduleTemplateResponseDto[]> {
    return this.http.get<ScheduleTemplateResponseDto[]>(`${this.apiUrl}/all`);
  }

  public updateTemplateById(id: number, template: ScheduleTemplateRequestDto): Observable<ScheduleTemplateResponseDto> {
    return this.http.put<ScheduleTemplateResponseDto>(`${this.apiUrl}/${id}`, template);
  }

  public deleteTemplateById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}