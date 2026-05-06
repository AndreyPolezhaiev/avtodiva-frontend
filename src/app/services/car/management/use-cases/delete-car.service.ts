import { Injectable, inject } from "@angular/core";
import { CarService } from "../../car.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DeleteCarService {
  private carService = inject(CarService);

  public deleteCar(carId: number): Observable<void> {
    return this.carService.deleteCarById(carId);
  }
}
