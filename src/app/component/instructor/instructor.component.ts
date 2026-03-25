import { Component, signal } from "@angular/core";
import { InstructorService } from "../../service/instructor.service";
import { InstructorResponseDto } from "../../model/instructor/instructor.response";
import { FormsModule, NgForm } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { InstructorRequestDto } from "../../model/instructor/instructor.request";
import { HttpErrorResponse } from "@angular/common/http";
import { InstructorDetailedResponseDto } from "../../model/instructor/instructor.detailed";

type ModalType = 'ADD' | 'GET_BY_ID' | 'GET_DETAILED_BY_ID' | 'UPDATE' | 'DELETE' | null;

@Component({
  selector: 'app-instructor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './instructor.component.html',
  styleUrl: './instructor.component.scss'
})
export class InstructorComponent {
  public instructors = signal<InstructorResponseDto[]>([]);
  public detailedInstructors = signal<InstructorDetailedResponseDto[]>([]);
  public selectedInstructor = signal<InstructorResponseDto | null>(null);
  public activeModal = signal<ModalType>(null);

  constructor(private instructorService: InstructorService){}

  ngOnInit(): void {
    this.getAllInstructors();
  }

  public createInstructor(form: NgForm): void {
    if (form.valid) {
      const newInstructor: Partial<InstructorRequestDto> = {name: form.value.name};

      this.instructorService.createInstructor(newInstructor as InstructorRequestDto).subscribe({
        next: (instructorFromServer) => {
          this.instructors.update(instructors => [...instructors, instructorFromServer]);
          form.reset();
          this.closeControlModal();
        },

        error: (error: HttpErrorResponse) => {
          this.handleError('Не вдалося створити інструктора', error);
        }
      })
    }
  }

  public getAllInstructors(): void {
    this.instructorService.getAllInstructors().subscribe({
      next: (instructorsResponse: InstructorResponseDto[]) => {
        this.instructors.set(instructorsResponse);
      },

      error: (error: HttpErrorResponse) => {
        this.handleError('Не вдалося отримати список інструкторів', error)
      }
    })
  }

  public getDetailedInstructorById(id: number): void {
    if (!isNaN(id)) {
      this.instructorService.getDetailedInstructorById(id).subscribe({
        next: (instructorResponse: InstructorDetailedResponseDto) => {
          console.log('Детальні дані інструктора:', instructorResponse);
          this.detailedInstructors.set([instructorResponse]);
          this.activeModal.set('GET_DETAILED_BY_ID');
        },

        error: (error: HttpErrorResponse) => {
          this.handleError(`Не вдалося отримати інструктора за ID: ${id}`, error);
        }
      })
    }
  }

  public updateInstructor(form: NgForm): void {
    const currentInstructor = this.selectedInstructor();

    if (form.valid && currentInstructor) {
      const updatedInstructor: InstructorRequestDto = {name: form.value.instructorName};

      this.instructorService.updateInstructor(currentInstructor.id, updatedInstructor).subscribe({
        next: (instructorResponse: InstructorResponseDto) => {
          this.instructors.update(
            currentInstructors => currentInstructors.map(i => i.id == currentInstructor.id ? instructorResponse : i)
          );

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
      this.instructorService.deleteInstructorById(currentInstructor.id).subscribe({
        next: () => {
          this.instructors.update(currentInstructors => currentInstructors.filter(i => i.id !== currentInstructor.id));
          this.detailedInstructors.update(list => list.filter(i => i.id !== currentInstructor.id));
          this.closeIconModal();
        },

        error: (error: HttpErrorResponse) => {
          this.handleError('Не вдалося видалити інструктора', error);
        }
      })
    }
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