import { inject, Injectable } from "@angular/core";
import { CarService } from "../../car.service";
import { CarResponseDto } from "../../../../models/car/car.response";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SearchCarService {
  private carService = inject(CarService);

  public getAllCars(): Observable<CarResponseDto[]> {
    return this.carService.getAllCars();
  }
}