//  선택정렬
function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }
}

const nums1 = [3, 1, 2];
selectionSort(nums1);
console.log(nums1); // [1, 2, 3]

// 삽입정렬

function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let current = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
  }
}

const nums2 = [5, 2, 4, 6, 1, 3];
insertionSort(nums2);
console.log(nums2); // [1, 2, 3, 4, 5, 6]

// 병합정렬
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}
const nums3 = [3, 1, 4, 1, 5];
const sorted = mergeSort(nums3);
console.log(sorted); // [1, 1, 3, 4, 5]


// 퀵 정렬

function quickSort(arr, start = 0, end = arr.length - 1) {
  if (start >= end) return;

  const pivotIndex = partition(arr, start, end);
  quickSort(arr, start, pivotIndex - 1);
  quickSort(arr, pivotIndex + 1, end);
}

function partition(arr, start, end) {
  const pivot = arr[end];
  let i = start;

  for (let j = start; j < end; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }

  [arr[i], arr[end]] = [arr[end], arr[i]];
  return i;
}
const nums4 = [9, 3, 7, 1, 4];
quickSort(nums4);
console.log(nums4); // [1, 3, 4, 7, 9]

// 힙 정렬

function swap(tree, index_1, index_2) {
  const temp = tree[index_1];
  tree[index_1] = tree[index_2];
  tree[index_2] = temp;
}

function heapify(tree, index, treeSize) {
  const left = index * 2;
  const right = index * 2 + 1;

  let largest = index;

  // 왼쪽 자식 비교
  if (left < treeSize && tree[left] > tree[largest]) {
    largest = left;
  }

  // 오른쪽 자식 비교
  if (right < treeSize && tree[right] > tree[largest]) {
    largest = right;
  }

  // 부모보다 큰 자식이 있으면 교환
  if (largest !== index) {
    swap(tree, index, largest);
    heapify(tree, largest, treeSize);
  }
}

function heapsort(tree) {
  const n = tree.length;

  // 1. Max-Heap 만들기
  for (let i = Math.floor((n - 1) / 2); i >= 1; i--) {
    heapify(tree, i, n);
  }

  // 2. 힙 정렬
  for (let end = n - 1; end > 1; end--) {
    swap(tree, 1, end);
    heapify(tree, 1, end);
  }

  return tree;
}
