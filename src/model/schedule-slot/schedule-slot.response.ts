import { CarResponseDto } from "../car/car.response";
import { InstructorResponseDto } from "../instructor/instructor.response";
import { StudentResponseDto } from "../student/student.response";

export interface ScheduleSlotResponseDto {
  id: number;
  date: string;
  timeFrom: string;
  timeTo: string;
  description: string;
  instructor?: InstructorResponseDto; 
  car?: CarResponseDto;
  student?: StudentResponseDto;
  link: string;
  booked: boolean;
}