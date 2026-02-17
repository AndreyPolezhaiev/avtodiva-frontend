import { ScheduleSlot } from "./schedule-slot.model";

export interface Car {
  id: number,
  name: string,
  slots: ScheduleSlot[]
}