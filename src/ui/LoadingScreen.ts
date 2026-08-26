export class LoadingScreen {
  private element: HTMLElement | null;

  constructor() {
    this.element = document.getElementById("loading-screen");
  }

  hide(): void {
    if (this.element) {
      this.element.classList.add("fade-out");
      setTimeout(() => {
        if (this.element) this.element.style.display = "none";
      }, 800);
    }
  }

  updateProgress(text: string): void {
    const statusElem = document.getElementById("loading-status");
    if (statusElem) statusElem.textContent = text;
  }
}
