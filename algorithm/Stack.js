class Stack {
  constructor() {
    this.items = [];
  }

  push(value) {
    this.items.push(value);
  }

  pop() {
    return this.items.length ? this.items.pop() : null;
  }

  peek() {
    return this.items.length ? this.items[this.items.length - 1] : null;
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

 const stack = new Stack();

  stack.push(10);
  stack.push(20);
  stack.push(30);

  console.log("초기:", stack.items);
  console.log("pop:", stack.pop());
  console.log("peek:", stack.peek());
  console.log("isEmpty:", stack.isEmpty());