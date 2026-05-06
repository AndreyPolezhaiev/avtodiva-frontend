import { Component, computed, inject, signal } from "@angular/core";
import { InstructorResponseDto } from "../../../models/instructor/instructor.response";
import { FormsModule, NgForm } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { InstructorRequestDto } from "../../../models/instructor/instructor.request";
import { HttpErrorResponse } from "@angular/common/http";
import { InstructorManagementService } from "../../../services/instructor/management/instructor-management.service";
import { InstructorFacadeService } from "../../../services/instructor/management/facade-instructor.service";

type ModalType = 'ADD' | 'GET_BY_ID' | 'GET_DETAILED_BY_ID' | 'UPDATE' | 'DELETE' | null;

@Component({
  selector: 'app-instructor-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './instructor.component.html',
  styleUrl: './instructor.component.scss'
})
export class InstructorComponent {
  private instructorManagementService = inject(InstructorManagementService);
  private facadeInstructorService = inject(InstructorFacadeService);

  public instructors = this.facadeInstructorService.instructors;
  public selectedInstructor = signal<InstructorResponseDto | null>(null);
  public activeModal = signal<ModalType>(null);

  constructor(){}

  public createInstructor(form: NgForm): void {
    if (form.valid) {
      const instructorRequest: InstructorRequestDto = {
        name: form.value.name
      };

      this.instructorManagementService.createInstructor(instructorRequest).subscribe({
        next: () => {
          form.reset();
          this.closeControlModal();
        },

        error: (error: HttpErrorResponse) => {
          this.handleError('Не вдалося створити інструктора', error);
        }
      })
    }
  }

  public updateInstructor(form: NgForm): void {
    const currentInstructor = this.selectedInstructor();

    if (form.valid && currentInstructor) {
      const instructorRequest: InstructorRequestDto = {
        name: form.value.instructorName
      };

      this.instructorManagementService.updateInstructor(currentInstructor.id, instructorRequest).subscribe({
        next: () => {
          form.reset();
          this.closeIconModal();
        },

        error: (error: HttpErrorResponse) => {
          this.handleError('Не вдалося оновити інструктора', error);
        }
      })
    }
  }

  public deleteInstructorById(): void {
    const currentInstructor = this.selectedInstructor();

    if (currentInstructor) {
      this.instructorManagementService.deleteInstructor(currentInstructor.id).subscribe({
        next: () => {
          this.closeIconModal();
        },

        error: (error: HttpErrorResponse) => {
          this.handleError('Не вдалося видалити інструктора', error);
        }
      })
    }
  }

  public refreshInstructors(): void {
    this.facadeInstructorService.refreshInstructors();
  }

  public openControlModal(type: ModalType): void {
      this.activeModal.set(type);
  }

  public closeControlModal(): void {
    this.activeModal.set(null);
  }

  public openIconModal(type: ModalType, instructor: InstructorResponseDto): void {
    this.activeModal.set(type);
    this.selectedInstructor.set(instructor);
  }

  public closeIconModal(): void {
    this.activeModal.set(null);
    this.selectedInstructor.set(null);
  }

  private handleError(message: string, error: HttpErrorResponse): void {
    console.error(message, error);
    alert(`${message}. Код ошибки: ${error.status}`);
  }
}