import { inject, Injectable } from "@angular/core";
import { StudentManagementService } from "../../../student/student-management.service";
import { ScheduleSlotService } from "../../schedule-slot.service";
import { ScheduleSlotResponseDto } from "../../../../models/schedule-slot/schedule-slot.response";
import { catchError, EMPTY, Observable, switchMap, tap } from "rxjs";
import { StudentResponseDto } from "../../../../models/student/student.response";
import { NgForm } from "@angular/forms";
import { PhoneFormatter } from "../../../../shared/utils/phone-formatter.service";
import { StudentRequestDto } from "../../../../models/student/student.request";
import { NotificationService } from "../../../notification/notification.service";
import { HttpErrorResponse } from "@angular/common/http";
import { UpdateScheduleSlotRequestDto } from "../../../../models/schedule-slot/schedule-slot.update";

@Injectable({
  providedIn: 'root'
})
export class UpdateScheduleSlotService {
  private scheduleSlotService = inject(ScheduleSlotService);
  private studentManagementService = inject(StudentManagementService);

  public updateScheduleSlot(form: NgForm, slotId: number, selectedStudent?: StudentResponseDto | null): Observable<ScheduleSlotResponseDto> {
    if (selectedStudent) {
      return this.executeSlotUpdate(form, slotId, selectedStudent.id);
    }

    const { studentName, studentPhoneNumber } = form.value;

    if (!studentName && !studentPhoneNumber) {
      return this.executeSlotUpdate(form, slotId, null); 
    }

    const cleanPhone = PhoneFormatter.formatPhoneNumber(studentPhoneNumber);

    if (cleanPhone.length < 10) {
      alert('Номер телефону занадто короткий! Має бути мінімум 10 цифр.');
      return EMPTY;
    }

    const studentRequestDto: StudentRequestDto = {
      name: studentName,
      phoneNumber: cleanPhone
    };

    return this.verifyStudentBeforeCreation(form, slotId, studentRequestDto);
  }

  private verifyStudentBeforeCreation(form: NgForm, slotId: number, studentRequestDto: StudentRequestDto): Observable<ScheduleSlotResponseDto> {
    return this.studentManagementService.verifyStudent(studentRequestDto).pipe(
      switchMap(studentResponse => {
        if (studentResponse) {
          return this.executeSlotUpdate(form, slotId, studentResponse.id);
        }
        else {
          return this.confirmAndCreateStudent(form, slotId, studentRequestDto);
        }
      })
    );
  }

  private confirmAndCreateStudent(form: NgForm, slotId: number, student: StudentRequestDto): Observable<ScheduleSlotResponseDto> {
    const message = `Учня з номером ${student.phoneNumber} не знайдено. Створити нову картку для "${student.name}"?`;

    if (confirm(message)) {
      return this.studentManagementService.createStudent(student).pipe(
        switchMap(newStudent => {
          return this.executeSlotUpdate(form, slotId, newStudent.id);
        }),
        catchError(err => {
          NotificationService.showError('Не вдалося створити учня', err.message);

          return EMPTY;
        })
      );
    }

    return EMPTY;
  }

  private executeSlotUpdate(form: NgForm, slotId: number, studentId: number | null): Observable<ScheduleSlotResponseDto> {
    const slotRequest: UpdateScheduleSlotRequestDto = {
      date: form.value.date,
      timeFrom: form.value.startTime,
      timeTo: form.value.endTime,
      instructorId: form.value.instructorId,
      carId: form.value.carId,
      studentId: studentId,
      description: form.value.description,
      link: form.value.link,
      booked: form.value.booked
    };

    console.log(slotRequest);

    return this.scheduleSlotService.updateSlot(slotId, slotRequest).pipe(
      tap({
        next: () => {
          NotificationService.showSuccess('Заняття оновлено!');
        },
        error: (err: HttpErrorResponse) => {
          NotificationService.showError('Не вдалося оновити заняття', err);
        }
      })
    );
  }
}