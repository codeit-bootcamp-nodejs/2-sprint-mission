class Queue {
  constructor() {
    this.items = [];
  }

  // 큐 뒤에 값 추가
  enqueue(value) {
    this.items.push(value);
  }

  // 큐 앞에서 값 제거하고 반환
  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift();
  }

  // 큐 앞의 값 확인 (제거 X)
  peek() {
    if (this.isEmpty()) return null;
    return this.items[0];
  }

  // 큐가 비었는지 확인
  isEmpty() {
    return this.items.length === 0;
  }
}


