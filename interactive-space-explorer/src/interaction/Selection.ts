export class Selection {
  private selectedId: string | null = null;
  private hoveredId: string | null = null;

  get selected(): string | null {
    return this.selectedId;
  }

  get hovered(): string | null {
    return this.hoveredId;
  }

  select(id: string | null): void {
    this.selectedId = id;
  }

  hover(id: string | null): void {
    this.hoveredId = id;
  }
}