import { Injectable } from "@angular/core";
import { ScheduleSlotResponseDto } from "../../models/schedule-slot/schedule-slot.response";
import { NotificationService } from "../../services/notification/notification.service";
import { WeekendResponseDto } from "../../models/weekend/weekend.response";
import { StudentResponseDto } from "../../models/student/student.response";
import { DateFormatter } from "./date-formatter.service";

@Injectable({
  providedIn: "root"
})
export class ClipBoardService {
  public static copySlotsInfoUkr(slots: ScheduleSlotResponseDto[]): void {
    if (!slots || slots.length === 0) {
      NotificationService.showError('Список занять пустий');
      return;
    }

    const formattedSlots = slots.map((slot) => {
      const formattedDate = DateFormatter.formatToUkrWithDayOfWeek(slot.date);
      const startTime = slot.startTime ? slot.startTime.slice(0, 5) : '';
      const endTime = slot.endTime ? slot.endTime.slice(0, 5) : '';

      const slotLines = [
        `Дата: ${formattedDate}`,
        `Час: ${startTime} — ${endTime}`,
        `👤: ${slot.instructorDto?.name || 'не вказано'}`,
        `🚗: ${slot.carDto?.name || 'не вказано'}`,
        `Учениця: ${slot.studentDto?.name || 'не вказано'}`,
        `Опис: ${slot?.description || 'не вказано'}`,
        `Посилання: ${slot?.link || 'не вказано'}`
      ];

      return slotLines.join('\n');
    });

    const finalText = formattedSlots.join('\n\n-------------------------\n\n');

    navigator.clipboard.writeText(finalText).catch(err => {
      NotificationService.showError('Помилка копіювання розкладу:', err);
    });
  }

  public static copyWeekendsInfoUkr(weekends: WeekendResponseDto[]): void {
    if (!weekends || weekends.length === 0) {
      NotificationService.showError('Список вихідних пустий');
      return;
    }

    const formattedWeekends = weekends.map((weekend) => {
      const formattedDate = DateFormatter.formatToUkrWithDayOfWeek(weekend.date);

      const weekendLines = [
        `👤: ${weekend.instructorDto?.name || 'не вказано'}`,
        `Дата: ${formattedDate}`,
        `Час: ${weekend.startTime ? weekend.startTime.slice(0, 5) : ''} — ${weekend.endTime ? weekend.endTime.slice(0, 5) : ''}`
      ];

      return weekendLines.join('\n');
    });

    const finalText = formattedWeekends.join('\n\n-------------------------\n\n');

    navigator.clipboard.writeText(finalText).catch(err => {
      NotificationService.showError('Помилка копіювання вихідних:', err);
    });
  }

  public static copyStudentsInfoUkr(students: StudentResponseDto[]): void {
    if (!students || students.length === 0) {
      NotificationService.showError('Список студентів пустий');
      return;
    }

    const formattedStudents = students.map((student) => {
      const studentLines = [
        `👤: ${student.name}`,
        `📞: ${student.phoneNumber}`,
      ];

      return studentLines.join('\n');
    });

    const finalText = formattedStudents.join('\n\n-------------------------\n\n');

    navigator.clipboard.writeText(finalText).catch(err => {
      NotificationService.showError('Помилка копіювання студентів:', err);
    });
  }
}
