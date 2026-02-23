import { Injectable } from "@angular/core";
import { environment } from "../../environmets/environment";
import { HttpClient } from "@angular/common/http";
import { StudentRequestDto } from "../model/student/student.request";
import { Observable } from "rxjs";
import { StudentResponseDto } from "../model/student/student.response";
import { UpdateStudentRequestDto } from "../model/student/student.update";

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = `${environment.apiBaseUrl}/api/students`;

  constructor(private http: HttpClient){}

  public createStudent(student: StudentRequestDto): Observable<StudentResponseDto> {
    return this.http.post<StudentResponseDto>(this.apiUrl, student);
  }

  public getAllStudents(): Observable<StudentResponseDto[]> {
    return this.http.get<StudentResponseDto[]>(`${this.apiUrl}/all`);
  }

  public getStudentById(id: number): Observable<StudentResponseDto> {
    return this.http.get<StudentResponseDto>(`${this.apiUrl}/${id}`);
  }

  public updateStudent(id: number, student: UpdateStudentRequestDto): Observable<StudentResponseDto> {
    return this.http.put<StudentResponseDto>(`${this.apiUrl}/${id}`, student);
  }

  public deleteStudentById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}