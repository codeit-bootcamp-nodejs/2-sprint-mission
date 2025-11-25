const Queue = require('./Queue');

const queue = new Queue();

console.log('=== 큐 테스트 ===\n');

console.log('1. 큐가 비어있나?', queue.isEmpty()); // true

console.log('\n2. enqueue: 10, 20, 30');
queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);
queue.print();

console.log('\n3. peek (앞 확인):');
console.log('앞 값:', queue.peek()); // 10

console.log('\n4. dequeue (앞에서 제거):');
console.log('제거된 값:', queue.dequeue()); // 10
queue.print();

console.log('\n5. 큐가 비어있나?', queue.isEmpty()); // false
