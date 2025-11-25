const DoublyLinkedList = require('./DoublyLinkedList');

const list = new DoublyLinkedList();

console.log('=== 이중 링크드 리스트 테스트 ===\n');

console.log('1. tail에 추가: 1, 2, 3');
list.addToTail(1);
list.addToTail(2);
list.addToTail(3);
list.print();

console.log('\n2. head에 추가: 0');
list.addToHead(0);
list.print();

console.log('\n3. 2 뒤에 2.5 삽입:');
list.insertAfter(2, 2.5);
list.print();

console.log('\n4. 값 2.5 삭제:');
list.removeNode(2.5);
list.print();

console.log('\n5. 역순으로 출력:');
list.printReverse();
