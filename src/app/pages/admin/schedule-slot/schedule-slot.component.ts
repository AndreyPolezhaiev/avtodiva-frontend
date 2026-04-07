import { Component, Input, Output, EventEmitter, OnInit, signal, computed, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { ScheduleSlotService } from "../../../services/schedule/schedule-slot.service";
import { ScheduleSlotResponseDto } from "../../../models/schedule-slot/schedule-slot.response";
import { ModalType } from "../../../shared/modal-type";
import { HttpErrorResponse } from "@angular/common/http";
import { StudentResponseDto } from "../../../models/student/student.response";
import { ScheduleSlotManagementService } from "../../../services/schedule/management/schedule-slot-management.service";
import { NotificationService } from "../../../services/notification/notification.service";
import { ScheduleSlotFacadeService } from "../../../services/schedule/management/use-cases/facade-schedule-slot.service";
import { take } from "rxjs";

@Component({
  selector: 'app-schedule-slot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule-slot.component.html',
  styleUrl: './schedule-slot.component.scss'
})
export class ScheduleSlotComponent {
  private scheduleService = inject(ScheduleSlotService);
  private scheduleSlotManagementService = inject(ScheduleSlotManagementService);
  private facadeScheduleSlotService = inject(ScheduleSlotFacadeService);

  public readonly ModalType = ModalType;

  public scheduleSlots = signal<ScheduleSlotResponseDto[]>([]);

  public foundStudents = this.facadeScheduleSlotService.foundStudents;
  public selectedStudent = signal<StudentResponseDto | null>(null);
  public isNewStudentMode = computed(() => {
    const students = this.foundStudents();
    return students.length === 0 && (this.selectedStudent() === null);
  });
  public showStudents = signal<boolean>(true);

  public activeModal = signal<ModalType>(ModalType.NONE);

  public foundInstructors = this.facadeScheduleSlotService.instructors;
  public foundCars = this.facadeScheduleSlotService.cars;

  @Input() slot: ScheduleSlotResponseDto | null = null;
  @Output() onSaved = new EventEmitter<ScheduleSlotResponseDto>();
  @Output() onDeleted = new EventEmitter<number>();

  constructor() {}

  public createScheduleSlot(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.scheduleSlotManagementService.createScheduleSlot(form, this.selectedStudent())
    .pipe(take(1))
    .subscribe({
      next: slotResponse => {
        this.onSaved.emit(slotResponse);
        this.closeControlModal();
        form.resetForm();
        this.selectedStudent.set(null);
      },
      error: (error: HttpErrorResponse) => {
        NotificationService.showError('Не вдалося створити заняття', error);
      }
    })
  }

  public delete(): void {
    if (this.slot?.id) {
      this.scheduleService.deleteSlotById(this.slot.id).subscribe({
        next: () => this.onDeleted.emit(this.slot!.id),
        error: (error: HttpErrorResponse) => {
          NotificationService.showError('Не вдалося видалити заняття', error);
        }
      });
    }
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

    if (type === ModalType.ADD) {
      this.facadeScheduleSlotService.loadInitialData();
    }
  }

  public closeControlModal(): void {
    this.activeModal.set(ModalType.NONE);
  }
}