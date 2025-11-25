const Stack = require('./Stack');

const stack = new Stack();

console.log('=== 스택 테스트 ===\n');

console.log('1. 스택이 비어있나?', stack.isEmpty()); // true

console.log('\n2. push: 10, 20, 30');
stack.push(10);
stack.push(20);
stack.push(30);

console.log('\n3. peek (맨 위 확인):');
console.log('맨 위 값:', stack.peek()); // 30

console.log('\n4. pop (맨 위에서 제거):');
console.log('제거된 값:', stack.pop()); // 30

console.log('\n5. peek (다시 확인):');
console.log('맨 위 값:', stack.peek()); // 20

console.log('\n6. 스택이 비어있나?', stack.isEmpty()); // false
