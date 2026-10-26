import { inject, Injectable, signal } from "@angular/core";
import { finalize } from "rxjs";
import { NotificationService } from "../../notification/notification.service";
import { DataRegistryService } from "../../../shared/registry/data-registry.service";
import { SearchProfitService } from "./use-cases/search-profit.service";
import { ProfitSearchParametersDto } from "../../../models/analytics/profit.search";
import { ProfitResponseDto } from "../../../models/analytics/profit.response";

@Injectable({
  providedIn: "root"
})
export class AnalyticsFacadeService {
  private readonly STORAGE_KEY = 'avtodiva_analytics_filters';

  private dataRegistryService = inject(DataRegistryService);
  private searchService = inject(SearchProfitService);

  readonly #instructors = this.dataRegistryService.instructors;
  readonly #cars = this.dataRegistryService.cars;
  readonly #profit = signal<ProfitResponseDto | null>(null);

  #lastSearchParams = signal<ProfitSearchParametersDto>({} as ProfitSearchParametersDto);
  readonly #isSearching = signal<boolean>(false);

  constructor() {
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
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    this.#lastSearchParams.set({
      from: this.formatDate(monthStart),
      to: this.formatDate(today)
    });
  }

  public searchProfit(filters: ProfitSearchParametersDto): void {
    this.#lastSearchParams.set(filters);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filters));

    const cleanedFilters = this.removeEmptyFilters(filters);

    this.#isSearching.set(true);
    this.searchService.getProfit(cleanedFilters)
    .pipe(finalize(() => this.#isSearching.set(false)))
    .subscribe({
      next: (profit) => this.#profit.set(profit),
      error: (err) => NotificationService.showError('Не вдалося завантажити аналітику', err)
    });
  }

  public refreshProfit(): void {
    this.searchProfit(this.#lastSearchParams());
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public get profit() {
    return this.#profit.asReadonly();
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

  public get isSearching() {
    return this.#isSearching.asReadonly();
  }

  private removeEmptyFilters(params: any): ProfitSearchParametersDto {
    const cleanParams: any = {};

    Object.keys(params).forEach(key => {
      const value = params[key];

      if (value !== null && value !== undefined && value !== '') {
        cleanParams[key] = value;
      }
    });

    return cleanParams as ProfitSearchParametersDto;
  }
}
