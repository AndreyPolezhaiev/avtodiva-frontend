import { CommonModule, NgFor } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { ModalType } from "../../../shared/modal-type";
import { StudentManagementService } from "../../../services/student/management/student-management.service";
import { take } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { NotificationService } from "../../../services/notification/notification.service";
import { StudentTableComponent } from "./table/student-table.component";
import { StudentResponseDto } from "../../../models/student/student.response";
import { UpdateStudentRequestDto } from "../../../models/student/student.update";
import { StudentFacadeService } from "../../../services/student/management/facade-student-service";

@Component ({
  selector: 'app-student-page',
  standalone: true,
  imports: [CommonModule, FormsModule, StudentTableComponent],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss'
})
export class StudentComponent {
  public studentManagementService = inject(StudentManagementService);
  public facadeStudentService = inject(StudentFacadeService);

  public readonly ModalType = ModalType;
  public activeModal = signal<ModalType>(ModalType.NONE);

  public studentForDelete: StudentResponseDto | null = null;
  public studentForUpdate: StudentResponseDto | null = null;

  public createStudent(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const studentRequest = {
      name: form.value.studentName,
      phoneNumber: form.value.studentPhoneNumber
    };

    this.studentManagementService.createStudent(studentRequest)
    .pipe(take(1))
    .subscribe({
      next: () => {
        form.resetForm();
        this.closeControlModal();
      }
    });
  }

  public deleteStudent() {
    if (!this.studentForDelete) {
      return;
    }

    this.studentManagementService.deleteStudent(this.studentForDelete.id)
    .pipe(take(1))
    .subscribe({
      next: () => {
        this.closeControlModal();
        this.studentForDelete = null;
        NotificationService.showSuccess('Студента видалено');

        this.facadeStudentService.refreshStudents();
      },
      error: (error: HttpErrorResponse) => {
        NotificationService.showError('Не вдалося видалити студента', error)
      }
    })
  }

  public updateStudent(form: NgForm) {
    if (form.invalid || !this.studentForUpdate) {
      return;
    }

    const studentRequest: UpdateStudentRequestDto = {
      name: form.value.studentName,
      phoneNumber: form.value.studentPhoneNumber
    }

    this.studentManagementService.updateStudent(this.studentForUpdate.id, studentRequest)
    .pipe(take(1))
    .subscribe({
      next: () => {
        this.facadeStudentService.refreshStudents();

        this.closeControlModal();
        form.resetForm();
        this.studentForUpdate = null;
      },
      error: (error: HttpErrorResponse) => {
        NotificationService.showError('Не вдалося оновити студента', error);
      }
    })
  }

  public openDeleteModal(student: StudentResponseDto) {
    this.studentForDelete = student;
    this.activeModal.set(ModalType.DELETE);
  }

  public openUpdateModal(student: StudentResponseDto) {
    this.studentForUpdate = student;
    this.activeModal.set(ModalType.UPDATE);
  }

  public openControlModal(type: ModalType): void {
    this.activeModal.set(type);
  }

  public closeControlModal(): void {
    this.activeModal.set(ModalType.NONE);
  }
}