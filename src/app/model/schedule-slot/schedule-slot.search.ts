export interface SlotSearchParametersDto {
  instructorIds?: number[]; 
  carIds?: number[];
  studentId?: number;
  dateFrom: string;
  dateTo: string;
  booked: boolean;
}