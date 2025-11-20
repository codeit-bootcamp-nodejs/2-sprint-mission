// 선택 정렬 (Selection sort)
// 숫자형 배열을 파라미터로 받고, 해당 배열을 수정하도록 구현합니다.

const selectionSort = (arr) => {
	const n = arr.length;
  for (let i = 0 ; i < n; i++) {
		let minIdx = i;
		for (let j = i + 1 ; j < n; j++) {
			if (arr[j] < arr[minIdx]) {
				minIdx = j;
			}
		}
		[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
	}
	return arr;
}
// 삽입 정렬 (Insertion sort)
// 숫자형 배열을 파라미터로 받고, 해당 배열을 수정하도록 구현합니다.

const insertSort = (arr) => {
	const n = arr.length;
	for (let i = 1 ; i < n; i++) {
		let key = arr[i];
		let j = i - 1;
		while (j >= 0 && key < arr[j]) {
			arr[j + 1] = arr[j];
			j -= 1;
		}
		arr[j + 1] = key;
	}
	return arr;
}

// 병합 정렬 (Merge sort)
// 숫자형 배열을 파라미터로 받고, 정렬된 새로운 배열을 리턴하도록 구현합니다.
const mergeSort = (arr) => {
	const n = arr.length;
	if (n <= 1) return arr;
	const mid = Math.floor(n / 2);
	const left = mergeSort(arr.slice(0, mid));
	const right = mergeSort(arr.slice(mid));
	return merge(left, right);
}

const merge = (left, right) => {
	const result = [];
	let i = 0;
	let j = 0;
	while (i < left.length && j < right.length) {
		if (left[i] < right[j]) {
			result.push(left[i]);
			i += 1;
		} else {
			result.push(right[j]);
			j += 1;
		}
	}
	result.push(...left.slice(i));
	result.push(...right.slice(j));
	return result;
}

// 퀵 정렬 (Quick sort)
// 숫자형 배열을 파라미터로 받고, 해당 배열을 수정하도록 구현합니다.
const quickSort = (arr, start = 0, end = undefined) => {
	if (end == undefined) {
		end = arr.length - 1
	}

	if (start < end) {
		const idx = partition(arr, start, end);
		quickSort(arr, start, idx - 1);
		quickSort(arr, idx + 1, end);
	}
	return arr;
}

const partition = (arr, start, end) => {
	const pivot = arr[end];
	let i = start - 1;
	for (let j = start ; j < end ; j++) {
		if (arr[j] < pivot) {
			i += 1;
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
	}
	[arr[i + 1], arr[end]] = [arr[end], arr[i + 1]];
	return i + 1;
}

// 테스트 코드
const list1 = [5, 3, 8, 4, 2];
console.log(`list1: ${list1}`);
selectionSort(list1);
console.log(`selectionSort list1: ${list1}\n`);

const list2 = [2, 7 ,14, 1, 5];
console.log(`list2: ${list2}`)
insertSort(list2);
console.log(`insertSort list2: ${list2}\n`);

const list3 = [9, 55, 2, 5, 13];
console.log(`list3: ${list3}`);
console.log(`mergeSort list3: ${mergeSort(list3)}\n`);

const list4 = [9, 23, 4, 27, 3];
console.log(`list4: ${list4}`);
quickSort(list4);
console.log(`quickSort list4: ${list4}\n`);

// 힙 정렬 (Heap sort)
// 숫자형 배열을 파라미터로 받고, 해당 배열을 수정하도록 구현합니다.
function swap(tree, index1, index2) {
    const temp = tree[index1];
    tree[index1] = tree[index2];
    tree[index2] = temp;
}

function heapify(tree, idx, treeSize) {
    let largest = idx;
    const leftChildIndex = 2 * idx + 1;
    const rightChildIndex = 2 * idx + 2;

    if (leftChildIndex < treeSize && tree[leftChildIndex] > tree[largest]) {
        largest = leftChildIndex;
    }

    if (rightChildIndex < treeSize && tree[rightChildIndex] > tree[largest]) {
        largest = rightChildIndex;
    }

    if (largest !== idx) {
        swap(tree, idx, largest);
        heapify(tree, largest, treeSize);
    }
}

function heapSort(tree) {
    const treeSize = tree.length;

    // 1. 최대 힙(Max Heap) 만들기
    for (let i = Math.floor(treeSize / 2) - 1; i >= 0; i--) {
        heapify(tree, i, treeSize);
    }

    // 2. 힙 정렬 수행
    for (let i = treeSize - 1; i > 0; i--) {
        swap(tree, 0, i);           // 루트(최댓값)를 맨 뒤로 보냄
        heapify(tree, 0, i);        // 줄어든 힙에 대해 다시 heapify
    }
}

// 테스트 실행
const list5 = [6, 1, 4, 7, 10, 3, 8, 5, 1, 5, 7, 4, 2, 1];
console.log(`list5: ${list5}`);
heapSort(list5);
console.log(`heapSort list5: ${list5}`);
// 출력: [1, 1, 1, 2, 3, 4, 4, 5, 5, 6, 7, 7, 8, 10]