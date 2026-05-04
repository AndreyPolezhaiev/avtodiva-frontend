import { inject, Injectable } from "@angular/core";
import { WeekendService } from "../../weekend.service";
import { WeekendRequestDto } from "../../../../models/weekend/weekend.request";
import { WeekendResponseDto } from "../../../../models/weekend/weekend.response";
import { Observable } from "rxjs";
import { NgForm } from "@angular/forms";

@Injectable({
  providedIn: "root"
})
export class CreateWeekendService {
  private weekendService = inject(WeekendService);

  public createWeekend(form: NgForm, selectedDates: string[]): Observable<WeekendResponseDto[]> {
    const weekendRequest: WeekendRequestDto[] = [];

    for (let date of selectedDates) {
      const weekendTemp: WeekendRequestDto = {
        date: date,
        startTime: form.value.startTime,
        endTime: form.value.endTime,
        instructorId: form.value.instructorId
      }

      weekendRequest.push(weekendTemp);
    }

    return this.weekendService.createWeekend(weekendRequest);
  }
}