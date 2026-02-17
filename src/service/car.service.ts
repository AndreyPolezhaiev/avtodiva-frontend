import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car } from '../model/car.model';
import { environment } from '../environmets/environment';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {};

  public createCar(car: Car): Observable<Car> {
    return this.http.post<Car>(`${this.apiServerUrl}/api/cars`, car);
  }

  public getAllCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiServerUrl}/api/cars/all`);
  }

  public getCarById(id: number): Observable<Car> {
    return this.http.get<Car>(`${this.apiServerUrl}/api/cars/${id}`);
  }

  public deleteCarById(id: number): Observable<string> {
    return this.http.delete(`${this.apiServerUrl}/api/cars/${id}`, { responseType: 'text' });
  }

  public updateCar(id: number, car: Car): Observable<Car> {
    return this.http.put<Car>(`${this.apiServerUrl}/api/cars/${id}`, car);
  }
}
