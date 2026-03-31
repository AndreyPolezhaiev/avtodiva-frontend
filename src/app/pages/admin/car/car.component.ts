import { Component, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CarResponseDto } from '../../../models/car/car.response';
import { CarService } from '../../../services/car.service';
import { CarRequestDto } from '../../../models/car/car.request';
import { FormsModule, NgForm } from '@angular/forms';

type ModalType = 'ADD' | 'GET_BY_ID' | 'UPDATE' | 'DELETE' | null;

@Component({
  selector: 'app-car-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car.component.html',
  styleUrl: './car.component.scss'
})
export class CarComponent implements OnInit {
  public cars = signal<CarResponseDto[]>([]);
  public activeModal = signal<ModalType>(null);
  public selectedCar = signal<CarResponseDto | null>(null);

  constructor(private carService: CarService) {};

  ngOnInit(): void {
    this.getAllCars();
  }

  public createCar(form: NgForm): void {
    if (form.valid) {
      const newCar: Partial<CarRequestDto> = {name: form.value.model};

      this.carService.createCar(newCar as CarRequestDto).subscribe ({
        next: (carFromServer) => {
          this.cars.update(cars => [...cars, carFromServer]);
          form.reset();
          this.closeControlModal();
        },

        error: (error: HttpErrorResponse) => {
          this.handleError('Не вдалося створити машину', error);
        }
      });
    }
  }

  public getAllCars(): void {
    this.carService.getAllCars().subscribe({
      next: (response: CarResponseDto[]) => {
        this.cars.set(response);
      },

      error: (error: HttpErrorResponse) => {
        this.handleError('Не вдалося отримати список машин', error);
      }
    });
  }

  public updateCar(form: NgForm): void {
    const currentCar = this.selectedCar();

    if (form.valid && currentCar) {
      const updatedCar: CarRequestDto = {...currentCar, name: form.value.model};

      this.carService.updateCar(currentCar.id, updatedCar).subscribe({
        next: (carFromServer) => {
          this.cars.update(
            currentCars => currentCars.map(c => c.id === currentCar.id ? carFromServer : c)
          );

          this.closeIconModal();
        },

        error: (error: HttpErrorResponse) => {
          this.handleError('Не вдалося оновити машину', error);
        }
      })
    }
  }

  public deleteCarById(): void {
    const currentCar = this.selectedCar();
    
    if (currentCar) {
      this.carService.deleteCarById(currentCar.id).subscribe({
        next: () => {
          this.cars.update(currentCars => currentCars.filter(c => c.id !== currentCar.id));
          this.closeIconModal();
        },

        error: (error: HttpErrorResponse) => {
          this.handleError('Не вдалося видалити машину', error);
        }
      });
    }
  }

  public openControlModal(type: ModalType): void {
    this.activeModal.set(type);
  }

  public closeControlModal(): void {
    this.activeModal.set(null);
  }

  public openIconModal(type: ModalType, car: CarResponseDto): void {
    this.activeModal.set(type);
    this.selectedCar.set(car);
  }

  public closeIconModal(): void {
    this.activeModal.set(null);
    this.selectedCar.set(null);
  }

  private handleError(message: string, error: HttpErrorResponse): void {
    console.error(message, error);
    alert(`${message}. Код ошибки: ${error.status}`);
  }
}

