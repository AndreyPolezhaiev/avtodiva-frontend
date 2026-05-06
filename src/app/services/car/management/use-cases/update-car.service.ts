import { inject, Injectable } from "@angular/core";
import { CarService } from "../../car.service";
import { CarRequestDto } from "../../../../models/car/car.request";
import { Observable } from "rxjs";
import { CarResponseDto } from "../../../../models/car/car.response";

@Injectable({
  providedIn: 'root'
})
export class UpdateCarService {
  private carService = inject(CarService);

  public updateCar(carId: number, carRequest: CarRequestDto): Observable<CarResponseDto> {
    return this.carService.updateCar(carId, carRequest);
  }
}