import { TimeSlotDto } from "./time-slot.dto";

export interface ScheduleTemplateResponseDto {
  id: number;
  intervals: TimeSlotDto[];
}