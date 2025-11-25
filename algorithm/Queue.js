class Queue {
  constructor() {
    this.items = [];
    this.headIndex = 0;
  }

  // 큐의 맨 뒤에 값 추가
  enqueue(value) {
    this.items.push(value);
  }

  // 큐의 앞에서 값을 제거하고 그 값을 리턴
  dequeue() {
    if (this.isEmpty()) {
      return null; // 비어있으면 null 리턴 (테스트 환경에 맞게 조정 가능)
    }

    const value = this.items[this.headIndex];
    this.headIndex += 1;

    // 메모리 누적 방지: 일정 이상 밀렸으면 배열 정리
    if (this.headIndex > 50 && this.headIndex * 2 > this.items.length) {
      this.items = this.items.slice(this.headIndex);
      this.headIndex = 0;
    }

    return value;
  }

  // 큐의 앞에 있는 값을 제거하지 않고 리턴
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.headIndex];
  }

  // 큐가 비어 있는지 확인
  isEmpty() {
    return this.headIndex >= this.items.length;
  }
}

// 테스트 코드
const queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
console.log(queue.dequeue());
console.log(queue.peek());
console.log(queue.isEmpty());
console.log(queue.dequeue());
console.log(queue.isEmpty());
