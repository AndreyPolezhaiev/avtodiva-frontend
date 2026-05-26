import { TimeSlotDto } from "./time-slot.dto";

export interface ScheduleTemplateRequestDto {
  intervals: TimeSlotDto[];
}