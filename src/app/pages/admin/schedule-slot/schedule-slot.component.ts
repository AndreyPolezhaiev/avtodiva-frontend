import { Component, signal, computed, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { ScheduleSlotResponseDto } from "../../../models/schedule-slot/schedule-slot.response";
import { ModalType } from "../../../shared/modal-type";
import { HttpErrorResponse } from "@angular/common/http";
import { StudentResponseDto } from "../../../models/student/student.response";
import { ScheduleSlotManagementService } from "../../../services/schedule/management/schedule-slot-management.service";
import { NotificationService } from "../../../services/notification/notification.service";
import { ScheduleSlotFacadeService } from "../../../services/schedule/management/facade-schedule-slot.service";
import { debounceTime, distinctUntilChanged, Subject, switchMap, take } from "rxjs";
import { ScheduleSlotTableComponent } from "./table/schedule-slot-table.component";
import { SlotSearchParametersDto } from "../../../models/schedule-slot/schedule-slot.search";
import { StudentManagementService } from "../../../services/student/management/student-management.service";
import { StudentSearchParametersDto } from "../../../models/student/student.search";
import { StudentPrefillData } from "../../../models/student/student-prefill-data";
import { StudentAutocompleteComponent } from "../student/search/student-autocomplete.component";

@Component({
  selector: 'app-schedule-slot',
  standalone: true,
  imports: [CommonModule, FormsModule, ScheduleSlotTableComponent, StudentAutocompleteComponent],
  templateUrl: './schedule-slot.component.html',
  styleUrl: './schedule-slot.component.scss'
})
export class ScheduleSlotComponent {
  private scheduleSlotManagementService = inject(ScheduleSlotManagementService);
  private facadeScheduleSlotService = inject(ScheduleSlotFacadeService);

  public readonly ModalType = ModalType;
  public activeModal = signal<ModalType>(ModalType.NONE);

  public scheduleSlots = signal<ScheduleSlotResponseDto[]>([]);

  public foundStudents = signal<StudentResponseDto[]>([]);

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

  constructor() {
  }

  public createScheduleSlot(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const studentPrefillData: StudentPrefillData = {
      description: form.value.description,
      link: form.value.link,
      instructorId: form.value.instructorId,
      carId: form.value.carId
    };

    this.scheduleSlotManagementService.createScheduleSlot(form, this.selectedStudent())
    .pipe(take(1))
    .subscribe({
      next: (response) => {
        const studentId = response.studentDto?.id;
        this.facadeScheduleSlotService.updateStudentPrefillCache(studentId, studentPrefillData);
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

  public selectStudent(student: StudentResponseDto | null, form: NgForm): void {
    this.foundStudents.set([]);
    this.showStudents.set(false);

    if (student) {
      this.selectedStudent.set(student);
      this.facadeScheduleSlotService.fillStudentData(form, student);
    }
    else {
      this.selectedStudent.set(null);
    }
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