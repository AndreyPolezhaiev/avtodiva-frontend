import { ScheduleTemplateResponseDto } from "../template/time/schedule-template.response";

export interface InstructorDetailedResponseDto {
  id: number;
  name: string;
  scheduleTemplate: ScheduleTemplateResponseDto;
}