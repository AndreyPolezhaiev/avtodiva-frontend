export interface UpdateScheduleSlotRequestDto {
  date: string;
  timeFrom: string;
  timeTo: string;
  instructorId: number;
  carId: number;
  studentId: number | null;
  description: string;
  link: string;
  booked: boolean;
}