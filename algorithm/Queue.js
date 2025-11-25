// 클래스 이름 : Queue
/**
 * 메서드
 * enqueue(value) : 큐의 맨 뒤에 값을 추가
 * dequeue(value) : 큐의 앞에서 값을 제거하고 그 값을 리턴
 * peek() : 큐의 앞에 있는 값을 제거하지 않고 리턴
 * isEmpty(): 큐가 비어있는지 불린형으로 리턴
 */

class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(value) {
    this.items.push(value);
  }

  dequeue() {
    if (this.isEmpty()) {
      return `Queue is empty`;
    }
    return this.items.shift();
  }

  peek() {
    if (this.isEmpty()) {
      return `Queue is empty`;
    }
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

const queue = new Queue();

console.log(queue.isEmpty());

queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);
console.log(queue.peek());

console.log(queue.dequeue());
console.log(queue.items);

console.log(queue.dequeue());
console.log(queue.items);

console.log(queue.isEmpty());
