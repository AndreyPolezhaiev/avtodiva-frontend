import { inject, Injectable } from "@angular/core";
import { ScheduleSlotService } from "../../schedule-slot.service";
import { StudentManagementService } from "../../../student/student-management.service";
import { NgForm } from "@angular/forms";
import { StudentResponseDto } from "../../../../models/student/student.response";
import { ScheduleSlotResponseDto } from "../../../../models/schedule-slot/schedule-slot.response";
import { catchError, EMPTY, Observable, switchMap, tap } from "rxjs";
import { StudentRequestDto } from "../../../../models/student/student.request";
import { NotificationService } from "../../../notification/notification.service";
import { ScheduleSlotRequestDto } from "../../../../models/schedule-slot/schedule-slot.create";
import { HttpErrorResponse } from "@angular/common/http";
import { PhoneFormatter } from "../../../../shared/utils/phone-formatter.service";

@Injectable({
  providedIn: 'root'
})
export class CreateScheduleSlotService {
  private scheduleSlotService = inject(ScheduleSlotService);
  private studentManagementService = inject(StudentManagementService);

  public createScheduleSlot(form: NgForm, selectedStudent?: StudentResponseDto | null): Observable<ScheduleSlotResponseDto> {
    if (selectedStudent) {
      return this.executeSlotCreation(form, selectedStudent.id);
    }

    const { studentName, studentPhoneNumber } = form.value;
    const cleanPhone = PhoneFormatter.formatPhoneNumber(studentPhoneNumber);

    if (cleanPhone.length < 10) {
      alert('Номер телефону занадто короткий! Має бути мінімум 10 цифр.');
      return EMPTY;
    }

    const studentRequestDto: StudentRequestDto = {
      name: studentName,
      phoneNumber: cleanPhone
    };

    return this.verifyStudentBeforeCreation(form, studentRequestDto);
  }

  private verifyStudentBeforeCreation(form: NgForm, studentRequestDto: StudentRequestDto): Observable<ScheduleSlotResponseDto> {
    return this.studentManagementService.verifyStudent(studentRequestDto).pipe(
      switchMap(studentResponse => {
        if (studentResponse) {
          return this.executeSlotCreation(form, studentResponse.id);
        }
        else {
          return this.confirmAndCreateStudent(form, studentRequestDto);
        }
      })
    );
  }

  private confirmAndCreateStudent(form: NgForm, student: StudentRequestDto): Observable<ScheduleSlotResponseDto> {
    const message = `Учня з номером ${student.phoneNumber} не знайдено. Створити нову картку для "${student.name}"?`;

    if (confirm(message)) {
      return this.studentManagementService.createStudent(student).pipe(
        switchMap(newStudent => {
          return this.executeSlotCreation(form, newStudent.id);
        }),
        catchError(err => {
          NotificationService.showError('Не вдалося створити учня', err.message);

          return EMPTY;
        })
      );
    }

    return EMPTY;
  }

  private executeSlotCreation(form: NgForm, studentId: number): Observable<ScheduleSlotResponseDto> {
    const slotRequest: ScheduleSlotRequestDto = {
      date: form.value.date,
      timeFrom: form.value.startTime,
      timeTo: form.value.endTime,
      instructorId: form.value.instructorId,
      carId: form.value.carId,
      studentId: studentId,
      description: form.value.description,
      link: form.value.link
    };

    return this.scheduleSlotService.createSlot(slotRequest).pipe(
      tap({
        next: () => {
          NotificationService.showSuccess('Нове заняття створено!');
        },
        error: (err: HttpErrorResponse) => {
          NotificationService.showError('Не вдалося створити заняття', err);
        }
      })
    );
  }
}