import { Component, computed, OnInit, signal } from "@angular/core";
import { ScheduleSlotService } from "../../../services/schedule-slot.service";
import { ScheduleSlotResponseDto } from "../../../models/schedule-slot/schedule-slot.response";
import { FormsModule, NgForm } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ScheduleSlotRequestDto } from "../../../models/schedule-slot/schedule-slot.create";
import { UpdateScheduleSlotRequestDto } from "../../../models/schedule-slot/schedule-slot.update";
import { HttpErrorResponse } from "@angular/common/http";
import { SlotSearchParametersDto } from "../../../models/schedule-slot/schedule-slot.search";

type SlotModalType = 'ADD' | 'UPDATE' | 'DELETE' | 'SEARCH' | null;

@Component({
  selector: 'app-schedule-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule-slot.component.html',
  styleUrl: './schedule-slot.component.scss'
})
export class ScheduleSlotComponent implements OnInit {
  public slots = signal<ScheduleSlotResponseDto[]>([]);
  public selectedSlot = signal<ScheduleSlotResponseDto | null>(null);
  public activeModal = signal<SlotModalType>(null);
  public searchFilters = signal<SlotSearchParametersDto>({});

  public modalTitle = computed(() => {
    const mode = this.activeModal();
    if (mode === 'ADD') return 'Додати слот';
    if (mode === 'UPDATE' && this.selectedSlot()) return 'Оновити час заняття';
    if (mode === 'DELETE' && this.selectedSlot()) return 'Ви впевнені, що хочете \n видалити цей слот?';
    return null;
  });

  constructor(private scheduleService: ScheduleSlotService) {}

  ngOnInit(): void {
    this.getAllSlots();
  }

  public getAllSlots(): void {
    this.scheduleService.searchSlots(this.searchFilters()).subscribe({
      next: (response) => this.slots.set(response),
      error: (err) => this.handleError('Не вдалося завантажити розклад', err)
    });
  }

  public createSlot(form: NgForm): void {
    if (form.valid) {
      const newSlot: ScheduleSlotRequestDto = {
        date: form.value.date,
        timeFrom: form.value.startTime,
        timeTo: form.value.endTime,
        instructorId: form.value.instructorId
      };

      this.scheduleService.createSlot(newSlot).subscribe({
        next: (slotFromServer) => {
          this.slots.update(current => [...current, slotFromServer]);
          this.closeModal();
          form.reset();
        },
        error: (err) => this.handleError('Помилка при створенні слоту', err)
      });
    }
  }

  public updateSlot(form: NgForm): void {
    const current = this.selectedSlot();
    if (form.valid && current) {
      const updateData: UpdateScheduleSlotRequestDto = {
        date: form.value.date,
        timeFrom: form.value.startTime,
        timeTo: form.value.endTime
      };

      this.scheduleService.updateSlot(current.id, updateData).subscribe({
        next: (updated) => {
          this.slots.update(list => list.map(s => s.id === current.id ? updated : s));
          this.closeModal();
        },
        error: (err) => this.handleError('Не вдалося оновити слот', err)
      });
    }
  }

  public deleteSlot(): void {
    const current = this.selectedSlot();
    if (current) {
      this.scheduleService.deleteSlotById(current.id).subscribe({
        next: () => {
          this.slots.update(list => list.filter(s => s.id !== current.id));
          this.closeModal();
        },
        error: (err) => this.handleError('Не вдалося видалити слот', err)
      });
    }
  }

  // --- Управление модалками ---

  public openModal(type: SlotModalType, slot: ScheduleSlotResponseDto | null = null): void {
    this.activeModal.set(type);
    this.selectedSlot.set(slot);
  }

  public closeModal(): void {
    this.activeModal.set(null);
    this.selectedSlot.set(null);
  }

  private handleError(message: string, error: HttpErrorResponse): void {
    console.error(message, error);
    alert(`${message}. Статус: ${error.status}`);
  }
}