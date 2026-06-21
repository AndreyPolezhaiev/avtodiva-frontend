import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment.prod";
import { Observable } from "rxjs";
import { SlotGenerationRequestDto } from "../../../models/schedule-slot/generation/slot-generation.request";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ScheduleSlotGeneratorService {
  private apiUrl = `${environment.apiBaseUrl}/slot-generator`;

  constructor(private http: HttpClient) {}

  public generateSlots(requestDto: SlotGenerationRequestDto): Observable<string> {
    return this.http.post(`${this.apiUrl}/generate`, requestDto, {
      responseType: 'text'
    });
  }
}
