import { CommonModule } from "@angular/common";
import { Component, EventEmitter, HostListener, inject, Input, Output, signal } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { StudentResponseDto } from "../../../../models/student/student.response";
import { debounceTime, distinctUntilChanged, merge, Subject, switchMap } from "rxjs";
import { StudentManagementService } from "../../../../services/student/management/student-management.service";
import { StudentFacadeService } from "../../../../services/student/management/facade-student.service";
import { StudentSearchParametersDto } from "../../../../models/student/student.search";
import { StudentAutocompleteComponent } from "../../student/search/student-autocomplete.component";

@Component({
  selector: 'app-student-table',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, StudentAutocompleteComponent],
  templateUrl: './student-table.component.html',
  styleUrl: './student-table.component.scss'
})
export class StudentTableComponent {
  private facadeStudentService = inject(StudentFacadeService);
  private studentManagementService = inject(StudentManagementService);

  public students = this.facadeStudentService.students;
  public isSearching = this.facadeStudentService.isSearching;

  private studentPhoneSearch$ = new Subject<StudentSearchParametersDto>();
  public foundStudents = signal<StudentResponseDto[]>([]);

  public currentFilters = this.facadeStudentService.currentFilters;

  public showList = signal<boolean>(true);

  public activeSearchField = signal<'name' | 'phone' | null>(null);
  
  @Output() onUpdate = new EventEmitter<StudentResponseDto>();
  @Output() onDelete = new EventEmitter<StudentResponseDto>();

  constructor() {
    this.studentPhoneSearch$.pipe(
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

  public onStudentPhoneInput(event: Event): void {
    const studentPhoneNumber = (event.target as HTMLInputElement).value;
    this.activeSearchField.set("phone");

    this.showList.set(true);

    const searchParams: StudentSearchParametersDto = {
      phoneNumber: studentPhoneNumber
    }

    this.studentPhoneSearch$.next(searchParams);
  }

  public selectStudent(student: StudentResponseDto | null): void {
    if (student) {
      this.currentFilters.set({
        name: student.name,
        phoneNumber: student.phoneNumber
      });
    }
    else {
      this.currentFilters.set({});
    }

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