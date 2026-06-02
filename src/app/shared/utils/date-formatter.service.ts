export class DateFormatter {
  public static formatToISODate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public static formatToUkrWithDayOfWeek(dateInput: string | Date | undefined): string {
    if (!dateInput) return 'не вказано';
    
    const d = new Date(dateInput);
    
    const weekdayFormatter = new Intl.DateTimeFormat('uk-UA', { weekday: 'short' });
    const weekdayStr = weekdayFormatter.format(d);
    const capitalizedWeekday = weekdayStr.charAt(0).toUpperCase() + weekdayStr.slice(1);

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${capitalizedWeekday}, ${day}.${month}.${year}`;
  }
}