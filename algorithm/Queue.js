export class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(value) {
    this.items.push(value);
  }

  dequeue() {
    return this.items.length ? this.items.shift() : null;
  }

  peek() {
    return this.items.length ? this.items[0] : null;
  }

  isEmpty() {
    return this.items.length === 0;
  }
}
