class Stack {
  constructor() {
    this.items = [];
  }

  // 스택의 맨 위에 값 추가
  push(value) {
    this.items.push(value);
  }

  // 스택의 맨 위 값을 제거하고 반환
  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }

  // 스택의 맨 위 값 확인 (제거 X)
  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }

  // 스택이 비었는지 확인
  isEmpty() {
    return this.items.length === 0;
  }
}
