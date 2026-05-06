import { inject, Injectable } from "@angular/core";
import { DataRegistryService } from "../../../shared/registry/data-registry.service";
import { LoadDataType } from "../../../shared/load-type";

@Injectable({
  providedIn: 'root'
})
export class CarFacadeService {
  private dataRegistryService = inject(DataRegistryService);
  readonly #cars = this.dataRegistryService.cars;

  public get cars() {
    return this.#cars;
  }

  public refreshCars(): void {
    this.dataRegistryService.refreshData(LoadDataType.CARS);
  }
}