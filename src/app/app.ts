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

  public createCar(): void {
    const newName = prompt('Введите новое название для машины:');

    if (newName) {
      const newCar: Partial<Car> = {name: newName};

      this.carService.createCar(newCar as Car).subscribe ({
        next: (carFromServer) => {
          this.cars.update(cars => [...cars, carFromServer]);
        },

        error: (error: HttpErrorResponse) => {
          console.error('Ошибка при добавлении:', error);
          alert(error.message);
        }
      });
    }
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

  public getCarById(): void {
    const input = prompt('Введите id машины:');
    if (input) {
      const id = Number(input);

      if (!isNaN(id)) {
        this.carService.getCarById(id).subscribe({
          next: (carFromServer) => {
            this.cars.set([carFromServer]);
            console.log('Машина найдена:', carFromServer);
          },

          error: (err) => {
            console.error('Ошибка!', err);
            alert('Не удалось найти на сервере');
          }
        });
      }
      else {
        alert('Пожалуйста, введите корректное число');
      }
    }
  }

  public updateCar(car: Car): void {
    const newName = prompt('Введите новое название для машины:', car.name);

    if (newName && newName !== car.name) {
      const updatedCar: Car = { ...car, name: newName };

      this.carService.updateCar(car.id, updatedCar).subscribe({
        next: (carFromServer) => {
          this.cars.update(
            currentCars => currentCars.map(c => c.id === car.id ? carFromServer : c)
          );

          console.log('Данные обновлены локально и на сервере');
        },

        error: (err) => {
          console.error('Ошибка!', err);
          alert('Не удалось сохранить на сервере');
        }
      })
    } 
    else {
      alert('Пожалуйста, введите корректное название');
    }
  }

  public deleteCarById(id: number): void {
    if (confirm('Вы уверены, что хотите удалить эту машину?')) {
      this.carService.deleteCarById(id).subscribe({
        next: () => {
          this.cars.update(currentCars => currentCars.filter(c => c.id !== id));
        },

        error: (err) => console.error('Ошибка при удалении', err)
      });
    }
    else {
      alert('Пожалуйста, введите корректное число');
    }
  }
}

