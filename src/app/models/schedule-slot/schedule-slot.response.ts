import { CarResponseDto } from "../car/car.response";
import { InstructorResponseDto } from "../instructor/instructor.response";
import { StudentResponseDto } from "../student/student.response";

export interface ScheduleSlotResponseDto {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  instructorDto?: InstructorResponseDto; 
  carDto?: CarResponseDto;
  studentDto?: StudentResponseDto;
  link: string;
  booked: boolean;
}