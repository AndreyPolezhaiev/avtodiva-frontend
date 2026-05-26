import { inject, Injectable } from "@angular/core";
import { ScheduleTemplateService } from "../schedule-template.service";
import { Observable } from "rxjs";
import { ScheduleTemplateResponseDto } from "../../../../../models/template/time/schedule-template.response";
import { ScheduleTemplateRequestDto } from "../../../../../models/template/time/schedule-template.request";

@Injectable({
  providedIn: 'root'
})
export class ScheduleTemplateManagementService {
  private scheduleTemplateService = inject(ScheduleTemplateService);

  public createTemplate(template: ScheduleTemplateRequestDto): Observable<ScheduleTemplateResponseDto> {
    return this.scheduleTemplateService.createTemplate(template);
  }

  public updateTemplate(id: number, template: ScheduleTemplateRequestDto): Observable<ScheduleTemplateResponseDto> {
    return this.scheduleTemplateService.updateTemplateById(id, template);
  }

  public deleteTemplate(id: number): Observable<void> {
    return this.scheduleTemplateService.deleteTemplateById(id);
  }
}