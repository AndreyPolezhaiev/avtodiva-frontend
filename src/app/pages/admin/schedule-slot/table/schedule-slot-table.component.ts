import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, Output, signal } from "@angular/core";
import { ScheduleSlotResponseDto } from "../../../../models/schedule-slot/schedule-slot.response";
import { ScheduleSlotFacadeService } from "../../../../services/schedule/management/facade-schedule-slot.service";
import { FormsModule, NgForm } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { StudentResponseDto } from "../../../../models/student/student.response";
import { ModalType } from "../../../../shared/modal-type";
import { debounceTime, distinctUntilChanged, Subject, switchMap } from "rxjs";
import { StudentManagementService } from "../../../../services/student/management/student-management.service";
import { StudentSearchParametersDto } from "../../../../models/student/student.search";

@Component({
  selector: 'app-schedule-slot-table',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './schedule-slot-table.component.html',
  styleUrl: './schedule-slot-table.component.scss'
})
export class ScheduleSlotTableComponent {
  private facadeScheduleSlotService = inject(ScheduleSlotFacadeService);
  private studentManagementService = inject(StudentManagementService);
  
  public slots = this.facadeScheduleSlotService.slots;
  public isSearching = this.facadeScheduleSlotService.isSearching;

  public foundInstructors = this.facadeScheduleSlotService.instructors;
  public foundCars = this.facadeScheduleSlotService.cars;

  private studentSearch$ = new Subject<StudentSearchParametersDto>();
  public foundStudents = signal<StudentResponseDto[]>([]);
  
  public currentFilters = this.facadeScheduleSlotService.currentFilters;

  public selectedStudent = signal<StudentResponseDto | null>(null);
  public showStudents = signal<boolean>(true);

  public activeModal = signal<ModalType>(ModalType.NONE);
  
  @Output() onUpdate = new EventEmitter<ScheduleSlotResponseDto>();
  @Output() onDelete = new EventEmitter<ScheduleSlotResponseDto>();

  constructor() {
    this.studentSearch$.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      switchMap(params => {
      return this.studentManagementService.searchStudents(params);
    })
    ).subscribe(students => {
      this.foundStudents.set(students);
    });
  }

  public onSearch(form: NgForm): void {
    if (form.invalid) return;
    
    this.facadeScheduleSlotService.searchSlots(form.value);
  }

  public emitUpdate(slot: ScheduleSlotResponseDto): void {
    this.onUpdate.emit(slot);
  }

  public emitDelete(slot: ScheduleSlotResponseDto): void {
    this.onDelete.emit(slot);
  }

  public onStudentNameInput(event: Event): void {
    const studentName = (event.target as HTMLInputElement).value;

    this.selectedStudent.set(null);
    this.showStudents.set(true);

    const searchParams: StudentSearchParametersDto = {
      name: studentName
    }

    this.studentSearch$.next(searchParams);
  }

  public selectStudent(student: StudentResponseDto): void {
    const filters = this.currentFilters();
    
    filters.studentId = student.id;
    filters.studentName = `${student.name}, ${student.phoneNumber}`;

    this.selectedStudent.set(student);
    this.showStudents.set(false);

    this.foundStudents.set([]);
  }

  public stopShowStudentsList(): void {
    this.showStudents.set(false);
  }
}