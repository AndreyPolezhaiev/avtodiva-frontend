import { InstructorResponseDto } from "../instructor/instructor.response";

export interface WeekendResponseDto {
  id: number;
  day: string;
  timeFrom: string;
  timeTo: string;
  instructor?: InstructorResponseDto;
}