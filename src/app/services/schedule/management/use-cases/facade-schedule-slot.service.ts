import { inject, Injectable, signal } from "@angular/core";
import { StudentService } from "../../../student/student.service";
import { InstructorService } from "../../../instructor.service";
import { CarService } from "../../../car.service";
import { InstructorResponseDto } from "../../../../models/instructor/instructor.response";
import { CarResponseDto } from "../../../../models/car/car.response";
import { NotificationService } from "../../../notification/notification.service";
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, of, switchMap, tap } from "rxjs";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { StudentResponseDto } from "../../../../models/student/student.response";
import { SearchScheduleSlotService } from "./search-schedule-slot.service";

@Injectable({ providedIn: 'root' })
export class ScheduleSlotFacadeService {
  private studentService = inject(StudentService);
  private instructorService = inject(InstructorService);
  private carService = inject(CarService);
  private searchService = inject(SearchScheduleSlotService);

  #prefillCache = new Map<number, any>();
  readonly #instructors = signal<InstructorResponseDto[]>([]);
  readonly #cars = signal<CarResponseDto[]>([]);
  readonly #searchStudentTerm = signal<string>('');
  readonly #students$ = toObservable(this.#searchStudentTerm).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => term.length <= 2 ? of([]) : this.studentService.searchStudents(term))
  );
  readonly #foundStudents = toSignal(this.#students$, { initialValue: [] as StudentResponseDto[] });

  public getStudentPrefillData(studentId: number): Observable<any> {
    if (this.#prefillCache.has(studentId)) {
      console.log('Student prefill data was taken from cache:', studentId);
      return of(this.#prefillCache.get(studentId));
    }

    return this.searchService.getStudentPrefillData(studentId).pipe(
      tap(data => {
        if (data) {
          this.#prefillCache.set(studentId, data);
        }
      })
    );
  }

  public get instructors() {
    return this.#instructors.asReadonly();
  }

  public get cars() {
    return this.#cars.asReadonly();
  }

  public get foundStudents() {
    return this.#foundStudents;
  }

  public updateSearchStudentTerm(name: string): void {
    this.#searchStudentTerm.set(name);
  }

  public clearSearchStudentTerm(): void {
    this.#searchStudentTerm.set('');
  }

  public loadInitialData() {
    this.instructorService.getAllInstructors().subscribe({
      next: (instructors) => {
        this.#instructors.set(instructors);
      },
      error: (err) => NotificationService.showError('Не вдалося завантажити інструкторів', err)
    });

    this.carService.getAllCars().subscribe({
      next: (cars) => {
        this.#cars.set(cars);
      },
      error: (err) => NotificationService.showError('Не вдалося завантажити машини', err)
    })
  }
}