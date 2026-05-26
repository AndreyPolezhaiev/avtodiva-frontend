import { Component, computed, inject, signal } from "@angular/core";
import { InstructorResponseDto } from "../../../models/instructor/instructor.response";
import { FormsModule, NgForm } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { InstructorRequestDto } from "../../../models/instructor/instructor.request";
import { HttpErrorResponse } from "@angular/common/http";
import { InstructorManagementService } from "../../../services/instructor/management/instructor-management.service";
import { InstructorFacadeService } from "../../../services/instructor/management/facade-instructor.service";
import { NotificationService } from "../../../services/notification/notification.service";
import { ModalType } from "../../../shared/modal-type";
import { ScheduleTemplateResponseDto } from "../../../models/template/time/schedule-template.response";
import { ScheduleTemplateRequestDto } from "../../../models/template/time/schedule-template.request";
import { ScheduleTemplateService } from "../../../services/schedule/template/time/schedule-template.service";
import { InstructorDetailedResponseDto } from "../../../models/instructor/instructor.detailed";
import { TimeSlotDto } from "../../../models/template/time/time-slot.dto";

@Component({
  selector: 'app-instructor-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './instructor.component.html',
  styleUrl: './instructor.component.scss'
})
export class InstructorComponent {
  public readonly ModalType = ModalType;

  private instructorManagementService = inject(InstructorManagementService);
  private facadeInstructorService = inject(InstructorFacadeService);
  private scheduleTemplateService = inject(ScheduleTemplateService);

  public instructors = this.facadeInstructorService.instructors;
  public selectedInstructor = signal<InstructorResponseDto | null>(null);
  public activeModal = signal<ModalType>(ModalType.NONE);

  public instructorSchedule = signal<ScheduleTemplateResponseDto>({} as ScheduleTemplateResponseDto);
  public intervals = signal<TimeSlotDto[]>([]);

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
          NotificationService.showError('Не вдалося створити інструктора', error);
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
          this.closeControlModal();
        },

        error: (error: HttpErrorResponse) => {
          NotificationService.showError('Не вдалося оновити інструктора', error);
        }
      })
    }
  }

  public deleteInstructorById(): void {
    const currentInstructor = this.selectedInstructor();

    if (currentInstructor) {
      this.instructorManagementService.deleteInstructor(currentInstructor.id).subscribe({
        next: () => {
          this.closeControlModal();
        },

        error: (error: HttpErrorResponse) => {
          NotificationService.showError('Не вдалося видалити інструктора', error);
        }
      })
    }
  }

  public removeInterval(index: number): void {
    this.intervals.update((intervals) => intervals.filter((_, i) => i !== index));
  }

  public updateInstructorSchedule(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const currentInstructor = this.selectedInstructor();
    if (!currentInstructor) {
      return;
    }

    const existingIntervals = this.instructorSchedule()?.intervals || [];
    const addedIntervals = this.intervals();

    const hasInvalidInterval = addedIntervals.some(interval => 
      !interval.startTime || !interval.endTime || interval.startTime >= interval.endTime
    );

    if (hasInvalidInterval) {
      NotificationService.showError(
        'Помилка валідації', 
        { message: 'Перевірте введені інтервали. Час початку має бути меншим за час закінчення.' } as any
      );
      return;
    }

    const allIntervals = [...existingIntervals, ...addedIntervals];

    const validIntervals = allIntervals.filter(
      interval => interval.startTime && interval.endTime && interval.startTime < interval.endTime
    );

    const validUniqueIntervals = [
      ...new Map(validIntervals.map(item => [`${item.startTime}-${item.endTime}`, item])).values()
    ];

    const templateRequest: ScheduleTemplateRequestDto = {
      intervals: validUniqueIntervals
    };

    this.scheduleTemplateService.updateTemplateById(this.instructorSchedule().id, templateRequest).subscribe({
      next: () => {
        form.reset();
        this.intervals.set([]);
        this.closeControlModal();

        NotificationService.showSuccess('Шаблон розкладу успішно оновлено');
      },
      error: (error: HttpErrorResponse) => {
        NotificationService.showError('Не вдалося оновити шаблон розкладу', error);
      }
    });
  }

  public addScheduleInterval(startTime: string, endTime: string): void {
    const newInterval: TimeSlotDto = {
      startTime: startTime,
      endTime: endTime
    };

    this.intervals.update((intervals) => [...intervals, newInterval]);
  }

  public refreshInstructors(): void {
    this.facadeInstructorService.refreshInstructors();
  }

  public openControlModal(type: ModalType): void {
      this.activeModal.set(type);
  }

  public closeControlModal(): void {
    this.activeModal.set(ModalType.NONE);
    this.selectedInstructor.set(null);
  }

  public openUpdateModal(instructor: InstructorResponseDto): void {
    this.activeModal.set(ModalType.UPDATE);
    this.selectedInstructor.set(instructor);
  }

  public openDeleteModal(instructor: InstructorResponseDto): void {
    this.activeModal.set(ModalType.DELETE);
    this.selectedInstructor.set(instructor);
  }

  public openScheduleModal(instructor: InstructorResponseDto): void {
    this.activeModal.set(ModalType.SCHEDULE);
    this.selectedInstructor.set(instructor);

    this.instructorManagementService.getDetailedInstructor(instructor.id).subscribe({
      next: (detailedInstructor) => {
        console.log('Detailed instructor data:', detailedInstructor.scheduleTemplate);
        this.instructorSchedule.set(detailedInstructor.scheduleTemplate);
        this.intervals.set(detailedInstructor.scheduleTemplate.intervals || []);
      },
      error: (error: HttpErrorResponse) => {
        NotificationService.showError('Не вдалося завантажити розклад інструктора', error);
      }
    });
  }
}