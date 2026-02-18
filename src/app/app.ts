import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Car } from '../model/car.model';
import { CarService } from '../service/car.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  public cars = signal<Car[]>([]);

  constructor(private carService: CarService) {};

  ngOnInit(): void {
    this.getAllCars();  
  }

  public getAllCars(): void {
    this.carService.getAllCars().subscribe({
      next: (response: Car[]) => {
        console.log('Данные получены:', response);
        this.cars.set(response);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Ошибка:', error);
        alert(error.message);
      }
    });
  }

  deleteCarById(id: number): void {
    if (confirm('Вы уверены, что хотите удалить эту машину?')) {
      this.carService.deleteCarById(id).subscribe({
        next: () => {
          this.getAllCars(); 
        },
        error: (err) => console.error('Ошибка при удалении', err)
      });
    }
  }

  updateCar(car: Car): void {
  const newName = prompt('Введите новое название для машины:', car.name);

  if (newName && newName !== car.name) {
    const updatedCar: Car = { ...car, name: newName };

    this.carService.updateCar(car.id, updatedCar).subscribe({
      next: (response) => {
        console.log('Машина обновлена:', response);
        this.getAllCars();
      },
      error: (err) => console.error('Ошибка при обновлении:', err)
    });
  }
}
}

