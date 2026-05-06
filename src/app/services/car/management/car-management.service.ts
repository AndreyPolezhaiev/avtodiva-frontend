import { inject, Injectable } from "@angular/core";
import { CreateCarService } from "./use-cases/create-car.service";
import { SearchCarService } from "./use-cases/search-car.service";
import { DeleteCarService } from "./use-cases/delete-car.service";
import { UpdateCarService } from "./use-cases/update-car.service";
import { CarResponseDto } from "../../../models/car/car.response";
import { Observable, tap } from "rxjs";
import { CarRequestDto } from "../../../models/car/car.request";
import { DataRegistryService } from "../../../shared/registry/data-registry.service";
import { LoadDataType } from "../../../shared/load-type";

@Injectable({
  providedIn: 'root'
})
export class CarManagementService {
  private dataRegistryService = inject(DataRegistryService);
  private createCarService = inject(CreateCarService);
  private updateCarService = inject(UpdateCarService);
  private deleteCarService = inject(DeleteCarService);

  public get cars() {
    return this.dataRegistryService.cars;
  }

  public createCar(carRequest: CarRequestDto): Observable<CarResponseDto> {
    return this.createCarService.createCar(carRequest).pipe(
      tap(() => this.dataRegistryService.refreshData(LoadDataType.CARS))
    );
  }

  public updateCar(carId: number, carRequest: CarRequestDto): Observable<CarResponseDto> {
    return this.updateCarService.updateCar(carId, carRequest).pipe(
      tap(() => this.dataRegistryService.refreshData(LoadDataType.CARS))
    );
  }

  public deleteCar(carId: number): Observable<void> {
    return this.deleteCarService.deleteCar(carId).pipe(tap(
      () => this.dataRegistryService.refreshData(LoadDataType.CARS)
    ));
  }
}