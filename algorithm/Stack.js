// 클래스 이름: Stack
/**
 * 메서드
 * push(value) : 스택의 맨 위에 값을 추가
 * pop() : 스택의 맨 위 값을 제거하고 그 값을 리턴
 * peek() : 스택의 맨 위 값을 제거하지 않고 그 값을 리턴
 * isEmpty() : 스택이 비어 있는지 불린형으로 리턴
 */

class Stack {
  constructor() {
    this.items = [];
  }

  push(value) {
    this.items.push(value);
  }

  pop() {
    if (this.isEmpty()) {
      return `Stack is empty`;
    }
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) {
      return `Stack is empty`;
    }
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  printStack() {
    let str = "";
    for (let i = 0; i < this.items.length; i++) {
      str += this.items[i] + " ";
    }
    return str.trim();
  }
}

const stack = new Stack();
stack.push(10);
stack.push(20);
stack.push(30);

console.log(`스택 요소`, stack.printStack());
console.log(`최상단 요소(peek):`, stack.peek());
console.log(`pop 연산:`, stack.pop());
console.log(`pop 후 스택 요소:`, stack.printStack());
console.log(`스택이 비어 있습니까?:`, stack.isEmpty());
