class Stack {
  constructor() {
    this.stack = [];
  }

  // 스택의 맨 위에 값 추가
  push(value) {
    this.stack.push(value);
  }

  // 스택의 맨 위 값을 제거하고 반환
  pop() {
    if (this.isEmpty()) return null;
    return this.stack.pop();
  }

  // 스택의 맨 위 값을 제거하지 않고 반환
  peek() {
    if (this.isEmpty()) return null;
    return this.stack[this.stack.length - 1];
  }

  // 스택이 비어 있는지 확인
  isEmpty() {
    return this.stack.length === 0;
  }
}


const stack = new Stack();

console.log("▶ 초기 상태");
console.log("isEmpty():", stack.isEmpty());
console.log("------------------------------");

console.log("▶ 값 추가 (push)");
stack.push(10);
stack.push(20);
stack.push(30);
console.log("현재 스택:", stack.stack);
console.log("------------------------------");

console.log("▶ peek() : 맨 위 값 확인");
console.log("peek():", stack.peek());
console.log("현재 스택:", stack.stack);
console.log("------------------------------");

console.log("▶ pop() : 값 제거");
console.log("pop():", stack.pop());
console.log("현재 스택:", stack.stack);
console.log("------------------------------");

console.log("▶ pop() 계속");
console.log("pop():", stack.pop());
console.log("현재 스택:", stack.stack);
console.log("------------------------------");

console.log("▶ 마지막 값 제거");
console.log("pop():", stack.pop());
console.log("현재 스택:", stack.stack);
console.log("------------------------------");

console.log("▶ 스택이 비었는가?");
console.log("isEmpty():", stack.isEmpty());
console.log("------------------------------");