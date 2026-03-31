export interface ScheduleSlotRequestDto {
  date: string;
  timeFrom: string;
  timeTo: string;
  instructorId: number; 
  carId: number;
  studentId: number;
  description: string;
  link: string;
}