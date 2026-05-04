export interface UpdateScheduleSlotRequestDto {
  date: string;
  startTime: string;
  endTime: string;
  instructorId: number;
  carId: number;
  studentId: number | null;
  description: string;
  link: string;
  booked: boolean;
}