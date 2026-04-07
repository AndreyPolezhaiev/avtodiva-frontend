import { Injectable } from "@angular/core";
import { environment } from "../../../environmets/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { StudentRequestDto } from "../../models/student/student.request";
import { Observable } from "rxjs";
import { StudentResponseDto } from "../../models/student/student.response";
import { UpdateStudentRequestDto } from "../../models/student/student.update";

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

  public searchStudents(name: string): Observable<StudentResponseDto[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<StudentResponseDto[]>(`${this.apiUrl}/search`, {params});
  }

  public searchByPhone(phoneNumber: string): Observable<StudentResponseDto> {
    const params = new HttpParams().set('phoneNumber', phoneNumber);
    return this.http.get<StudentResponseDto>(`${this.apiUrl}/byPhone`, {params});
  }

  public updateStudent(id: number, student: UpdateStudentRequestDto): Observable<StudentResponseDto> {
    return this.http.put<StudentResponseDto>(`${this.apiUrl}/${id}`, student);
  }

  public deleteStudentById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}