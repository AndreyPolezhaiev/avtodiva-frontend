import { Component, signal, computed, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { ScheduleSlotResponseDto } from "../../../models/schedule-slot/schedule-slot.response";
import { ModalType } from "../../../shared/modal-type";
import { HttpErrorResponse } from "@angular/common/http";
import { StudentResponseDto } from "../../../models/student/student.response";
import { SlotCrudManagementService } from "../../../services/schedule/crud/management/slot-crud-management.service";
import { NotificationService } from "../../../services/notification/notification.service";
import { ScheduleSlotFacadeService } from "../../../services/schedule/crud/management/facade-schedule-slot.service";
import { finalize, take } from "rxjs";
import { ScheduleSlotTableComponent } from "./table/schedule-slot-table.component";
import { SlotSearchParametersDto } from "../../../models/schedule-slot/schedule-slot.search";
import { StudentPrefillData } from "../../../models/student/student-prefill-data";
import { StudentAutocompleteComponent } from "../student/search/student-autocomplete.component";
import { SlotGenerationRequestDto } from "../../../models/schedule-slot/generation/slot-generation.request";
import { ScheduleSlotGeneratorService } from "../../../services/schedule/generation/schedule-slot-generator.service";
import { NgSelectModule } from "@ng-select/ng-select";

@Component({
  selector: 'app-schedule-slot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScheduleSlotTableComponent,
    StudentAutocompleteComponent, 
    NgSelectModule
  ],
  templateUrl: './schedule-slot.component.html',
  styleUrl: './schedule-slot.component.scss'
})
export class ScheduleSlotComponent {
  private slotCrudManagementService = inject(SlotCrudManagementService);
  private facadeScheduleSlotService = inject(ScheduleSlotFacadeService);
  private slotGenerationService = inject(ScheduleSlotGeneratorService);

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

  public isGenerating = false;
  public daysOptions = [1, 2, 3, 7, 14, 21, 30, 45, 60, 120];

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

    this.slotCrudManagementService.createScheduleSlot(form, this.selectedStudent())
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

    this.slotCrudManagementService.updateScheduleSlot(form, this.slotForUpdate.id, this.selectedStudent())
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

    this.slotCrudManagementService.deleteScheduleSlot(this.slotForDelete.id)
    .pipe(take(1))
    .subscribe({
      next: () => {
        this.closeControlModal();
        this.slotForDelete = null;

        this.facadeScheduleSlotService.refreshSlots();
      },
      error: (error) => NotificationService.showError('Не вдалося видалити заняття', error)
    });
  }

  public generateSlots(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const instructorIds: number[] = (form.value.instructorIds && form.value.instructorIds.length > 0) 
        ? form.value.instructorIds 
        : this.foundInstructors().map(i => i.id);

    const carIds: number[] = (form.value.carIds && form.value.carIds.length > 0)
        ? form.value.carIds 
        : this.foundCars().map(c => c.id);

    const requestDto: SlotGenerationRequestDto = {
      days: form.value.days,
      instructorIds: instructorIds,
      carIds: carIds
    };

    this.isGenerating = true;

    this.slotGenerationService.generateSlots(requestDto)
    .pipe(
      take(1),
      finalize(() => {
        this.isGenerating = false;
        form.resetForm(form.value); 
      })
    )
    .subscribe({
      next: (message) => {
        NotificationService.showSuccess(message);

        this.closeControlModal();
        form.resetForm();
        this.facadeScheduleSlotService.refreshSlots();
      },
      error: (error) => NotificationService.showError(
        "Не вдалося згенерувати заняття, перевірте графік інструкторів або їх наявність", error
      )
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