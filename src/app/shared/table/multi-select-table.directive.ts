import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appMultiSelectTable]',
  standalone: true,
  exportAs: 'appMultiSelectTable'
})
export class MultiSelectTableDirective<T extends { id: number | string }> {
  @Input('appMultiSelectTable') allItems: T[] = [];
  
  @Output() selectedItemsChange = new EventEmitter<T[]>();

  public selectedIds = new Set<number | string>();
  private chosenItems: T[] = [];

  @HostListener('document:keydown', ['$event'])
  public handleGlobalKeyDown(event: KeyboardEvent): void {
    const isCtrlPressed = event.ctrlKey || event.metaKey;
    const isKeyC = event.code === 'KeyC' || event.key.toLowerCase() === 'c' || event.key.toLowerCase() === 'с';

    if (isCtrlPressed && isKeyC) {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      const selectedText = window.getSelection()?.toString()?.trim();
      if (selectedText && selectedText.length > 0) return;

      if (this.chosenItems.length === 0) return;

      event.preventDefault();
      event.stopPropagation();

      this.selectedItemsChange.emit([...this.chosenItems]);
      this.clearSelection();
    }
  }

  public toggleRow(item: T, event: MouseEvent, force: boolean = false): void {
    if (!force && !event.ctrlKey && !event.metaKey) {
      this.clearSelection();
      return;
    }

    if (this.selectedIds.has(item.id)) {
      this.selectedIds.delete(item.id);
      this.chosenItems = this.chosenItems.filter(i => i.id !== item.id);
    } 
    else {
      this.selectedIds.add(item.id);
      this.chosenItems.push(item);
    }
  }

  public toggleAll(): void {
    if (this.selectedIds.size === this.allItems.length && this.allItems.length > 0) {
      this.clearSelection();
    } 
    else {
      this.selectedIds.clear();
      this.chosenItems = [...this.allItems];
      this.chosenItems.forEach(item => this.selectedIds.add(item.id));
    }
  }

  public clearSelection(): void {
    this.selectedIds.clear();
    this.chosenItems = [];
  }
}