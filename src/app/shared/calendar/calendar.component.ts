// calendar.component.ts
import { Component, OnInit, model } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  public selectedDates = model<string[]>([]);

  public calendarDays: (Date | null)[] = [];
  public currentMonth: Date = new Date();

  ngOnInit() {
    this.generateCalendar();
  }

  public generateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const days: (Date | null)[] = [];

    for (let i = 0; i < offset; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

    this.calendarDays = days;
  }

  public toggleDate(date: Date | null) {
    if (!date) return;
    const dateStr = this.formatToISO(date);

    const current = this.selectedDates();
    const index = current.indexOf(dateStr);

    let updated: string[];

    if (index === -1) {
      updated = [...current, dateStr].sort();
    } 
    else {
      updated = current.filter(d => d !== dateStr);
    }

    this.selectedDates.set(updated);
    this.selectedDates().sort();
  }

  public isSelected(date: Date | null): boolean {
    if (!date) return false;
    return this.selectedDates().includes(this.formatToISO(date));
  }

  public changeMonth(delta: number) {
    this.currentMonth = new Date(this.currentMonth.setMonth(this.currentMonth.getMonth() + delta));
    this.generateCalendar();
  }

  private formatToISO(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}