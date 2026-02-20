export interface ScheduleSlotResponseDto {
  id: number;
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