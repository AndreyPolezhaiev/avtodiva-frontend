import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environmets/environment';
import { CarRequestDto } from '../model/car/car.request';
import { CarResponseDto } from '../model/car/car.response';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {};

  public createCar(car: CarRequestDto): Observable<CarResponseDto> {
    return this.http.post<CarResponseDto>(`${this.apiServerUrl}/api/cars`, car);
  }

  public getAllCars(): Observable<CarResponseDto[]> {
    return this.http.get<CarResponseDto[]>(`${this.apiServerUrl}/api/cars/all`);
  }

  public getCarById(id: number): Observable<CarResponseDto> {
    return this.http.get<CarResponseDto>(`${this.apiServerUrl}/api/cars/${id}`);
  }

  public updateCar(id: number, car: CarRequestDto): Observable<CarResponseDto> {
    return this.http.put<CarResponseDto>(`${this.apiServerUrl}/api/cars/${id}`, car);
  }

  public deleteCarById(id: number): Observable<string> {
    return this.http.delete(`${this.apiServerUrl}/api/cars/${id}`, { responseType: 'text' });
  }
}
