import { Component } from "@angular/core";
import { AnalyticsTableComponent } from "./table/analytics-table.component";

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [AnalyticsTableComponent],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent {}
