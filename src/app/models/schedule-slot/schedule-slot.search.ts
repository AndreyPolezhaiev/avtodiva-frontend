export interface SlotSearchParametersDto {
  instructorIds?: number[];
  carIds?: number[];
  studentId?: number | null;
  dateFrom: string;
  dateTo: string;
  booked?: boolean | null;
}