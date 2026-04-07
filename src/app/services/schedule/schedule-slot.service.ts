import { Injectable } from "@angular/core";
import { environment } from "../../../environmets/environment";
import { HttpClient } from "@angular/common/http";
import { ScheduleSlotRequestDto } from "../../models/schedule-slot/schedule-slot.create";
import { Observable } from "rxjs";
import { ScheduleSlotResponseDto } from "../../models/schedule-slot/schedule-slot.response";
import { SlotSearchParametersDto } from "../../models/schedule-slot/schedule-slot.search";
import { UpdateScheduleSlotRequestDto } from "../../models/schedule-slot/schedule-slot.update";

@Injectable({
  providedIn: 'root',
})
export class ScheduleSlotService {
  private apiUrl = `${environment.apiBaseUrl}/api/schedule`;

  constructor(private http: HttpClient) {}

  public createSlot(slot: ScheduleSlotRequestDto): Observable<ScheduleSlotResponseDto> {
    return this.http.post<ScheduleSlotResponseDto>(this.apiUrl, slot);
  }

  public searchSlots(searchDto: SlotSearchParametersDto): Observable<ScheduleSlotResponseDto[]> {
    return this.http.get<ScheduleSlotResponseDto[]>(`${this.apiUrl}/search`, {
      params: {...searchDto} as any
    });
  }

  public getSlotById(id: number): Observable<ScheduleSlotResponseDto> {
    return this.http.get<ScheduleSlotResponseDto>(`${this.apiUrl}/${id}`);
  }

  public findLastBookedByStudentId(studentId: number): Observable<ScheduleSlotResponseDto> {
    return this.http.get<ScheduleSlotResponseDto>(`${this.apiUrl}/last-booked?studentId=${studentId}`);
  }

  public updateSlot(id: number, slot: UpdateScheduleSlotRequestDto): Observable<ScheduleSlotResponseDto> {
    return this.http.put<ScheduleSlotResponseDto>(`${this.apiUrl}/${id}`, slot);
  }

  public deleteSlotById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}