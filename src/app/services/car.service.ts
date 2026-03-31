import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environmets/environment';
import { CarRequestDto } from '../models/car/car.request';
import { CarResponseDto } from '../models/car/car.response';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private apiUrl = `${environment.apiBaseUrl}/api/cars`;

  constructor(private http: HttpClient) {};

  public createCar(car: CarRequestDto): Observable<CarResponseDto> {
    return this.http.post<CarResponseDto>(this.apiUrl, car);
  }

  public getAllCars(): Observable<CarResponseDto[]> {
    return this.http.get<CarResponseDto[]>(`${this.apiUrl}/all`);
  }

  public getCarById(id: number): Observable<CarResponseDto> {
    return this.http.get<CarResponseDto>(`${this.apiUrl}/${id}`);
  }

  public updateCar(id: number, car: CarRequestDto): Observable<CarResponseDto> {
    return this.http.put<CarResponseDto>(`${this.apiUrl}/${id}`, car);
  }

  public deleteCarById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
