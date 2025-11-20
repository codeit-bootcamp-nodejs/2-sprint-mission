class Queue {
  constructor() {
    this.queue = [];
  }

  enqueue(value) {
    this.queue.push(value);
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.queue.shift();
  }

  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.queue[0];
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}

// ------------------------------
// 사용 예시
// ------------------------------

const q = new Queue();

console.log("▶ 초기 상태");
console.log("isEmpty():", q.isEmpty());
console.log("------------------------------");

console.log("▶ 값 추가 (enqueue)");
q.enqueue(10);
q.enqueue(20);
q.enqueue(30);
console.log("현재 큐:", q.queue);
console.log("------------------------------");

console.log("▶ peek() : 맨 앞 값 확인");
console.log("peek():", q.peek());
console.log("현재 큐:", q.queue);
console.log("------------------------------");

console.log("▶ dequeue() : 값 제거");
console.log("dequeue():", q.dequeue());
console.log("현재 큐:", q.queue);
console.log("------------------------------");

console.log("▶ dequeue() 계속");
console.log("dequeue():", q.dequeue());
console.log("현재 큐:", q.queue);
console.log("------------------------------");

console.log("▶ 마지막 값 제거");
console.log("dequeue():", q.dequeue());
console.log("현재 큐:", q.queue);
console.log("------------------------------");

console.log("▶ 큐가 비었는가?");
console.log("isEmpty():", q.isEmpty());