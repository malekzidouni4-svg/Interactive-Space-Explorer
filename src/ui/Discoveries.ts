export class Discoveries {
  private discoveredSet = new Set<string>();
  private onUpdateCallbacks: ((count: number, list: string[]) => void)[] = [];

  discover(id: string): boolean {
    if (!this.discoveredSet.has(id)) {
      this.discoveredSet.add(id);
      this.notify();
      return true;
    }
    return false;
  }

  get count(): number {
    return this.discoveredSet.size;
  }

  get discoveredList(): string[] {
    return Array.from(this.discoveredSet);
  }

  onUpdate(cb: (count: number, list: string[]) => void): void {
    this.onUpdateCallbacks.push(cb);
  }

  private notify(): void {
    const list = this.discoveredList;
    this.onUpdateCallbacks.forEach((cb) => cb(this.count, list));
  }
}
