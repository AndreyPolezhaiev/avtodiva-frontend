import { inject, Injectable, signal } from "@angular/core";
import { NotificationService } from "../../notification/notification.service";
import {  Observable, of, tap } from "rxjs";
import { SearchScheduleSlotService } from "./use-cases/search-schedule-slot.service";
import { ScheduleSlotResponseDto } from "../../../models/schedule-slot/schedule-slot.response";
import { SlotSearchParametersDto } from "../../../models/schedule-slot/schedule-slot.search";
import { SlotFiltersState } from "../../../models/schedule-slot/schedule-slot-filters.state";
import { DataRegistryService } from "../../../shared/registry/data-registry.service";
import { DateFormatter } from "../../../shared/utils/date-formatter.service";

@Injectable({ providedIn: 'root' })
export class ScheduleSlotFacadeService {
  private readonly STORAGE_KEY = 'avtodiva_schedule_filters';

  private dataRegistryService = inject(DataRegistryService);
  private searchService = inject(SearchScheduleSlotService);

  #prefillCache = new Map<number, any>();
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
    return this.#instructors;
  }

  public get cars() {
    return this.#cars;
  }

  public get currentFilters() {
    return this.#lastSearchParams;
  }
}