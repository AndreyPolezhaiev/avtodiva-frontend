import { CarProfitDto } from "./car-profit";
import { InstructorProfitDto } from "./instructor-profit";

export interface ProfitResponseDto {
  from: string | null;
  to: string | null;
  instructorName: string | null;
  carName: string | null;
  lessonsCount: number;
  totalProfit: number;
  cars: CarProfitDto[];
  instructors: InstructorProfitDto[];
}
