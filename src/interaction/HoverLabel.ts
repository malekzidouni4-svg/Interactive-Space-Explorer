export class HoverLabel {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement("div");
    this.element.id = "hover-label";
    this.element.className = "hover-label hidden";
    document.body.appendChild(this.element);
  }

  show(name: string, type: string, x: number, y: number): void {
    this.element.innerHTML = `<span class="name">${name}</span> <span class="type">${type}</span>`;
    this.element.style.left = `${x + 12}px`;
    this.element.style.top = `${y + 12}px`;
    this.element.classList.remove("hidden");
  }

  hide(): void {
    this.element.classList.add("hidden");
  }
}
