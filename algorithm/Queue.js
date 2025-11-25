class Queue {
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

const queue = new Queue();

  queue.enqueue(1);
  queue.enqueue(2);
  queue.enqueue(3);

  console.log("초기:", queue.items);
  console.log("dequeue:", queue.dequeue());
  console.log("peek:", queue.peek());
  console.log("isEmpty:", queue.isEmpty());