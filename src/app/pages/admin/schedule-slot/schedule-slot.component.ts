import { Component, Input, Output, EventEmitter, OnInit, signal, computed, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { ScheduleSlotResponseDto } from "../../../models/schedule-slot/schedule-slot.response";
import { ModalType } from "../../../shared/modal-type";
import { HttpErrorResponse } from "@angular/common/http";
import { StudentResponseDto } from "../../../models/student/student.response";
import { ScheduleSlotManagementService } from "../../../services/schedule/management/schedule-slot-management.service";
import { NotificationService } from "../../../services/notification/notification.service";
import { ScheduleSlotFacadeService } from "../../../services/schedule/management/use-cases/facade-schedule-slot.service";
import { take } from "rxjs";
import { ScheduleSlotTableComponent } from "./table/schedule-slot-table.component";
import { SlotSearchParametersDto } from "../../../models/schedule-slot/schedule-slot.search";

@Component({
  selector: 'app-schedule-slot',
  standalone: true,
  imports: [CommonModule, FormsModule, ScheduleSlotTableComponent],
  templateUrl: './schedule-slot.component.html',
  styleUrl: './schedule-slot.component.scss'
})
export class ScheduleSlotComponent {
  private scheduleSlotManagementService = inject(ScheduleSlotManagementService);
  private facadeScheduleSlotService = inject(ScheduleSlotFacadeService);

  public readonly ModalType = ModalType;
  public activeModal = signal<ModalType>(ModalType.NONE);

  public scheduleSlots = signal<ScheduleSlotResponseDto[]>([]);

  public foundStudents = this.facadeScheduleSlotService.foundStudents;
  public selectedStudent = signal<StudentResponseDto | null>(null);
  public isNewStudentMode = computed(() => {
    const students = this.foundStudents();
    return students.length === 0 && (this.selectedStudent() === null);
  });
  public showStudents = signal<boolean>(true);

  public foundInstructors = this.facadeScheduleSlotService.instructors;
  public foundCars = this.facadeScheduleSlotService.cars;

  public slotForUpdate: ScheduleSlotResponseDto | null = null;
  public slotForDelete: ScheduleSlotResponseDto | null = null;

  constructor() {}

  public createScheduleSlot(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.scheduleSlotManagementService.createScheduleSlot(form, this.selectedStudent())
    .pipe(take(1))
    .subscribe({
      next: () => {
        this.closeControlModal();
        form.resetForm();
        this.selectedStudent.set(null);
      },
      error: (error: HttpErrorResponse) => {
        NotificationService.showError('Не вдалося створити заняття', error);
      }
    })
  }

  public updateScheduleSlot(form: NgForm): void {
    if (form.invalid || !this.slotForUpdate) {
      return;
    }

    this.scheduleSlotManagementService.updateScheduleSlot(form, this.slotForUpdate.id, this.selectedStudent())
    .pipe(take(1))
    .subscribe({
      next: () => {
        this.facadeScheduleSlotService.refreshSlots();

        this.closeControlModal();
        form.resetForm();
        this.selectedStudent.set(null);
      },
      error: (error: HttpErrorResponse) => {
        NotificationService.showError('Не вдалося оновити заняття', error);
      }
    })
  }

  public deleteScheduleSlot(): void {
    if (!this.slotForDelete) {
      return;
    }

    this.scheduleSlotManagementService.deleteScheduleSlot(this.slotForDelete.id)
    .pipe(take(1))
    .subscribe({
      next: () => {
        this.closeControlModal();
        this.slotForDelete = null;
        NotificationService.showSuccess('Заняття видалено');

        this.facadeScheduleSlotService.refreshSlots();
      },
      error: (error) => NotificationService.showError('Не вдалося видалити заняття', error)
    });
  }

  public onStudentNameInput(event: Event): void {
    const name = (event.target as HTMLInputElement).value;
    this.selectedStudent.set(null);
    this.showStudents.set(true);

    this.facadeScheduleSlotService.updateSearchStudentTerm(name);
  }

  public selectStudent(student: StudentResponseDto, form: NgForm): void {
    this.selectedStudent.set(student);
    this.facadeScheduleSlotService.clearSearchStudentTerm();

    this.scheduleSlotManagementService.fillStudentData(form, student);
  }

  public stopShowStudentsList(): void {
    this.showStudents.set(false);
  }

  public openControlModal(type: ModalType): void {
    this.activeModal.set(type);
  }

  public openUpdateModal(slot: ScheduleSlotResponseDto): void {
    this.slotForUpdate = slot;

    if (slot.studentDto) {
      this.selectedStudent.set(slot.studentDto);
    }
    
    this.activeModal.set(ModalType.UPDATE);
  }

  public openDeleteModal(slot: ScheduleSlotResponseDto): void {
    this.slotForDelete = slot;
    this.activeModal.set(ModalType.DELETE);
  }

  public closeControlModal(): void {
    this.activeModal.set(ModalType.NONE);
  }

  public onSearch(form: NgForm): void {
    if (form.invalid) return;
    
    const filters: SlotSearchParametersDto = {
      ...form.value,
    };
    
    this.facadeScheduleSlotService.searchSlots(filters);
  }
}