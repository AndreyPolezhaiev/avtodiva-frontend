import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Output, signal } from "@angular/core";
import { ScheduleSlotResponseDto } from "../../../../models/schedule-slot/schedule-slot.response";
import { ScheduleSlotFacadeService } from "../../../../services/schedule/management/facade-schedule-slot.service";
import { FormsModule, NgForm } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { StudentResponseDto } from "../../../../models/student/student.response";
import { ModalType } from "../../../../shared/modal-type";
import { StudentAutocompleteComponent } from "../../student/search/student-autocomplete.component";

@Component({
  selector: 'app-schedule-slot-table',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, StudentAutocompleteComponent],
  templateUrl: './schedule-slot-table.component.html',
  styleUrl: './schedule-slot-table.component.scss'
})
export class ScheduleSlotTableComponent {
  private facadeScheduleSlotService = inject(ScheduleSlotFacadeService);
  
  public slots = this.facadeScheduleSlotService.slots;
  public isSearching = this.facadeScheduleSlotService.isSearching;

  public foundInstructors = this.facadeScheduleSlotService.instructors;
  public foundCars = this.facadeScheduleSlotService.cars;

  public foundStudents = signal<StudentResponseDto[]>([]);
  
  public currentFilters = this.facadeScheduleSlotService.currentFilters;

  public selectedStudent = signal<StudentResponseDto | null>(null);
  public showStudents = signal<boolean>(true);

  public activeModal = signal<ModalType>(ModalType.NONE);
  
  @Output() onUpdate = new EventEmitter<ScheduleSlotResponseDto>();
  @Output() onDelete = new EventEmitter<ScheduleSlotResponseDto>();

  constructor() {
  }

  public onSearch(): void {
    this.facadeScheduleSlotService.searchSlots(this.currentFilters());
  }

  public emitUpdate(slot: ScheduleSlotResponseDto): void {
    this.onUpdate.emit(slot);
  }

  public emitDelete(slot: ScheduleSlotResponseDto): void {
    this.onDelete.emit(slot);
  }

  public selectStudent(student: StudentResponseDto | null): void {
    const filters = this.currentFilters();
    
    if (student) {
      filters.studentId = student.id;
      filters.studentName = `${student.name}, ${student.phoneNumber}`;
      this.selectedStudent.set(student);
    } 
    else {
      filters.studentId = undefined;
      this.selectedStudent.set(null);
    }

    this.showStudents.set(false);
    this.foundStudents.set([]);
  }

  public stopShowStudentsList(): void {
    this.showStudents.set(false);
  }
}