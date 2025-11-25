const BinarySearchTree = require('./BinarySearchTree');

const bst = new BinarySearchTree();

console.log('=== 이진 탐색 트리 테스트 ===\n');

console.log('1. 값 삽입: 50, 30, 70, 20, 40, 60, 80');
bst.insert(50);
bst.insert(30);
bst.insert(70);
bst.insert(20);
bst.insert(40);
bst.insert(60);
bst.insert(80);

console.log('\n2. 값 찾기 (40):');
const found = bst.find(40);
console.log(found ? `찾음: ${found.value}` : '못 찾음');

console.log('\n3. 값 찾기 (100):');
const notFound = bst.find(100);
console.log(notFound ? `찾음: ${notFound.value}` : '못 찾음');

console.log('\n4. 값 삭제 (20):');
bst.remove(20);
console.log('삭제 후 20 찾기:', bst.find(20) ? '있음' : '없음');

console.log('\n5. 값 삭제 (30 - 자식 2개):');
bst.remove(30);
console.log('삭제 후 30 찾기:', bst.find(30) ? '있음' : '없음');
