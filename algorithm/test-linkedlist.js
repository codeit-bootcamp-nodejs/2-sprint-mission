const LinkedList = require('./LinkedList');

const list = new LinkedList();

console.log('=== 링크드 리스트 테스트 ===\n');

// 노드 추가
console.log('1. 노드 추가: 1, 2, 3');
list.addNode(1);
list.addNode(2);
list.addNode(3);
list.print();

// 노드 찾기
console.log('\n2. 값이 2인 노드 찾기:');
const found = list.findNode(2);
console.log(found ? `찾음: ${found.value}` : '못 찾음');

// 노드 삽입
console.log('\n3. 2 뒤에 2.5 삽입:');
list.insertAfter(2, 2.5);
list.print();

// 노드 삭제
console.log('\n4. 2 뒤의 노드(2.5) 삭제:');
list.removeAfter(2);
list.print();