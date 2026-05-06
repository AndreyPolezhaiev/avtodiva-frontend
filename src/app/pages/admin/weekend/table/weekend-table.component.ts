import { Component, EventEmitter, Inject, inject, Input, Output } from "@angular/core";
import { WeekendFacadeService } from "../../../../services/weekend/management/facade-weekend.service";
import { WeekendManagementService } from "../../../../services/weekend/management/weekend-management.service";
import { FormsModule, NgForm } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgSelectModule } from "@ng-select/ng-select";
import { WeekendResponseDto } from "../../../../models/weekend/weekend.response";

@Component({
  selector: 'app-weekend-table',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './weekend-table.component.html',
  styleUrl: './weekend-table.component.scss'
})
export class WeekendTableComponent {
  public weekendManagementService = inject(WeekendManagementService);
  public facadeWeekendService = inject(WeekendFacadeService);

  public weekends = this.facadeWeekendService.weekends;

  public isSearching = this.facadeWeekendService.isSearching;

  public foundInstructors = this.facadeWeekendService.instructors;

  public currentFilters = this.facadeWeekendService.currentFilters;

  @Input() weekend: WeekendResponseDto | null = null;
  @Output() onUpdate = new EventEmitter<WeekendResponseDto>();
  @Output() onDelete = new EventEmitter<WeekendResponseDto>();

  public onSearch(form: NgForm): void {
    if (form.invalid) return;
    
    this.facadeWeekendService.searchWeekends(form.value);
  }

  public emitUpdate(weekend: WeekendResponseDto): void {
    this.onUpdate.emit(weekend);
  }

  public emitDelete(weekend: WeekendResponseDto): void {
    this.onDelete.emit(weekend);
  }
}