import { inject, Injectable, signal } from "@angular/core";
import { InstructorManagementService } from "../../instructor/management/instructor-management-service";
import { InstructorResponseDto } from "../../../models/instructor/instructor.response";
import { NotificationService } from "../../notification/notification.service";
import { SearchWeekendService } from "./use-cases/search-weekend-service";
import { WeekendSearchParametersDto } from "../../../models/weekend/weekend.search";
import { WeekendResponseDto } from "../../../models/weekend/weekend.response";

@Injectable({
  providedIn: "root"
})
export class WeekendFacadeService {
  private readonly STORAGE_KEY = 'avtodiva_weekend_filters';

  private instructorManagementService = inject(InstructorManagementService);
  private searchService = inject(SearchWeekendService);

  readonly #instructors = signal<InstructorResponseDto[]>([]);
  readonly #weekends = signal<WeekendResponseDto[]>([]);

  #lastSearchParams = signal<WeekendSearchParametersDto>({} as WeekendSearchParametersDto);
  readonly #isSearching = signal<boolean>(false);

  constructor() {
    this.loadInsctructors();
    this.initDefaultFilters();
  }

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
      startDate: this.formatDate(today),
      endDate: this.formatDate(nextWeek),
      instructorIds: []
    });
  }

  public searchWeekends(filters: WeekendSearchParametersDto): void {
    this.#lastSearchParams.set(filters);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filters));

    const cleanedFilters = this.removeEmptyFilters(filters);

    this.searchService.searchWeekends(cleanedFilters).subscribe({
      next: (weekends) => {
        this.#weekends.set(weekends);
        this.#isSearching.set(false);
      },
      error: (err) => NotificationService.showError('Не вдалося завантажити вихідні', err)
    });
  }

  public refreshWeekends(): void {
    this.searchWeekends(this.#lastSearchParams());
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public get weekends() {
    return this.#weekends.asReadonly();
  }

  public get instructors() {
    return this.#instructors.asReadonly();
  }

  public get currentFilters() {
    return this.#lastSearchParams;
  }

  public get isSearching() {
    return this.#isSearching.asReadonly();
  }

  private removeEmptyFilters(params: any): WeekendSearchParametersDto {
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

    return cleanParams as WeekendSearchParametersDto;
  }

  private loadInsctructors() {
    this.instructorManagementService.getAllInstructors().subscribe({
      next: (instructors) => {
        this.#instructors.set(instructors);
      },
      error: (err) => NotificationService.showError('Не вдалося завантажити інструкторів', err)
    });
  }
}