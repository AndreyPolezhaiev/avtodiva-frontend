import { inject, Injectable } from "@angular/core";
import { CarService } from "../../car.service";
import { Observable } from "rxjs";
import { CarRequestDto } from "../../../../models/car/car.request";
import { CarResponseDto } from "../../../../models/car/car.response";

@Injectable({
  providedIn: 'root'
})
export class CreateCarService {
  private carService = inject(CarService);

  public createCar(carRequest: CarRequestDto): Observable<CarResponseDto> {
    return this.carService.createCar(carRequest);
  }
}