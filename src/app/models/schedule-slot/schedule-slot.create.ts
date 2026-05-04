export interface ScheduleSlotRequestDto {
  date: string;
  startTime: string;
  endTime: string;
  instructorId: number; 
  carId: number;
  studentId: number;
  description?: string;
  link?: string;
}