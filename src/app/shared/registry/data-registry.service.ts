import { Injectable, inject, signal } from "@angular/core";
import { CarService } from "../../services/car/car.service";
import { InstructorResponseDto } from "../../models/instructor/instructor.response";
import { CarResponseDto } from "../../models/car/car.response";
import { SearchInstructorService } from "../../services/instructor/management/use-cases/search-instructor.service";
import { LoadDataType } from "../load-type";

@Injectable({ providedIn: 'root' })
export class DataRegistryService {
  private searchInstructorService = inject(SearchInstructorService);
  private carService = inject(CarService);

  readonly #instructors = signal<InstructorResponseDto[]>([]);
  readonly #cars = signal<CarResponseDto[]>([]);

  constructor() {
    this.refreshAll();
  }

  public refreshAll(): void {
    this.refreshInstructors();
    this.refreshCars();
  }

  public refreshData(dataType: LoadDataType): void {
    switch (dataType) {
      case LoadDataType.INSTRUCTORS:
        this.refreshInstructors();
        break;
      case LoadDataType.CARS:
        this.refreshCars();
        break;
    }
  }

  private refreshInstructors(): void {
    this.searchInstructorService.getAllInstructors().subscribe(data => this.#instructors.set(data));
  }

  private refreshCars(): void {
    this.carService.getAllCars().subscribe(data => this.#cars.set(data));
  }

  public get instructors() {
    return this.#instructors.asReadonly();
  }

  public get cars() {
    return this.#cars.asReadonly();
  }
}