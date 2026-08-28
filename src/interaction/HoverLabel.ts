export class HoverLabel {
  private element: HTMLElement | null = null;
  private nameElem: HTMLElement | null = null;
  private typeElem: HTMLElement | null = null;

  constructor() {
    this.element = document.getElementById("hover-label");
    this.nameElem = document.getElementById("hover-label-name");
    this.typeElem = document.getElementById("hover-label-type");
  }

  show(name: string, type: string, x: number, y: number): void {
    if (!this.element) return;

    if (this.nameElem) this.nameElem.textContent = name;
    if (this.typeElem) {
      const typeMap: Record<string, string> = {
        star: "نجم",
        planet: "كوكب",
        moon: "قمر",
        spacecraft: "مركبة",
        blackhole: "ثقب أسود",
        comet: "مذنب"
      };
      this.typeElem.textContent = typeMap[type] || type;
    }

    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    this.element.classList.remove("hidden");
  }

  hide(): void {
    this.element?.classList.add("hidden");
  }
}