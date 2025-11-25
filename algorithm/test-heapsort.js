const { heapsort } = require('./sorts');

console.log('=== 힙 정렬 테스트 ===\n');

// 테스트 1: 일반 배열
const arr1 = [64, 34, 25, 12, 22, 11, 90];
console.log('정렬 전:', arr1);
heapsort(arr1);
console.log('정렬 후:', arr1);

// 테스트 2: 이미 정렬된 배열
const arr2 = [1, 2, 3, 4, 5];
console.log('\n정렬 전:', arr2);
heapsort(arr2);
console.log('정렬 후:', arr2);

// 테스트 3: 역순 배열
const arr3 = [5, 4, 3, 2, 1];
console.log('\n정렬 전:', arr3);
heapsort(arr3);
console.log('정렬 후:', arr3);

// 테스트 4: 중복 값이 있는 배열
const arr4 = [3, 7, 3, 1, 7, 2];
console.log('\n정렬 전:', arr4);
heapsort(arr4);
console.log('정렬 후:', arr4);
