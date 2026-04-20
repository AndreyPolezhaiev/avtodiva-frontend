import { SlotSearchParametersDto } from "./schedule-slot.search";

export interface SlotFiltersState extends SlotSearchParametersDto {
  studentName?: string;
}