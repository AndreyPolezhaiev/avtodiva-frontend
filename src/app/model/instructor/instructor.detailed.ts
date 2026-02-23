import { ScheduleSlotResponseDto } from "../schedule-slot/schedule-slot.response";
import { WeekendResponseDto } from "../weekend/weekend.response";

export interface InstructorDetailedResponseDto {
  id: number;
  name: string;
  weekends?: WeekendResponseDto[];
  scheduleSlots?: ScheduleSlotResponseDto[]; 
}