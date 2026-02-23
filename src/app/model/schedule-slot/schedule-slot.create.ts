export interface ScheduleSlotRequestDto {
  date: string;
  timeFrom: string;
  timeTo: string;
  description: string;
  instructorId: number; 
  carId: number;
  studentId: number;
  link: string;
  booked: boolean;
}