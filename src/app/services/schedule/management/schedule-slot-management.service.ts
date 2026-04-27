import { inject, Injectable } from "@angular/core";
import { CreateScheduleSlotService } from "./use-cases/create-schedule-slot.service";
import { NgForm } from "@angular/forms";
import { StudentResponseDto } from "../../../models/student/student.response";
import { ScheduleSlotResponseDto } from "../../../models/schedule-slot/schedule-slot.response";
import { Observable, take } from "rxjs";
import { SearchScheduleSlotService } from "./use-cases/search-schedule-slot.service";
import { ScheduleSlotFacadeService } from "./facade-schedule-slot.service";
import { UpdateScheduleSlotService } from "./use-cases/update-schedule-slot.service";
import { DeleteScheduleSlotService } from "./use-cases/delete-schedule-slot.service";

@Injectable({
  providedIn: 'root'
})
export class ScheduleSlotManagementService {
  private createService = inject(CreateScheduleSlotService);
  private searchService = inject(SearchScheduleSlotService);
  private updateService = inject(UpdateScheduleSlotService);
  private deleteService = inject(DeleteScheduleSlotService);
  private facadeScheduleSlotService = inject(ScheduleSlotFacadeService);

  public createScheduleSlot(form: NgForm, selectedStudent?: StudentResponseDto | null): Observable<ScheduleSlotResponseDto> {
    return this.createService.createScheduleSlot(form, selectedStudent);
  }

  public updateScheduleSlot(form: NgForm, slotId: number, selectedStudent?: StudentResponseDto | null): Observable<ScheduleSlotResponseDto> {
    return this.updateService.updateScheduleSlot(form, slotId, selectedStudent);
  }

  public getLastStudentSlot(studentId: number): Observable<ScheduleSlotResponseDto | null> {
    return this.searchService.findLastBookedByStudentId(studentId);
  }

  public deleteScheduleSlot(slotId: number): Observable<void> {
    return this.deleteService.deleteScheduleSlot(slotId);
  }

  public fillStudentData(form: NgForm, student: StudentResponseDto): void {
    form.form.patchValue({
      studentName: student.name,
      studentPhoneNumber: student.phoneNumber || ''
    });

   this.facadeScheduleSlotService.getStudentPrefillData(student.id)
    .pipe(take(1))
    .subscribe(data => {
      if (data) {
        form.form.patchValue(data);
      }
    });
  }
}