import { inject, Injectable, signal } from "@angular/core";
import { StudentResponseDto } from "../../../models/student/student.response";
import { StudentSearchParametersDto } from "../../../models/student/student.search";
import { StudentManagementService } from "./student-management.service";
import { NotificationService } from "../../notification/notification.service";

@Injectable({
  providedIn: 'root'
})
export class StudentFacadeService {
  private readonly STORAGE_KEY = 'avtodiva_student_filters';
  private lastSearchParams = signal<StudentSearchParametersDto>({} as StudentSearchParametersDto);

  private studentManagementService = inject(StudentManagementService);
  readonly #students = signal<StudentResponseDto[]>([]);
  readonly #isSearching = signal<boolean>(false);

  constructor() {
    this.initDefaultFilters();
  }

  private initDefaultFilters(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      this.lastSearchParams.set(parsed);
      return;
    }

    this.lastSearchParams.set({
      name: '',
      phoneNumber: ''
    });
  }

  public searchStudents(filters: StudentSearchParametersDto) {
    this.lastSearchParams.set(filters);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filters));

    const cleanedFilters = this.removeEmptyFilters(filters);

    this.#isSearching.set(true);
    this.studentManagementService.searchStudents(cleanedFilters).subscribe({
      next: (response) => {
        this.#students.set(response);
        this.#isSearching.set(false);
      },
      error: (err) => {
        NotificationService.showError('Помилка при пошуку учнів', err);
        this.#isSearching.set(false);
      }
    });
  }

  private removeEmptyFilters(params: any): StudentSearchParametersDto {
    const cleanParams: any = {};

    Object.keys(params).forEach(key => {
      const value = params[key];

      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value) && value.length === 0) {
          return;
        }
        cleanParams[key] = value;
      }
    });

    return cleanParams as StudentSearchParametersDto;
  }

  public refreshStudents(): void {
    this.searchStudents(this.lastSearchParams());
  }

  public get students() {
    return this.#students.asReadonly();
  }

  public get isSearching() {
    return this.#isSearching.asReadonly();
  }

  public get currentFilters() {
    return this.lastSearchParams;
  }
}