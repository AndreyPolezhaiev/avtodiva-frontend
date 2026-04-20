import { inject, Injectable, signal } from "@angular/core";
import { StudentService } from "../../../student/student.service";
import { InstructorService } from "../../../instructor.service";
import { CarService } from "../../../car.service";
import { InstructorResponseDto } from "../../../../models/instructor/instructor.response";
import { CarResponseDto } from "../../../../models/car/car.response";
import { NotificationService } from "../../../notification/notification.service";
import {  Observable, of, tap } from "rxjs";
import { StudentResponseDto } from "../../../../models/student/student.response";
import { SearchScheduleSlotService } from "./search-schedule-slot.service";
import { LoadDataType } from "../../../../shared/load-type";
import { ScheduleSlotResponseDto } from "../../../../models/schedule-slot/schedule-slot.response";
import { SlotSearchParametersDto } from "../../../../models/schedule-slot/schedule-slot.search";
import { SlotFiltersState } from "../../../../models/schedule-slot/schedule-slot-filters.state";

@Injectable({ providedIn: 'root' })
export class ScheduleSlotFacadeService {
  private readonly STORAGE_KEY = 'avtodiva_schedule_filters';

  private studentService = inject(StudentService);
  private instructorService = inject(InstructorService);
  private carService = inject(CarService);
  private searchService = inject(SearchScheduleSlotService);

  #prefillCache = new Map<number, any>();
  #lastSearchParams = signal<SlotFiltersState>({} as SlotFiltersState);
  readonly #instructors = signal<InstructorResponseDto[]>([]);
  readonly #cars = signal<CarResponseDto[]>([]);

  readonly #scheduleSlots = signal<ScheduleSlotResponseDto[]>([]);
  readonly #isSearching = signal<boolean>(false);

  constructor() {
    this.initDefaultFilters();
    this.loadInitialData();
  };

  private initDefaultFilters(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      this.#lastSearchParams.set(parsed);
      return;
    }

    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    this.#lastSearchParams.set({
      dateFrom: this.formatDate(today),
      dateTo: this.formatDate(nextWeek),
      booked: null,
      instructorIds: [],
      carIds: [],
      studentId: null,
      studentName: ''
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public searchSlots(filters: SlotFiltersState): void {
    this.#lastSearchParams.set(filters);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filters));

    const { studentName, ...searchDto } = filters;
    const cleanedFilters = this.removeEmptyFilters(searchDto);

    this.#isSearching.set(true);
    this.searchService.searchSlots(cleanedFilters).subscribe({
      next: (slots) => {
        this.#scheduleSlots.set(slots);
        this.#isSearching.set(false);
      },
      error: (err) => {
        NotificationService.showError('Помилка при пошуку занять', err);
        this.#isSearching.set(false);
      }
    });
  }

  public refreshSlots(): void {
    this.searchSlots(this.#lastSearchParams());
  }

  private removeEmptyFilters(params: any): SlotSearchParametersDto {
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

    return cleanParams as SlotSearchParametersDto;
  }

  public getStudentPrefillData(studentId: number): Observable<any> {
    if (this.#prefillCache.has(studentId)) {
      console.log('Student prefill data was taken from cache:', studentId);
      return of(this.#prefillCache.get(studentId));
    }

    return this.searchService.getStudentPrefillData(studentId).pipe(
      tap(data => {
        if (data) {
          this.#prefillCache.set(studentId, data);
        }
      })
    );
  }

  public get slots() { 
    return this.#scheduleSlots.asReadonly(); 
  }

  public get isSearching() { 
    return this.#isSearching.asReadonly(); 
  }

  public get instructors() {
    return this.#instructors.asReadonly();
  }

  public get cars() {
    return this.#cars.asReadonly();
  }

  public searchStudents(term: string): Observable<StudentResponseDto[]> {
    if (term.length <= 2) {
      return of([]);
    }
    return this.studentService.searchStudents(term);
  }

  public get currentFilters() {
    return this.#lastSearchParams;
  }

  public refreshData(dataType: LoadDataType): void {
    switch (dataType) {
      case LoadDataType.INSTRUCTORS:
        this.loadInstructors();
        break;
      case LoadDataType.CARS:
        this.loadCars();
        break;
    }
  }

  private loadInitialData() {
    this.loadCars();
    this.loadInstructors();
  }

  private loadInstructors() {
    this.instructorService.getAllInstructors().subscribe({
      next: (instructors) => {
        this.#instructors.set(instructors);
      },
      error: (err) => NotificationService.showError('Не вдалося завантажити інструкторів', err)
    });
  }

  private loadCars() {
    this.carService.getAllCars().subscribe({
      next: (cars) => {
        this.#cars.set(cars);
      },
      error: (err) => NotificationService.showError('Не вдалося завантажити машини', err)
    })
  }
}