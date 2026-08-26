type SelectionCallback = (id: string | null) => void;

export class Selection {
  private selectedId: string | null = null;
  private hoveredId: string | null = null;
  private listeners: SelectionCallback[] = [];

  get selected(): string | null {
    return this.selectedId;
  }

  get hovered(): string | null {
    return this.hoveredId;
  }

  onSelectionChange(callback: SelectionCallback): void {
    this.listeners.push(callback);
  }

  select(id: string | null): void {
    if (this.selectedId !== id) {
      this.selectedId = id;
      this.listeners.forEach((cb) => cb(id));
    }
  }

  hover(id: string | null): void {
    this.hoveredId = id;
  }
}