import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CarResponseDto } from '../../../models/car/car.response';
import { CarRequestDto } from '../../../models/car/car.request';
import { FormsModule, NgForm } from '@angular/forms';
import { CarManagementService } from '../../../services/car/management/car-management.service';
import { CarFacadeService } from '../../../services/car/management/facade-car.service';

type ModalType = 'ADD' | 'GET_BY_ID' | 'UPDATE' | 'DELETE' | null;

@Component({
  selector: 'app-car-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car.component.html',
  styleUrl: './car.component.scss'
})
export class CarComponent {
  private carManagementService = inject(CarManagementService);
  private carFacadeService = inject(CarFacadeService);

  public cars = this.carFacadeService.cars;
  public activeModal = signal<ModalType>(null);
  public selectedCar = signal<CarResponseDto | null>(null);

  constructor() {};

  public createCar(form: NgForm): void {
    if (form.valid) {
      const carRequest: CarRequestDto = {
        name: form.value.model
      };

      this.carManagementService.createCar(carRequest).subscribe({
        next: () => {
          form.reset();

          this.closeControlModal();
        },

        error: (error: HttpErrorResponse) => {
          this.handleError('Не вдалося створити машину', error);
        }
      });
    }
  }

  public refreshCars(): void {
    this.carFacadeService.refreshCars();
  }

  public updateCar(form: NgForm): void {
    const currentCar = this.selectedCar();

    if (form.valid && currentCar) {
      const carRequest: CarRequestDto = {
        name: form.value.model
      };

      this.carManagementService.updateCar(currentCar.id, carRequest).subscribe({
        next: () => {
          form.reset();
          this.selectedCar.set(null);
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
      this.carManagementService.deleteCar(currentCar.id).subscribe({
        next: () => {
          this.selectedCar.set(null);
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

