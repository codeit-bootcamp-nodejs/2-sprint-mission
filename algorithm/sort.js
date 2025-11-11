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
console.log(`quickSort list4: ${list4}`);
