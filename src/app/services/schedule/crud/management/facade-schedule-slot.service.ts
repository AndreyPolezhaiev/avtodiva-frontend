import { inject, Injectable, signal } from "@angular/core";
import { NotificationService } from "../../../notification/notification.service";
import {  finalize, Observable, of, shareReplay, take, tap } from "rxjs";
import { SearchScheduleSlotService } from "./use-cases/search-schedule-slot.service";
import { ScheduleSlotResponseDto } from "../../../../models/schedule-slot/schedule-slot.response";
import { SlotSearchParametersDto } from "../../../../models/schedule-slot/schedule-slot.search";
import { SlotFiltersState } from "../../../../models/schedule-slot/schedule-slot-filters.state";
import { DataRegistryService } from "../../../../shared/registry/data-registry.service";
import { DateFormatter } from "../../../../shared/utils/date-formatter.service";
import { NgForm } from "@angular/forms";
import { StudentResponseDto } from "../../../../models/student/student.response";
import { StudentPrefillData } from "../../../../models/student/student-prefill-data";

@Injectable({ providedIn: 'root' })
export class ScheduleSlotFacadeService {
  private readonly STORAGE_KEY = 'avtodiva_schedule_filters';

  private dataRegistryService = inject(DataRegistryService);
  private searchService = inject(SearchScheduleSlotService);

  #prefillCache = new Map<number, StudentPrefillData>();
  #activePrefillRequests = new Map<number, Observable<any>>();

  #lastSearchParams = signal<SlotFiltersState>({} as SlotFiltersState);
  readonly #instructors = this.dataRegistryService.instructors;
  readonly #cars = this.dataRegistryService.cars;

  readonly #scheduleSlots = signal<ScheduleSlotResponseDto[]>([]);
  readonly #isSearching = signal<boolean>(false);

  constructor() {
    this.initDefaultFilters();
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
      dateFrom: DateFormatter.formatToISODate(today),
      dateTo: DateFormatter.formatToISODate(nextWeek),
      booked: null,
      instructorIds: [],
      carIds: [],
      studentId: null,
      studentName: ''
    });
  }

  public searchSlots(filters: SlotFiltersState): void {
    this.#lastSearchParams.set(filters);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filters));

    const { studentName, ...searchDto } = filters;
    const cleanedFilters = this.removeEmptyFilters(searchDto);

    console.log('Searching with filters:', cleanedFilters);

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

    console.log('Searching with filters:', cleanParams);

    return cleanParams as SlotSearchParametersDto;
  }

  private getStudentPrefillData(studentId: number): Observable<any> {
    if (this.#prefillCache.has(studentId)) {
      return of(this.#prefillCache.get(studentId));
    }

    if (this.#activePrefillRequests.has(studentId)) {
      return this.#activePrefillRequests.get(studentId)!;
    }

    const request$ = this.searchService.getStudentPrefillData(studentId).pipe(
      tap(data => {
        if (data) {
          this.#prefillCache.set(studentId, data);
        }
      }),
      finalize(() => {
        this.#activePrefillRequests.delete(studentId);
      }),
      shareReplay(1)
    );

    this.#activePrefillRequests.set(studentId, request$);
    return request$;
  }

  public fillStudentData(form: NgForm, student: StudentResponseDto): void {
    form.form.patchValue({
      studentName: student.name,
      studentPhoneNumber: student.phoneNumber || ''
    });

   this.getStudentPrefillData(student.id)
    .pipe(take(1))
    .subscribe(data => {
      if (data) {
        form.form.patchValue(data);
      }
    });
  }

  public updateStudentPrefillCache(studentId: number | undefined, newData: StudentPrefillData): void {
    if (!studentId) {
      return;
    }

    this.#prefillCache.set(studentId, newData);
  }

  public get slots() { 
    return this.#scheduleSlots.asReadonly(); 
  }

  public get isSearching() { 
    return this.#isSearching.asReadonly(); 
  }

  public get instructors() {
    return this.#instructors;
  }

  public get cars() {
    return this.#cars;
  }

  public get currentFilters() {
    return this.#lastSearchParams;
  }
}