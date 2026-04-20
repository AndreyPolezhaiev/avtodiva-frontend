import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, Output, signal } from "@angular/core";
import { ScheduleSlotResponseDto } from "../../../../models/schedule-slot/schedule-slot.response";
import { ScheduleSlotFacadeService } from "../../../../services/schedule/management/use-cases/facade-schedule-slot.service";
import { FormsModule, NgForm } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { StudentResponseDto } from "../../../../models/student/student.response";
import { ModalType } from "../../../../shared/modal-type";
import { debounceTime, distinctUntilChanged, Subject, switchMap } from "rxjs";

@Component({
  selector: 'app-schedule-slot-table',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './schedule-slot-table.component.html',
  styleUrl: './schedule-slot-table.component.scss'
})
export class ScheduleSlotTableComponent {
  private facadeScheduleSlotService = inject(ScheduleSlotFacadeService);
  
  public slots = this.facadeScheduleSlotService.slots;
  public isSearching = this.facadeScheduleSlotService.isSearching;

  public foundInstructors = this.facadeScheduleSlotService.instructors;
  public foundCars = this.facadeScheduleSlotService.cars;

  private studentSearch$ = new Subject<string>();
  public foundStudents = signal<StudentResponseDto[]>([]);
  
  public currentFilters = this.facadeScheduleSlotService.currentFilters;

  public selectedStudent = signal<StudentResponseDto | null>(null);
  public showStudents = signal<boolean>(true);

  public activeModal = signal<ModalType>(ModalType.NONE);
  
  @Input() slot: ScheduleSlotResponseDto | null = null;
  @Output() onUpdate = new EventEmitter<ScheduleSlotResponseDto>();
  @Output() onDelete = new EventEmitter<ScheduleSlotResponseDto>();

  constructor() {
    this.studentSearch$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.facadeScheduleSlotService.searchStudents(term))
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
    const name = (event.target as HTMLInputElement).value;

    this.selectedStudent.set(null);
    this.showStudents.set(true);

    this.studentSearch$.next(name);
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