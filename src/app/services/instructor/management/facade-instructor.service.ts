import { inject, Injectable, signal } from "@angular/core";
import { DataRegistryService } from "../../../shared/registry/data-registry.service";
import { LoadDataType } from "../../../shared/load-type";

@Injectable({
  providedIn: 'root'
})
export class InstructorFacadeService {
  private dataRegistryService = inject(DataRegistryService);
  readonly #instructors = this.dataRegistryService.instructors;

  public get instructors() {
    return this.#instructors;
  }

  public refreshInstructors(): void {
    this.dataRegistryService.refreshData(LoadDataType.INSTRUCTORS);
  }
}