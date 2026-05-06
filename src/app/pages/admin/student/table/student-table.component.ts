import { CommonModule } from "@angular/common";
import { Component, EventEmitter, HostListener, inject, Input, Output, signal } from "@angular/core";
import { ScheduleSlotResponseDto } from "../../../../models/schedule-slot/schedule-slot.response";
import { ScheduleSlotFacadeService } from "../../../../services/schedule/management/facade-schedule-slot.service";
import { FormsModule, NgForm } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { StudentResponseDto } from "../../../../models/student/student.response";
import { ModalType } from "../../../../shared/modal-type";
import { debounceTime, distinctUntilChanged, merge, Subject, switchMap } from "rxjs";
import { StudentManagementService } from "../../../../services/student/management/student-management.service";
import { StudentFacadeService } from "../../../../services/student/management/facade-student.service";
import { StudentSearchParametersDto } from "../../../../models/student/student.search";

@Component({
  selector: 'app-student-table',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './student-table.component.html',
  styleUrl: './student-table.component.scss'
})
export class StudentTableComponent {
  private facadeStudentService = inject(StudentFacadeService);
  private studentManagementService = inject(StudentManagementService);

  public students = this.facadeStudentService.students;
  public isSearching = this.facadeStudentService.isSearching;

  private studentSearch$ = new Subject<StudentSearchParametersDto>();
  private studentPhoneSearch$ = new Subject<StudentSearchParametersDto>();
  public foundStudents = signal<StudentResponseDto[]>([]);

  public currentFilters = this.facadeStudentService.currentFilters;

  public showList = signal<boolean>(true);
  
  public activeSearchField = signal<'name' | 'phone' | null>(null);
  
  @Output() onUpdate = new EventEmitter<StudentResponseDto>();
  @Output() onDelete = new EventEmitter<StudentResponseDto>();

  constructor() {
    merge(this.studentSearch$, this.studentPhoneSearch$)
    .pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      switchMap(params => this.studentManagementService.searchStudents(params))
    )
    .subscribe(students => {
      this.foundStudents.set(students);
    });
  }

  public onSearch(form: NgForm): void {
    if (form.invalid) return;

    const searchParams: StudentSearchParametersDto = {
      phoneNumber: form.value.studentPhoneNumber,
      name: form.value.studentName
    }
    
    this.facadeStudentService.searchStudents(searchParams);
  }

  public emitUpdate(student: StudentResponseDto): void {
    this.onUpdate.emit(student);
  }

  public emitDelete(student: StudentResponseDto): void {
    this.onDelete.emit(student);
  }

  public onStudentNameInput(event: Event): void {
    const studentName = (event.target as HTMLInputElement).value;
    this.activeSearchField.set("name");

    this.showList.set(true);

    const searchParams: StudentSearchParametersDto = {
      name: studentName
    }

    this.studentSearch$.next(searchParams);
  }

  public onStudentPhoneInput(event: Event): void {
    const studentPhoneNumber = (event.target as HTMLInputElement).value;
    this.activeSearchField.set("phone");

    this.showList.set(true);

    const searchParams: StudentSearchParametersDto = {
      phoneNumber: studentPhoneNumber
    }

    this.studentPhoneSearch$.next(searchParams);
  }

  public selectStudent(student: StudentResponseDto): void {
    this.currentFilters.set({
      name: student.name,
      phoneNumber: student.phoneNumber
  });

    this.showList.set(false);
    this.foundStudents.set([]);
  }

  public stopShowList(): void {
    this.activeSearchField.set(null);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const isAutocompleteItem = target.closest('.autocomplete-list__item');

    if (!isAutocompleteItem) {
      this.activeSearchField.set(null);
      this.foundStudents.set([]);
    }
  }
}