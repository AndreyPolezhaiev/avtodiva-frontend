import { CommonModule } from "@angular/common";
import { Component, inject, signal, ViewEncapsulation } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { ModalType } from "../../../shared/modal-type";
import { WeekendManagementService } from "../../../services/weekend/management/weekend-management.service";
import { WeekendFacadeService } from "../../../services/weekend/management/facade-weekend.service";
import { take } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { NotificationService } from "../../../services/notification/notification.service";
import { CalendarComponent } from "../../../shared/calendar/calendar.component";
import { WeekendResponseDto } from "../../../models/weekend/weekend.response";
import { WeekendTableComponent } from "./table/weekend-table.component";
import { UpdateWeekendRequestDto } from "../../../models/weekend/weekend.update";

@Component ({
  selector: 'app-weekend-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarComponent,
    WeekendTableComponent
],
  templateUrl: './weekend.component.html',
  styleUrl: './weekend.component.scss'
})
export class WeekendComponent {
  public weekendManagementService = inject(WeekendManagementService);
  public weekendFacadeService = inject(WeekendFacadeService);

  public foundInstructors = this.weekendFacadeService.instructors;

  public selectedDates = signal<string[]>([]);
  public calendarDays: (Date | null)[] = [];
  public currentMonth: Date = new Date();

  public weekendForDelete: WeekendResponseDto | null = null;
  public weekendForUpdate: WeekendResponseDto | null = null;

  public ModalType = ModalType;
  public activeModal = signal<ModalType>(ModalType.NONE);

  public createWeekends(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.weekendManagementService.createWeekend(form, this.selectedDates())
    .pipe(take(1))
    .subscribe({
      next: () => {
        form.resetForm();
        this.closeControlModal();
        this.clearDates();

        NotificationService.showSuccess("Вихідні створено!");
      },
      error (error: HttpErrorResponse) {
        NotificationService.showError("Не вдалося створити вихідний", error);
      }
    })
  }

  public updateWeekend(form: NgForm) {
    if (form.invalid || !this.weekendForUpdate) {
      return;
    }

    const weekendRequest: UpdateWeekendRequestDto = {
      date: form.value.date,
      startTime: form.value.startTime,
      endTime: form.value.endTime,
      instructorId: form.value.instructorId
    };

    this.weekendManagementService.updateWeekend(this.weekendForUpdate.id, weekendRequest)
    .pipe(take(1))
    .subscribe({
      next: () => {
        form.resetForm();
        this.closeControlModal();
        this.weekendForUpdate = null;

        NotificationService.showSuccess("Вихідний оновлено!");
        this.weekendFacadeService.refreshWeekends();
      },
      error: (error: HttpErrorResponse) => {
        NotificationService.showError("Не вдалося оновити вихідний", error);
      }
    })
  }

  public deleteWeekend() {
    if (!this.weekendForDelete) {
      return;
    }

    this.weekendManagementService.deleteWeekend(this.weekendForDelete.id)
    .pipe(take(1))
    .subscribe({
      next: () => {
        this.closeControlModal();
        this.weekendForDelete = null;

        this.weekendFacadeService.refreshWeekends();
      },
      error: (error: HttpErrorResponse) => {
        NotificationService.showError('Не вдалося видалити вихідний', error)
      }
    })
  }

  removeDate(dateToRemove: string) {
    this.selectedDates.set(this.selectedDates().filter(d => d !== dateToRemove));
  }

  public clearDates() {
    this.selectedDates.set([]);
  }

  public openDeleteModal(weekend: WeekendResponseDto) {
    this.weekendForDelete = weekend;
    this.activeModal.set(ModalType.DELETE);
  }

  public openUpdateModal(weekend: WeekendResponseDto) {
    this.weekendForUpdate = weekend;
    this.activeModal.set(ModalType.UPDATE);
  }

  public openControlModal(type: ModalType) {
    this.activeModal.set(type);
  }

  public closeControlModal() {
    this.activeModal.set(ModalType.NONE);
  }
}