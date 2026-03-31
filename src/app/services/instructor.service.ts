import { Injectable } from "@angular/core";
import { environment } from "../../environmets/environment";
import { HttpClient } from "@angular/common/http";
import { InstructorRequestDto } from "../models/instructor/instructor.request";
import { Observable } from "rxjs";
import { InstructorResponseDto } from "../models/instructor/instructor.response";
import { InstructorDetailedResponseDto } from "../models/instructor/instructor.detailed";

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  private apiUrl = `${environment.apiBaseUrl}/api/instructors`;

  constructor(private http: HttpClient){};

  public createInstructor(instructor: InstructorRequestDto): Observable<InstructorResponseDto> {
    return this.http.post<InstructorResponseDto>(this.apiUrl, instructor);
  }

  public getAllInstructors(): Observable<InstructorResponseDto[]> {
    return this.http.get<InstructorResponseDto[]>(`${this.apiUrl}/all`);
  }

  public getInstructorById(id: number): Observable<InstructorResponseDto> {
    return this.http.get<InstructorResponseDto>(`${this.apiUrl}/${id}`);
  }

  public getDetailedInstructorById(id: number): Observable<InstructorDetailedResponseDto> {
    return this.http.get<InstructorDetailedResponseDto>(`${this.apiUrl}/${id}/details`)
  }

  public updateInstructor(id: number, instructor: InstructorRequestDto): Observable<InstructorResponseDto> {
    return this.http.put<InstructorResponseDto>(`${this.apiUrl}/${id}`, instructor);
  }

  public deleteInstructorById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}