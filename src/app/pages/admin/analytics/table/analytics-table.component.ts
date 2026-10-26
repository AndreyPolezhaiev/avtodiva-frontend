import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { AnalyticsFacadeService } from "../../../../services/analytics/management/facade-analytics.service";

@Component({
  selector: 'app-analytics-table',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './analytics-table.component.html',
  styleUrl: './analytics-table.component.scss'
})
export class AnalyticsTableComponent implements OnInit {
  public facadeAnalyticsService = inject(AnalyticsFacadeService);

  public profit = this.facadeAnalyticsService.profit;

  public isSearching = this.facadeAnalyticsService.isSearching;

  public foundInstructors = this.facadeAnalyticsService.instructors;
  public foundCars = this.facadeAnalyticsService.cars;

  public currentFilters = this.facadeAnalyticsService.currentFilters;

  ngOnInit(): void {
    this.facadeAnalyticsService.refreshProfit();
  }

  public onSearch(form: NgForm): void {
    if (form.invalid) return;

    this.facadeAnalyticsService.searchProfit(form.value);
  }
}
