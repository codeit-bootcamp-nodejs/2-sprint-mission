class Stack {
  constructor() {
    this.items = [];
  }

  // 스택의 맨 위에 값 추가
  push(value) {
    this.items.push(value);
  }

  // 스택의 맨 위 값을 제거하고 그 값을 리턴
  pop() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.pop();
  }

  // 스택의 맨 위 값을 제거하지 않고 리턴
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1];
  }

  // 스택이 비어 있는지 확인
  isEmpty() {
    return this.items.length === 0;
  }
}

// 테스트 코드
const stack = new Stack();
stack.push(1);
stack.push(2);
console.log(stack.pop());
console.log(stack.peek());
console.log(stack.isEmpty());
console.log(stack.pop());
console.log(stack.isEmpty());
