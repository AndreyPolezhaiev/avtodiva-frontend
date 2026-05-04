import { InstructorResponseDto } from "../instructor/instructor.response";

export interface WeekendResponseDto {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  instructorDto?: InstructorResponseDto;
}