import { Input, Output, EventEmitter, signal, Component, inject, output, forwardRef, booleanAttribute } from "@angular/core";
import { StudentResponseDto } from "../../../../models/student/student.response";
import { debounceTime, distinctUntilChanged, Subject, switchMap } from "rxjs";
import { StudentManagementService } from "../../../../services/student/management/student-management.service";
import { StudentSearchParametersDto } from "../../../../models/student/student.search";
import { CommonModule } from "@angular/common";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: 'app-student-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-autocomplete.component.html',
  styleUrl: './student-autocomplete.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StudentAutocompleteComponent),
      multi: true
    }
  ]
})
export class StudentAutocompleteComponent implements ControlValueAccessor {
  public value: string = '';
  private onChange: (value: string) => void = () => {};
  public onTouched: () => void = () => {};
  public isDisabled = false;

  @Input() containerClass = 'form__field';
  @Input() labelClass = 'form__label';
  @Input() inputClass = 'form__input';
  @Input() label = "Студент:";
  @Input() placeholder = "Пошук...";
  @Input() name = "studentName";
  @Input({ transform: booleanAttribute }) required = false;
  @Input() autocomplete: string = 'off';

  @Output() selectedStudent = new EventEmitter<StudentResponseDto | null>();

  public foundStudents = signal<StudentResponseDto[]>([]); 
  public isVisible = signal<boolean>(false);

  private studentManagementService = inject(StudentManagementService);
  private studentSearch$ = new Subject<StudentSearchParametersDto>();

  constructor() {
    this.studentSearch$.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      switchMap(term => this.studentManagementService.searchStudents(term))
    ).subscribe(students => {
      this.foundStudents.set(students);
    });
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.updateValue(val);
    
    this.isVisible.set(true);
    this.selectedStudent.emit(null);

    if (!val.trim()) {
      this.foundStudents.set([]);
      this.isVisible.set(false);
      return;
    }

    this.studentSearch$.next({ name: val });
  }

  onSelect(student: StudentResponseDto) {
    this.isVisible.set(false);
    this.foundStudents.set([]);
    this.updateValue(student.name);
    this.selectedStudent.emit(student); 
  }

  private updateValue(val: string) {
    this.value = val;
    this.onChange(val);
    this.onTouched();
  }
}