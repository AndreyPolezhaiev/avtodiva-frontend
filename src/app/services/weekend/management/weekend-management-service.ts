import { inject, Injectable } from "@angular/core";
import { CreateWeekendService } from "./use-cases/create-weekend-service";
import { WeekendRequestDto } from "../../../models/weekend/weekend.request";
import { WeekendResponseDto } from "../../../models/weekend/weekend.response";
import { Observable } from "rxjs";
import { NgForm } from "@angular/forms";
import { WeekendSearchParametersDto } from "../../../models/weekend/weekend.search";
import { SearchWeekendService } from "./use-cases/search-weekend-service";
import { UpdateWeekendService } from "./use-cases/update-weekend-service";
import { UpdateWeekendRequestDto } from "../../../models/weekend/weekend.update";
import { DeleteWeekendService } from "./use-cases/delete-weekend-service";

@Injectable({
  providedIn: "root"
})
export class WeekendManagementService {
  private createWeekendService = inject(CreateWeekendService);
  private searchWeekendService = inject(SearchWeekendService);
  private updateWeekendService = inject(UpdateWeekendService);
  private deleteWeekendService = inject(DeleteWeekendService);

  public createWeekend(form: NgForm, selectedDates: string[]): Observable<WeekendResponseDto[]> {
    return this.createWeekendService.createWeekend(form, selectedDates);
  }

  public searchWeekends(params: WeekendSearchParametersDto): Observable<WeekendResponseDto[]> {
    return this.searchWeekendService.searchWeekends(params);
  }

  public updateWeekend(weekendId: number, weekendRequest: UpdateWeekendRequestDto): Observable<WeekendResponseDto> {
    return this.updateWeekendService.updateWeekend(weekendId, weekendRequest);
  }

  public deleteWeekend(weekendId: number): Observable<void> {
    return this.deleteWeekendService.deleteWeekend(weekendId);
  }
}